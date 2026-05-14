// Tiny lookup endpoint used by the (client-rendered) bookmarks page to
// hydrate the locally-stored ID list into real job rows. We don't expose
// search/filter here — the dashboard reads directly from the DB.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ids = (url.searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 200);
  if (ids.length === 0) return NextResponse.json({ jobs: [] });

  const rows = await prisma.job.findMany({ where: { id: { in: ids } } });
  // Mirror the rehydration in services/jobs.ts but inlined to keep the
  // response payload focused.
  const jobs = rows.map((r) => ({
    ...r,
    requirements: safe(r.requirements),
    tags: safe(r.tags),
    technologies: safe(r.technologies),
  }));
  return NextResponse.json({ jobs });
}

function safe(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
