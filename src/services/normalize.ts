// Promotes a RawJob from a provider into a fully-populated Job by
// inferring visa/remote/seniority/tech/etc. from the description when
// the provider didn't already extract them.

import type { Job, RawJob, Seniority } from "@/types/job";
import {
  PREFERRED_TECHNOLOGIES,
  SENIORITY_HINTS,
  VISA_PHRASES,
} from "@/lib/preferences";
import { hashId, normalizeText, normalizeUrl } from "@/lib/utils";

function detectFlag(text: string, phrases: readonly string[]): boolean {
  const t = text.toLowerCase();
  return phrases.some((p) => t.includes(p));
}

function detectSeniority(text: string, hint?: Seniority): Seniority {
  if (hint && hint !== "unknown") return hint;
  const t = text.toLowerCase();
  if (SENIORITY_HINTS.senior.some((k) => t.includes(k))) return "senior";
  if (SENIORITY_HINTS.junior.some((k) => t.includes(k))) return "junior";
  if (SENIORITY_HINTS.mid.some((k) => t.includes(k))) return "mid";
  return "unknown";
}

function detectTech(text: string, existing: string[] = []): string[] {
  const t = text.toLowerCase();
  const found = new Set(existing.map((x) => x.toLowerCase()));
  for (const tech of PREFERRED_TECHNOLOGIES) {
    // word-boundary-ish: avoid matching "java" in "javascript"
    const re = new RegExp(`(?:^|[^a-z])${escapeRe(tech)}(?:[^a-z]|$)`, "i");
    if (re.test(t)) found.add(tech);
  }
  return Array.from(found);
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeJob(
  raw: RawJob,
  source: string,
): Omit<Job, "createdAt" | "updatedAt" | "matchedScore"> {
  const description = (raw.description ?? "").trim();
  const haystack = `${raw.title}\n${description}`.toLowerCase();

  const remote =
    raw.remote ?? /\bremote\b|work from home|wfh|anywhere/.test(haystack);
  const visaSupport =
    raw.visaSupport ?? detectFlag(haystack, VISA_PHRASES);
  const relocation =
    raw.relocation ?? /relocat|move to|relocation/.test(haystack);
  const seniority = detectSeniority(haystack, raw.seniority);
  const technologies = detectTech(haystack, raw.technologies);

  const fingerprint = `${normalizeText(raw.company)}::${normalizeText(raw.title)}`;
  const id = hashId(source, raw.sourceJobId);

  return {
    id,
    source,
    sourceJobId: raw.sourceJobId,
    title: raw.title.trim(),
    company: raw.company.trim(),
    companyLogo: raw.companyLogo ?? null,
    location: (raw.location ?? "").trim(),
    salary: raw.salary ?? null,
    description,
    requirements: raw.requirements ?? [],
    tags: raw.tags ?? [],
    technologies,
    visaSupport,
    remote,
    relocation,
    seniority,
    applyUrl: normalizeUrl(raw.applyUrl),
    sourceUrl: raw.sourceUrl ? normalizeUrl(raw.sourceUrl) : normalizeUrl(raw.applyUrl),
    postedAt: raw.postedAt ?? null,
    fingerprint,
  };
}
