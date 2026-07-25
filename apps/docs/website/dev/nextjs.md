# Next.js (web app)

The web package is **`@worksight/web`** under `apps/web`, using the **App
Router** on **Next.js 15** (React 19).

## Layout

```text
apps/web/src/
├── app/            # App Router routes
├── components/     # UI
├── lib/            # helpers (incl. MVP common bridges when wired)
├── auth/           # auth helpers
└── __tests__/      # Jest tests (excluded from app type-check)
```

## Data for MVP

Dashboard / admin / tasks views should consume `@worksight/common` fixtures via
a thin bridge (e.g. `src/lib/mvp-data.ts` on the wire-web workstream). That is
**not** the same as calling Nest or Supabase for those lists yet.

## Dev / build

```bash
pnpm --filter @worksight/common build
pnpm --filter @worksight/web dev
pnpm --filter @worksight/web build
pnpm --filter @worksight/web type-check
```

Or from the repo root: `pnpm dev:web` / `pnpm build:web`.

## Deploy

Vercel project **`worksight`**, Root Directory **`apps/web`**, config
`apps/web/vercel.json`. See [Deployment](/guide/deployment).

## Notes

- Prefer App Router (`app/`), not the legacy `pages/` router.
- Backend HTTP for the monorepo lives in Nest (`apps/api`), not Next `pages/api`
  route handlers as the primary API.
