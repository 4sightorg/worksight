# Getting Started with WorkSight

This guide will help you set up WorkSight locally and understand its core features.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **pnpm** (version 8 or higher)
- **Git** for version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/4sightorg/worksight.git
cd worksight
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 3. Environment Setup

```bash
# Copy the example environment file
cp apps/web/env.example apps/web/.env.local
```

Edit the `.env.local` file with your configuration:

```env
# Database
DATABASE_URL="your-database-url"

# Authentication (Supabase)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"
```

### 4. Start Development

```bash
# Start all applications in development mode
pnpm dev

# Or start specific applications
pnpm dev --filter=@worksight/web
pnpm dev --filter=@worksight/docs
```

Your applications will be available at:

- **Web App:** [http://localhost:3000](http://localhost:3000)
- **Documentation:** [http://localhost:5173](http://localhost:5173)

## Project Structure

```sh
worksight/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── src/
│   │   │   ├── app/         # App router pages
│   │   │   ├── components/  # React components
│   │   │   ├── lib/         # Utility functions
│   │   │   └── styles/      # Global styles
│   │   └── public/          # Static assets
│   └── docs/                # VitePress documentation
│       ├── guide/           # User guides
│       ├── api/             # API documentation
│       └── legal/           # Legal documents
├── packages/                # Shared packages (future)
├── turbo.json              # Turbo configuration
└── package.json            # Root package.json
```

## Key Features

### 🎯 Burnout Assessment

WorkSight provides a comprehensive 25-question assessment covering four key dimensions:

1. **Workload & Job Demands** (6 questions)
2. **Work-Life Balance & Recovery** (5 questions)
3. **Social Support & Autonomy** (5 questions)
4. **Personal Accomplishment & Engagement** (9 questions)

### 📊 Real-time Analytics

- Dimensional scoring with evidence-based thresholds
- Risk level categorization (Low, Moderate, High, Severe)
- Personalized recommendations
- Historical trend analysis

### 🛡️ Privacy-First Design

- GDPR and CCPA compliant
- Anonymous aggregated reporting
- Secure authentication
- End-to-end encryption

## Development Workflow

### Building

```bash
# Build all applications
pnpm build

# Build specific application
pnpm build --filter=@worksight/web
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific application
pnpm test --filter=@worksight/web
```

### Linting and Formatting

```bash
# Lint all code
pnpm lint

# Format all code
pnpm format
```

### Type Checking

```bash
# Type check all applications
pnpm type-check
```

## Next Steps

- [Survey System Guide](/guide/survey-system) - Learn about the assessment tool
- [Admin Dashboard](/guide/admin-dashboard) - Explore admin features
- [API Reference](/api/overview) - Integration documentation
- [Contributing](/guide/contributing) - How to contribute to the project

## Need Help?

- 📧 **Support:** [support@worksight.app](mailto:support@worksight.app)
- 🐛 **Issues:** [GitHub Issues](https://github.com/4sightorg/worksight/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/4sightorg/worksight/discussions)
