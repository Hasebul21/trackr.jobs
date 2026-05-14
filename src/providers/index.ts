import type { JobProvider } from "./types";
import { tokyodev } from "./tokyodev";
import { japandev } from "./japandev";
import { relocate } from "./relocate";
import { techinasia } from "./techinasia";
import { jobstreet } from "./jobstreet";
import { linkedin } from "./linkedin";
import { jaabz } from "./jaabz";
import { paypay } from "./paypay";
import { moneylion } from "./moneylion";
import { agoda } from "./agoda";
import { grab } from "./grab";
import { woven } from "./woven";
import { rakuten } from "./rakuten";
import { adzuna } from "./adzuna";
import { careerjet } from "./careerjet";
import { theirstack } from "./theirstack";
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
    jaabz,
    paypay,
    moneylion,
    agoda,
    grab,
    woven,
    rakuten,
    adzuna,
    careerjet,
    theirstack,
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
  jaabz,
  paypay,
  moneylion,
  agoda,
  grab,
  woven,
  rakuten,
  adzuna,
  careerjet,
  theirstack,
  mock,
];

export { type JobProvider } from "./types";
