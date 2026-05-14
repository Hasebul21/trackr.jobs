// TokyoDev publishes job listings as a static HTML page with structured
// markup. We Cheerio-scrape the listing page; each card carries enough
// info (title, company, location, tags) without needing per-job fetches.

import * as cheerio from "cheerio";
import { httpGet } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

const LIST_URL =
  "https://www.tokyodev.com/jobs" +
  "?japanese_requirement%5B%5D=none" +
  "&applicant_location%5B%5D=apply_from_abroad" +
  "&seniority%5B%5D=intermediate" +
  "&seniority%5B%5D=senior" +
  "&english_requirement%5B%5D=basic" +
  "&english_requirement%5B%5D=conversational" +
  "&english_requirement%5B%5D=business";

export const tokyodev: JobProvider = {
  name: "tokyodev",
  label: "TokyoDev",
  reliable: true,
  async fetchJobs() {
    try {
      const html = await httpGet(LIST_URL, { timeoutMs: 20_000 });
      const $ = cheerio.load(html);
      const out: RawJob[] = [];

      // TokyoDev lists each job as an <a> linking to /companies/<slug>/jobs/<job-id>.
      // We grab every anchor that matches that pattern and read sibling text
      // for title/company. Falls back to looser selectors if the layout shifts.
      $('a[href*="/jobs/"]').each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") ?? "";
        if (!/\/companies\/[^/]+\/jobs\/[^/]+/.test(href)) return;

        const url = href.startsWith("http") ? href : `https://www.tokyodev.com${href}`;
        const title =
          $a.find("h2, h3, [class*=title]").first().text().trim() ||
          $a.text().trim().split("\n")[0]?.trim();
        const company =
          $a.find("[class*=company], [class*=Company]").first().text().trim() ||
          $a.closest("article, li, div").find("[class*=company]").first().text().trim();
        const location =
          $a.find("[class*=location], [class*=Location]").first().text().trim() || "Japan";
        const tags = $a
          .find("[class*=tag], [class*=Tag], [class*=chip]")
          .map((_i, t) => $(t).text().trim())
          .get()
          .filter(Boolean);

        if (!title || !company) return;
        out.push({
          sourceJobId: url.split("/").filter(Boolean).slice(-2).join("/"),
          title,
          company,
          location,
          tags,
          applyUrl: url,
          sourceUrl: url,
          // TokyoDev curates English-friendly companies, almost all sponsor visas.
          visaSupport: true,
          relocation: true,
        });
      });

      plog("tokyodev", `parsed ${out.length} jobs`);
      return out;
    } catch (err) {
      pwarn("tokyodev", "fetch failed:", (err as Error).message);
      return [];
    }
  },
};
