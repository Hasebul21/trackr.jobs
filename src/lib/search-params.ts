// Translation between URL ?query params and the typed JobFilters that
// the data layer wants. One place so dashboard + bookmarks pages stay
// in sync.

import type { JobFilters, Seniority } from "@/types/job";

export type SP = { [key: string]: string | string[] | undefined };

function arr(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export function filtersFromSearchParams(sp: SP): JobFilters {
  const f: JobFilters = {};
  if (typeof sp.q === "string" && sp.q) f.q = sp.q;
  const sources = arr(sp.source);
  if (sources.length) f.source = sources;
  const countries = arr(sp.country);
  if (countries.length) f.country = countries;
  const tech = arr(sp.tech);
  if (tech.length) f.tech = tech;
  const levels = arr(sp.level).filter(isSeniority);
  if (levels.length) f.seniority = levels;
  if (sp.visa === "1") f.visaOnly = true;
  if (sp.remote === "1") f.remoteOnly = true;
  if (sp.salary === "1") f.hasSalary = true;
  if (typeof sp.days === "string") {
    const n = Number(sp.days);
    if (Number.isFinite(n) && n > 0) f.postedWithinDays = n;
  }
  if (sp.sort === "recent") f.sort = "recent";
  if (typeof sp.page === "string") {
    const n = Number(sp.page);
    if (Number.isFinite(n) && n >= 1) f.page = n;
  }
  return f;
}

function isSeniority(s: string): s is Seniority {
  return s === "junior" || s === "mid" || s === "senior" || s === "unknown";
}
