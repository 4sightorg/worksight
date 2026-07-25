# HANDOFF — Stabilize type-check (#15)

**Status:** Planned  
**Branch:** `feat/mvp-stabilize`  
**Issue(s):** #15  
**Last updated:** 2026-07-25

## Bottom line
Unblock MVP: `@worksight/common` builds; web/api `tsc --noEmit` green (fix Jest globals in `apps/web/src/__tests__`).

## Current state
- common builds today
- api type-check green
- web type-check fails: `Cannot find name 'describe'|'it'|'expect'` in `src/__tests__/schemas/user.test.ts`

## Hook points
- `apps/web/tsconfig.json` (types: jest / exclude tests from type-check)
- `apps/web/package.json` (`@types/jest` or vitest globals)
- Root README install scripts

## How to verify
```bash
pnpm install
pnpm --filter @worksight/common build
pnpm --filter @worksight/web type-check
pnpm --filter @worksight/api type-check
```

## Done means
- [ ] All three type-checks green
- [ ] Install/dev commands documented
