// Read-side. Translates UI filter params into a Prisma query and rehydrates
// the JSON-encoded array fields into real arrays.

import { prisma } from "@/lib/prisma";
import type { Job, JobFilters } from "@/types/job";
import type { Prisma } from "@prisma/client";
import { detectCountry } from "@/lib/preferences";

type DbJob = Prisma.JobGetPayload<Record<string, never>>;

export async function queryJobs(filters: JobFilters): Promise<{
  jobs: Job[];
  total: number;
}> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(60, Math.max(1, filters.pageSize ?? 12));

  const where: Prisma.JobWhereInput = {};
  const and: Prisma.JobWhereInput[] = [];

  if (filters.q) {
    const q = filters.q;
    and.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (filters.source && filters.source.length > 0) {
    and.push({ source: { in: filters.source } });
  }
  if (filters.visaOnly) and.push({ visaSupport: true });
  if (filters.remoteOnly) and.push({ remote: true });
  if (filters.seniority && filters.seniority.length > 0) {
    and.push({ seniority: { in: filters.seniority } });
  }
  if (filters.postedWithinDays && filters.postedWithinDays > 0) {
    const since = new Date(Date.now() - filters.postedWithinDays * 86_400_000);
    and.push({ OR: [{ postedAt: { gte: since } }, { postedAt: null }] });
  }
  if (filters.country && filters.country.length > 0) {
    and.push({
      OR: filters.country.map((c) => ({
        location: { contains: c, mode: "insensitive" as const },
      })),
    });
  }
  if (and.length > 0) where.AND = and;

  // "country" sort buckets jobs by location alphabetically so the user
  // can scan country-by-country. Within a country we keep the same
  // best-match → recent ordering as the score view.
  const orderBy: Prisma.JobOrderByWithRelationInput[] =
    filters.sort === "recent"
      ? [{ postedAt: "desc" }, { matchedScore: "desc" }]
      : filters.sort === "country"
        ? [{ location: "asc" }, { matchedScore: "desc" }, { postedAt: "desc" }]
        : [{ matchedScore: "desc" }, { postedAt: "desc" }];

  const [rows, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs: rows.map(rehydrate), total };
}

export async function getJob(id: string): Promise<Job | null> {
  const row = await prisma.job.findUnique({ where: { id } });
  return row ? rehydrate(row) : null;
}

export async function getJobStats() {
  const [total, withVisa, remote, lastRun] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { visaSupport: true } }),
    prisma.job.count({ where: { remote: true } }),
    prisma.fetchRun.findFirst({ orderBy: { startedAt: "desc" } }),
  ]);
  const bySource = await prisma.job.groupBy({
    by: ["source"],
    _count: { _all: true },
    orderBy: { _count: { id: "desc" } },
  });
  return {
    total,
    withVisa,
    remote,
    lastRunAt: lastRun?.finishedAt ?? lastRun?.startedAt ?? null,
    bySource: bySource.map((r) => ({ source: r.source, count: r._count._all })),
  };
}

/** UI helper: list of available filter values derived from current data. */
export async function getFacets() {
  const sources = await prisma.job.groupBy({
    by: ["source"],
    _count: { _all: true },
  });
  const locs = await prisma.job.findMany({
    select: { location: true },
    distinct: ["location"],
    take: 200,
  });
  const countries = new Set<string>();
  for (const l of locs) {
    const c = detectCountry(l.location);
    if (c) countries.add(c);
  }
  return {
    sources: sources.map((s) => ({ source: s.source, count: s._count._all })),
    countries: Array.from(countries).sort(),
  };
}

function rehydrate(row: DbJob): Job {
  return {
    id: row.id,
    source: row.source,
    sourceJobId: row.sourceJobId,
    title: row.title,
    company: row.company,
    companyLogo: row.companyLogo,
    location: row.location,
    salary: row.salary,
    description: row.description,
    requirements: safeParseArr(row.requirements),
    tags: safeParseArr(row.tags),
    technologies: safeParseArr(row.technologies),
    visaSupport: row.visaSupport,
    remote: row.remote,
    relocation: row.relocation,
    seniority: row.seniority as Job["seniority"],
    applyUrl: row.applyUrl,
    sourceUrl: row.sourceUrl,
    postedAt: row.postedAt,
    matchedScore: row.matchedScore,
    fingerprint: row.fingerprint,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function safeParseArr(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
