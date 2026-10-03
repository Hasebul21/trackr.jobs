// Translation between URL query params and the typed JobFilters that the
// service wants. Repeated params (?source=a&source=b) arrive as an array,
// single ones as a string; comma-separated values are accepted as well.

import type { JobFilters, Seniority } from './job.types';

export type JobsQuery = Record<string, unknown>;

function arr(v: unknown): string[] {
  const values = Array.isArray(v) ? v : [v];
  return values
    .filter((x): x is string => typeof x === 'string')
    .flatMap((x) => x.split(','))
    .map((x) => x.trim())
    .filter(Boolean);
}

function positiveNumber(v: unknown): number | undefined {
  if (typeof v !== 'string') return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function parseJobFilters(query: JobsQuery): JobFilters {
  const f: JobFilters = {};
  if (typeof query.q === 'string' && query.q) f.q = query.q;
  const sources = arr(query.source);
  if (sources.length) f.source = sources;
  const countries = arr(query.country);
  if (countries.length) f.country = countries;
  const levels = arr(query.level).filter(isSeniority);
  if (levels.length) f.seniority = levels;
  if (query.visa === '1') f.visaOnly = true;
  if (query.remote === '1') f.remoteOnly = true;
  const days = positiveNumber(query.days);
  if (days) f.postedWithinDays = days;
  if (query.sort === 'recent') f.sort = 'recent';
  else if (query.sort === 'country') f.sort = 'country';
  const page = positiveNumber(query.page);
  if (page && page >= 1) f.page = page;
  const pageSize = positiveNumber(query.pageSize);
  if (pageSize) f.pageSize = pageSize;
  return f;
}

function isSeniority(s: string): s is Seniority {
  return s === 'junior' || s === 'mid' || s === 'senior' || s === 'unknown';
}
