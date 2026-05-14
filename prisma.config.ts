// Prisma 7+ moved datasource URLs out of schema.prisma. We declare it
// here so `prisma migrate / generate / studio` can find the database,
// and the runtime client (src/lib/prisma.ts) uses the pg driver adapter
// against the same URL.
//
// Note: `prisma generate` only needs the URL to be parseable, not live —
// so we fall back to a placeholder when the env is missing (e.g. on
// Vercel build pre-env-injection). Runtime missing-URL errors are
// raised by src/lib/prisma.ts where they matter.
import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

const url =
  process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: { url },
  migrations: {
    path: path.join("prisma", "migrations"),
  },
});
