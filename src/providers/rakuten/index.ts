// Rakuten's careers site (japan-job-en.rakuten.careers) is JS-driven, but
// the search endpoint returns a JSON envelope whose `results` field holds
// rendered HTML cards we can Cheerio-scrape. Each card has:
//   <a href="/job/tokyo/<slug>/<org-id>/<job-id>" data-job-id="...">
//     <h2>title</h2>
//     <span class="job-location">Location: ...</span>
//     <span class="job-category">Category: ...</span>
//   </a>

import * as cheerio from "cheerio";
import { httpJson } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

const SEARCH_URL =
    "https://japan-job-en.rakuten.careers/search-jobs/results" +
    "?ActiveFacetID=&CurrentPage=1&RecordsPerPage=50&Distance=0" +
    "&Keywords=software&SearchType=5";

type RakutenResponse = { results: string };

export const rakuten: JobProvider = {
    name: "rakuten",
    label: "Rakuten",
    reliable: true,
    async fetchJobs() {
        try {
            const data = await httpJson<RakutenResponse>(SEARCH_URL, {
                timeoutMs: 20_000,
            });
            const $ = cheerio.load(data.results ?? "");
            const out: RawJob[] = [];

            $("li a[data-job-id]").each((_, el) => {
                const $a = $(el);
                const id = $a.attr("data-job-id");
                const href = $a.attr("href") ?? "";
                if (!id || !href) return;

                const title = $a.find("h2").first().text().trim();
                if (!title) return;
                const location = $a
                    .find(".job-location")
                    .text()
                    .replace(/^\s*Location:\s*/i, "")
                    .trim();
                const category = $a
                    .find(".job-category")
                    .text()
                    .replace(/^\s*Category:\s*/i, "")
                    .trim();

                const url = href.startsWith("http")
                    ? href
                    : `https://japan-job-en.rakuten.careers${href}`;

                out.push({
                    sourceJobId: id,
                    title,
                    company: "Rakuten",
                    location: location || "Tokyo, Japan",
                    tags: category ? [category] : [],
                    applyUrl: url,
                    sourceUrl: url,
                    // Rakuten Tokyo HQ sponsors visas for engineers; English is the
                    // official internal language so foreign hires are routine.
                    visaSupport: true,
                    relocation: true,
                });
            });

            plog("rakuten", `parsed ${out.length} jobs`);
            return out;
        } catch (err) {
            pwarn("rakuten", "fetch failed:", (err as Error).message);
            return [];
        }
    },
};
