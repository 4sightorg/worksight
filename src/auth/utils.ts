import { AUTH_CONFIG } from './config';

// Check if we're in offline mode
export const isOffline = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_IS_OFFLINE === 'true' || !navigator.onLine;
  }
  return process.env.IS_OFFLINE === 'true';
};

// Generate mock access token
export const generateMockToken = () => {
  return `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Check if session is expired
export const isSessionExpired = (timestamp: number, saveLogin: boolean): boolean => {
  const now = Date.now();
  const timeout = saveLogin ? AUTH_CONFIG.EXTENDED_SESSION_TIMEOUT : AUTH_CONFIG.SESSION_TIMEOUT;
  return (now - timestamp) > timeout;
};

// Safe localStorage operations
export const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      Object.values(AUTH_CONFIG.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
};
