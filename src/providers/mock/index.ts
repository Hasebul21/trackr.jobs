// A handful of realistic-looking jobs so the dashboard has content even
// when every real scraper returns [] (serverless IPs are often blocked,
// LinkedIn especially). Enabled when SEED_MOCK=1 or via `npm run seed`.

import type { RawJob } from "@/types/job";
import type { JobProvider } from "../types";

const SAMPLES: RawJob[] = [
  {
    sourceJobId: "mock-1",
    title: "Senior Backend Engineer (Kotlin)",
    company: "Mercari",
    companyLogo:
      "https://logo.clearbit.com/mercari.com",
    location: "Tokyo, Japan",
    salary: "¥10M–¥16M",
    description:
      "We're hiring a senior backend engineer to work on our marketplace platform. " +
      "Stack: Kotlin, Spring Boot, PostgreSQL, Kafka, GCP. Visa sponsorship and " +
      "relocation support provided. English is the working language; international " +
      "candidates are welcome to apply from abroad.",
    tags: ["Kotlin", "Spring Boot", "GCP"],
    technologies: ["Kotlin", "Spring Boot", "PostgreSQL", "Kafka", "GCP"],
    visaSupport: true,
    relocation: true,
    remote: false,
    seniority: "senior",
    applyUrl: "https://careers.mercari.com/jobs/senior-backend-kotlin-mock",
    sourceUrl: "https://careers.mercari.com/jobs/senior-backend-kotlin-mock",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    sourceJobId: "mock-2",
    title: "Platform Engineer",
    company: "Grab",
    companyLogo: "https://logo.clearbit.com/grab.com",
    location: "Singapore",
    salary: "SGD 120k–180k",
    description:
      "Build and operate the platform powering Grab's super app. Java, Spring, " +
      "Kubernetes, AWS. Mid-to-senior level. International applicants welcome; " +
      "relocation package provided.",
    tags: ["Java", "Kubernetes"],
    technologies: ["Java", "Spring", "Kubernetes", "AWS", "PostgreSQL"],
    visaSupport: true,
    relocation: true,
    remote: false,
    seniority: "senior",
    applyUrl: "https://grab.careers/platform-engineer-mock",
    sourceUrl: "https://grab.careers/platform-engineer-mock",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
  },
  {
    sourceJobId: "mock-3",
    title: "Full Stack Engineer (Remote Asia)",
    company: "Stripe",
    companyLogo: "https://logo.clearbit.com/stripe.com",
    location: "Remote Asia",
    description:
      "Join the Stripe Connect team building infrastructure for global payments. " +
      "TypeScript, React, Ruby, PostgreSQL. Fully remote across APAC. English OK.",
    tags: ["TypeScript", "Remote"],
    technologies: ["TypeScript", "React", "PostgreSQL"],
    visaSupport: false,
    relocation: false,
    remote: true,
    seniority: "mid",
    applyUrl: "https://stripe.com/jobs/listing/full-stack-apac-mock",
    sourceUrl: "https://stripe.com/jobs/listing/full-stack-apac-mock",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    sourceJobId: "mock-4",
    title: "Software Engineer, Distributed Systems",
    company: "LINE",
    companyLogo: "https://logo.clearbit.com/line.me",
    location: "Tokyo, Japan",
    salary: "¥8M–¥14M",
    description:
      "Work on LINE Messaging's distributed backend. Java, Kotlin, Kafka, " +
      "Cassandra. Visa sponsorship and relocation provided. 3+ years experience.",
    tags: ["Java", "Distributed Systems"],
    technologies: ["Java", "Kotlin", "Kafka"],
    visaSupport: true,
    relocation: true,
    remote: false,
    seniority: "mid",
    applyUrl: "https://careers.linecorp.com/jobs/distributed-systems-mock",
    sourceUrl: "https://careers.linecorp.com/jobs/distributed-systems-mock",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
  {
    sourceJobId: "mock-6",
    title: "Senior Software Engineer (Java/Spring)",
    company: "Brain Station 23",
    companyLogo: "https://logo.clearbit.com/brainstation-23.com",
    location: "Dhaka, Bangladesh",
    salary: "BDT 150k–250k/mo",
    description:
      "Join our enterprise engineering team building products for global clients. " +
      "Stack: Java, Spring Boot, PostgreSQL, React, AWS. On-site in Dhaka with " +
      "hybrid options. 4+ years experience. English working environment.",
    tags: ["Java", "Spring Boot"],
    technologies: ["Java", "Spring Boot", "PostgreSQL", "React", "AWS"],
    visaSupport: false,
    relocation: false,
    remote: false,
    seniority: "senior",
    applyUrl: "https://brainstation-23.com/careers/senior-software-engineer-mock",
    sourceUrl: "https://brainstation-23.com/careers/senior-software-engineer-mock",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
  },
  {
    sourceJobId: "mock-5",
    title: "Marketing Manager",
    company: "Some Co",
    location: "Tokyo, Japan",
    description: "Not relevant — exercises the EXCLUDE_TITLE_KEYWORDS path.",
    applyUrl: "https://example.com/marketing-mock",
    sourceUrl: "https://example.com/marketing-mock",
    seniority: "mid",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
];

export const mock: JobProvider = {
  name: "mock",
  label: "Sample Data",
  reliable: true,
  async fetchJobs() {
    return SAMPLES;
  },
};
