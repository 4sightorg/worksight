# Installation

This guide provides detailed instructions for installing and setting up
WorkSight in different environments.

## Development Environment

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: Version 20.0.0 or higher
- **pnpm**: Version 8.0.0 or higher (recommended package manager)
- **Git**: For version control

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Memory**: 502MB RAM minimum (1GB recommended)
- **Storage**: 256MB  free disk space

### Step-by-Step Installation

#### Docker Installation

```bash
docker run -rm -it ghcr.io:4sight/worksight/web:latest
```

#### Docker Compose Installation

```bash
docker compose up -d
```

#### Native Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/4sightorg/worksight.git
   cd worksight
   ```

2. **Install Dependencies**

   ```bash
   # Install pnpm if you haven't already
   npm install -g pnpm

   # Install project dependencies
   pnpm install
   ```

3. **Environment Configuration**

   ```bash
   # Copy environment template
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**

   Edit `.env.local` with your configuration:

   ```env
   # Database
   DATABASE_URL="your-database-url"

   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

5. **Database Setup**

   ```bash
   # Run database migrations
   pnpm db:migrate

   # Seed initial data (optional)
   pnpm db:seed
   ```

6. **Start Development Server**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Production Deployment

### Using Vercel (Recommended)

1. **Deploy to Vercel**

   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   vercel
   ```

2. **Configure Environment Variables**

   Set the following in your Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Using Docker

1. **Build Docker Image**

   ```bash
   docker build -t worksight .
   ```

2. **Run Container**

   ```bash
   docker run -p 3000:3000 --env-file .env.local worksight
   ```

### Manual Deployment

1. **Build for Production**

   ```bash
   pnpm build
   ```

2. **Start Production Server**

   ```bash
   pnpm start
   ```

## Database Setup

### Supabase (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Run the database migrations provided in `/supabase/migrations`

### Self-hosted PostgreSQL

1. Install PostgreSQL 14+
2. Create a new database
3. Run the SQL schema from `/database/schema.sql`

## Troubleshooting

### Common Issues

**Port 3000 already in use**

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

**Database connection errors**

- Verify your `DATABASE_URL` is correct
- Check if your database server is running
- Ensure network connectivity to your database

**Build errors**

```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Getting Help

If you encounter issues:

1. Check the [troubleshooting section](../api/overview.md)
2. Search existing
   [GitHub issues](https://github.com/4sightorg/worksight/issues)
3. Create a new issue with detailed information

## Next Steps

After installation:

1. [Configure your application](./configuration.md)
2. Explore the [Survey System](./survey-system.md)
3. Set up [Admin Dashboard](./admin-dashboard.md)
