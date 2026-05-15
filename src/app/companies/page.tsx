// Curated company directory. The "auto-ingest vs link-only" split
// lives only in the per-card Auto/Link badge; the grid renders them
// all together in one paginated list.

import { ExternalLink, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";

type Company = {
  name: string;
  url: string;
  country: string;
  /** When true, this company's jobs are pulled into the dashboard by a
   * registered provider (`src/providers/<name>/`). When false, you'll
   * need to click through and search manually. */
  auto: boolean;
  note?: string;
};

// Auto-ingested entries first, then link-only. Alphabetical within
// each group so the page is easy to scan even without the headings.
const COMPANIES: Company[] = [
  { name: "Agoda", url: "https://careersatagoda.com/vacancies/?keyword=software&team%5B%5D=Technology&location%5B%5D=Bangkok&job_type%5B%5D=Regular", country: "Thailand", auto: true },
  { name: "AirAsia", url: "https://mycareer.airasia.com/gb/en/search-results?keywords=Software%20Engineer", country: "Malaysia", auto: true },
  { name: "Algolia", url: "https://boards.greenhouse.io/algolia", country: "France / global", auto: true },
  { name: "Astro Malaysia", url: "https://astro.wd3.myworkdayjobs.com/Astro_Careers?q=Software+Engineer", country: "Malaysia", auto: true },
  { name: "Booking.com", url: "https://jobs.booking.com/booking/jobs", country: "Netherlands / SG", auto: true },
  { name: "CircleCI", url: "https://boards.greenhouse.io/circleci", country: "US / remote", auto: true },
  { name: "Grab", url: "https://careers.smartrecruiters.com/Grab?search=software", country: "Singapore", auto: true },
  { name: "MoneyLion", url: "https://jobs.ashbyhq.com/gen-digital", country: "Malaysia", auto: true },
  { name: "PayPay", url: "https://job-boards.greenhouse.io/paypay", country: "Japan", auto: true },
  { name: "PostHog", url: "https://jobs.ashbyhq.com/posthog", country: "UK / remote", auto: true },
  { name: "Sentry", url: "https://jobs.ashbyhq.com/sentry", country: "US / remote", auto: true },
  { name: "Woven by Toyota", url: "https://jobs.lever.co/woven-by-toyota", country: "Japan", auto: true },
  { name: "Zapier", url: "https://jobs.ashbyhq.com/zapier", country: "US / remote", auto: true },

  { name: "bKash", url: "https://www.bkash.com/page/career", country: "Bangladesh", auto: false, note: "BD mobile financial services" },
  { name: "Brain Station 23", url: "https://brainstation-23.com/careers", country: "Bangladesh", auto: false, note: "BD software services" },
  { name: "Chaldal", url: "https://chaldal.com/jobs", country: "Bangladesh", auto: false, note: "BD grocery / logistics" },
  { name: "DigitalOcean", url: "https://www.digitalocean.com/careers", country: "US / remote", auto: false, note: "Cloud infra — no public ATS" },
  { name: "Ola", url: "https://olacareers.turbohire.co/dashboardv2?orgId=e0c1eb37-eb7a-4ca4-bcc5-d59ce4ce9212&dep=4d8df20a-b90c-41dd-a502-3d7174f9db13&type=0", country: "India", auto: false, note: "TurboHire SPA — manual search" },
  { name: "Pathao", url: "https://pathao.com/bd/career/", country: "Bangladesh", auto: false, note: "BD ride-hailing / delivery" },
  { name: "PayPal", url: "https://paypal.eightfold.ai/careers?domain=paypal.com&query=Software&start=0&pid=274918865203&sort_by=relevance", country: "US / SG", auto: false, note: "Eightfold AI requires auth" },
  { name: "PayU", url: "https://corporate.payu.com/job-board/?department%5B%5D=credit-engineering", country: "Netherlands / India", auto: false, note: "Custom platform" },
  { name: "ShareTrip", url: "https://sharetrip.net/career", country: "Bangladesh", auto: false, note: "BD travel tech" },
  { name: "Shopee", url: "https://careers.shopee.sg/jobs?name=software&limit=50&offset=0", country: "Singapore", auto: false, note: "SPA — no public JSON API" },
  { name: "Snapdeal", url: "https://blog.snapdeal.com/", country: "India", auto: false, note: "WordPress blog — manual search" },
  { name: "Stripe", url: "https://stripe.com/jobs/search?query=software", country: "US / global", auto: false, note: "No public JSON API" },
  { name: "Wolt", url: "https://careers.wolt.com/en/jobs?search=Software+", country: "Finland / Asia", auto: false, note: "SmartRecruiters slug unknown" },
  { name: "Zoho", url: "https://www.zoho.com/careers/#jobs", country: "India", auto: false, note: "Custom platform" },
];

// 12 = 4 rows × 3 cols on the dashboard grid; matches the job list's
// per-page count for visual consistency.
const PAGE_SIZE = 12;

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const totalPages = Math.max(1, Math.ceil(COMPANIES.length / PAGE_SIZE));
  const requested = Number(sp.page);
  const page =
    Number.isFinite(requested) && requested >= 1
      ? Math.min(requested, totalPages)
      : 1;
  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, COMPANIES.length);
  const slice = COMPANIES.slice(start, end);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4">
      <header className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight">
          Target companies
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {slice.map((c) => (
          <CompanyCard key={c.name} c={c} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        rangeStart={start + 1}
        rangeEnd={end}
        total={COMPANIES.length}
        hrefFor={(n) => (n <= 1 ? "/companies" : `/companies?page=${n}`)}
      />
    </div>
  );
}

function CompanyCard({ c }: { c: Company }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate font-semibold text-[var(--foreground)]">
              {c.name}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              {c.country}
            </div>
          </div>
          {c.auto ? (
            <Badge
              variant="success"
              title="Pulled into the dashboard automatically"
            >
              <CheckCircle2 className="h-3 w-3" /> Auto
            </Badge>
          ) : (
            <Badge variant="outline" title="Visit manually">
              Link
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between gap-2 pt-0">
        <span className="truncate text-xs text-[var(--muted-foreground)]">
          {c.note ?? new URL(c.url).hostname.replace(/^www\./, "")}
        </span>
        <Button asChild size="sm">
          <a href={c.url} target="_blank" rel="noreferrer noopener">
            Visit <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
