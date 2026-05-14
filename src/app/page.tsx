// Dashboard. Server component: parses URL ?filters, queries Postgres,
// renders the FiltersPanel sidebar + a grid of JobCards. All filter
// changes go through URL params so the page stays bookmarkable.

import Link from "next/link";
import { Suspense } from "react";
import { FiltersPanel } from "@/components/filters-panel";
import { JobCard } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { SortSelect } from "@/components/sort-select";
import { StatsStrip } from "@/components/stats-strip";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { queryJobs, getFacets, getJobStats } from "@/services/jobs";
import {
    filtersFromSearchParams,
    type SP,
} from "@/lib/search-params";
import { formatRelative } from "@/lib/utils";

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

    const [{ jobs, total }, facets, stats] = await Promise.all([
        queryJobs(filters),
        getFacets(),
        getJobStats(),
    ]);

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 30;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6">
            <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        International tech jobs
                    </h1>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        {stats.total.toLocaleString()} listed ·{" "}
                        {stats.withVisa.toLocaleString()} with visa support ·{" "}
                        {stats.remote.toLocaleString()} remote
                        {stats.lastRunAt && (
                            <>
                                {" · refreshed "}
                                <span title={new Date(stats.lastRunAt).toLocaleString()}>
                                    {formatRelative(stats.lastRunAt)}
                                </span>
                            </>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline">
                        {total.toLocaleString()} match{total === 1 ? "" : "es"}
                    </Badge>
                    <SortSelect />
                </div>
            </header>

            <StatsStrip
                total={stats.total}
                withVisa={stats.withVisa}
                remote={stats.remote}
                sources={stats.bySource.length}
                lastRunAt={stats.lastRunAt}
            />

            <div className="flex flex-col gap-6 lg:flex-row">
                <Suspense fallback={<Skeleton className="h-96 w-full shrink-0 lg:w-64" />}>
                    <FiltersPanel facets={facets} />
                </Suspense>

                <section className="min-w-0 flex-1">
                    {jobs.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {jobs.map((j) => (
                                <JobCard key={j.id} job={j} />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            currentParams={sp}
                        />
                    )}
                </section>
            </div>
        </div>
    );
}

function Pagination({
    page,
    totalPages,
    currentParams,
}: {
    page: number;
    totalPages: number;
    currentParams: SP;
}) {
    const hrefFor = (n: number) => {
        const p = new URLSearchParams();
        for (const [k, v] of Object.entries(currentParams)) {
            if (Array.isArray(v)) for (const item of v) p.append(k, item);
            else if (typeof v === "string") p.set(k, v);
        }
        if (n <= 1) p.delete("page");
        else p.set("page", String(n));
        const qs = p.toString();
        return qs ? `/?${qs}` : "/";
    };

    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPages;
    const pageNumbers = compactPageRange(page, totalPages);
    return (
        <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="text-[var(--muted-foreground)]">
                Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-1.5">
                {prevDisabled ? (
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                ) : (
                    <Button asChild variant="outline" size="sm">
                        <Link href={hrefFor(page - 1)}>Previous</Link>
                    </Button>
                )}
                {pageNumbers.map((n, i) =>
                    n === "…" ? (
                        <span
                            key={`gap-${i}`}
                            className="px-1 text-[var(--muted-foreground)]"
                        >
                            …
                        </span>
                    ) : n === page ? (
                        <Button key={n} variant="default" size="sm" disabled>
                            {n}
                        </Button>
                    ) : (
                        <Button
                            key={n}
                            asChild
                            variant="outline"
                            size="sm"
                        >
                            <Link href={hrefFor(n)}>{n}</Link>
                        </Button>
                    ),
                )}
                {nextDisabled ? (
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                ) : (
                    <Button asChild variant="outline" size="sm">
                        <Link href={hrefFor(page + 1)}>Next</Link>
                    </Button>
                )}
            </div>
        </nav>
    );
}

/** Returns at most 7 entries: always the first + last page, the current
 * page with one neighbour each side, and "…" ellipses to mark gaps. So
 * for page=8 of 20 you get [1, "…", 7, 8, 9, "…", 20]. Keeps the
 * pagination row a fixed visual width regardless of totalPages. */
function compactPageRange(
    current: number,
    total: number,
): Array<number | "…"> {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const out: Array<number | "…"> = [1];
    const left = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);
    if (left > 2) out.push("…");
    for (let i = left; i <= right; i++) out.push(i);
    if (right < total - 1) out.push("…");
    out.push(total);
    return out;
}
