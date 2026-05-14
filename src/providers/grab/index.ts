// Grab publishes to SmartRecruiters, whose public posting API is keyless:
//   https://api.smartrecruiters.com/v1/companies/Grab/postings
// Each posting carries city/country, function (e.g. "Engineering"), and a
// stable detail-page URL. Paginated 100 at a time via offset.
//
// Grab is SEA-only — HQ Singapore, large engineering office in Petaling
// Jaya (MY), smaller hubs in Bangkok/Jakarta/Manila/HCMC. We keep every
// SEA posting and let the country filter narrow it down.

import { httpJson } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

type SrPosting = {
  id: string;
  name: string;
  uuid: string;
  refNumber?: string;
  releasedDate?: string;
  location?: {
    city?: string;
    country?: string;
    region?: string;
    remote?: boolean;
    fullLocation?: string;
  };
  function?: { id?: string; label?: string };
  department?: { label?: string };
  industry?: { label?: string };
  typeOfEmployment?: { label?: string };
  experienceLevel?: { label?: string };
  ref?: string;
};

type SrPage = { offset: number; limit: number; totalFound: number; content: SrPosting[] };

const BASE = "https://api.smartrecruiters.com/v1/companies/Grab/postings";
const PAGE_LIMIT = 100;
const MAX_PAGES = 5; // hard cap at 500 jobs / run

// Two-letter ISO codes SmartRecruiters returns. Keep this list short on
// purpose: Grab also publishes US/UK ops roles we don't care about.
const SEA_COUNTRIES = new Set(["sg", "my", "th", "id", "ph", "vn"]);

export const grab: JobProvider = {
  name: "grab",
  label: "Grab",
  reliable: true,
  async fetchJobs() {
    const out: RawJob[] = [];
    let offset = 0;
    try {
      for (let page = 0; page < MAX_PAGES; page++) {
        const url = `${BASE}?limit=${PAGE_LIMIT}&offset=${offset}`;
        const data = await httpJson<SrPage>(url, { timeoutMs: 20_000 });
        const items = data.content ?? [];
        for (const j of items) {
          const country = (j.location?.country ?? "").toLowerCase();
          if (!SEA_COUNTRIES.has(country)) continue;

          // SmartRecruiters' detail URL format. The ref API URL is for the
          // raw posting; the human-facing apply page lives on careers.
          const applyUrl = `https://careers.smartrecruiters.com/Grab/${j.id}`;
          const loc =
            j.location?.fullLocation ||
            [j.location?.city, j.location?.country?.toUpperCase()]
              .filter(Boolean)
              .join(", ");

          out.push({
            sourceJobId: j.id,
            title: j.name,
            company: "Grab",
            location: loc || "Singapore",
            tags: [j.function?.label, j.department?.label].filter(
              (x): x is string => !!x,
            ),
            applyUrl,
            sourceUrl: applyUrl,
            postedAt: j.releasedDate ? new Date(j.releasedDate) : null,
            // Grab routinely sponsors visas for engineers moving to SG/MY.
            visaSupport: true,
            relocation: true,
            remote: j.location?.remote === true,
          });
        }
        offset += items.length;
        if (items.length < PAGE_LIMIT || offset >= (data.totalFound ?? offset)) {
          break;
        }
      }
      plog("grab", `parsed ${out.length} SEA jobs`);
      return out;
    } catch (err) {
      pwarn("grab", "fetch failed:", (err as Error).message);
      return out; // return whatever we got before the failure
    }
  },
};
