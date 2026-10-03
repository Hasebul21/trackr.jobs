// Shapes returned by the backend API (see backend/src/jobs/job.types.ts).
// Dates come over the wire as ISO strings.

export type Seniority = 'junior' | 'mid' | 'senior' | 'unknown';
export type SortOption = 'score' | 'recent' | 'country';

export interface Job {
  id: string;
  source: string;
  sourceJobId: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  salary: string | null;
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
  postedAt: string | null;
  matchedScore: number;
  fingerprint: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  q?: string;
  source?: string[];
  country?: string[];
  level?: Seniority[];
  visa?: boolean;
  remote?: boolean;
  days?: number;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface JobPage {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SourceCount {
  source: string;
  count: number;
}

export interface Facets {
  sources: SourceCount[];
  countries: string[];
}

export interface JobStats {
  total: number;
  withVisa: number;
  remote: number;
  lastRunAt: string | null;
  bySource: SourceCount[];
}

export interface SourceResult {
  source: string;
  fetched: number;
  inserted: number;
  updated: number;
  ok: boolean;
  error?: string;
}

export interface RefreshResult {
  ok: boolean;
  totalUpserted: number;
  bySource: SourceResult[];
}

export interface ProviderInfo {
  name: string;
  label: string;
  reliable?: boolean;
}

export interface Settings {
  providers: ProviderInfo[];
  preferences: {
    includeTitleKeywords: string[];
    excludeTitleKeywords: string[];
    preferredLocations: string[];
    preferredTechnologies: string[];
  };
}
