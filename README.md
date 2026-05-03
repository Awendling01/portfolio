# andrewwendling.dev

Personal portfolio site. Next.js 16 (App Router, Turbopack) + Tailwind v4 + TypeScript, deployed to Vercel.

## Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS v4 (CSS-first config)
- **Fonts**: Outfit + Fira Code (next/font/google)
- **Deployment**: Vercel
- **Domain**: andrewwendling.dev

Phase 2 (planned): Neon Postgres + Drizzle for view counter and contact-form storage, Resend for transactional email, GitHub GraphQL for pinned repos, Spotify now-playing widget, MDX blog.

## Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Structure

```
src/
  app/            App Router pages (/, /work, /about, /contact)
  components/
    layout/       Nav, Footer
    ui/           Button, Card, Badge, Container, etc.
    projects/     ProjectCard
    sales/        SalesSection, SalesCard
    sections/     TwoCareers
  lib/
    content.ts    Single source of truth — projects, sales, skills, contact
```

## Editing content

All copy lives in `src/lib/content.ts`. Edit there.

See `CLAUDE.md` for accuracy guardrails — particularly around prior roles.
