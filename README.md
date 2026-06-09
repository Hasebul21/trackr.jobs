# Trackr.jobs

Aggregator for international software-engineering jobs (Japan / Singapore / SEA, plus remote-friendly roles), with a focus on visa sponsorship and relocation support. Pulls from TokyoDev, Japan Dev, Relocate.me, Tech in Asia, JobStreet, and LinkedIn, normalizes them into a single schema, scores by relevance, deduplicates across sources, and serves a fast filterable dashboard.

Stack: Next.js 16 (App Router, React 19, Server Components), Prisma 7 + PostgreSQL, Tailwind v4, Radix UI, Zustand. Deploys to Vercel with a built-in cron that refreshes the index every two hours.

---

## Quick start (local)

Requirements: Node 20+, a PostgreSQL instance.

```bash
# 1. Install
npm install

# 2. Spin up Postgres locally (or use any hosted instance)
docker run -d --name trackr-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=trackr_jobs \
  -p 5432:5432 postgres:16

# 3. Configure env
cp .env.example .env
#   ← edit DATABASE_URL and CRON_SECRET

# 4. Run migrations
npm run db:migrate:dev

# 5. (Optional) populate the dashboard with the bundled mock provider
SEED_MOCK=1 curl "http://localhost:3000/api/cron/refresh?secret=dev-secret-change-me"
#  (start the dev server first, then run the curl)

# 6. Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To trigger a refresh from the UI use the **Refresh** button in the navbar (calls a server action). To trigger from a script: `curl "http://localhost:3000/api/cron/refresh?secret=$CRON_SECRET"`.

---

## Deploy to Vercel

1. **Provision Postgres.** Recommended: [Neon](https://neon.tech) (serverless, generous free tier) or [Vercel Postgres](https://vercel.com/storage/postgres). Copy the **pooled** connection string.

2. **Create the Vercel project** from this repo. During import, set the following environment variables:

   | Variable              | Value                                                                              |
   | --------------------- | ---------------------------------------------------------------------------------- |
   | `DATABASE_URL`        | Pooled Postgres URL (must end with `?sslmode=require` for managed providers)       |
   | `CRON_SECRET`         | `openssl rand -hex 32`                                                             |
   | `NEXT_PUBLIC_APP_URL` | `https://<your-project>.vercel.app`                                                |

   Leave `SEED_MOCK` unset in production.

3. **Apply the migration once** to the production DB. Either:
   - Locally: `DATABASE_URL=<prod-url> npm run db:migrate`, or
   - As part of the Vercel build: change the build command to `prisma migrate deploy && prisma generate && next build` (the default `npm run build` only runs `prisma generate && next build`).

4. **Deploy.** Vercel will:
   - Run `npm install` → `prisma generate` (postinstall) → `next build`.
   - Pick up `vercel.json` and register the cron at `/api/cron/refresh` to run every 2 hours, sending `Authorization: Bearer $CRON_SECRET`.

5. **First-load population.** The DB starts empty after migration. Trigger an immediate refresh:

   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" \
     https://<your-project>.vercel.app/api/cron/refresh
   ```

   Subsequent refreshes happen automatically every 2h via the cron.

> ⚠️ **Vercel Hobby plan:** Cron jobs on Hobby run **once per day**, not on the schedule in `vercel.json`. Pro/Enterprise honor the cron expression. For free deployments either upgrade or replace the cron with an external trigger (GitHub Actions, Upstash QStash, cron-job.org) hitting the same endpoint.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                 ← dashboard (server component)
│   ├── jobs/[id]/page.tsx       ← detail page
│   ├── bookmarks/page.tsx       ← localStorage-backed list
│   ├── settings/page.tsx        ← stats + provider status
│   ├── api/cron/refresh         ← cron entrypoint
│   ├── api/jobs                 ← bookmark hydration
│   └── actions.ts               ← server action: refresh now
├── providers/                   ← one folder per source
│   ├── tokyodev   japandev   relocate
│   ├── techinasia jobstreet  linkedin
│   └── mock                     ← deterministic sample data
├── services/
│   ├── ingest.ts                ← orchestrator
│   ├── normalize.ts             ← RawJob → Job
│   ├── scoring.ts               ← relevance score
│   ├── dedup.ts                 ← cross-source collapse
│   └── jobs.ts                  ← read-side queries
├── lib/
│   ├── prisma.ts                ← pg-adapter singleton
│   ├── preferences.ts           ← scoring config (edit me)
│   ├── search-params.ts         ← URL ?q→JobFilters
│   ├── http.ts                  ← fetch wrapper w/ UA + timeout
│   └── utils.ts                 ← hashing, dates, similarity
├── components/                  ← UI (Tailwind + Radix)
├── stores/bookmarks.ts          ← Zustand + localStorage
└── types/job.ts                 ← canonical Job shape
```

---

## Data flow

```
cron tick / refresh button
        │
        ▼
runIngest()
  ├─ fetch each provider in parallel
  ├─ normalize → score → dedup
  └─ upsert into Postgres (Job, FetchRun)
        │
        ▼
dashboard server component
  ├─ filtersFromSearchParams(searchParams)
  ├─ queryJobs() + getFacets() + getJobStats() in parallel
  └─ render FiltersPanel + JobCard grid
```

---

## Scoring

`src/lib/preferences.ts` is the single source of truth for "what makes a job interesting" (preferred technologies, locations, visa phrases, title include/exclude). Edit it and trigger a refresh to retune — no DB migration required.

---

## Useful commands

```bash
npm run dev              # local dev server
npm run build            # prisma generate + next build
npm run start            # production server (after build)
npm run lint             # eslint
npm run db:migrate:dev   # create + apply a new migration in dev
npm run db:migrate       # apply existing migrations (prod-safe)
npm run db:studio        # browse the DB in Prisma Studio
```

---

## Notes / gotchas

- **Scrapers are best-effort.** LinkedIn / JobStreet / Tech in Asia frequently return zero from cloud IPs (anti-bot). The `reliable: false` flag in each provider drives the warning shown on the Settings page. The `mock` provider exists so the UI always has something to render in dev (`SEED_MOCK=1`).
- **Bookmarks are local.** Stored in `localStorage` under `job-stes:bookmarks:v1`. No accounts, no server-side persistence.
- **Connection pooling.** `src/lib/prisma.ts` caps the `pg.Pool` at 5 to play nicely with serverless. If you self-host (long-lived process), feel free to bump it.
- **No edge runtime.** Prisma + Cheerio require Node, so all routes set `export const runtime = "nodejs"`.

## License

MIT
