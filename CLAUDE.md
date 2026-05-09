@AGENTS.md

# Content style guide

Editorial rules for portfolio copy. AI assistants working in this repo read
this file too.

## Positioning

The site presents me for Developer, Solutions Engineer, Sales Engineer, and
Customer Success Manager roles. Engineering and sales are equal-weight
differentiators — neither buries the other.

## Source of truth

All copy lives in `src/lib/content.ts`. Edit there. Page components import
from it; never duplicate strings into JSX.

## Accuracy rules

These reflect my actual scope of work. Respect them on every edit.

| Project / role | Accurate framing |
|---|---|
| FutureShirts (Sept 2022 – Sept 2025) | "Contributed extensively" to internal ERP / IMS. Not "led end-to-end development." |
| inVia Robotics integration | Supporting role (daily monitoring). Not technical lead. |
| AT&T (2013–2016) | Sales Associate / Management Training Lead. Coaching scope, not formal leadership title. |
| uBreakiFix (2020–2021) | Managed 2 retail stores. Multi-store / district-level scope was at T-Mobile, not uBreakiFix. |
| MONISCOPE | Pre-launch. Phrase features as "designed to support" — never "enabling live customers." |
| Inertia.js | Frame as "modern monolith," not "server-driven rendering." |
| FutureShirts Shopify work | Primarily GraphQL queries against the Admin API. |
| Test count | 1,850+ across Pest/PHPUnit and Cypress. Keep consistent across the site. |

## Tooling not to claim

I haven't used Docker or AWS in production. Don't list them in skills,
project tech stacks, or `/uses`.
