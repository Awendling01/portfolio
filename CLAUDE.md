@AGENTS.md

# Content style guide

Editorial rules for portfolio copy. AI assistants working in this repo read
this file too.

## Positioning

Engineering leads, sales supports — never the other way around. The pitch is
"5+ year production engineer who has built integrations against Shopify,
Stripe, Twilio, Klaviyo, and Recharge — and who also has a top-3–10% national
sales background." Target roles are Solutions Engineer, Implementation
Engineer, and Developer Relations at platforms I've already integrated.
Sales/Customer Success are secondary fits.

Never frame me as "sales guy who learned to code" or "trying to break into
tech." I have 5+ years in production engineering — frame the trajectory
accordingly.

## Voice

Terse and direct. Active voice, first person. Specifics over abstractions.
Short paragraphs.

Never use: "leveraging," "streamlining," "cutting-edge," "robust," "seamless,"
"comprehensive," "utilizing," "facilitating," "innovative," "passionate,"
"lifelong learner." Cut filler ("basically," "essentially," "simply," "just,"
"really," "very," "in order to"). No hedging ("might," "could potentially").
No begging — show the work.

## Source of truth

All copy lives in `src/lib/content.ts`. Edit there. Page components import
from it; never duplicate strings into JSX.

## Accuracy rules

These reflect my actual scope of work. Respect them on every edit.

| Project / role | Accurate framing |
|---|---|
| FutureShirts (Sept 2022 – Sept 2025) | "Contributed extensively" to internal ERP / IMS. Not "led end-to-end development." |
| inVia Robotics integration | Supporting role (daily monitoring). Not technical lead. |
| AT&T (Feb 2014 – Nov 2016) | Sales Associate / Management Training Lead. Leadership work (training/coaching new sales people) under an IC job title. |
| T-Mobile (Oct 2017 – Jun 2018) | Team Lead, team of 8. 8 months total. |
| uBreakiFix (Jan 2020 – Mar 2021) | Managed 2 retail stores. Multi-store / district-level scope was at T-Mobile, not uBreakiFix. |
| MONISCOPE | Pre-launch. Founder + sole engineer of the SaaS, designed around Spanish Fort Self Storage (my FAMILY's operation, NOT mine). Never write "the operation I own" — write "my family's operation" or "the family-run storage facility." Frame MONISCOPE as founder-level execution of the SaaS itself. Features are "designed to support" — never "enabling live customers." |
| Inertia.js | Frame as "modern monolith," not "server-driven rendering." |
| FutureShirts Shopify work | Primarily GraphQL queries against the Admin API. |
| Off-Roading E-Commerce Engagement | March 2026 – April 2026 (closed). Anonymous off-roading e-commerce client (name withheld under standard confidentiality — engagement was real, references aren't offered). Multi-system Shopify engagement: audit, Klaviyo lifecycle flows, Recharge subscriptions, Shopify Flow tagging, JSON-LD deployment — plus a two-device AI trade-show kiosk that was *proactively proposed and built mid-engagement* after observing customer pain at a booth (frame the kiosk as my proactive product insight, not part of the original brief). Internal slug: `offroad-kiosk` (kept as array key in content.ts); **route**: `/work/shopify` (renamed from `/work/kiosk` to match Shopify-led framing). Case studies live at `/work/shopify/{ai-pipeline, prompt-engineering, personalization}`. **Never name the client or their products publicly** — no brand names, no domain, no product-line vocab. Refer to the engagement only as "an off-roading e-commerce client" and to products only as generic placeholders (Product_X / Product_Y / Product_Z, etc.). **Skip all financial data** (revenue, ad spend, conversion-rate dollar values, app spend, payment-error rates, subscriber counts, commission structure) — operational depth and engineering specifics only. |
| Education | Columbia State Community College 2019–2021, 3.97 GPA, Dean's List. Did NOT graduate. Never imply a degree. |
| Test count | 1,852+ across Pest/PHPUnit and Cypress. Keep consistent across the site. |

## Tooling not to claim

I haven't used Docker, AWS, or Kubernetes in production. Don't list them in
skills, project tech stacks, or `/uses`.
