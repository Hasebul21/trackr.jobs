import { createHash } from 'node:crypto';

/** Stable hash for deterministic job IDs across runs. */
export function hashId(...parts: string[]): string {
  return createHash('sha1').update(parts.join('|')).digest('hex').slice(0, 16);
}

/** Strip query params and trailing slashes so apply URLs from different
 * sources collapse to the same key. */
export function normalizeUrl(input: string): string {
  try {
    const u = new URL(input);
    u.hash = '';
    u.search = '';
    let s = `${u.protocol}//${u.host}${u.pathname}`;
    if (s.endsWith('/') && u.pathname !== '/') s = s.slice(0, -1);
    return s.toLowerCase();
  } catch {
    return input.trim().toLowerCase();
  }
}

/** Lowercase, strip punctuation, collapse whitespace. Used for fingerprinting. */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Token-Jaccard similarity in [0,1]. Cheap, good enough for dedup. */
export function jaccard(a: string, b: string): number {
  const ta = new Set(normalizeText(a).split(' ').filter(Boolean));
  const tb = new Set(normalizeText(b).split(' ').filter(Boolean));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / (ta.size + tb.size - inter);
}

/** Wait a small random amount to avoid hammering scraped sites. */
export function jitterSleep(min = 200, max = 700): Promise<void> {
  const ms = Math.floor(min + Math.random() * (max - min));
  return new Promise((r) => setTimeout(r, ms));
}
