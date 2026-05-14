// Astro (Malaysia's largest pay-TV / digital broadcaster) runs on the
// same Workday CXS endpoint shape as AirAsia. Their tech bench is
// smaller — typical run returns a handful of engineering / data roles
// alongside internships. Visa sponsorship is case-by-case; we mark
// these as relocation-friendly but don't claim visa support.

import { httpJson } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

type WorkdayJobPosting = {
  title: string;
  externalPath: string;
  locationsText?: string;
  postedOn?: string;
  bulletFields?: string[];
};

type WorkdayResp = { total?: number; jobPostings?: WorkdayJobPosting[] };

const API =
  "https://astro.wd3.myworkdayjobs.com/wday/cxs/astro/Astro_Careers/jobs";
const SITE_BASE =
  "https://astro.wd3.myworkdayjobs.com/en-US/Astro_Careers";

export const astro: JobProvider = {
  name: "astro",
  label: "Astro Malaysia",
  reliable: true,
  async fetchJobs() {
    const out: RawJob[] = [];
    try {
      const data = await httpJson<WorkdayResp>(API, {
        method: "POST",
        timeoutMs: 20_000,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliedFacets: {},
          limit: 50,
          offset: 0,
          searchText: "engineer",
        }),
      });
      for (const j of data.jobPostings ?? []) {
        const id = j.bulletFields?.[0] ?? j.externalPath;
        const apply = `${SITE_BASE}${j.externalPath}`;
        out.push({
          sourceJobId: id,
          title: j.title,
          company: "Astro Malaysia",
          location: j.locationsText ?? "Kuala Lumpur, Malaysia",
          tags: [],
          applyUrl: apply,
          sourceUrl: apply,
          postedAt: parseWorkdayPostedOn(j.postedOn),
          relocation: true,
        });
      }
      plog("astro", `parsed ${out.length} jobs`);
      return out;
    } catch (err) {
      pwarn("astro", "fetch failed:", (err as Error).message);
      return out;
    }
  },
};

function parseWorkdayPostedOn(s?: string): Date | null {
  if (!s) return null;
  const m = s.match(/Posted\s+(\d+)\+?\s*Days?\s+Ago/i);
  if (m) return new Date(Date.now() - Number(m[1]) * 86_400_000);
  if (/Posted\s+Yesterday/i.test(s)) return new Date(Date.now() - 86_400_000);
  if (/Posted\s+Today/i.test(s)) return new Date();
  return null;
}
