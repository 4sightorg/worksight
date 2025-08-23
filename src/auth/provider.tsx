'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  extendSession,
  getStoredSession,
  isSessionExpiringSoon,
} from './client';
import { AUTH_CONFIG } from './config';
import { AuthState, User } from './types';
import { storage } from './utils';

interface AuthContextType extends AuthState {
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setSaveLogin: (saveLogin: boolean) => void;
  signIn: (credentials: { email: string; password: string }, saveLogin?: boolean) => Promise<void>;
  signUp: (
    userData: { email: string; username: string; password: string; name: string },
    saveLogin?: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  extendCurrentSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [saveLogin, setSaveLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Session expiration warning timer
  useEffect(() => {
    if (!user) return;

    const checkExpiration = () => {
      const storedSession = getStoredSession();
      if (!storedSession) {
        // Session expired, logout
        logout();
        return;
      }

      // Warn if session is expiring soon
      if (isSessionExpiringSoon()) {
        console.warn('Session will expire soon');
        // You could show a toast notification here
      }
    };

    // Check every minute
    const interval = setInterval(checkExpiration, 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedSession = getStoredSession();
        if (storedSession) {
          setUser(storedSession.user);
          setAccessToken(storedSession.accessToken);
          setSaveLogin(storedSession.saveLogin);
        }
      } catch (error) {
        console.warn('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleSetUser = (user: User | null) => {
    setUser(user);
    if (!user) {
      // Clear session when user is set to null
      storage.clear();
      setAccessToken(null);
      setSaveLogin(false);
    }
  };

  const handleSetAccessToken = (token: string | null) => {
    setAccessToken(token);
    if (token) {
      storage.set(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
    } else {
      storage.remove(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    }
  };

  const handleSetSaveLogin = (saveLogin: boolean) => {
    setSaveLogin(saveLogin);
    storage.set(AUTH_CONFIG.STORAGE_KEYS.SAVE_LOGIN, saveLogin.toString());
  };

  const handleSignIn = async (
    credentials: { email: string; password: string },
    saveLogin: boolean = false
  ) => {
    const result = await authSignIn(credentials, saveLogin);
    if (result.user) {
      setUser(result.user);
      setAccessToken(result.accessToken);
      setSaveLogin(saveLogin);
    } else {
      throw new Error(result.error?.message || 'Login failed');
    }
  };

  const handleSignUp = async (
    userData: { email: string; username: string; password: string; name: string },
    saveLogin: boolean = false
  ) => {
    const result = await authSignUp(userData, saveLogin);
    if (result.user) {
      setUser(result.user);
      setAccessToken(result.accessToken);
      setSaveLogin(saveLogin);
    } else {
      throw new Error(result.error?.message || 'Signup failed');
    }
  };

  const logout = async () => {
    try {
      await authSignOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      setSaveLogin(false);
    }
  };

  const extendCurrentSession = (): boolean => {
    const success = extendSession();
    if (success) {
      // Update the timestamp in our local state by getting fresh session data
      const refreshedSession = getStoredSession();
      if (refreshedSession) {
        setUser(refreshedSession.user);
        setAccessToken(refreshedSession.accessToken);
        setSaveLogin(refreshedSession.saveLogin);
      }
    }
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        saveLogin,
        isLoading,
        setUser: handleSetUser,
        setAccessToken: handleSetAccessToken,
        setSaveLogin: handleSetSaveLogin,
        signIn: handleSignIn,
        signUp: handleSignUp,
        logout,
        extendCurrentSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
