# Guide overview

WorkSight documentation for operators and contributors.

## Start here

1. [Introduction](./introduction.md) — what the monorepo is
2. [Getting started](./getting-started.md) — local run
3. [Installation](./installation.md) — native + Docker
4. [Configuration](./configuration.md) — real env vars
5. [Deployment](./deployment.md) — three Vercel projects + Docker API

## MVP reminders

- Data for the current slice: **`@worksight/common` fixtures**
- Packages: `@worksight/web`, `@worksight/api`, `@worksight/docs`,
  `@worksight/common`
- Stack: Next.js 15 + NestJS + pnpm/Turbo
- API on Vercel is not serverless yet — use Docker for a live API

Developer API notes live under [Dev → API overview](/dev/api/overview).
