// Relocate.me lists visa-sponsoring tech jobs. They paginate via query
// string. We hit the first page and parse the listings; deeper pages
// can be added by bumping `pages` if results look thin.

import * as cheerio from "cheerio";
import { httpGet } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { jitterSleep } from "@/lib/utils";
import { type JobProvider, plog, pwarn } from "../types";

const LIST_URL = "https://relocate.me/search?categories=software-development";

export const relocate: JobProvider = {
  name: "relocate",
  label: "Relocate.me",
  reliable: true,
  async fetchJobs() {
    const out: RawJob[] = [];
    const pages = 2;
    for (let p = 1; p <= pages; p++) {
      const url = p === 1 ? LIST_URL : `${LIST_URL}&page=${p}`;
      try {
        const html = await httpGet(url, { timeoutMs: 20_000 });
        const $ = cheerio.load(html);
        $('a[href*="/offers/"], a[href*="/jobs/"]').each((_, el) => {
          const $a = $(el);
          const href = $a.attr("href") ?? "";
          if (!/\/(offers|jobs)\/[^/?]+/.test(href)) return;
          const link = href.startsWith("http")
            ? href
            : `https://relocate.me${href}`;
          const title =
            $a.find("h2, h3, [class*=title]").first().text().trim() ||
            $a.text().trim().split("\n")[0]?.trim();
          const $card = $a.closest("article, li, div");
          const company =
            $card.find("[class*=company], [class*=Company]").first().text().trim() ||
            $a.find("[class*=company]").first().text().trim();
          const location =
            $card.find("[class*=location], [class*=Location], [class*=country]")
              .first()
              .text()
              .trim() || "International";
          if (!title || !company) return;
          out.push({
            sourceJobId: link.split("/").filter(Boolean).pop() ?? link,
            title,
            company,
            location,
            applyUrl: link,
            sourceUrl: link,
            // Relocate.me's entire premise is relocation + visa support.
            visaSupport: true,
            relocation: true,
          });
        });
        await jitterSleep();
      } catch (err) {
        pwarn("relocate", `page ${p} failed:`, (err as Error).message);
        break;
      }
    }
    plog("relocate", `parsed ${out.length} jobs`);
    return out;
  },
};
