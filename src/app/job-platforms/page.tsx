// Job boards, aggregators, search portals, and relocation platforms —
// anything that is *not* a single hiring company's own careers page.
// Kept structurally identical to /companies so the card design, hide list,
// and pagination behave the same.

import { CompaniesGrid, type Company } from "@/components/companies-grid";

const PLATFORMS: Company[] = [
  { name: "LinkedIn — Software Engineer (Dhaka)", url: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=Dhaka%2C%20Bangladesh", country: "Bangladesh", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Software Engineer (Malaysia)", url: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=Malaysia", country: "Malaysia", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Software Engineer (Singapore)", url: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=Singapore", country: "Singapore", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Software Engineer (Thailand)", url: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=Thailand", country: "Thailand", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Senior Software Engineer (Dhaka)", url: "https://www.linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer&location=Dhaka%2C%20Bangladesh", country: "Bangladesh", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Senior Software Engineer (Malaysia)", url: "https://www.linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer&location=Malaysia", country: "Malaysia", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Senior Software Engineer (Singapore)", url: "https://www.linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer&location=Singapore", country: "Singapore", auto: false, note: "LinkedIn search" },
  { name: "LinkedIn — Senior Software Engineer (Thailand)", url: "https://www.linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer&location=Thailand", country: "Thailand", auto: false, note: "LinkedIn search" },
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
          Job boards, aggregators, and search portals — not specific to a
          single hiring company.
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
