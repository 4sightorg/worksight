# Supabase (web, optional)

Supabase is **optional** for `@worksight/web` auth / online mode. MVP dashboard
and Nest list data come from **`@worksight/common` fixtures**, not from Supabase
tables.

## When you need it

- `NEXT_PUBLIC_IS_OFFLINE=false` (and matching `IS_OFFLINE`)
- A Supabase project URL + publishable (anon) key

For fixture / offline demos, leave offline mode on and skip Supabase entirely
(`apps/web/env.example`).

## Env vars (this repo)

```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
NEXT_PUBLIC_IS_OFFLINE=false
IS_OFFLINE=false
```

Client helpers live under `apps/web` (e.g. `src/lib/supabase.ts`,
`src/utils/supabase/*`). Prefer those over inventing a new root client.

## Not true for MVP Nest routes

- Nest `/users`, `/teams`, `/tasks`, `/activities` do **not** read Supabase.
- Do not document service-role keys or table schemas as required for the MVP API
  slice.

## Further reading

Official docs: <https://supabase.com/docs>
