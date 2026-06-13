// Information page — Master Application Profile.
// Static server component rendering the candidate's profile sections
// (education, work experience, publications, etc.) used when applying
// to roles surfaced by the dashboard.

import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: "Information — Trackr.jobs",
    description:
        "Master application profile: education, experience, publications, and references.",
};

export default function InformationPage() {
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 space-y-10">
            <header className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                    Master Application Profile
                </p>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Hasebul Hassan Chowdhury
                </h1>
                <p className="text-sm text-[var(--muted-foreground)]">
                    Generated 13 Jun 2026 · single source of truth for job and
                    scholarship applications.
                </p>
            </header>

            <nav aria-label="Table of contents">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-2">
                    Table of Contents
                </h2>
                <ol className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                    {TOC.map((t, i) => (
                        <li key={t.id} className="truncate">
                            <Link
                                href={`#${t.id}`}
                                className="hover:underline text-[var(--foreground)]"
                            >
                                <span className="text-[var(--muted-foreground)]">
                                    {String(i + 1).padStart(2, "0")}.
                                </span>{" "}
                                {t.label}
                            </Link>
                        </li>
                    ))}
                </ol>
            </nav>

            <Separator />

            <Section id="contact" title="1. Personal & Contact Details">
                <Placeholder text="Fill in name, email, phone, address, and links (LinkedIn, GitHub, portfolio) from the source profile." />
            </Section>

            <Section id="academic" title="2. Academic Profile">
                <Placeholder text="Summary of academic background, CGPA, research areas, and supervisors." />
            </Section>

            <Section id="education" title="3. Education">
                <SubSection title="3.1 Undergraduate Degree">
                    <p className="text-sm text-[var(--muted-foreground)]">
                        American International University-Bangladesh (AIUB) —
                        B.Sc. in Computer Science & Engineering.
                    </p>
                    <div className="mt-3 space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                            Activities & Extracurriculars (AIUB)
                        </h4>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                            <li>
                                Member of the AIUB Competitive Programming
                                Community (ACPC).
                            </li>
                            <li>
                                Participated in the 2019 and 2020 ICPC Asia
                                Dhaka Regional Contest.
                            </li>
                            <li>
                                Solved ~1,400+ problems across Codeforces,
                                CodeChef, HackerRank, UVa, and LightOJ during
                                undergraduate studies.
                            </li>
                            <li>
                                10th Place — Intra-AIUB Programming Contest,
                                Fall 2021–22.
                            </li>
                            <li>
                                6th Place — AIUB CS Fest 2018 Programming
                                Contest.
                            </li>
                        </ul>
                    </div>
                </SubSection>

                <SubSection title="3.2 Higher Secondary Certificate (HSC)">
                    <Placeholder text="Fill in board, group, GPA, and graduation year." />
                </SubSection>
            </Section>

            <Section id="experience" title="4. Work Experience">
                <SubSection title="4.1 Cefalo Bangladesh Ltd.">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                        Key Responsibilities & Achievements
                    </h4>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                        <li>
                            <span className="font-medium">
                                ATS Platform Development:
                            </span>{" "}
                            Led a team of 4 engineers to build a scalable
                            Applicant Tracking System using TypeScript, NestJS,
                            and React. Implemented role-based access control
                            and integrated HackerRank, improving interview
                            workflow efficiency and candidate management.
                        </li>
                        <li>
                            <span className="font-medium">
                                Performance Optimization:
                            </span>{" "}
                            Reduced large-scale archive import time from 3–4
                            minutes to under 1 minute by designing advanced
                            PostgreSQL indexing strategies and implementing
                            in-memory caching with Ehcache.
                        </li>
                        <li>
                            <span className="font-medium">
                                Scalable Backend Systems:
                            </span>{" "}
                            Designed and implemented background processing
                            pipelines and scheduler-based architectures using
                            Spring Boot, significantly improving system
                            throughput and handling high-volume data
                            operations.
                        </li>
                        <li>
                            <span className="font-medium">
                                Observability & Monitoring:
                            </span>{" "}
                            Implemented centralized logging and monitoring
                            using the ELK stack (Elasticsearch, Logstash,
                            Kibana), enabling faster issue detection and
                            improving system reliability.
                        </li>
                        <li>
                            <span className="font-medium">CI/CD & DevOps:</span>{" "}
                            Designed release pipelines using GitHub Actions,
                            Docker, and AWS EC2, reducing deployment time by
                            30%. Integrated Slack notifications with Jenkins to
                            improve CI/CD visibility.
                        </li>
                        <li>
                            <span className="font-medium">
                                Globalization & Platform Features:
                            </span>{" "}
                            Implemented Angular i18n for multi-language support
                            across 20+ markets; developed booking automation
                            features (quotation, workflow, discount modules).
                        </li>
                        <li>
                            <span className="font-medium">
                                Caching & System Efficiency:
                            </span>{" "}
                            Introduced Redis caching and optimized
                            scheduler-based processing to reduce latency in
                            high-traffic scenarios.
                        </li>
                        <li>
                            <span className="font-medium">
                                Collaboration & Documentation:
                            </span>{" "}
                            Contributed to Agile development processes
                            including sprint planning, code reviews, and
                            production support. Authored technical
                            documentation.
                        </li>
                    </ul>
                </SubSection>

                <SubSection title="4.2 American International University-Bangladesh (AIUB)">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                        Key Responsibilities
                    </h4>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                        <li>
                            Developed and maintained web-based features for
                            students, faculty, and administrative users,
                            improving accessibility of academic and university
                            services.
                        </li>
                        <li>
                            Implemented backend functionalities using Java for
                            internal portal modules and dynamic data-driven
                            pages.
                        </li>
                        <li>
                            Designed and optimized MySQL queries for efficient
                            storage and retrieval of academic and
                            service-related data.
                        </li>
                        <li>
                            Built dynamic modules including notices,
                            announcements, department pages, and student
                            services.
                        </li>
                    </ul>
                </SubSection>
            </Section>

            <Section id="skills" title="5. Technical Skills">
                <Placeholder text="Fill in languages, frameworks, databases, cloud, and tooling categories." />
            </Section>

            <Section id="publications" title="6. Publications & Research">
                <p className="text-sm">
                    ResearchGate:{" "}
                    <a
                        href="https://www.researchgate.net/profile/Hasebul-Hassan-Chowdhury/research"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--foreground)] underline underline-offset-2 hover:opacity-80"
                    >
                        researchgate.net/profile/Hasebul-Hassan-Chowdhury
                    </a>
                </p>

                <SubSection title="6.1 Chronic Kidney Disease (CKD) Paper">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                        Authors (in order)
                    </h4>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                        <li>
                            Md. Maniruzzaman — Dept. of Electrical and Computer
                            Engineering, San Francisco Bay University, Fremont,
                            CA, USA
                        </li>
                        <li>
                            Naima Najam Nejum — Dept. of Computer Science &
                            Engineering, AIUB, Dhaka, Bangladesh
                        </li>
                        <li>
                            Musfika Jannat Mamata — Dept. of Management
                            Information Systems, University of Dhaka, Dhaka,
                            Bangladesh
                        </li>
                        <li>
                            Hasebul Hassan Chowdhury — Dept. of Computer
                            Science & Engineering, AIUB, Dhaka, Bangladesh
                        </li>
                        <li>
                            Fahim Ahamed Romit — Dept. of Computer Science &
                            Engineering, BRAC University, Dhaka, Bangladesh
                        </li>
                        <li>
                            Sudoy Kumer Ghosh — Dept. of EEE, Dhaanish Ahmed
                            College of Engineering (Affiliated to Anna
                            University), Chennai, India
                        </li>
                    </ol>
                </SubSection>

                <SubSection title="6.2 Biomass / Bioenergy Paper">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                        Authors (in order)
                    </h4>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                        <li>
                            Shehabul Alam — College of Graduate and
                            Professional Studies, Trine University, California,
                            USA
                        </li>
                        <li>
                            Ayush Biswas — Dept. of Computer Science, BRAC
                            University, Dhaka, Bangladesh
                        </li>
                        <li>
                            Rehnuma Islam — Dept. of Computer Science, BRAC
                            University, Dhaka, Bangladesh
                        </li>
                        <li>
                            Shah Samadur Rahman — Dept. of Global Business and
                            Enterprise, Ulster University, London, UK
                        </li>
                        <li>
                            Hasebul Hassan Chowdhury — Dept. of Computer
                            Science & Engineering, AIUB, Dhaka, Bangladesh
                        </li>
                        <li>
                            Sudoy Kumer Ghosh — Dept. of EEE, Dhaanish Ahmed
                            College of Engineering (Affiliated to Anna
                            University), Chennai, India
                        </li>
                    </ol>
                </SubSection>
            </Section>

            <Section id="projects" title="7. Projects">
                <Placeholder text="Fill in standout personal/professional projects with stack and impact." />
            </Section>

            <Section id="certifications" title="8. Certifications & Courses">
                <Placeholder text="Fill in certifications, issuers, and dates." />
            </Section>

            <Section id="awards" title="9. Awards & Honors">
                <Placeholder text="Fill in scholarships, awards, and recognitions." />
            </Section>

            <Section id="test-scores" title="10. Test Scores">
                <Placeholder text="Fill in IELTS, GRE, and other standardized test scores." />
                <div className="mt-3 space-y-2 rounded-md border border-[var(--border)] bg-[var(--muted)]/30 p-3 text-xs text-[var(--muted-foreground)]">
                    <p>
                        <span className="font-semibold text-[var(--foreground)]">
                            NOTE:
                        </span>{" "}
                        IELTS validity is 2 years from test date (~Sep 2027).
                    </p>
                    <p>
                        British Council scores are marked{" "}
                        <Badge variant="outline">VERIFY</Badge> — band scores
                        could not be read from the source PDF; confirm from the
                        physical or online certificate.
                    </p>
                </div>
            </Section>

            <Section id="references" title="11. References">
                <p className="text-sm">
                    Five formal Letters of Recommendation (LORs) on file.
                    Details below.
                </p>
                <Placeholder text="Fill in referee names, titles, affiliations, and contact details." />
            </Section>

            <Section id="statements" title="12. Statements & Essays">
                <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                    <span className="font-semibold">[MISSING]</span> No
                    Statement of Purpose, Personal Statement, Motivation
                    Letter, Research Proposal, or Writing Sample was found in
                    the source documents. Draft and insert each below before
                    submitting.
                </div>
                <div className="mt-4 space-y-3">
                    {STATEMENT_PLACEHOLDERS.map((s) => (
                        <div
                            key={s}
                            className="rounded-md border border-dashed border-[var(--border)] p-3"
                        >
                            <div className="text-sm font-medium">[ {s} ]</div>
                            <div className="text-xs text-[var(--muted-foreground)] mt-1">
                                PLACEHOLDER: Write and insert this document
                                here before submitting applications.
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Separator />

            <footer className="pb-4 text-center text-xs text-[var(--muted-foreground)]">
                END OF MASTER APPLICATION PROFILE
            </footer>
        </div>
    );
}

const TOC: { id: string; label: string }[] = [
    { id: "contact", label: "Personal & Contact Details" },
    { id: "academic", label: "Academic Profile" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Work Experience" },
    { id: "skills", label: "Technical Skills" },
    { id: "publications", label: "Publications & Research" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications & Courses" },
    { id: "awards", label: "Awards & Honors" },
    { id: "test-scores", label: "Test Scores" },
    { id: "references", label: "References" },
    { id: "statements", label: "Statements & Essays" },
];

const STATEMENT_PLACEHOLDERS = [
    "Statement of Purpose (SOP)",
    "Personal Statement",
    "Motivation Letter",
    "Research Proposal (PhD)",
    "Writing Sample / Portfolio",
];

function Section({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section
            id={id}
            // scroll-mt offsets the sticky 56px navbar when jumping via #anchor.
            className="scroll-mt-20 space-y-3"
        >
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <div className="space-y-4">{children}</div>
        </section>
    );
}

function SubSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-md border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold mb-2">{title}</h3>
            {children}
        </div>
    );
}

function Placeholder({ text }: { text: string }) {
    return (
        <p className="rounded-md border border-dashed border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
            {text}
        </p>
    );
}
