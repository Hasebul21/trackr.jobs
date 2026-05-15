// Curated company directory. The "auto-ingest vs link-only" split
// lives only in the per-card Auto/Link badge; the grid renders them
// all together in one paginated list.

import { CompaniesGrid, type Company } from "@/components/companies-grid";

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
  { name: "Rakuten", url: "https://corp.rakuten.co.jp/careers/en/", country: "Japan", auto: true },
  { name: "Sentry", url: "https://jobs.ashbyhq.com/sentry", country: "US / remote", auto: true },
  { name: "Woven by Toyota", url: "https://jobs.lever.co/woven-by-toyota", country: "Japan", auto: true },
  { name: "Zapier", url: "https://jobs.ashbyhq.com/zapier", country: "US / remote", auto: true },

  { name: "2C2P", url: "https://2c2p.com/careers/", country: "Malaysia", auto: false, note: "MY/SG payments" },
  { name: "Aigens", url: "https://aigens.com/careers/", country: "Malaysia", auto: false, note: "MY hospitality tech" },
  { name: "Airwallex", url: "https://www.airwallex.com/careers", country: "Singapore", auto: false, note: "SG cross-border payments" },
  { name: "Amity Solutions", url: "https://www.amitysolutions.com/careers", country: "Thailand", auto: false, note: "TH chat SaaS" },
  { name: "Appman", url: "https://appman.co.th/careers/", country: "Thailand", auto: false, note: "TH software services" },
  { name: "Ascend Money", url: "https://www.ascendmoney.co.th/en/careers/", country: "Thailand", auto: false, note: "TH fintech (TrueMoney)" },
  { name: "Aspire", url: "https://aspireapp.com/careers", country: "Singapore", auto: false, note: "SG B2B neobank" },
  { name: "bKash", url: "https://www.bkash.com/page/career", country: "Bangladesh", auto: false, note: "BD mobile financial services" },
  { name: "Boost", url: "https://www.myboost.com.my/careers/", country: "Malaysia", auto: false, note: "MY e-wallet" },
  { name: "Brain Station 23", url: "https://brainstation-23.com/careers", country: "Bangladesh", auto: false, note: "BD software services" },
  { name: "Buzzebees", url: "https://www.buzzebees.com/careers/", country: "Thailand", auto: false, note: "TH CRM / loyalty" },
  { name: "CapBay", url: "https://capbay.com/careers/", country: "Malaysia", auto: false, note: "MY supply chain finance" },
  { name: "Carousell", url: "https://careers.carousell.com/", country: "Singapore", auto: false, note: "SG marketplace" },
  { name: "Carsome", url: "https://carsome.com/careers", country: "Malaysia", auto: false, note: "MY used-car marketplace" },
  { name: "Chaldal", url: "https://chaldal.com/jobs", country: "Bangladesh", auto: false, note: "BD grocery / logistics" },
  { name: "Choco Card", url: "https://chococard.co/careers", country: "Thailand", auto: false, note: "TH loyalty / CRM" },
  { name: "Cookpad", url: "https://info.cookpad.com/en/careers/", country: "Japan", auto: false, note: "JP recipe platform" },
  { name: "Cybozu", url: "https://cybozu.co.jp/english/company/recruitment/", country: "Japan", auto: false, note: "JP team collaboration" },
  { name: "DigitalOcean", url: "https://www.digitalocean.com/careers", country: "US / remote", auto: false, note: "Cloud infra — no public ATS" },
  { name: "DUG Technology", url: "https://www.dug.com/careers/", country: "Malaysia", auto: false, note: "MY HPC / geoscience" },
  { name: "Eatigo", url: "https://eatigo.com/careers", country: "Thailand", auto: false, note: "TH restaurant reservations" },
  { name: "Fastwork", url: "https://fastwork.co/company/careers", country: "Thailand", auto: false, note: "TH freelance marketplace" },
  { name: "Fave", url: "https://careers.myfave.com/", country: "Malaysia", auto: false, note: "MY payments / loyalty" },
  { name: "Favoriot", url: "https://www.favoriot.com/careers/", country: "Malaysia", auto: false, note: "MY IoT platform" },
  { name: "Flash Express", url: "https://www.flashexpress.com/career/", country: "Thailand", auto: false, note: "TH logistics" },
  { name: "FlowAccount", url: "https://flowaccount.com/en/careers", country: "Thailand", auto: false, note: "TH accounting SaaS" },
  { name: "Glints", url: "https://glints.com/sg/en/careers", country: "Singapore", auto: false, note: "SG recruitment platform" },
  { name: "GMO Internet Group", url: "https://www.gmo.jp/en/careers/", country: "Japan", auto: false, note: "JP internet conglomerate" },
  { name: "GovTech Singapore", url: "https://www.tech.gov.sg/careers", country: "Singapore", auto: false, note: "SG government tech agency" },
  { name: "HENNGE", url: "https://hennge.com/global/careers/", country: "Japan", auto: false, note: "JP SaaS / security" },
  { name: "Infinity Cosmos", url: "https://infinitycosmos.com/careers/", country: "Malaysia", auto: false, note: "MY software" },
  { name: "Involve Asia", url: "https://www.involve.asia/careers", country: "Malaysia", auto: false, note: "MY affiliate marketing" },
  { name: "iPiD", url: "https://ipid.global/careers/", country: "Malaysia", auto: false, note: "MY payment validation" },
  { name: "iPrice", url: "https://ipricegroup.com/careers/", country: "Malaysia", auto: false, note: "MY price comparison" },
  { name: "Klook", url: "https://careers.klook.com/", country: "Singapore", auto: false, note: "SG/HK travel experiences" },
  { name: "Knorex", url: "https://www.knorex.com/careers/", country: "Malaysia", auto: false, note: "MY adtech" },
  { name: "LINE MAN Wongnai", url: "https://careers.lmwn.com/", country: "Thailand", auto: false, note: "TH food delivery" },
  { name: "LY Corporation", url: "https://www.lycorp.co.jp/en/recruit/", country: "Japan", auto: false, note: "JP (LINE + Yahoo)" },
  { name: "Manatal", url: "https://www.manatal.com/careers", country: "Thailand", auto: false, note: "TH ATS / HR SaaS" },
  { name: "Mercari", url: "https://careers.mercari.com/en/", country: "Japan", auto: false, note: "JP marketplace" },
  { name: "MFEC", url: "https://www.mfec.co.th/en/careers/", country: "Thailand", auto: false, note: "TH IT services" },
  { name: "Money Forward", url: "https://corp.moneyforward.com/en/recruit/", country: "Japan", auto: false, note: "JP personal finance" },
  { name: "MoneyMatch", url: "https://moneymatch.co/careers/", country: "Malaysia", auto: false, note: "MY remittance fintech" },
  { name: "Morphosis", url: "https://morphos.is/careers/", country: "Thailand", auto: false, note: "TH software studio" },
  { name: "Nimble", url: "https://nimblehq.co/careers/", country: "Thailand", auto: false, note: "TH software studio" },
  { name: "Nium", url: "https://www.nium.com/careers/", country: "Singapore", auto: false, note: "SG B2B fintech" },
  { name: "Ola", url: "https://olacareers.turbohire.co/dashboardv2?orgId=e0c1eb37-eb7a-4ca4-bcc5-d59ce4ce9212&dep=4d8df20a-b90c-41dd-a502-3d7174f9db13&type=0", country: "India", auto: false, note: "TurboHire SPA — manual search" },
  { name: "Omise", url: "https://www.omise.co/careers", country: "Thailand", auto: false, note: "TH payments" },
  { name: "OOZOU", url: "https://oozou.com/careers", country: "Thailand", auto: false, note: "TH software studio" },
  { name: "Pathao", url: "https://pathao.com/bd/career/", country: "Bangladesh", auto: false, note: "BD ride-hailing / delivery" },
  { name: "PayPal", url: "https://paypal.eightfold.ai/careers?domain=paypal.com&query=Software&start=0&pid=274918865203&sort_by=relevance", country: "US / SG", auto: false, note: "Eightfold AI requires auth" },
  { name: "PayU", url: "https://corporate.payu.com/job-board/?department%5B%5D=credit-engineering", country: "Netherlands / India", auto: false, note: "Custom platform" },
  { name: "Pingspace", url: "https://pingspace.io/careers/", country: "Malaysia", auto: false, note: "MY product engineering" },
  { name: "PolicyStreet", url: "https://www.policystreet.com/careers/", country: "Malaysia", auto: false, note: "MY insurtech" },
  { name: "Pomelo", url: "https://careers.pomelofashion.com/", country: "Thailand", auto: false, note: "TH fashion e-commerce" },
  { name: "Preferred Networks", url: "https://www.preferred.jp/en/careers/", country: "Japan", auto: false, note: "JP AI / robotics" },
  { name: "Pronto Tools", url: "https://www.prontotools.io/careers", country: "Thailand", auto: false, note: "TH software studio" },
  { name: "Rapsodo", url: "https://rapsodo.com/pages/careers", country: "Malaysia", auto: false, note: "MY sports tech" },
  { name: "Ricult", url: "https://www.ricult.com/careers", country: "Thailand", auto: false, note: "TH agritech" },
  { name: "Sea", url: "https://www.sea.com/careers", country: "Singapore", auto: false, note: "SG tech conglomerate" },
  { name: "ShareTrip", url: "https://sharetrip.net/career", country: "Bangladesh", auto: false, note: "BD travel tech" },
  { name: "Shopee", url: "https://careers.shopee.sg/jobs?name=software&limit=50&offset=0", country: "Singapore", auto: false, note: "SPA — no public JSON API" },
  { name: "SkillLane", url: "https://www.skilllane.com/careers", country: "Thailand", auto: false, note: "TH edtech" },
  { name: "SmartNews", url: "https://about.smartnews.com/careers/", country: "Japan", auto: false, note: "JP news aggregator" },
  { name: "Snapdeal", url: "https://blog.snapdeal.com/", country: "India", auto: false, note: "WordPress blog — manual search" },
  { name: "Snappymob", url: "https://www.snappymob.com/careers", country: "Malaysia", auto: false, note: "MY mobile software services" },
  { name: "SOCAR Malaysia", url: "https://socar.my/careers", country: "Malaysia", auto: false, note: "MY car-sharing" },
  { name: "StoreHub", url: "https://www.storehub.com/my/careers/", country: "Malaysia", auto: false, note: "MY retail SaaS / POS" },
  { name: "Stripe", url: "https://stripe.com/jobs/search?query=software", country: "US / global", auto: false, note: "No public JSON API" },
  { name: "Sunday", url: "https://www.easysunday.com/careers", country: "Thailand", auto: false, note: "TH insurtech" },
  { name: "Tekyar", url: "https://tekyar.com/careers/", country: "Thailand", auto: false, note: "TH software services" },
  { name: "Touch 'n Go Digital", url: "https://www.touchngo.com.my/careers/", country: "Malaysia", auto: false, note: "MY e-wallet" },
  { name: "Vitrox", url: "https://www.vitrox.com/careers/", country: "Malaysia", auto: false, note: "MY automated inspection" },
  { name: "Wantedly", url: "https://www.wantedly.com/companies/wantedly", country: "Japan", auto: false, note: "JP recruitment platform" },
  { name: "Wolt", url: "https://careers.wolt.com/en/jobs?search=Software+", country: "Finland / Asia", auto: false, note: "SmartRecruiters slug unknown" },
  { name: "Zoho", url: "https://www.zoho.com/careers/#jobs", country: "India", auto: false, note: "Custom platform" },
];

export default async function CompaniesPage({
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
          Target companies
        </h1>
      </header>

      <CompaniesGrid companies={COMPANIES} initialPage={initialPage} />
    </div>
  );
}
