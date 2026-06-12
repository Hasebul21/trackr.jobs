// Remote-first talent platforms that hire globally (no relocation needed):
// Turing, Toptal, Arc, and Wellfound. These power the /remote page.
//
// Reality check: all four are JS-heavy and aggressively anti-bot
// (Cloudflare / gated GraphQL), and Toptal has no public freelance board
// at all — so live scrapes from serverless IPs frequently return []. Each
// provider therefore degrades gracefully and, when SEED_MOCK=1 and the
// live scrape comes back empty, falls back to a small set of realistic
// seed listings so the dashboard still has content. All are marked
// `reliable: false` so the UI can flag results as possibly incomplete.

import * as cheerio from "cheerio";
import { httpGet } from "@/lib/http";
import type { RawJob } from "@/types/job";
import { jitterSleep } from "@/lib/utils";
import { type JobProvider, plog, pwarn } from "../types";

/** Source keys for these providers, consumed by the /remote page filter. */
export const REMOTE_PLATFORM_SOURCES = [
  "turing",
  "toptal",
  "arc",
  "wellfound",
] as const;

// Titles here must satisfy ALLOWED_TITLE_PATTERNS (back/front/full-stack,
// devops, sre, cloud) or the ingest pipeline drops them.
function seedFallback(
  source: string,
  enabled: boolean,
  rows: RawJob[],
): RawJob[] {
  if (!enabled) return [];
  plog(source, `live scrape empty — using ${rows.length} seed rows (SEED_MOCK)`);
  return rows;
}

const SEED_ON = () => process.env.SEED_MOCK === "1";

// ── Turing ────────────────────────────────────────────────────────────
const TURING_SEED: RawJob[] = [
  {
    sourceJobId: "turing-seed-1",
    title: "Senior Backend Engineer (Remote)",
    company: "Turing (US client)",
    companyLogo: "https://logo.clearbit.com/turing.com",
    location: "Remote (Worldwide)",
    salary: "USD 60k–110k/yr",
    description:
      "Long-term remote contract with a US-based tech company via Turing. " +
      "Stack: Node.js, TypeScript, PostgreSQL, AWS. Overlap with US hours " +
      "required. Open to engineers worldwide, including South Asia.",
    tags: ["Node.js", "Remote"],
    technologies: ["Node.js", "TypeScript", "PostgreSQL", "AWS"],
    remote: true,
    seniority: "senior",
    applyUrl: "https://www.turing.com/jobs",
    sourceUrl: "https://www.turing.com/jobs",
  },
  {
    sourceJobId: "turing-seed-2",
    title: "Full Stack Engineer (Remote)",
    company: "Turing (US client)",
    companyLogo: "https://logo.clearbit.com/turing.com",
    location: "Remote (Worldwide)",
    salary: "USD 50k–90k/yr",
    description:
      "Remote full-stack role with React + Python/Django for a US SaaS " +
      "startup. Hired and paid in USD through Turing. Global applicants welcome.",
    tags: ["React", "Python"],
    technologies: ["React", "Python", "Django", "PostgreSQL"],
    remote: true,
    seniority: "mid",
    applyUrl: "https://www.turing.com/jobs",
    sourceUrl: "https://www.turing.com/jobs",
  },
];

const turing: JobProvider = {
  name: "turing",
  label: "Turing",
  reliable: false,
  async fetchJobs() {
    const out: RawJob[] = [];
    try {
      const html = await httpGet("https://www.turing.com/jobs", {
        timeoutMs: 20_000,
      });
      const $ = cheerio.load(html);
      $('a[href*="/jobs/"]').each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") ?? "";
        if (!/\/jobs\/[^/?]+/.test(href)) return;
        const link = href.startsWith("http")
          ? href
          : `https://www.turing.com${href}`;
        const title = $a.text().trim().split("\n")[0]?.trim();
        if (!title) return;
        out.push({
          sourceJobId: link.split("/").filter(Boolean).pop() ?? link,
          title,
          company: "Turing (client)",
          location: "Remote (Worldwide)",
          remote: true,
          applyUrl: link,
          sourceUrl: link,
        });
      });
      await jitterSleep();
    } catch (err) {
      pwarn("turing", "scrape failed:", (err as Error).message);
    }
    const rows = out.length ? out : seedFallback("turing", SEED_ON(), TURING_SEED);
    plog("turing", `parsed ${rows.length} jobs`);
    return rows;
  },
};

// ── Toptal ────────────────────────────────────────────────────────────
// Toptal is an invite-only freelance network with NO public gig board, so
// there is nothing to scrape. We surface a couple of representative remote
// openings (seed-only) so the platform is represented on /remote.
const TOPTAL_SEED: RawJob[] = [
  {
    sourceJobId: "toptal-seed-1",
    title: "Senior Full Stack Engineer (Remote Freelance)",
    company: "Toptal Network",
    companyLogo: "https://logo.clearbit.com/toptal.com",
    location: "Remote (Worldwide)",
    salary: "USD 40–80/hr",
    description:
      "Freelance, fully remote engagements with Toptal's client network. " +
      "Top 3% acceptance; React, Node.js, TypeScript. Flexible hours, paid " +
      "in USD. Apply to join the network, then get matched to client work.",
    tags: ["Freelance", "Remote"],
    technologies: ["React", "Node.js", "TypeScript"],
    remote: true,
    seniority: "senior",
    applyUrl: "https://www.toptal.com/talent/apply",
    sourceUrl: "https://www.toptal.com/freelance-jobs",
  },
  {
    sourceJobId: "toptal-seed-2",
    title: "Backend Engineer (Remote Freelance)",
    company: "Toptal Network",
    companyLogo: "https://logo.clearbit.com/toptal.com",
    location: "Remote (Worldwide)",
    salary: "USD 40–75/hr",
    description:
      "Remote freelance backend work via Toptal. Python/Go, microservices, " +
      "cloud. Engagements with US/EU clients; hours overlap negotiable.",
    tags: ["Freelance", "Backend"],
    technologies: ["Python", "Go", "AWS", "Docker"],
    remote: true,
    seniority: "senior",
    applyUrl: "https://www.toptal.com/talent/apply",
    sourceUrl: "https://www.toptal.com/freelance-jobs",
  },
];

const toptal: JobProvider = {
  name: "toptal",
  label: "Toptal",
  reliable: false,
  async fetchJobs() {
    // No public board to scrape — seed-only (when SEED_MOCK=1).
    const rows = seedFallback("toptal", SEED_ON(), TOPTAL_SEED);
    plog("toptal", `no public board; ${rows.length} seed jobs`);
    return rows;
  },
};

// ── Arc.dev ───────────────────────────────────────────────────────────
const ARC_SEED: RawJob[] = [
  {
    sourceJobId: "arc-seed-1",
    title: "Senior Backend Engineer (Remote)",
    company: "Arc (remote startup)",
    companyLogo: "https://logo.clearbit.com/arc.dev",
    location: "Remote (Global)",
    salary: "USD 70k–120k/yr",
    description:
      "Permanent remote role sourced via Arc.dev. Go + Kubernetes on GCP for " +
      "a venture-backed startup. Async-first team across time zones.",
    tags: ["Go", "Remote"],
    technologies: ["Go", "Kubernetes", "GCP", "PostgreSQL"],
    remote: true,
    seniority: "senior",
    applyUrl: "https://arc.dev/remote-jobs",
    sourceUrl: "https://arc.dev/remote-jobs",
  },
  {
    sourceJobId: "arc-seed-2",
    title: "DevOps Engineer (Remote)",
    company: "Arc (remote startup)",
    companyLogo: "https://logo.clearbit.com/arc.dev",
    location: "Remote (Global)",
    salary: "USD 65k–110k/yr",
    description:
      "Remote DevOps/platform role via Arc.dev. Terraform, AWS, CI/CD. " +
      "Full-time, paid in USD, open to engineers worldwide.",
    tags: ["DevOps", "Remote"],
    technologies: ["Terraform", "AWS", "Docker", "Kubernetes"],
    remote: true,
    seniority: "mid",
    applyUrl: "https://arc.dev/remote-jobs",
    sourceUrl: "https://arc.dev/remote-jobs",
  },
];

const arc: JobProvider = {
  name: "arc",
  label: "Arc.dev",
  reliable: false,
  async fetchJobs() {
    const out: RawJob[] = [];
    try {
      const html = await httpGet("https://arc.dev/remote-jobs", {
        timeoutMs: 20_000,
      });
      const $ = cheerio.load(html);
      $('a[href*="/remote-jobs/"], a[href*="/jobs/"]').each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") ?? "";
        if (!/\/(remote-jobs|jobs)\/[^/?]+/.test(href)) return;
        const link = href.startsWith("http") ? href : `https://arc.dev${href}`;
        const title =
          $a.find("h2, h3, [class*=title]").first().text().trim() ||
          $a.text().trim().split("\n")[0]?.trim();
        const $card = $a.closest("article, li, div");
        const company =
          $card.find("[class*=company], [class*=Company]").first().text().trim() ||
          "Remote company";
        if (!title) return;
        out.push({
          sourceJobId: link.split("/").filter(Boolean).pop() ?? link,
          title,
          company,
          location: "Remote (Global)",
          remote: true,
          applyUrl: link,
          sourceUrl: link,
        });
      });
      await jitterSleep();
    } catch (err) {
      pwarn("arc", "scrape failed:", (err as Error).message);
    }
    const rows = out.length ? out : seedFallback("arc", SEED_ON(), ARC_SEED);
    plog("arc", `parsed ${rows.length} jobs`);
    return rows;
  },
};

// ── Wellfound (formerly AngelList Talent) ───────────────────────────────
const WELLFOUND_SEED: RawJob[] = [
  {
    sourceJobId: "wellfound-seed-1",
    title: "Full Stack Engineer (Remote)",
    company: "Wellfound startup",
    companyLogo: "https://logo.clearbit.com/wellfound.com",
    location: "Remote (Worldwide)",
    salary: "USD 80k–140k + equity",
    description:
      "Early-stage startup hiring a remote full-stack engineer via Wellfound. " +
      "TypeScript, React, Node, Postgres. Equity offered. Remote-first team.",
    tags: ["Startup", "Equity"],
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    remote: true,
    seniority: "mid",
    applyUrl: "https://wellfound.com/jobs",
    sourceUrl: "https://wellfound.com/jobs",
  },
  {
    sourceJobId: "wellfound-seed-2",
    title: "Backend Engineer (Remote)",
    company: "Wellfound startup",
    companyLogo: "https://logo.clearbit.com/wellfound.com",
    location: "Remote (Worldwide)",
    salary: "USD 90k–150k + equity",
    description:
      "Remote backend role at a YC-backed startup listed on Wellfound. " +
      "Python/Go, distributed systems, AWS. Async team, global hiring.",
    tags: ["Startup", "Backend"],
    technologies: ["Python", "Go", "AWS", "Kafka"],
    remote: true,
    seniority: "senior",
    applyUrl: "https://wellfound.com/jobs",
    sourceUrl: "https://wellfound.com/jobs",
  },
];

const wellfound: JobProvider = {
  name: "wellfound",
  label: "Wellfound",
  reliable: false,
  async fetchJobs() {
    const out: RawJob[] = [];
    try {
      const html = await httpGet(
        "https://wellfound.com/role/r/software-engineer",
        { timeoutMs: 20_000 },
      );
      const $ = cheerio.load(html);
      $('a[href*="/jobs/"]').each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") ?? "";
        if (!/\/jobs\/\d+/.test(href)) return;
        const link = href.startsWith("http")
          ? href
          : `https://wellfound.com${href}`;
        const title = $a.text().trim().split("\n")[0]?.trim();
        if (!title) return;
        out.push({
          sourceJobId: link.split("/").filter(Boolean).pop() ?? link,
          title,
          company: "Wellfound startup",
          location: "Remote (Worldwide)",
          remote: true,
          applyUrl: link,
          sourceUrl: link,
        });
      });
      await jitterSleep();
    } catch (err) {
      pwarn("wellfound", "scrape failed:", (err as Error).message);
    }
    const rows = out.length
      ? out
      : seedFallback("wellfound", SEED_ON(), WELLFOUND_SEED);
    plog("wellfound", `parsed ${rows.length} jobs`);
    return rows;
  },
};

export const remotePlatformProviders: JobProvider[] = [
  turing,
  toptal,
  arc,
  wellfound,
];
