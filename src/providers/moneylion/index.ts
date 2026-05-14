// MoneyLion is part of Gen Digital, whose careers run on Ashby. Ashby has
// a public JSON job-board API:
//   https://api.ashbyhq.com/posting-api/job-board/gen-digital
// The board contains all Gen brands (Norton, Avast, LifeLock, MoneyLion,
// …); we filter to MoneyLion-branded postings only.

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

const URL =
  "https://api.ashbyhq.com/posting-api/job-board/gen-digital?includeCompensation=true";

export const moneylion: JobProvider = {
  name: "moneylion",
  label: "MoneyLion",
  reliable: true,
  async fetchJobs() {
    try {
      const data = await httpJson<AshbyResponse>(URL, { timeoutMs: 20_000 });
      // Ashby returns ~150+ jobs across all Gen brands. MoneyLion roles
      // are tagged either by `- MoneyLion` in the title or by the KL
      // (Malaysia) office where the ML engineering team sits.
      const out: RawJob[] = data.jobs
        .filter(
          (j) =>
            /moneylion/i.test(j.title) ||
            /Kuala Lumpur/i.test(j.location ?? ""),
        )
        .map((j) => ({
          sourceJobId: j.id,
          title: j.title.replace(/\s*-\s*MoneyLion\s*$/i, "").trim(),
          company: "MoneyLion",
          location: j.location || "Remote",
          tags: [],
          applyUrl: j.applyUrl ?? j.jobUrl,
          sourceUrl: j.jobUrl,
          postedAt: j.publishedAt,
          remote: j.isRemote || j.workplaceType === "Remote",
        }));
      plog("moneylion", `parsed ${out.length} jobs`);
      return out;
    } catch (err) {
      pwarn("moneylion", "fetch failed:", (err as Error).message);
      return [];
    }
  },
};
