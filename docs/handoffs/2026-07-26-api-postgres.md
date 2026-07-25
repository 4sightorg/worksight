# Postgres for the Nest API

The Nest API talks **SQL over `DATABASE_URL`**, not Supabase JS / PostgREST.
Point `DATABASE_URL` at either:

- a **direct** Postgres URL (`…:5432/postgres`), or
- a **PgBouncer** transaction-pool URL (`…:6543/postgres`)

Both work: the pool disables session-sticky assumptions so PgBouncer is fine.

## Neon project (preferred)

Created 2026-07-26:

| | |
| --- | --- |
| Project | `worksight` (`jolly-bar-28285215`) |
| Region | `aws-ap-southeast-1` |
| Org | John Carlo (`org-fancy-cake-20409340`) |
| Direct host | `ep-steep-art-aztucqv5.c-3.ap-southeast-1.aws.neon.tech` |
| Pooler host | `ep-steep-art-aztucqv5-pooler.c-3.ap-southeast-1.aws.neon.tech` |

Credentials live in gitignored `apps/api/.env.local`:

- `DATABASE_URL` — **pooled** (PgBouncer) for Nest
- `DATABASE_URL_DIRECT` — direct, for `seed` / DDL

```bash
# seed against the direct URL (DDL + TRUNCATE)
DATABASE_URL="$(grep DATABASE_URL_DIRECT apps/api/.env.local | cut -d= -f2- | tr -d '"')" \
  pnpm --filter @worksight/api seed

# run Nest against the pooler
set -a; source apps/api/.env.local; set +a
pnpm --filter @worksight/api build
node apps/api/dist/main.js
```

Verified: `/users` → 15 rows, `/tasks` → 8 rows over the pooler.

## Why not the old Supabase project?

`ontaynsmofmfvzypfhra.supabase.co` (still in Vercel env) no longer resolves.
There was no `DATABASE_URL` on the Vercel projects.

## Local Podman (optional fallback)

```bash
podman run -d --name worksight-pg \
  -e POSTGRES_USER=worksight \
  -e POSTGRES_PASSWORD=worksight \
  -e POSTGRES_DB=worksight \
  -p 5433:5432 \
  docker.io/library/postgres:16-alpine

export DATABASE_URL=postgresql://worksight:worksight@127.0.0.1:5433/worksight
pnpm --filter @worksight/api seed
```

Without `DATABASE_URL`, endpoints fall back to `@worksight/common` fixtures.

## Schema

`apps/api/sql/001_core.sql` — `employees`, `teams`, `assignments`, `activities`.
Column names and CHECKs match `@worksight/common` types. Seed data comes from
the same fixtures the offline demo uses.

## Schema fixes that landed with this work

- Fake hex employee ids (`…f6g7…`) replaced with real UUIDs.
- `manager_id: ''` / `'admin'` replaced with `null` / the super-admin UUID.
- Duplicate `internal_id` values on system accounts renumbered (E013–E015).
- `EmployeeProfile.manager_id` is nullable; `Assignment.employee_id` /
  `source_id` are UUIDs.

## Vercel serverless fix (follow-up branch `fix/api-vercel-esm`)

Production was crashing with `FUNCTION_INVOCATION_FAILED` /
`ERR_REQUIRE_ESM`: Nest emits CommonJS, but `@worksight/common` was
ESM-only (`"type": "module"`), so the serverless function died on the
first `require('@worksight/common')`. Also, `main.ts` called
`app.listen()`, which is wrong for Vercel.

- `@worksight/common` now dual-builds `dist/esm` + `dist/cjs` (with
  matching `exports.require` / `exports.import`).
- Nest bootstrap is shared (`src/bootstrap.ts`); local still uses
  `main.ts` + listen, Vercel uses `api/index.js` → `dist/vercel.js`
  (Express adapter, cached warm isolate).
- `apps/api/vercel.json` drops `outputDirectory: dist` (that made Vercel
  treat every compiled file as a function) and rewrites `/(.*)` → `/api`.

## DB-backed stats (follow-up branch `feat/api-db-stats`)

- `GET /users/stats` and `GET /tasks/stats/:employeeId` now hydrate the
  `@worksight/common` lookup helpers from Postgres in DB mode, so stats
  reflect live rows instead of always echoing fixtures.
  `AssignmentLookup.getStats` gained an optional `activities` parameter
  (defaults to the fixture set, so web callers are unaffected).

## Surveys (follow-up branch `feat/api-surveys`)

- Survey fixtures repaired: `SURVEY-123` → the real survey UUID, `EMP-001` →
  E001's UUID, `RESP-001-Q*` ids → deterministic UUIDs (`5e590000-…`).
  `SurveySchema.created_by` and `SurveyResponseMetadataSchema.employee_id`
  are now `z.uuid()`. No fixture dataset with invalid UUIDs remains.
- `apps/api/sql/003_surveys.sql` — `surveys`, `survey_questions` (dimension
  stored as `TEXT[]`, `default_value`/`response` as JSONB),
  `survey_response_meta`, `survey_responses`. Seeded on Neon: 1 survey,
  25 questions, 1 submission, 9 answers.
- Endpoints: `GET /surveys`, `GET /surveys/:id/questions`,
  `GET /surveys/responses` (optional `?employee_id=`), and
  `POST /surveys/:id/responses` validated with the new
  `SurveySubmissionSchema` from `@worksight/common`. avg_score is the mean of
  numeric answers (2 dp), matching the fixture value. Fixture mode keeps
  submissions in memory so the offline demo can still submit.

## Attendance (follow-up branch `feat/api-attendance`)

- Attendance fixtures repaired: 77 invalid `system_id`s regenerated as
  deterministic UUIDs (`a77e0000-…`), and stale/placeholder `employee_id`s
  (`0001`, `admin`, `guest`, old hex ids) remapped to the repaired employee
  UUIDs using the per-block comments in the fixture file.
  `AttendanceSchema.employee_id` is now `z.uuid()`.
- `apps/api/sql/002_attendance.sql` — `attendance` table with an
  `(employee_id, date)` unique constraint; seed script applies it and loads
  the fixtures (77 rows on Neon).
- New endpoints: `GET /attendance` (optional `?employee_id=`) and
  `GET /attendance/stats/:employeeId`. DB mode computes stats with a SQL
  aggregate; fixture mode uses `AttendanceLookup`, same rounding.
- `GET /health` now reports the data source: `database` is `fixtures`,
  `postgres`, or `unreachable` (with `status: degraded`).

## Related

- `apps/api/.env.example`
- `apps/api/src/db/*`
- `docs/mvp/DEMO.md` (fixture demo path still valid when `DATABASE_URL` unset)
