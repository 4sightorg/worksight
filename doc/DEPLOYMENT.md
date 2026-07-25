# 🚀 WorkSight Deployment Guide

WorkSight is a **Turborepo + pnpm workspace** monorepo. There is no single
deploy artifact — each app ships on the platform that fits it:

| App         | Package           | Vercel project   | Root Directory | Config source of truth  |
| ----------- | ----------------- | ---------------- | -------------- | ----------------------- |
| `apps/web`  | `@worksight/web`  | `worksight`      | `apps/web`     | `apps/web/vercel.json`  |
| `apps/api`  | `@worksight/api`  | `worksight-api`  | `apps/api`     | `apps/api/vercel.json`  |
| `apps/docs` | `@worksight/docs` | `worksight-docs` | `apps/docs`    | `apps/docs/vercel.json` |

All three Vercel projects are connected to the same GitHub repository
(`4sightorg/worksight`) with production branch **`canary`**, share
`pnpm install --frozen-lockfile`, and have **Include source files outside of the
Root Directory** plus **skip unaffected projects** enabled. The API can
alternatively run under Docker (`docker-compose.yml` + `nginx/`).

> ⚠️ **What repo config can and cannot do.** A `vercel.json` file only
> configures build/routing behavior. It **cannot** create Vercel projects, set a
> project's **Root Directory**, add environment variables to the dashboard, or
> link a Git repo. Those are dashboard/CLI actions — they are called out
> explicitly under
> [Vercel dashboard setup](#vercel-dashboard-setup-one-time-per-project).

## How Vercel resolves config in this monorepo

Vercel reads **exactly one** `vercel.json` per project: the one located at the
project's **Root Directory** (a dashboard setting). It does **not** merge a root
`vercel.json` with a nested one. Consequences:

- One Vercel project builds one output, so web, api, and docs need **separate**
  projects. A single root `vercel.json` cannot govern all three.
- "Centralized" here means **uniform, per-app configs** committed next to each
  app, all using the same workspace-level primitives — not one shared file.
- Each project's Root Directory therefore points at its app, and that app's
  `vercel.json` is the only file Vercel loads for it.

Every app config uses the same primitives, so behavior is consistent:

- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm --filter @worksight/<app> build` (pnpm runs the workspace build
  script; Turbo's `dependsOn: ["^build"]` graph builds workspace dependencies
  such as `@worksight/common` and `@worksight/assets` first).
- Output: framework default for Next.js; explicit for docs (`.vitepress/dist`)
  and api (`dist`).

Secrets and environment values live in the **dashboard**, not in `vercel.json`.

## Vercel dashboard setup (one-time, per project)

These steps **must** be done in the Vercel dashboard or CLI — no repo file can
perform them.

### Web project (`@worksight/web`)

1. Import the `4sightorg/worksight` repo as a new Vercel project.
2. **Root Directory → `apps/web`**, so Vercel loads `apps/web/vercel.json`.
3. Leave **"Include source files outside of the Root Directory in the Build
   Step"** enabled so the shared `packages/*` and the workspace lockfile are
   available.
4. Framework Preset / Install / Build come from `apps/web/vercel.json`; do not
   override them in the dashboard.
5. Add environment variables per environment (see
   [Environment Variables](#environment-variables)). Nothing sensitive is
   committed to `vercel.json`.

### Docs project (`@worksight/docs`) — optional on Vercel

1. Create a **separate** Vercel project from the same repo.
2. **Root Directory → `apps/docs`** so Vercel loads `apps/docs/vercel.json`.
3. Keep "Include source files outside of the Root Directory" enabled.

Docs are otherwise published to GitHub Pages; the Vercel path is optional.

### API project (`@worksight/api`)

`apps/api/vercel.json` now uses zero-config build settings (`pnpm --filter`
build into `dist`) instead of the legacy `builds`/`routes` block, which silently
disabled Vercel's install and build steps.

**This is still not a functioning serverless API.** `main.ts` calls
`app.listen()` rather than exporting a handler, so a Vercel deployment produces
no invocable function. Wiring it properly requires adding a serverless entry
(e.g. `api/index.ts` exporting the bootstrapped Nest app). Until then, deploy
the API with Docker:

```bash
docker compose up -d --build
```

## Environment Variables

### Required for Production

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="WorkSight"
NEXT_PUBLIC_APP_DESCRIPTION="Employee Well-being Analytics Platform"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"

# Supabase (if using online auth)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-key"

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"
NEXT_PUBLIC_GOOGLE_ANALYTICS="your-ga-id"
```

### Optional for Offline Mode

```bash
NEXT_PUBLIC_IS_OFFLINE="true"
```

## Vercel Configuration

`apps/web/vercel.json` (loaded by the `worksight` project) declares:

- `framework: nextjs` — output directory left to the framework default
- `installCommand: pnpm install --frozen-lockfile`
- `buildCommand: pnpm --filter @worksight/web build`
- `NEXT_TELEMETRY_DISABLED=1` for the build step

`apps/api/vercel.json` and `apps/docs/vercel.json` mirror the same shape with
their own filter and output directory. No environment values are committed —
they are set per environment in the dashboard.

Security headers, redirects, and CORS are **not** currently configured in
`vercel.json`; add them here if/when needed rather than assuming they exist.

## Code Quality Checks

Before deploying, run quality checks:

```bash
# Full quality check
pnpm run quality

# Individual checks
pnpm run type-check      # TypeScript validation
pnpm run lint:strict     # ESLint with zero warnings
pnpm run prettier:check  # Code formatting
pnpm run stylelint:check # CSS/SCSS linting
```

## Automated Deployment

### GitHub Actions

- **CI/CD pipeline** runs on every push/PR
- **Code quality gates** prevent bad code from deploying
- **Automatic Vercel deployment** for production and previews

### Quality Gates

1. ✅ TypeScript compilation
2. ✅ ESLint (zero warnings)
3. ✅ Prettier formatting
4. ✅ Stylelint CSS validation
5. ✅ Successful build

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size before deployment
pnpm run analyze
```

### Build Optimization

- Tree-shaking enabled
- Automatic code splitting
- Image optimization
- Static generation where possible

## Monitoring & Analytics

### Vercel Analytics

Automatically enabled with environment variable:

```bash
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-id"
```

### Web Vitals

Built-in Core Web Vitals monitoring:

- Largest Contentful Paint (LCP)
- First Input Delay (FID) / Interaction to Next Paint (INP)
- Cumulative Layout Shift (CLS)

### Error Monitoring

Error boundaries implemented for graceful error handling.

## Domain Configuration

### Custom Domain

1. Add domain in Vercel dashboard
2. Configure DNS records
3. Update environment variables with new domain

### SSL Certificate

Automatically provisioned by Vercel for all domains.

## Security

### Headers

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: restrictive

### Environment Security

- Never commit `.env.local` files
- Use Vercel environment variables for secrets
- Rotate API keys regularly

## Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   # Check code quality locally
   pnpm run quality
   ```

2. **Supabase Build Errors**
   - If you see "supabaseUrl is required" during build:
   - Create `.env.local` with placeholder values:

     ```bash
     NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
     NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=placeholder-key
     ```

   - Or disable Supabase features during build by setting:

     ```bash
     NEXT_PUBLIC_IS_OFFLINE=true
     ```

3. **Environment Variables**
   - Ensure all required variables are set in Vercel
   - Check variable names match exactly

4. **Performance Issues**

   ```bash
   # Analyze bundle size
   pnpm run analyze
   ```

5. **CI/CD Pipeline Issues**
   - GitHub Actions workflow uses `pnpm/action-setup@v4` for proper pnpm
     installation
   - Deployment jobs are commented out until Vercel secrets are configured
   - To enable automatic deployment, configure these secrets in GitHub:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

### Enabling Automatic Deployment

To enable automatic Vercel deployment in GitHub Actions:

1. **Get Vercel Credentials**:

   ```bash
   # Install Vercel CLI and login
   pnpm add -g vercel
   vercel login

   # Link project and get credentials
   vercel link
   ```

2. **Configure GitHub Secrets**:
   - Go to GitHub Repository → Settings → Secrets and Variables → Actions
   - Add the required secrets (get these from Vercel dashboard or CLI)

3. **Uncomment Deployment Jobs**:
   - Edit `.github/workflows/ci.yml`
   - Uncomment the `deploy-preview` and `deploy-production` jobs

### Support

- Vercel Documentation: <https://vercel.com/docs>
- Next.js Documentation: <https://nextjs.org/docs>

---

## Deployment Checklist

- [ ] Code quality checks pass
- [ ] Environment variables configured
- [ ] Domain configured (if custom)
- [ ] Analytics setup
- [ ] Error monitoring enabled
- [ ] Performance optimized
- [ ] Security headers verified

**Your WorkSight application is ready for production! 🎉**
