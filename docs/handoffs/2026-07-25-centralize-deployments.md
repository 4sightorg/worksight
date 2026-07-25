# HANDOFF — Centralize deployments (#20)

**Status:** Planned  
**Branch:** `feat/mvp-deploy` (after stabilize #15)  
**Issue(s):** #20  
**Last updated:** 2026-07-25

## Bottom line
One primary deploy path for web + api + docs; root env matrix; CI path filters; demote split vercel.json drift.

## Current state
- `apps/web/vercel.json`, `apps/api/vercel.json`
- Root `docker-compose.yml` + `nginx/` + `doc/DEPLOYMENT.md`

## Hook points
- `docker-compose.yml`, `nginx/`
- Root `.github/workflows`
- Root `.env.example`
- `doc/DEPLOYMENT.md`, README

## How to verify
```bash
docker compose config
pnpm --filter @worksight/web build
pnpm --filter @worksight/api build
```

## Done means
- [ ] One documented SoT deploy path
- [ ] Env matrix covers web+api
- [ ] DEPLOYMENT.md matches reality
