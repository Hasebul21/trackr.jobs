# Deploying Trackr.jobs to Vercel

The app is one Vercel project with two services, defined in `vercel.json`:

```
                ┌──────────── Vercel project ────────────┐
browser ──────► │  /api/*  ──► backend  (NestJS, backend/)│ ──► Postgres
                │  /*      ──► frontend (Angular, frontend/)
                └─────────────────────────────────────────┘
Vercel Cron / GitHub Action ──► /api/cron/refresh
```

Both services build and deploy together, so the frontend and API are always
the same version. The Angular app calls the API on the same origin (`/api`),
so there's no CORS setup in production.

---

## 1. Database

Any Postgres works. [Neon](https://neon.tech) is a good fit: use the
**pooled** connection string (the `-pooler` host) with `?sslmode=require`.

Apply the migrations once, from your machine:

```bash
cd backend
DATABASE_URL="<pooled url>" npm run db:migrate
```

The schema is unchanged from the old Next.js version, so an existing database
keeps working as-is.

## 2. Environment variables

Set these on the Vercel project (Production and Preview):

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Pooled Postgres URL |
| `CRON_SECRET` | `openssl rand -hex 32` |
| `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `CAREERJET_AFFILIATE_ID`, `THEIRSTACK_API_KEY`, `LINKEDIN_RAPIDAPI_KEY`, `JSEARCH_RAPIDAPI_KEY` | Optional. A provider whose key is missing skips itself |

Leave `SEED_MOCK` unset in production. `NEXT_PUBLIC_APP_URL` is no longer used.

## 3. Deploy

Push to `main` (Git integration) or run `vercel --prod` from the repo root.
Vercel reads `vercel.json`, builds `frontend/` with the Angular preset and
`backend/` with the NestJS preset. `prisma generate` runs in the backend's
`postinstall` and `build` scripts.

## 4. First data load

The database is empty after the first migration. Trigger a refresh:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://<your-project>.vercel.app/api/cron/refresh
```

## 5. Scheduled refreshes

- `vercel.json` registers a cron for `/api/cron/refresh`. On the Hobby plan
  Vercel runs it at most once a day.
- `.github/workflows/refresh.yml` calls the same endpoint every 2 hours. Add
  `APP_URL` and `CRON_SECRET` as repository secrets.

The cron endpoint only accepts the secret in the `Authorization: Bearer`
header (not as a query parameter), so it doesn't end up in access logs.

If you run the backend somewhere long-lived instead of Vercel, set
`ENABLE_CRON=1` and the API refreshes itself every 2 hours.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `/api/*` returns the Angular page | Check the top-level `rewrites` in `vercel.json`: the `/api/(.*)` rule must come before the catch-all |
| Deep links like `/jobs/abc` 404 | The frontend service needs its `/(.*) → /index.html` rewrite |
| API 500, logs say Prisma client not initialized | `prisma generate` didn't run; redeploy without build cache |
| `/api/cron/refresh` returns 401 | `CRON_SECRET` differs from the value the deployment was built with; env changes need a redeploy |
| `Too many database connections` | Use the pooled URL. The client pool is capped at 5 in `backend/src/prisma/prisma.service.ts` |
| Everything returns 0 jobs | Most scrapers are blocked from cloud IPs. Check function logs per provider |
