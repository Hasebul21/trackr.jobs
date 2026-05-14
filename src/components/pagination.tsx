// Reusable pagination bar. Caller supplies an `hrefFor(n)` function so
// each page (which has its own query-param shape) can build URLs without
// the component knowing about its other filters. Used by the dashboard
// and the companies directory.

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  totalPages,
  rangeStart,
  rangeEnd,
  total,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  total: number;
  hrefFor: (n: number) => string;
}) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;
  const pageNumbers = compactPageRange(page, totalPages);
  return (
    <nav className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
      <div className="text-[var(--muted-foreground)]">
        Showing {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of{" "}
        {total.toLocaleString()} · page {page} of {totalPages}
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
            <Button key={n} asChild variant="outline" size="sm">
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
export function compactPageRange(
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
