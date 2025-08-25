'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { isOfflineMode, offlineLogin } from './offline';
import { User } from './types';

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
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setSaveLogin: (save: boolean) => void;
  extendCurrentSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [setAccessToken] = useState<string | null>(null);
  const [setSaveLogin] = useState(false);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user_session');
      }
    }
    setLoading(false);
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
          localStorage.setItem('user_session', JSON.stringify(result.user));
        }
        return result;
      }

      // Online login logic would go here
      // For now, fall back to offline login
      const result = await offlineLogin(email, password);
      if (result.user) {
        setUser(result.user);
        localStorage.setItem('user_session', JSON.stringify(result.user));
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
    localStorage.removeItem('user_session');

    if (!isOfflineMode()) {
      // Online logout logic would go here
    }
  };

  const extendCurrentSession = () => {
    // Update session timestamp in localStorage
    if (user) {
      localStorage.setItem('user_session', JSON.stringify(user));
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
