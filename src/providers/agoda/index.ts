// Agoda's careers site is a custom WordPress install. Each card on the
// /vacancies/?search=software listing exposes a stable detail link of the
// form /job/{numeric-id}-{slug}/ along with location text in the card body.

import * as cheerio from "cheerio";
import { httpGet } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

const LIST_URL = "https://careersatagoda.com/vacancies/?search=software";

export const agoda: JobProvider = {
  name: "agoda",
  label: "Agoda",
  reliable: true,
  async fetchJobs() {
    try {
      const html = await httpGet(LIST_URL, { timeoutMs: 20_000 });
      const $ = cheerio.load(html);
      const out: RawJob[] = [];
      const seen = new Set<string>();

      $('a[href*="/job/"]').each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") ?? "";
        const m = href.match(/\/job\/(\d+)-([a-z0-9-]+)/i);
        if (!m) return;
        const url = href.startsWith("http") ? href : `https://careersatagoda.com${href}`;
        if (seen.has(url)) return;
        seen.add(url);

        const title = $a.text().trim().split("\n")[0]?.trim();
        if (!title) return;

        // Card body holds location text like "Bangkok, Thailand" or
        // "Gurugram, India" — find the first known city/country phrase.
        const $card = $a.closest("article, li, div").first();
        const cardText = $card.text().replace(/\s+/g, " ").trim();
        const locMatch = cardText.match(
          /\b(Bangkok|Gurugram|Kuala Lumpur|Singapore|Tokyo|Seoul|Manila|Jakarta|Mumbai|Pune|Cebu|Phuket|Sydney|London|New York|Berlin|Bali|Cairo|Dubai)[^|]*?(?:Thailand|India|Malaysia|Singapore|Japan|Korea|Philippines|Indonesia|Australia|UK|United Kingdom|USA|Germany|UAE|Egypt)?/i,
        );
        const location = locMatch?.[0]?.trim() || "—";

        out.push({
          sourceJobId: m[1],
          title,
          company: "Agoda",
          location,
          tags: [],
          applyUrl: url,
          sourceUrl: url,
          // Agoda's listings prominently advertise relocation packages and
          // visa support — particularly for the Bangkok HQ roles.
          visaSupport: /relocation provided|visa/i.test(cardText) || /Bangkok/i.test(location),
          relocation: /relocation/i.test(cardText),
        });
      });

      plog("agoda", `parsed ${out.length} jobs`);
      return out;
    } catch (err) {
      pwarn("agoda", "fetch failed:", (err as Error).message);
      return [];
    }
  },
};
