# Trackr.jobs API

NestJS backend. It runs the job providers, stores results in Postgres
through Prisma, and serves the JSON API the Angular app reads.

```bash
cp .env.example .env      # set DATABASE_URL and CRON_SECRET
npm install
npm run db:migrate:dev    # apply migrations to your local database
npm run start:dev         # http://localhost:3000/api
```
