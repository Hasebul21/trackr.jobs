# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

A personal job aggregator. It fetches software-engineering roles (Japan / SEA / remote, with a visa and relocation focus) from many sources, normalizes them, scores them against the user's preferences, removes duplicates across sources, and serves a filterable dashboard. There are no user accounts.

There are two apps, each with its own `package.json`:
- `backend/`: NestJS 11 (CommonJS), Prisma 7 + PostgreSQL, cheerio.
- `frontend/`: Angular 22 (standalone components, signals, zoneless), ng-zorro-antd (Ant Design) and Tailwind v4.

The old Next.js app may still be present at the repo root (`src/`, root `package.json`). It is legacy and is not deployed.

## Commands

```bash
# backend/
npm run start:dev          # API on :3000, all routes under /api
npm run build              # prisma generate && nest build
npm run lint               # eslint with type-checked rules (runs --fix)
npm run db:migrate:dev     # after editing prisma/schema.prisma
npm run db:migrate         # apply migrations only (prod-safe)
npm run fetch -- -q "Backend Engineer" -l Singapore --source adzuna   # run providers live, no DB writes

# frontend/
npm start                  # :4200, proxies /api to :3000 (proxy.conf.json)
npx ng build
```

There is no test suite. To check a change, run `npm run lint` and `npm run build` in `backend/`, `npx ng build` in `frontend/`, and `npm run fetch` for provider work. Set `SEED_MOCK=1` in `backend/.env` to include the deterministic `mock` provider, since most scrapers return nothing from blocked IPs.

## Backend architecture

- **Ingest** (`src/ingest/`): `IngestService.runIngest()` runs every provider from `getProviders()` in parallel, writing a `FetchRun` row for each. The steps are:
  1. `matchesAllowedTitle` filter (`src/config/preferences.ts`)
  2. `normalizeJob` → `scoreJob`
  3. drop IDs that are in `AppliedJob`
  4. `dedupeJobs`
  5. upsert rows one at a time

  If an ingest is already running, a new call shares that run. `POST /api/refresh` (the UI button) has a 2-minute cooldown. `/api/cron/refresh` is protected by `CronSecretGuard`, which accepts only the `Authorization: Bearer` header. `IngestScheduler` runs every 2 hours, but only when `ENABLE_CRON=1`.
- **Providers** (`src/providers/*.provider.ts`): each one implements `JobProvider` and returns `RawJob[]`. Register providers in `src/providers/index.ts`. `ALL_PROVIDERS` feeds the settings endpoint and the fetcher script. The ATS providers (`greenhouse-ats`, `lever-ats`, `ashby-ats`) each have a `COMPANIES` list. Providers that need keys skip themselves when their env vars are missing.
- **Identity and dedup**: `Job.id = hashId(source, sourceJobId)`. `source` is stored in the DB, so never rename a provider's `name`: the existing rows would be orphaned. Dedup tries the same `applyUrl` first, then the same `fingerprint`, then a fuzzy match (same company, title Jaccard ≥ 0.7). When duplicates collapse, the higher score wins, then the newer `postedAt`.
- **Applied jobs are tombstones**: `JobsService.markApplied` deletes the `Job` row and writes an `AppliedJob` row in one transaction, so the posting isn't re-imported.
- **Read side** (`src/jobs/`): `parseJobFilters` caps the size of its inputs. `requirements`, `tags` and `technologies` are stored as JSON-encoded TEXT, not Postgres arrays, and are converted back to arrays in `JobsService`. The schema has to stay compatible with the existing production database.
- **Prisma 7**: `schema.prisma` has no datasource URL; the CLI reads it from `prisma.config.ts`. `PrismaService` extends `PrismaClient` and uses the `@prisma/adapter-pg` driver adapter (pool max 5). `PrismaModule` is global.

## Frontend architecture

- All HTTP calls go through `src/app/core/api.service.ts`. The types are in `core/models.ts`.
- Routes are lazy-loaded in `app.routes.ts`. Dashboard filters live in URL query params (`q`, `source`, `country`, `level`, `visa`, `remote`, `days`, `sort`, `page`), so every view is bookmarkable.
- Bookmarks and hidden companies are signal-based services backed by `localStorage`. They keep the old zustand keys (`job-stes:bookmarks:v1`, `job-stes:hidden-companies:v1`) and the `{state, version}` format. Don't change either, or existing bookmarks are lost.
- **Styling**: Tailwind v4 plus the design tokens in `src/tokens.css` and `src/styles.css`. Ant's CSS is imported into the cascade layer `antd`, ordered `theme, base, antd, components, utilities`, so Tailwind utility classes override Ant. Dark mode puts `.dark` on `<html>` and loads the `ant-dark.css` bundle at runtime.
- Job data is scraped third-party content. Render it with `{{ }}` interpolation only, never `[innerHTML]`.
- `/information` is static CV content in `pages/information/information.data.ts`. The company directory pages read their lists from `*.data.ts` files next to each page.

## Deployment

There is one Vercel project with two services (`vercel.json`): `/api/*` goes to `backend`, and everything else goes to `frontend`, which has an SPA fallback to `index.html`. Vercel Cron runs daily. `.github/workflows/refresh.yml` hits `/api/cron/refresh` every 2 hours. See `deploy.md`.
