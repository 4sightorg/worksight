# Configuration

Learn how to configure WorkSight for your organization's specific needs.

## Environment Configuration

### Core Settings

WorkSight uses environment variables for configuration. Here are the essential
settings:

#### Database Configuration

```env
# Primary database connection
DATABASE_URL="postgresql://username:password@localhost:5432/worksight"

# Database connection pool settings
DATABASE_MAX_CONNECTIONS=20
DATABASE_IDLE_TIMEOUT=30000
```

#### Authentication Settings

```env
# NextAuth configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-256-bit-secret"

# Session settings
SESSION_MAX_AGE=2592000  # 30 days
SESSION_UPDATE_AGE=86400 # 24 hours
```

#### Supabase Configuration

```env
# Supabase project settings
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Email Configuration

```env
# Email provider settings
EMAIL_FROM="noreply@yourcompany.com"
EMAIL_SERVER_HOST="smtp.yourprovider.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-smtp-username"
EMAIL_SERVER_PASSWORD="your-smtp-password"
```

### Optional Integrations

```env
# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"

# Error tracking
SENTRY_DSN="your-sentry-dsn"

# File storage
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="your-bucket"
```

## Application Configuration

### Site Configuration

Edit `src/config/site.ts` to customize your instance:

```typescript
export const siteConfig = {
  name: 'WorkSight',
  description: 'Employee well-being and task management platform',
  url: 'https://your-domain.com',
  ogImage: 'https://your-domain.com/og.png',

  // Company information
  company: {
    name: 'Your Company Name',
    email: 'contact@yourcompany.com',
    phone: '+1 (555) 123-4567',
  },

  // Feature flags
  features: {
    enableSurveys: true,
    enableReporting: true,
    enableTeamManagement: true,
    enableNotifications: true,
  },
};
```

### Survey Configuration

Configure survey settings in `src/config/surveys.ts`:

```typescript
export const surveyConfig = {
  // Default survey intervals
  burnoutAssessment: {
    frequency: 'weekly', // daily, weekly, monthly
    reminderTime: '09:00',
    timezone: 'America/New_York',
  },

  // Survey customization
  questions: {
    useCustomQuestions: false,
    customQuestionsPath: '/surveys/custom.json',
  },

  // Scoring configuration
  scoring: {
    burnoutThreshold: 70,
    warningThreshold: 50,
    scale: '1-5', // 1-5, 1-7, 1-10
  },
};
```

## User Roles and Permissions

### Role Configuration

Define user roles and permissions:

```typescript
// src/config/roles.ts
export const roles = {
  admin: {
    permissions: [
      'user.create',
      'user.update',
      'user.delete',
      'survey.create',
      'survey.update',
      'survey.delete',
      'report.view',
      'report.export',
    ],
  },
  manager: {
    permissions: ['team.view', 'team.manage', 'survey.view', 'report.view'],
  },
  employee: {
    permissions: [
      'task.create',
      'task.update',
      'survey.take',
      'profile.update',
    ],
  },
};
```

## Database Configuration

### Connection Settings

For production deployments, configure database connection pooling:

```typescript
// src/lib/database.ts
export const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // Connection pool
  pool: {
    min: 2,
    max: 20,
    acquire: 30000,
    idle: 10000,
  },

  // SSL configuration for production
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          require: true,
          rejectUnauthorized: false,
        }
      : false,
};
```

## Security Configuration

### Authentication Providers

Configure supported authentication methods:

```typescript
// src/config/auth.ts
export const authProviders = {
  email: {
    enabled: true,
    requireVerification: true,
  },
  google: {
    enabled: true,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  microsoft: {
    enabled: false,
    tenantId: process.env.MICROSOFT_TENANT_ID,
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  },
  saml: {
    enabled: false,
    entityId: process.env.SAML_ENTITY_ID,
    ssoUrl: process.env.SAML_SSO_URL,
    certificate: process.env.SAML_CERTIFICATE,
  },
};
```

### Password Policy

```typescript
export const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // days
  historyCount: 5,
};
```

## Deployment Configuration

### Production Settings

```env
# Environment
NODE_ENV=production

# Security
SECURE_COOKIES=true
CSRF_SECRET="your-csrf-secret"

# Performance
ENABLE_COMPRESSION=true
CACHE_TTL=3600

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
```

### Health Checks

Configure health check endpoints:

```typescript
// src/config/health.ts
export const healthConfig = {
  endpoints: {
    '/health': {
      checks: ['database', 'redis', 'external-apis'],
    },
    '/health/liveness': {
      checks: ['basic'],
    },
    '/health/readiness': {
      checks: ['database', 'migrations'],
    },
  },
};
```

## Advanced Configuration

### Custom Themes

Customize the application theme:

```typescript
// src/config/theme.ts
export const themeConfig = {
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  accentColor: '#f59e0b',

  // Dark mode
  darkMode: {
    enabled: true,
    default: false,
  },

  // Custom CSS
  customStyles: '/styles/custom.css',
};
```

### Notification Configuration

```typescript
// src/config/notifications.ts
export const notificationConfig = {
  email: {
    enabled: true,
    templates: {
      welcome: 'welcome-template',
      surveyReminder: 'survey-reminder-template',
      reportReady: 'report-ready-template',
    },
  },

  push: {
    enabled: false,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
  },

  inApp: {
    enabled: true,
    maxNotifications: 100,
    retentionDays: 30,
  },
};
```

## Validation

After configuration, validate your setup:

```bash
# Check configuration
pnpm config:validate

# Test database connection
pnpm db:test

# Verify email settings
pnpm email:test

# Run health checks
pnpm health:check
```

## Next Steps

- Set up [Survey System](./survey-system.md)
- Configure [Admin Dashboard](./admin-dashboard.md)
- Explore [API Documentation](../api/overview.md)
