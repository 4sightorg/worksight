# MVP demo path (#18)

One happy path: **start API + web → open `/demo` → see employees, teams, tasks,
and well-being widgets** populated from the shared `@worksight/common` contract.

> **Honest scope:** data is **fixture-backed** via Nest. This is not Supabase
> persistence.

## Stack dependency

This demo branch stacks on:

- `#16` web → common (`feat/mvp-wire-web`)
- `#17` API → common (`feat/mvp-wire-api-17`)

Base for the PR is typically `feat/mvp-stabilize`; merge/rebase after sibling
PRs land.

## One-command demo

From the repo root (after `pnpm install`):

```bash
pnpm demo
# or: bash scripts/demo.sh
```

That script:

1. Builds `@worksight/common` and `@worksight/api`
2. Starts API on **`:3001`** (CORS for `http://localhost:3000`)
3. Curls `/users`, `/teams`, `/tasks` and prints counts
4. Starts web on **`:3000`** with:
   - `NEXT_PUBLIC_IS_OFFLINE=true` (no Supabase required for login)
   - `NEXT_PUBLIC_USE_API=true`
   - `NEXT_PUBLIC_API_URL=http://localhost:3001`

Then open:

| URL                                   | What you should see                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| http://localhost:3000/demo            | Public E2E page: counts + burnout/well-being sample from `GET /tasks/stats/:id` |
| http://localhost:3000/admin/users     | Users with burnout risk (API when toggle on; else fixtures)                     |
| http://localhost:3000/dashboard/tasks | Assignment board from common/API                                                |

## Manual (split terminals)

```bash
# Terminal A — API
pnpm --filter @worksight/common build
pnpm --filter @worksight/api build
PORT=3001 CORS_ORIGINS=http://localhost:3000 pnpm --filter @worksight/api start:prod

# Terminal B — Web
NEXT_PUBLIC_IS_OFFLINE=true \
IS_OFFLINE=true \
NEXT_PUBLIC_USE_API=true \
NEXT_PUBLIC_API_URL=http://localhost:3001 \
  pnpm --filter @worksight/web dev
```

## Curl checklist

```bash
curl -s http://localhost:3001/users | head -c 240; echo
curl -s http://localhost:3001/teams | head -c 240; echo
curl -s http://localhost:3001/tasks | head -c 240; echo
curl -s http://localhost:3001/users/stats; echo
# pick an employee id from /users, then:
# curl -s http://localhost:3001/tasks/stats/<employee-id>
```

Expect non-empty JSON arrays matching `EmployeeProfile[]`, `Team[]`,
`Assignment[]` from `@worksight/common`.

## Data-source toggle

| Env                                 | Behavior                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_USE_API` unset/`false` | Web uses in-process `@worksight/common` fixtures (`mvp-data.ts`)                  |
| `NEXT_PUBLIC_USE_API=true`          | `/admin/users`, `/tasks`, `/dashboard/tasks` fetch Nest; `/demo` always hits Nest |
| `NEXT_PUBLIC_API_URL`               | API base (default `http://localhost:3001`)                                        |

## Known gaps

- Survey / attendance / burnout endpoints are not on the API yet (common types
  only).
- `/demo` is the auth-free proof path; full dashboards still need offline login
  when Supabase is unset.
- Fixture employee ids are not all valid UUIDs (known from #17).
