# WorkSight Deployment Guide

WorkSight is a **Turborepo + pnpm workspace** monorepo. There is no single
deploy artifact — each app ships on the platform that fits it:

| App         | Package           | Vercel project   | Root Directory | Config source of truth  |
| ----------- | ----------------- | ---------------- | -------------- | ----------------------- |
| `apps/web`  | `@worksight/web`  | `worksight`      | `apps/web`     | `apps/web/vercel.json`  |
| `apps/api`  | `@worksight/api`  | `worksight-api`  | `apps/api`     | `apps/api/vercel.json`  |
| `apps/docs` | `@worksight/docs` | `worksight-docs` | `apps/docs`    | `apps/docs/vercel.json` |

All three Vercel projects connect to the same GitHub repository
(`4sightorg/worksight`) with production branch **`canary`**, share
`pnpm install --frozen-lockfile`, and enable **Include source files outside of
the Root Directory** plus **skip unaffected projects**. The API can also run
under Docker (`docker-compose.yml` + `nginx/`).

> **What repo config can and cannot do.** A `vercel.json` only configures
> build/routing behavior. It **cannot** create Vercel projects, set a project's
> **Root Directory**, add dashboard env vars, or link a Git repo. Those are
> dashboard/CLI actions (see below).

## How Vercel resolves config in this monorepo

Vercel reads **exactly one** `vercel.json` per project: the file at the
project's **Root Directory** (dashboard setting). It does **not** merge a root
`vercel.json` with a nested one.

- One Vercel project builds one output, so web, api, and docs need **separate**
  projects. A single root `vercel.json` cannot govern all three.
- "Centralized" means **uniform, per-app configs** next to each app — not one
  shared file.
- Each Root Directory points at its app; that app's `vercel.json` is what Vercel
  loads.

Shared primitives:

- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm --filter @worksight/<app> build` (Turbo `dependsOn: ["^build"]`
  builds workspace deps such as `@worksight/common` first)
- Output: Next.js framework default for web; `.vitepress/dist` for docs; `dist`
  for api

Secrets live in the **dashboard**, not in `vercel.json`.

## Vercel dashboard setup (one-time, per project)

### Web (`worksight` → `apps/web`)

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

## Per-app `vercel.json` shape

- **Web:** `framework: nextjs`, `pnpm install --frozen-lockfile`,
  `pnpm --filter @worksight/web build`, telemetry disabled for the build.
- **API / docs:** same install/filter pattern; explicit `outputDirectory`
  (`dist` / `.vitepress/dist`).

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
