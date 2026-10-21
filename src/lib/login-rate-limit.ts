const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function loginAllowed(key: string, now = Date.now()): { ok: true } | { ok: false; retryAfterSec: number } {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) return { ok: true };
  if (bucket.count < MAX_FAILURES) return { ok: true };
  return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
}

export function recordLoginFailure(key: string, now = Date.now()): void {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  bucket.count += 1;
}

export function clearLoginFailures(key: string): void {
  buckets.delete(key);
}

export function resetLoginRateLimit(): void {
  buckets.clear();
}
