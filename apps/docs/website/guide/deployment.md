# Deployment

WorkSight is a pnpm + Turborepo monorepo. Deploy **each app** with its own
target — there is no single root Vercel project that builds everything.

## Vercel projects

| App         | Package           | Vercel project   | Root Directory |
| ----------- | ----------------- | ---------------- | -------------- |
| `apps/web`  | `@worksight/web`  | `worksight`      | `apps/web`     |
| `apps/api`  | `@worksight/api`  | `worksight-api`  | `apps/api`     |
| `apps/docs` | `@worksight/docs` | `worksight-docs` | `apps/docs`    |

Each project loads **only** the `vercel.json` under its Root Directory. Vercel
does not merge a repo-root `vercel.json` with nested ones.

Shared settings in practice:

- Production branch: **`canary`**
- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm --filter @worksight/<app> build`
- Include source files outside Root Directory: **on**
- Skip unaffected projects: **on**

## API caveat

`apps/api` still boots with `app.listen()`. A Vercel deployment builds `dist/`
but does **not** expose a serverless function yet. Use Docker for a working API:

```bash
docker compose up -d --build
```

## Local verify before ship

```bash
pnpm --filter @worksight/common build
pnpm type-check
pnpm --filter @worksight/web build
pnpm --filter @worksight/docs build
pnpm --filter @worksight/api build
```

## Canonical guide

The long-form checklist and dashboard steps live in the repo at
[`doc/DEPLOYMENT.md`](https://github.com/4sightorg/worksight/blob/feat/mvp-stabilize/doc/DEPLOYMENT.md).

There is **no** root `deploy.yml` / `pnpm deploy` script. Production deploys are
driven by each Vercel project's Git integration.
