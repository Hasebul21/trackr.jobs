// Adzuna — official JSON API. Free tier with app_id + app_key.
// Docs: https://developer.adzuna.com/docs/search
//
// We hit the per-country search endpoint for Singapore + Japan with each
// of our keyword groups (Software Engineer / Backend / DevOps), then
// hard-filter to descriptions that mention visa / relocation / etc.

import { httpJson, HttpError } from "@/lib/http";
import type { JobProvider } from "../types";
import { plog, pwarn } from "../types";
import type { RawJob } from "@/types/job";

const COUNTRIES = ["sg", "jp"] as const;
const KEYWORDS = ["software engineer", "backend", "devops"] as const;
const VISA_RE = /\b(visa|relocat|sponsor|permit)/i;

type AdzunaResp = {
    results?: Array<{
        id: string | number;
        title: string;
        company?: { display_name?: string };
        location?: { display_name?: string; area?: string[] };
        redirect_url: string;
        description?: string;
        created?: string;
        salary_min?: number;
        salary_max?: number;
        salary_is_predicted?: string;
        contract_type?: string;
    }>;
};

export const adzuna: JobProvider = {
    name: "adzuna",
    label: "Adzuna",
    reliable: true,
    async fetchJobs() {
        const id = process.env.ADZUNA_APP_ID;
        const key = process.env.ADZUNA_APP_KEY;
        if (!id || !key) {
            pwarn("adzuna", "ADZUNA_APP_ID / ADZUNA_APP_KEY missing — skipping");
            return [];
        }

        const out: RawJob[] = [];
        const seen = new Set<string>();

        for (const country of COUNTRIES) {
            for (const what of KEYWORDS) {
                const url =
                    `https://api.adzuna.com/v1/api/jobs/${country}/search/1` +
                    `?app_id=${encodeURIComponent(id)}` +
                    `&app_key=${encodeURIComponent(key)}` +
                    `&results_per_page=50` +
                    `&what=${encodeURIComponent(what)}` +
                    `&content-type=application/json`;

                try {
                    const data = await httpJson<AdzunaResp>(url, { timeoutMs: 20_000 });
                    const results = data.results ?? [];
                    for (const r of results) {
                        const desc = r.description ?? "";
                        if (!VISA_RE.test(desc)) continue;
                        const sourceJobId = `${country}:${r.id}`;
                        if (seen.has(sourceJobId)) continue;
                        seen.add(sourceJobId);

                        const salary =
                            r.salary_min && r.salary_max
                                ? `${Math.round(r.salary_min)}–${Math.round(r.salary_max)}`
                                : null;

                        out.push({
                            sourceJobId,
                            title: r.title.trim(),
                            company: r.company?.display_name?.trim() ?? "Unknown",
                            location: r.location?.display_name ?? country.toUpperCase(),
                            salary,
                            description: desc,
                            applyUrl: r.redirect_url,
                            sourceUrl: r.redirect_url,
                            postedAt: r.created ? new Date(r.created) : null,
                            visaSupport: true,
                            tags: [country.toUpperCase()],
                        });
                    }
                } catch (err) {
                    if (err instanceof HttpError) {
                        pwarn("adzuna", `${country}/${what} → HTTP ${err.status}`);
                    } else {
                        pwarn("adzuna", `${country}/${what} → ${(err as Error).message}`);
                    }
                }
            }
        }

        plog("adzuna", `kept ${out.length} visa-mentioning jobs`);
        return out;
    },
};
