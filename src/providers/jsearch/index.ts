// JSearch (Letscrape) via RapidAPI — aggregator that pulls Indeed,
// Glassdoor, ZipRecruiter, and Google for Jobs into one endpoint.
// Complements the linkedin-rapidapi provider, which only sees LinkedIn.
//
// JSearch is per-query (not per-country in the same call), so we iterate
// a small role × country matrix on each cron tick. Defaults stay inside
// the free-tier quota (200 calls/month → ~6/day) and can be widened via
// JSEARCH_ROLES / JSEARCH_COUNTRIES env overrides.

import { httpJson, HttpError } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

const HOST = "jsearch.p.rapidapi.com";
const ENDPOINT = `https://${HOST}/search-v2`;

// Comma-separated lists are accepted in env overrides.
const DEFAULT_ROLES = ["backend engineer", "site reliability engineer"];
// ISO 3166-1 alpha-2, lowercase — JSearch's expected `country` format.
const DEFAULT_COUNTRIES = ["jp", "sg", "my", "th"];

// Defensive — JSearch returns ~30 fields per posting and the shape evolves.
type JsJob = {
  job_id?: string;
  employer_name?: string;
  employer_logo?: string | null;
  job_publisher?: string;
  job_title?: string;
  job_apply_link?: string;
  job_google_link?: string;
  job_description?: string;
  job_is_remote?: boolean;
  job_posted_at_datetime_utc?: string;
  job_city?: string | null;
  job_state?: string | null;
  job_country?: string | null;
  job_min_salary?: number | null;
  job_max_salary?: number | null;
  job_salary_currency?: string | null;
  job_salary_period?: string | null;
};

// search-v2 wraps results in `data.jobs`. (The legacy /search endpoint
// returns `data` as the array directly — don't confuse the two.)
type JsResp = { status?: string; data?: { jobs?: JsJob[] } };

function parseList(env: string | undefined, fallback: string[]): string[] {
  if (!env) return fallback;
  const parsed = env
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parsed.length ? parsed : fallback;
}

function formatLocation(j: JsJob): string {
  const parts = [j.job_city, j.job_state, j.job_country].filter(Boolean);
  return parts.length ? parts.join(", ") : (j.job_country ?? "");
}

export const jsearch: JobProvider = {
  name: "jsearch",
  label: "JSearch (Indeed/Glassdoor/ZR)",
  reliable: true,
  async fetchJobs() {
    const key = process.env.JSEARCH_RAPIDAPI_KEY;
    if (!key) {
      pwarn("jsearch", "JSEARCH_RAPIDAPI_KEY missing — skipping");
      return [];
    }

    const roles = parseList(process.env.JSEARCH_ROLES, DEFAULT_ROLES);
    const countries = parseList(process.env.JSEARCH_COUNTRIES, DEFAULT_COUNTRIES);

    const out: RawJob[] = [];
    const seen = new Set<string>();

    for (const role of roles) {
      for (const country of countries) {
        const params = new URLSearchParams({
          query: `${role} in ${country}`,
          num_pages: "1",
          country,
          date_posted: "3days",
        });
        try {
          const data = await httpJson<JsResp>(`${ENDPOINT}?${params.toString()}`, {
            timeoutMs: 25_000,
            headers: {
              "x-rapidapi-key": key,
              "x-rapidapi-host": HOST,
            },
          });
          for (const j of data.data?.jobs ?? []) {
            const url = j.job_apply_link ?? j.job_google_link;
            if (!url || !j.job_title) continue;
            const sourceJobId = j.job_id ?? url;
            if (seen.has(sourceJobId)) continue;
            seen.add(sourceJobId);

            out.push({
              sourceJobId,
              title: j.job_title.trim(),
              company: (j.employer_name ?? "Unknown").trim(),
              companyLogo: j.employer_logo ?? null,
              location: formatLocation(j),
              description: j.job_description ?? "",
              applyUrl: url,
              sourceUrl: url,
              postedAt: j.job_posted_at_datetime_utc
                ? new Date(j.job_posted_at_datetime_utc)
                : null,
              remote: j.job_is_remote ?? undefined,
            });
          }
        } catch (err) {
          if (err instanceof HttpError) {
            pwarn("jsearch", `${role}/${country} → HTTP ${err.status}`);
          } else {
            pwarn("jsearch", `${role}/${country} → ${(err as Error).message}`);
          }
        }
      }
    }

    plog("jsearch", `parsed ${out.length} jobs (${roles.length}×${countries.length} queries)`);
    return out;
  },
};
