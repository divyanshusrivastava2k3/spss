type RateLimitRecord = {
  count: number;
  resetTime: number;
};

const rateLimitCache = new Map<string, RateLimitRecord>();

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function rateLimit(ip: string, options: RateLimitOptions = { limit: 10, windowMs: 60000 }) {
  const now = Date.now();
  const record = rateLimitCache.get(ip);

  if (!record) {
    rateLimitCache.set(ip, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return { success: true, remaining: options.limit - 1, resetTime: now + options.windowMs };
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + options.windowMs;
    return { success: true, remaining: options.limit - 1, resetTime: record.resetTime };
  }

  if (record.count >= options.limit) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { success: true, remaining: options.limit - record.count, resetTime: record.resetTime };
}
