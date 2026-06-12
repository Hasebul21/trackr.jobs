"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type Facets = {
  sources: { source: string; count: number }[];
  countries: string[];
};

// Fixed target countries — kept here (not derived from facets) so all
// are always selectable even when a given country has zero jobs
// in the current dataset. Order is the user's preferred priority.
const COUNTRY_OPTIONS = [
  "Bangladesh",
  "Japan",
  "Singapore",
  "Malaysia",
  "Thailand",
];

const SENIORITY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "junior", label: "Junior" },
];

const POSTED_OPTIONS = [
  { value: "1", label: "Last 24h" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];

export function FiltersPanel({ facets }: { facets: Facets }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = React.useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      next.delete("page");
      const qs = next.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [router, pathname, params],
  );

  const toggleArrayParam = (key: string, value: string) =>
    update((p) => {
      const cur = p.getAll(key);
      if (cur.includes(value)) {
        p.delete(key);
        for (const v of cur.filter((x) => x !== value)) p.append(key, v);
      } else {
        p.append(key, value);
      }
    });

  const setBoolParam = (key: string, on: boolean) =>
    update((p) => {
      if (on) p.set(key, "1");
      else p.delete(key);
    });

  const setStringParam = (key: string, value: string | null) =>
    update((p) => {
      if (value) p.set(key, value);
      else p.delete(key);
    });

  const isOn = (key: string) => params.get(key) === "1";
  const isInArr = (key: string, v: string) => params.getAll(key).includes(v);
  const has = params.toString().length > 0;

  const countrySelected = params.getAll("country").length;
  const senioritySelected = params.getAll("level").length;
  const sourceSelected = params.getAll("source").length;
  const visaRemoteSelected =
    (isOn("visa") ? 1 : 0) + (isOn("remote") ? 1 : 0);
  const postedSelected = params.get("days") ? 1 : 0;

  return (
    // Pane sticks under the navbar (top-14 = 56px) and caps its height
    // to the remaining viewport. Internal scroll on overflow so long
    // Source/Country lists never push the dashboard down on a 12"
    // laptop (~800px viewport height).
    <aside className="w-full shrink-0 self-start lg:sticky lg:top-14 lg:w-60">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] lg:max-h-[calc(100vh-4.5rem)] lg:overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider">
            Filters
          </h2>
          {has && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => router.replace(pathname)}
            >
              Clear all
            </Button>
          )}
        </div>

        <Group label="Country" count={countrySelected}>
          {COUNTRY_OPTIONS.map((c) => (
            <CheckRow
              key={c}
              label={c}
              checked={isInArr("country", c)}
              onChange={() => toggleArrayParam("country", c)}
            />
          ))}
        </Group>

        <Group label="Visa & remote" count={visaRemoteSelected}>
          <SwitchRow
            label="Visa sponsorship"
            checked={isOn("visa")}
            onChange={(v) => setBoolParam("visa", v)}
          />
          <SwitchRow
            label="Remote only"
            checked={isOn("remote")}
            onChange={(v) => setBoolParam("remote", v)}
          />
        </Group>

        <Group label="Seniority" count={senioritySelected}>
          <div className="flex flex-wrap gap-1.5">
            {SENIORITY_OPTIONS.map((o) => {
              const active = isInArr("level", o.value);
              return (
                <Button
                  key={o.value}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  className="h-6 px-2 text-[11px]"
                  onClick={() => toggleArrayParam("level", o.value)}
                >
                  {o.label}
                </Button>
              );
            })}
          </div>
        </Group>

        <Group label="Posted" count={postedSelected}>
          <div className="flex flex-wrap gap-1.5">
            {POSTED_OPTIONS.map((o) => {
              const active = params.get("days") === o.value;
              return (
                <Button
                  key={o.value}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  className="h-6 px-2 text-[11px]"
                  onClick={() =>
                    setStringParam("days", active ? null : o.value)
                  }
                >
                  {o.label}
                </Button>
              );
            })}
          </div>
        </Group>

        <Group label="Source" count={sourceSelected} last>
          {facets.sources.length === 0 ? (
            <p className="text-[11px] text-[var(--muted-foreground)]">
              No data yet.
            </p>
          ) : (
            facets.sources.map((s) => (
              <CheckRow
                key={s.source}
                label={s.source}
                count={s.count}
                checked={isInArr("source", s.source)}
                onChange={() => toggleArrayParam("source", s.source)}
              />
            ))
          )}
        </Group>
      </div>
    </aside>
  );
}

/** Collapsible accordion section. Uses native <details> for zero-JS
 * disclosure; the chevron rotates via the `details[open]` CSS state.
 * All groups start expanded — matches the typical e-commerce default
 * where the user sees every filter at once and only collapses what
 * they don't care about. */
function Group({
  label,
  count,
  last = false,
  children,
}: {
  label: string;
  count: number;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open
      className={`group/section ${last ? "" : "border-b border-[var(--border)]"}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 hover:bg-[var(--muted)]/40 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
          {label}
          {count > 0 && (
            <span className="rounded-full bg-[var(--gain-50)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--gain-700)]">
              {count}
            </span>
          )}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)] transition-transform group-open/section:rotate-180" />
      </summary>
      <div className="space-y-0.5 px-3 pb-3">{children}</div>
    </details>
  );
}

/** Checkbox row in the classic e-commerce style: the entire row is a
 * click target, label on the left, optional count on the right, with
 * a hover background. */
function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="-mx-1.5 flex cursor-pointer items-center justify-between gap-2 rounded px-1.5 py-1 text-xs hover:bg-[var(--muted)]/40">
      <span className="flex min-w-0 items-center gap-2">
        <Checkbox checked={checked} onCheckedChange={onChange} />
        <span className="truncate">{label}</span>
      </span>
      {typeof count === "number" && (
        <span className="text-[11px] tabular-nums text-[var(--muted-foreground)]">
          {count}
        </span>
      )}
    </label>
  );
}

/** Switch row for boolean filters (visa / remote / has salary). Same
 * row shape as CheckRow so the column reads as one consistent list. */
function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="-mx-1.5 flex cursor-pointer items-center justify-between gap-2 rounded px-1.5 py-1 text-xs hover:bg-[var(--muted)]/40">
      <span className="truncate">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
