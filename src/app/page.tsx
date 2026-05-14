// Dashboard. Server component: parses URL ?filters, queries Postgres,
// renders the FiltersPanel sidebar + a grid of JobCards. All filter
// changes go through URL params so the page stays bookmarkable.

import { Suspense } from "react";
import { FiltersPanel } from "@/components/filters-panel";
import { JobCard } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { queryJobs, getFacets } from "@/services/jobs";
import {
    filtersFromSearchParams,
    type SP,
} from "@/lib/search-params";

export const dynamic = "force-dynamic";
// Cap server rendering. Two indexed Prisma reads — should land well
// under this on Vercel Postgres.
export const maxDuration = 30;

export default async function Home({
    searchParams,
}: {
    // Next 16: searchParams is async — must be awaited before use.
    searchParams: Promise<SP>;
}) {
    const sp = await searchParams;
    const filters = filtersFromSearchParams(sp);

    const [{ jobs, total }, facets] = await Promise.all([
        queryJobs(filters),
        getFacets(),
    ]);

    const page = filters.page ?? 1;
    // 12 = 4 rows × 3 cols on the dashboard grid.
    const pageSize = filters.pageSize ?? 12;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const rangeEnd = Math.min(total, page * pageSize);

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-3">
            <div className="flex flex-col gap-4 lg:flex-row">
                <Suspense fallback={<Skeleton className="h-96 w-full shrink-0 lg:w-60" />}>
                    <FiltersPanel facets={facets} />
                </Suspense>

                <section className="min-w-0 flex-1">
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
                            hrefFor={(n) => hrefForPage(sp, n, "/")}
                        />
                    )}
                </section>
            </div>
        </div>
    );
}

/** Build a same-page URL preserving every current query param except
 * `page`, which we override (or strip on page 1). Used as `hrefFor`
 * for the shared Pagination. */
function hrefForPage(currentParams: SP, n: number, pathname: string): string {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(currentParams)) {
        if (Array.isArray(v)) for (const item of v) p.append(k, item);
        else if (typeof v === "string") p.set(k, v);
    }
    if (n <= 1) p.delete("page");
    else p.set("page", String(n));
    const qs = p.toString();
    return qs ? `${pathname}?${qs}` : pathname;
}
