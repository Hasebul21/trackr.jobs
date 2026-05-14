// Woven by Toyota (the Toyota mobility/software subsidiary, Tokyo) hosts
// engineering postings on Lever. Lever's public posting API is keyless:
//   https://api.lever.co/v0/postings/woven-by-toyota?mode=json
// Some roles are listed only in Japanese — we keep both but bias toward
// the English postings.

import { httpJson } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

type LeverPosting = {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl: string;
  createdAt?: number;
  categories?: {
    location?: string;
    department?: string;
    team?: string;
    commitment?: string;
    allLocations?: string[];
  };
  tags?: string[];
};

const URL = "https://api.lever.co/v0/postings/woven-by-toyota?mode=json";

export const woven: JobProvider = {
  name: "woven",
  label: "Woven by Toyota",
  reliable: true,
  async fetchJobs() {
    try {
      const data = await httpJson<LeverPosting[]>(URL, { timeoutMs: 20_000 });
      const out: RawJob[] = [];
      for (const j of data) {
        // Filter to roles obviously in Japan — Lever returns global postings
        // and Woven has a Palo Alto office that's not in scope here.
        const loc = j.categories?.location ?? "";
        const all = j.categories?.allLocations ?? [];
        const inJapan =
          /japan|tokyo|nagoya|shimoyamamine|yokohama/i.test(loc) ||
          all.some((l) => /japan|tokyo|nagoya|yokohama/i.test(l));
        if (!inJapan) continue;

        out.push({
          sourceJobId: j.id,
          title: j.text,
          company: "Woven by Toyota",
          location: loc || "Tokyo, Japan",
          tags: [j.categories?.department, j.categories?.team].filter(
            (x): x is string => !!x,
          ),
          applyUrl: j.applyUrl || j.hostedUrl,
          sourceUrl: j.hostedUrl,
          postedAt: j.createdAt ? new Date(j.createdAt) : null,
          visaSupport: true,
          relocation: true,
        });
      }
      plog("woven", `parsed ${out.length} Japan jobs`);
      return out;
    } catch (err) {
      pwarn("woven", "fetch failed:", (err as Error).message);
      return [];
    }
  },
};
