"use client";

// Information page — Master Application Profile (client view).
//
// Renders a sticky side nav (TOC) plus the active section's content.
// Active section is driven by the URL hash so existing deep links like
// `/information#contact` still work, and clicking a nav item updates
// the hash without reloading.

import { createContext, useContext, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

// React Context lets every <Section> decide whether to render itself
// without threading an `active` prop through every nested element.
const ActiveCtx = createContext<string>("contact");

export function InformationView() {
    const [active, setActive] = useState<string>(TOC[0].id);

    // Two-way sync with the URL hash: deep links + back/forward update
    // the active panel.
    useEffect(() => {
        const fromHash = () => {
            const id = window.location.hash.slice(1);
            if (id && TOC.some((t) => t.id === id)) setActive(id);
            else setActive(TOC[0].id);
        };
        fromHash();
        window.addEventListener("hashchange", fromHash);
        return () => window.removeEventListener("hashchange", fromHash);
    }, []);

    const handleSelect = (id: string) => {
        setActive(id);
        if (typeof window !== "undefined") {
            // replaceState avoids stacking duplicate history entries
            // and (unlike setting location.hash) doesn't fire
            // `hashchange`, so we already setState above.
            window.history.replaceState(null, "", `#${id}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
            <header className="mb-6 space-y-2">
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

            <div className="space-y-4 md:grid md:gap-6 md:space-y-0 md:grid-cols-[14rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)]">
                <SectionNav active={active} onSelect={handleSelect} />

                <ActiveCtx.Provider value={active}>
                    <main className="min-w-0 space-y-10">
                        {/* 1. Personal & Contact Details ----------------------------- */}
                        <Section id="contact" title="1. Personal & Contact Details">
                <KeyValueGrid
                    rows={[
                        ["Full Name", "HASEBUL HASSAN CHOWDHURY"],
                        ["Date of Birth", "13 April 1999"],
                        ["Gender", "Male"],
                        ["Nationality", "Bangladeshi"],
                        ["Blood Group", "B+"],
                        [
                            "Father's Name",
                            "Md. Mojibur Rahman Chowdhury (deceased)",
                        ],
                        ["Mother's Name", "Nigar Sultana"],
                        [
                            "Permanent Address",
                            "Chowdhuri Bari/552, Rahimpur, Dakkhin Durgapur Union, Cumilla Adarsha Sadar, Cumilla – 3500, Chattogram Division, Bangladesh",
                        ],
                        [
                            "Current Address",
                            <>
                                Dhaka, Bangladesh (work base; exact address{" "}
                                <VerifyTag />)
                            </>,
                        ],
                        [
                            "Mobile",
                            <a
                                key="m"
                                href="tel:+8801758144856"
                                className="hover:underline"
                            >
                                +880 1758144856
                            </a>,
                        ],
                        [
                            "Email (Personal)",
                            <a
                                key="ep"
                                href="mailto:hasebulhassan21@gmail.com"
                                className="hover:underline"
                            >
                                hasebulhassan21@gmail.com
                            </a>,
                        ],
                        [
                            "Email (Work)",
                            <a
                                key="ew"
                                href="mailto:hasebul.hassan@cefalo.com"
                                className="hover:underline"
                            >
                                hasebul.hassan@cefalo.com
                            </a>,
                        ],
                        [
                            "LinkedIn",
                            <ExtLink
                                key="li"
                                href="https://linkedin.com/in/hasebul"
                            >
                                linkedin.com/in/hasebul
                            </ExtLink>,
                        ],
                        [
                            "GitHub",
                            <ExtLink
                                key="gh"
                                href="https://github.com/Hasebul21"
                            >
                                github.com/Hasebul21
                            </ExtLink>,
                        ],
                        [
                            "Portfolio",
                            <ExtLink
                                key="pf"
                                href="https://hasebul21.github.io"
                            >
                                hasebul21.github.io
                            </ExtLink>,
                        ],
                        ["National ID No.", "7363512059"],
                        ["Passport Number", "A15376461"],
                        ["Passport Expiry", "24 August 2034"],
                        ["Passport Country", "Bangladesh (BGD)"],
                    ]}
                />
            </Section>

            {/* 2. Academic Profile --------------------------------------- */}
            <Section id="academic" title="2. Academic Profile">
                <KeyValueGrid
                    rows={[
                        [
                            "ORCID",
                            <ExtLink
                                key="o"
                                href="https://orcid.org/0009-0000-7889-5412"
                            >
                                0009-0000-7889-5412
                            </ExtLink>,
                        ],
                        [
                            "ResearchGate",
                            <ExtLink
                                key="rg"
                                href="https://www.researchgate.net/profile/Hasebul-Hassan-Chowdhury/research"
                            >
                                researchgate.net/profile/Hasebul-Hassan-Chowdhury
                            </ExtLink>,
                        ],
                        [
                            "Google Scholar",
                            <MissingTag key="gs" detail="not set up" />,
                        ],
                        [
                            "Competitive Programming",
                            <span key="cp" className="space-x-2">
                                <ExtLink href="https://stopstalk.com/user/profile/WA_TLE">
                                    stopstalk.com/user/profile/WA_TLE
                                </ExtLink>
                                <span className="text-[var(--muted-foreground)]">
                                    |
                                </span>
                                <ExtLink href="https://leetcode.com/u/Hasebul">
                                    leetcode.com/u/Hasebul
                                </ExtLink>
                            </span>,
                        ],
                        [
                            "GitHub",
                            <ExtLink
                                key="gh2"
                                href="https://github.com/Hasebul21"
                            >
                                github.com/Hasebul21
                            </ExtLink>,
                        ],
                        [
                            "Portfolio",
                            <ExtLink
                                key="pf2"
                                href="https://hasebul21.github.io"
                            >
                                hasebul21.github.io
                            </ExtLink>,
                        ],
                    ]}
                />
            </Section>

            {/* 3. Education ---------------------------------------------- */}
            <Section
                id="education"
                title="3. Education"
                subtitle="(Newest first)"
            >
                <SubSection title="3.1 Undergraduate Degree">
                    <KeyValueGrid
                        rows={[
                            [
                                "Institution",
                                "American International University–Bangladesh (AIUB)",
                            ],
                            ["Location", "Dhaka, Bangladesh"],
                            [
                                "Degree",
                                "Bachelor of Science in Computer Science & Engineering",
                            ],
                            ["Faculty", "Faculty of Science & Technology"],
                            ["Student ID", "18-37271-1"],
                            [
                                "Registration No.",
                                "23-39753-07 (Degree certificate)",
                            ],
                            ["Duration", "January 2018 – December 2022"],
                            ["Degree Conferred", "09 April 2025"],
                            ["CGPA", "3.58 / 4.00"],
                            [
                                "Total Credits",
                                "148 credits earned; 56 courses passed",
                            ],
                            ["Medium", "English"],
                            [
                                "Thesis",
                                <>
                                    CSC4299 THESIS – Grade: A (exact title{" "}
                                    <VerifyTag />)
                                </>,
                            ],
                            ["Accreditation", "PAASCU Accredited"],
                        ]}
                    />
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                            Activities & Extracurriculars (AIUB)
                        </h4>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
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
                                CodeChef, HackerRank, UVa, LightOJ during
                                undergraduate studies.
                            </li>
                            <li>
                                10th Place – Intra-AIUB Programming Contest,
                                Fall 2021–22.
                            </li>
                            <li>
                                6th Place – AIUB CS Fest 2018 Programming
                                Contest.
                            </li>
                        </ul>
                    </div>
                </SubSection>

                <SubSection title="3.2 Higher Secondary Certificate (HSC)">
                    <KeyValueGrid
                        rows={[
                            ["Institution", "Comilla Govt. College"],
                            ["Location", "Cumilla, Bangladesh"],
                            ["Group", "Science"],
                            ["Duration", "2015 – 2017"],
                            ["GPA", "4.00 / 5.00"],
                            [
                                "Board",
                                <>
                                    <VerifyTag /> likely Cumilla Education Board
                                </>,
                            ],
                        ]}
                    />
                </SubSection>
            </Section>

            {/* 4. Work Experience ---------------------------------------- */}
            <Section id="experience" title="4. Work Experience">
                <SubSection title="4.1 Cefalo Bangladesh Ltd.">
                    <KeyValueGrid
                        rows={[
                            ["Employer", "Cefalo Bangladesh Ltd."],
                            ["Location", "Dhaka, Bangladesh"],
                            ["Title", "Software Engineer (L1 → L2)"],
                            ["Dates", "June 2022 – Present"],
                            [
                                "Clients",
                                "DN Media Group, Zaui Stay, Stiftelsen Asta",
                            ],
                        ]}
                    />
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                            Key Responsibilities & Achievements
                        </h4>
                        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                            <li>
                                <span className="font-medium">
                                    ATS Platform Development:
                                </span>{" "}
                                Led a team of 4 engineers to build a scalable
                                Applicant Tracking System using TypeScript,
                                NestJS, and React. Implemented role-based
                                access control and integrated HackerRank,
                                improving interview workflow efficiency and
                                candidate management.
                            </li>
                            <li>
                                <span className="font-medium">
                                    Performance Optimization:
                                </span>{" "}
                                Reduced large-scale archive import time from
                                3–4 minutes to under 1 minute by designing
                                advanced PostgreSQL indexing strategies and
                                implementing in-memory caching with Ehcache.
                            </li>
                            <li>
                                <span className="font-medium">
                                    Scalable Backend Systems:
                                </span>{" "}
                                Designed and implemented background processing
                                pipelines and scheduler-based architectures
                                using Spring Boot, significantly improving
                                system throughput and handling high-volume
                                data operations.
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
                                <span className="font-medium">
                                    CI/CD & DevOps:
                                </span>{" "}
                                Designed release pipelines using GitHub
                                Actions, Docker, and AWS EC2, reducing
                                deployment time by 30%. Integrated Slack
                                notifications with Jenkins to improve CI/CD
                                visibility.
                            </li>
                            <li>
                                <span className="font-medium">
                                    Globalization & Platform Features:
                                </span>{" "}
                                Implemented Angular i18n for multi-language
                                support across 20+ markets; developed booking
                                automation features (quotation, workflow,
                                discount modules).
                            </li>
                            <li>
                                <span className="font-medium">
                                    Caching & System Efficiency:
                                </span>{" "}
                                Introduced Redis caching and optimized
                                scheduler-based processing to reduce latency
                                in high-traffic scenarios.
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
                    </div>
                </SubSection>

                <SubSection title="4.2 American International University-Bangladesh (AIUB)">
                    <KeyValueGrid
                        rows={[
                            [
                                "Employer",
                                "American International University-Bangladesh (AIUB)",
                            ],
                            ["Location", "Dhaka, Bangladesh (onsite)"],
                            ["Title", "Web Developer"],
                            ["Dates", "June 2021 – May 2022"],
                        ]}
                    />
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                            Key Responsibilities
                        </h4>
                        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                            <li>
                                Developed and maintained web-based features
                                for students, faculty, and administrative
                                users, improving accessibility of academic and
                                university services.
                            </li>
                            <li>
                                Implemented backend functionalities using Java
                                for internal portal modules and dynamic
                                data-driven pages.
                            </li>
                            <li>
                                Designed and optimized MySQL queries for
                                efficient storage and retrieval of academic
                                and service-related data.
                            </li>
                            <li>
                                Built dynamic modules including notices,
                                announcements, department pages, and student
                                services.
                            </li>
                        </ul>
                    </div>
                </SubSection>
            </Section>

            {/* 5. Technical Skills --------------------------------------- */}
            <Section id="skills" title="5. Technical Skills">
                <div className="overflow-hidden rounded-md border border-[var(--border)]">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--muted)]/40 text-left text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                            <tr>
                                <th className="px-3 py-2 font-semibold">
                                    Category
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Technologies / Tools
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {SKILLS.map(([cat, techs]) => (
                                <tr key={cat} className="align-top">
                                    <td className="px-3 py-2 font-medium whitespace-nowrap">
                                        {cat}
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex flex-wrap gap-1.5">
                                            {techs.map((t) => (
                                                <Badge
                                                    key={t}
                                                    variant="outline"
                                                >
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>

            {/* 6. Publications & Research -------------------------------- */}
            <Section id="publications" title="6. Publications & Research">
                <p className="text-sm">
                    ResearchGate:{" "}
                    <ExtLink href="https://www.researchgate.net/profile/Hasebul-Hassan-Chowdhury/research">
                        researchgate.net/profile/Hasebul-Hassan-Chowdhury
                    </ExtLink>
                </p>

                <SubSection title="6.1 Chronic Kidney Disease (CKD) Paper">
                    <KeyValueGrid
                        rows={[
                            [
                                "Title",
                                "Machine Learning-Based Early Risk Stratification Framework for Chronic Kidney Disease Progression Using Comprehensive Multi-Domain Clinical and Biochemical Data",
                            ],
                            [
                                "Published In",
                                "2026 International Conference on Smart Futuristic Technology (IEEE ICSFT 2026)",
                            ],
                            ["Conference Dates", "02–03 January 2026"],
                            ["Added to IEEE", "12 May 2026"],
                            [
                                "DOI",
                                <ExtLink
                                    key="doi"
                                    href="https://doi.org/10.1109/ICSFT66733.2026.11507621"
                                >
                                    10.1109/ICSFT66733.2026.11507621
                                </ExtLink>,
                            ],
                            [
                                "IEEE URL",
                                <ExtLink
                                    key="ieee"
                                    href="https://ieeexplore.ieee.org/document/11507621"
                                >
                                    ieeexplore.ieee.org/document/11507621
                                </ExtLink>,
                            ],
                            ["Publisher", "IEEE"],
                            ["Conference Loc.", "Bengaluru, India"],
                            ["ISBN (Electronic)", "979-8-3503-5707-3"],
                            ["ISBN (DVD)", "979-8-3503-5704-2"],
                            ["ISBN (USB)", "979-8-3503-5706-6"],
                            ["ISBN (PoD)", "979-8-3503-5708-0"],
                            ["Presentation", "Oral Presentation"],
                            ["Status", "Published (IEEE Xplore)"],
                        ]}
                    />
                    <AuthorList
                        authors={[
                            "Md. Maniruzzaman — Dept. of Electrical and Computer Engineering, San Francisco Bay University, Fremont, CA, USA",
                            "Naima Najam Nejum — Dept. of Computer Science & Engineering, AIUB, Dhaka, Bangladesh",
                            "Musfika Jannat Mamata — Dept. of Management Information Systems, University of Dhaka, Dhaka, Bangladesh",
                            "Hasebul Hassan Chowdhury — Dept. of Computer Science & Engineering, AIUB, Dhaka, Bangladesh",
                            "Fahim Ahamed Romit — Dept. of Computer Science & Engineering, BRAC University, Dhaka, Bangladesh",
                            "Sudoy Kumer Ghosh — Dept. of EEE, Dhaanish Ahmed College of Engineering (Affiliated to Anna University), Chennai, India",
                        ]}
                    />
                </SubSection>

                <SubSection title="6.2 Biomass / Bioenergy Paper">
                    <KeyValueGrid
                        rows={[
                            [
                                "Title",
                                "AI-Enhanced Prediction of Respiratory Irritation From Biomass Combustion Byproducts: An Integrative Machine Learning Framework for Sustainable Bioenergy Systems",
                            ],
                            [
                                "Published In",
                                "2026 5th International Conference on Communication, Computing and Electronics Systems (ICCCES)",
                            ],
                            ["Conference Dates", "21–23 January 2026"],
                            ["Added to IEEE", "25 March 2026"],
                            [
                                "DOI",
                                <ExtLink
                                    key="doi2"
                                    href="https://doi.org/10.1109/ICCCES62661.2026.11437157"
                                >
                                    10.1109/ICCCES62661.2026.11437157
                                </ExtLink>,
                            ],
                            [
                                "IEEE URL",
                                <ExtLink
                                    key="ieee2"
                                    href="https://ieeexplore.ieee.org/document/11437157"
                                >
                                    ieeexplore.ieee.org/document/11437157
                                </ExtLink>,
                            ],
                            ["Publisher", "IEEE"],
                            ["Conference Loc.", "Coimbatore, India"],
                            ["ISBN (Electronic)", "979-8-3315-5621-1"],
                            ["ISBN (DVD)", "979-8-3315-5620-4"],
                            ["ISBN (PoD)", "979-8-3315-5622-8"],
                            ["Status", "Published (IEEE Xplore)"],
                        ]}
                    />
                    <AuthorList
                        authors={[
                            "Shehabul Alam — College of Graduate and Professional Studies, Trine University, California, USA",
                            "Ayush Biswas — Dept. of Computer Science, BRAC University, Dhaka, Bangladesh",
                            "Rehnuma Islam — Dept. of Computer Science, BRAC University, Dhaka, Bangladesh",
                            "Shah Samadur Rahman — Dept. of Global Business and Enterprise, Ulster University, London, UK",
                            "Hasebul Hassan Chowdhury — Dept. of Computer Science & Engineering, AIUB, Dhaka, Bangladesh",
                            "Sudoy Kumer Ghosh — Dept. of EEE, Dhaanish Ahmed College of Engineering (Affiliated to Anna University), Chennai, India",
                        ]}
                    />
                </SubSection>
            </Section>

            {/* 7. Projects ----------------------------------------------- */}
            <Section id="projects" title="7. Projects">
                <div className="grid gap-4 sm:grid-cols-2">
                    <ProjectCard
                        name="Trading Portfolio Platform"
                        stack={[
                            "Next.js",
                            "TypeScript",
                            "Supabase",
                            "PostgreSQL",
                        ]}
                        description="Full-stack stock portfolio platform supporting transactions, live holdings, and P&L analytics. Integrated market-data APIs for real-time pricing and reporting. Used Cursor AI (structured prompts, agent loops) to accelerate development."
                        links={[
                            {
                                label: "Live: hasebul21.github.io",
                                href: "https://hasebul21.github.io",
                            },
                            {
                                label: "GitHub: github.com/Hasebul21",
                                href: "https://github.com/Hasebul21",
                            },
                        ]}
                    />
                    <ProjectCard
                        name="QuickChat"
                        stack={["WebSocket", "Redis", "Elasticsearch"]}
                        description="Real-time chat application with authentication and Redis caching for low-latency messaging. Integrated Elasticsearch for efficient message indexing and search."
                        links={[
                            {
                                label: "GitHub: github.com/Hasebul21",
                                href: "https://github.com/Hasebul21",
                            },
                        ]}
                        note="VERIFY direct project URL"
                    />
                </div>
            </Section>

            {/* 8. Certifications ----------------------------------------- */}
            <Section id="certifications" title="8. Certifications & Courses">
                <div className="overflow-x-auto rounded-md border border-[var(--border)]">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--muted)]/40 text-left text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                            <tr>
                                <th className="px-3 py-2 font-semibold">#</th>
                                <th className="px-3 py-2 font-semibold">
                                    Certification / Course
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Issuer / Platform
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Topics / Notes
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Credential URL
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] align-top">
                            {CERTIFICATIONS.map((c, i) => (
                                <tr key={i}>
                                    <td className="px-3 py-2 text-[var(--muted-foreground)]">
                                        {i + 1}
                                    </td>
                                    <td className="px-3 py-2 font-medium">
                                        {c.title}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {c.issuer}
                                    </td>
                                    <td className="px-3 py-2 text-[var(--muted-foreground)]">
                                        {c.topics}
                                    </td>
                                    <td className="px-3 py-2">
                                        {c.url ? (
                                            <ExtLink href={c.url}>
                                                <span className="break-all">
                                                    {c.url.replace(
                                                        /^https?:\/\//,
                                                        "",
                                                    )}
                                                </span>
                                            </ExtLink>
                                        ) : (
                                            <VerifyTag />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>

            {/* 9. Awards & Honors ---------------------------------------- */}
            <Section id="awards" title="9. Awards & Honors">
                <div className="overflow-x-auto rounded-md border border-[var(--border)]">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--muted)]/40 text-left text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                            <tr>
                                <th className="px-3 py-2 font-semibold">
                                    Award / Achievement
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Organizer
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Year
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Details / Link
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] align-top">
                            {AWARDS.map((a, i) => (
                                <tr key={i}>
                                    <td className="px-3 py-2 font-medium">
                                        {a.title}
                                    </td>
                                    <td className="px-3 py-2 text-[var(--muted-foreground)]">
                                        {a.organizer}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[var(--muted-foreground)]">
                                        {a.year}
                                    </td>
                                    <td className="px-3 py-2">
                                        {a.detail}
                                        {a.href && (
                                            <>
                                                {" — "}
                                                <ExtLink href={a.href}>
                                                    {a.href.replace(
                                                        /^https?:\/\//,
                                                        "",
                                                    )}
                                                </ExtLink>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>

            {/* 10. Test Scores ------------------------------------------- */}
            <Section id="test-scores" title="10. Test Scores">
                <div className="overflow-x-auto rounded-md border border-[var(--border)]">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--muted)]/40 text-left text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                            <tr>
                                <th className="px-3 py-2 font-semibold">
                                    Test
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Body
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Test Date
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Centre
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    Candidate No.
                                </th>
                                <th className="px-3 py-2 font-semibold">L</th>
                                <th className="px-3 py-2 font-semibold">R</th>
                                <th className="px-3 py-2 font-semibold">W</th>
                                <th className="px-3 py-2 font-semibold">S</th>
                                <th className="px-3 py-2 font-semibold">
                                    Overall
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    CEFR
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                    TRF Number
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] align-top">
                            <tr>
                                <td className="px-3 py-2 font-medium">
                                    IELTS Academic
                                </td>
                                <td className="px-3 py-2">IDP IELTS</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                    19 Sep 2025
                                </td>
                                <td className="px-3 py-2">BD050</td>
                                <td className="px-3 py-2">503399</td>
                                <td className="px-3 py-2">8.0</td>
                                <td className="px-3 py-2">6.5</td>
                                <td className="px-3 py-2">7.5</td>
                                <td className="px-3 py-2">6.0</td>
                                <td className="px-3 py-2 font-semibold">
                                    7.0
                                </td>
                                <td className="px-3 py-2">C1</td>
                                <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">
                                    25BD503399CHOH050A
                                </td>
                            </tr>
                            <tr>
                                <td className="px-3 py-2 font-medium">
                                    IELTS Academic
                                </td>
                                <td className="px-3 py-2">British Council</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                    18 Sep 2025
                                </td>
                                <td className="px-3 py-2">BD001</td>
                                <td className="px-3 py-2">024431</td>
                                <td className="px-3 py-2">
                                    <VerifyTag />
                                </td>
                                <td className="px-3 py-2">
                                    <VerifyTag />
                                </td>
                                <td className="px-3 py-2">
                                    <VerifyTag />
                                </td>
                                <td className="px-3 py-2">
                                    <VerifyTag />
                                </td>
                                <td className="px-3 py-2">
                                    <VerifyTag />
                                </td>
                                <td className="px-3 py-2">
                                    <VerifyTag />
                                </td>
                                <td className="px-3 py-2">
                                    <VerifyTag />
                                </td>
                            </tr>
                            <tr className="text-[var(--muted-foreground)]">
                                <td className="px-3 py-2 font-medium">GRE</td>
                                <td className="px-3 py-2">ETS</td>
                                <td className="px-3 py-2">
                                    <MissingTag />
                                </td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">
                                    <MissingTag />
                                </td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">
                                    <MissingTag />
                                </td>
                            </tr>
                            <tr className="text-[var(--muted-foreground)]">
                                <td className="px-3 py-2 font-medium">
                                    TOEFL
                                </td>
                                <td className="px-3 py-2">ETS</td>
                                <td className="px-3 py-2">
                                    <MissingTag />
                                </td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">
                                    <MissingTag />
                                </td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">
                                    <MissingTag />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="rounded-md border border-[var(--border)] bg-[var(--muted)]/30 p-3 text-xs text-[var(--muted-foreground)]">
                    <span className="font-semibold text-[var(--foreground)]">
                        NOTE:
                    </span>{" "}
                    IELTS validity is 2 years from test date (~Sep 2027).
                    British Council scores are marked <VerifyTag /> — band
                    scores could not be read from the source PDF; confirm from
                    the physical or online certificate.
                </div>
            </Section>

            {/* 11. References -------------------------------------------- */}
            <Section id="references" title="11. References">
                <p className="text-sm">
                    Five formal Letters of Recommendation (LORs) on file.
                    Details below.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    {REFERENCES.map((r) => (
                        <ReferenceCard key={r.name} {...r} />
                    ))}
                </div>
            </Section>

            {/* 12. Statements & Essays ----------------------------------- */}
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
                            <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                                PLACEHOLDER: Write and insert this document
                                here before submitting applications.
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

                        <footer className="pt-6 text-center text-xs text-[var(--muted-foreground)]">
                            END OF MASTER APPLICATION PROFILE
                        </footer>
                    </main>
                </ActiveCtx.Provider>
            </div>
        </div>
    );
}

/* ---------- Data tables ------------------------------------------------ */

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

const SKILLS: [string, string[]][] = [
    ["Programming Languages", ["Java", "Kotlin", "Python", "JavaScript", "C", "C++"]],
    ["Databases", ["PostgreSQL", "MongoDB", "MySQL"]],
    [
        "Backend Frameworks",
        ["Spring Boot", "FastAPI", "NestJS", "Express.js"],
    ],
    [
        "Frontend Tools",
        ["HTML", "CSS", "Angular", "React", "Next.js", "TypeScript"],
    ],
    [
        "Cloud Services (AWS)",
        [
            "IAM",
            "EC2",
            "S3",
            "RDS",
            "ECR",
            "ECS",
            "ELB",
            "Lambda",
            "CloudWatch",
            "SQS",
        ],
    ],
    [
        "DevOps & Infra",
        [
            "Git",
            "GitHub",
            "Jenkins",
            "GitHub Actions",
            "Docker",
            "Redis",
            "Elasticsearch",
        ],
    ],
    [
        "AI & ML",
        [
            "LLM API Integration",
            "Prompt Engineering",
            "RAG",
            "Vector Search & Embeddings",
        ],
    ],
    [
        "Monitoring & Logging",
        ["ELK Stack (Elasticsearch, Logstash, Kibana)"],
    ],
    [
        "Methodology",
        [
            "Agile/Scrum",
            "REST API Design",
            "System Architecture",
            "Distributed Systems",
        ],
    ],
];

const CERTIFICATIONS: {
    title: string;
    issuer: string;
    topics: string;
    url: string | null;
}[] = [
        {
            title: "Secure Coding & Application Security",
            issuer: "SecureFlag",
            topics:
                "Secure coding practices, OWASP Top 10, real-world exploitation scenarios",
            url: "https://www.secureflag.com/b?605ce7d7-16d6-44f7-bcc9-833c74b20ad4",
        },
        {
            title: "Data Structures",
            issuer: "UC San Diego via Coursera",
            topics:
                "Fundamental data structures, algorithm design, performance optimization",
            url: null,
        },
        {
            title: "[VERIFY title]",
            issuer: "Udemy",
            topics: "[VERIFY course topic]",
            url: "https://www.udemy.com/certificate/UC-8ac68928-edcc-427f-93ed-88ff1aa77103/",
        },
        {
            title: "[VERIFY title]",
            issuer: "Udemy",
            topics: "[VERIFY course topic]",
            url: "https://www.udemy.com/certificate/UC-6d722fbd-c2c4-4ad9-bfc8-d650409c2eed/",
        },
        {
            title: "[VERIFY title]",
            issuer: "HackerRank",
            topics: "[VERIFY skill/topic]",
            url: "https://www.hackerrank.com/certificates/19abdcaf9a62",
        },
    ];

const AWARDS: {
    title: string;
    organizer: string;
    year: string;
    detail: string;
    href?: string;
}[] = [
        {
            title: "Top 7.6% Global Rank – LeetCode",
            organizer: "LeetCode",
            year: "Ongoing",
            detail: "800+ problems solved",
            href: "https://leetcode.com/u/Hasebul",
        },
        {
            title: "10th Place – Intra AIUB Programming Contest (Fall 2021–22)",
            organizer: "AIUB",
            year: "2021–22",
            detail: "",
            href: "https://oj.synapse0.com/standings.php?contest=1013",
        },
        {
            title: "6th Place – AIUB CS Fest Programming Contest",
            organizer: "AIUB",
            year: "2018",
            detail: "",
            href: "https://toph.co/c/aiub-cs-fest-2018-j/standings?start=0",
        },
        {
            title: "2100+ Competitive Programming Problems Solved",
            organizer: "Codeforces, CodeChef, SPOJ, UVa, AtCoder, LeetCode",
            year: "Ongoing",
            detail: "",
            href: "https://stopstalk.com/user/profile/WA_TLE",
        },
        {
            title: "ICPC Asia Dhaka Regional Participant",
            organizer: "ACM-ICPC / AIUB (ACPC)",
            year: "2019, 2020",
            detail: "Participated as member of AIUB Competitive Programming Community (ACPC)",
        },
    ];

const REFERENCES: {
    name: string;
    title: string;
    institution: string;
    email: string;
    phone: string;
    linkedin: string | null;
    relationship: string;
    lorDate: string;
}[] = [
        {
            name: "Prabal Kanti Deb Sikder",
            title: "Engineering Manager",
            institution: "Cefalo Bangladesh Ltd.",
            email: "probal@cefalo.com",
            phone: "+8801816576058",
            linkedin: "https://linkedin.com/in/probalsikder/",
            relationship:
                "Engineering Manager & Team Coach (2 projects: Aug 2023, May 2024)",
            lorDate: "19 Feb 2026",
        },
        {
            name: "Md. Abu Naim Murad",
            title: "Senior Staff Software Engineer",
            institution: "Cefalo Bangladesh Ltd.",
            email: "naim.murad@cefalo.com",
            phone: "+8801722494834",
            linkedin: "https://linkedin.com/in/naim-murad/",
            relationship: "Direct Supervisor (since 01 Jun 2022)",
            lorDate: "06 Jan 2026",
        },
        {
            name: "Abhijit Bhowmik",
            title:
                "Associate Professor & Special Assistant, Office of Student Affairs",
            institution:
                "American International University–Bangladesh (AIUB), Dept. of Computer Science",
            email: "abhijit@aiub.edu",
            phone: "+880 2 8414046-9",
            linkedin: null,
            relationship:
                "Thesis Supervisor & Course Instructor (~4 years); Thesis grade A, Software Quality & Testing grade B+",
            lorDate: "27 Oct 2025",
        },
        {
            name: "Md. Mazid-Ul-Haque",
            title:
                "Assistant Professor & Special Assistant, Office of Student Affairs",
            institution:
                "American International University–Bangladesh (AIUB), Dept. of Computer Science, Faculty of Sci. & Tech.",
            email: "mazid@aiub.edu",
            phone: "+880 2 8414046-9",
            linkedin: null,
            relationship:
                "Faculty Mentor (academic consultation & career guidance sessions)",
            lorDate: "28 Oct 2025",
        },
        {
            name: "Rifat Tasnim Anannya",
            title: "Assistant Professor",
            institution:
                "American International University–Bangladesh (AIUB), Dept. of Computer Science",
            email: "rifat.tasnim@aiub.edu",
            phone: "+88 02 8414046-50",
            linkedin: null,
            relationship:
                "Course Instructor – Introduction to Programming (Spring 2017-18); grade A+",
            lorDate: "28 Oct 2025",
        },
    ];

const STATEMENT_PLACEHOLDERS = [
    "Statement of Purpose (SOP)",
    "Personal Statement",
    "Motivation Letter",
    "Research Proposal (PhD)",
    "Writing Sample / Portfolio",
];

/* ---------- Sub-components -------------------------------------------- */

function SectionNav({
    active,
    onSelect,
}: {
    active: string;
    onSelect: (id: string) => void;
}) {
    return (
        // self-start prevents the grid from stretching this cell to
        // match the main column's height — required for sticky to work.
        <div className="md:sticky md:top-[4.5rem] md:self-start">
            {/* Mobile: native dropdown — saves vertical space and is
                  fully keyboard-accessible without extra ARIA. */}
            <label htmlFor="section-select" className="sr-only">
                Profile section
            </label>
            <select
                id="section-select"
                value={active}
                onChange={(e) => onSelect(e.target.value)}
                className="block w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm md:hidden"
            >
                {TOC.map((t, i) => (
                    <option key={t.id} value={t.id}>
                        {String(i + 1).padStart(2, "0")}. {t.label}
                    </option>
                ))}
            </select>

            {/* Desktop: vertical sticky list. */}
            <nav className="hidden md:block" aria-label="Profile sections">
                <ol className="flex flex-col gap-0.5">
                    {TOC.map((t, i) => {
                        const isActive = active === t.id;
                        return (
                            <li key={t.id}>
                                <a
                                    href={`#${t.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onSelect(t.id);
                                    }}
                                    aria-current={
                                        isActive ? "page" : undefined
                                    }
                                    className={[
                                        "flex items-baseline gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                        isActive
                                            ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                                            : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]",
                                    ].join(" ")}
                                >
                                    <span className="shrink-0 font-mono text-[10px] tabular-nums text-[var(--muted-foreground)]">
                                        {String(i + 1).padStart(2, "0")}.
                                    </span>
                                    <span className="truncate">
                                        {t.label}
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
}

function Section({
    id,
    title,
    subtitle,
    children,
}: {
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    // Only the section matching the active nav item renders. Inactive
    // sections return null so they don't take up DOM or run effects.
    const active = useContext(ActiveCtx);
    if (active !== id) return null;
    return (
        <section id={id} className="space-y-3">
            <div>
                <h2 className="text-lg font-semibold tracking-tight">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-xs text-[var(--muted-foreground)]">
                        {subtitle}
                    </p>
                )}
            </div>
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
            <h3 className="mb-3 text-sm font-semibold">{title}</h3>
            {children}
        </div>
    );
}

function KeyValueGrid({ rows }: { rows: [string, React.ReactNode][] }) {
    return (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
            {rows.map(([k, v], i) => (
                <div
                    key={i}
                    className="contents"
                >
                    <dt className="font-medium text-[var(--muted-foreground)] sm:text-right">
                        {k}
                    </dt>
                    <dd className="text-[var(--foreground)] break-words">
                        {v}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

function AuthorList({ authors }: { authors: string[] }) {
    return (
        <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                Authors (in order)
            </h4>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                {authors.map((a, i) => {
                    const isMe = a.startsWith("Hasebul Hassan Chowdhury");
                    return (
                        <li
                            key={i}
                            className={isMe ? "font-medium" : undefined}
                        >
                            {a}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

function ProjectCard({
    name,
    stack,
    description,
    links,
    note,
}: {
    name: string;
    stack: string[];
    description: string;
    links: { label: string; href: string }[];
    note?: string;
}) {
    return (
        <div className="flex flex-col rounded-md border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold">{name}</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
                {stack.map((s) => (
                    <Badge key={s} variant="outline">
                        {s}
                    </Badge>
                ))}
            </div>
            <p className="mt-3 text-sm text-[var(--foreground)] leading-relaxed">
                {description}
            </p>
            <div className="mt-3 flex flex-col gap-1 text-xs">
                {links.map((l) => (
                    <ExtLink key={l.href} href={l.href}>
                        {l.label}
                    </ExtLink>
                ))}
                {note && (
                    <span className="text-[var(--muted-foreground)]">
                        [{note}]
                    </span>
                )}
            </div>
        </div>
    );
}

function ReferenceCard({
    name,
    title,
    institution,
    email,
    phone,
    linkedin,
    relationship,
    lorDate,
}: {
    name: string;
    title: string;
    institution: string;
    email: string;
    phone: string;
    linkedin: string | null;
    relationship: string;
    lorDate: string;
}) {
    return (
        <div className="flex flex-col rounded-md border border-[var(--border)] p-4 text-sm">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">
                        {title}
                    </p>
                </div>
                <Badge variant="outline" className="shrink-0 whitespace-nowrap">
                    LOR {lorDate}
                </Badge>
            </div>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                {institution}
            </p>
            <dl className="mt-3 space-y-1 text-xs">
                <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-[var(--muted-foreground)]">
                        Email
                    </dt>
                    <dd className="break-all">
                        <a
                            href={`mailto:${email}`}
                            className="hover:underline"
                        >
                            {email}
                        </a>
                    </dd>
                </div>
                <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-[var(--muted-foreground)]">
                        Phone
                    </dt>
                    <dd>
                        <a
                            href={`tel:${phone.replace(/\s+/g, "")}`}
                            className="hover:underline"
                        >
                            {phone}
                        </a>
                    </dd>
                </div>
                <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-[var(--muted-foreground)]">
                        LinkedIn
                    </dt>
                    <dd className="break-all">
                        {linkedin ? (
                            <ExtLink href={linkedin}>
                                {linkedin.replace(/^https?:\/\//, "")}
                            </ExtLink>
                        ) : (
                            <span className="text-[var(--muted-foreground)]">
                                —
                            </span>
                        )}
                    </dd>
                </div>
                <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-[var(--muted-foreground)]">
                        Relationship
                    </dt>
                    <dd>{relationship}</dd>
                </div>
            </dl>
        </div>
    );
}

function ExtLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--foreground)] underline underline-offset-2 hover:opacity-80"
        >
            {children}
        </a>
    );
}

function VerifyTag() {
    return (
        <Badge
            variant="outline"
            className="border-amber-500/50 text-amber-700 dark:text-amber-300"
        >
            VERIFY
        </Badge>
    );
}

function MissingTag({ detail }: { detail?: string }) {
    return (
        <Badge variant="outline" className="text-[var(--muted-foreground)]">
            MISSING{detail ? ` — ${detail}` : ""}
        </Badge>
    );
}
