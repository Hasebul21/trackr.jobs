// Shared fetch wrapper for providers. Sets a realistic UA so we don't
// look like a default Node script, applies a timeout, and surfaces a
// typed error on non-2xx so providers can degrade gracefully.

const DEFAULT_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export type FetchOpts = {
  timeoutMs?: number;
  headers?: Record<string, string>;
  method?: "GET" | "POST";
  body?: string;
};

export class HttpError extends Error {
  constructor(public status: number, public url: string, msg: string) {
    super(msg);
    this.name = "HttpError";
  }
}

export async function httpGet(url: string, opts: FetchOpts = {}): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 15_000);
  try {
    const res = await fetch(url, {
      method: opts.method ?? "GET",
      body: opts.body,
      headers: {
        "User-Agent": DEFAULT_UA,
        Accept: "text/html,application/xhtml+xml,application/json,*/*",
        "Accept-Language": "en-US,en;q=0.9",
        ...opts.headers,
      },
      signal: ctrl.signal,
      // No cache — we're scraping. Caching happens at the DB layer.
      cache: "no-store",
    });
    if (!res.ok) {
      throw new HttpError(res.status, url, `${res.status} ${res.statusText}`);
    }
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

export async function httpJson<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const txt = await httpGet(url, {
    ...opts,
    headers: { Accept: "application/json", ...(opts.headers ?? {}) },
  });
  return JSON.parse(txt) as T;
}
