"use client";

import * as React from "react";
import Link from "next/link";
import { useBookmarks } from "@/stores/bookmarks";
import { JobCard } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@/types/job";

export default function BookmarksPage() {
  const [mounted, setMounted] = React.useState(false);
  const [jobs, setJobs] = React.useState<Job[] | null>(null);
  const ids = useBookmarks((s) => Object.keys(s.ids));
  const clear = useBookmarks((s) => s.clear);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration gate
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    if (ids.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- empty list shortcut, no fetch needed
      setJobs([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/jobs?ids=${encodeURIComponent(ids.join(","))}`);
      if (!res.ok) {
        setJobs([]);
        return;
      }
      const data = (await res.json()) as { jobs: Job[] };
      if (!cancelled) setJobs(data.jobs);
    })();
    return () => {
      cancelled = true;
    };
  }, [ids, mounted]);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bookmarks</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {ids.length} saved · stored locally in your browser
          </p>
        </div>
        {ids.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => clear()}>
            Clear all
          </Button>
        )}
      </div>

      {jobs === null ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          hint={
            <>
              Save jobs from the{" "}
              <Link href="/" className="underline">
                dashboard
              </Link>{" "}
              to see them here.
            </> as unknown as string
          }
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      )}
    </div>
  );
}
