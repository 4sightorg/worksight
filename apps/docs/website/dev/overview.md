# Developer overview

Contributor-oriented notes for the WorkSight monorepo.

## Packages

| Package             | Path              | Role                     |
| ------------------- | ----------------- | ------------------------ |
| `@worksight/web`    | `apps/web`        | Next.js 15 UI            |
| `@worksight/api`    | `apps/api`        | NestJS API               |
| `@worksight/docs`   | `apps/docs`       | VitePress                |
| `@worksight/common` | `packages/common` | Types, fixtures, lookups |
| `@worksight/assets` | `packages/assets` | Shared assets            |

## Commands

```bash
pnpm install
pnpm --filter @worksight/common build
pnpm type-check
pnpm lint
pnpm --filter @worksight/web dev
PORT=3123 pnpm --filter @worksight/api dev
pnpm --filter @worksight/docs build
```

## Docs map

- Stack notes: [Next.js](./nextjs.md), [VitePress](./vitepress.md),
  [Jest](./jest.md), [Supabase](./supabase.md)
- API: [Overview](./api/overview.md), [Users](./api/user-management.md),
  [Auth status](./api/authentication.md)
- Product/feature drafts under `/features/*` may still describe aspirational UX
  — prefer guide + API pages for MVP truth.

## Handoffs

Repo: `docs/mvp/README.md` and `docs/handoffs/` (GitHub issues #14–#20).
