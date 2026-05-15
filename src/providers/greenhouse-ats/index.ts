// Generic Greenhouse boards provider. Greenhouse exposes a public JSON
// API for any board:
//   https://boards-api.greenhouse.io/v1/boards/{slug}/jobs
// No key, no pagination. Add a new company by appending one entry to
// COMPANIES below — `source` is the stable Job.source key (don't rename
// once jobs exist), `slug` is the Greenhouse board path segment.

import { httpJson } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

type GhJob = {
  id: number;
  title: string;
  absolute_url: string;
  location: { name: string };
  company_name?: string;
  first_published?: string;
  updated_at?: string;
};

type GhResponse = { jobs: GhJob[] };

type Company = {
  source: string;
  label: string;
  slug: string;
  company: string;
  visaSupport?: boolean;
  relocation?: boolean;
  defaultLocation?: string;
  filter?: (j: GhJob) => boolean;
};

const COMPANIES: Company[] = [
  {
    source: "paypay",
    label: "PayPay",
    slug: "paypay",
    company: "PayPay",
    // PayPay (Tokyo fintech) routinely sponsors visas for foreign engineers.
    visaSupport: true,
    relocation: true,
    defaultLocation: "Japan",
  },
];

function makeProvider(c: Company): JobProvider {
  return {
    name: c.source,
    label: c.label,
    reliable: true,
    async fetchJobs() {
      try {
        const data = await httpJson<GhResponse>(
          `https://boards-api.greenhouse.io/v1/boards/${c.slug}/jobs`,
          { timeoutMs: 20_000 },
        );
        const filter = c.filter ?? (() => true);
        const out: RawJob[] = data.jobs.filter(filter).map((j) => ({
          sourceJobId: String(j.id),
          title: j.title,
          company: j.company_name ?? c.company,
          location: j.location?.name ?? c.defaultLocation ?? "",
          tags: [],
          applyUrl: j.absolute_url,
          sourceUrl: j.absolute_url,
          postedAt: j.first_published ? new Date(j.first_published) : null,
          visaSupport: c.visaSupport,
          relocation: c.relocation,
        }));
        plog(c.source, `parsed ${out.length} jobs (greenhouse)`);
        return out;
      } catch (err) {
        pwarn(c.source, "fetch failed:", (err as Error).message);
        return [];
      }
    },
  };
}

export const greenhouseProviders: JobProvider[] = COMPANIES.map(makeProvider);
