# Getting Started

Welcome to WorkSight. This guide gets the monorepo running locally for the MVP
slice.

## What is WorkSight?

WorkSight is an employee well-being and task analytics platform. The monorepo
includes:

- **`@worksight/web`** — Next.js 15 app (dashboards, surveys UI, admin)
- **`@worksight/api`** — NestJS API
- **`@worksight/docs`** — this VitePress site
- **`@worksight/common`** — shared types, fixtures, and lookup utilities

For the MVP, **populated dashboard / API data comes from `@worksight/common`
fixtures**, not from a live database. Supabase is optional for web auth / online
mode.

## Prerequisites

- Node.js 18+ (20+ recommended)
- pnpm 9+ (repo pins pnpm 10 via `packageManager`)
- Git
- Optional: Supabase project (only if you leave offline mode off)

## Install

```bash
git clone https://github.com/4sightorg/worksight.git
cd worksight
pnpm install
```

## Environment (web)

```bash
cp apps/web/env.example apps/web/.env.local
```

Minimal offline-friendly settings:

```bash
NEXT_PUBLIC_IS_OFFLINE=true
IS_OFFLINE=true
```

For online Supabase auth, set (names match `env.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
NEXT_PUBLIC_IS_OFFLINE=false
```

## Run locally

Build shared packages when you need API/web against compiled common:

```bash
pnpm --filter @worksight/common build
```

```bash
# Web → http://localhost:3000
pnpm dev:web

# Docs → http://localhost:5173 (VitePress default)
pnpm dev:docs

# API (defaults to PORT 3000 — pick another if web is running)
PORT=3123 pnpm --filter @worksight/api dev
```

Or `pnpm dev` to start all Turbo `dev` tasks.

## MVP data you should see

Once web is wired to common fixtures, dashboards/admin/tasks views use employee,
team, assignment, and activity fixtures from `@worksight/common`. The Nest API
exposes the same shapes on:

- `GET /users`, `/users/:id`, `/users/stats`
- `GET /teams`, `/teams/:id`
- `GET /tasks` (`?employee_id=`), `/tasks/:id`, `/tasks/stats/:employeeId`
- `GET /activities`
- `GET /`, `/ping`, `/health`

There is **no** Supabase-backed persistence for those API routes yet, and the
API has **no** Vercel serverless handler (`app.listen` only) — use Docker for a
deployed API. See [Deployment](/guide/deployment).

## Next steps

- [Installation](./installation.md) — environments and Docker notes
- [Configuration](./configuration.md) — real env vars only
- [API overview](/dev/api/overview) — Nest fixture endpoints
- [MVP plan](https://github.com/4sightorg/worksight/blob/feat/mvp-stabilize/docs/mvp/README.md)
  (epic #14)
