import { revalidatePath, revalidateTag } from "next/cache";
import {
  retryManager,
  revalidationCircuitBreaker,
  fallbackManager,
} from "./error-recovery";
import { revalidationLogger } from "./logger";

export interface RevalidationResult {
  success: boolean;
  paths: string[];
  errors: string[];
  timestamp: number;
}

export interface RevalidationOptions {
  priority?: "high" | "normal" | "low";
  debounceMs?: number;
  maxRetries?: number;
}

class RevalidationManager {
  private queue: Map<
    string,
    { paths: string[]; options: RevalidationOptions; timestamp: number }
  > = new Map();
  private processing = false;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Revalidate gallery-related pages by gallery ID
   */
  async revalidateGalleryPages(
    galleryId?: string,
    slug?: string
  ): Promise<string[]> {
    const paths: string[] = [];

    // Always revalidate main gallery page
    paths.push("/galeri");

    // Revalidate home page (might show featured galleries)
    paths.push("/");

    // If we have a slug, revalidate the specific gallery page
    if (slug) {
      paths.push(`/galeri/${slug}`);
    }

    // Revalidate API routes that might cache gallery data
    paths.push("/api/gallery");

    return this.executeBatchRevalidation(paths);
  }

  /**
   * Revalidate pages by category
   */
  async revalidateByCategory(category: string): Promise<string[]> {
    const paths: string[] = [
      "/galeri", // Main gallery page handles category filtering
      "/", // Home page might show category-specific content
    ];

    return this.executeBatchRevalidation(paths);
  }

  /**
   * Schedule revalidation with debouncing
   */
  scheduleRevalidation(paths: string[], delay: number = 1000): void {
    const key = paths.sort().join(",");

    // Clear existing timer for this path combination
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key)!);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      await this.executeBatchRevalidation(paths);
      this.debounceTimers.delete(key);
    }, delay);

    this.debounceTimers.set(key, timer);
  }

  /**
   * Execute batch revalidation with error handling
   */
  private async executeBatchRevalidation(paths: string[]): Promise<string[]> {
    const successfulPaths: string[] = [];
    const errors: string[] = [];

    revalidationLogger.started(paths, "batch");

    for (const path of paths) {
      try {
        // Use circuit breaker and retry mechanism
        await revalidationCircuitBreaker.execute(async () => {
          await retryManager.executeWithRetry(
            async () => {
              revalidatePath(path);
            },
            { maxRetries: 2, baseDelay: 500 },
            `revalidate-${path}`
          );
        }, `revalidation-${path}`);

        successfulPaths.push(path);
      } catch (error) {
        const errorMessage = `Failed to revalidate ${path}: ${error}`;
        revalidationLogger.error(path, String(error));
        errors.push(errorMessage);
      }
    }

    revalidationLogger.completed(paths, successfulPaths, errors);
    return successfulPaths;
  }

  /**
   * Revalidate with retry logic
   */
  async revalidateWithRetry(
    paths: string[],
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<RevalidationResult> {
    let attempt = 0;
    const errors: string[] = [];
    let successfulPaths: string[] = [];

    while (attempt < maxRetries) {
      try {
        successfulPaths = await this.executeBatchRevalidation(paths);

        if (successfulPaths.length === paths.length) {
          // All paths revalidated successfully
          return {
            success: true,
            paths: successfulPaths,
            errors: [],
            timestamp: Date.now(),
          };
        }
      } catch (error) {
        errors.push(`Attempt ${attempt + 1}: ${error}`);
      }

      attempt++;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }

    return {
      success: false,
      paths: successfulPaths,
      errors,
      timestamp: Date.now(),
    };
  }

  /**
   * Add paths to processing queue
   */
  addToQueue(paths: string[], options: RevalidationOptions = {}): void {
    const key = `${Date.now()}-${Math.random()}`;
    this.queue.set(key, {
      paths,
      options,
      timestamp: Date.now(),
    });

    if (!this.processing) {
      this.processQueue();
    }
  }

  /**
   * Process the revalidation queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.size === 0) {
      return;
    }

    this.processing = true;

    try {
      // Sort by priority and timestamp
      const sortedEntries = Array.from(this.queue.entries()).sort(
        ([, a], [, b]) => {
          const priorityOrder = { high: 0, normal: 1, low: 2 };
          const aPriority = priorityOrder[a.options.priority || "normal"];
          const bPriority = priorityOrder[b.options.priority || "normal"];

          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }

          return a.timestamp - b.timestamp;
        }
      );

      for (const [key, { paths, options }] of sortedEntries) {
        try {
          if (options.debounceMs) {
            await new Promise((resolve) =>
              setTimeout(resolve, options.debounceMs)
            );
          }

          await this.revalidateWithRetry(paths, options.maxRetries || 3);
          this.queue.delete(key);
        } catch (error) {
          console.error(`Queue processing error for ${key}:`, error);
          this.queue.delete(key);
        }
      }
    } finally {
      this.processing = false;

      // Process remaining items if any were added during processing
      if (this.queue.size > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  /**
   * Clear all pending operations
   */
  clearQueue(): void {
    this.queue.clear();
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
  }

  /**
   * Get queue status
   */
  getQueueStatus(): { pending: number; processing: boolean } {
    return {
      pending: this.queue.size,
      processing: this.processing,
    };
  }
}

// Export singleton instance
export const revalidationManager = new RevalidationManager();
