# Installation

Install and run the WorkSight monorepo (pnpm + Turbo).

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **pnpm** 9+ (lockfile expects pnpm 10 — see root `packageManager`)
- **Git**
- Optional: **Docker** / Docker Compose for the Nest API

## Native (recommended for development)

1. **Clone**

   ```bash
   git clone https://github.com/4sightorg/worksight.git
   cd worksight
   ```

2. **Install**

   ```bash
   corepack enable
   pnpm install
   ```

3. **Web env**

   ```bash
   cp apps/web/env.example apps/web/.env.local
   ```

   Edit `apps/web/.env.local`. For fixture / offline MVP work:

   ```bash
   NEXT_PUBLIC_IS_OFFLINE=true
   IS_OFFLINE=true
   ```

   There is no root `.env.example`, no `pnpm db:migrate` / `pnpm db:seed`, and
   no NextAuth-required setup for the MVP slice.

4. **Build shared package**

   ```bash
   pnpm --filter @worksight/common build
   ```

5. **Start apps**

   ```bash
   pnpm dev:web                                          # :3000
   pnpm dev:docs                                         # VitePress
   PORT=3123 pnpm --filter @worksight/api dev            # Nest
   ```

## Docker Compose

From the repo root (API-oriented path; see `docker-compose.yml`):

```bash
docker compose up -d --build
```

Prefer this for a **running Nest API**. The Vercel API project builds `dist/`
but does not yet expose a serverless handler.

## Production builds (local)

```bash
pnpm --filter @worksight/common build
pnpm --filter @worksight/web build
pnpm --filter @worksight/api build
pnpm --filter @worksight/docs build
```

Or `pnpm build` via Turbo.

## Vercel (hosted)

WorkSight uses **three** Vercel projects with per-app Root Directories — not a
single root `vercel.json`:

| Project          | Root Directory |
| ---------------- | -------------- |
| `worksight`      | `apps/web`     |
| `worksight-api`  | `apps/api`     |
| `worksight-docs` | `apps/docs`    |

Details: [Deployment](./deployment.md) and repo
[`doc/DEPLOYMENT.md`](https://github.com/4sightorg/worksight/blob/feat/mvp-stabilize/doc/DEPLOYMENT.md).

## Troubleshooting

**Port 3000 in use**

```bash
PORT=3001 pnpm --filter @worksight/web dev
# or free the port, then retry
```

**Empty / stale `@worksight/common`**

```bash
pnpm --filter @worksight/common build
```

**Reinstall**

```bash
pnpm clean
rm -rf node_modules
pnpm install
```

Do **not** delete `pnpm-lock.yaml` unless you intend to regenerate the lockfile.

## Getting help

- [GitHub issues](https://github.com/4sightorg/worksight/issues)
- [MVP plan](https://github.com/4sightorg/worksight/blob/feat/mvp-stabilize/docs/mvp/README.md)
