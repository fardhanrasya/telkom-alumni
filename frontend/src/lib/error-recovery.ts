import { logger } from "./logger";

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

export enum CircuitState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

/**
 * Exponential backoff retry mechanism
 */
export class RetryManager {
  private defaultOptions: RetryOptions = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitter: true,
  };

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {},
    operationName: string = "operation"
  ): Promise<T> {
    const config = { ...this.defaultOptions, ...options };
    let lastError: Error;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const result = await operation();

        if (attempt > 0) {
          logger.info(`${operationName} succeeded after ${attempt} retries`);
        }

        return result;
      } catch (error) {
        lastError = error as Error;

        if (attempt === config.maxRetries) {
          logger.error(
            `${operationName} failed after ${config.maxRetries} retries`,
            {
              error: lastError.message,
              attempts: attempt + 1,
            }
          );
          break;
        }

        const delay = this.calculateDelay(attempt, config);
        logger.warn(`${operationName} failed, retrying in ${delay}ms`, {
          attempt: attempt + 1,
          maxRetries: config.maxRetries,
          error: lastError.message,
        });

        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private calculateDelay(attempt: number, options: RetryOptions): number {
    let delay =
      options.baseDelay * Math.pow(options.backoffMultiplier, attempt);
    delay = Math.min(delay, options.maxDelay);

    if (options.jitter) {
      // Add random jitter to prevent thundering herd
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.floor(delay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Circuit breaker pattern implementation
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private successCount: number = 0;
  private options: CircuitBreakerOptions;

  constructor(options: Partial<CircuitBreakerOptions> = {}) {
    this.options = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      monitoringPeriod: 10000, // 10 seconds
      ...options,
    };
  }

  async execute<T>(
    operation: () => Promise<T>,
    operationName: string = "operation"
  ): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
        logger.info(
          `Circuit breaker for ${operationName} moved to HALF_OPEN state`
        );
      } else {
        const error = new Error(`Circuit breaker is OPEN for ${operationName}`);
        logger.warn(`Circuit breaker blocked ${operationName}`, {
          state: this.state,
          failureCount: this.failureCount,
          timeSinceLastFailure: Date.now() - this.lastFailureTime,
        });
        throw error;
      }
    }

    try {
      const result = await operation();
      this.onSuccess(operationName);
      return result;
    } catch (error) {
      this.onFailure(operationName, error as Error);
      throw error;
    }
  }

  private shouldAttemptReset(): boolean {
    return Date.now() - this.lastFailureTime >= this.options.resetTimeout;
  }

  private onSuccess(operationName: string): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.CLOSED;
      logger.info(`Circuit breaker for ${operationName} reset to CLOSED state`);
    }

    this.successCount++;
  }

  private onFailure(operationName: string, error: Error): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    logger.error(`Circuit breaker recorded failure for ${operationName}`, {
      error: error.message,
      failureCount: this.failureCount,
      threshold: this.options.failureThreshold,
    });

    if (this.failureCount >= this.options.failureThreshold) {
      this.state = CircuitState.OPEN;
      logger.warn(
        `Circuit breaker for ${operationName} opened due to failures`,
        {
          failureCount: this.failureCount,
          threshold: this.options.failureThreshold,
        }
      );
    }
  }

  getState(): {
    state: CircuitState;
    failureCount: number;
    successCount: number;
  } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
    };
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }
}

/**
 * Fallback mechanism for when primary operations fail
 */
export class FallbackManager {
  async executeWithFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    operationName: string = "operation"
  ): Promise<T> {
    try {
      return await primaryOperation();
    } catch (primaryError) {
      logger.warn(`Primary ${operationName} failed, attempting fallback`, {
        error: (primaryError as Error).message,
      });

      try {
        const result = await fallbackOperation();
        logger.info(`Fallback ${operationName} succeeded`);
        return result;
      } catch (fallbackError) {
        logger.error(`Both primary and fallback ${operationName} failed`, {
          primaryError: (primaryError as Error).message,
          fallbackError: (fallbackError as Error).message,
        });
        throw fallbackError;
      }
    }
  }
}

// Export singleton instances
export const retryManager = new RetryManager();
export const webhookCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000,
  monitoringPeriod: 10000,
});
export const revalidationCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 30000,
  monitoringPeriod: 5000,
});
export const fallbackManager = new FallbackManager();
