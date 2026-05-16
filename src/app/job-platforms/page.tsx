// Job boards, aggregators, search portals, and relocation platforms —
// anything that is *not* a single hiring company's own careers page.
// Kept structurally identical to /companies so the card design, hide list,
// and pagination behave the same.

import { CompaniesGrid, type Company } from "@/components/companies-grid";

// Alphabetical. Single-company URLs that live on a third-party job board
// (BDJobs, Hiredly, LinkedIn) belong here too — the page belongs to the
// platform, not the company.
const PLATFORMS: Company[] = [
  { name: "bKash (via BDJobs)", url: "https://jobs.bdjobs.com/companyofferedjobs.asp?id=34734", country: "Bangladesh", auto: false, note: "BD job board — bKash listing" },
  { name: "LinkedIn — Senior Software Engineer (Dhaka)", url: "https://www.linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer&location=Dhaka%2C%20Bangladesh", country: "Bangladesh", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Senior Software Engineer (Malaysia)", url: "https://www.linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer&location=Malaysia", country: "Malaysia", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Senior Software Engineer (Singapore)", url: "https://www.linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer&location=Singapore", country: "Singapore", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Senior Software Engineer (Thailand)", url: "https://www.linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer&location=Thailand", country: "Thailand", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Software Engineer (Dhaka)", url: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=Dhaka%2C%20Bangladesh", country: "Bangladesh", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Software Engineer (Malaysia)", url: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=Malaysia", country: "Malaysia", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Software Engineer (Singapore)", url: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=Singapore", country: "Singapore", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Software Engineer (Thailand)", url: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=Thailand", country: "Thailand", auto: false, note: "LinkedIn search" },
  { name: "Pingspace (via Hiredly)", url: "https://my.hiredly.com/companies/pingspace", country: "Malaysia", auto: false, note: "MY job board — Pingspace listing" },
  { name: "Ricult (via LinkedIn)", url: "https://www.linkedin.com/company/ricult/jobs/", country: "Thailand", auto: false, note: "LinkedIn company jobs" },
  { name: "ShareTrip (via LinkedIn)", url: "https://bd.linkedin.com/company/sharetrip/jobs/", country: "Bangladesh", auto: false, note: "LinkedIn company jobs" },
];

export default async function JobPlatformsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const requested = Number(sp.page);
  const initialPage =
    Number.isFinite(requested) && requested >= 1 ? requested : 1;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4">
      <header className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight">Job platforms</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Job boards, aggregators, and search portals. Includes single-company
          listings hosted on a third-party platform&apos;s domain.
        </p>
      </header>

      <CompaniesGrid
        companies={PLATFORMS}
        initialPage={initialPage}
        basePath="/job-platforms"
      />
    </div>
  );
}
