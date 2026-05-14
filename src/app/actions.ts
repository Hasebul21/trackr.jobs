"use server";

// Server actions invoked from client components. Kept small — they
// delegate to services and return plain serializable objects.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { runIngest, type IngestReport } from "@/services/ingest";

/** Triggered by the navbar Refresh button. In a production deployment
 * you'd protect this with auth or rate limiting; for a personal tool on
 * a private URL it's fine to leave open. */
export async function refreshAction(): Promise<{
  ok: boolean;
  totalUpserted: number;
  bySource: IngestReport["bySource"];
}> {
  const report = await runIngest();
  revalidatePath("/");
  return {
    ok: true,
    totalUpserted: report.totalUpserted,
    bySource: report.bySource,
  };
}

/** Marks a job as applied: writes a tombstone (so future cron ticks
 * skip the same posting) and deletes the Job row in the same
 * transaction. Both halves run together so the row can never disappear
 * without leaving a tombstone behind. */
export async function markAppliedAction(
  id: string,
): Promise<{ ok: boolean; reason?: string }> {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return { ok: false, reason: "not_found" };

  await prisma.$transaction([
    prisma.appliedJob.upsert({
      where: { id },
      create: {
        id,
        source: job.source,
        title: job.title,
        company: job.company,
        applyUrl: job.applyUrl,
      },
      update: { appliedAt: new Date() },
    }),
    prisma.job.delete({ where: { id } }),
  ]);

  revalidatePath("/");
  return { ok: true };
}
