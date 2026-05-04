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
    subtitle: "Multi-Tenant Self-Storage SaaS Platform",
    badge: "SaaS",
    badgeColor: "accent",
    dates: "October 2025 – Present",
    role: "Owner / Solo Developer",
    description:
      "Multi-tenant vertical SaaS platform for the self-storage industry. Built from the ground up as both developer and product owner, owning all product decisions, requirements definition, and system architecture. Designed to support yield pricing, delinquency workflows, two-way SMS, and AI-assisted operations. Currently pre-launch.",
    highlights: [
      "Stripe billing + Plaid bank verification",
      "Two-way SMS via Twilio with WebSocket broadcast (Reverb)",
      "Yield/dynamic pricing engine with rule builder",
      "Delinquency state machine — 9 stages, Alabama lien law",
      "CRM lead pipeline with Kanban board",
      "AI-assisted features via Anthropic API",
      "Role-based access control across tenant roles",
      "65+ admin navigation keys, 15+ sections",
    ],
    metrics: [
      { value: "1,850+", label: "Automated Tests" },
      { value: "9", label: "Delinquency Stages" },
      { value: "15+", label: "Admin Sections" },
      { value: "6", label: "Report Types" },
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
    slug: "aerolidz-kiosk",
    title: "AeroLidz Trade Show Kiosk",
    subtitle: "AI-Powered Product Customization & Headless Checkout",
    badge: "Contract",
    badgeColor: "accent2",
    dates: "March 2026",
    role: "Full-Stack Developer",
    description:
      "Full-stack trade show kiosk application. Customers customize products with AI-generated imagery, preview composites in real-time, and check out through a headless Shopify integration. Two tablets sync via QR codes and Postgres session polling for a seamless customer-and-attendant flow.",
    highlights: [
      "AI image generation via OpenAI gpt-image-1.5",
      "Background removal (Replicate) + neural upscaling (Claid.ai)",
      "Print-ready compositing: 15,420×1,320px at 300 DPI",
      "Headless Shopify checkout integration",
      "Real-time two-device sync via QR codes",
      "Deployed on Vercel with Neon Postgres",
    ],
    tech: [
      "Next.js 15",
      "TypeScript",
      "React",
      "OpenAI API",
      "Replicate",
      "Claid.ai",
      "Sharp",
      "Shopify (Headless)",
      "Neon Postgres",
      "Vercel",
    ],
    featured: true,
  },
  {
    slug: "ecommerce-seo-consulting",
    title: "E-Commerce & SEO Consulting",
    subtitle: "Sole Technical Consultant — Multi-Client Engagements",
    badge: "Contract",
    badgeColor: "green",
    dates: "March 2026 – April 2026",
    role: "Sole Technical Consultant",
    description:
      "Served as the sole technical consultant for concurrent client engagements across e-commerce and local service industries. Scoped requirements, executed audits, built automation flows, and proactively identified expansion opportunities beyond original engagement scope.",
    highlights: [
      "61-section Shopify admin audit",
      "3 Klaviyo email automation flows (Welcome, Browse Abandonment, Cart)",
      "SEO structured data (JSON-LD) across 344 theme files",
      "Recharge subscription recovery configuration",
      "Meta catalog sync failure diagnosis",
      "Google Business Profile optimization (service client)",
      "Local SEO strategy and listings cleanup",
      "Proactively identified upsell scope beyond original engagement",
    ],
    metrics: [
      { value: "+350%", label: "Calls" },
      { value: "+58%", label: "Direction Requests" },
      { value: "+40%", label: "Web Visits" },
      { value: "344", label: "Files Updated" },
    ],
    tech: [
      "Shopify",
      "Klaviyo",
      "Recharge",
      "Liquid",
      "JSON-LD",
      "CSS/HTML",
      "Google Business Profile",
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
      "Contributed extensively to an internal ERP and Inventory Management platform for a full-service entertainment merchandise company processing 200,000+ packages annually across 55+ artist storefronts serving 1.4M+ fans monthly. Reported to the SVP of IT.",
    highlights: [
      "Shipment tracking: USPS, FedEx, DHL carrier API integration with webhook events",
      "Shopify GraphQL integrations across 55+ storefronts (live product/order data)",
      "atVenu live-event POS data sync for tour merchandise",
      "Reporting dashboards for finance and operations teams",
      "Supported inVia Robotics warehouse automation (daily monitoring)",
      "Mentored junior developers, code reviews, CI/CD contributions",
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
      "Developed fintech and digital banking applications using React, React Native, and GraphQL for a software consultancy specializing in financial technology. Built cross-platform mobile and web interfaces for banking clients in a regulated, compliance-driven environment.",
    highlights: [
      "Cross-platform banking interfaces (iOS, Android, Web)",
      "Regulated environment — compliance-driven development",
      "GraphQL API integration layer",
      "Staged release cycles with quality gates",
      "All-remote team using async communication workflows",
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
    dates: "November 2016 – June 2018",
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
    dates: "February 2013 – November 2016",
    location: "Nashville, TN",
    headlineStat: "Top 3%",
    headlineStatLabel: "National Ranking",
    details:
      "Supported the store manager and coached team members across a 32-person sales floor. Consistently ranked top-10% in headquarters market and top-3% nationally across all sales categories. Coached new hires from 48% to 98% in gross sales over a 90-day period. Delivered executive-facing performance reports and forecasts to district and regional leadership.",
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
      "Managed two retail stores and daily operations including front-of-house sales, customer experience, and device repair services. Owned customer satisfaction and retention metrics across both locations.",
    accent: "green",
  },
];

export const jumpcrewNote = {
  company: "JumpCrew",
  role: "CRM Administrator",
  dates: "June 2022 – September 2022",
  description:
    "Managed the CRM for a B2B marketing platform. Administered workflows, reporting dashboards, and data migrations. Partnered with sales leadership to optimize pipeline visibility and reporting accuracy.",
  tech: ["Salesforce", "Outreach.io"],
};

export const education = [
  {
    title: "Software Development",
    institution: "Columbia State Community College",
    dates: "2019 – 2021",
    note: "GPA: 3.97, Dean's List",
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

export const skills = {
  "Languages & Frameworks": [
    "PHP",
    "TypeScript",
    "JavaScript",
    "Laravel 12",
    "Vue 3",
    "React 18",
    "React Native",
    "Next.js 15/16",
    "Inertia.js",
    "GraphQL",
    "REST APIs",
    "HTML5",
    "CSS",
    "Tailwind CSS",
    "Liquid",
  ],
  "Platforms & Integrations": [
    "Shopify (Admin, GraphQL, Headless)",
    "Klaviyo",
    "Recharge",
    "Stripe (Billing, Connect)",
    "Plaid (Auth, Link)",
    "Twilio (SMS, Webhooks)",
    "OpenAI API",
    "Anthropic API",
    "Replicate",
    "Claid.ai",
  ],
  "CRM & Sales Tools": [
    "Salesforce",
    "Outreach.io",
    "CRM Administration",
    "Pipeline Reporting",
    "Dashboard Design",
  ],
  "Data & Analytics": [
    "MySQL",
    "PostgreSQL (Neon)",
    "Redis",
    "Reporting Engine Development",
    "PDF/CSV Export",
    "KPI Tracking",
    "Structured Data (JSON-LD)",
    "Eloquent ORM",
    "Drizzle ORM",
  ],
  "Testing & DevOps": [
    "Pest/PHPUnit",
    "Cypress (E2E)",
    "Integration & Regression Testing",
    "GitHub Actions",
    "Bitbucket Pipelines",
    "Vercel (serverless/blob)",
    "Staged Environments",
  ],
  Tools: [
    "Git",
    "GitHub",
    "Bitbucket",
    "Jira",
    "Sentry",
    "Laravel Horizon",
    "Postman",
    "Figma",
    "Composer",
    "npm/yarn/pnpm",
  ],
  Methodologies: [
    "Agile/Scrum",
    "SDLC",
    "CI/CD",
    "Release & Change Management",
    "Domain-Driven Design",
    "Multi-Tenancy",
  ],
};

export const contact = {
  name: "Andrew Wendling",
  location: "Spanish Fort, AL",
  email: "Gohikeco1@gmail.com",
  phone: "***REMOVED***",
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
    category: "Editor & Terminal",
    blurb: "Where I spend most of the day.",
    items: [
      { name: "VS Code", note: "primary editor; Vim keybindings" },
      { name: "Claude Code (CLI)", note: "AI pair programmer + agent harness" },
      { name: "iTerm2 + zsh", note: "with starship prompt" },
      { name: "Tmux", note: "session-per-project" },
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
  {
    category: "Hardware",
    blurb: "Daily driver.",
    items: [
      { name: "MacBook Pro (Apple Silicon)" },
      { name: "External 4K display" },
      { name: "Mechanical keyboard" },
    ],
  },
];

export const heroStats = [
  { value: "5+", label: "Years Engineering", color: "accent" as const },
  { value: "6+", label: "Years Sales", color: "accent2" as const },
  { value: "1,850+", label: "Automated Tests", color: "green" as const },
  { value: "Top 3%", label: "National Sales Rank", color: "amber" as const },
];

export const engineeringHighlights = [
  "Multi-tenant SaaS architecture (MONISCOPE)",
  "Stripe Billing, Plaid bank verification, Twilio two-way SMS",
  "Real-time WebSocket broadcasting (Reverb)",
  "AI-powered features via OpenAI and Anthropic APIs",
  "Headless Shopify integrations (GraphQL, checkout)",
  "1,850+ automated tests across Pest/PHPUnit and Cypress",
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
