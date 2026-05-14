// Single source of truth for what "a job worth seeing" means. Tweak here
// to retune scoring + filtering without touching providers.

export const INCLUDE_TITLE_KEYWORDS = [
  "software engineer",
  "backend engineer",
  "back-end engineer",
  "full stack engineer",
  "fullstack engineer",
  "full-stack engineer",
  "platform engineer",
  "java developer",
  "kotlin developer",
  "spring boot",
  "distributed systems",
  "jvm",
  "api engineer",
  "sre",
  "site reliability",
];

/**
 * Hard allowlist applied at ingest time. A job is dropped before it ever
 * reaches the database unless its title matches one of these role patterns.
 * Variants (back-end, front end, fullstack, etc.) are baked in.
 */
export const ALLOWED_TITLE_PATTERNS: RegExp[] = [
  /\bback[\s-]?end\b.*\b(engineer|developer)\b/i,
  /\bfront[\s-]?end\b.*\b(engineer|developer)\b/i,
  /\bfull[\s-]?stack\b.*\b(engineer|developer)\b/i,
  /\bdev[\s-]?ops\b.*\b(engineer|developer)\b/i,
  /\bsite reliability\b.*\bengineer\b/i,
  /\bsre\b/i,
  /\bcloud\b.*\b(engineer|developer)\b/i,
];

export function matchesAllowedTitle(title: string): boolean {
  return ALLOWED_TITLE_PATTERNS.some((re) => re.test(title));
}

export const EXCLUDE_TITLE_KEYWORDS = [
  "intern",
  "internship",
  "junior only",
  "marketing",
  "sales",
  "recruiter",
  "designer",
  "ux ",
  "ui ",
  "product manager",
  "data entry",
];

export const PREFERRED_TECHNOLOGIES = [
  "java",
  "kotlin",
  "spring",
  "spring boot",
  "postgresql",
  "postgres",
  "docker",
  "kubernetes",
  "k8s",
  "aws",
  "azure",
  "gcp",
  "angular",
  "react",
  "typescript",
  "scala",
  "graphql",
  "kafka",
  "redis",
];

export const PREFERRED_LOCATIONS = [
  "japan",
  "tokyo",
  "osaka",
  "kyoto",
  "yokohama",
  "singapore",
  "remote asia",
  "remote",
];

export const VISA_PHRASES = [
  "visa sponsorship",
  "visa support",
  "visa sponsor",
  "sponsor visa",
  "sponsor a visa",
  "relocation",
  "relocate",
  "apply from abroad",
  "international candidates",
  "international applicants",
  "english ok",
  "english is enough",
  "english speaking",
];

export const SENIORITY_HINTS = {
  senior: ["senior", "staff", "principal", "lead engineer", "tech lead"],
  mid: ["mid", "intermediate", "mid-level", "mid level"],
  junior: ["junior", "entry level", "entry-level", "graduate", "intern"],
} as const;

export const COUNTRY_HINTS: Record<string, string[]> = {
  Japan: [
    "japan",
    "tokyo",
    "osaka",
    "kyoto",
    "yokohama",
    "fukuoka",
    "nagoya",
    ", jp",
    " jp",
  ],
  Singapore: ["singapore", ", sg", " sg"],
  Malaysia: [
    "malaysia",
    "kuala lumpur",
    "petaling jaya",
    "penang",
    "cyberjaya",
    ", my",
    " my",
  ],
  Thailand: ["thailand", "bangkok", "phuket", "chiang mai", ", th", " th"],
  Indonesia: ["indonesia", "jakarta", "bali", ", id", " id"],
  Philippines: ["philippines", "manila", "cebu", ", ph", " ph"],
  Vietnam: ["vietnam", "ho chi minh", "hanoi", ", vn", " vn"],
  Remote: ["remote", "anywhere"],
};

export function detectCountry(location: string): string | null {
  const l = location.toLowerCase();
  for (const [country, hints] of Object.entries(COUNTRY_HINTS)) {
    if (hints.some((h) => l.includes(h))) return country;
  }
  return null;
}
