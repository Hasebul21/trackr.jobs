// Prisma 7 requires a driver adapter at runtime. We use `pg` so the
// client runs anywhere Node runs — Vercel serverless, Node servers,
// Docker. The same adapter works against Neon, Supabase, Vercel
// Postgres, and self-hosted Postgres.
//
// Singleton pattern keeps a single PrismaClient (and therefore a single
// `pg.Pool`) across HMR reloads in dev.
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL;

declare global {
  var __prisma: PrismaClient | undefined;
}

function makeClient(): PrismaClient {
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Configure a PostgreSQL connection string " +
      "(see .env.example) before starting the app.",
    );
  }
  // Small pool — Vercel's serverless instances are short-lived and we
  // don't want to exhaust Neon/Supabase connection limits.
  const adapter = new PrismaPg({ connectionString: url, max: 5 });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  globalThis.__prisma ?? (globalThis.__prisma = makeClient());
