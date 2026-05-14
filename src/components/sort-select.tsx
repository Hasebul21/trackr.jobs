"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const value = params.get("sort") ?? "score";
  return (
    <div className="inline-flex h-8 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 text-sm">
      <span className="text-[var(--muted-foreground)]">Sort:</span>
      <select
        value={value}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value === "score") next.delete("sort");
          else next.set("sort", e.target.value);
          const qs = next.toString();
          router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
        }}
        className="bg-transparent pr-1 text-[var(--foreground)] focus-visible:outline-none"
      >
        <option value="score">Relevance</option>
        <option value="recent">Most recent</option>
        <option value="country">By country</option>
      </select>
    </div>
  );
}
