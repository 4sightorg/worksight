# HANDOFF — Centralize deployments (#20)

**Status:** In progress (repo-side config done)  
**Branch:** `feat/vercel-monorepo-config-20`  
**Issue(s):** #20  
**Last updated:** 2026-07-25

## Bottom line

Three Vercel projects (`worksight`, `worksight-api`, `worksight-docs`), one
uniform per-app `vercel.json` each, all using the same pnpm workspace install
and filtered build. Dashboard settings (Root Directory, production branch
`canary`, skip-unaffected deploys) were applied via the Vercel API and are
documented here.

## What changed (repo-side)

- `apps/web/vercel.json`: `framework: nextjs`, `pnpm install --frozen-lockfile`,
  `pnpm --filter @worksight/web build`, telemetry off. No `outputDirectory`
  (Next.js preset default), and the previously committed `NEXT_PUBLIC_*` values
  — including the Supabase anon key — removed in favor of dashboard env vars.
- `apps/docs/vercel.json`: same shape, output `.vitepress/dist`.
- `apps/api/vercel.json`: replaced the legacy `builds`/`routes` block (which
  disabled Vercel's install/build steps entirely) with zero-config build
  settings; output `dist`.
- `doc/DEPLOYMENT.md` + `README.md`: per-project table with actual Root
  Directory values, dashboard steps, and an honest note that the API has no
  serverless handler yet.

## Dashboard state (applied via Vercel API)

- Root Directory: `apps/web` / `apps/api` / `apps/docs` respectively.
- "Include source files outside of the Root Directory" enabled (workspace
  `packages/*` + lockfile).
- Skip deploys for unaffected projects enabled.
- Production branch `canary`.
- Env vars remain dashboard-managed per environment.

## Remaining

- API needs a serverless entry (`main.ts` calls `app.listen()`), or stays on
  Docker.
- API env matrix is Docker-side only.

## Current state

- `apps/web/vercel.json`, `apps/api/vercel.json`, `apps/docs/vercel.json`
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

- [x] One documented deploy path per app (uniform per-app `vercel.json`)
- [x] DEPLOYMENT.md matches reality (per-app targets + dashboard steps)
- [ ] Env matrix covers web+api (web done in config; api env still Docker-side)
