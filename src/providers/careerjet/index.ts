// Careerjet — public Affiliate API. Free; needs an affiliate ID.
// Docs: https://www.careerjet.com/partners/api/
//
// Endpoint accepts http (no https on the public endpoint). Requires
// user_ip + user_agent + url params for tracking — we pass safe dummies.

import { httpJson, HttpError } from "@/lib/http";
import type { JobProvider } from "../types";
import { plog, pwarn } from "../types";
import type { RawJob } from "@/types/job";

const LOCATIONS = ["Thailand", "Malaysia"] as const;
const KEYWORDS = ["software engineer", "backend", "devops"] as const;
const VISA_RE = /\b(visa|relocat|sponsor|permit)/i;

type CjResp = {
    type?: string; // "JOBS" | "LOCATIONS" | "NORESULTS"
    jobs?: Array<{
        title: string;
        company?: string;
        locations?: string;
        url: string;
        site?: string;
        date?: string; // YYYY/MM/DD
        description?: string;
        salary?: string;
    }>;
};

export const careerjet: JobProvider = {
    name: "careerjet",
    label: "Careerjet",
    reliable: true,
    async fetchJobs() {
        const affid = process.env.CAREERJET_AFFILIATE_ID;
        if (!affid) {
            pwarn("careerjet", "CAREERJET_AFFILIATE_ID missing — skipping");
            return [];
        }

        const out: RawJob[] = [];
        const seen = new Set<string>();

        for (const location of LOCATIONS) {
            for (const keywords of KEYWORDS) {
                const url =
                    `http://public.api.careerjet.net/search` +
                    `?affid=${encodeURIComponent(affid)}` +
                    `&keywords=${encodeURIComponent(keywords)}` +
                    `&location=${encodeURIComponent(location)}` +
                    `&pagesize=99` +
                    `&sort=date` +
                    `&user_ip=1.2.3.4` +
                    `&user_agent=${encodeURIComponent("Mozilla/5.0")}` +
                    `&url=${encodeURIComponent("https://example.com")}`;

                try {
                    const data = await httpJson<CjResp>(url, { timeoutMs: 20_000 });
                    if (data.type !== "JOBS" || !data.jobs?.length) continue;
                    for (const j of data.jobs) {
                        const desc = j.description ?? "";
                        if (!VISA_RE.test(desc)) continue;
                        // Careerjet doesn't expose stable IDs — fingerprint from URL.
                        const sourceJobId = j.url;
                        if (seen.has(sourceJobId)) continue;
                        seen.add(sourceJobId);

                        out.push({
                            sourceJobId,
                            title: j.title.trim(),
                            company: (j.company ?? "Unknown").trim(),
                            location: j.locations ?? location,
                            salary: j.salary ?? null,
                            description: desc,
                            applyUrl: j.url,
                            sourceUrl: j.url,
                            postedAt: j.date ? new Date(j.date.replace(/\//g, "-")) : null,
                            visaSupport: true,
                            tags: [location],
                        });
                    }
                } catch (err) {
                    if (err instanceof HttpError) {
                        pwarn("careerjet", `${location}/${keywords} → HTTP ${err.status}`);
                    } else {
                        pwarn("careerjet", `${location}/${keywords} → ${(err as Error).message}`);
                    }
                }
            }
        }

        plog("careerjet", `kept ${out.length} visa-mentioning jobs`);
        return out;
    },
};
