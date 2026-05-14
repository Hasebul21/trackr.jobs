import type { JobProvider } from "./types";
import { tokyodev } from "./tokyodev";
import { japandev } from "./japandev";
import { relocate } from "./relocate";
import { techinasia } from "./techinasia";
import { jobstreet } from "./jobstreet";
import { linkedin } from "./linkedin";
import { mock } from "./mock";

/** Live providers run on every cron tick. The mock provider only runs
 * when SEED_MOCK=1 so production cron doesn't pollute the DB with
 * fake jobs. */
export function getProviders(): JobProvider[] {
  const live: JobProvider[] = [
    tokyodev,
    japandev,
    relocate,
    techinasia,
    jobstreet,
    linkedin,
  ];
  if (process.env.SEED_MOCK === "1") live.push(mock);
  return live;
}

export const ALL_PROVIDERS: JobProvider[] = [
  tokyodev,
  japandev,
  relocate,
  techinasia,
  jobstreet,
  linkedin,
  mock,
];

export { type JobProvider } from "./types";
