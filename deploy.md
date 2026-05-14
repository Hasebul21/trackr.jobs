# Deploying job·stes to Vercel

A start-to-finish guide. Following this in order should get you from a fresh
clone to a live, populated dashboard in roughly 15 minutes.

If you already shipped once and just need the cheat sheet, jump to
[§ TL;DR](#tldr).

---

## 0. What you'll end up with

- **Frontend + API:** the Next.js app running on Vercel.
- **Database:** a managed Postgres (we recommend [Neon](https://neon.tech) — serverless, generous free tier, instant cold starts).
- **Scheduler:** Vercel Cron hitting `/api/cron/refresh` every 2 hours
  (Pro/Enterprise) or once per day (Hobby — see [§ 7](#7-hobby-vs-pro-cron-cadence)).
- **No accounts / no auth.** Bookmarks are stored in the browser only.

Architecture in one diagram:

```
        Vercel Cron ──► /api/cron/refresh ──► runIngest() ──► Postgres
              (every 2h)              ▲                          │
                                      │                          │
   user browser  ─────► Next.js app ──┘ ◄── reads jobs ──────────┘
```

---

## 1. Prerequisites

You need accounts on:

| Service             | Purpose                       | Free tier OK?            |
| ------------------- | ----------------------------- | ------------------------ |
| **GitHub / GitLab** | Source repo for Vercel import | yes                      |
| **Vercel**          | Hosting + cron                | yes (Hobby — caveat §7)  |
| **Neon**            | Postgres database             | yes                      |

Locally you need:

- **Node 20+** (`node -v`)
- **npm** (`npm -v`)
- **git**
- One of: **`psql`** _or_ the willingness to run `npm run db:migrate` instead

That's it. You do **not** need Docker for production.

---

## 2. Push the repo to a Git provider

Vercel imports from a git host.

```bash
# from inside the job-stes directory
git remote add origin git@github.com:<you>/job-stes.git
git push -u origin main
```

If you forked or cloned, you can skip this — Vercel can import any repo you
have access to.

---

## 3. Provision Postgres (Neon — recommended path)

Neon's serverless model is the right shape for Vercel: connections come from a
pooler, cold starts are fast, and the free tier comfortably handles this
workload.

1. Sign in at [neon.tech](https://neon.tech) and **Create project**.
   - **Postgres version:** 16 (default)
   - **Region:** pick the one closest to your Vercel deployment region
     (e.g. `aws-us-east-1` if your Vercel team is `iad1`).
2. After creation Neon shows two connection strings. **Copy the *pooled*
   one** — it ends with `-pooler` in the host:
   ```
   postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require
   ```
   The non-pooled URL works for migrations but will exhaust connection limits
   under serverless load.

> **Alternatives that also work:** Supabase (use the pooler URL on port 6543),
> Vercel Postgres (use `POSTGRES_PRISMA_URL`), Railway, Fly Postgres,
> self-hosted. The schema is plain Postgres — no provider-specific features.

---

## 4. Apply the database migration (one time)

Before the first deploy succeeds the schema needs to exist. Run the migration
once against the production URL from your laptop:

```bash
# pull dependencies first so the prisma CLI is available
npm install

# run the migration with the production URL inline
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require" \
  npm run db:migrate
```

You should see:

```
Applying migration `20260514000000_init`
All migrations have been successfully applied.
```

Verify the tables exist (optional):

```bash
DATABASE_URL="..." npm run db:studio
# opens http://localhost:5555 — you should see `Job` and `FetchRun`
```

> **Why not run migrations in the build?** You _can_ — see [§ 8](#8-running-migrations-on-every-deploy-optional)
> — but on the first deploy the env var doesn't exist yet, and on later
> deploys you usually want to gate schema changes deliberately. Running them
> from your laptop the first time is the lowest-friction path.

---

## 5. Create the Vercel project

1. Go to [vercel.com/new](https://vercel.com/new) and **Import** the repo.
2. **Framework preset:** Next.js (auto-detected — leave it).
3. **Root Directory:** `./` (default).
4. **Build & Output Settings:** leave defaults. `package.json` already does
   the right thing (`prisma generate && next build`).
5. **Environment Variables** — add these three before clicking Deploy:

   | Name                  | Value                                                                 | Notes                                                                |
   | --------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
   | `DATABASE_URL`        | the **pooled** Neon URL from § 3                                      | must end with `?sslmode=require`                                     |
   | `CRON_SECRET`         | run `openssl rand -hex 32` and paste the output                       | Vercel Cron will send this as `Authorization: Bearer <value>`        |
   | `NEXT_PUBLIC_APP_URL` | `https://<your-project>.vercel.app` (you'll know after the first deploy — set it then or pre-fill if you know the name) | used for OG/absolute links |

   Apply each to **Production, Preview, and Development**.

   Do **not** set `SEED_MOCK` in production — it ships sample jobs that
   pretend to be real listings.

6. Click **Deploy**.

The first build runs `npm install` → `prisma generate` (postinstall) →
`next build`. Expect ~2 minutes.

When the build finishes, open the deployment URL. The dashboard renders an
empty state ("No jobs match…") — that's correct, the DB is empty.

---

## 6. Populate the database for the first time

Vercel Cron won't fire the moment you deploy. Trigger one ingest manually:

```bash
# replace both placeholders
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://YOUR-PROJECT.vercel.app/api/cron/refresh
```

Expected response (truncated):

```json
{
  "ok": true,
  "durationMs": 18234,
  "totalFetched": 87,
  "totalUpserted": 87,
  "bySource": { "tokyodev": 41, "japandev": 32, ... }
}
```

Reload the dashboard — jobs appear. From here the cron will keep it fresh.

> **If `totalFetched: 0` from every source**, that's the anti-bot reality
> from cloud IPs (LinkedIn, JobStreet, Tech in Asia routinely block). The
> deterministic-feed providers (TokyoDev, Japan Dev, Relocate.me) should
> still return jobs. See [§ 11](#11-when-providers-return-zero-results) for
> mitigations.

---

## 7. Hobby vs Pro: cron cadence

`vercel.json` declares `schedule: "0 */2 * * *"` (every 2 hours).

- **Pro / Enterprise:** honored as written.
- **Hobby (free):** Vercel runs cron jobs **once per day at most**, regardless
  of the schedule expression. Everything else works — it just fires less
  often.

If you're on Hobby and want a true 2-hour cadence, point an **external
scheduler** at the same endpoint. Two zero-cost options:

**Option A — GitHub Actions** (`.github/workflows/refresh.yml`):

```yaml
name: refresh-jobs
on:
  schedule:
    - cron: "0 */2 * * *"
  workflow_dispatch:
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -fsS -H "Authorization: Bearer $CRON_SECRET" \
            "$APP_URL/api/cron/refresh"
        env:
          CRON_SECRET: ${{ secrets.CRON_SECRET }}
          APP_URL:    ${{ secrets.APP_URL }}
```

Add `CRON_SECRET` and `APP_URL` as repo secrets.

**Option B — [cron-job.org](https://cron-job.org)** — create a job that GETs
`https://<your-project>.vercel.app/api/cron/refresh?secret=<CRON_SECRET>`
every 2h. The route also accepts the secret as a query parameter for exactly
this case.

---

## 8. Running migrations on every deploy (optional)

For longer-running projects with frequent schema changes, you can fold
migrations into the build:

1. In Vercel **Settings → Build & Development Settings**, override the build
   command to:
   ```
   prisma migrate deploy && prisma generate && next build
   ```
2. Make sure `DATABASE_URL` is available in **Production** _and_ **Preview**
   environments — `prisma migrate deploy` will fail without it.

Trade-off: every preview deployment now mutates the production schema (or
needs its own per-preview DB). For small teams that's fine; for bigger ones,
keep migrations out of the build and run them via CI against an explicit
target.

---

## 9. Smoke-test the live deployment

```bash
APP=https://your-project.vercel.app
SECRET=your-cron-secret

# 1. Site responds
curl -sI "$APP/" | head -1               # HTTP/2 200

# 2. Cron endpoint rejects unauthenticated calls
curl -s -o /dev/null -w "%{http_code}\n" "$APP/api/cron/refresh"     # 401

# 3. Cron endpoint accepts the secret and ingests
curl -fsS -H "Authorization: Bearer $SECRET" "$APP/api/cron/refresh" | head -c 300

# 4. Settings page shows provider stats
open "$APP/settings"
```

Good signs:

- `/` renders job cards.
- `/settings` shows non-zero "Total jobs" and a recent `FetchRun` per source.
- The Vercel **Logs** tab shows the cron firing on schedule (no 401s).

---

## 10. Day-2 operations

### Custom domain

Vercel → Project → **Settings → Domains**. Add the domain, copy the DNS
record into your registrar, wait for verification. Then update the env var:

```
NEXT_PUBLIC_APP_URL = https://jobs.yourdomain.com
```

Redeploy (or trigger a redeploy from the dashboard) so the new value bakes
into the build.

### Rotating `CRON_SECRET`

```bash
openssl rand -hex 32   # generate
```

1. Update the value in **Vercel → Settings → Environment Variables**.
2. Trigger a redeploy.
3. If you set up an external scheduler (§ 7), update its secret too.

### Retuning the relevance score

`src/lib/preferences.ts` is the single source of truth for "what makes a job
interesting" (preferred technologies, locations, visa phrases). Edit it, push
to `main`, Vercel redeploys, then either wait for the next cron tick or hit
`/api/cron/refresh` manually to rescore.

### Schema changes

```bash
# edit prisma/schema.prisma, then locally:
npm run db:migrate:dev          # creates a new migration + applies to local
git add prisma/migrations/      # commit the SQL
git commit -m "db: <change>"
git push

# then against production:
DATABASE_URL="<prod>" npm run db:migrate
```

---

## 11. When providers return zero results

Some sources (LinkedIn, JobStreet, Tech in Asia) routinely 0 from cloud IPs
because of anti-bot heuristics. The reliable ones (TokyoDev, Japan Dev,
Relocate.me) generally work.

The Settings page surfaces which providers are flagged `reliable: false` so
zero from those is expected, not a regression.

If you need a populated dashboard on every refresh regardless of scraper
luck, set `SEED_MOCK=1` in Vercel env. The bundled mock provider emits
deterministic sample jobs so the UI always has something to render.

> ⚠️ Do this **only** if you're showcasing the project. The mock jobs are not
> real listings — making them visible to end users is misleading.

---

## 12. Troubleshooting

| Symptom                                                     | Cause                                                                                                                       | Fix                                                                                                                    |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Build fails: `Environment variable not found: DATABASE_URL` | env var missing on the build environment (Production / Preview)                                                             | add it under Vercel **Settings → Environment Variables** for the right scopes, then redeploy                           |
| Build fails: `P1001 Can't reach database server`            | you're using the **non-pooled** URL and/or migrations are running at build time without the env                             | use the `-pooler` Neon URL; either remove `prisma migrate deploy` from the build (§ 8) or set `DATABASE_URL` for build |
| Runtime 500s, logs show `prisma/client did not initialize`  | `prisma generate` didn't run (e.g. `postinstall` skipped)                                                                   | ensure `package.json` `postinstall` script is intact; redeploy with caches cleared                                     |
| `/api/cron/refresh` returns 401 from Vercel Cron            | `CRON_SECRET` env value differs from what was set when the deployment was built                                             | edit the env var, **redeploy** (env changes don't apply to existing deployments)                                       |
| Cron only fires once per day                                | you're on the Hobby plan                                                                                                    | upgrade to Pro, **or** add an external scheduler (§ 7)                                                                 |
| `totalFetched: 0` for everything                            | residential-blocked providers + reliable providers also failing (rare)                                                      | check logs; consider `SEED_MOCK=1` temporarily (§ 11)                                                                  |
| `Too many database connections`                             | a long-running task or hot reload leaked connections; or you're using a direct (non-pooled) URL                             | switch `DATABASE_URL` to the pooled URL; if self-hosted, raise `max_connections` or lower the pool in `src/lib/prisma.ts` |
| Cron route times out at 60s                                 | one or more scrapers stalled                                                                                                | raise `maxDuration` in `vercel.json` (Pro caps at 300s); or disable the slow provider                                  |

Check Vercel **Logs → Functions → /api/cron/refresh** for the actual error
message — it's almost always there.

---

## TL;DR

```bash
# 1. push to GitHub
git push -u origin main

# 2. create a Neon project, copy the pooled URL

# 3. apply migrations once
DATABASE_URL="<pooled-neon-url>" npm run db:migrate

# 4. on Vercel: New Project → import repo
#    add env: DATABASE_URL, CRON_SECRET (openssl rand -hex 32),
#             NEXT_PUBLIC_APP_URL
#    deploy

# 5. populate the DB
curl -H "Authorization: Bearer <CRON_SECRET>" \
  https://<project>.vercel.app/api/cron/refresh

# 6. (Hobby only) wire an external scheduler — see § 7
```

Done. The dashboard is live and self-refreshing.
