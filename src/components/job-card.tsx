import Link from "next/link";
import { ExternalLink, MapPin, Coins, Plane } from "lucide-react";
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

function ScoreChip({ score }: { score: number }) {
  const color =
    score >= 100
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : score >= 50
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        : "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]";
  return (
    <span
      title="Relevance score"
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-mono ${color}`}
    >
      {score}
    </span>
  );
}

export function JobCard({ job }: { job: Job }) {
  const summary = job.description.slice(0, 180).replace(/\s+/g, " ");
  const techs = job.technologies.slice(0, 5);
  return (
    <Card className="group flex flex-col h-full hover:border-[var(--ring)]/40 hover:shadow-md transition">
      <CardHeader>
        <div className="flex items-start gap-3">
          {job.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.companyLogo}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-md object-contain bg-white p-0.5 border border-[var(--border)]"
              loading="lazy"
            />
          ) : (
            <div className="h-8 w-8 rounded-md bg-[var(--muted)] grid place-items-center text-xs font-mono text-[var(--muted-foreground)]">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <Link
              href={`/jobs/${job.id}`}
              className="font-semibold text-[var(--foreground)] leading-tight line-clamp-2 hover:underline"
            >
              {job.title}
            </Link>
            <div className="text-sm text-[var(--muted-foreground)] truncate">
              {job.company === "Unknown" ? sourceLabel(job.source) : job.company}
            </div>
          </div>
          <ScoreChip score={job.matchedScore} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2">
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
          {job.seniority !== "unknown" && (
            <Badge variant="outline">{job.seniority}</Badge>
          )}
        </div>
        {summary && (
          <p className="text-sm text-[var(--muted-foreground)] line-clamp-3">
            {summary}
            {job.description.length > 180 ? "…" : ""}
          </p>
        )}
        <div className="text-xs text-[var(--muted-foreground)]">
          via <span className="font-medium text-[var(--foreground)]">{sourceLabel(job.source)}</span>
        </div>
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
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
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/jobs/${job.id}`}>View details</Link>
        </Button>
        <div className="flex items-center gap-1.5">
          <BookmarkButton id={job.id} iconOnly />
          <MarkAppliedButton id={job.id} title={job.title} />
          <Button asChild size="sm">
            <a href={job.applyUrl} target="_blank" rel="noreferrer noopener">
              Apply <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
