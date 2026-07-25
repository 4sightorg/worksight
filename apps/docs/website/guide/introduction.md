# Introduction

WorkSight helps organizations track employee well-being alongside work activity.
This documentation covers the **monorepo** as it exists today: Next.js web,
NestJS API, VitePress docs, and `@worksight/common`.

## What ships in the repo

| Package             | Role                                     |
| ------------------- | ---------------------------------------- |
| `@worksight/web`    | Next.js 15 App Router UI                 |
| `@worksight/api`    | NestJS HTTP API                          |
| `@worksight/docs`   | VitePress site (`apps/docs`)             |
| `@worksight/common` | Shared types, fixtures, lookup utilities |
| `@worksight/assets` | Shared assets                            |

## MVP scope (honest)

- Dashboards and Nest list/detail endpoints are driven by **`@worksight/common`
  fixtures** for the MVP slice.
- **No** live Supabase persistence for those new API endpoints yet.
- Supabase Auth remains available on the web app when offline mode is off.
- External connectors (Jira, Trello, GitHub, Odoo, Slack) and production auth
  hardening are **non-goals** for the current MVP epic.

## Product surfaces (UI)

- Role-aware dashboards and admin views
- Task / assignment views
- Survey and burnout-related UI (backed by common types/fixtures where wired)
- Offline-capable web mode for local demos

## Technology stack

- **Web:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **API:** NestJS
- **Shared:** `@worksight/common`
- **Auth (web, optional):** Supabase Auth
- **Docs:** VitePress
- **Monorepo:** pnpm workspaces + Turbo
- **Hosting:** Vercel (three projects) + Docker for a working API

## Getting started

See [Getting Started](./getting-started.md) and
[Installation](./installation.md). Deployment layout:
[Deployment](./deployment.md).
