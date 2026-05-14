// Relevance score derived from spec §4. Pure function on the normalized
// job — no DB access — so it's trivially testable.

import type { Job } from "@/types/job";
import {
  EXCLUDE_TITLE_KEYWORDS,
  INCLUDE_TITLE_KEYWORDS,
  PREFERRED_LOCATIONS,
} from "@/lib/preferences";

export function scoreJob(j: Pick<
  Job,
  | "title"
  | "description"
  | "location"
  | "technologies"
  | "visaSupport"
  | "remote"
  | "relocation"
  | "seniority"
>): number {
  const title = j.title.toLowerCase();
  const desc = (j.description ?? "").toLowerCase();
  const loc = j.location.toLowerCase();
  const techs = new Set(j.technologies.map((t) => t.toLowerCase()));

  // Hard exclusion → drops the job out of "relevant" but we still keep
  // it persisted (matchedScore 0) so the user can re-tune later.
  if (EXCLUDE_TITLE_KEYWORDS.some((k) => title.includes(k))) return 0;

  let score = 0;

  if (techs.has("java") || techs.has("kotlin")) score += 25;
  if (techs.has("spring") || techs.has("spring boot")) score += 20;
  if (j.visaSupport) score += 30;
  if (PREFERRED_LOCATIONS.some((l) => loc.includes(l))) score += 20;
  if (j.remote) score += 10;
  if (j.seniority === "mid" || j.seniority === "senior") score += 15;
  if (
    /international candidates|international applicants|apply from abroad|english ok|english speaking/.test(
      desc,
    )
  )
    score += 25;
  if (j.relocation) score += 15;

  // Title-keyword boost — a job titled "Backend Engineer" is more relevant
  // than one only mentioning "engineer" in the description.
  if (INCLUDE_TITLE_KEYWORDS.some((k) => title.includes(k))) score += 10;

  return score;
}
