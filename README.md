# Trackr.jobs

Aggregator for international software-engineering jobs (Japan / Singapore / SEA, plus remote-friendly roles), with a focus on visa sponsorship and relocation support. It pulls from TokyoDev, Japan Dev, Relocate.me, Tech in Asia, JobStreet, LinkedIn, company ATS boards and a few job APIs, normalizes everything into one schema, scores each job by relevance, removes duplicates across sources, and serves a filterable dashboard.

Stack:

- `backend/` — NestJS 11 API, Prisma 7 + PostgreSQL, cheerio for scraping
- `frontend/` — Angular 22, Ant Design (ng-zorro-antd), Tailwind v4
- Deployed to Vercel as two services in one project (see `vercel.json`)

---

## Running locally

Requirements: Node 22+, a PostgreSQL instance.

```bash
# Postgres (or use any hosted instance)
docker run -d --name trackr-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=trackr_jobs \
  -p 5432:5432 postgres:16

# API
cd backend
cp .env.example .env          # set DATABASE_URL and CRON_SECRET
npm install
npm run db:migrate:dev
npm run start:dev             # http://localhost:3000/api

# Web app (second terminal)
cd frontend
npm install
npm start                     # http://localhost:4200, /api is proxied to :3000
```

The database starts empty. Click **Refresh** in the navbar, or:

```bash
curl -X POST http://localhost:3000/api/refresh
```

Most scrapers return nothing from residential or cloud IPs. Set `SEED_MOCK=1` in `backend/.env` to also load a handful of sample jobs.

---

## API

All routes are under `/api`.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/jobs` | Filters: `q`, `source`, `country`, `level`, `visa=1`, `remote=1`, `days`, `sort` (score/recent/country), `page`, `pageSize` |
| GET | `/jobs/:id` | Single job |
| GET | `/jobs/lookup?ids=a,b` | Used by the bookmarks page |
| GET | `/jobs/facets` | Sources and countries for the filter sidebar |
| GET | `/jobs/stats` | Totals and last refresh time |
| POST | `/jobs/:id/applied` | Deletes the job and remembers it so it isn't imported again |
| POST | `/refresh` | Runs an ingest (the Refresh button). Limited to one run every 2 minutes |
| GET/POST | `/cron/refresh` | Same, for schedulers. Needs `Authorization: Bearer $CRON_SECRET` |
| GET | `/settings` | Provider list and scoring preferences |

---

## How ingest works

```
cron / Refresh button
        │
        ▼
IngestService.runIngest()
  ├─ run every provider in parallel (one FetchRun row each)
  ├─ title filter → normalize → score
  ├─ drop jobs marked as applied
  ├─ dedup across sources
  └─ upsert into Postgres
```

- Providers live in `backend/src/providers/`. Register new ones in `backend/src/providers/index.ts`.
- Scoring and title filters are in `backend/src/config/preferences.ts`. Edit and refresh; no migration needed.
- Test a provider without touching the database: `cd backend && npm run fetch -- -q "Backend Engineer" -l Singapore --source adzuna`

---

## Deploying

See [deploy.md](deploy.md). In short: one Vercel project, `vercel.json` defines a `frontend` and a `backend` service, `/api/*` goes to the backend and everything else to the Angular app. Set `DATABASE_URL` and `CRON_SECRET` on the project and apply migrations once with `npm run db:migrate` from `backend/`.

Refreshes are triggered by Vercel Cron (daily on the Hobby plan) and by the GitHub Action in `.github/workflows/refresh.yml` (every 2 hours, needs `APP_URL` and `CRON_SECRET` repo secrets).

---

## Notes

- **Scrapers are best-effort.** LinkedIn, JobStreet and Tech in Asia often return nothing from cloud IPs. Providers marked `reliable: false` show a warning on the Settings page.
- **Bookmarks and hidden companies are stored in the browser** (localStorage). There are no accounts.
- **The Refresh and mark-applied endpoints are open**, same as before. Fine for a personal tool; put auth in front of them if the URL is shared widely.

## License

MIT
