// Cross-source dedup. The same role can appear on TokyoDev + LinkedIn +
// the company's own page; we collapse them by:
//   1. normalized apply URL match (strongest signal)
//   2. identical (company, title) fingerprint
//   3. high Jaccard token similarity on company+title when fingerprints differ
// "Winner" within a group: highest score, then most-recent postedAt.

import type { Job } from "@/types/job";
import { jaccard } from "@/lib/utils";

type Candidate = Job & { _key: string };

export function dedupeJobs(jobs: Job[]): Job[] {
  // Pass 1: bucket by applyUrl + fingerprint. O(n).
  const byUrl = new Map<string, Candidate>();
  const byFp = new Map<string, Candidate>();
  const survivors: Candidate[] = [];

  for (const j of jobs) {
    const cand: Candidate = { ...j, _key: j.id };

    const winnerByUrl = byUrl.get(j.applyUrl);
    if (winnerByUrl) {
      replaceIfBetter(winnerByUrl, cand, byUrl, byFp, survivors);
      continue;
    }
    const winnerByFp = byFp.get(j.fingerprint);
    if (winnerByFp) {
      replaceIfBetter(winnerByFp, cand, byUrl, byFp, survivors);
      continue;
    }

    byUrl.set(j.applyUrl, cand);
    byFp.set(j.fingerprint, cand);
    survivors.push(cand);
  }

  // Pass 2: fuzzy collapse within survivors. O(n²) but n is small (≤a few
  // hundred per fetch). Threshold tuned for "Backend Engineer at Acme"
  // vs "Senior Backend Engineer @ Acme" → merge.
  const final: Candidate[] = [];
  for (const cand of survivors) {
    const dup = final.find(
      (other) =>
        other.company.toLowerCase() === cand.company.toLowerCase() &&
        jaccard(other.title, cand.title) >= 0.7,
    );
    if (dup) {
      if (isBetter(cand, dup)) {
        final[final.indexOf(dup)] = cand;
      }
    } else {
      final.push(cand);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- _key only exists to anchor the bucket lookup
  return final.map(({ _key, ...rest }) => rest as Job);
}

function isBetter(a: Job, b: Job): boolean {
  if (a.matchedScore !== b.matchedScore) return a.matchedScore > b.matchedScore;
  const ad = a.postedAt?.getTime() ?? 0;
  const bd = b.postedAt?.getTime() ?? 0;
  return ad > bd;
}

function replaceIfBetter(
  incumbent: Candidate,
  challenger: Candidate,
  byUrl: Map<string, Candidate>,
  byFp: Map<string, Candidate>,
  survivors: Candidate[],
) {
  if (!isBetter(challenger, incumbent)) return;
  const idx = survivors.indexOf(incumbent);
  if (idx >= 0) survivors[idx] = challenger;
  byUrl.set(challenger.applyUrl, challenger);
  byFp.set(challenger.fingerprint, challenger);
}
