/**
 * Very small in-memory rate limiter.
 *
 * It is intentionally dependency-free. In a multi-instance/serverless
 * deployment the counters are per-instance, which is enough to slow down
 * brute-force attempts on the login endpoints. For a distributed deployment
 * swap this out for a Redis-backed implementation.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Opportunistic cleanup so a long-running process does not leak memory.
function cleanup(now: number) {
  if (store.size < 1000) return;
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

export function rateLimit(key: string, limit = 5, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

/** Resets a key — useful after a successful login so legitimate users are not punished. */
export function resetRateLimit(key: string) {
  store.delete(key);
}

/** Best-effort client IP extraction behind common proxies. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
