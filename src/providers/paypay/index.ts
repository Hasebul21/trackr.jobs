// Greenhouse exposes a clean public JSON API for any board:
//   https://boards-api.greenhouse.io/v1/boards/{slug}/jobs
// PayPay's board slug is `paypay`. Returns ~70 jobs with title, location,
// absolute_url, first_published, etc. No HTML parsing needed.

import { httpJson } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

type GhJob = {
    id: number;
    title: string;
    absolute_url: string;
    location: { name: string };
    company_name?: string;
    first_published?: string;
    updated_at?: string;
};

type GhResponse = { jobs: GhJob[] };

export const paypay: JobProvider = {
    name: "paypay",
    label: "PayPay",
    reliable: true,
    async fetchJobs() {
        try {
            const data = await httpJson<GhResponse>(
                "https://boards-api.greenhouse.io/v1/boards/paypay/jobs",
                { timeoutMs: 20_000 },
            );
            const out: RawJob[] = data.jobs.map((j) => ({
                sourceJobId: String(j.id),
                title: j.title,
                company: j.company_name ?? "PayPay",
                location: j.location?.name ?? "Japan",
                tags: [],
                applyUrl: j.absolute_url,
                sourceUrl: j.absolute_url,
                postedAt: j.first_published ? new Date(j.first_published) : null,
                // PayPay (a Tokyo-based fintech) routinely sponsors visas for
                // foreign engineers, so we mark these as visa-friendly by default.
                visaSupport: true,
                relocation: true,
            }));
            plog("paypay", `parsed ${out.length} jobs`);
            return out;
        } catch (err) {
            pwarn("paypay", "fetch failed:", (err as Error).message);
            return [];
        }
    },
};
