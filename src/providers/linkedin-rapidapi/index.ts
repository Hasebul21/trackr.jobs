// LinkedIn via RapidAPI (linkedin-job-search-api). Reliable replacement
// for the brittle guest-HTML scrape in ../linkedin — that one almost
// always 999s from serverless IPs. This provider hits the
// `active-jb-24h` endpoint, which returns postings indexed in the last
// 24h. Skips itself with a warning if LINKEDIN_RAPIDAPI_KEY is missing.

import { httpJson, HttpError } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { INCLUDE_TITLE_KEYWORDS } from "@/lib/preferences";
import { type JobProvider, plog, pwarn } from "../types";

const HOST = "linkedin-job-search-api.p.rapidapi.com";
const ENDPOINT = `https://${HOST}/active-jb-24h`;

// Fallback when LINKEDIN_RAPIDAPI_LOCATION isn't set. Mirrors the four
// countries we target everywhere else in the app.
const DEFAULT_LOCATION_FILTER =
  '"Japan" OR "Singapore" OR "Malaysia" OR "Thailand"';

// Build a `title_filter` string from our shared include-keywords list.
// The API supports the OR operator (see RapidAPI playground). Quoting
// each phrase keeps multi-word titles intact.
function buildTitleFilter(): string {
  return INCLUDE_TITLE_KEYWORDS.map((k) => `"${k}"`).join(" OR ");
}

// Defensive type — the API returns ~40 fields per posting and the shape
// has evolved. We only read what we need and treat everything as optional.
type LiJob = {
  id?: string | number;
  title?: string;
  organization?: string;
  organization_logo?: string;
  organization_url?: string;
  url?: string;
  date_posted?: string;
  date_created?: string;
  locations_derived?: string[];
  cities_derived?: string[];
  countries_derived?: string[];
  locations_raw?: unknown;
  salary_raw?: unknown;
  remote_derived?: boolean;
  employment_type?: string[] | string;
  seniority?: string;
  description_text?: string;
  linkedin_org_industry?: string;
};

export const linkedinRapidapi: JobProvider = {
  name: "linkedin-rapidapi",
  label: "LinkedIn",
  reliable: true,
  async fetchJobs() {
    const key = process.env.LINKEDIN_RAPIDAPI_KEY;
    if (!key) {
      pwarn("linkedin-rapidapi", "LINKEDIN_RAPIDAPI_KEY missing — skipping");
      return [];
    }

    const params = new URLSearchParams({
      offset: "0",
      title_filter: buildTitleFilter(),
      location_filter:
        process.env.LINKEDIN_RAPIDAPI_LOCATION ?? DEFAULT_LOCATION_FILTER,
      description_type: "text",
    });

    try {
      const data = await httpJson<LiJob[]>(`${ENDPOINT}?${params.toString()}`, {
        timeoutMs: 25_000,
        headers: {
          "x-rapidapi-key": key,
          "x-rapidapi-host": HOST,
        },
      });

      const out: RawJob[] = [];
      for (const j of data ?? []) {
        const url = j.url;
        if (!url || !j.title) continue;
        const sourceJobId = String(j.id ?? url);
        const location =
          j.locations_derived?.[0] ??
          j.cities_derived?.[0] ??
          j.countries_derived?.[0] ??
          "";
        out.push({
          sourceJobId,
          title: j.title.trim(),
          company: (j.organization ?? "Unknown").trim(),
          companyLogo: j.organization_logo ?? null,
          location,
          description: j.description_text ?? "",
          applyUrl: url,
          sourceUrl: url,
          postedAt: j.date_posted ? new Date(j.date_posted) : null,
          remote: j.remote_derived ?? undefined,
        });
      }

      plog("linkedin-rapidapi", `parsed ${out.length} jobs`);
      return out;
    } catch (err) {
      if (err instanceof HttpError) {
        pwarn("linkedin-rapidapi", `HTTP ${err.status} — ${err.message}`);
      } else {
        pwarn("linkedin-rapidapi", (err as Error).message);
      }
      return [];
    }
  },
};
