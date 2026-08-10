/**
 * In-Memory Sliding-Window Rate Limiter for Login Protection
 * Limits requests per client IP to mitigate brute force attacks.
 */
interface RateLimitRecord {
  timestamps: number[];
}

class SlidingWindowRateLimiter {
  private requests: Map<string, RateLimitRecord> = new Map();
  private windowMs: number;
  private maxAttempts: number;

  constructor(windowMs: number = 60000, maxAttempts: number = 5) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  public check(identifier: string): {
    success: boolean;
    limit: number;
    remaining: number;
    resetSeconds: number;
  } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.requests.get(identifier);
    if (!record) {
      record = { timestamps: [] };
      this.requests.set(identifier, record);
    }

    // Filter out timestamps outside the active window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= this.maxAttempts) {
      const oldestInWindow = record.timestamps[0];
      const resetSeconds = Math.max(1, Math.ceil((oldestInWindow + this.windowMs - now) / 1000));
      return {
        success: false,
        limit: this.maxAttempts,
        remaining: 0,
        resetSeconds,
      };
    }

    record.timestamps.push(now);

    // Periodic cleanup of stale entries if map gets large
    if (this.requests.size > 1000) {
      this.cleanup(windowStart);
    }

    return {
      success: true,
      limit: this.maxAttempts,
      remaining: this.maxAttempts - record.timestamps.length,
      resetSeconds: Math.ceil(this.windowMs / 1000),
    };
  }

  private cleanup(windowStart: number) {
    this.requests.forEach((record, key) => {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
      if (record.timestamps.length === 0) {
        this.requests.delete(key);
      }
    });
  }
}

// Global instance for login brute force mitigation (5 attempts per minute per IP)
export const loginRateLimiter = new SlidingWindowRateLimiter(60000, 5);
