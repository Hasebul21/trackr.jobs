# Trackr.jobs API

NestJS 11 backend for Trackr.jobs. It runs the job providers, stores the results in PostgreSQL through Prisma, and serves the JSON API that the Angular app reads. Every route is under `/api`.

## Getting started

```bash
cp .env.example .env      # set DATABASE_URL and CRON_SECRET at minimum
npm install
npm run db:migrate:dev    # create the tables in your local database
npm run start:dev         # http://localhost:3000/api, restarts on changes
```

If `npm install` warns that install scripts were skipped (npm 11 does this), run `npx prisma generate` once yourself.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run start:dev` | Dev server with watch mode |
| `npm run build` | `prisma generate` + `nest build` into `dist/` |
| `npm run start:prod` | Run the compiled app (`node dist/main`) |
| `npm run lint` | ESLint with type-aware rules (auto-fixes what it can) |
| `npm run format` | Prettier over `src/` |
| `npm run db:migrate:dev` | Create and apply a migration after editing `prisma/schema.prisma` |
| `npm run db:migrate` | Apply existing migrations only. Use this against production |
| `npm run db:studio` | Browse the database in Prisma Studio |
| `npm run fetch -- ...` | Run providers live and print the results without touching the database (see below) |

## Environment variables

See `.env.example` for the full list with comments.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string. Use the pooled URL on serverless hosts |
| `CRON_SECRET` | yes | Bearer token for `/api/cron/refresh` |
| `PORT` | no | Defaults to 3000 |
| `FRONTEND_URL` | no | Allowed CORS origin. Defaults to `http://localhost:4200` |
| `ENABLE_CRON` | no | `1` runs an ingest every 2 hours inside the process. Only useful on a long-running server |
| `SEED_MOCK` | no | `1` adds the sample-data provider to every ingest. Never set it in production |
| `ADZUNA_*`, `CAREERJET_AFFILIATE_ID`, `THEIRSTACK_API_KEY`, `LINKEDIN_RAPIDAPI_*`, `JSEARCH_*` | no | API keys for optional providers. A provider without its key skips itself |

## Project layout

```
src/
├── main.ts                  bootstrap: /api prefix, CORS
├── app.module.ts
├── prisma/                  PrismaService (pg driver adapter, pool of 5), global module
├── jobs/                    read API: list/filter, lookup, facets, stats, mark applied
│   ├── job-filters.ts       query string → JobFilters (with size limits)
│   └── job.types.ts         Job, RawJob, JobFilters
├── ingest/                  write side
│   ├── ingest.service.ts    runs providers → normalize → score → dedup → upsert
│   ├── normalize.ts         RawJob → Job (ids, fingerprints, inferred flags)
│   ├── scoring.ts           relevance score
│   ├── dedup.ts             collapse the same role across sources
│   ├── ingest.controller.ts /api/refresh and /api/cron/refresh
│   ├── cron-secret.guard.ts Bearer CRON_SECRET check
│   └── ingest.scheduler.ts  optional 2-hourly run (ENABLE_CRON=1)
├── settings/                provider list + scoring preferences for the settings page
├── providers/               one file per job source, plus the registry in index.ts
├── config/preferences.ts    what makes a job relevant (edit this to retune)
└── common/                  fetch wrapper with timeout/UA, hashing and text helpers
prisma/                      schema and migrations
scripts/fetcher.ts           provider testing CLI
```

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/jobs` | List jobs. Query: `q`, `source`, `country`, `level` (junior/mid/senior/unknown), `visa=1`, `remote=1`, `days`, `sort` (score/recent/country), `page`, `pageSize` (max 60). List params can repeat (`source=a&source=b`) or be comma separated. Returns `{ jobs, total, page, pageSize }` |
| GET | `/api/jobs/:id` | One job, or 404 |
| GET | `/api/jobs/lookup?ids=a,b` | Up to 200 jobs by id. Returns `{ jobs }` |
| GET | `/api/jobs/facets` | `{ sources: [{source, count}], countries }` for the filter sidebar |
| GET | `/api/jobs/stats` | `{ total, withVisa, remote, lastRunAt, bySource }` |
| POST | `/api/jobs/:id/applied` | Deletes the job and stores a tombstone so it isn't imported again |
| POST | `/api/refresh` | Runs an ingest. Returns 429 if one finished in the last 2 minutes |
| GET/POST | `/api/cron/refresh` | Runs an ingest. Needs `Authorization: Bearer $CRON_SECRET` |
| GET | `/api/settings` | `{ providers, preferences }` |

## How an ingest works

1. Every provider from `getProviders()` runs in parallel. Each one gets a `FetchRun` row recording whether it succeeded and how many jobs it returned. A failing provider doesn't stop the others.
2. Titles that don't match `ALLOWED_TITLE_PATTERNS` in `config/preferences.ts` are dropped.
3. Each job is normalized: the id is `hashId(source, sourceJobId)`, and remote, visa, relocation, seniority and technologies are inferred from the text when the source doesn't provide them.
4. Each job is scored (`ingest/scoring.ts`).
5. Jobs the user has marked as applied (`AppliedJob` table) are skipped.
6. Duplicates across sources are collapsed. Matching is by apply URL, then company + title fingerprint, then fuzzy title similarity within the same company. The higher-scoring copy wins.
7. Everything left is upserted into `Job`.

If an ingest is already running, a second call (say the button and the cron at the same time) waits for the same run instead of starting another.

## Adding a provider

1. Create `src/providers/<name>.provider.ts` exporting a `JobProvider`:

   ```ts
   export const example: JobProvider = {
     name: 'example',   // stored in Job.source; never rename it later
     label: 'Example',  // shown in the UI
     reliable: true,    // false for scrapers that are often blocked
     async fetchJobs() {
       const data = await httpJson<ExampleResponse>('https://example.com/jobs.json');
       return data.jobs.map((j) => ({ sourceJobId: String(j.id), title: j.title, ... }));
     },
   };
   ```

2. Add it to `LIVE_PROVIDERS` in `src/providers/index.ts`.
3. Try it: `npm run fetch -- -q engineer --source example`.

For a company that uses Greenhouse, Lever or Ashby, you don't need a new file. Add an entry to `COMPANIES` in the matching `*-ats.provider.ts`.

## Testing providers

```bash
npm run fetch -- -q "Backend Engineer" -l Singapore
npm run fetch -- -q DevOps -l Japan --source adzuna,careerjet --limit 50
```

`-q` matches titles, `-l` matches locations, `--source` limits which providers run, and `--limit` caps how many rows are printed. Nothing is written to the database.

## Database

The schema has three tables:
- `Job`: the listings.
- `AppliedJob`: tombstones for jobs marked as applied.
- `FetchRun`: one row per provider per ingest.

`requirements`, `tags` and `technologies` are stored as JSON strings in TEXT columns, and `JobsService` turns them back into arrays. Keep the schema backwards compatible: the production database is shared with earlier versions of the app.
