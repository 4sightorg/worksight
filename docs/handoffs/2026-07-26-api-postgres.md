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

Survey fixtures still contain invalid UUIDs — they are out of the API surface
for now.

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
