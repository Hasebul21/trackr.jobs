"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const value = params.get("sort") ?? "score";
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
      Sort
      <select
        value={value}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value === "score") next.delete("sort");
          else next.set("sort", e.target.value);
          const qs = next.toString();
          router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
        }}
        className="h-8 rounded-md border border-[var(--border)] bg-transparent px-2 text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        <option value="score">Best match</option>
        <option value="recent">Most recent</option>
      </select>
    </label>
  );
}
