# MVP demo path

One happy path: **start API + web → open `/demo` → see employees, teams, tasks,
and well-being widgets**. With `DATABASE_URL` set, Nest serves **Postgres**
(seeded from `@worksight/common`); without it, Nest serves the same shapes from
fixtures.

## One-command demo

```bash
pnpm install
pnpm demo                          # API fixture mode
DEMO_WITH_POSTGRES=1 pnpm demo     # local Docker Postgres + seed
# or: DATABASE_URL=postgresql://… pnpm demo   # Neon / existing PG
```

That script:

1. Builds `@worksight/common` and `@worksight/api`
2. Optionally starts Postgres (`DEMO_WITH_POSTGRES=1`) and runs `pnpm --filter @worksight/api seed`
3. Starts API on **`:3001`** and prints `/health` (`database: fixtures|postgres`)
4. Starts web on **`:3000`** with offline auth + `NEXT_PUBLIC_USE_API=true`

Then open:

| URL                                   | What you should see                                              |
| ------------------------------------- | ---------------------------------------------------------------- |
| http://localhost:3000/demo            | Counts + health badge (`fixtures` / `postgres`) + wellness sample |
| http://localhost:3000/admin/users     | Users from API                                                   |
| http://localhost:3000/admin/surveys   | Survey templates from API                                        |
| http://localhost:3000/dashboard/tasks | Assignment board; status changes PATCH the API when in API mode  |
| http://localhost:3000/survey          | Wellness survey; results POST to `/surveys/:id/responses`        |

## Curl checklist

```bash
curl -s http://localhost:3001/health; echo
curl -s http://localhost:3001/users | head -c 240; echo
curl -s http://localhost:3001/surveys | head -c 240; echo
curl -s http://localhost:3001/tasks | head -c 240; echo
```

## Data-source toggle

| Env                        | Behavior                                                                 |
| -------------------------- | ------------------------------------------------------------------------ |
| `DATABASE_URL` unset       | Nest serves fixtures                                                     |
| `DATABASE_URL` set         | Nest serves Postgres (`/health.database=postgres`)                       |
| `NEXT_PUBLIC_USE_API=true` | Web reads Nest for demo/admin/tasks/surveys                              |
| Offline auth               | `NEXT_PUBLIC_IS_OFFLINE=true` — no Supabase required for the demo path |

## Known gaps (post-MVP)

- Live Jira/Trello/GitHub connectors
- Production auth hardening (Supabase optional; offline demo uses local login)
- Survey UI question ids that are non-numeric still stay local-only
