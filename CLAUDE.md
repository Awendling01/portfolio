@AGENTS.md

# Content + collaboration guide

This file is read by AI assistants (Claude Code, Copilot, etc.) when they
edit code in this repo. It also functions as the human-readable style
guide for content changes.

## Voice

Terse and direct. Active voice, first person where appropriate.
Specifics over abstractions. Short paragraphs.

Avoid these words: *leveraging, streamlining, cutting-edge, robust,
seamless, comprehensive, utilizing, facilitating, innovative,
passionate, lifelong learner.* Cut filler (*basically, essentially,
simply, just, really, very, in order to*). No hedging (*might, could
potentially*).

## Source of truth

All copy lives in `src/lib/content.ts`. Edit there. Page components
import from it; don't duplicate strings into JSX.

## Engineering conventions

- **TypeScript strict** — no `any`, no `@ts-ignore` without a comment
  explaining why
- **Tailwind v4** — utility-first, CSS-first config (`@theme` block in
  globals.css; no `tailwind.config.js`)
- **Server components by default** — opt into `"use client"` only when
  you need state, refs, or browser APIs
- **Server actions** validate input with Zod before touching the DB
- **Drizzle migrations** are hand-rolled and idempotent
  (`IF NOT EXISTS` everywhere); run via the standalone HTTP migrator
  in `src/lib/db/migrate.ts`, not `drizzle-kit migrate`
- **Auth-gated routes** sit behind `proxy.ts` checks; server actions
  also re-verify the admin session as defense-in-depth

## Tooling I haven't used in production

Don't list these in skills, project tech stacks, or `/uses`:
Docker, AWS, Kubernetes.

---

**Personal positioning / project-specific framing rules live in
`CLAUDE.local.md`** (gitignored). When working on copy edits or
project metadata, an assistant with local access reads both files;
others should ask before guessing at framing.
