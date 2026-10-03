import type { JobProvider } from './provider.types';
import { tokyodev } from './tokyodev.provider';
import { japandev } from './japandev.provider';
import { relocate } from './relocate.provider';
import { techinasia } from './techinasia.provider';
import { jobstreet } from './jobstreet.provider';
import { linkedin } from './linkedin.provider';
import { linkedinRapidapi } from './linkedin-rapidapi.provider';
import { jsearch } from './jsearch.provider';
import { jaabz } from './jaabz.provider';
import { greenhouseProviders } from './greenhouse-ats.provider';
import { leverProviders } from './lever-ats.provider';
import { ashbyProviders } from './ashby-ats.provider';
import { remotePlatformProviders } from './remote-platforms.provider';
import { agoda } from './agoda.provider';
import { grab } from './grab.provider';
import { booking } from './booking.provider';
import { airasia } from './airasia.provider';
import { astro } from './astro.provider';
import { rakuten } from './rakuten.provider';
import { adzuna } from './adzuna.provider';
import { careerjet } from './careerjet.provider';
import { theirstack } from './theirstack.provider';
import { mock } from './mock.provider';

// Live providers, in the order they show up on the settings page.
// The ATS arrays hold one provider per company; each keeps its own
// Job.source key so existing rows aren't orphaned.
const LIVE_PROVIDERS: JobProvider[] = [
  tokyodev,
  japandev,
  relocate,
  techinasia,
  jobstreet,
  linkedin,
  linkedinRapidapi,
  jsearch,
  jaabz,
  ...greenhouseProviders,
  ...leverProviders,
  ...ashbyProviders,
  ...remotePlatformProviders,
  agoda,
  grab,
  booking,
  airasia,
  astro,
  rakuten,
  adzuna,
  careerjet,
  theirstack,
];

// Every provider the app knows about. The settings page lists these and
// the fetcher script can run any of them by name.
export const ALL_PROVIDERS: JobProvider[] = [...LIVE_PROVIDERS, mock];

// Providers that run on each ingest. The mock provider only runs when
// SEED_MOCK=1 so we never write fake jobs into a real database.
export function getProviders(): JobProvider[] {
  const providers = [...LIVE_PROVIDERS];
  if (process.env.SEED_MOCK === '1') providers.push(mock);
  return providers;
}

export type { JobProvider } from './provider.types';
