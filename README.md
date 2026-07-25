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

# API — Nest listens on PORT or 3000; use another port if web is already on 3000
pnpm --filter @worksight/api dev
# e.g. PORT=3123 pnpm --filter @worksight/api dev

# Docs (VitePress; default http://localhost:5173)
pnpm dev:docs
# or: pnpm --filter @worksight/docs dev

# All turbo `dev` tasks
pnpm dev
```

### Useful root scripts

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
- Build: `pnpm --filter @worksight/<app> build`
- Env vars live in the **Vercel dashboard**, not in committed `vercel.json`

**API on Vercel:** the Nest `main.ts` still calls `app.listen()` — there is no
serverless handler yet, so a Vercel deploy does not expose invocable functions.
Use **Docker** (`docker compose up -d --build`) for a working API today.

Full setup: [doc/DEPLOYMENT.md](./doc/DEPLOYMENT.md). VitePress site:
[apps/docs](./apps/docs/).

## MVP / handoffs

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
