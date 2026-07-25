# Authentication

## Nest API (`@worksight/api`)

MVP fixture routes (`/users`, `/teams`, `/tasks`, `/activities`, health) do
**not** enforce API keys or Bearer tokens. There is no Admin “API Keys” UI, no
`ws_live_…` key format, and no hosted `api.worksight.com` auth gateway in this
repo.

When you harden the API later, document the real mechanism here — do not assume
the fictional key model from older drafts.

## Web app (`@worksight/web`)

Optional **Supabase Auth** when offline mode is off:

```bash
NEXT_PUBLIC_IS_OFFLINE=false
NEXT_PUBLIC_SUPABASE_URL=…
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=…
```

For local / fixture demos:

```bash
NEXT_PUBLIC_IS_OFFLINE=true
IS_OFFLINE=true
```

See `apps/web/env.example` and [Configuration](/guide/configuration).

## Related

- [API overview](./overview.md)
- [User management](./user-management.md)
