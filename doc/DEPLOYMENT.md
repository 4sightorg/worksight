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
- Build: `pnpm --filter @worksight/<app> build` (pnpm runs the workspace build
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

`apps/api/vercel.json` now uses zero-config build settings (`pnpm --filter`
build into `dist`) instead of the legacy `builds`/`routes` block, which silently
disabled Vercel's install and build steps.

**This is still not a functioning serverless API.** `main.ts` calls
`app.listen()` rather than exporting a handler, so a Vercel deployment produces
no invocable function. Wiring it properly requires adding a serverless entry
(e.g. `api/index.ts` exporting the bootstrapped Nest app). Until then, deploy
the API with Docker:

```bash
docker compose up -d --build
```

1. Import `4sightorg/worksight` as a Vercel project.
2. Set **Root Directory** to `apps/web`.
3. Keep **Include source files outside of the Root Directory** enabled.
4. Prefer install/build from `apps/web/vercel.json`; avoid dashboard overrides.
5. Add env vars per environment (see below).

### Docs (`worksight-docs` → `apps/docs`)

1. Separate Vercel project from the same repo.
2. **Root Directory** → `apps/docs`.
3. Keep outside-Root-Directory sources enabled.

Docs may also publish via GitHub Pages; Vercel is optional.

### API (`worksight-api` → `apps/api`)

`apps/api/vercel.json` uses zero-config-style install/build into `dist` (no
legacy `builds`/`routes` block that skipped Vercel's install step).

**This is still not a functioning serverless API.** `main.ts` calls
`app.listen()` rather than exporting a handler, so a Vercel deployment produces
no invocable function. Until a serverless entry exists, deploy the API with
Docker:

```bash
docker compose up -d --build
```

## Environment variables

Set in the **Vercel dashboard** (or local `apps/web/.env.local`). Nothing
sensitive belongs in committed `vercel.json`.

```bash
# Web app
NEXT_PUBLIC_APP_NAME="WorkSight"
NEXT_PUBLIC_APP_DESCRIPTION="Employee Well-being Analytics Platform"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"

# Supabase (optional; skip when offline)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-key"

# Offline / fixture-friendly local mode
NEXT_PUBLIC_IS_OFFLINE="true"
```

Copy from `apps/web/env.example` for local web setup.

`apps/web/vercel.json` (loaded by the `worksight` project) declares:

- `framework: nextjs` — output directory left to the framework default
- `installCommand: pnpm install --frozen-lockfile`
- `buildCommand: pnpm --filter @worksight/web build`
- `NEXT_TELEMETRY_DISABLED=1` for the build step

`apps/api/vercel.json` and `apps/docs/vercel.json` mirror the same shape with
their own filter and output directory. No environment values are committed —
they are set per environment in the dashboard.

Security headers, redirects, and CORS are **not** currently configured in
`vercel.json`; add them here if/when needed rather than assuming they exist.

Security headers, redirects, and CORS are **not** assumed to be present in
`vercel.json` — add them when needed.

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
