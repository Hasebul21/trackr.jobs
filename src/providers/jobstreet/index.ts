// JobStreet (SEEK group) exposes a public search endpoint that returns
// JSON. We hit it for Malaysia + Singapore with a software-engineering
// classification. The endpoint sometimes rate-limits — degrade to [].

import { httpJson } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

type JobStreetHit = {
  id: string | number;
  title: string;
  advertiser?: { description?: string };
  locations?: Array<{ label?: string }>;
  salary?: { label?: string };
  teaser?: string;
  listingDate?: string;
};

type JobStreetResp = {
  totalCount?: number;
  data?: JobStreetHit[];
};

const QUERIES: Array<{ site: string; country: string; tld: string }> = [
  { site: "jobstreet-my", country: "Malaysia", tld: "my" },
  { site: "jobstreet-sg", country: "Singapore", tld: "sg" },
];

export const jobstreet: JobProvider = {
  name: "jobstreet",
  label: "JobStreet (MY/SG)",
  reliable: false,
  async fetchJobs() {
    const out: RawJob[] = [];
    for (const q of QUERIES) {
      const url =
        `https://${q.tld}.jobstreet.com/api/jobsearch/v5/search?` +
        new URLSearchParams({
          keywords: "software engineer",
          siteKey: `MY-Main`,
          sourcesystem: "houston",
          pageSize: "30",
        }).toString();
      try {
        const data = await httpJson<JobStreetResp>(url, {
          timeoutMs: 15_000,
          headers: {
            Accept: "application/json",
            Origin: `https://${q.tld}.jobstreet.com`,
            Referer: `https://${q.tld}.jobstreet.com/`,
          },
        });
        const hits = data.data ?? [];
        for (const h of hits) {
          const link = `https://${q.tld}.jobstreet.com/job/${h.id}`;
          out.push({
            sourceJobId: `${q.tld}-${h.id}`,
            title: h.title,
            company: h.advertiser?.description ?? "Unknown",
            location: h.locations?.[0]?.label ?? q.country,
            salary: h.salary?.label ?? null,
            description: h.teaser ?? "",
            applyUrl: link,
            sourceUrl: link,
            postedAt: h.listingDate ? new Date(h.listingDate) : null,
          });
        }
        plog("jobstreet", `${q.country}: ${hits.length} jobs`);
      } catch (err) {
        pwarn("jobstreet", `${q.country} failed:`, (err as Error).message);
      }
    }
    return out;
  },
};
