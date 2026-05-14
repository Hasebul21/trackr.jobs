import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Coins,
  Plane,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookmarkButton } from "@/components/bookmark-button";
import { getJob } from "@/services/jobs";
import { formatRelative } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <header className="flex items-start gap-4">
        {job.companyLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={job.companyLogo}
            alt=""
            className="h-14 w-14 rounded-lg object-contain bg-white p-1 border border-[var(--border)]"
          />
        ) : (
          <div className="h-14 w-14 rounded-lg bg-[var(--muted)] grid place-items-center font-mono text-[var(--muted-foreground)]">
            {job.company.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight leading-tight">
            {job.title}
          </h1>
          <div className="text-[var(--muted-foreground)] mt-1">
            {job.company}
            {job.postedAt && (
              <span className="ml-2 text-xs">
                · posted {formatRelative(job.postedAt)}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-[var(--muted-foreground)]">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {job.location || "—"}
        </span>
        {job.salary && (
          <span className="inline-flex items-center gap-1">
            <Coins className="h-4 w-4" /> {job.salary}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Globe className="h-4 w-4" /> {job.source}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.visaSupport && (
          <Badge variant="success">
            <Plane className="h-3 w-3" /> Visa sponsorship
          </Badge>
        )}
        {job.relocation && <Badge variant="info">Relocation support</Badge>}
        {job.remote && <Badge variant="info">Remote</Badge>}
        {job.seniority !== "unknown" && (
          <Badge variant="outline">{job.seniority}</Badge>
        )}
        <Badge variant="default">score {job.matchedScore}</Badge>
      </div>

      <div className="flex gap-2 mt-5">
        <Button asChild>
          <a href={job.applyUrl} target="_blank" rel="noreferrer noopener">
            Apply on {job.source} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
        <BookmarkButton id={job.id} />
      </div>

      <Separator className="my-6" />

      {job.technologies.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-2">
            Technologies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {job.technologies.map((t) => (
              <Badge key={t} variant="accent">
                {t}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {job.requirements.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-2">
            Requirements
          </h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {job.requirements.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-2">
          Description
        </h2>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {job.description || "No description available — open the source link for full details."}
        </p>
      </section>

      <div className="mt-8 text-xs text-[var(--muted-foreground)]">
        Source:{" "}
        <a
          href={job.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="underline"
        >
          {job.sourceUrl}
        </a>
      </div>
    </div>
  );
}
