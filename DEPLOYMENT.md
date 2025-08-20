# 🚀 WorkSight Deployment Guide

## Quick Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/4sightorg/worksight)

### Manual Deployment

1. **Install Vercel CLI**

   ```bash
   pnpm add -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy Preview**

   ```bash
   pnpm run deploy:preview
   ```

4. **Deploy Production**

   ```bash
   pnpm run deploy
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

The `vercel.json` file includes:

- **Optimized builds** with Next.js
- **Security headers** for production
- **API route configuration**
- **Redirects and rewrites**
- **CORS headers** for API endpoints

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

2. **Environment Variables**
   - Ensure all required variables are set in Vercel
   - Check variable names match exactly

3. **Performance Issues**

   ```bash
   # Analyze bundle size
   pnpm run analyze
   ```

4. **CI/CD Pipeline Issues**
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
