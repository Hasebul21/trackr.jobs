// Curated company directory — the 14 career sites from the user's
// bookmarks (career sites.md). Some are wired into the auto-ingest
// pipeline (badge: "Auto"), the rest are link-only because their sites
// have no public JSON API and would need brittle HTML scraping.

import { ExternalLink, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

// Order: ones we auto-ingest first, then the link-only ones. Within
// each group, alphabetical so the page is easy to scan.
const COMPANIES: Company[] = [
  { name: "Agoda", url: "https://careersatagoda.com/vacancies/?keyword=software&team%5B%5D=Technology&location%5B%5D=Bangkok&job_type%5B%5D=Regular", country: "Thailand", auto: true },
  { name: "AirAsia", url: "https://mycareer.airasia.com/gb/en/search-results?keywords=Software%20Engineer", country: "Malaysia", auto: true },
  { name: "Astro Malaysia", url: "https://astro.wd3.myworkdayjobs.com/Astro_Careers?q=Software+Engineer", country: "Malaysia", auto: true },
  { name: "Booking.com", url: "https://jobs.booking.com/booking/jobs", country: "Netherlands / SG", auto: true },
  { name: "Grab", url: "https://careers.smartrecruiters.com/Grab?search=software", country: "Singapore", auto: true },
  { name: "MoneyLion", url: "https://jobs.ashbyhq.com/gen-digital", country: "Malaysia", auto: true },
  { name: "PayPay", url: "https://job-boards.greenhouse.io/paypay", country: "Japan", auto: true },
  { name: "Woven by Toyota", url: "https://jobs.lever.co/woven-by-toyota", country: "Japan", auto: true },

  { name: "Ola", url: "https://olacareers.turbohire.co/dashboardv2?orgId=e0c1eb37-eb7a-4ca4-bcc5-d59ce4ce9212&dep=4d8df20a-b90c-41dd-a502-3d7174f9db13&type=0", country: "India", auto: false, note: "TurboHire SPA — manual search" },
  { name: "PayPal", url: "https://paypal.eightfold.ai/careers?domain=paypal.com&query=Software&start=0&pid=274918865203&sort_by=relevance", country: "US / SG", auto: false, note: "Eightfold AI requires auth" },
  { name: "PayU", url: "https://corporate.payu.com/job-board/?department%5B%5D=credit-engineering", country: "Netherlands / India", auto: false, note: "Custom platform" },
  { name: "Shopee", url: "https://careers.shopee.sg/jobs?name=software&limit=50&offset=0", country: "Singapore", auto: false, note: "SPA — no public JSON API" },
  { name: "Snapdeal", url: "https://blog.snapdeal.com/", country: "India", auto: false, note: "WordPress blog — manual search" },
  { name: "Stripe", url: "https://stripe.com/jobs/search?query=software", country: "US / global", auto: false, note: "No public JSON API" },
  { name: "Wolt", url: "https://careers.wolt.com/en/jobs?search=Software+", country: "Finland / Asia", auto: false, note: "SmartRecruiters slug unknown" },
  { name: "Zoho", url: "https://www.zoho.com/careers/#jobs", country: "India", auto: false, note: "Custom platform" },
];

export default function CompaniesPage() {
  const autoCount = COMPANIES.filter((c) => c.auto).length;
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Target companies</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {COMPANIES.length} curated employers · {autoCount} auto-ingested into
          the dashboard · the rest open their careers page in a new tab.
        </p>
      </header>

      <Section
        title="Auto-ingested"
        hint="Jobs from these companies show up on the dashboard automatically."
        companies={COMPANIES.filter((c) => c.auto)}
      />
      <Section
        title="Link only"
        hint="No public API — visit these career pages directly."
        companies={COMPANIES.filter((c) => !c.auto)}
      />

      <p className="mt-8 text-xs text-[var(--muted-foreground)]">
        Curated from your bookmarks (Job Hunt → Company). Want to add another
        target? Edit{" "}
        <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">
          src/app/companies/page.tsx
        </code>
        .
      </p>
    </div>
  );
}

function Section({
  title,
  hint,
  companies,
}: {
  title: string;
  hint: string;
  companies: Company[];
}) {
  if (companies.length === 0) return null;
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="text-lg font-medium">{title}</h2>
        <span className="text-xs text-[var(--muted-foreground)]">{hint}</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((c) => (
          <CompanyCard key={c.name} c={c} />
        ))}
      </div>
    </section>
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

// Force-dynamic isn't needed here — no DB reads — but we still want
// Next.js to skip the static optimization since the page is so light
// the savings are negligible and dev/preview parity is more useful.
export const dynamic = "force-static";
