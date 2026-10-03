# Trackr.jobs web app

Angular 22 frontend for Trackr.jobs. It's a single-page app that reads everything from the NestJS API under `/api`. UI components come from Ant Design ([ng-zorro-antd](https://ng.ant.design)); layout and colors come from Tailwind v4 and the design tokens in `src/tokens.css`.

## Getting started

Start the API first (see `../backend/README.md`), then:

```bash
npm install
npm start            # http://localhost:4200
```

`npm start` runs `ng serve` with `proxy.conf.json`, which forwards `/api` to `http://localhost:3000`. In production both apps are served from the same domain, so the app always calls the relative path `/api`.

| Script | What it does |
| --- | --- |
| `npm start` | Dev server with the API proxy |
| `npm run build` | Production build into `dist/frontend/browser` |
| `npm run watch` | Development build in watch mode |

## Pages

| Route | Page |
| --- | --- |
| `/` | Dashboard: job grid with filters, search and pagination |
| `/jobs/:id` | Job detail |
| `/bookmarks` | Jobs saved in this browser |
| `/remote` | Remote-only roles from Turing, Toptal, Arc and Wellfound |
| `/companies`, `/visa-sponsors`, `/job-platforms` | Curated company and job board directories |
| `/settings` | Data stats, provider status and scoring preferences |
| `/information` | Static application profile (CV data) |

Routes are lazy-loaded from `src/app/app.routes.ts`.

## Project layout

```
src/
├── index.html            fonts, theme bootstrap script
├── styles.css            Tailwind, Ant Design layer, token bridge
├── tokens.css            design tokens (colors, type scale, light/dark)
├── ant-dark.css          Ant dark theme, loaded on demand
└── app/
    ├── core/             app-wide services
    │   ├── api.service.ts          every HTTP call
    │   ├── models.ts               API response types
    │   ├── bookmarks.service.ts    bookmarked job ids (localStorage)
    │   ├── hidden-companies.service.ts
    │   ├── theme.service.ts        light / dark / system
    │   ├── toast.service.ts        nz-notification wrapper
    │   └── data-refresh.service.ts tells pages to reload after refresh / mark applied
    ├── layout/           navbar, mobile drawer, search box, refresh button, theme toggle
    ├── shared/           job card, pagination, empty/error states, relative time pipe
    ├── components/       companies grid (used by the directory pages)
    └── pages/            one folder per route
```

## How things work

- **Filters live in the URL.** The dashboard reads `q`, `source`, `country`, `level`, `visa`, `remote`, `days`, `sort` and `page` from the query string (`shared/job-filters.ts`) and writes changes back, so every filtered view can be bookmarked or shared.
- **Bookmarks and hidden companies stay in the browser.** They're stored in `localStorage` under `job-stes:bookmarks:v1` and `job-stes:hidden-companies:v1`, in the same format the previous version of the app used. Don't rename these keys or change the format, or saved data is lost.
- **Theme.** `ThemeService` puts `.dark` on `<html>` and adds the `ant-dark.css` stylesheet while dark mode is on. A small inline script in `index.html` applies the saved theme before Angular starts, so the page never flashes light.
- **Styling.** Ant's CSS is imported into a cascade layer called `antd`, between Tailwind's `base` and `utilities` layers. Ant styles its components, and any Tailwind class you add still wins. Use Ant components for controls (buttons, inputs, selects, pagination, drawers, notifications) and Tailwind with the token variables (`bg-[var(--card)]`, `text-[var(--muted-foreground)]`, etc.) for layout.
- **Icons.** Use `<nz-icon nzType="...">`. The SVGs are copied to `/assets` at build time (see `angular.json`) and loaded on demand.
- **Untrusted content.** Job titles and descriptions come from scraped sites. Render them with `{{ }}` only; never bind them to `[innerHTML]`.

## Conventions

Standalone components only, `inject()` for DI, signals and `computed()` for state, `input()` / `output()` for component APIs, and the built-in `@if` / `@for` control flow. File names follow the current CLI style (`job-card.ts`, class `JobCard`). Format with Prettier (`npx prettier --write "src/**/*.{ts,html}"`).
