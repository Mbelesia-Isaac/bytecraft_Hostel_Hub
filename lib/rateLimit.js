// Simple in-memory rate limiter. Fine for a single-instance server.
// For serverless/multi-instance production, replace with Redis (Upstash).
const attempts = new Map();

export function rateLimit(key, { max = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const record = attempts.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count += 1;
  attempts.set(key, record);

  return {
    allowed: record.count <= max,
    remaining: Math.max(0, max - record.count),
    resetAt: record.resetAt,
  };
}
