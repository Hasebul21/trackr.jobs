import { Separator } from "@/components/ui/separator";
import { getJobStats } from "@/services/jobs";
import { ALL_PROVIDERS } from "@/providers";
import {
  EXCLUDE_TITLE_KEYWORDS,
  INCLUDE_TITLE_KEYWORDS,
  PREFERRED_LOCATIONS,
  PREFERRED_TECHNOLOGIES,
} from "@/lib/preferences";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const stats = await getJobStats();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          The preference lists below drive scoring and filtering. Edit{" "}
          <code className="font-mono text-xs">src/lib/preferences.ts</code> to
          change them.
        </p>
      </header>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-2">
          Data
        </h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Total jobs" value={stats.total.toLocaleString()} />
          <Stat label="Visa-supported" value={stats.withVisa.toLocaleString()} />
          <Stat label="Remote" value={stats.remote.toLocaleString()} />
          <Stat
            label="Last refresh"
            value={
              stats.lastRunAt
                ? new Date(stats.lastRunAt).toLocaleString()
                : "—"
            }
          />
        </dl>
      </section>

      <Separator />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-3">
          Providers
        </h2>
        <ul className="space-y-2">
          {ALL_PROVIDERS.map((p) => {
            const stat = stats.bySource.find((s) => s.source === p.name);
            return (
              <li
                key={p.name}
                className="flex items-center justify-between rounded-md border border-[var(--border)] p-3"
              >
                <div>
                  <div className="font-medium text-sm">{p.label}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {p.reliable
                      ? "Reliable scraper"
                      : "Best-effort — anti-bot defenses may return zero"}
                  </div>
                </div>
                <Badge variant={stat?.count ? "default" : "outline"}>
                  {stat?.count ?? 0} jobs
                </Badge>
              </li>
            );
          })}
        </ul>
      </section>

      <Separator />

      <PrefList title="Preferred technologies" items={PREFERRED_TECHNOLOGIES} />
      <PrefList title="Preferred locations" items={PREFERRED_LOCATIONS} />
      <PrefList title="Include title keywords" items={INCLUDE_TITLE_KEYWORDS} />
      <PrefList title="Exclude title keywords" items={EXCLUDE_TITLE_KEYWORDS} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">
        {label}
      </div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function PrefList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-2">
        {title}
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <Badge key={i} variant="outline">
            {i}
          </Badge>
        ))}
      </div>
    </section>
  );
}
