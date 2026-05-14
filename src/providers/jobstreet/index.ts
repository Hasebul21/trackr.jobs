// JobStreet (SEEK group) exposes a public search endpoint that returns
// JSON. We hit it for Malaysia, Singapore, and Thailand with a
// software-engineering keyword. The endpoint sometimes rate-limits —
// degrade to [].

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

const QUERIES: Array<{ country: string; tld: string; siteKey: string }> = [
  { country: "Malaysia", tld: "my", siteKey: "MY-Main" },
  { country: "Singapore", tld: "sg", siteKey: "SG-Main" },
  { country: "Thailand", tld: "th", siteKey: "TH-Main" },
];

export const jobstreet: JobProvider = {
  name: "jobstreet",
  label: "JobStreet (MY/SG/TH)",
  reliable: false,
  async fetchJobs() {
    const out: RawJob[] = [];
    for (const q of QUERIES) {
      const url =
        `https://${q.tld}.jobstreet.com/api/jobsearch/v5/search?` +
        new URLSearchParams({
          keywords: "software engineer",
          siteKey: q.siteKey,
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
