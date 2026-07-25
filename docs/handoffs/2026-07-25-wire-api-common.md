# HANDOFF — Wire API to common (#17)

**Status:** Done (MVP slice)  
**Branch:** `feat/mvp-wire-api-17`  
**Issue(s):** #17  
**Last updated:** 2026-07-25

## Bottom line

Nest API returns/accepts shapes from `@worksight/common` types; users, teams,
tasks, and activities endpoints serve the shared fixtures.

## Current state

- `@worksight/common` is a `workspace:*` dependency of the API; the api tsconfig
  resolves it against the built `packages/common/dist` so type-check matches
  what Node loads at runtime (build common first).
- `apps/api` now emits real output: the api tsconfig previously inherited
  `noEmit: true` from the root, so `nest build` produced an empty `dist/`. Fixed
  with `noEmit: false` + CommonJS emit; added `tsconfig.build.json` so spec
  files stay out of `dist/`.
- `packages/common` build now runs `tsc-alias --resolve-full-paths`; the
  previous dist was unloadable ESM (`export * from './data'` directory imports).
- Fixed `BaseLookup.filter()` in common: it reconstructed subclasses with
  `new Cls(schema, entries)` while subclasses take `(entries)`, so every chained
  filter/`getById` silently returned garbage.
- Endpoints (all fixture-backed, typed from common):
  - `GET /users` → `EmployeeProfile[]`, `GET /users/:id` (404 if missing),
    `GET /users/stats`
  - `GET /teams` → `Team[]`, `GET /teams/:id`
  - `GET /tasks` → `Assignment[]` (`?employee_id=` filter), `GET /tasks/:id`,
    `GET /tasks/stats/:employeeId`
  - `GET /activities` → `Activity[]` (`?employee_id=` filter)
- Unit tests for `UsersService` / `TasksService` assert responses equal the
  shared fixtures.

## Hook points

- `apps/api/src/users/**`, `apps/api/src/tasks/**`
- Swap the `*Lookup` fixture sources for DB/Supabase rows mapped to common types
  when real persistence lands.

## How to verify

```bash
pnpm --filter @worksight/common build   # required before api type-check/build
pnpm --filter @worksight/api type-check
pnpm --filter @worksight/api build
pnpm --filter @worksight/api test
pnpm --filter @worksight/api lint
PORT=3123 node apps/api/dist/main.js &
curl localhost:3123/users     # shape matches EmployeeProfile[]
curl localhost:3123/tasks     # shape matches Assignment[]
```

## Done means

- [x] Shared types on request/response path
- [x] Type-check green

## Known gaps

- Responses are fixture-backed only; no DB/Supabase reads yet.
- Attendance / survey / burnout types exist in common but have no API endpoints
  yet (attendance module is still commented out in `app.module.ts`).
- Employee fixture ids in common are not all valid UUIDs, so responses fail
  strict `EmployeeProfileSchema.parse` even though the TS shapes match.
