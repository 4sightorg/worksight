# Configuration

Configure WorkSight with the env vars and packages that actually exist in the
repo.

## Web (`apps/web`)

Copy the template:

```bash
cp apps/web/env.example apps/web/.env.local
```

### Supported variables

From `apps/web/env.example`:

```bash
# Force offline mode (disables signup / online-only features)
NEXT_PUBLIC_IS_OFFLINE=false
IS_OFFLINE=false

# Optional when offline mode is enabled
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
```

Additional app branding vars may be set in Vercel for production (see
[Deployment](./deployment.md)):

```bash
NEXT_PUBLIC_APP_NAME=WorkSight
NEXT_PUBLIC_APP_DESCRIPTION=Employee Well-being Analytics Platform
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

There is **no** NextAuth config, root `DATABASE_URL`, `pnpm db:migrate`, or
`pnpm config:validate` script in this monorepo.

## API (`apps/api`)

Nest boots with `app.listen(process.env.PORT ?? 3000)`. Set `PORT` when web
already occupies 3000:

```bash
PORT=3123 pnpm --filter @worksight/api dev
```

MVP endpoints read **`@worksight/common` fixtures** in-process. No Supabase
service-role key is required for those routes today.

## Docs (`apps/docs`)

VitePress uses `VITE_HOSTNAME` / `VITE_BASE` when set (see
`apps/docs/.vitepress/config.mts`). Defaults work for local `pnpm dev:docs`.

## Shared package

Consumers resolve `@worksight/common` from the workspace. Build it before
type-checking or running API/web against dist:

```bash
pnpm --filter @worksight/common build
```

## Vercel

Env vars are **dashboard-managed per project**. Do not commit secrets into
`vercel.json`. Three projects: `worksight`, `worksight-api`, `worksight-docs`
with Root Directories `apps/web`, `apps/api`, `apps/docs`.
