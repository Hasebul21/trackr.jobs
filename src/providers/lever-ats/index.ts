// Generic Lever boards provider. Lever's public posting API is keyless:
//   https://api.lever.co/v0/postings/{slug}?mode=json
// Returns an array of postings. Add a new company by appending one entry
// to COMPANIES below.

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

type Company = {
  source: string;
  label: string;
  slug: string;
  company: string;
  visaSupport?: boolean;
  relocation?: boolean;
  defaultLocation?: string;
  filter?: (p: LeverPosting) => boolean;
};

const COMPANIES: Company[] = [
  {
    source: "woven",
    label: "Woven by Toyota",
    slug: "woven-by-toyota",
    company: "Woven by Toyota",
    visaSupport: true,
    relocation: true,
    defaultLocation: "Tokyo, Japan",
    // Lever returns Woven's global postings; keep only Japan offices
    // (Palo Alto is out of scope here).
    filter: (p) => {
      const loc = p.categories?.location ?? "";
      const all = p.categories?.allLocations ?? [];
      return (
        /japan|tokyo|nagoya|shimoyamamine|yokohama/i.test(loc) ||
        all.some((l) => /japan|tokyo|nagoya|yokohama/i.test(l))
      );
    },
  },
];

function makeProvider(c: Company): JobProvider {
  return {
    name: c.source,
    label: c.label,
    reliable: true,
    async fetchJobs() {
      try {
        const data = await httpJson<LeverPosting[]>(
          `https://api.lever.co/v0/postings/${c.slug}?mode=json`,
          { timeoutMs: 20_000 },
        );
        const filter = c.filter ?? (() => true);
        const out: RawJob[] = data.filter(filter).map((p) => ({
          sourceJobId: p.id,
          title: p.text,
          company: c.company,
          location: p.categories?.location || c.defaultLocation || "",
          tags: [p.categories?.department, p.categories?.team].filter(
            (x): x is string => !!x,
          ),
          applyUrl: p.applyUrl || p.hostedUrl,
          sourceUrl: p.hostedUrl,
          postedAt: p.createdAt ? new Date(p.createdAt) : null,
          visaSupport: c.visaSupport,
          relocation: c.relocation,
        }));
        plog(c.source, `parsed ${out.length} jobs (lever)`);
        return out;
      } catch (err) {
        pwarn(c.source, "fetch failed:", (err as Error).message);
        return [];
      }
    },
  };
}

export const leverProviders: JobProvider[] = COMPANIES.map(makeProvider);
