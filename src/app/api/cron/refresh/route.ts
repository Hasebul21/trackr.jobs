// Vercel Cron hits this every 2h (see vercel.json). Auth is by the
// shared CRON_SECRET in the Authorization header — Vercel injects it
// for cron requests, and we also accept manual `?secret=` for ad-hoc
// curl testing.
import { NextResponse } from "next/server";
import { runIngest } from "@/services/ingest";

export const runtime = "nodejs"; // need node, not edge (Prisma + cheerio)
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") ?? "";
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const report = await runIngest();
  return NextResponse.json({
    ok: true,
    durationMs: report.finishedAt.getTime() - report.startedAt.getTime(),
    totalFetched: report.totalFetched,
    totalUpserted: report.totalUpserted,
    bySource: report.bySource,
  });
}

// Vercel Cron uses GET, but we expose POST too for parity.
export const POST = GET;
