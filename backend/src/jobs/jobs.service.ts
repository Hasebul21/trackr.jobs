// Read-side. Translates UI filter params into a Prisma query and rehydrates
// the JSON-encoded array fields into real arrays.

import { Injectable, NotFoundException } from '@nestjs/common';
import type { Job as DbJob, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { detectCountry } from '../config/preferences';
import type { Job, JobFilters } from './job.types';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async queryJobs(filters: JobFilters): Promise<{
    jobs: Job[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(60, Math.max(1, filters.pageSize ?? 12));

    const where: Prisma.JobWhereInput = {};
    const and: Prisma.JobWhereInput[] = [];

    if (filters.q) {
      const q = filters.q;
      and.push({
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { company: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
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
      const since = new Date(
        Date.now() - filters.postedWithinDays * 86_400_000,
      );
      and.push({ OR: [{ postedAt: { gte: since } }, { postedAt: null }] });
    }
    if (filters.country && filters.country.length > 0) {
      and.push({
        OR: filters.country.map((c) => ({
          location: { contains: c, mode: 'insensitive' as const },
        })),
      });
    }
    if (and.length > 0) where.AND = and;

    // "country" sort buckets jobs by location alphabetically so the user
    // can scan country-by-country. Within a country we keep the same
    // best-match → recent ordering as the score view.
    const orderBy: Prisma.JobOrderByWithRelationInput[] =
      filters.sort === 'recent'
        ? [{ postedAt: 'desc' }, { matchedScore: 'desc' }]
        : filters.sort === 'country'
          ? [
              { location: 'asc' },
              { matchedScore: 'desc' },
              { postedAt: 'desc' },
            ]
          : [{ matchedScore: 'desc' }, { postedAt: 'desc' }];

    const [rows, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.job.count({ where }),
    ]);

    return { jobs: rows.map(rehydrate), total, page, pageSize };
  }

  async getJob(id: string): Promise<Job | null> {
    const row = await this.prisma.job.findUnique({ where: { id } });
    return row ? rehydrate(row) : null;
  }

  // Used by the bookmarks page to hydrate its locally-stored ID list.
  async findByIds(ids: string[]): Promise<Job[]> {
    if (ids.length === 0) return [];
    const rows = await this.prisma.job.findMany({ where: { id: { in: ids } } });
    return rows.map(rehydrate);
  }

  async getJobStats() {
    const [total, withVisa, remote, lastRun] = await Promise.all([
      this.prisma.job.count(),
      this.prisma.job.count({ where: { visaSupport: true } }),
      this.prisma.job.count({ where: { remote: true } }),
      this.prisma.fetchRun.findFirst({ orderBy: { startedAt: 'desc' } }),
    ]);
    const bySource = await this.prisma.job.groupBy({
      by: ['source'],
      _count: { _all: true },
      orderBy: { _count: { id: 'desc' } },
    });
    return {
      total,
      withVisa,
      remote,
      lastRunAt: lastRun?.finishedAt ?? lastRun?.startedAt ?? null,
      bySource: bySource.map((r) => ({
        source: r.source,
        count: r._count._all,
      })),
    };
  }

  /** List of available filter values derived from current data. */
  async getFacets() {
    const sources = await this.prisma.job.groupBy({
      by: ['source'],
      _count: { _all: true },
    });
    const locs = await this.prisma.job.findMany({
      select: { location: true },
      distinct: ['location'],
      take: 200,
    });
    const countries = new Set<string>();
    for (const l of locs) {
      const c = detectCountry(l.location);
      if (c) countries.add(c);
    }
    return {
      sources: sources.map((s) => ({
        source: s.source,
        count: s._count._all,
      })),
      countries: Array.from(countries).sort(),
    };
  }

  /** Marks a job as applied: writes a tombstone (so future cron ticks
   * skip the same posting) and deletes the Job row in the same
   * transaction. Both halves run together so the row can never disappear
   * without leaving a tombstone behind. */
  async markApplied(id: string): Promise<void> {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');

    await this.prisma.$transaction([
      this.prisma.appliedJob.upsert({
        where: { id },
        create: {
          id,
          source: job.source,
          title: job.title,
          company: job.company,
          applyUrl: job.applyUrl,
        },
        update: { appliedAt: new Date() },
      }),
      this.prisma.job.delete({ where: { id } }),
    ]);
  }
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
    seniority: row.seniority as Job['seniority'],
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
    const v: unknown = JSON.parse(s);
    return Array.isArray(v)
      ? v.filter((x): x is string => typeof x === 'string')
      : [];
  } catch {
    return [];
  }
}
