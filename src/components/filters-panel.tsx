"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Facets = {
  sources: { source: string; count: number }[];
  countries: string[];
};

const TECH_OPTIONS = [
  "Java",
  "Kotlin",
  "Spring",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "React",
  "TypeScript",
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

  return (
    <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-16 self-start">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Filters</h2>
          {has && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.replace(pathname)}
            >
              Clear
            </Button>
          )}
        </div>

        <Group label="Country">
          {facets.countries.length === 0 && (
            <p className="text-xs text-[var(--muted-foreground)]">
              No data yet.
            </p>
          )}
          {facets.countries.map((c) => (
            <Row
              key={c}
              label={c}
              control={
                <Checkbox
                  checked={isInArr("country", c)}
                  onCheckedChange={() => toggleArrayParam("country", c)}
                />
              }
            />
          ))}
        </Group>

        <Separator />

        <Group label="Visa & remote">
          <Row
            label="Visa sponsorship"
            control={
              <Switch
                checked={isOn("visa")}
                onCheckedChange={(v) => setBoolParam("visa", !!v)}
              />
            }
          />
          <Row
            label="Remote only"
            control={
              <Switch
                checked={isOn("remote")}
                onCheckedChange={(v) => setBoolParam("remote", !!v)}
              />
            }
          />
          <Row
            label="Has salary"
            control={
              <Switch
                checked={isOn("salary")}
                onCheckedChange={(v) => setBoolParam("salary", !!v)}
              />
            }
          />
        </Group>

        <Separator />

        <Group label="Seniority">
          {SENIORITY_OPTIONS.map((o) => (
            <Row
              key={o.value}
              label={o.label}
              control={
                <Checkbox
                  checked={isInArr("level", o.value)}
                  onCheckedChange={() => toggleArrayParam("level", o.value)}
                />
              }
            />
          ))}
        </Group>

        <Separator />

        <Group label="Tech stack">
          <div className="grid grid-cols-2 gap-2">
            {TECH_OPTIONS.map((t) => (
              <Row
                key={t}
                label={t}
                control={
                  <Checkbox
                    checked={isInArr("tech", t)}
                    onCheckedChange={() => toggleArrayParam("tech", t)}
                  />
                }
              />
            ))}
          </div>
        </Group>

        <Separator />

        <Group label="Posted">
          <div className="flex flex-wrap gap-1.5">
            {POSTED_OPTIONS.map((o) => {
              const active = params.get("days") === o.value;
              return (
                <Button
                  key={o.value}
                  size="sm"
                  variant={active ? "default" : "outline"}
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

        <Separator />

        <Group label="Source">
          {facets.sources.length === 0 && (
            <p className="text-xs text-[var(--muted-foreground)]">
              No data yet.
            </p>
          )}
          {facets.sources.map((s) => (
            <Row
              key={s.source}
              label={`${s.source} (${s.count})`}
              control={
                <Checkbox
                  checked={isInArr("source", s.source)}
                  onCheckedChange={() =>
                    toggleArrayParam("source", s.source)
                  }
                />
              }
            />
          ))}
        </Group>
      </div>
    </aside>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({
  label,
  control,
}: {
  label: string;
  control: React.ReactNode;
}) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer text-sm">
      <span className="truncate">{label}</span>
      {control}
    </label>
  );
}
