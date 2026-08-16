# MVP Plan: WorkSight persistence slice

> **Status:** Persistence MVP landed on `canary` (2026-08-10)  
> **Epic (fixtures):** [#14](https://github.com/4sightorg/worksight/issues/14)  
> **Postgres stack:** PRs #28–#32, #37–#40 (+ survey UI→API id map)

## Definition of Done (persistence MVP)

- [x] Nest serves employees/teams/tasks/activities from Postgres when `DATABASE_URL` is set
- [x] Fixture fallback when `DATABASE_URL` is unset
- [x] Survey list + submit + attendance + stats endpoints
- [x] Task POST/PATCH
- [x] CI job seeds Postgres and smokes `/health` + `/users`
- [x] Web `/demo` shows `database` backend; admin/tasks/surveys use API when `USE_API=true`
- [x] Survey results map UI question ids → Nest `question_id` and POST responses
- [x] `pnpm demo` / `DEMO_WITH_POSTGRES=1 pnpm demo` documented
- [ ] Live connectors (explicit non-goal)
- [x] Production auth hardening (opt-in: `NEXT_PUBLIC_IS_OFFLINE=true` for demo;
  online mode requires real Supabase keys — see auth posture decision)

## Happy path

```bash
DEMO_WITH_POSTGRES=1 pnpm demo
# open http://localhost:3000/demo — badge should read postgres
```

See [DEMO.md](./DEMO.md) and [doc/DATABASE.md](../../doc/DATABASE.md).
