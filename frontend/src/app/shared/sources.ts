// Display names for provider source keys.
const SOURCE_LABELS: Record<string, string> = {
  tokyodev: 'TokyoDev',
  japandev: 'Japan Dev',
  relocate: 'Relocate.me',
  techinasia: 'Tech in Asia',
  jobstreet: 'JobStreet',
  linkedin: 'LinkedIn',
  jaabz: 'Jaabz',
  paypay: 'PayPay',
  moneylion: 'MoneyLion',
  agoda: 'Agoda',
  grab: 'Grab',
  woven: 'Woven by Toyota',
  booking: 'Booking.com',
  airasia: 'AirAsia',
  astro: 'Astro Malaysia',
  rakuten: 'Rakuten',
  adzuna: 'Adzuna',
  careerjet: 'Careerjet',
  theirstack: 'TheirStack',
  mock: 'Sample',
};

export function sourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}

// Source keys of the remote-first talent platforms. Copied from
// REMOTE_PLATFORM_SOURCES in backend/src/providers/remote-platforms.provider.ts.
export const REMOTE_PLATFORM_SOURCES = ['turing', 'toptal', 'arc', 'wellfound'];
