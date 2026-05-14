import type { RawJob } from "@/types/job";

export interface JobProvider {
  /** Stable provider key. Stored in Job.source and used in dedup buckets. */
  readonly name: string;
  /** Human label shown in the UI filter sidebar. */
  readonly label: string;
  /** Whether this provider is known to be reliable. Best-effort providers
   * (anti-bot scrapes) set this to false so the UI can label results
   * "may be incomplete". */
  readonly reliable?: boolean;
  fetchJobs(): Promise<RawJob[]>;
}

/** Tiny logger so all providers report consistently. */
export function plog(provider: string, ...args: unknown[]) {
  console.log(`[provider:${provider}]`, ...args);
}

export function pwarn(provider: string, ...args: unknown[]) {
  console.warn(`[provider:${provider}]`, ...args);
}
