# WorkSight Monorepo

[![CI](https://github.com/4sightorg/worksight/workflows/CI/badge.svg)](https://github.com/4sightorg/worksight/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

WorkSight is an employee well-being analytics platform built with Next.js and Supabase. This monorepo contains the web application, documentation, and shared packages.

## 🏗️ Project Structure

```text
worksight/
├── apps/
│   ├── web/          # Next.js web application
│   └── docs/         # VitePress documentation
├── packages/         # Shared packages (future)
└── .github/          # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18+
- **pnpm**: v8+ (recommended package manager)
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone https://github.com/4sightorg/worksight.git
cd worksight

# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/env.example apps/web/.env.local
# Edit apps/web/.env.local with your Supabase credentials
```

### Development

```bash
# Start the web application
pnpm dev:web

# Start the documentation site
pnpm dev:docs

# Start both applications
pnpm dev
```

Open:

- **Web App**: <http://localhost:3000>
- **Documentation**: <http://localhost:5173>

## 📦 Available Scripts

### Root Scripts

```bash
# Development
pnpm dev              # Start all applications
pnpm dev:web          # Start web app only
pnpm dev:docs         # Start docs only

# Building
pnpm build            # Build all applications
pnpm build:web        # Build web app only
pnpm build:docs       # Build docs only

# Testing
pnpm test             # Run all tests
pnpm test:web         # Run web app tests
pnpm lint             # Lint all code
pnpm type-check       # TypeScript type checking

# Utilities
pnpm clean            # Clean all build outputs
pnpm format           # Format code with Prettier
```

### Application-Specific Scripts

```bash
# Web application (apps/web)
cd apps/web
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode

# Documentation (apps/docs)
cd apps/docs
pnpm dev              # Start dev server
pnpm build            # Build static site
pnpm preview          # Preview production build
```

## 🛠️ Technology Stack

### Web Application (`apps/web`)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Server Components + Client Components
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

### Documentation (`apps/docs`)

- **Framework**: VitePress
- **Language**: TypeScript
- **Styling**: Default VitePress theme
- **Deployment**: GitHub Pages

### Development Tools

- **Package Manager**: pnpm with workspaces
- **Monorepo**: Turbo for build orchestration
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Git Hooks**: Husky (optional)
- **CI/CD**: GitHub Actions

## 🌍 Deployment

### Production Environments

- **Web Application**: [worksight.vercel.app](https://worksight.vercel.app)
- **Documentation**: [worksight.github.io](https://worksight.github.io)

### Deployment Process

1. **Automatic Deployment**:
   - Push to `main` branch triggers production deployment
   - Pull requests create preview deployments (web app only)

2. **Manual Deployment**:

   ```bash
   # Trigger GitHub Actions workflow
   gh workflow run deploy.yml
   ```

See [Deployment Guide](./apps/docs/guide/deployment.md) for detailed instructions.

## 🧪 Testing

### Running Tests

```bash
# All tests
pnpm test

# Web application tests
pnpm test:web

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Test Structure

```
src/__tests__/
├── components/       # Component tests
├── integration/      # Integration tests
└── schemas/         # Schema validation tests
```

## 📁 Project Architecture

### Web Application

```
apps/web/src/
├── app/             # Next.js App Router pages
├── components/      # Reusable UI components
├── lib/            # Utility functions
├── hooks/          # Custom React hooks
├── types/          # TypeScript definitions
├── styles/         # Global styles
└── __tests__/      # Test files
```

### Key Features

- **Dashboard**: Employee analytics and insights
- **Survey Builder**: Create and manage employee surveys
- **User Management**: Admin panel for user administration
- **Authentication**: Secure login with multiple providers
- **Reports**: Generate and view analytics reports

## 🔧 Configuration

### Environment Variables

Web application requires these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_NAME=WorkSight
NEXT_PUBLIC_APP_DESCRIPTION=Employee Well-being Analytics Platform
```

### Supabase Setup

1. Create a new Supabase project
2. Set up authentication providers
3. Configure database tables and policies
4. Add environment variables to your deployment

## 🤝 Contributing

### Development Workflow

1. **Fork & Clone**: Fork the repository and clone locally
2. **Branch**: Create a feature branch from `main`
3. **Develop**: Make changes and test locally
4. **Test**: Ensure all tests pass
5. **Commit**: Use conventional commit messages
6. **Pull Request**: Submit PR with clear description

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Prettier**: Auto-format on save
- **Testing**: Write tests for new features
- **Documentation**: Update docs for user-facing changes

### Commit Convention

```
feat: add new survey analytics dashboard
fix: resolve authentication redirect issue
docs: update deployment guide
chore: upgrade dependencies
```

## 📝 Documentation

- **User Guide**: [Apps Documentation](./apps/docs/)
- **API Reference**: [API Documentation](./apps/docs/api/)
- **Deployment**: [Deployment Guide](./apps/docs/guide/deployment.md)
- **Contributing**: [Contributing Guide](./apps/docs/guide/contributing.md)

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:

   ```bash
   # Clear cache and reinstall
   pnpm clean
   rm -rf node_modules
   pnpm install
   ```

2. **Type Errors**:

   ```bash
   # Run type checking
   pnpm type-check
   ```

3. **Test Failures**:

   ```bash
   # Run tests with verbose output
   pnpm test --verbose
   ```

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/4sightorg/worksight/issues)
- **Discussions**: [GitHub Discussions](https://github.com/4sightorg/worksight/discussions)
- **Documentation**: [Project Documentation](./apps/docs/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [VitePress](https://vitepress.dev/) - Documentation framework
- [Turbo](https://turbo.build/) - Monorepo build system

---

**WorkSight** - Empowering organizations with employee well-being analytics.
