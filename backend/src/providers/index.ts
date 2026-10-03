import type { JobProvider } from './provider.types';
import { mock } from './mock.provider';

// Every provider the app knows about. The settings page lists these and
// the fetcher script can run any of them by name.
export const ALL_PROVIDERS: JobProvider[] = [mock];

// Providers that run on each ingest. The mock provider only runs when
// SEED_MOCK=1 so we never write fake jobs into a real database.
export function getProviders(): JobProvider[] {
  const live = ALL_PROVIDERS.filter((p) => p.name !== 'mock');
  if (process.env.SEED_MOCK === '1') live.push(mock);
  return live;
}

export type { JobProvider } from './provider.types';
