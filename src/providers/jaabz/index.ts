// Jaabz aggregates visa-sponsorship tech jobs across SEA. The listing page
// is server-rendered HTML; many cards are "Premium" (login-walled), so we
// only emit the public ones that expose a real apply URL.

import * as cheerio from "cheerio";
import { httpGet } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

const LIST_URL =
  "https://jaabz.com/jobs" +
  "?keyword=Software" +
  "&countries=indonesia,malaysia,singapore,thailand" +
  "&visa_sponsorship=1" +
  "&search_submitted=1";

export const jaabz: JobProvider = {
  name: "jaabz",
  label: "Jaabz",
  reliable: false,
  async fetchJobs() {
    try {
      const html = await httpGet(LIST_URL, { timeoutMs: 20_000 });
      const $ = cheerio.load(html);
      const out: RawJob[] = [];
      const seen = new Set<string>();

      // Job detail links look like /jobs/<numeric-id>-<slug>. Collect each
      // unique link, then walk up to the surrounding card to pull metadata.
      $('a[href*="/jobs/"]').each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") ?? "";
        const m = href.match(/\/jobs\/(\d+)-([a-z0-9-]+)/i);
        if (!m) return;
        const url = href.startsWith("http") ? href : `https://jaabz.com${href}`;
        if (seen.has(url)) return;
        seen.add(url);

        const title = $a.text().trim() || $a.find("h3, h4").first().text().trim();
        if (!title) return;

        const $card = $a.closest("article, li, div").first();
        const cardText = $card.text().replace(/\s+/g, " ").trim();
        const company =
          $card.find("h4, [class*=company]").first().text().trim() || "Unknown";

        // Country shows up in the card body as plain text after the company.
        const country = ["Singapore", "Malaysia", "Indonesia", "Thailand"].find(
          (c) => cardText.includes(c),
        );

        // Premium / login-walled cards expose no apply URL beyond the slug,
        // but we still index them — the user can click through and decide.
        out.push({
          sourceJobId: m[1],
          title,
          company,
          location: country ?? "SEA",
          tags: [],
          applyUrl: url,
          sourceUrl: url,
          visaSupport: true,
          relocation: /Relocation/i.test(cardText),
          remote: /Remote/i.test(cardText),
        });
      });

      plog("jaabz", `parsed ${out.length} jobs`);
      return out;
    } catch (err) {
      pwarn("jaabz", "fetch failed:", (err as Error).message);
      return [];
    }
  },
};
