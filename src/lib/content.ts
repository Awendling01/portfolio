export type ProjectBadge = "SaaS" | "Contract" | "Full-Time" | "FinTech";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  badge: ProjectBadge;
  badgeColor: "accent" | "accent2" | "green" | "amber" | "rose";
  dates: string;
  role: string;
  company?: string;
  description: string;
  highlights: string[];
  metrics?: { value: string; label: string }[];
  tech: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "moniscope",
    title: "MONISCOPE",
    subtitle: "Multi-Tenant Self-Storage SaaS — Founder + Sole Engineer",
    badge: "SaaS",
    badgeColor: "accent",
    dates: "October 2025 – Present",
    role: "Founder / Sole Engineer",
    description:
      "Multi-tenant vertical SaaS for self-storage. Built for my family's operation; designed for operators beyond. Founder + sole engineer; pre-launch.",
    highlights: [
      "Multi-tenant Laravel + Vue + Inertia.js SaaS with 1,852+ automated tests as the validation gate",
      "9-stage delinquency state machine implementing Alabama lien law with cure-period enforcement",
      "Two-way SMS via Twilio over Reverb WebSockets — outbound, inbound webhook, opt-out/UNSTOP compliance",
      "Stripe billing + Plaid bank verification with full audit-trail logging",
      "Yield-pricing engine, 6-report engine, CRM Kanban — all on a single rules + dispatcher pattern",
      "Anthropic Brain (deterministic-first); Claude Code as dev partner (multi-session sweeps, JSON logs)",
    ],
    metrics: [
      { value: "1,852+", label: "Automated Tests" },
      { value: "9", label: "Delinquency Stages" },
      { value: "6", label: "Report Types" },
      { value: "15+", label: "Admin Sections" },
    ],
    tech: [
      "Laravel 12",
      "Vue 3",
      "Inertia.js",
      "MySQL",
      "Pest/PHPUnit",
      "Reverb WebSockets",
      "Stripe",
      "Plaid",
      "Twilio",
      "Anthropic API",
    ],
    featured: true,
  },
  {
    slug: "offroad-kiosk",
    title: "Off-Roading Shopify",
    subtitle: "Shopify + Klaviyo + Recharge — Plus AI Trade-Show Kiosk",
    badge: "Contract",
    badgeColor: "accent2",
    dates: "March 2026 – April 2026",
    role: "Sole Technical Consultant",
    description:
      "Multi-system Shopify engagement: audit + harden the operation. Mid-engagement, built an AI trade-show kiosk after watching booth pain.",
    highlights: [
      "JS dwell-time tracking in theme.liquid → Klaviyo profile properties for browse-personalization",
      "3 Klaviyo flows (Welcome, Browse Abandonment, Abandoned Cart) with 6-path Django upsell logic",
      "Shopify Flow customer-tagging architecture + product-tag fix (caught Product_W mis-tagged as Product_X)",
      "JSON-LD schema (AggregateRating, BreadcrumbList, FAQPage) + robots.txt.liquid + Meta catalog (344 files)",
      "Recharge 5-email failed-payment recovery + shadow-DOM CSS injection for widget button labels",
      "AI trade-show kiosk: four-model image pipeline, 7-level fallback chain, two-device QR session sync",
    ],
    metrics: [
      { value: "344", label: "Theme Files" },
      { value: "16+", label: "Custom Emails" },
      { value: "61", label: "Audit Sections" },
      { value: "~45s", label: "Kiosk End-to-End" },
    ],
    tech: [
      "Shopify Admin GraphQL",
      "Liquid",
      "Shopify Flow",
      "Klaviyo",
      "Recharge",
      "Next.js 16",
      "TypeScript 5",
      "OpenAI gpt-image-1.5",
      "Claid.ai",
      "Neon Postgres",
    ],
    featured: true,
  },
  {
    slug: "local-service-seo",
    title: "Local Service Business — SEO & Listings",
    subtitle: "Concurrent Consulting Engagement",
    badge: "Contract",
    badgeColor: "green",
    dates: "March 2026 – April 2026",
    role: "Sole Technical Consultant",
    description:
      "Concurrent engagement with a local service business. Owned Google Business Profile, listings cleanup, and local SEO. Scope expanded mid-engagement.",
    highlights: [
      "GA4 + custom conversion-event tracking site-wide; title tags + meta descriptions across 8 pages",
      "Google Business Profile: 750-char description + 7 unit-size product descriptions + 6-city service area",
      "JSON-LD schema audit (AggregateRating, BreadcrumbList, FAQPage) + platform-limitation workarounds",
      "NAP cleanup across 6+ aggregator directories (SelfStorage.com, Yelp, Apple Maps, RentCafe, BBB, Nextdoor)",
      "Custom JS quarterly owner-report generator (docx npm, 15-page PDF) with revenue, RevPAU, market comps",
      "Diagnosed call-volume decline as March 2026 Google Core Update AI Local Pack restructure (call-button omission)",
    ],
    metrics: [
      { value: "+350%", label: "Calls" },
      { value: "+58%", label: "Direction Requests" },
      { value: "+40%", label: "Web Visits" },
      { value: "2", label: "Concurrent Clients" },
    ],
    tech: [
      "Google Business Profile",
      "Local SEO",
      "GA4 + Conversion Tracking",
      "JSON-LD",
      "Listings Management",
      "Node.js (docx)",
    ],
    featured: true,
  },
  {
    slug: "futureshirts-erp",
    title: "FutureShirts Internal ERP / IMS",
    subtitle: "Entertainment Merchandise Operations Platform",
    badge: "Full-Time",
    badgeColor: "amber",
    dates: "September 2022 – September 2025",
    role: "Full Stack Developer",
    company: "FutureShirts, Nashville, TN",
    description:
      "Contributed extensively to an internal ERP / IMS for a full-service entertainment merchandise company. Reported to the SVP of IT.",
    highlights: [
      "Carrier API integration (USPS, FedEx, DHL) via EZPost with webhook event handling + Google Maps Geocoding for address validation",
      "Shopify GraphQL integrations across 55+ artist storefronts (live product / order data)",
      "Codebase-wide Vue 2 → 3 Composition API migration",
      "Reporting dashboards for finance + operations teams",
      "Supporting role on inVia Robotics warehouse automation (daily monitoring)",
      "Domain-Driven Design Laravel (action classes / events / repository pattern); sprint-planning input + Cypress mentoring of a junior dev",
    ],
    metrics: [
      { value: "200K+", label: "Annual Shipments" },
      { value: "55+", label: "Storefronts" },
      { value: "1.4M+", label: "Monthly Fans" },
      { value: "500%", label: "Productivity Gain" },
    ],
    tech: [
      "Laravel",
      "PHP",
      "Vue.js",
      "Inertia.js",
      "React",
      "Next.js",
      "GraphQL",
      "Shopify",
      "Google Maps API",
      "MySQL",
      "Cypress",
      "Pest/PHPUnit",
      "CI/CD",
    ],
    featured: true,
  },
  {
    slug: "trabian-mvb-fintech",
    title: "Trabian / MVB Bank — FinTech",
    subtitle: "Cross-Platform Banking Applications",
    badge: "FinTech",
    badgeColor: "rose",
    dates: "March 2021 – May 2022",
    role: "Software Developer",
    company: "Trabian / MVB Bank (Remote)",
    description:
      "Built cross-platform fintech and digital banking applications (React, React Native, GraphQL) for a regulated, compliance-driven banking consultancy.",
    highlights: [
      "Cross-platform banking interfaces shipped to iOS, Android, and Web from one codebase",
      "Regulated, compliance-driven environment with staged release cycles and quality gates",
      "GraphQL API integration layer across React Native + React Web clients",
      "Production banking applications for MVB Bank's consumer + business banking clients",
      "All-remote team using async-first communication and structured PR review",
      "Recruited mid-program at Columbia State — first full-time engineering role",
    ],
    metrics: [
      { value: "3", label: "Platforms" },
      { value: "1+ yr", label: "Tenure" },
      { value: "100%", label: "Remote" },
      { value: "FinTech", label: "Domain" },
    ],
    tech: [
      "React",
      "React Native",
      "JavaScript",
      "GraphQL",
      "WordPress",
      "Git",
      "Agile/Scrum",
    ],
  },
];

export type SalesRole = {
  company: string;
  title: string;
  dates: string;
  location: string;
  headlineStat: string;
  headlineStatLabel: string;
  details: string;
  accent: "accent" | "accent2" | "green" | "amber";
};

export const salesRoles: SalesRole[] = [
  {
    company: "T-Mobile",
    title: "Sales Management / Team Lead",
    dates: "October 2017 – June 2018",
    location: "Nashville, TN",
    headlineStat: "Top 5%",
    headlineStatLabel: "District Ranking",
    details:
      "Led a team of 8 in a high-traffic retail environment. Achieved top-5% district ranking and top-10% national ranking within the first 90 days. Implemented a remote scheduling system to improve staffing efficiency and coverage.",
    accent: "accent",
  },
  {
    company: "AT&T",
    title: "Sales Associate / Management Training Lead",
    dates: "February 2014 – November 2016",
    location: "Nashville, TN",
    headlineStat: "Top 3%",
    headlineStatLabel: "National Ranking",
    details:
      "Supported the store manager and coached across a 32-person sales floor. Consistently top-10% in headquarters market and top-3% nationally across all categories. Coached new hires from 48% to 98% in gross sales over 90 days. Delivered executive-facing performance reports to district leadership.",
    accent: "accent2",
  },
  {
    company: "uBreakiFix",
    title: "Sales Manager",
    dates: "January 2020 – March 2021",
    location: "Nashville, TN",
    headlineStat: "2 Stores",
    headlineStatLabel: "Managed",
    details:
      "Managed two retail stores and daily operations across front-of-house sales, customer experience, and device repair services. Owned customer satisfaction and retention metrics across both locations. Top 18% nationally during tenure; stepped into multi-store responsibility within 6 months of hire.",
    accent: "green",
  },
  {
    company: "JumpCrew",
    title: "CRM Administrator",
    dates: "June 2022 – September 2022",
    location: "Nashville, TN",
    headlineStat: "150+",
    headlineStatLabel: "Daily Users",
    details:
      "Administered the Salesforce / Outreach.io CRM for a B2B marketing platform with 150+ daily users. Owned workflows, reporting dashboards, and data migrations; partnered with sales leadership on pipeline visibility. The bridge role between sales and engineering.",
    accent: "amber",
  },
];

export const education = [
  {
    title: "Software Development",
    institution: "Columbia State Community College",
    dates: "2019 – 2021",
    note: "GPA: 3.97, Dean's List",
  },
  {
    title: "API Documentation Path",
    institution: "Postman",
    dates: "May 2026",
    note: "Credential ID: hz86ci8ajava",
  },
  {
    title: "API Prototyping Learning Path",
    institution: "Postman",
    dates: "May 2026",
    note: "Credential ID: ef5swv82ndzw",
  },
  {
    title: "Cloud Deployment Fundamentals",
    institution: "Nashville Software School",
    dates: "March 2026",
  },
  {
    title: "Agentic AI for Web Developers",
    institution: "Nashville Software School",
    dates: "January – February 2026",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  context: string;
  accent: "accent" | "accent2" | "green" | "amber";
};

// Sourced from LinkedIn recommendations at
// https://linkedin.com/in/awendling01/details/recommendations/
// Quotes are condensed for the homepage card; the full text lives on LinkedIn.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Andrew is honest, principled, and direct conversations toward solutions. His dedication to learning and adopting new frameworks is impressive, and he continually pushes himself to deliver high-quality code. Beyond his technical expertise, he communicates with clarity and professionalism — his collaborative and dependable work ethic elevates those around him.",
    name: "Ben Trerise",
    title: "Systems Manager, FutureShirts",
    context: "Worked together for 2+ years",
    accent: "accent",
  },
  {
    quote:
      "I worked with Andrew at AT&T and T-Mobile and have seen him grow professionally over the years. I can vouch for his skills as a sales professional, his growing technical knowledge, and his ability to quickly adapt to new challenges. I've always been impressed by his self-starter nature and drive toward learning.",
    name: "Charles Parry",
    title: "Cybersecurity Partnerships, Dispel",
    context: "AT&T and T-Mobile teammate",
    accent: "green",
  },
  {
    quote:
      "Andrew rose to the challenge and smashed it. As a new developer, he had a high learning curve to overcome — not only did he rise to it, he quickly became a key contributor. He was great at communicating risks and blockers and met every timeline. Any project manager would be lucky to have Andrew on their team.",
    name: "Shannon Lynn",
    title: "Founder, Equity Bookkeeping & Consulting",
    context: "Project lead, ~1 year working together",
    accent: "accent2",
  },
];

export const linkedinRecommendationsUrl =
  "https://linkedin.com/in/awendling01/details/recommendations/";

export const contact = {
  name: "Andrew Wendling",
  location: "Spanish Fort, AL",
  email: "gohikeco1@gmail.com",
  linkedin: "https://linkedin.com/in/awendling01",
  linkedinHandle: "linkedin.com/in/awendling01",
  github: "https://github.com/Awendling01",
  githubHandle: "github.com/Awendling01",
};

export type UsesGroup = {
  category: string;
  blurb: string;
  items: { name: string; note?: string }[];
};

export const uses: UsesGroup[] = [
  {
    category: "Editor",
    blurb: "Where I spend most of the day.",
    items: [
      { name: "VS Code", note: "primary editor" },
      { name: "Jupyter", note: "Python notebooks" },
      { name: "GitHub", note: "primary repo host + Actions" },
      { name: "Bitbucket", note: "client repos (Atlassian shop)" },
      { name: "Claude Code (CLI)", note: "AI pair programmer + agent harness" },
      { name: "Copilot (CLI)", note: "GitHub AI in shell" },
      { name: "ChatGPT (CLI)", note: "OpenAI assistant in shell" },
    ],
  },
  {
    category: "Languages & Frameworks",
    blurb: "What I'm shipping production code in today.",
    items: [
      { name: "Laravel 12 + PHP 8.3" },
      { name: "Vue 3 (Composition API) + Inertia.js" },
      { name: "Next.js 16 + React 19 + TypeScript" },
      { name: "Tailwind CSS v4" },
      { name: "Pest / PHPUnit / Cypress" },
    ],
  },
  {
    category: "Platforms & APIs",
    blurb: "Integrations I've shipped to production.",
    items: [
      { name: "Stripe", note: "Billing, Connect" },
      { name: "Plaid", note: "Auth, Link" },
      { name: "Twilio", note: "two-way SMS, webhooks" },
      { name: "Shopify", note: "Admin GraphQL, Headless checkout" },
      { name: "Klaviyo", note: "automation flows" },
      { name: "OpenAI + Anthropic", note: "image gen, agentic features" },
      { name: "Replicate + Claid.ai", note: "background removal, upscaling" },
    ],
  },
  {
    category: "Data & Infra",
    blurb: "Where the data lives.",
    items: [
      { name: "MySQL", note: "primary OLTP for Laravel apps" },
      { name: "PostgreSQL (Neon)", note: "serverless Postgres on Vercel" },
      { name: "Drizzle ORM", note: "type-safe Postgres for Next.js" },
      { name: "Redis", note: "queues, caching" },
      { name: "Laravel Horizon", note: "queue monitoring" },
      { name: "Reverb", note: "WebSocket broadcasting" },
    ],
  },
  {
    category: "Workflow",
    blurb: "Tools I default to without thinking.",
    items: [
      { name: "Git + GitHub", note: "trunk-based, PR-driven" },
      { name: "Bitbucket Pipelines + GitHub Actions", note: "CI/CD" },
      { name: "Vercel", note: "Next.js deploys, blob storage" },
      { name: "Sentry", note: "error monitoring" },
      { name: "Postman", note: "API exploration" },
      { name: "Figma", note: "design hand-offs" },
      { name: "Jira / Linear", note: "wherever the team lives" },
    ],
  },
];

export const heroStats = [
  { value: "5+", label: "Years Engineering", color: "accent" as const },
  { value: "6+", label: "Years Sales", color: "accent2" as const },
  { value: "1,852+", label: "Automated Tests", color: "green" as const },
  { value: "Top 3%", label: "National Sales Rank", color: "amber" as const },
];

export const engineeringHighlights = [
  "Multi-tenant SaaS architecture (MONISCOPE — founder + sole engineer)",
  "Production integrations against Shopify, Stripe, Twilio, Klaviyo, Recharge, Plaid, EZPost, Google Business Profile",
  "Real-time WebSocket broadcasting (Reverb)",
  "AI image pipeline: gpt-image-1.5 + Claid 4× upscale + Sharp center-crop @ 300 DPI",
  "AI agents via Anthropic API; Claude Code as structured dev partner",
  "1,852+ automated tests across Pest/PHPUnit and Cypress",
  "Carrier API integrations: USPS, FedEx, DHL",
  "Reporting engines, KPI tracking, PDF/CSV exports",
];

export const salesHighlights = [
  "Top 5% district ranking at T-Mobile (team of 8)",
  "Top 3% nationally at AT&T across all categories",
  "Coached new hires from 48% to 98% in 90 days",
  "Delivered executive-facing performance reports",
  "Managed 2 retail stores at uBreakiFix",
  "Salesforce / Outreach.io CRM administration (JumpCrew)",
  "Pipeline reporting and dashboard design",
  "Customer satisfaction and retention ownership",
];
