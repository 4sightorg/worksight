# MVP Plan: WorkSight on @worksight/common

> **Date:** 2026-07-25  
> **Repo:** [4sightorg/worksight](https://github.com/4sightorg/worksight)  
> **Local:** `/home/kaoru/work/4sight/worksight`  
> **Status:** Plan to build (MVP)  
> **Epic:** [#14 MVP: WorkSight running on @worksight/common data layer](https://github.com/4sightorg/worksight/issues/14)  
> **Base tip:** `fix/restore-install-build-canary` (pnpm cutover in flight)

## Problem
`@worksight/common` already has **types / data / utils** (employees, tasks, survey, burnout, datasources), but the product surface is mostly a landing page. Web type-check fails on Jest globals in tests. Goal: **MVP that actually runs on the common data classes**.

## Definition of Done
- [ ] common + web + api type-check/build green
- [ ] Web dashboards consume `@worksight/common` fixtures/utils
- [ ] API shapes align with common types
- [ ] Documented demo path shows populated well-being/task views
- [ ] README matches Nest + Next 15 + packages reality
- [ ] Handoffs for each workstream

## Workstreams → issues

| # | Workstream | Issue | Pri |
|---|------------|-------|-----|
| W1 | Stabilize install / type-check / common build | [#15](https://github.com/4sightorg/worksight/issues/15) | P0 |
| W2 | Wire web → common data/types/utils | [#16](https://github.com/4sightorg/worksight/issues/16) | P0 |
| W3 | Wire API → common types | [#17](https://github.com/4sightorg/worksight/issues/17) | P0 |
| W4 | E2E demo path | [#18](https://github.com/4sightorg/worksight/issues/18) | P1 |
| W5 | Docs sync | [#19](https://github.com/4sightorg/worksight/issues/19) | P1 |
| W6 | Centralize deployments | [#20](https://github.com/4sightorg/worksight/issues/20) | P1 |

**Suggested order:** W1 → W2∥W3 → W4 → W5.

## Non-goals
Live external connectors (Jira/Trello/GitHub/Odoo/Slack); production auth hardening; docs site polish beyond honesty.

## Handoffs
See [../handoffs/](../handoffs/).
