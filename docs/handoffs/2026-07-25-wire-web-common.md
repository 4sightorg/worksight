# HANDOFF — Wire web to common (#16)

**Status:** Planned  
**Branch:** `feat/mvp-wire-web`  
**Issue(s):** #16  
**Last updated:** 2026-07-25

## Bottom line
Dashboard/UI uses `@worksight/common` **data + types + utils** (employees, tasks, survey, burnout, datasources) instead of duplicated local mocks.

## Current state
- Package exports: `@worksight/common`, `/data`, `/types`, `/utils`
- Fixtures in `packages/common/src/data/*.ts`
- Web landing is marketing-only; limited common import (api uses `Roles` from types)

## Hook points
- `apps/web/src/app/**` dashboard routes
- `apps/web/src/store(s)/**`, `data/`, `hooks/`
- `next.config.ts` transpilePackages already aware of common

## How to verify
```bash
pnpm --filter @worksight/web dev
# open dashboard; employees/tasks populated from common fixtures
```

## Done means
- [ ] ≥ employees + tasks + survey views import from common
- [ ] No silent empty fallbacks when fixtures exist
