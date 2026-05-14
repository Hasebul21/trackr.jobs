// Orchestrates one ingest cycle:
//   getProviders → fetch each (parallel) → normalize → score → dedupe → upsert
// Returns per-source stats so the API route can report what happened.

import { prisma } from "@/lib/prisma";
import { getProviders } from "@/providers";
import type { JobProvider } from "@/providers";
import type { Job, RawJob } from "@/types/job";
import { normalizeJob } from "./normalize";
import { scoreJob } from "./scoring";
import { dedupeJobs } from "./dedup";

export type IngestStats = {
  source: string;
  fetched: number;
  inserted: number;
  updated: number;
  ok: boolean;
  error?: string;
};

export type IngestReport = {
  startedAt: Date;
  finishedAt: Date;
  totalFetched: number;
  totalUpserted: number;
  bySource: IngestStats[];
};

export async function runIngest(opts: {
  providers?: JobProvider[];
} = {}): Promise<IngestReport> {
  const startedAt = new Date();
  const providers = opts.providers ?? getProviders();

  const results = await Promise.all(
    providers.map(async (p) => {
      const run = await prisma.fetchRun.create({
        data: { source: p.name },
      });
      try {
        const raws = await p.fetchJobs();
        const normalized: Job[] = raws.map((r) => fullJob(r, p.name));
        await prisma.fetchRun.update({
          where: { id: run.id },
          data: {
            finishedAt: new Date(),
            ok: true,
            fetched: normalized.length,
          },
        });
        return { provider: p.name, jobs: normalized };
      } catch (err) {
        await prisma.fetchRun.update({
          where: { id: run.id },
          data: {
            finishedAt: new Date(),
            ok: false,
            error: (err as Error).message,
          },
        });
        return { provider: p.name, jobs: [] as Job[], error: (err as Error).message };
      }
    }),
  );

  // Cross-source dedup happens after we have every provider's batch.
  const allJobs = results.flatMap((r) => r.jobs);
  const deduped = dedupeJobs(allJobs);
  const dedupedIds = new Set(deduped.map((j) => j.id));

  const stats: IngestStats[] = [];
  let totalUpserted = 0;
  for (const r of results) {
    const mine = r.jobs.filter((j) => dedupedIds.has(j.id));
    let inserted = 0;
    let updated = 0;
    for (const j of mine) {
      const res = await upsertJob(j);
      if (res === "inserted") inserted++;
      else if (res === "updated") updated++;
    }
    totalUpserted += inserted + updated;
    stats.push({
      source: r.provider,
      fetched: r.jobs.length,
      inserted,
      updated,
      ok: !r.error,
      error: r.error,
    });
  }

  return {
    startedAt,
    finishedAt: new Date(),
    totalFetched: allJobs.length,
    totalUpserted,
    bySource: stats,
  };
}

function fullJob(raw: RawJob, source: string): Job {
  const base = normalizeJob(raw, source);
  const matchedScore = scoreJob(base);
  const now = new Date();
  return { ...base, matchedScore, createdAt: now, updatedAt: now };
}

async function upsertJob(j: Job): Promise<"inserted" | "updated" | "skipped"> {
  const existing = await prisma.job.findUnique({ where: { id: j.id } });
  const data = {
    source: j.source,
    sourceJobId: j.sourceJobId,
    title: j.title,
    company: j.company,
    companyLogo: j.companyLogo ?? null,
    location: j.location,
    salary: j.salary ?? null,
    description: j.description,
    requirements: JSON.stringify(j.requirements),
    tags: JSON.stringify(j.tags),
    technologies: JSON.stringify(j.technologies),
    visaSupport: j.visaSupport,
    remote: j.remote,
    relocation: j.relocation,
    seniority: j.seniority,
    applyUrl: j.applyUrl,
    sourceUrl: j.sourceUrl,
    postedAt: j.postedAt ?? null,
    matchedScore: j.matchedScore,
    fingerprint: j.fingerprint,
  };
  if (existing) {
    await prisma.job.update({ where: { id: j.id }, data });
    return "updated";
  }
  await prisma.job.create({ data: { id: j.id, ...data } });
  return "inserted";
}
