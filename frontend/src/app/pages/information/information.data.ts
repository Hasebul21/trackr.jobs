// Content for the master application profile on /information.

// A rich value is a list of inline pieces: plain text, links, and the
// VERIFY / MISSING markers used for data that still needs checking.
export type Inline =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; href: string; external?: boolean }
  | { type: 'separator' }
  | { type: 'verify' }
  | { type: 'missing'; detail?: string };

export type Value = string | Inline[];

export interface Row {
  label: string;
  value: Value;
}

export interface Section {
  id: string;
  label: string;
  subtitle?: string;
}

export interface Bullet {
  lead?: string;
  text: string;
}

export interface Education {
  title: string;
  rows: Row[];
  activities?: string[];
}

export interface Experience {
  title: string;
  rows: Row[];
  heading: string;
  bullets: Bullet[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Publication {
  title: string;
  rows: Row[];
  authors: string[];
}

export interface Project {
  name: string;
  stack: string[];
  description: string;
  links: { label: string; href: string }[];
  note?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  topics: string;
  url: string | null;
}

export interface Award {
  title: string;
  organizer: string;
  year: string;
  detail: string;
  href?: string;
}

export interface TestScore {
  test: string;
  body: string;
  date: Value;
  centre: string;
  candidateNo: string;
  listening: Value;
  reading: Value;
  writing: Value;
  speaking: Value;
  overall: Value;
  cefr: Value;
  trf: Value;
  // Tests not taken yet are shown in muted text.
  muted?: boolean;
}

export interface Reference {
  name: string;
  title: string;
  institution: string;
  email: string;
  phone: string;
  linkedin: string | null;
  relationship: string;
  lorDate: string;
}

const link = (text: string, href: string): Inline => ({ type: 'link', text, href, external: true });
const text = (value: string): Inline => ({ type: 'text', text: value });
const VERIFY: Inline[] = [{ type: 'verify' }];
const MISSING: Inline[] = [{ type: 'missing' }];

export const PROFILE = {
  name: 'Hasebul Hassan Chowdhury',
  generated: 'Generated 13 Jun 2026 · single source of truth for job and scholarship applications.',
};

export const SECTIONS: Section[] = [
  { id: 'contact', label: 'Personal & Contact Details' },
  { id: 'academic', label: 'Academic Profile' },
  { id: 'education', label: 'Education', subtitle: '(Newest first)' },
  { id: 'experience', label: 'Work Experience' },
  { id: 'skills', label: 'Technical Skills' },
  { id: 'publications', label: 'Publications & Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications & Courses' },
  { id: 'awards', label: 'Awards & Honors' },
  { id: 'test-scores', label: 'Test Scores' },
  { id: 'references', label: 'References' },
  { id: 'statements', label: 'Statements & Essays' },
];

export const CONTACT: Row[] = [
  { label: 'Full Name', value: 'HASEBUL HASSAN CHOWDHURY' },
  { label: 'Date of Birth', value: '13 April 1999' },
  { label: 'Gender', value: 'Male' },
  { label: 'Nationality', value: 'Bangladeshi' },
  { label: 'Blood Group', value: 'B+' },
  { label: "Father's Name", value: 'Md. Mojibur Rahman Chowdhury (deceased)' },
  { label: "Mother's Name", value: 'Nigar Sultana' },
  {
    label: 'Permanent Address',
    value:
      'Chowdhuri Bari/552, Rahimpur, Dakkhin Durgapur Union, Cumilla Adarsha Sadar, Cumilla – 3500, Chattogram Division, Bangladesh',
  },
  {
    label: 'Current Address',
    value: [text('Dhaka, Bangladesh (work base; exact address '), { type: 'verify' }, text(')')],
  },
  {
    label: 'Mobile',
    value: [{ type: 'link', text: '+880 1758144856', href: 'tel:+8801758144856' }],
  },
  {
    label: 'Email (Personal)',
    value: [
      {
        type: 'link',
        text: 'hasebulhassan21@gmail.com',
        href: 'mailto:hasebulhassan21@gmail.com',
      },
    ],
  },
  {
    label: 'Email (Work)',
    value: [
      {
        type: 'link',
        text: 'hasebul.hassan@cefalo.com',
        href: 'mailto:hasebul.hassan@cefalo.com',
      },
    ],
  },
  {
    label: 'LinkedIn',
    value: [link('linkedin.com/in/hasebul', 'https://linkedin.com/in/hasebul')],
  },
  { label: 'GitHub', value: [link('github.com/Hasebul21', 'https://github.com/Hasebul21')] },
  { label: 'Portfolio', value: [link('hasebul21.github.io', 'https://hasebul21.github.io')] },
  { label: 'National ID No.', value: '7363512059' },
  { label: 'Passport Number', value: 'A15376461' },
  { label: 'Passport Expiry', value: '24 August 2034' },
  { label: 'Passport Country', value: 'Bangladesh (BGD)' },
];

export const ACADEMIC: Row[] = [
  { label: 'ORCID', value: [link('0009-0000-7889-5412', 'https://orcid.org/0009-0000-7889-5412')] },
  {
    label: 'ResearchGate',
    value: [
      link(
        'researchgate.net/profile/Hasebul-Hassan-Chowdhury',
        'https://www.researchgate.net/profile/Hasebul-Hassan-Chowdhury/research',
      ),
    ],
  },
  { label: 'Google Scholar', value: [{ type: 'missing', detail: 'not set up' }] },
  {
    label: 'Competitive Programming',
    value: [
      link('stopstalk.com/user/profile/WA_TLE', 'https://stopstalk.com/user/profile/WA_TLE'),
      { type: 'separator' },
      link('leetcode.com/u/Hasebul', 'https://leetcode.com/u/Hasebul'),
    ],
  },
  { label: 'GitHub', value: [link('github.com/Hasebul21', 'https://github.com/Hasebul21')] },
  { label: 'Portfolio', value: [link('hasebul21.github.io', 'https://hasebul21.github.io')] },
];

export const EDUCATION: Education[] = [
  {
    title: '3.1 Undergraduate Degree',
    rows: [
      { label: 'Institution', value: 'American International University–Bangladesh (AIUB)' },
      { label: 'Location', value: 'Dhaka, Bangladesh' },
      { label: 'Degree', value: 'Bachelor of Science in Computer Science & Engineering' },
      { label: 'Faculty', value: 'Faculty of Science & Technology' },
      { label: 'Student ID', value: '18-37271-1' },
      { label: 'Registration No.', value: '23-39753-07 (Degree certificate)' },
      { label: 'Duration', value: 'January 2018 – December 2022' },
      { label: 'Degree Conferred', value: '09 April 2025' },
      { label: 'CGPA', value: '3.58 / 4.00' },
      { label: 'Total Credits', value: '148 credits earned; 56 courses passed' },
      { label: 'Medium', value: 'English' },
      {
        label: 'Thesis',
        value: [text('CSC4299 THESIS – Grade: A (exact title '), { type: 'verify' }, text(')')],
      },
      { label: 'Accreditation', value: 'PAASCU Accredited' },
    ],
    activities: [
      'Member of the AIUB Competitive Programming Community (ACPC).',
      'Participated in the 2019 and 2020 ICPC Asia Dhaka Regional Contest.',
      'Solved ~1,400+ problems across Codeforces, CodeChef, HackerRank, UVa, LightOJ during undergraduate studies.',
      '10th Place – Intra-AIUB Programming Contest, Fall 2021–22.',
      '6th Place – AIUB CS Fest 2018 Programming Contest.',
    ],
  },
  {
    title: '3.2 Higher Secondary Certificate (HSC)',
    rows: [
      { label: 'Institution', value: 'Comilla Govt. College' },
      { label: 'Location', value: 'Cumilla, Bangladesh' },
      { label: 'Group', value: 'Science' },
      { label: 'Duration', value: '2015 – 2017' },
      { label: 'GPA', value: '4.00 / 5.00' },
      { label: 'Board', value: [{ type: 'verify' }, text(' likely Cumilla Education Board')] },
    ],
  },
];

export const EXPERIENCE: Experience[] = [
  {
    title: '4.1 Cefalo Bangladesh Ltd.',
    rows: [
      { label: 'Employer', value: 'Cefalo Bangladesh Ltd.' },
      { label: 'Location', value: 'Dhaka, Bangladesh' },
      { label: 'Title', value: 'Software Engineer (L1 → L2)' },
      { label: 'Dates', value: 'June 2022 – Present' },
      { label: 'Clients', value: 'DN Media Group, Zaui Stay, Stiftelsen Asta' },
    ],
    heading: 'Key Responsibilities & Achievements',
    bullets: [
      {
        lead: 'ATS Platform Development:',
        text: 'Led a team of 4 engineers to build a scalable Applicant Tracking System using TypeScript, NestJS, and React. Implemented role-based access control and integrated HackerRank, improving interview workflow efficiency and candidate management.',
      },
      {
        lead: 'Performance Optimization:',
        text: 'Reduced large-scale archive import time from 3–4 minutes to under 1 minute by designing advanced PostgreSQL indexing strategies and implementing in-memory caching with Ehcache.',
      },
      {
        lead: 'Scalable Backend Systems:',
        text: 'Designed and implemented background processing pipelines and scheduler-based architectures using Spring Boot, significantly improving system throughput and handling high-volume data operations.',
      },
      {
        lead: 'Observability & Monitoring:',
        text: 'Implemented centralized logging and monitoring using the ELK stack (Elasticsearch, Logstash, Kibana), enabling faster issue detection and improving system reliability.',
      },
      {
        lead: 'CI/CD & DevOps:',
        text: 'Designed release pipelines using GitHub Actions, Docker, and AWS EC2, reducing deployment time by 30%. Integrated Slack notifications with Jenkins to improve CI/CD visibility.',
      },
      {
        lead: 'Globalization & Platform Features:',
        text: 'Implemented Angular i18n for multi-language support across 20+ markets; developed booking automation features (quotation, workflow, discount modules).',
      },
      {
        lead: 'Caching & System Efficiency:',
        text: 'Introduced Redis caching and optimized scheduler-based processing to reduce latency in high-traffic scenarios.',
      },
      {
        lead: 'Collaboration & Documentation:',
        text: 'Contributed to Agile development processes including sprint planning, code reviews, and production support. Authored technical documentation.',
      },
    ],
  },
  {
    title: '4.2 American International University-Bangladesh (AIUB)',
    rows: [
      { label: 'Employer', value: 'American International University-Bangladesh (AIUB)' },
      { label: 'Location', value: 'Dhaka, Bangladesh (onsite)' },
      { label: 'Title', value: 'Web Developer' },
      { label: 'Dates', value: 'June 2021 – May 2022' },
    ],
    heading: 'Key Responsibilities',
    bullets: [
      {
        text: 'Developed and maintained web-based features for students, faculty, and administrative users, improving accessibility of academic and university services.',
      },
      {
        text: 'Implemented backend functionalities using Java for internal portal modules and dynamic data-driven pages.',
      },
      {
        text: 'Designed and optimized MySQL queries for efficient storage and retrieval of academic and service-related data.',
      },
      {
        text: 'Built dynamic modules including notices, announcements, department pages, and student services.',
      },
    ],
  },
];

export const SKILLS: SkillGroup[] = [
  {
    category: 'Programming Languages',
    items: ['Java', 'Kotlin', 'Python', 'JavaScript', 'C', 'C++'],
  },
  { category: 'Databases', items: ['PostgreSQL', 'MongoDB', 'MySQL'] },
  { category: 'Backend Frameworks', items: ['Spring Boot', 'FastAPI', 'NestJS', 'Express.js'] },
  {
    category: 'Frontend Tools',
    items: ['HTML', 'CSS', 'Angular', 'React', 'Next.js', 'TypeScript'],
  },
  {
    category: 'Cloud Services (AWS)',
    items: ['IAM', 'EC2', 'S3', 'RDS', 'ECR', 'ECS', 'ELB', 'Lambda', 'CloudWatch', 'SQS'],
  },
  {
    category: 'DevOps & Infra',
    items: ['Git', 'GitHub', 'Jenkins', 'GitHub Actions', 'Docker', 'Redis', 'Elasticsearch'],
  },
  {
    category: 'AI & ML',
    items: ['LLM API Integration', 'Prompt Engineering', 'RAG', 'Vector Search & Embeddings'],
  },
  { category: 'Monitoring & Logging', items: ['ELK Stack (Elasticsearch, Logstash, Kibana)'] },
  {
    category: 'Methodology',
    items: ['Agile/Scrum', 'REST API Design', 'System Architecture', 'Distributed Systems'],
  },
];

export const RESEARCHGATE = {
  text: 'researchgate.net/profile/Hasebul-Hassan-Chowdhury',
  href: 'https://www.researchgate.net/profile/Hasebul-Hassan-Chowdhury/research',
};

export const PUBLICATIONS: Publication[] = [
  {
    title: '6.1 Chronic Kidney Disease (CKD) Paper',
    rows: [
      {
        label: 'Title',
        value:
          'Machine Learning-Based Early Risk Stratification Framework for Chronic Kidney Disease Progression Using Comprehensive Multi-Domain Clinical and Biochemical Data',
      },
      {
        label: 'Published In',
        value: '2026 International Conference on Smart Futuristic Technology (IEEE ICSFT 2026)',
      },
      { label: 'Conference Dates', value: '02–03 January 2026' },
      { label: 'Added to IEEE', value: '12 May 2026' },
      {
        label: 'DOI',
        value: [
          link(
            '10.1109/ICSFT66733.2026.11507621',
            'https://doi.org/10.1109/ICSFT66733.2026.11507621',
          ),
        ],
      },
      {
        label: 'IEEE URL',
        value: [
          link(
            'ieeexplore.ieee.org/document/11507621',
            'https://ieeexplore.ieee.org/document/11507621',
          ),
        ],
      },
      { label: 'Publisher', value: 'IEEE' },
      { label: 'Conference Loc.', value: 'Bengaluru, India' },
      { label: 'ISBN (Electronic)', value: '979-8-3503-5707-3' },
      { label: 'ISBN (DVD)', value: '979-8-3503-5704-2' },
      { label: 'ISBN (USB)', value: '979-8-3503-5706-6' },
      { label: 'ISBN (PoD)', value: '979-8-3503-5708-0' },
      { label: 'Presentation', value: 'Oral Presentation' },
      { label: 'Status', value: 'Published (IEEE Xplore)' },
    ],
    authors: [
      'Md. Maniruzzaman — Dept. of Electrical and Computer Engineering, San Francisco Bay University, Fremont, CA, USA',
      'Naima Najam Nejum — Dept. of Computer Science & Engineering, AIUB, Dhaka, Bangladesh',
      'Musfika Jannat Mamata — Dept. of Management Information Systems, University of Dhaka, Dhaka, Bangladesh',
      'Hasebul Hassan Chowdhury — Dept. of Computer Science & Engineering, AIUB, Dhaka, Bangladesh',
      'Fahim Ahamed Romit — Dept. of Computer Science & Engineering, BRAC University, Dhaka, Bangladesh',
      'Sudoy Kumer Ghosh — Dept. of EEE, Dhaanish Ahmed College of Engineering (Affiliated to Anna University), Chennai, India',
    ],
  },
  {
    title: '6.2 Biomass / Bioenergy Paper',
    rows: [
      {
        label: 'Title',
        value:
          'AI-Enhanced Prediction of Respiratory Irritation From Biomass Combustion Byproducts: An Integrative Machine Learning Framework for Sustainable Bioenergy Systems',
      },
      {
        label: 'Published In',
        value:
          '2026 5th International Conference on Communication, Computing and Electronics Systems (ICCCES)',
      },
      { label: 'Conference Dates', value: '21–23 January 2026' },
      { label: 'Added to IEEE', value: '25 March 2026' },
      {
        label: 'DOI',
        value: [
          link(
            '10.1109/ICCCES62661.2026.11437157',
            'https://doi.org/10.1109/ICCCES62661.2026.11437157',
          ),
        ],
      },
      {
        label: 'IEEE URL',
        value: [
          link(
            'ieeexplore.ieee.org/document/11437157',
            'https://ieeexplore.ieee.org/document/11437157',
          ),
        ],
      },
      { label: 'Publisher', value: 'IEEE' },
      { label: 'Conference Loc.', value: 'Coimbatore, India' },
      { label: 'ISBN (Electronic)', value: '979-8-3315-5621-1' },
      { label: 'ISBN (DVD)', value: '979-8-3315-5620-4' },
      { label: 'ISBN (PoD)', value: '979-8-3315-5622-8' },
      { label: 'Status', value: 'Published (IEEE Xplore)' },
    ],
    authors: [
      'Shehabul Alam — College of Graduate and Professional Studies, Trine University, California, USA',
      'Ayush Biswas — Dept. of Computer Science, BRAC University, Dhaka, Bangladesh',
      'Rehnuma Islam — Dept. of Computer Science, BRAC University, Dhaka, Bangladesh',
      'Shah Samadur Rahman — Dept. of Global Business and Enterprise, Ulster University, London, UK',
      'Hasebul Hassan Chowdhury — Dept. of Computer Science & Engineering, AIUB, Dhaka, Bangladesh',
      'Sudoy Kumer Ghosh — Dept. of EEE, Dhaanish Ahmed College of Engineering (Affiliated to Anna University), Chennai, India',
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    name: 'Trading Portfolio Platform',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'],
    description:
      'Full-stack stock portfolio platform supporting transactions, live holdings, and P&L analytics. Integrated market-data APIs for real-time pricing and reporting. Used Cursor AI (structured prompts, agent loops) to accelerate development.',
    links: [
      { label: 'Live: hasebul21.github.io', href: 'https://hasebul21.github.io' },
      { label: 'GitHub: github.com/Hasebul21', href: 'https://github.com/Hasebul21' },
    ],
  },
  {
    name: 'QuickChat',
    stack: ['WebSocket', 'Redis', 'Elasticsearch'],
    description:
      'Real-time chat application with authentication and Redis caching for low-latency messaging. Integrated Elasticsearch for efficient message indexing and search.',
    links: [{ label: 'GitHub: github.com/Hasebul21', href: 'https://github.com/Hasebul21' }],
    note: 'VERIFY direct project URL',
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    title: 'Secure Coding & Application Security',
    issuer: 'SecureFlag',
    topics: 'Secure coding practices, OWASP Top 10, real-world exploitation scenarios',
    url: 'https://www.secureflag.com/b?605ce7d7-16d6-44f7-bcc9-833c74b20ad4',
  },
  {
    title: 'Data Structures',
    issuer: 'UC San Diego via Coursera',
    topics: 'Fundamental data structures, algorithm design, performance optimization',
    url: null,
  },
  {
    title: '[VERIFY title]',
    issuer: 'Udemy',
    topics: '[VERIFY course topic]',
    url: 'https://www.udemy.com/certificate/UC-8ac68928-edcc-427f-93ed-88ff1aa77103/',
  },
  {
    title: '[VERIFY title]',
    issuer: 'Udemy',
    topics: '[VERIFY course topic]',
    url: 'https://www.udemy.com/certificate/UC-6d722fbd-c2c4-4ad9-bfc8-d650409c2eed/',
  },
  {
    title: '[VERIFY title]',
    issuer: 'HackerRank',
    topics: '[VERIFY skill/topic]',
    url: 'https://www.hackerrank.com/certificates/19abdcaf9a62',
  },
];

export const AWARDS: Award[] = [
  {
    title: 'Top 7.6% Global Rank – LeetCode',
    organizer: 'LeetCode',
    year: 'Ongoing',
    detail: '800+ problems solved',
    href: 'https://leetcode.com/u/Hasebul',
  },
  {
    title: '10th Place – Intra AIUB Programming Contest (Fall 2021–22)',
    organizer: 'AIUB',
    year: '2021–22',
    detail: '',
    href: 'https://oj.synapse0.com/standings.php?contest=1013',
  },
  {
    title: '6th Place – AIUB CS Fest Programming Contest',
    organizer: 'AIUB',
    year: '2018',
    detail: '',
    href: 'https://toph.co/c/aiub-cs-fest-2018-j/standings?start=0',
  },
  {
    title: '2100+ Competitive Programming Problems Solved',
    organizer: 'Codeforces, CodeChef, SPOJ, UVa, AtCoder, LeetCode',
    year: 'Ongoing',
    detail: '',
    href: 'https://stopstalk.com/user/profile/WA_TLE',
  },
  {
    title: 'ICPC Asia Dhaka Regional Participant',
    organizer: 'ACM-ICPC / AIUB (ACPC)',
    year: '2019, 2020',
    detail: 'Participated as member of AIUB Competitive Programming Community (ACPC)',
  },
];

export const TEST_SCORES: TestScore[] = [
  {
    test: 'IELTS Academic',
    body: 'IDP IELTS',
    date: '19 Sep 2025',
    centre: 'BD050',
    candidateNo: '503399',
    listening: '8.0',
    reading: '6.5',
    writing: '7.5',
    speaking: '6.0',
    overall: '7.0',
    cefr: 'C1',
    trf: '25BD503399CHOH050A',
  },
  {
    test: 'IELTS Academic',
    body: 'British Council',
    date: '18 Sep 2025',
    centre: 'BD001',
    candidateNo: '024431',
    listening: VERIFY,
    reading: VERIFY,
    writing: VERIFY,
    speaking: VERIFY,
    overall: VERIFY,
    cefr: VERIFY,
    trf: VERIFY,
  },
  {
    test: 'GRE',
    body: 'ETS',
    date: MISSING,
    centre: '—',
    candidateNo: '—',
    listening: '—',
    reading: '—',
    writing: '—',
    speaking: '—',
    overall: MISSING,
    cefr: '—',
    trf: MISSING,
    muted: true,
  },
  {
    test: 'TOEFL',
    body: 'ETS',
    date: MISSING,
    centre: '—',
    candidateNo: '—',
    listening: '—',
    reading: '—',
    writing: '—',
    speaking: '—',
    overall: MISSING,
    cefr: '—',
    trf: MISSING,
    muted: true,
  },
];

export const REFERENCES: Reference[] = [
  {
    name: 'Prabal Kanti Deb Sikder',
    title: 'Engineering Manager',
    institution: 'Cefalo Bangladesh Ltd.',
    email: 'probal@cefalo.com',
    phone: '+8801816576058',
    linkedin: 'https://linkedin.com/in/probalsikder/',
    relationship: 'Engineering Manager & Team Coach (2 projects: Aug 2023, May 2024)',
    lorDate: '19 Feb 2026',
  },
  {
    name: 'Md. Abu Naim Murad',
    title: 'Senior Staff Software Engineer',
    institution: 'Cefalo Bangladesh Ltd.',
    email: 'naim.murad@cefalo.com',
    phone: '+8801722494834',
    linkedin: 'https://linkedin.com/in/naim-murad/',
    relationship: 'Direct Supervisor (since 01 Jun 2022)',
    lorDate: '06 Jan 2026',
  },
  {
    name: 'Abhijit Bhowmik',
    title: 'Associate Professor & Special Assistant, Office of Student Affairs',
    institution: 'American International University–Bangladesh (AIUB), Dept. of Computer Science',
    email: 'abhijit@aiub.edu',
    phone: '+880 2 8414046-9',
    linkedin: null,
    relationship:
      'Thesis Supervisor & Course Instructor (~4 years); Thesis grade A, Software Quality & Testing grade B+',
    lorDate: '27 Oct 2025',
  },
  {
    name: 'Md. Mazid-Ul-Haque',
    title: 'Assistant Professor & Special Assistant, Office of Student Affairs',
    institution:
      'American International University–Bangladesh (AIUB), Dept. of Computer Science, Faculty of Sci. & Tech.',
    email: 'mazid@aiub.edu',
    phone: '+880 2 8414046-9',
    linkedin: null,
    relationship: 'Faculty Mentor (academic consultation & career guidance sessions)',
    lorDate: '28 Oct 2025',
  },
  {
    name: 'Rifat Tasnim Anannya',
    title: 'Assistant Professor',
    institution: 'American International University–Bangladesh (AIUB), Dept. of Computer Science',
    email: 'rifat.tasnim@aiub.edu',
    phone: '+88 02 8414046-50',
    linkedin: null,
    relationship: 'Course Instructor – Introduction to Programming (Spring 2017-18); grade A+',
    lorDate: '28 Oct 2025',
  },
];

export const STATEMENT_PLACEHOLDERS = [
  'Statement of Purpose (SOP)',
  'Personal Statement',
  'Motivation Letter',
  'Research Proposal (PhD)',
  'Writing Sample / Portfolio',
];
