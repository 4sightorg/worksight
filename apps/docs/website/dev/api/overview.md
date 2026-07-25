# API Overview

The NestJS app in `apps/api` (`@worksight/api`) exposes HTTP endpoints for the
MVP. Responses use shapes from `@worksight/common` and are **fixture-backed** —
not loaded from Supabase or another database yet.

## Base URL

| Environment | URL                                                                         |
| ----------- | --------------------------------------------------------------------------- |
| Local       | `http://localhost:3123` (or your `PORT`)                                    |
| Docker      | per `docker-compose.yml` / nginx                                            |
| Vercel      | project `worksight-api` builds `dist/` only — **no serverless handler yet** |

Default Nest listen port is `process.env.PORT ?? 3000`. Prefer a non-3000 port
when `@worksight/web` is already running.

## Authentication

MVP fixture routes do **not** require API keys. Do not assume production API-key
auth, rate-limit headers, or hosted `api.worksight.com` SDKs — those are not
shipped.

Web auth (optional Supabase) is separate from this Nest surface.

## Endpoints (MVP)

### Health

| Method | Path      | Notes        |
| ------ | --------- | ------------ |
| `GET`  | `/`       | App root     |
| `GET`  | `/ping`   | Liveness     |
| `GET`  | `/health` | Health check |

### Users & teams

| Method | Path           | Returns                         |
| ------ | -------------- | ------------------------------- |
| `GET`  | `/users`       | `EmployeeProfile[]` fixtures    |
| `GET`  | `/users/stats` | Aggregate role/department stats |
| `GET`  | `/users/:id`   | One profile (404 if missing)    |
| `GET`  | `/teams`       | `Team[]`                        |
| `GET`  | `/teams/:id`   | One team                        |

### Tasks & activities

| Method | Path                       | Returns                                 |
| ------ | -------------------------- | --------------------------------------- |
| `GET`  | `/tasks`                   | `Assignment[]` (`?employee_id=` filter) |
| `GET`  | `/tasks/:id`               | One assignment                          |
| `GET`  | `/tasks/stats/:employeeId` | Per-employee task / balance stats       |
| `GET`  | `/activities`              | `Activity[]` (optional `?employee_id=`) |

## Quick smoke test

```bash
pnpm --filter @worksight/common build
pnpm --filter @worksight/api build
PORT=3123 node apps/api/dist/main.js

curl -s http://localhost:3123/users | head
curl -s http://localhost:3123/tasks
curl -s http://localhost:3123/health
```

## Not available yet

- POST/PUT/DELETE mutations for users/tasks
- Survey / burnout / attendance HTTP modules (types may exist in common)
- Supabase-backed persistence for these routes
- Serverless Vercel entrypoint
- Official SDKs, webhooks, or Postman collections at `api.worksight.com`

## Related

- [User management](./user-management.md) — users/teams detail
- [Authentication](./authentication.md) — web/API auth status
- Repo deployment notes: [Deployment guide](/guide/deployment)
