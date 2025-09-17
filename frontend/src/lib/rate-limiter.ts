import { securityLogger } from "./logger";

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (identifier: string) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalHits: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
}

/**
 * In-memory rate limiter implementation
 * In production, consider using Redis for distributed rate limiting
 */
export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: Required<RateLimitConfig>;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (id: string) => id,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config,
    };

    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if request is allowed and update counters
   */
  checkLimit(identifier: string): RateLimitResult {
    const key = this.config.keyGenerator(identifier);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    let entry = this.store.get(key);

    // Create new entry if doesn't exist or window has expired
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
        firstRequest: now,
      };
      this.store.set(key, entry);
    }

    // Check if limit exceeded
    const allowed = entry.count < this.config.maxRequests;

    if (allowed) {
      entry.count++;
    }

    return {
      allowed,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      totalHits: entry.count,
    };
  }

  /**
   * Record a request (for cases where you want to count after processing)
   */
  recordRequest(identifier: string, success: boolean = true): void {
    if (
      (success && this.config.skipSuccessfulRequests) ||
      (!success && this.config.skipFailedRequests)
    ) {
      return;
    }

    const key = this.config.keyGenerator(identifier);
    const now = Date.now();

    let entry = this.store.get(key);

    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 1,
        resetTime: now + this.config.windowMs,
        firstRequest: now,
      };
    } else {
      entry.count++;
    }

    this.store.set(key, entry);
  }

  /**
   * Get current status for an identifier
   */
  getStatus(identifier: string): RateLimitResult | null {
    const key = this.config.keyGenerator(identifier);
    const entry = this.store.get(key);

    if (!entry || entry.resetTime <= Date.now()) {
      return null;
    }

    return {
      allowed: entry.count < this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      totalHits: entry.count,
    };
  }

  /**
   * Reset limits for a specific identifier
   */
  reset(identifier: string): void {
    const key = this.config.keyGenerator(identifier);
    this.store.delete(key);
  }

  /**
   * Reset all limits
   */
  resetAll(): void {
    this.store.clear();
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime <= now) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => this.store.delete(key));

    if (expiredKeys.length > 0) {
      console.log(
        `Cleaned up ${expiredKeys.length} expired rate limit entries`
      );
    }
  }

  /**
   * Get statistics about the rate limiter
   */
  getStats(): {
    totalKeys: number;
    activeKeys: number;
    expiredKeys: number;
  } {
    const now = Date.now();
    let activeKeys = 0;
    let expiredKeys = 0;

    for (const entry of this.store.values()) {
      if (entry.resetTime > now) {
        activeKeys++;
      } else {
        expiredKeys++;
      }
    }

    return {
      totalKeys: this.store.size,
      activeKeys,
      expiredKeys,
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

/**
 * Create rate limiter middleware for Next.js API routes
 */
export function createRateLimitMiddleware(config: RateLimitConfig) {
  const limiter = new RateLimiter(config);

  return {
    limiter,
    middleware: (identifier: string) => {
      const result = limiter.checkLimit(identifier);

      if (!result.allowed) {
        securityLogger.rateLimitExceeded(identifier, "webhook");
      }

      return result;
    },
  };
}

// Pre-configured rate limiters for different use cases
export const webhookRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute per IP
  keyGenerator: (ip: string) => `webhook:${ip}`,
});

export const signatureRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 failed signature attempts per minute per IP
  keyGenerator: (ip: string) => `signature:${ip}`,
  skipSuccessfulRequests: true, // Only count failed attempts
});

export const healthCheckRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute per IP
  keyGenerator: (ip: string) => `health:${ip}`,
});
