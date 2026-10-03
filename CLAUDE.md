# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

(`node_modules/next/dist/docs/` only exists after `npm install`.)

## What this is

A personal job aggregator. It fetches software-engineering roles (Japan / SEA / remote, with a visa and relocation focus) from many sources, normalizes them, scores them against the user's preferences, dedups across sources, and serves a filterable dashboard. There are no user accounts. Stack: Next.js 16 App Router, React 19, Prisma 7 + PostgreSQL, Tailwind v4, Radix UI, Zustand.

## Commands

```bash
npm run dev               # dev server on :3000
npm run build             # prisma generate && next build
npm run lint              # eslint (flat config, eslint.config.mjs)
npm run db:migrate:dev    # create + apply a migration after editing prisma/schema.prisma
npm run db:migrate        # apply existing migrations only (prod-safe)
npm run db:studio
npm run fetch -- -q "Backend Engineer" -l Singapore --source adzuna   # run providers live, print a table, no DB writes
```

There is no test suite. Check changes with `npm run lint`, `npx tsc --noEmit`, and `npm run fetch` for provider work.

Trigger an ingest locally: `curl "http://localhost:3000/api/cron/refresh?secret=$CRON_SECRET"`. Add `SEED_MOCK=1` to the dev server env to include the deterministic `mock` provider, since most scrapers return nothing from blocked IPs.

## Architecture

**Ingest pipeline** (`src/services/ingest.ts` → `runIngest()`): all providers from `getProviders()` run in parallel, and each one writes a `FetchRun` row. The steps are: `matchesAllowedTitle` filter (`src/lib/preferences.ts`) → `normalizeJob` → `scoreJob` → drop IDs that are in `AppliedJob` → `dedupeJobs` → upsert rows one at a time. One failing provider is recorded on its `FetchRun` and doesn't abort the run. Ingest is triggered from three places:
- `src/app/api/cron/refresh/route.ts`, which accepts `Authorization: Bearer $CRON_SECRET` or `?secret=`. `maxDuration` is 60 seconds.
- `refreshAction` in `src/app/actions.ts` (the navbar Refresh button).
- Schedulers. `vercel.json` runs a cron daily at 03:00 UTC (the Hobby-plan limit). `.github/workflows/refresh.yml` hits the endpoint every 2 hours with the `APP_URL` and `CRON_SECRET` repo secrets.

**Providers** (`src/providers/`): each one implements `JobProvider` (`types.ts`) and returns `RawJob[]`. Set `reliable: false` on anti-bot scrapers; it controls the "may be incomplete" warning on the Settings page. To add a provider, register it in **both** `getProviders()` and `ALL_PROVIDERS` in `src/providers/index.ts`. `ALL_PROVIDERS` is what `scripts/fetcher.ts` uses. Generic ATS providers (`greenhouse-ats`, `lever-ats`, `ashby-ats`) and `remote-platforms` export arrays of providers. To add a company to an ATS provider, append an entry to its `COMPANIES` list. Providers that need API keys (Adzuna, Careerjet, TheirStack, RapidAPI LinkedIn/JSearch) skip themselves with a warning when their env vars are missing. See `.env.example`.

**Identity and dedup.** `Job.id` is a hash of `source` + `sourceJobId`. `Job.source` is the provider's stable `name` and is stored in the DB, so never rename an existing source key: the old rows would be orphaned. `dedup.ts` collapses duplicates in this order: same `applyUrl`, then same `fingerprint` (normalized company + title), then fuzzy match (same company with title Jaccard ≥ 0.7). When duplicates collapse, the higher `matchedScore` wins, and if scores tie, the newer `postedAt` wins.

**Applied jobs are tombstones.** `markAppliedAction` deletes the `Job` row and upserts an `AppliedJob` row in one transaction. Ingest filters against `AppliedJob`, so the posting doesn't come back.

**Scoring and filtering config** is all in `src/lib/preferences.ts`: title allow and deny lists, preferred tech and locations, visa phrases, country hints. Change it, then run a refresh to re-score. No migration is needed.

**Read side.** `src/services/jobs.ts` (`queryJobs`, `getFacets`, `getJobStats`) is used by server-component pages. URL params map to `JobFilters` through `src/lib/search-params.ts`. `requirements`, `tags`, and `technologies` are stored as **JSON-encoded TEXT**, not Postgres arrays. Write them with `JSON.stringify` (see `upsertJob`); `jobs.ts` parses them on read.

**Client-only state.** Bookmarks (`src/stores/bookmarks.ts`) and hidden companies (`src/stores/hidden-companies.ts`) are Zustand stores persisted to `localStorage`. They are never stored on the server. `/api/jobs` hydrates bookmarked IDs into full jobs.

**`/information`** is a static "master application profile" page. Its content is hardcoded in `src/app/information/view.tsx`, a client component whose active section follows the URL hash. It doesn't use the DB.

## Prisma 7 specifics

- `schema.prisma` has no datasource `url`. The CLI reads it from `prisma.config.ts`, which loads `dotenv` and falls back to a placeholder so `prisma generate` works without a database. At runtime, `src/lib/prisma.ts` builds the client with the `@prisma/adapter-pg` driver adapter (pool `max: 5`) and keeps a `globalThis` singleton.
- The client generates into the default `@prisma/client` location (there's a postinstall hook). Run `prisma generate` after schema changes.
- Routes that touch Prisma or cheerio declare `export const runtime = "nodejs"`.

## Gotchas

- README's "Project structure" section is out of date: it lists 7 providers and fewer pages than exist. Use `src/` as the source of truth.
- `deploy.md` and some comments still use the old project name "job·stes" / `job-stes`, including the `localStorage` key prefix. Don't rename persisted keys casually, because existing bookmarks would be lost.
- Path alias: `@/*` → `src/*`.
