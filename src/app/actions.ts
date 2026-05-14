"use server";

// Server actions invoked from client components. Kept small — they
// delegate to services and return plain serializable objects.

import { revalidatePath } from "next/cache";
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
