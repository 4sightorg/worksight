# Getting Started

Welcome to WorkSight! This guide will help you get up and running quickly.

## What is WorkSight?

WorkSight is a comprehensive wellness and task management platform designed to help organizations monitor employee well-being while managing productivity effectively.

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account (for online features)
- Modern web browser

### Installation

1. Clone the repository:

```bash
git clone https://github.com/4sightorg/worksight.git
cd worksight
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp apps/web/.env.example apps/web/.env.local
```

4. Configure your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:

```bash
pnpm run dev
```

### First Login

WorkSight supports both online and offline modes. For testing, you can use these credentials:

**Executives:**

- Email: `sjc.71415@gmail.com`
- Password: `testuser`

**Employees:**

- Email: `jane.doe@worksight.com`
- Password: `testuser`

**Admin:**

- Email: `admin@worksight.com`
- Password: `testuser`

## Core Features

### 🏠 Dashboard

Role-based dashboards showing:

- Burnout level tracking
- Task summaries
- Team analytics (for managers/executives)
- Quick actions

### 📋 Task Management

- Kanban board with drag-and-drop
- Table view with inline editing
- Priority and status management
- Story point estimation

### 🧘 Wellness Tracking

- Burnout assessment surveys
- Progress tracking over time
- Personalized recommendations
- Risk level monitoring

### ⚙️ Settings

- User preferences
- Notification settings
- Theme customization
- Admin controls

## Next Steps

- [Learn about the Survey System](./survey-system)
- [Explore Task Management](./task-management)
- [Set up Admin Dashboard](./admin-dashboard)
- [Configure Reporting](./reporting)
