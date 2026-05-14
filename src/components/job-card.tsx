import Link from "next/link";
import { MapPin, Coins, Plane } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "./bookmark-button";
import { MarkAppliedButton } from "./mark-applied-button";
import type { Job } from "@/types/job";
import { formatRelative } from "@/lib/utils";

const SOURCE_LABELS: Record<string, string> = {
  tokyodev: "TokyoDev",
  japandev: "Japan Dev",
  relocate: "Relocate.me",
  techinasia: "Tech in Asia",
  jobstreet: "JobStreet",
  linkedin: "LinkedIn",
  jaabz: "Jaabz",
  paypay: "PayPay",
  moneylion: "MoneyLion",
  agoda: "Agoda",
  grab: "Grab",
  woven: "Woven by Toyota",
  booking: "Booking.com",
  airasia: "AirAsia",
  astro: "Astro Malaysia",
  rakuten: "Rakuten",
  adzuna: "Adzuna",
  careerjet: "Careerjet",
  theirstack: "TheirStack",
  mock: "Sample",
};

function sourceLabel(source: string) {
  return SOURCE_LABELS[source] ?? source;
}

/** Two-letter initials for the avatar tile. We try the first two
 * meaningful words ("MoneyLion" → "ML", "Booking.com" → "Bo") rather
 * than the first two letters, which would give "Mo" / "Bo" anyway but
 * fails for things like "AirAsia" → "AA" vs "Ai". */
function initials(company: string): string {
  const cleaned = company.replace(/\.(com|sg|my|jp|co|io)$/i, "").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0]![0]! + words[1]![0]!).toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

function ScoreChip({ score }: { score: number }) {
  const color =
    score >= 100
      ? "bg-[var(--gain-50)] text-[var(--gain-700)] border-[var(--gain-200)]"
      : score >= 50
        ? "bg-[var(--warn-50)] text-[var(--warn-700)] border-[var(--warn-200)]"
        : "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]";
  return (
    <span
      title="Relevance score"
      className={`inline-flex shrink-0 items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums ${color}`}
    >
      {score}
    </span>
  );
}

export function JobCard({ job }: { job: Job }) {
  const summary = job.description.slice(0, 180).replace(/\s+/g, " ");
  const techs = job.technologies.slice(0, 3);
  const company =
    job.company === "Unknown" ? sourceLabel(job.source) : job.company;
  return (
    <Card className="group flex h-full flex-col transition hover:border-[var(--ring)]/40 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          {job.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.companyLogo}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-md border border-[var(--border)] bg-white object-contain p-0.5"
              loading="lazy"
            />
          ) : (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--muted)] text-xs font-semibold text-[var(--muted-foreground)]">
              {initials(company)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <Link
              href={`/jobs/${job.id}`}
              className="font-semibold leading-tight text-[var(--foreground)] line-clamp-2 hover:underline"
            >
              {job.title}
            </Link>
            <div className="truncate text-sm text-[var(--muted-foreground)]">
              {company}
            </div>
          </div>
          <ScoreChip score={job.matchedScore} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2 pt-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {job.location || "—"}
          </span>
          {job.salary && (
            <span className="inline-flex items-center gap-1">
              <Coins className="h-3.5 w-3.5" /> {job.salary}
            </span>
          )}
          {job.postedAt && <span>{formatRelative(job.postedAt)}</span>}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {job.visaSupport && (
            <Badge variant="success">
              <Plane className="h-3 w-3" /> Visa
            </Badge>
          )}
          {job.remote && <Badge variant="info">Remote</Badge>}
          {job.relocation && !job.visaSupport && (
            <Badge variant="info">Relocation</Badge>
          )}
          {techs.map((t) => (
            <Badge key={t} variant="accent">
              {t}
            </Badge>
          ))}
          {job.technologies.length > techs.length && (
            <Badge variant="outline">
              +{job.technologies.length - techs.length}
            </Badge>
          )}
        </div>

        {summary && (
          <p className="line-clamp-3 text-sm text-[var(--muted-foreground)]">
            {summary}
            {job.description.length > 180 ? "…" : ""}
          </p>
        )}
      </CardContent>

      <CardFooter className="mt-auto justify-between">
        <div className="text-xs text-[var(--muted-foreground)]">
          via{" "}
          <span className="font-medium text-[var(--foreground)]">
            {sourceLabel(job.source)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <BookmarkButton id={job.id} iconOnly />
          <MarkAppliedButton id={job.id} title={job.title} />
          <Button
            asChild
            size="sm"
            className="bg-[var(--gain-700)] text-[var(--bg-canvas)] hover:bg-[var(--gain-600)]"
          >
            <a href={job.applyUrl} target="_blank" rel="noreferrer noopener">
              Apply
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
