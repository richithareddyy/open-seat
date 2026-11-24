const WINDOW_MS = 60_000;
const PER_WINDOW = 8;
const MAX_KEYS = 10_000;

const reads = new Map<string, number[]>();

/** Reading words calls the language model; keep it to a few reads per visitor per minute. */
export function allowRead(key: string, now = Date.now(), seen = reads, maxKeys = MAX_KEYS) {
  // Each allowed read moves its key to the end, so the stalest keys are always at the front.
  for (const [k, times] of seen) {
    if (now - times[times.length - 1] < WINDOW_MS) break;
    seen.delete(k);
  }
  const recent = (seen.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_WINDOW) return false;
  recent.push(now);
  seen.delete(key);
  if (seen.size >= maxKeys) seen.delete(seen.keys().next().value!);
  seen.set(key, recent);
  return true;
}
