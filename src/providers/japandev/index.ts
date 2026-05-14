// Japan Dev is a Next.js site; the listing is server-rendered into HTML
// but the cleanest extraction is reading the __NEXT_DATA__ JSON blob
// when present. Falls back to anchor parsing.

import * as cheerio from "cheerio";
import { httpGet } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

const LIST_URL = "https://japan-dev.com/jobs";

type NextJob = {
  id?: string | number;
  slug?: string;
  title?: string;
  company?: { name?: string; slug?: string; logo?: string };
  location?: string;
  tags?: string[];
  visaSponsorship?: boolean;
  remote?: boolean;
  url?: string;
};

export const japandev: JobProvider = {
  name: "japandev",
  label: "Japan Dev",
  reliable: true,
  async fetchJobs() {
    try {
      const html = await httpGet(LIST_URL, { timeoutMs: 20_000 });
      const $ = cheerio.load(html);
      const out: RawJob[] = [];

      // Try __NEXT_DATA__ first.
      const nextData = $("script#__NEXT_DATA__").html();
      if (nextData) {
        try {
          const parsed = JSON.parse(nextData);
          const jobs = findJobsArray(parsed);
          for (const j of jobs) {
            if (!j.title) continue;
            const slug = j.slug ?? `${j.id ?? ""}`;
            const url =
              j.url ??
              `https://japan-dev.com/jobs/${j.company?.slug ?? "company"}/${slug}`;
            out.push({
              sourceJobId: String(j.id ?? slug),
              title: j.title,
              company: j.company?.name ?? "Unknown",
              companyLogo: j.company?.logo ?? null,
              location: j.location ?? "Japan",
              tags: j.tags ?? [],
              applyUrl: url,
              sourceUrl: url,
              visaSupport: j.visaSponsorship ?? true,
              remote: j.remote ?? false,
              relocation: true,
            });
          }
          plog("japandev", `parsed ${out.length} jobs from __NEXT_DATA__`);
          if (out.length > 0) return out;
        } catch (err) {
          pwarn("japandev", "__NEXT_DATA__ parse failed:", (err as Error).message);
        }
      }

      // Fallback: anchor scrape.
      $('a[href*="/jobs/"]').each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") ?? "";
        if (!/\/jobs\/[^/]+\/[^/]+/.test(href)) return;
        const url = href.startsWith("http") ? href : `https://japan-dev.com${href}`;
        const title = $a.find("h2, h3").first().text().trim() || $a.text().trim();
        if (!title) return;
        out.push({
          sourceJobId: url.split("/").filter(Boolean).slice(-2).join("/"),
          title,
          company: $a.find("[class*=company]").first().text().trim() || "Unknown",
          location: "Japan",
          applyUrl: url,
          sourceUrl: url,
          visaSupport: true,
          relocation: true,
        });
      });

      plog("japandev", `parsed ${out.length} jobs (fallback)`);
      return out;
    } catch (err) {
      pwarn("japandev", "fetch failed:", (err as Error).message);
      return [];
    }
  },
};

/** Deep-walk a __NEXT_DATA__ blob looking for the largest array of objects
 * that look like jobs. Resilient to schema changes from rebuilds. */
function findJobsArray(root: unknown): NextJob[] {
  let best: NextJob[] = [];
  const seen = new WeakSet<object>();
  const stack: unknown[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;
    if (seen.has(node as object)) continue;
    seen.add(node as object);
    if (Array.isArray(node)) {
      if (
        node.length > best.length &&
        node.every((x) => x && typeof x === "object" && "title" in x)
      ) {
        best = node as NextJob[];
      }
      for (const x of node) stack.push(x);
    } else {
      for (const v of Object.values(node)) stack.push(v);
    }
  }
  return best;
}
