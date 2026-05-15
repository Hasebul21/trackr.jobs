// Generic Ashby job-board provider. Ashby's public posting API is keyless:
//   https://api.ashbyhq.com/posting-api/job-board/{slug}
// Some boards (e.g. gen-digital) host multiple brands — use `filter` to
// scope to the one you actually want.

import { httpJson } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

type AshbyJob = {
  id: string;
  title: string;
  location: string;
  jobUrl: string;
  applyUrl?: string;
  publishedAt?: string;
  isRemote?: boolean;
  workplaceType?: string;
  employmentType?: string;
};

type AshbyResponse = { jobs: AshbyJob[] };

type Company = {
  source: string;
  label: string;
  slug: string;
  company: string;
  visaSupport?: boolean;
  relocation?: boolean;
  defaultLocation?: string;
  includeCompensation?: boolean;
  filter?: (j: AshbyJob) => boolean;
  mapTitle?: (title: string) => string;
};

const COMPANIES: Company[] = [
  {
    source: "moneylion",
    label: "MoneyLion",
    slug: "gen-digital",
    company: "MoneyLion",
    includeCompensation: true,
    defaultLocation: "Remote",
    // gen-digital hosts Norton/Avast/LifeLock/MoneyLion. MoneyLion roles
    // are tagged by name in the title or by the KL engineering office.
    filter: (j) =>
      /moneylion/i.test(j.title) || /Kuala Lumpur/i.test(j.location ?? ""),
    mapTitle: (t) => t.replace(/\s*-\s*MoneyLion\s*$/i, "").trim(),
  },
];

function makeProvider(c: Company): JobProvider {
  return {
    name: c.source,
    label: c.label,
    reliable: true,
    async fetchJobs() {
      try {
        const qs = c.includeCompensation ? "?includeCompensation=true" : "";
        const data = await httpJson<AshbyResponse>(
          `https://api.ashbyhq.com/posting-api/job-board/${c.slug}${qs}`,
          { timeoutMs: 20_000 },
        );
        const filter = c.filter ?? (() => true);
        const out: RawJob[] = data.jobs.filter(filter).map((j) => ({
          sourceJobId: j.id,
          title: c.mapTitle ? c.mapTitle(j.title) : j.title,
          company: c.company,
          location: j.location || c.defaultLocation || "Remote",
          tags: [],
          applyUrl: j.applyUrl ?? j.jobUrl,
          sourceUrl: j.jobUrl,
          postedAt: j.publishedAt ? new Date(j.publishedAt) : null,
          remote: j.isRemote || j.workplaceType === "Remote",
          visaSupport: c.visaSupport,
          relocation: c.relocation,
        }));
        plog(c.source, `parsed ${out.length} jobs (ashby)`);
        return out;
      } catch (err) {
        pwarn(c.source, "fetch failed:", (err as Error).message);
        return [];
      }
    },
  };
}

export const ashbyProviders: JobProvider[] = COMPANIES.map(makeProvider);
