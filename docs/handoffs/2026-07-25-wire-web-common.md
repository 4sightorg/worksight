# HANDOFF — Wire web to common (#16)

**Status:** In progress (MVP slice)  
**Branch:** `feat/mvp-wire-web`  
**Issue(s):** #16  
**Last updated:** 2026-07-25

## Bottom line
Dashboard/UI uses `@worksight/common` **data + types + utils** (employees, tasks, survey) instead of duplicated local mocks.

## Current state
- Package exports: `@worksight/common`, `/data`, `/types`, `/utils`
- **Slice landed:** `apps/web/src/lib/mvp-data.ts` bridges common → dashboard stats, `/tasks`, `/dashboard/tasks`, `/admin/users`, `/admin/surveys`
- Local `@/data/employees` re-exports common via compatibility shim
- Managers (E001–E004) added to common `Employees` so assignments/teams resolve

## How to verify
```bash
pnpm --filter @worksight/common build
pnpm --filter @worksight/web type-check
pnpm --filter @worksight/web build
pnpm --filter @worksight/web dev
# open /dashboard, /dashboard/tasks, /admin/users, /admin/surveys
```

## Done means
- [x] ≥ employees + tasks + survey views import from common
- [x] No silent empty fallbacks when fixtures exist
- [ ] Remaining local fixtures (`work-tracking`, `surveys`, survey form) fully retired
