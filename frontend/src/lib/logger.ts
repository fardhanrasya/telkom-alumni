export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: string;
  source: string;
}

class Logger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    source: string = "app"
  ): LogEntry {
    return {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      source,
    };
  }

  private output(entry: LogEntry): void {
    const levelNames = ["DEBUG", "INFO", "WARN", "ERROR"];
    const levelName = levelNames[entry.level];

    const baseMessage = `[${entry.timestamp}] ${levelName} [${entry.source}]: ${entry.message}`;

    if (entry.context) {
      const contextStr = JSON.stringify(entry.context, null, 2);
      console.log(`${baseMessage}\nContext: ${contextStr}`);
    } else {
      console.log(baseMessage);
    }
  }

  debug(message: string, context?: LogContext, source: string = "app"): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.output(
        this.formatLogEntry(LogLevel.DEBUG, message, context, source)
      );
    }
  }

  info(message: string, context?: LogContext, source: string = "app"): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.output(this.formatLogEntry(LogLevel.INFO, message, context, source));
    }
  }

  warn(message: string, context?: LogContext, source: string = "app"): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.output(this.formatLogEntry(LogLevel.WARN, message, context, source));
    }
  }

  error(message: string, context?: LogContext, source: string = "app"): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.output(
        this.formatLogEntry(LogLevel.ERROR, message, context, source)
      );
    }
  }

  // Webhook-specific logging methods
  webhookReceived(payload: any, signature: string): void {
    this.info(
      "Webhook received",
      {
        type: payload._type,
        id: payload._id,
        operation: payload.operation,
        hasSignature: !!signature,
      },
      "webhook"
    );
  }

  webhookProcessed(
    payload: any,
    result: { paths: string[]; errors?: string[] }
  ): void {
    this.info(
      "Webhook processed successfully",
      {
        type: payload._type,
        id: payload._id,
        slug: payload.slug?.current,
        category: payload.category,
        revalidatedPaths: result.paths,
        errorCount: result.errors?.length || 0,
      },
      "webhook"
    );
  }

  webhookError(error: string, context?: LogContext): void {
    this.error(
      "Webhook processing failed",
      {
        error,
        ...context,
      },
      "webhook"
    );
  }

  // Revalidation-specific logging methods
  revalidationStarted(paths: string[], trigger: string): void {
    this.info(
      "Revalidation started",
      {
        paths,
        trigger,
        pathCount: paths.length,
      },
      "revalidation"
    );
  }

  revalidationCompleted(
    paths: string[],
    successful: string[],
    errors: string[]
  ): void {
    this.info(
      "Revalidation completed",
      {
        totalPaths: paths.length,
        successfulPaths: successful,
        successCount: successful.length,
        errorCount: errors.length,
        errors: errors.length > 0 ? errors : undefined,
      },
      "revalidation"
    );
  }

  revalidationError(path: string, error: string): void {
    this.error(
      "Revalidation failed for path",
      {
        path,
        error,
      },
      "revalidation"
    );
  }

  // Security-specific logging methods
  securityEvent(event: string, context?: LogContext): void {
    this.warn(
      "Security event detected",
      {
        event,
        ...context,
      },
      "security"
    );
  }

  invalidSignature(signature: string, ip?: string): void {
    this.securityEvent("Invalid webhook signature", {
      signature: signature.substring(0, 20) + "...",
      ip,
    });
  }

  rateLimitExceeded(ip: string, endpoint: string): void {
    this.securityEvent("Rate limit exceeded", {
      ip,
      endpoint,
    });
  }

  // Performance logging methods
  performanceMetric(
    operation: string,
    duration: number,
    context?: LogContext
  ): void {
    this.info(
      "Performance metric",
      {
        operation,
        duration,
        unit: "ms",
        ...context,
      },
      "performance"
    );
  }
}

// Create logger instance with appropriate level for environment
const logLevel =
  process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.INFO;
export const logger = new Logger(logLevel);

// Convenience exports
export const webhookLogger = {
  received: (payload: any, signature: string) =>
    logger.webhookReceived(payload, signature),
  processed: (payload: any, result: any) =>
    logger.webhookProcessed(payload, result),
  error: (error: string, context?: LogContext) =>
    logger.webhookError(error, context),
};

export const revalidationLogger = {
  started: (paths: string[], trigger: string) =>
    logger.revalidationStarted(paths, trigger),
  completed: (paths: string[], successful: string[], errors: string[]) =>
    logger.revalidationCompleted(paths, successful, errors),
  error: (path: string, error: string) => logger.revalidationError(path, error),
};

export const securityLogger = {
  invalidSignature: (signature: string, ip?: string) =>
    logger.invalidSignature(signature, ip),
  rateLimitExceeded: (ip: string, endpoint: string) =>
    logger.rateLimitExceeded(ip, endpoint),
  event: (event: string, context?: LogContext) =>
    logger.securityEvent(event, context),
};

export const performanceLogger = {
  metric: (operation: string, duration: number, context?: LogContext) =>
    logger.performanceMetric(operation, duration, context),
};
