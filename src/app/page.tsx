// Dashboard. Server component: parses URL ?filters, queries Postgres,
// renders the FiltersPanel sidebar + a grid of JobCards. All filter
// changes go through URL params so the page stays bookmarkable.

import Link from "next/link";
import { Suspense } from "react";
import { FiltersPanel } from "@/components/filters-panel";
import { JobCard } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { SortSelect } from "@/components/sort-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    // 9 = 3 rows × 3 cols on the dashboard grid. Sized so the first
    // page fits in roughly one viewport, keeping the scroll required to
    // see "Page 1 of N" short while still making pagination meaningful.
    const pageSize = filters.pageSize ?? 9;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const rangeEnd = Math.min(total, page * pageSize);

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-3">
            <header className="mb-3 flex flex-wrap items-center justify-end gap-3">
                <Badge variant="outline">
                    {total.toLocaleString()} match{total === 1 ? "" : "es"}
                </Badge>
                <SortSelect />
            </header>

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
    rangeStart,
    rangeEnd,
    total,
    currentParams,
}: {
    page: number;
    totalPages: number;
    rangeStart: number;
    rangeEnd: number;
    total: number;
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
                Showing {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()}{" "}
                of {total.toLocaleString()} · page {page} of {totalPages}
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
