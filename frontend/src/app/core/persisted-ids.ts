// Read/write helpers for the id sets kept in localStorage. The data was
// originally written by zustand's `persist` middleware, which stores
// {"state": {...}, "version": 0}, so we keep that exact shape to stay
// compatible with what is already in users' browsers.

export type IdSet = Record<string, true>;

export function loadIds(key: string): IdSet {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { state?: { ids?: unknown } };
    const ids = parsed?.state?.ids;
    if (!ids || typeof ids !== 'object' || Array.isArray(ids)) return {};

    const result: IdSet = {};
    for (const [id, value] of Object.entries(ids)) {
      if (value) result[id] = true;
    }
    return result;
  } catch {
    return {};
  }
}

export function saveIds(key: string, ids: IdSet) {
  try {
    localStorage.setItem(key, JSON.stringify({ state: { ids }, version: 0 }));
  } catch {
    // Quota exceeded or storage disabled; keep working in memory.
  }
}
