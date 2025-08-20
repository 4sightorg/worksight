// Only import server-only modules in server code
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Check if we're in offline mode
const isOffline = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_IS_OFFLINE === 'true' || !navigator.onLine;
  }
  return process.env.IS_OFFLINE === 'true';
};

// Client-side Supabase instance for auth (only if not offline)
const supabase = !isOffline()
  ? createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
    )
  : null;

// Mock user for offline mode
const OFFLINE_USER = {
  id: 'offline-user-123',
  email: 'test@worksight.app',
  name: 'Test User',
  role: 'user',
  accessToken: 'offline-access-token-123',
};

// Generate mock access token
const generateMockToken = () => {
  return `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Client-side authentication
export async function signIn({ email, password }: { email: string; password: string }) {
  // Check for offline credentials first
  if (email === 'test@worksight.app' && password === 'testuser') {
    const user = {
      ...OFFLINE_USER,
      accessToken: generateMockToken(),
      lastLogin: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', user.accessToken);
    }

    return { user, error: null, accessToken: user.accessToken };
  }

  // Legacy test credentials
  if (
    typeof window !== 'undefined' &&
    ((email === 'test' && password === 'testuser') || (email === 'testuser' && password === 'test'))
  ) {
    const user = {
      ...OFFLINE_USER,
      email: 'testuser@worksight.app',
      accessToken: generateMockToken(),
    };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', user.accessToken);
    return { user, error: null, accessToken: user.accessToken };
  }

  // If offline mode, reject other credentials
  if (isOffline()) {
    return {
      user: null,
      error: { message: 'Invalid credentials. In offline mode, use test@worksight.app / testuser' },
      accessToken: null,
    };
  }

  // Otherwise, use Supabase if available
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (data?.user && data?.session) {
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          role: data.user.user_metadata?.role || 'user',
          accessToken: data.session.access_token,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('accessToken', user.accessToken);
        }

        return { user, error: null, accessToken: user.accessToken };
      }
      return { user: null, error, accessToken: null };
    } catch (err) {
      return { user: null, error: err, accessToken: null };
    }
  }

  return {
    user: null,
    error: { message: 'Authentication service unavailable' },
    accessToken: null,
  };
}

// OAuth sign-in
export async function signInWithOAuth(provider: 'google' | 'github' | 'discord' | 'facebook') {
  if (isOffline()) {
    return {
      error: { message: 'OAuth not available in offline mode' },
    };
  }

  if (supabase) {
    return supabase.auth.signInWithOAuth({ provider });
  }

  return {
    error: { message: 'Authentication service unavailable' },
  };
}

// Get current user
export async function getCurrentUser() {
  if (typeof window === 'undefined') return null;

  // Check localStorage first
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('accessToken');

  if (storedUser && storedToken) {
    try {
      const user = JSON.parse(storedUser);
      return { ...user, accessToken: storedToken };
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  }

  // Check Supabase session if not offline
  if (!isOffline() && supabase) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
          role: session.user.user_metadata?.role || 'user',
          accessToken: session.access_token,
        };

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', user.accessToken);

        return user;
      }
    } catch (err) {
      console.error('Error getting session:', err);
    }
  }

  return null;
}

// Sign out
export async function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  }

  if (!isOffline() && supabase) {
    await supabase.auth.signOut();
  }
}
