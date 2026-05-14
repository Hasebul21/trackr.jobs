#!/usr/bin/env tsx
/**
 * Ad-hoc job fetcher CLI. Reuses the live providers (Adzuna /
 * Careerjet / TheirStack / scrapers) so results match what cron
 * would write to the DB.
 *
 * Usage:
 *   npx tsx scripts/fetcher.ts --query "Backend Engineer" --location Singapore
 *   npx tsx scripts/fetcher.ts -q "DevOps" -l Japan --source adzuna
 *   npx tsx scripts/fetcher.ts --query "Software Engineer"   # no location filter
 *
 * Flags:
 *   -q, --query     Required. Substring matched (case-insensitive) against title.
 *   -l, --location  Optional. Substring matched against location.
 *   --source        Optional. Comma-separated list (e.g. adzuna,careerjet).
 *   --limit         Optional. Truncate the printed table (default 30).
 *
 * Loads .env / .env.local automatically via dotenv.
 */

import "dotenv/config";
import { ALL_PROVIDERS } from "../src/providers";

type Args = {
    query?: string;
    location?: string;
    sources?: string[];
    limit: number;
};

function parseArgs(argv: string[]): Args {
    const a: Args = { limit: 30 };
    for (let i = 0; i < argv.length; i++) {
        const k = argv[i];
        const next = () => argv[++i];
        switch (k) {
            case "-q":
            case "--query":
                a.query = next();
                break;
            case "-l":
            case "--location":
                a.location = next();
                break;
            case "--source":
                a.sources = next().split(",").map((s) => s.trim().toLowerCase());
                break;
            case "--limit":
                a.limit = Number(next()) || 30;
                break;
            case "-h":
            case "--help":
                printHelp();
                process.exit(0);
        }
    }
    if (!a.query) {
        console.error("Missing --query. Try: --query \"Backend Engineer\" --location Singapore");
        process.exit(1);
    }
    return a;
}

function printHelp() {
    console.log(`
fetcher.ts — query live job providers and print a table.

  -q, --query     Title substring (required)
  -l, --location  Location substring
      --source    adzuna,careerjet,theirstack,tokyodev,...
      --limit     Max rows to print (default 30)
`);
}

function truncate(s: string, n: number): string {
    if (!s) return "";
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    const providers = ALL_PROVIDERS.filter((p) => {
        if (p.name === "mock") return false;
        if (args.sources && !args.sources.includes(p.name)) return false;
        return true;
    });

    console.log(
        `\nFetching ${providers.length} providers in parallel: ${providers
            .map((p) => p.name)
            .join(", ")}\n`,
    );

    const t0 = Date.now();
    const results = await Promise.allSettled(
        providers.map(async (p) => ({ name: p.name, jobs: await p.fetchJobs() })),
    );

    const allRows: Array<{
        title: string;
        company: string;
        location: string;
        source: string;
        link: string;
    }> = [];

    for (const r of results) {
        if (r.status === "rejected") {
            console.warn(`  ✗ ${(r.reason as Error).message}`);
            continue;
        }
        const { name, jobs } = r.value;
        console.log(`  ✓ ${name.padEnd(12)} ${jobs.length} raw jobs`);
        for (const j of jobs) {
            const titleHit = j.title.toLowerCase().includes(args.query!.toLowerCase());
            const locHit = !args.location ||
                (j.location ?? "").toLowerCase().includes(args.location.toLowerCase());
            if (titleHit && locHit) {
                allRows.push({
                    title: j.title,
                    company: j.company,
                    location: j.location ?? "",
                    source: name,
                    link: j.applyUrl,
                });
            }
        }
    }

    console.log(
        `\nTook ${((Date.now() - t0) / 1000).toFixed(1)}s. ` +
        `Matched ${allRows.length} jobs.\n`,
    );

    if (allRows.length === 0) {
        console.log("No matches. Try broadening the query or removing --location.");
        return;
    }

    const printable = allRows.slice(0, args.limit).map((r) => ({
        Title: truncate(r.title, 50),
        Company: truncate(r.company, 24),
        Location: truncate(r.location, 22),
        Source: r.source,
        Link: truncate(r.link, 60),
    }));

    console.table(printable);

    if (allRows.length > args.limit) {
        console.log(
            `\n…and ${allRows.length - args.limit} more. Use --limit ${allRows.length} to see all.`,
        );
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
