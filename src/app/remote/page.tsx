// Remote jobs page. Scoped to the remote-first talent platforms — Turing,
// Toptal, Arc, and Wellfound — that hire globally without relocation. These
// are best-effort scrapes (reliable: false), so listings may be incomplete;
// run with SEED_MOCK=1 to populate representative seed data in dev.

import { JobCard } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { queryJobs } from "@/services/jobs";
import { REMOTE_PLATFORM_SOURCES } from "@/providers/remote-platforms";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const PLATFORMS = ["Turing", "Toptal", "Arc", "Wellfound"];

export default async function RemotePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const requested = Number(sp.page);
  const page = Number.isFinite(requested) && requested >= 1 ? requested : 1;
  const pageSize = 12;

  const { jobs, total } = await queryJobs({
    source: [...REMOTE_PLATFORM_SOURCES],
    sort: "recent",
    page,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(total, page * pageSize);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4">
      <header className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight">Remote</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Fully-remote software roles from global talent platforms —{" "}
          {PLATFORMS.join(", ")} — that hire worldwide with no relocation. These
          sources are anti-bot heavy, so listings may be incomplete; always
          confirm on the original posting.
        </p>
      </header>

      {jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      )}

      {total > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          total={total}
          hrefFor={(n) => (n <= 1 ? "/remote" : `/remote?page=${n}`)}
        />
      )}
    </div>
  );
}
