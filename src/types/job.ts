// Normalized job shape used across the app. Maps 1:1 to the Prisma Job
// model but with arrays as arrays (not JSON strings) and Date as Date.

export type Seniority = "junior" | "mid" | "senior" | "unknown";

export type Job = {
  id: string;
  source: string;
  sourceJobId: string;
  title: string;
  company: string;
  companyLogo?: string | null;
  location: string;
  salary?: string | null;
  description: string;
  requirements: string[];
  tags: string[];
  technologies: string[];
  visaSupport: boolean;
  remote: boolean;
  relocation: boolean;
  seniority: Seniority;
  applyUrl: string;
  sourceUrl: string;
  postedAt?: Date | null;
  matchedScore: number;
  fingerprint: string;
  createdAt: Date;
  updatedAt: Date;
};

// Raw fields a provider can produce. Anything not supplied is inferred
// from `title + description` by the normalizer.
export type RawJob = {
  sourceJobId: string;
  title: string;
  company: string;
  companyLogo?: string | null;
  location?: string;
  salary?: string | null;
  description?: string;
  requirements?: string[];
  tags?: string[];
  technologies?: string[];
  visaSupport?: boolean;
  remote?: boolean;
  relocation?: boolean;
  seniority?: Seniority;
  applyUrl: string;
  sourceUrl?: string;
  postedAt?: Date | null;
};

export type JobFilters = {
  q?: string;
  source?: string[];
  country?: string[];
  visaOnly?: boolean;
  remoteOnly?: boolean;
  seniority?: Seniority[];
  tech?: string[];
  postedWithinDays?: number;
  hasSalary?: boolean;
  sort?: "score" | "recent" | "country";
  page?: number;
  pageSize?: number;
};
