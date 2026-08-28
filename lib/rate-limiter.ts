/**
 * In-Memory Sliding-Window Rate Limiter for Next.js API Routes
 * Protects login, password reset, and proxy endpoints against Brute-Force & DoS attacks.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale IP records every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  /** Maximum number of allowed requests in the time window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 10, windowSeconds: 60 }
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const key = `${identifier}`;

  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetAt) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (existing.count >= options.limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: Math.ceil(existing.resetAt / 1000),
    };
  }

  // Increment counter
  existing.count += 1;
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - existing.count,
    reset: Math.ceil(existing.resetAt / 1000),
  };
}
