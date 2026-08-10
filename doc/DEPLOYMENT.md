# WorkSight Deployment Guide

WorkSight is a **Turborepo + pnpm workspace** monorepo. There is no single
deploy artifact — each app ships on the platform that fits it:

| App         | Package           | Vercel project   | Root Directory | Config source of truth  |
| ----------- | ----------------- | ---------------- | -------------- | ----------------------- |
| `apps/web`  | `@worksight/web`  | `worksight`      | `apps/web`     | `apps/web/vercel.json`  |
| `apps/api`  | `@worksight/api`  | `worksight-api`  | `apps/api`     | `apps/api/vercel.json`  |
| `apps/docs` | `@worksight/docs` | `worksight-docs` | `apps/docs`    | `apps/docs/vercel.json` |

All three Vercel projects are connected to the same GitHub repository
(`4sightorg/worksight`) with production branch **`canary`**, share
`pnpm install --frozen-lockfile`, and have **Include source files outside of the
Root Directory** plus **skip unaffected projects** enabled. The API can
alternatively run under Docker (`docker-compose.yml` + `nginx/`).

> ⚠️ **What repo config can and cannot do.** A `vercel.json` file only
> configures build/routing behavior. It **cannot** create Vercel projects, set a
> project's **Root Directory**, add environment variables to the dashboard, or
> link a Git repo. Those are dashboard/CLI actions — they are called out
> explicitly under
> [Vercel dashboard setup](#vercel-dashboard-setup-one-time-per-project).

## How Vercel resolves config in this monorepo

Vercel reads **exactly one** `vercel.json` per project: the one located at the
project's **Root Directory** (a dashboard setting). It does **not** merge a root
`vercel.json` with a nested one. Consequences:

- One Vercel project builds one output, so web, api, and docs need **separate**
  projects. A single root `vercel.json` cannot govern all three.
- "Centralized" here means **uniform, per-app configs** committed next to each
  app, all using the same workspace-level primitives — not one shared file.
- Each project's Root Directory therefore points at its app, and that app's
  `vercel.json` is the only file Vercel loads for it.

Every app config uses the same primitives, so behavior is consistent:

- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm turbo run build --filter=@worksight/<app>` (Turbo runs the build
  script; Turbo's `dependsOn: ["^build"]` graph builds workspace dependencies
  such as `@worksight/common` and `@worksight/assets` first).
- Output: framework default for Next.js; explicit for docs (`.vitepress/dist`)
  and api (`dist`).

Secrets and environment values live in the **dashboard**, not in `vercel.json`.

## Vercel dashboard setup (one-time, per project)

These steps **must** be done in the Vercel dashboard or CLI — no repo file can
perform them.

### Web project (`@worksight/web`)

1. Import the `4sightorg/worksight` repo as a new Vercel project.
2. **Root Directory → `apps/web`**, so Vercel loads `apps/web/vercel.json`.
3. Leave **"Include source files outside of the Root Directory in the Build
   Step"** enabled so the shared `packages/*` and the workspace lockfile are
   available.
4. Framework Preset / Install / Build come from `apps/web/vercel.json`; do not
   override them in the dashboard.
5. Add environment variables per environment (see
   [Environment Variables](#environment-variables)). Nothing sensitive is
   committed to `vercel.json`.

### Docs project (`@worksight/docs`) — optional on Vercel

1. Create a **separate** Vercel project from the same repo.
2. **Root Directory → `apps/docs`** so Vercel loads `apps/docs/vercel.json`.
3. Keep "Include source files outside of the Root Directory" enabled.

Docs are otherwise published to GitHub Pages; the Vercel path is optional.

### API project (`@worksight/api`)

Serverless entry: `apps/api/api/index.js` → `dist/vercel.js`. See
[API (`worksight-api`)](#api-worksight-api--appsapi) below for env and Neon.

### Web project (continued)

1. Import `4sightorg/worksight` as a Vercel project.
2. Set **Root Directory** to `apps/web`.
3. Keep **Include source files outside of the Root Directory** enabled.
4. Prefer install/build from `apps/web/vercel.json`; avoid dashboard overrides.
5. Public demo env is in `apps/web/vercel.json`; secrets stay in the dashboard.

### Docs (`worksight-docs` → `apps/docs`)

1. Separate Vercel project from the same repo.
2. **Root Directory** → `apps/docs`.
3. Keep outside-Root-Directory sources enabled.

Docs may also publish via GitHub Pages; Vercel is optional.

### API (`worksight-api` → `apps/api`)

Nest boots via `apps/api/api/index.js` → `dist/vercel.js` (serverless handler).
Production already serves routes at https://worksight-api.vercel.app when
`DATABASE_URL` (Neon) is set in the Vercel dashboard.

`apps/api/vercel.json` sets public `CORS_ORIGINS` for the web origin. Keep
`DATABASE_URL` / `DATABASE_URL_DIRECT` as **dashboard secrets only**.

Docker remains an alternate path:

```bash
docker compose up -d --build
```

## Environment variables

Set secrets in the **Vercel dashboard**. Public demo parity for web/API is also
committed in each app's `vercel.json` `env` block (non-secret values only).

### Web (`worksight-web`) — matches local `pnpm demo`

| Variable | Production value |
| --- | --- |
| `NEXT_PUBLIC_USE_API` | `true` |
| `NEXT_PUBLIC_API_URL` | `https://worksight-api.vercel.app` |
| `NEXT_PUBLIC_IS_OFFLINE` | `true` |
| `IS_OFFLINE` | `true` |
| `NEXT_PUBLIC_APP_URL` | `https://worksight-web.vercel.app` |

Supabase vars are optional while offline demo mode is on.

### API (`worksight-api`)

| Variable | Where |
| --- | --- |
| `DATABASE_URL` | Dashboard secret (Neon pooler URL) |
| `DATABASE_URL_DIRECT` | Dashboard secret (optional; migrations/seed) |
| `CORS_ORIGINS` | `vercel.json` (web + localhost) |

Seed Neon once (from a laptop with the secret URL):

```bash
DATABASE_URL='postgresql://…@….neon.tech/neondb?sslmode=require' \
  pnpm --filter @worksight/api seed
```

Copy from `apps/web/env.example` / `apps/api/.env.example` for local setup.

### Remote proof URLs

| Surface | URL |
| --- | --- |
| Web demo | https://worksight-web.vercel.app/demo |
| API health | https://worksight-api.vercel.app/health |
| API docs | https://worksight-api.vercel.app/api |

Expect `/health` → `"database":"postgres"` and `/demo` badge **postgres**.

`apps/web/vercel.json` (loaded by the `worksight-web` project) declares:

- `framework: nextjs` — output directory left to the framework default
- `installCommand: pnpm install --frozen-lockfile`
- `buildCommand: pnpm turbo run build --filter=@worksight/web`
- `NEXT_TELEMETRY_DISABLED=1` for the build step
- Public `env` for API-mode + offline demo (see table above)

`apps/api/vercel.json` and `apps/docs/vercel.json` mirror the same install/build
shape. No database secrets are committed.

## Pre-deploy checks

```bash
pnpm install
pnpm --filter @worksight/common build
pnpm type-check
pnpm lint
pnpm format:check
pnpm --filter @worksight/web build
pnpm --filter @worksight/docs build
# API compile (local / Docker path)
pnpm --filter @worksight/api build
```

Use the scripts that actually exist at the repo root (`type-check`, `lint`,
`format:check`, `quality`). There is no root `deploy.yml` workflow and no
`pnpm deploy` / `pnpm analyze` script.

## Automated deployment

- **GitHub Actions** run CI (type-check, lint, build gates) on push/PR.
- **Production/preview deploys** for web/docs/api are driven by the linked
  **Vercel Git integration** for each project (branch `canary` for production),
  not by a root `deploy.yml`.
- Do not expect a single `VERCEL_PROJECT_ID` secret to cover all three apps.

## MVP data honesty

- Web MVP views and Nest list/detail endpoints are backed by
  **`@worksight/common` fixtures**.
- There is **no** live Supabase persistence for those API endpoints yet.
- Do not document production API keys, webhooks, or hosted `api.worksight.com`
  as if they exist.

## Troubleshooting

1. **Build failures** — run `pnpm type-check` and rebuild `@worksight/common`
   before web/api.
2. **Supabase during build** — set placeholders or `NEXT_PUBLIC_IS_OFFLINE=true`
   in `.env.local` / Vercel env.
3. **Wrong app built** — confirm the Vercel project's Root Directory matches
   `apps/web`, `apps/api`, or `apps/docs`.
4. **API "deployed" but dead on Vercel** — expected until a serverless handler
   exists; use Docker.

## Checklist

- [ ] `pnpm type-check` / lint / relevant package builds pass
- [ ] Vercel Root Directory correct per project
- [ ] Dashboard env vars set (no secrets in git)
- [ ] Web preview deploys from `apps/web`
- [ ] API runtime path chosen (Docker today)
- [ ] Docs build (`pnpm --filter @worksight/docs build`) succeeds

## References

- Vercel monorepo docs: <https://vercel.com/docs>
- Next.js: <https://nextjs.org/docs>
- Repo MVP plan: [docs/mvp/README.md](../docs/mvp/README.md)
