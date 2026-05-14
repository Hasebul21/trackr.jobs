// Five-card metric strip that sits below the page header. Mirrors the
// V1 mockup: big number on top, small uppercase label beneath. Visa
// gets the success/green tint and Remote the info/blue tint so they
// stand out from neutral counts.

import { formatRelative } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type StatsStripProps = {
  total: number;
  withVisa: number;
  remote: number;
  sources: number;
  lastRunAt: Date | null;
};

export function StatsStrip({
  total,
  withVisa,
  remote,
  sources,
  lastRunAt,
}: StatsStripProps) {
  const since = lastRunAt ? formatRelative(lastRunAt) : "—";
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 sm:grid-cols-3 lg:grid-cols-5">
      <Stat value={total.toLocaleString()} label="Total jobs" />
      <Stat
        value={withVisa.toLocaleString()}
        label="With visa support"
        tone="success"
      />
      <Stat value={remote.toLocaleString()} label="Remote" tone="info" />
      <Stat value={sources.toLocaleString()} label="Sources" />
      <Stat value={since} label="Since refresh" />
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone?: "success" | "info";
}) {
  return (
    <div className="rounded-md px-4 py-3">
      <div
        className={cn(
          "text-2xl font-semibold leading-tight tracking-tight",
          tone === "success" && "text-[var(--gain-700)]",
          tone === "info" && "text-[var(--accent-700)]",
        )}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </div>
    </div>
  );
}
