// AirAsia's career site is fronted by Phenom but the underlying ATS is
// Workday at airasia.wd3.myworkdayjobs.com/Careers. Workday's CXS
// endpoint accepts a POST with a search body and returns paginated JSON
// with title, externalPath, and locationsText.
//
// Most of AirAsia's tech roles sit in Kuala Lumpur (RedQ, KL Sentral)
// with smaller benches in Bengaluru. We keep everything and let the
// country filter narrow.

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
  "https://airasia.wd3.myworkdayjobs.com/wday/cxs/airasia/Careers/jobs";
const SITE_BASE = "https://airasia.wd3.myworkdayjobs.com/en-US/Careers";
const PAGE_LIMIT = 20;
const MAX_PAGES = 5;

export const airasia: JobProvider = {
  name: "airasia",
  label: "AirAsia",
  reliable: true,
  async fetchJobs() {
    const out: RawJob[] = [];
    try {
      for (let p = 0; p < MAX_PAGES; p++) {
        const data = await httpJson<WorkdayResp>(API, {
          method: "POST",
          timeoutMs: 20_000,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appliedFacets: {},
            limit: PAGE_LIMIT,
            offset: p * PAGE_LIMIT,
            searchText: "software",
          }),
        });
        const posts = data.jobPostings ?? [];
        for (const j of posts) {
          const id = j.bulletFields?.[0] ?? j.externalPath;
          const apply = `${SITE_BASE}${j.externalPath}`;
          out.push({
            sourceJobId: id,
            title: j.title,
            company: "AirAsia",
            location: j.locationsText ?? "Kuala Lumpur, Malaysia",
            tags: [],
            applyUrl: apply,
            sourceUrl: apply,
            postedAt: parseWorkdayPostedOn(j.postedOn),
            // AirAsia's Malaysia HQ (RedQ) is open to foreign hires and
            // handles employment-pass sponsorship for senior roles.
            visaSupport: true,
            relocation: true,
          });
        }
        if (posts.length < PAGE_LIMIT) break;
      }
      plog("airasia", `parsed ${out.length} jobs`);
      return out;
    } catch (err) {
      pwarn("airasia", "fetch failed:", (err as Error).message);
      return out;
    }
  },
};

/** Workday's "Posted X Days Ago" string isn't precise but we can
 * roughly map it to a postedAt date for sorting purposes. */
function parseWorkdayPostedOn(s?: string): Date | null {
  if (!s) return null;
  const m = s.match(/Posted\s+(\d+)\+?\s*Days?\s+Ago/i);
  if (m) return new Date(Date.now() - Number(m[1]) * 86_400_000);
  if (/Posted\s+Yesterday/i.test(s)) return new Date(Date.now() - 86_400_000);
  if (/Posted\s+Today/i.test(s)) return new Date();
  return null;
}
