import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { AUTH_CONFIG } from './config';
import { AuthResponse, SessionData, User } from './types';
import { generateMockToken, isOffline, isSessionExpired, storage } from './utils';

// Client-side Supabase instance for auth (only if not offline)
const supabase = !isOffline()
  ? (() => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set');
      }
      if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable is not set');
      }
      return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      );
    })()
  : null;

// Store session data with timestamp
const storeSession = (user: User, accessToken: string, saveLogin: boolean): void => {
  const sessionData: SessionData = {
    user,
    accessToken,
    timestamp: Date.now(),
    saveLogin,
  };

  storage.set(AUTH_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
  storage.set(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  storage.set(AUTH_CONFIG.STORAGE_KEYS.SAVE_LOGIN, saveLogin.toString());
  storage.set(AUTH_CONFIG.STORAGE_KEYS.LOGIN_TIMESTAMP, sessionData.timestamp.toString());
};

// Clear session data
const clearSession = (): void => {
  storage.remove(AUTH_CONFIG.STORAGE_KEYS.USER);
  storage.remove(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  storage.remove(AUTH_CONFIG.STORAGE_KEYS.SAVE_LOGIN);
  storage.remove(AUTH_CONFIG.STORAGE_KEYS.LOGIN_TIMESTAMP);
};

// Get stored session if valid
export const getStoredSession = (): SessionData | null => {
  try {
    const userStr = storage.get(AUTH_CONFIG.STORAGE_KEYS.USER);
    const accessToken = storage.get(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    const saveLoginStr = storage.get(AUTH_CONFIG.STORAGE_KEYS.SAVE_LOGIN);
    const timestampStr = storage.get(AUTH_CONFIG.STORAGE_KEYS.LOGIN_TIMESTAMP);

    if (!userStr || !accessToken || !timestampStr) {
      return null;
    }

    const user = JSON.parse(userStr);
    const saveLogin = saveLoginStr === 'true';
    const timestamp = parseInt(timestampStr, 10);

    const sessionData: SessionData = {
      user,
      accessToken,
      timestamp,
      saveLogin,
    };

    // Check if session is expired
    if (isSessionExpired(timestamp, saveLogin)) {
      clearSession();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Error getting stored session:', error);
    clearSession();
    return null;
  }
};

// Client-side authentication
export async function signIn(
  { email, password }: { email: string; password: string },
  saveLogin: boolean = false
): Promise<AuthResponse> {
  // Check for offline credentials first
  if (email === 'test@worksight.app' && password === 'testuser') {
    const user = {
      ...AUTH_CONFIG.OFFLINE_USER,
      lastLogin: new Date().toISOString(),
    };
    const accessToken = generateMockToken();

    storeSession(user, accessToken, saveLogin);
    return { user, error: null, accessToken };
  }

  // Admin test credentials
  if (email === 'admin@worksight.app' && password === 'admin123') {
    const user = {
      ...AUTH_CONFIG.ADMIN_USER,
      lastLogin: new Date().toISOString(),
    };
    const accessToken = generateMockToken();

    storeSession(user, accessToken, saveLogin);
    return { user, error: null, accessToken };
  }

  // Manager test credentials
  if (email === 'manager@worksight.app' && password === 'manager123') {
    const user = {
      ...AUTH_CONFIG.MANAGER_USER,
      lastLogin: new Date().toISOString(),
    };
    const accessToken = generateMockToken();

    storeSession(user, accessToken, saveLogin);
    return { user, error: null, accessToken };
  }

  // Legacy test credentials
  if (
    (email === 'test' && password === 'testuser') ||
    (email === 'testuser' && password === 'test')
  ) {
    const user = {
      ...AUTH_CONFIG.OFFLINE_USER,
      email: 'testuser@worksight.app',
      lastLogin: new Date().toISOString(),
    };
    const accessToken = generateMockToken();

    storeSession(user, accessToken, saveLogin);
    return { user, error: null, accessToken };
  }

  // If offline mode, reject other credentials
  if (isOffline()) {
    return {
      user: null,
      error: {
        message:
          'Invalid credentials. Use test@worksight.app/testuser, admin@worksight.app/admin123, or manager@worksight.app/manager123',
      },
      accessToken: null,
    };
  }

  // Online mode with Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (data?.user && data?.session) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email || '',
          username: data.user.user_metadata?.username || '',
          role: data.user.user_metadata?.role || 'user',
        };

        const accessToken = data.session.access_token;
        storeSession(user, accessToken, saveLogin);

        return { user, error: null, accessToken };
      }
      return { user: null, error: error || { message: 'Login failed' }, accessToken: null };
    } catch (err) {
      const error = err instanceof Error ? { message: err.message } : { message: 'Login failed' };
      return { user: null, error, accessToken: null };
    }
  }

  return {
    user: null,
    error: { message: 'Authentication service unavailable' },
    accessToken: null,
  };
}

// Sign up function
export async function signUp(
  {
    email,
    username,
    password,
    name,
  }: { email: string; username: string; password: string; name: string },
  saveLogin: boolean = false
): Promise<AuthResponse> {
  // Offline mode signup
  if (isOffline()) {
    // For offline mode, just create a mock user and store it
    const user = {
      id: `offline-user-${Date.now()}`,
      email,
      name,
      username,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    const accessToken = generateMockToken();
    storeSession(user, accessToken, saveLogin);

    return { user, error: null, accessToken };
  }

  // Online mode with Supabase
  if (supabase) {
    try {
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username,
            role: 'user',
          },
        },
      });

      if (error) {
        return { user: null, error: { message: error.message }, accessToken: null };
      }

      if (data?.user && data?.session) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || name,
          username: data.user.user_metadata?.username || username,
          role: data.user.user_metadata?.role || 'user',
        };

        const accessToken = data.session.access_token;
        storeSession(user, accessToken, saveLogin);

        return { user, error: null, accessToken };
      }

      return {
        user: null,
        error: {
          message:
            'Signup completed but no session created. Please check your email for verification.',
        },
        accessToken: null,
      };
    } catch (err) {
      const error = err instanceof Error ? { message: err.message } : { message: 'Signup failed' };
      return { user: null, error, accessToken: null };
    }
  }

  return {
    user: null,
    error: { message: 'Authentication service unavailable' },
    accessToken: null,
  };
}

// OAuth sign-in with account validation
export async function signInWithOAuth(provider: 'google' | 'github' | 'discord' | 'facebook') {
  if (isOffline()) {
    return {
      error: { message: 'OAuth not available in offline mode' },
    };
  }

  if (supabase) {
    try {
      // Set up OAuth with custom redirect URL that includes account validation
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      return { data, error };
    } catch {
      return {
        error: { message: `OAuth signin with ${provider} failed` },
      };
    }
  }

  return {
    error: { message: 'Authentication service unavailable' },
  };
}

// Validate OAuth user has an account (for use in auth callback)
export async function validateOAuthUser(user: User): Promise<AuthResponse> {
  if (isOffline()) {
    return {
      user: null,
      error: { message: 'OAuth validation not available in offline mode' },
      accessToken: null,
    };
  }

  // In a real app, you'd check your users table here
  // For now, we'll check if the user has completed signup process
  if (!user.user_metadata?.username) {
    return {
      user: null,
      error: { message: 'Account not found. Please sign up first.' },
      accessToken: null,
    };
  }

  return {
    user: {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email || '',
      username: user.user_metadata?.username || '',
      role: user.user_metadata?.role || 'user',
    },
    error: null,
    accessToken: user.access_token || '',
  };
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  // Check stored session first
  const storedSession = getStoredSession();
  if (storedSession) {
    return storedSession.user;
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
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email || '',
          username: session.user.user_metadata?.username || '',
          role: session.user.user_metadata?.role || 'user',
        };

        // Store the session with default 5-minute timeout
        storeSession(user, session.access_token, false);
        return user;
      }
    } catch (err) {
      console.error('Error getting session:', err);
    }
  }

  return null;
}

// Sign out
export async function signOut(): Promise<void> {
  clearSession();

  if (!isOffline() && supabase) {
    await supabase.auth.signOut();
  }
}

// Check if session will expire soon (within 1 minute)
export const isSessionExpiringSoon = (): boolean => {
  const storedSession = getStoredSession();
  if (!storedSession) return false;

  const now = Date.now();
  const timeout = storedSession.saveLogin
    ? AUTH_CONFIG.EXTENDED_SESSION_TIMEOUT
    : AUTH_CONFIG.SESSION_TIMEOUT;
  const expirationTime = storedSession.timestamp + timeout;
  const oneMinute = 60 * 1000;

  return expirationTime - now <= oneMinute;
};

// Extend session (refresh timestamp)
export const extendSession = (): boolean => {
  const storedSession = getStoredSession();
  if (!storedSession) return false;

  storeSession(storedSession.user, storedSession.accessToken, storedSession.saveLogin);
  return true;
};
