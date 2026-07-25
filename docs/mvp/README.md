# MVP Plan: WorkSight on @worksight/common

> **Date:** 2026-07-25  
> **Repo:** [4sightorg/worksight](https://github.com/4sightorg/worksight)  
> **Status:** In progress (MVP)  
> **Epic:** [#14 MVP: WorkSight running on @worksight/common data layer](https://github.com/4sightorg/worksight/issues/14)  
> **Base
> tip:** `feat/mvp-integration` (pnpm + Turbo; integrates PRs #21–#26)

## Problem

`@worksight/common` already has **types / data / utils** (employees, tasks,
survey, burnout, datasources). The MVP goal is a product surface that **runs on
those fixtures** (web + Nest), with honest docs and deploy layout — not live
external connectors or full Supabase persistence for the new API routes.

## Definition of Done

- [x] common + web + api type-check/build green (#15 / PR #21)
- [x] Web dashboards consume `@worksight/common` fixtures/utils (#16 / PR #22)
- [x] API shapes align with common types (#17 / PR #24)
- [x] Documented demo path shows populated well-being/task views
      (#18 / PR #26 — `docs/mvp/DEMO.md`, `pnpm demo`)
- [x] README matches Nest + Next 15 + packages reality (#19 / PR #25)
- [x] Deploy config matches the three real Vercel projects (#20 / PR #23)
- [ ] Handoffs for each workstream
- [ ] Uniform per-app Vercel configs (#20 / PR #23)

## Workstreams → issues

| #   | Workstream                                    | Issue                                                   | Pri |
| --- | --------------------------------------------- | ------------------------------------------------------- | --- |
| W1  | Stabilize install / type-check / common build | [#15](https://github.com/4sightorg/worksight/issues/15) | P0  |
| W2  | Wire web → common data/types/utils            | [#16](https://github.com/4sightorg/worksight/issues/16) | P0  |
| W3  | Wire API → common types                       | [#17](https://github.com/4sightorg/worksight/issues/17) | P0  |
| W4  | E2E demo path                                 | [#18](https://github.com/4sightorg/worksight/issues/18) | P1  |
| W5  | Docs sync                                     | [#19](https://github.com/4sightorg/worksight/issues/19) | P1  |
| W6  | Centralize deployments                        | [#20](https://github.com/4sightorg/worksight/issues/20) | P1  |

**Suggested order:** W1 → W2∥W3 → W4 → W5 (docs can track wiring/deploy facts
from open PRs). W6 may land in parallel with docs.

## Non-goals

Live external connectors (Jira/Trello/GitHub/Odoo/Slack); production auth
hardening; docs site polish beyond honesty; claiming Supabase persistence or a
serverless Nest handler before they exist.

## Handoffs

See [../handoffs/](../handoffs/) — index links
[#15](https://github.com/4sightorg/worksight/issues/15)–[#20](https://github.com/4sightorg/worksight/issues/20)
(parent epic [#14](https://github.com/4sightorg/worksight/issues/14)).
