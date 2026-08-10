# Handoff: Persistence MVP (Postgres + web writes)

**Date:** 2026-08-10  
**Branch base:** `canary`  
**PRs:** #28–#32, #37–#40, survey id-map follow-up

## Outcome

WorkSight MVP can run end-to-end on **Postgres** (local Docker or Neon) with
the same shapes as `@worksight/common` fixtures. Fixture mode remains the
default when `DATABASE_URL` is unset.

## Operator path

```bash
DEMO_WITH_POSTGRES=1 pnpm demo
# open http://localhost:3000/demo — badge: postgres
```

Or point `DATABASE_URL` at Neon and run `pnpm --filter @worksight/api seed`.

## Verified surfaces

| Surface | Behavior |
| --- | --- |
| `GET /health` | `database: postgres\|fixtures\|unreachable` |
| Admin users / surveys | Nest when `NEXT_PUBLIC_USE_API=true` |
| Dashboard tasks | Status drag → `PATCH /tasks/:id` |
| Survey results | Scale answers → `POST /surveys/:id/responses` via UI→numeric id map |
| CI | `.github/workflows/api-postgres.yml` |

## Do not merge

Drizzle / `feat/neon-persistence` stacks (#34–#36) — schema conflicts with the
`pg` + SQL seed path (#28). Prefer `db:reset` if an old Drizzle schema is present.

## Explicit non-goals

Live connectors; production auth hardening.