// Companies known to sponsor work visas / relocation for INTERNATIONAL
// software engineers, scoped to the four target countries: Thailand,
// Malaysia, Japan, and Singapore. Use the country chips at the top to
// filter to your preferred destination.
//
// Sponsorship is decided per-role and shifts each quarter — always confirm
// "visa sponsorship / relocation provided" on the actual posting. URLs are
// reused from the vetted /companies directory where they overlap so links
// stay healthy; the aggregator cards (Japan Dev, TokyoDev, Relocate.me)
// cover everything not individually listed.

import { CompaniesGrid, type Company } from "@/components/companies-grid";

// `auto: true` marks the headline / highest-confidence sponsors in each
// country (full relocation + visa, English-friendly). `auto: false` are
// strong-signal sponsors worth checking per-role.
const VISA_SPONSORS: Company[] = [
  // ── 🇯🇵 Japan — Engineer/Specialist visa; HSP fast-track ──────────────
  { name: "Rakuten", url: "https://global.rakuten.com/corp/careers/", country: "Japan", auto: true, note: "English-first eng org · visa + relocation" },
  { name: "Mercari", url: "https://careers.mercari.com/en/", country: "Japan", auto: true, note: "Marketplace · visa sponsorship" },
  { name: "Woven by Toyota", url: "https://jobs.lever.co/woven-by-toyota", country: "Japan", auto: true, note: "Mobility/AV · relocation + visa" },
  { name: "PayPay", url: "https://job-boards.greenhouse.io/paypay", country: "Japan", auto: true, note: "Fintech · hires from abroad" },
  { name: "LY Corporation", url: "https://www.lycorp.co.jp/en/recruit/", country: "Japan", auto: false, note: "LINE + Yahoo Japan · visa support" },
  { name: "Money Forward", url: "https://recruit.moneyforward.com/en", country: "Japan", auto: false, note: "Personal finance · visa sponsorship" },
  { name: "SmartNews", url: "https://careers.smartnews.com/en/", country: "Japan", auto: false, note: "News aggregator · relocation support" },
  { name: "Cookpad", url: "https://info.cookpad.com/en/careers/", country: "Japan", auto: false, note: "Recipe platform · English-friendly" },
  { name: "HENNGE", url: "https://recruit.hennge.com/en/", country: "Japan", auto: false, note: "SaaS/security · sponsors visas" },
  { name: "Preferred Networks", url: "https://www.preferred.jp/en/careers/", country: "Japan", auto: false, note: "AI/robotics · visa support" },
  { name: "Cybozu", url: "https://cybozu.co.jp/en/company/careers/", country: "Japan", auto: false, note: "Team collaboration SaaS" },
  { name: "GMO Internet Group", url: "https://internet.gmo/en/recruit/jobs/all/", country: "Japan", auto: false, note: "Internet conglomerate" },
  { name: "Japan Dev (aggregator)", url: "https://japan-dev.com/japan-jobs-relocation", country: "Japan", auto: false, note: "Apply-from-abroad, visa-sponsored roles" },
  { name: "TokyoDev (aggregator)", url: "https://www.tokyodev.com/jobs", country: "Japan", auto: false, note: "Curated visa-sponsor SWE jobs" },

  // ── 🇸🇬 Singapore — Employment Pass (min SGD 5k/mo) · Tech.Pass ────────
  { name: "Grab", url: "https://careers.smartrecruiters.com/Grab?search=software", country: "Singapore", auto: true, note: "Super-app · EP + relocation" },
  { name: "Sea (Shopee / Garena)", url: "https://www.sea.com/careers", country: "Singapore", auto: true, note: "Tech conglomerate · sponsors EP" },
  { name: "Shopee", url: "https://careers.shopee.sg/jobs?name=software&limit=50&offset=0", country: "Singapore", auto: true, note: "E-commerce · EP + relocation" },
  { name: "Stripe", url: "https://stripe.com/jobs/search?query=software", country: "Singapore", auto: false, note: "Payments · APAC hub hires + sponsors" },
  { name: "Airwallex", url: "https://www.airwallex.com/careers", country: "Singapore", auto: false, note: "Cross-border payments" },
  { name: "Nium", url: "https://www.nium.com/careers/", country: "Singapore", auto: false, note: "B2B fintech" },
  { name: "Aspire", url: "https://aspireapp.com/careers", country: "Singapore", auto: false, note: "B2B neobank" },
  { name: "Carousell", url: "https://careers.smartrecruiters.com/carousellgroup", country: "Singapore", auto: false, note: "Marketplace" },
  { name: "Klook", url: "https://klook.wd3.myworkdayjobs.com/KlookCareers", country: "Singapore", auto: false, note: "Travel experiences" },

  // ── 🇹🇭 Thailand — Non-Immigrant B + work permit · SMART Visa ─────────
  { name: "Agoda", url: "https://careersatagoda.com/department/technology/", country: "Thailand", auto: true, note: "Headline sponsor · full relocation + family visa, team from 50+ countries" },
  { name: "LINE MAN Wongnai", url: "https://careers.lmwn.com/", country: "Thailand", auto: false, note: "Food delivery · hires foreigners" },
  { name: "Omise / Opn", url: "https://www.omise.co/careers", country: "Thailand", auto: false, note: "Payments · international team" },
  { name: "Ascend Money", url: "https://www.ascendcorp.com/job-opening/", country: "Thailand", auto: false, note: "Fintech (TrueMoney)" },
  { name: "Appman", url: "https://www.appman.co.th/en/career-en/", country: "Thailand", auto: false, note: "Software services" },
  { name: "OOZOU", url: "https://oozou.com/careers", country: "Thailand", auto: false, note: "Software studio · relocation support" },
  { name: "Manatal", url: "https://www.manatal.com/careers", country: "Thailand", auto: false, note: "ATS / HR SaaS · global team" },

  // ── 🇲🇾 Malaysia — Employment Pass · MDEC Tech Professional Pass ──────
  { name: "Carsome", url: "https://carsome.breezy.hr/", country: "Malaysia", auto: true, note: "Used-car unicorn · EP sponsorship" },
  { name: "MoneyLion", url: "https://jobs.ashbyhq.com/gen-digital", country: "Malaysia", auto: true, note: "Fintech · sponsors foreigners" },
  { name: "AirAsia", url: "https://mycareer.airasia.com/gb/en/search-results?keywords=Software%20Engineer", country: "Malaysia", auto: false, note: "Travel/super-app · KL eng hub" },
  { name: "Boost", url: "https://careers.myboost.co/", country: "Malaysia", auto: false, note: "E-wallet fintech" },
  { name: "Fave", url: "https://myfave.darwinbox.com/ms/candidate/careers", country: "Malaysia", auto: false, note: "Payments / loyalty" },
  { name: "MoneyMatch", url: "https://moneymatch.co/careers/", country: "Malaysia", auto: false, note: "Remittance fintech · 18+ nationalities" },
  { name: "StoreHub", url: "https://apply.workable.com/storehub/", country: "Malaysia", auto: false, note: "Retail SaaS / POS" },
  { name: "Vitrox", url: "https://jobs.vitrox.com/", country: "Malaysia", auto: false, note: "Automated inspection (Penang)" },
];

export default async function VisaSponsorsPage({
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
        <h1 className="text-xl font-semibold tracking-tight">
          Visa sponsors
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Companies that sponsor work visas / relocation for international
          software engineers in Japan, Singapore, Thailand, and Malaysia. Pick
          a country below. The{" "}
          <span className="font-medium text-[var(--foreground)]">Auto</span>{" "}
          badge marks the strongest, most foreigner-friendly sponsors. Always
          confirm sponsorship on the actual posting.
        </p>
      </header>

      <CompaniesGrid
        companies={VISA_SPONSORS}
        initialPage={initialPage}
        basePath="/visa-sponsors"
        enableCountryFilter
      />
    </div>
  );
}
