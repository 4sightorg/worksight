# Supabase Comprehensive Guide

## What is Supabase?

Supabase is an open-source Firebase alternative providing a hosted Postgres database, authentication, real-time APIs, and storage. It integrates easily with modern web frameworks like Next.js.

---

## 1. Setup

### a. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign up.
2. Create a new project.
3. Note your project URL and anon/public API key (found in Project Settings > API).

### b. Install Supabase Client

```sh
npm install @supabase/supabase-js
```

### c. Configure Environment Variables

Add these to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 2. Initialize Supabase Client

Create a utility file (e.g., `lib/supabase.ts`):

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## 3. Usage Patterns

### a. CRUD Operations

```typescript
// Fetch all tasks
const { data, error } = await supabase.from('tasks').select('*');

// Insert a new task
const { data, error } = await supabase.from('tasks').insert([{ title: 'New Task' }]);

// Update a task
const { data, error } = await supabase.from('tasks').update({ done: true }).eq('id', 1);

// Delete a task
const { data, error } = await supabase.from('tasks').delete().eq('id', 1);
```

### b. Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
 email: 'user@example.com',
 password: 'password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
 email: 'user@example.com',
 password: 'password'
});

// Sign out
const { error } = await supabase.auth.signOut();
```

### c. Real-time Subscriptions

```typescript
supabase
  .channel('public:tasks')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

---

## 4. Security & Best Practices

- **Never expose your service role key** to the frontend.
- Use **Row Level Security (RLS)** in Supabase for fine-grained access control.
- Store sensitive keys in environment variables, not in code.
- Use Supabase Auth for user authentication and session management.
- Validate all user input before writing to the database.

---

## 5. Advanced Usage

- **Storage:** Upload and manage files with Supabase Storage.
- **Edge Functions:** Write serverless functions for custom backend logic.
- **Policies:** Write RLS policies in the Supabase dashboard for secure data access.
- **Server-side Usage:** Use the service key only in API routes or server functions.

---

## 6. Troubleshooting

- **Auth errors:** Double-check your API keys and project URL.
- **RLS issues:** Ensure your policies allow the intended operations for authenticated users.
- **Network issues:** Make sure your environment variables are set and accessible.

---

## 7. Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Next.js Integration Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## Tips

- Store keys in environment variables.
- Use Supabase Auth for secure authentication.
- Use TypeScript for type safety with Supabase responses.
- Regularly review your RLS policies for security.
