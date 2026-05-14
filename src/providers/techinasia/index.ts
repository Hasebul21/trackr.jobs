// Tech in Asia gates job listings behind anti-bot / login in places. We
// attempt the public RSS feed first (lowest-friction), fall back to the
// public jobs page, and degrade to [] on failure. Don't be surprised by
// zero results — that's the realistic case from a serverless IP.

import * as cheerio from "cheerio";
import { httpGet } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { type JobProvider, plog, pwarn } from "../types";

const RSS = "https://www.techinasia.com/jobs/feed";
const HTML = "https://www.techinasia.com/jobs";

export const techinasia: JobProvider = {
  name: "techinasia",
  label: "Tech in Asia",
  reliable: false,
  async fetchJobs() {
    // RSS attempt.
    try {
      const xml = await httpGet(RSS, {
        timeoutMs: 15_000,
        headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      });
      const items = parseRssItems(xml);
      if (items.length > 0) {
        plog("techinasia", `parsed ${items.length} jobs from RSS`);
        return items;
      }
    } catch (err) {
      pwarn("techinasia", "RSS failed:", (err as Error).message);
    }

    // HTML fallback.
    try {
      const html = await httpGet(HTML, { timeoutMs: 15_000 });
      const $ = cheerio.load(html);
      const out: RawJob[] = [];
      $('a[href*="/jobs/"]').each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") ?? "";
        if (!/\/jobs\/[^/]+$/.test(href)) return;
        const url = href.startsWith("http") ? href : `https://www.techinasia.com${href}`;
        const title = $a.text().trim().split("\n")[0]?.trim();
        if (!title) return;
        out.push({
          sourceJobId: url.split("/").pop() ?? url,
          title,
          company: "Unknown",
          location: "Asia",
          applyUrl: url,
          sourceUrl: url,
        });
      });
      plog("techinasia", `parsed ${out.length} jobs from HTML`);
      return out;
    } catch (err) {
      pwarn("techinasia", "HTML fallback failed:", (err as Error).message);
      return [];
    }
  },
};

function parseRssItems(xml: string): RawJob[] {
  const $ = cheerio.load(xml, { xmlMode: true });
  const out: RawJob[] = [];
  $("item").each((_, el) => {
    const $i = $(el);
    const title = $i.find("title").first().text().trim();
    const link = $i.find("link").first().text().trim();
    const desc = $i.find("description").first().text().trim();
    const pubDate = $i.find("pubDate").first().text().trim();
    if (!title || !link) return;
    out.push({
      sourceJobId: link.split("/").filter(Boolean).pop() ?? link,
      title,
      company: extractCompany(desc) ?? "Unknown",
      description: stripHtml(desc),
      applyUrl: link,
      sourceUrl: link,
      postedAt: pubDate ? new Date(pubDate) : null,
    });
  });
  return out;
}

function extractCompany(desc: string): string | null {
  // RSS descriptions sometimes start "<strong>Company</strong> is hiring…"
  const m = desc.match(/<strong>([^<]+)<\/strong>/);
  return m?.[1]?.trim() ?? null;
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
