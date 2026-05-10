# andrewwendling.info

[![CI](https://github.com/Awendling01/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Awendling01/portfolio/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Awendling01/portfolio/actions/workflows/codeql.yml/badge.svg)](https://github.com/Awendling01/portfolio/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Personal portfolio for Andrew Wendling, deployed at
[andrewwendling.info](https://andrewwendling.info).

> 5+ years shipping production SaaS — Laravel, Next.js, multi-tenant
> architecture, AI integrations against Shopify, Stripe, Twilio, Klaviyo,
> Recharge, and Plaid. Top-3% national sales background underneath.
> Open to Solutions Engineer, Implementation Engineer, and Developer
> Relations roles at platforms I've already integrated.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Node runtime)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (CSS-first config)
- **Fonts**: Outfit + Fira Code via `next/font/google`
- **Database**: Neon Postgres + Drizzle ORM
- **Email**: Resend (with React Email templates)
- **Validation**: Zod 4
- **IP enrichment**: IPinfo Lite (free tier)
- **Hosting**: Vercel (Analytics + Speed Insights)

## Features

### Public site

- Hero, about, project work, contact form, `/uses` page
- Server-rendered OpenGraph image
- Sitemap + robots
- Live view counter and per-page read-time tracking
- Anonymous session cookie for grouping page views (90 days, httpOnly)

### Admin (`/admin`, behind login)

- **Overview** — sessions, corporate-network sessions, top organizations,
  failed logins
- **Analytics** — daily visitors chart, top pages with avg read time,
  top referrers / countries / browsers / OS, new vs returning, plus
  a deep link out to Google Search Console for query / impression data
- **Visitors** — sessions grouped by browser, with full page chains and
  drill-down to a per-page timeline
- **Messages** — contact-form submissions
- **Security** — login attempt log, top failing IPs, rate-limit status

### Security posture

- DB-backed admin sessions with rotation on login + revocation on logout
  (cookie holds a 256-bit random token; only its SHA-256 hash is persisted,
  so a leaked DB row can't be used to forge a valid cookie)
- Wiping `admin_sessions` immediately revokes every active session
- Timing-safe password comparison (both sides hashed to fixed length first)
- Cookie auth gated by `proxy.ts` for everything under `/admin/*`
- Nonce-based CSP — per-request nonce on `script-src`; `'unsafe-inline'`
  fully removed from script-src
- Rate limits: login (5 fails / 15 min / IP), contact form (5 / hour / IP),
  view tracking (60 / min / IP), dwell beacons (30 / min / session)
- IPs are HMAC-hashed before storage; no raw IPs are ever persisted
- HSTS preload, COOP, CORP (route-scoped to keep OG share cards working),
  X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy strict-origin
- CSRF defense on `/api/logout` (Sec-Fetch-Site + Origin checks)
- Session-scoped authz on `/api/views/dwell`

## Project structure

```
src/
  app/
    (site)/            Public route group (Nav + Footer layout)
      page.tsx         Home
      about/, work/, contact/, uses/, login/
    admin/             Admin route group (separate layout, no public chrome)
      page.tsx         Overview
      analytics/, visitors/, messages/, security/
    api/
      views/           POST: log a visit, GET: counter
      views/dwell/     POST: update read time (session-scoped)
      logout/          POST: clear session
    layout.tsx         Root layout (no Nav/Footer)
    sitemap.ts, robots.ts, opengraph-image.tsx
  components/
    layout/, ui/, projects/, sales/, sections/
    admin/             Charts + admin-only widgets
    contact/, auth/    Form components
    integrations/      ViewCounter, etc.
  lib/
    content.ts         Single source of truth for all copy
    db/                Drizzle schema + client
    auth.ts            Session cookie HMAC
    visitor.ts         Visitor cookie + IP hashing
    ipinfo.ts          IPinfo Lite client + cloud-ASN bot detection
    rate-limit.ts      DB-backed rate limits
    analytics-queries.ts
  emails/              React Email templates
  proxy.ts             /admin/* auth gate (Next.js proxy/middleware)
drizzle/
  0000_init.sql ... 0003_*.sql   SQL migrations (run in order)
```

## Local development

### Prerequisites

- Node.js 20+ (`.nvmrc` pins to `20`)
- pnpm 9+
- A Neon Postgres database (free tier is fine; not required for dev —
  most pages degrade gracefully without one)

### Setup

```bash
git clone https://github.com/Awendling01/portfolio.git
cd portfolio
pnpm install
cp .env.example .env.local
# fill in whichever vars you want; everything is optional in dev
pnpm dev
```

Open http://localhost:3000.

### Database setup

When `DATABASE_URL` (or `POSTGRES_URL`) is set, run the migrations in
`drizzle/` against your Neon database, in numeric order. The Neon SQL
editor does not accept multi-statement scripts — paste each statement
individually:

```
drizzle/0000_init.sql                  # views, messages
drizzle/0001_visits.sql                # visit logging
drizzle/0002_visitor_tracking.sql      # session/IP/org enrichment + login_attempts
drizzle/0003_messages_ip_hash.sql      # rate-limit support for contact form
drizzle/0004_admin_sessions.sql        # server-side admin sessions (rotate + revoke)
```

## Environment variables

All optional in dev — each integration degrades gracefully when its vars
are missing. See [`.env.example`](.env.example) for the canonical list.

| Var | Purpose | Required for |
|---|---|---|
| `DATABASE_URL` / `POSTGRES_URL` | Neon Postgres connection | Anything that reads/writes the DB |
| `ADMIN_PASSWORD` | Single-factor admin login | `/admin/*`, login |
| `VISIT_HASH_SECRET` | HMAC key for hashing IPs (recommended over fallback) | Visitor IP grouping |
| `RESEND_API_KEY` | Outbound email | Contact form delivery |
| `RESEND_FROM_EMAIL` | Verified sender | Contact form (optional override) |
| `IPINFO_TOKEN` | IPinfo Lite token for org/ASN lookup | "Top organizations" admin signal |
| `GITHUB_TOKEN` | Fine-grained PAT, public_repo scope | Pinned-repos integration (planned) |
| `SPOTIFY_CLIENT_ID` / `_SECRET` / `_REFRESH_TOKEN` | Now-playing widget (planned) | `/uses` widget |

## Deploy

The site deploys to Vercel from `main`. CI runs `tsc --noEmit`, `eslint`,
and `next build` on every push and PR (see
[`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

After connecting the repo to Vercel:

1. Add environment variables in the Vercel project (Settings → Env Vars)
2. Connect the Neon integration (or set `DATABASE_URL` directly)
3. Run all `drizzle/*.sql` migrations in Neon
4. First deploy is automatic from `main`

## Scripts

```bash
pnpm dev          # Start the dev server
pnpm build        # Production build (used by Vercel + CI)
pnpm start        # Run the production build locally
pnpm lint         # ESLint
pnpm db:generate  # Generate a Drizzle migration from schema changes
pnpm db:push      # Push the schema directly (dev only)
pnpm db:migrate   # Apply migrations (production)
```

## Editorial style

All copy lives in `src/lib/content.ts` — page components import from it.
Editorial rules and accuracy guardrails are documented in
[`CLAUDE.md`](CLAUDE.md).

## License

Code is [MIT](LICENSE) — copy or adapt anything you find useful. The written
copy and design are mine; don't lift those verbatim.

## Security

See [SECURITY.md](SECURITY.md) for how to report vulnerabilities.
