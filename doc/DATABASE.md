# Database (Neon / Postgres)

The Nest API serves `@worksight/common` fixtures by default. Set `DATABASE_URL`
to switch list/detail/stats routes to Postgres (Neon or local).

## Local Postgres

```bash
docker compose up -d postgres
export DATABASE_URL=postgresql://worksight:worksight@localhost:5432/worksight
pnpm --filter @worksight/common build
pnpm --filter @worksight/api db:push
pnpm --filter @worksight/api db:seed
DATABASE_URL="$DATABASE_URL" pnpm --filter @worksight/api start:prod
curl -s localhost:3001/health
# {"status":"ok","dataBackend":"postgres",...}
```

## Neon

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string into `apps/api/.env` as `DATABASE_URL`.
3. Run `db:push` then `db:seed` (same commands as above).
4. Deploy the API with that env var (Docker / Fly / Railway — not Vercel
   serverless Nest today).

## Scripts (`@worksight/api`)

| Script        | Purpose                                      |
| ------------- | -------------------------------------------- |
| `db:generate` | Generate SQL migrations from Drizzle schema  |
| `db:push`     | Push schema to the database (dev-friendly)   |
| `db:migrate`  | Apply generated migrations                   |
| `db:seed`     | Load fixtures from `@worksight/common`       |
| `db:studio`   | Open Drizzle Studio                          |

IDs are stored as `text` so fixture values that are not RFC UUIDs still seed.
