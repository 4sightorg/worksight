// Only import server-only modules in server code
import { createBrowserClient } from '@/utils/supabase/client';
import { isOfflineMode, offlineLogin } from './offline';

// Client-side Supabase instance for auth (only if not offline)
const supabase = !isOfflineMode() ? createBrowserClient() : null;

// Client-side authentication
export async function signIn({ email, password }: { email: string; password: string }) {
  // Try offline authentication first if in offline mode
  if (isOfflineMode()) {
    try {
      const result = await offlineLogin(email, password);
      if (result.user) {
        return { user: result.user, error: null, accessToken: 'offline-token' };
      } else {
        return {
          user: null,
          error: { message: result.error || 'Login failed' },
          accessToken: null,
        };
      }
    } catch {
      return { user: null, error: { message: 'Offline login failed' }, accessToken: null };
    }
  }

  // Otherwise, use Supabase if available
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (data?.user && data?.session) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email || 'Unknown',
          role: data.user.user_metadata?.role || 'user',
        };

        return { user, error: null, accessToken: data.session.access_token };
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
  if (isOfflineMode()) {
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
  if (!isOfflineMode() && supabase) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email || 'Unknown',
          role: session.user.user_metadata?.role || 'user',
        };

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', session.access_token);

        return { ...user, accessToken: session.access_token };
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

  if (!isOfflineMode() && supabase) {
    await supabase.auth.signOut();
  }
}
