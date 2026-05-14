// TheirStack — paid global jobs API. Used as a tech-stack-targeted
// fallback across our four target countries.
// Docs: https://theirstack.com/docs (verify field names against your
// account — TheirStack's payload shape evolves; we read defensively).
//
// Search runs once per keyword, restricted to TH/MY/SG/JP, then
// hard-filters descriptions for visa / relocation / sponsorship /
// permit mentions to match our other providers.

import { httpJson, HttpError } from "@/lib/http";
import type { JobProvider } from "../types";
import { plog, pwarn } from "../types";
import type { RawJob } from "@/types/job";

const COUNTRIES = ["TH", "MY", "SG", "JP"];
const KEYWORDS = ["software engineer", "backend", "devops"];
const VISA_RE = /\b(visa|relocat|sponsor|permit)/i;

type TsJob = {
    id?: string | number;
    job_title?: string;
    company?: string;
    company_object?: { name?: string };
    location?: string;
    short_location?: string;
    url?: string;
    final_url?: string;
    description?: string;
    date_posted?: string;
    remote?: boolean;
};

type TsResp = { data?: TsJob[] };

export const theirstack: JobProvider = {
    name: "theirstack",
    label: "TheirStack",
    reliable: true,
    async fetchJobs() {
        const key = process.env.THEIRSTACK_API_KEY;
        if (!key) {
            pwarn("theirstack", "THEIRSTACK_API_KEY missing — skipping");
            return [];
        }

        const out: RawJob[] = [];
        const seen = new Set<string>();

        for (const keyword of KEYWORDS) {
            try {
                const data = await httpJson<TsResp>(
                    "https://api.theirstack.com/v1/jobs/search",
                    {
                        method: "POST",
                        timeoutMs: 25_000,
                        headers: {
                            Authorization: `Bearer ${key}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            page: 0,
                            limit: 100,
                            job_title_or: [keyword],
                            job_country_code_or: COUNTRIES,
                            posted_at_max_age_days: 14,
                            order_by: [{ field: "date_posted", desc: true }],
                        }),
                    },
                );

                for (const j of data.data ?? []) {
                    const desc = j.description ?? "";
                    if (!VISA_RE.test(desc)) continue;
                    const url = j.final_url ?? j.url;
                    if (!url) continue;
                    const sourceJobId = String(j.id ?? url);
                    if (seen.has(sourceJobId)) continue;
                    seen.add(sourceJobId);

                    out.push({
                        sourceJobId,
                        title: (j.job_title ?? "Unknown").trim(),
                        company: (j.company_object?.name ?? j.company ?? "Unknown").trim(),
                        location: j.short_location ?? j.location ?? "",
                        description: desc,
                        applyUrl: url,
                        sourceUrl: url,
                        postedAt: j.date_posted ? new Date(j.date_posted) : null,
                        remote: j.remote ?? undefined,
                        visaSupport: true,
                    });
                }
            } catch (err) {
                if (err instanceof HttpError) {
                    pwarn("theirstack", `${keyword} → HTTP ${err.status}`);
                } else {
                    pwarn("theirstack", `${keyword} → ${(err as Error).message}`);
                }
            }
        }

        plog("theirstack", `kept ${out.length} visa-mentioning jobs`);
        return out;
    },
};
