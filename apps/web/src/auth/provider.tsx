'use client';

import { safeStorage, ValidationSchemas } from '@/lib/validation';
import { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_CONFIG } from './identity';
import { isOfflineMode, offlineLogin } from './offline';
import { User } from './types';
import { isSessionExpired, storage } from './utils';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signup: (
    userData: unknown,
    saveLogin?: boolean
  ) => Promise<{ user: User | null; error: string | null }>;
  signUp: (
    userData: unknown,
    saveLogin?: boolean
  ) => Promise<{ user: User | null; error: string | null }>;
  logout: () => Promise<void>;
  loading: boolean;
  isLoading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setSaveLogin: (save: boolean) => void;
  extendCurrentSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const [_, setAccessTokenState] = useState<string | null>(null);
  const [saveLogin, setSaveLoginState] = useState(false);

  // Wrap setters to handle side-effects
  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    // For offline mode, set a cookie so middleware (if enabled) can allow access
    if (typeof document !== 'undefined') {
      if (token && isOfflineMode()) {
        document.cookie = `ws_offline_session=1; path=/`;
      } else {
        document.cookie = 'ws_offline_session=; Max-Age=0; path=/';
      }
    }
  };

  const setSaveLogin = (save: boolean) => {
    setSaveLoginState(save);
    try {
      storage.set(AUTH_CONFIG.STORAGE_KEYS.SAVE_LOGIN, save.toString());
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    // Check for saved session using unified auth storage without importing Supabase client
    const initializeAuth = () => {
      try {
        const userStr = storage.get(AUTH_CONFIG.STORAGE_KEYS.USER);
        const accessToken = storage.get(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        const saveLoginStr = storage.get(AUTH_CONFIG.STORAGE_KEYS.SAVE_LOGIN);
        const timestampStr = storage.get(AUTH_CONFIG.STORAGE_KEYS.LOGIN_TIMESTAMP);

        if (userStr && accessToken && timestampStr) {
          // Safely parse user data with validation
          const user = safeStorage.getJson(AUTH_CONFIG.STORAGE_KEYS.USER, ValidationSchemas.user);
          const saveLogin = saveLoginStr === 'true';
          const timestamp = parseInt(timestampStr, 10);

          if (user && !isSessionExpired(timestamp, saveLogin)) {
            setUser(user);
            setAccessToken(accessToken);
          } else {
            // Expired session or invalid user data; clear
            storage.clear();
          }
        } else {
          // Backward compatibility: legacy key fallback with safe parsing
          const savedUserData = safeStorage.getJson('user_session', ValidationSchemas.user);
          if (savedUserData) {
            setUser(savedUserData);
          }
        }
      } catch (error) {
        console.error('Failed to restore saved session:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user_session');
        }
        storage.clear();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ user: User | null; error: string | null }> => {
    setLoading(true);

    try {
      if (isOfflineMode()) {
        const result = await offlineLogin(email, password);
        if (result.user) {
          setUser(result.user);
          if (saveLogin) {
            localStorage.setItem('user_session', JSON.stringify(result.user));
          }
          // Flag offline session for middleware via cookie
          if (typeof document !== 'undefined') {
            document.cookie = `ws_offline_session=1; path=/`;
          }
        }
        return result;
      }

      // Online login logic would go here
      // For now, fall back to offline login
      const result = await offlineLogin(email, password);
      if (result.user) {
        setUser(result.user);
        if (saveLogin) {
          localStorage.setItem('user_session', JSON.stringify(result.user));
        }
        if (typeof document !== 'undefined') {
          document.cookie = `ws_offline_session=1; path=/`;
        }
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    _userData: unknown,
    _saveLogin: boolean = false
  ): Promise<{ user: User | null; error: string | null }> => {
    // Check if forced offline mode
    const isForceOffline = process.env.NEXT_PUBLIC_IS_OFFLINE === 'true';

    if (isOfflineMode() || isForceOffline) {
      return {
        user: null,
        error: isForceOffline
          ? 'Signup is disabled in offline mode'
          : 'Signup not available in offline mode',
      };
    }

    // Online signup logic would go here
    return { user: null, error: 'Signup not implemented for online mode yet' };
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setAccessToken(null);
    // Clear both new and legacy storage keys
    storage.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_session');
    }
    // Clear offline session cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'ws_offline_session=; Max-Age=0; path=/';
    }

    if (!isOfflineMode()) {
      // Online logout logic would go here
    }
  };

  const extendCurrentSession = () => {
    // Bump session timestamp to prevent expiry
    try {
      storage.set(AUTH_CONFIG.STORAGE_KEYS.LOGIN_TIMESTAMP, Date.now().toString());
    } catch {
      // no-op
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    signUp: signup, // alias for signup
    logout,
    loading,
    isLoading: loading, // alias for loading
    initialized,
    setUser,
    setAccessToken,
    setSaveLogin,
    extendCurrentSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
