# User Management (API)

MVP Nest routes for employees and teams. All data comes from `@worksight/common`
fixtures (`EmployeeProfile`, `Team`).

## List employees

```http
GET /users
```

Returns `EmployeeProfile[]` from the shared fixtures.

```bash
curl http://localhost:3123/users
```

## Get one employee

```http
GET /users/:id
```

Returns a single `EmployeeProfile`, or **404** when the id is not in fixtures.

## Employee stats

```http
GET /users/stats
```

Aggregate counts (totals, roles, departments) derived from the same fixture set.

## Teams

```http
GET /teams
GET /teams/:id
```

Returns `Team[]` / one `Team` from `@worksight/common`.

## Shape source of truth

Prefer TypeScript types from `@worksight/common/types` over copy-pasted
interfaces in docs. The Nest controllers/services map lookup helpers from
`@worksight/common/utils` onto those types.

## Not implemented

- Create / update / delete users
- Invitations, suspension, password reset via this API
- Pagination query params (`page`, `limit`) on `/users`
- API-key `Authorization` headers
- Persistence in Supabase

For tasks tied to employees, see [API overview](./overview.md) (`/tasks`,
`/activities`).
