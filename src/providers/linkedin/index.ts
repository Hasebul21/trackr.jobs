// LinkedIn aggressively blocks scrapers and requires login for most
// surfaces. We hit their public "guest" job search HTML endpoint which
// occasionally returns results without auth. From a serverless IP this
// almost always returns 999/HTML CAPTCHA — degrade to [] silently rather
// than spam the logs.

import * as cheerio from "cheerio";
import { httpGet } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

const SEARCH =
  "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?" +
  new URLSearchParams({
    keywords: "software engineer",
    location: "Japan",
    f_TPR: "r604800", // last week
    start: "0",
  }).toString();

export const linkedin: JobProvider = {
  name: "linkedin",
  label: "LinkedIn (best-effort)",
  reliable: false,
  async fetchJobs() {
    try {
      const html = await httpGet(SEARCH, { timeoutMs: 15_000 });
      const $ = cheerio.load(html);
      const out: RawJob[] = [];
      $("li").each((_, el) => {
        const $li = $(el);
        const $a = $li.find("a[href*='/jobs/view/']").first();
        const href = $a.attr("href") ?? "";
        if (!href) return;
        const id = href.match(/\/jobs\/view\/([^?/]+)/)?.[1];
        if (!id) return;
        const url = href.split("?")[0];
        const title = $li.find("h3").first().text().trim() || $a.text().trim();
        const company = $li.find("h4").first().text().trim() || "Unknown";
        const location = $li
          .find("[class*=location], .job-search-card__location")
          .first()
          .text()
          .trim();
        if (!title) return;
        out.push({
          sourceJobId: id,
          title,
          company,
          location: location || "—",
          applyUrl: url,
          sourceUrl: url,
        });
      });
      plog("linkedin", `parsed ${out.length} jobs`);
      return out;
    } catch (err) {
      // Single-line warn instead of stack — this failing is expected.
      pwarn("linkedin", "guest search blocked or failed:", (err as Error).message);
      return [];
    }
  },
};
