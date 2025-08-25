# Deployment Guide

This guide covers how to deploy WorkSight to production using Vercel for the web application and GitHub Pages for documentation.

## Prerequisites

Before deploying, ensure you have:

- **GitHub Repository**: Your code pushed to GitHub
- **Vercel Account**: Connected to your GitHub account
- **Supabase Project**: For database and authentication
- **Domain Names** (optional): Custom domains for your applications

## 🌐 Web Application Deployment (Vercel)

### 1. Vercel Setup

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the root directory

2. **Configure Build Settings**:

   ```bash
   # Build Command
   cd ../.. && pnpm build --filter=@worksight/web
   
   # Output Directory
   apps/web/.next
   
   # Install Command
   pnpm install
   ```

3. **Environment Variables**:

   Add these in Vercel Dashboard → Settings → Environment Variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_APP_NAME=WorkSight
   NEXT_PUBLIC_APP_DESCRIPTION=Employee Well-being Analytics Platform
   ```

### 2. GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```env
# Vercel Deployment
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## 📚 Documentation Deployment (GitHub Pages)

### 1. GitHub Pages Setup

1. **Repository Settings**:
   - Go to Settings → Pages
   - Source: "GitHub Actions"
   - The workflow will automatically deploy

2. **Custom Domain** (Optional):
   - Add `CNAME` file in `apps/docs/public/`
   - Configure DNS to point to `username.github.io`

### 2. Workflow Configuration

The GitHub Actions workflow automatically:

- Builds VitePress documentation
- Deploys to GitHub Pages
- Available at `https://username.github.io/repository-name`

## 🔄 Continuous Deployment

### Automatic Deployments

Both applications deploy automatically when:

- **Main Branch**: Push to `main` triggers production deployment
- **Pull Requests**: Creates preview deployments (Vercel only)

### Manual Deployments

You can trigger manual deployments:

```bash
# Trigger deployment workflow
gh workflow run deploy.yml

# Or use GitHub UI: Actions → Deploy → Run workflow
```

## 🚀 Deployment Workflow

Our CI/CD pipeline includes:

### 1. Quality Checks (On every PR)

- ESLint and Prettier
- TypeScript type checking
- Unit and integration tests
- Performance audits (Lighthouse)

### 2. Build Verification

- Build both applications
- Upload artifacts for deployment

### 3. Deployment (Main branch only)

- Deploy web app to Vercel
- Deploy docs to GitHub Pages
- Update preview URLs

## 📊 Monitoring & Analytics

### Performance Monitoring

- **Lighthouse CI**: Automated performance audits
- **Bundle Analysis**: Track bundle size changes
- **Core Web Vitals**: Monitor user experience metrics

### Error Monitoring

Consider adding:

- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging
- **Vercel Analytics**: Built-in analytics

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**:

   ```bash
   # Check logs in Vercel dashboard
   # Verify environment variables
   # Test build locally: pnpm build --filter=@worksight/web
   ```

2. **Environment Variables**:

   ```bash
   # Ensure all required vars are set
   # Check naming (NEXT_PUBLIC_ prefix for client-side)
   # Verify values in Vercel dashboard
   ```

3. **Deployment Timeouts**:

   ```bash
   # Optimize build process
   # Check for large dependencies
   # Use Vercel's build cache
   ```

### Debug Commands

```bash
# Test locally
pnpm dev

# Build and test production locally
pnpm build && pnpm start

# Check deployment logs
vercel logs worksight.vercel.app

# Run specific workspace
pnpm dev --filter=@worksight/web
```

## 🌍 Multi-Environment Setup

### Staging Environment

1. **Create staging branch**: `staging`
2. **Separate Vercel project**: `worksight-staging`
3. **Environment-specific secrets**:

   ```env
   STAGING_SUPABASE_URL=staging-supabase-url
   STAGING_SUPABASE_ANON_KEY=staging-key
   ```

### Development Environment

- **Local development**: `pnpm dev`
- **Preview deployments**: Automatic on PRs
- **Feature branches**: Test specific features

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Content/copy review completed
- [ ] Performance benchmarks met

### Post-Deployment

- [ ] Verify application loads correctly
- [ ] Test critical user flows
- [ ] Check analytics/monitoring
- [ ] Verify SSL certificates
- [ ] Test custom domains (if applicable)

### Rollback Plan

If issues occur:

1. **Vercel**: Use dashboard to rollback to previous deployment
2. **GitHub Pages**: Revert commit and re-deploy
3. **Database**: Have migration rollback scripts ready

## 📈 Performance Optimization

### Build Optimization

- **Tree shaking**: Remove unused code
- **Code splitting**: Lazy load components
- **Image optimization**: Use Next.js Image component
- **Bundle analysis**: Monitor bundle size

### Caching Strategy

- **Static assets**: Long-term caching (1 year)
- **API routes**: No cache for dynamic content
- **Pages**: ISR (Incremental Static Regeneration) where applicable

## 🔐 Security Considerations

### Environment Variables

- Never commit secrets to repository
- Use environment-specific variables
- Rotate keys regularly

### Headers

Security headers are configured in `vercel.json`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### HTTPS

- Vercel provides automatic HTTPS
- GitHub Pages supports HTTPS for custom domains
- Redirect HTTP to HTTPS

---

For additional help, check:

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [VitePress Deployment Guide](https://vitepress.dev/guide/deploy)
