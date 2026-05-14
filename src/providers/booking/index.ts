// Booking.com publishes through its careers site at jobs.booking.com,
// which is backed by an undocumented but stable JSON API:
//   https://jobs.booking.com/api/jobs?q=<query>&domain=booking.com&limit=N
// Each result includes city/country, slug, description, and a stable
// req_id. Booking is Amsterdam-HQ but has a Singapore office and
// routinely sponsors visas for engineers.

import { httpJson } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

type BookingJob = {
  data: {
    slug: string;
    req_id: string;
    title: string;
    description?: string;
    city?: string;
    country?: string;
    country_code?: string;
    location_name?: string;
    create_date?: string;
    update_date?: string;
  };
};

type BookingResp = { jobs: BookingJob[]; totalCount?: number };

// One request per role bucket because the /api/jobs `q=` is a simple
// keyword match — broader keywords pull in product/UX roles we don't
// want. Three buckets ≈ 90 hits cap.
const QUERIES = ["software engineer", "backend engineer", "site reliability"];

export const booking: JobProvider = {
  name: "booking",
  label: "Booking.com",
  reliable: true,
  async fetchJobs() {
    const out: RawJob[] = [];
    const seen = new Set<string>();
    for (const q of QUERIES) {
      const url =
        "https://jobs.booking.com/api/jobs?" +
        new URLSearchParams({
          q,
          domain: "booking.com",
          limit: "30",
        }).toString();
      try {
        const data = await httpJson<BookingResp>(url, { timeoutMs: 20_000 });
        for (const j of data.jobs ?? []) {
          const d = j.data;
          if (!d?.req_id || seen.has(d.req_id)) continue;
          seen.add(d.req_id);
          const loc = [d.city, d.country].filter(Boolean).join(", ") || "—";
          const apply = `https://jobs.booking.com/careers/job/${d.req_id}`;
          out.push({
            sourceJobId: d.req_id,
            title: d.title,
            company: "Booking.com",
            location: loc,
            description: stripHtml(d.description ?? "").slice(0, 1200),
            applyUrl: apply,
            sourceUrl: apply,
            postedAt: d.create_date ? new Date(d.create_date) : null,
            // Booking publicly states it sponsors work permits for tech
            // hires moving to Amsterdam / SG / other hubs.
            visaSupport: true,
            relocation: true,
          });
        }
        plog("booking", `q="${q}" → ${data.jobs?.length ?? 0}`);
      } catch (err) {
        pwarn("booking", `q="${q}" failed:`, (err as Error).message);
      }
    }
    plog("booking", `total deduped: ${out.length}`);
    return out;
  },
};

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
