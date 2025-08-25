# Supabase Client Usage Guide

This document explains how to use the unified Supabase client utilities in your
Next.js application.

## Client Functions

### `createBrowserClient()`

Use this for client-side components, browser-based operations, and React hooks.

```typescript
import { createBrowserClient } from '@/utils/supabase/client';

// In a React component
export function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createBrowserClient();

    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <div>User: {user?.email}</div>;
}
```

### `createServerClient()`

Use this in Server Components, API routes, and server actions where you need to
access user session.

```typescript
import { createServerClient } from '@/utils/supabase/client';

// In a Server Component
export default async function DashboardPage() {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user-specific data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return <div>Welcome, {profile?.name}</div>;
}

// In an API route
export async function GET() {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch data for the authenticated user
  const { data, error } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', user.id);

  return NextResponse.json({ data });
}
```

### `createServiceRoleClient()`

Use this for admin operations, background jobs, or when you need to bypass RLS
policies.

```typescript
import { createServiceRoleClient } from '@/utils/supabase/client';

// In an admin API route
export async function POST(request: Request) {
  // Verify admin permissions first
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Use service role for admin operations
  const adminSupabase = createServiceRoleClient();

  // This bypasses RLS and can access all data
  const { data, error } = await adminSupabase
    .from('sensitive_admin_data')
    .select('*');

  return NextResponse.json({ data });
}

// In a background job or cron function
export async function cleanupExpiredSessions() {
  const supabase = createServiceRoleClient();

  // Delete expired sessions (admin operation)
  const { error } = await supabase
    .from('user_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString());

  if (error) {
    console.error('Cleanup failed:', error);
  }
}
```

## Migration from Old API

### Before (Old API)

```typescript
// Old inconsistent API
import { getClient } from '@/data/supabase';
import { getServerClient } from '@/utils/supabase/client';

// Client-side
const supabase = getClient();

// Server-side (had issues with cookies)
const serverSupabase = getServerClient();
```

### After (New Unified API)

```typescript
// New unified API
import {
  createBrowserClient,
  createServerClient,
  createServiceRoleClient,
} from '@/utils/supabase/client';

// Client-side
const supabase = createBrowserClient();

// Server-side (proper cookie handling)
const serverSupabase = await createServerClient();

// Admin operations
const adminSupabase = createServiceRoleClient();
```

## Environment Variables

Make sure your `.env.local` file has the correct variables:

```bash
# Required for all clients
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required only for service role operations
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Common Use Cases

### Authentication Flow

```typescript
// Login page
'use client';
import { createBrowserClient } from '@/utils/supabase/client';

export function LoginForm() {
  const handleLogin = async (email: string, password: string) => {
    const supabase = createBrowserClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.push('/dashboard');
    }
  };

  // ... rest of component
}
```

### Protected Server Component

```typescript
// Server Component with auth check
import { createServerClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // User is authenticated, render protected content
  return <div>Protected content for {user.email}</div>;
}
```

### Real-time Subscriptions

```typescript
// Client component with real-time updates
'use client';
import { createBrowserClient } from '@/utils/supabase/client';

export function RealtimeComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const supabase = createBrowserClient();

    // Subscribe to changes
    const subscription = supabase
      .channel('realtime-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          // Handle real-time updates
          setData(current => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <div>{/* Render real-time data */}</div>;
}
```

## Best Practices

1. **Use the right client for the right context**:
   - `createBrowserClient()` for client components
   - `createServerClient()` for server components and API routes
   - `createServiceRoleClient()` only for admin operations

2. **Handle async properly**:
   - `createServerClient()` is async and must be awaited
   - Browser and service role clients are synchronous

3. **Environment variables**:
   - Always use `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `PUBLISHABLE_KEY`)
   - Keep service role key secure and only use server-side

4. **Error handling**:
   - Always check for errors in Supabase responses
   - Handle authentication failures gracefully

5. **TypeScript**:
   - Use proper types for better development experience
   - The clients are fully typed with your database schema

## Troubleshooting

### Common Issues

1. **"Cannot find name 'getClient'"**
   - Update imports to use the new functions
   - Replace `getClient()` with `createBrowserClient()`

2. **Server component auth not working**
   - Make sure you're using `await createServerClient()`
   - Check that middleware is properly configured

3. **Service role operations failing**
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is set
   - Only use service role client for admin operations

4. **Environment variable errors**
   - Check that all required env vars are set
   - Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` not `PUBLISHABLE_KEY`
