# WorkSight Monorepo

[![CI](https://github.com/4sightorg/worksight/workflows/CI/badge.svg)](https://github.com/4sightorg/worksight/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

WorkSight is an employee well-being analytics platform. This **pnpm +
Turborepo** monorepo ships a Next.js web app, a NestJS API, VitePress docs, and
shared packages — notably `@worksight/common` (types, fixtures, lookup utils).

**MVP note:** dashboard and API data for the current slice come from
`@worksight/common` fixtures, not live Supabase persistence. Supabase remains
optional for web auth / online mode.

## Project structure

```text
worksight/
├── apps/
│   ├── web/          # @worksight/web  — Next.js 15 (App Router)
│   ├── api/          # @worksight/api  — NestJS
│   └── docs/         # @worksight/docs — VitePress
├── packages/
│   ├── common/       # @worksight/common — types, fixtures, utils
│   └── assets/       # @worksight/assets
├── doc/              # Repo guides (e.g. DEPLOYMENT.md)
├── docs/             # MVP plan + handoffs
└── .github/          # CI workflows
```

## Prerequisites

- **Node.js** `>=18` (repo engines; Node 20+ recommended)
- **pnpm** `>=9` (lockfile uses pnpm 10 — see `packageManager` in root
  `package.json`)
- **Git**

## Quick start

```bash
git clone https://github.com/4sightorg/worksight.git
cd worksight
pnpm install

# Optional web env (offline mode works without Supabase)
cp apps/web/env.example apps/web/.env.local
```

### Run apps

```bash
# Build shared packages first when developing API/web against common
pnpm --filter @worksight/common build

# Web (http://localhost:3000)
pnpm dev:web
# or: pnpm --filter @worksight/web dev

# Start the Nest API (fixture-backed common data; default :3001)
pnpm --filter @worksight/common build
pnpm dev:api

# Start the documentation site
pnpm dev:docs
# or: pnpm --filter @worksight/docs dev

# Start both web + docs (turbo)
pnpm dev

# MVP E2E demo: API + web with shared common fixtures (see docs/mvp/DEMO.md)
pnpm demo
```

Open:

- **Web App**: <http://localhost:3000>
- **E2E demo page**: <http://localhost:3000/demo> (requires API on :3001)
- **API**: <http://localhost:3001> (Swagger at `/api`)
- **Documentation**: <http://localhost:5173>

> Demo data is **fixture-backed** from `@worksight/common` — not Supabase. Set
> `NEXT_PUBLIC_USE_API=true` and `NEXT_PUBLIC_API_URL=http://localhost:3001` so
> dashboard/admin pages call Nest instead of in-process fixtures.

## 📦 Available Scripts

### Root Scripts

```bash
pnpm build          # turbo build (all packages)
pnpm build:web      # @worksight/web
pnpm build:docs     # @worksight/docs
pnpm type-check     # turbo type-check
pnpm lint           # turbo lint
pnpm test           # turbo test
pnpm format         # Prettier write
pnpm format:check   # Prettier check
pnpm quality        # turbo quality
pnpm clean          # turbo clean
```

Filter any package directly:

```bash
pnpm --filter @worksight/common build
pnpm --filter @worksight/api build
pnpm --filter @worksight/api test
pnpm --filter @worksight/docs build
```

## Technology stack

| Area        | Choice                                              |
| ----------- | --------------------------------------------------- |
| Web         | Next.js 15, React 19, TypeScript, Tailwind, shadcn  |
| API         | NestJS (`apps/api`)                                 |
| Shared data | `@worksight/common` types + fixtures + lookup utils |
| Auth (web)  | Optional Supabase Auth; offline mode supported      |
| Docs        | VitePress (`apps/docs`)                             |
| Monorepo    | pnpm workspaces + Turbo                             |
| CI          | GitHub Actions                                      |

## MVP data layer

- **Web:** dashboard / admin / tasks views consume `@worksight/common` fixtures
  (via a thin bridge such as `apps/web/src/lib/mvp-data.ts` on the wire-web
  branch).
- **API:** Nest endpoints return the same fixture shapes (`EmployeeProfile`,
  `Team`, `Assignment`, `Activity`). There is **no** DB/Supabase read path for
  those endpoints yet.
- Fixture-backed routes (API): `GET /users`, `/users/:id`, `/users/stats`,
  `/teams`, `/teams/:id`, `/tasks`, `/tasks/:id`, `/tasks/stats/:employeeId`,
  `/activities`, plus `/`, `/ping`, `/health`.

## Deployment

Three Vercel projects share the same GitHub repo. Each has its own **Root
Directory** and `vercel.json` (Vercel does **not** merge a root config with
nested ones):

| App         | Package           | Vercel project   | Root Directory |
| ----------- | ----------------- | ---------------- | -------------- |
| `apps/web`  | `@worksight/web`  | `worksight`      | `apps/web`     |
| `apps/api`  | `@worksight/api`  | `worksight-api`  | `apps/api`     |
| `apps/docs` | `@worksight/docs` | `worksight-docs` | `apps/docs`    |

- Production branch: **`canary`**
- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm turbo run build --filter=@worksight/<app>` (Turbo builds
  workspace dependencies such as `@worksight/common` first)
- Env vars live in the **Vercel dashboard**, not in committed `vercel.json`

**API on Vercel:** the Nest `main.ts` still calls `app.listen()` — there is no
serverless handler yet, so a Vercel deploy does not expose invocable functions.
Use **Docker** (`docker compose up -d --build`) for a working API today.

- **Web Application** (`@worksight/web`): Vercel —
  [worksight.vercel.app](https://worksight.vercel.app)
- **Documentation** (`@worksight/docs`): GitHub Pages (optionally Vercel)
- **API** (`@worksight/api`): Docker (`docker-compose.yml` + `nginx/`)
Full setup: [doc/DEPLOYMENT.md](./doc/DEPLOYMENT.md). VitePress site:
[apps/docs](./apps/docs/).

## MVP / handoffs

This is a Turborepo + pnpm monorepo, so each app deploys as its **own** Vercel
project (or non-Vercel target). Vercel loads a single `vercel.json` per project
based on its dashboard **Root Directory** setting:

- **Web** (`worksight`): Root Directory `apps/web` → `apps/web/vercel.json`.
- **API** (`worksight-api`): Root Directory `apps/api` → `apps/api/vercel.json`
  (still needs a serverless handler; Docker is the working path today).
- **Docs** (`worksight-docs`): Root Directory `apps/docs` →
  `apps/docs/vercel.json`.

All three share `pnpm install --frozen-lockfile`, a
`pnpm turbo run build --filter=@worksight/<app>` command, production branch `canary`, and
skip-unaffected-project deploys. No environment values are committed to
`vercel.json`.

Dashboard-only steps (creating projects, setting Root Directory, adding env
vars) cannot be performed by repo files. See the
[Deployment Guide](./doc/DEPLOYMENT.md) for the full setup, including the
required Vercel dashboard configuration.

- Plan: [docs/mvp/README.md](./docs/mvp/README.md) (epic
  [#14](https://github.com/4sightorg/worksight/issues/14))
- Handoffs: [docs/handoffs/](./docs/handoffs/) — issues
  [#15](https://github.com/4sightorg/worksight/issues/15)–[#20](https://github.com/4sightorg/worksight/issues/20)

## Contributing

1. Branch from the active integration branch (MVP work stacks on
   `feat/mvp-stabilize` / `canary` as directed).
2. Use conventional commits (`feat:`, `fix:`, `docs:`, …).
3. Keep type-check / lint green for touched packages.
4. Update docs when behavior or layout changes.

## License

MIT — see [LICENSE](LICENSE).
