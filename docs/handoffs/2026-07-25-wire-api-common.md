# HANDOFF — Wire API to common (#17)

**Status:** Planned  
**Branch:** `feat/mvp-wire-api`  
**Issue(s):** #17  
**Last updated:** 2026-07-25

## Bottom line
Nest API returns/accepts shapes from `@worksight/common` types; at least one list endpoint serves common-shaped data.

## Current state
- `users.controller.ts` imports `Roles` from `@worksight/common/types`
- common package linked in api `package.json`

## Hook points
- `apps/api/src/**` controllers/services/DTOs
- Map DB/Supabase rows → common types if needed

## How to verify
```bash
pnpm --filter @worksight/api type-check
pnpm --filter @worksight/api start:dev
# curl list endpoint; shape matches common types
```

## Done means
- [ ] Shared types on request/response path
- [ ] Type-check green
