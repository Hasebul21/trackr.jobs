import { ParamMap } from '@angular/router';
import { JobFilters, Seniority } from '../core/models';

// Turns the URL query string into the filters the API expects. Same rules
// as the original search-params helper: unknown values are ignored.
export function filtersFromParams(params: ParamMap): JobFilters {
  const f: JobFilters = {};

  const q = params.get('q');
  if (q) f.q = q;

  const sources = params.getAll('source');
  if (sources.length) f.source = sources;

  const countries = params.getAll('country');
  if (countries.length) f.country = countries;

  const levels = params.getAll('level').filter(isSeniority);
  if (levels.length) f.level = levels;

  if (params.get('visa') === '1') f.visa = true;
  if (params.get('remote') === '1') f.remote = true;

  const days = Number(params.get('days'));
  if (Number.isFinite(days) && days > 0) f.days = days;

  const sort = params.get('sort');
  if (sort === 'recent' || sort === 'country') f.sort = sort;

  f.page = pageFromParams(params);
  return f;
}

export function pageFromParams(params: ParamMap): number {
  const page = Number(params.get('page'));
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

function isSeniority(s: string): s is Seniority {
  return s === 'junior' || s === 'mid' || s === 'senior' || s === 'unknown';
}
