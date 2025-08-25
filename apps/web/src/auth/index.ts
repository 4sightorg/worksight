// Re-export everything from the auth module
export * from './client';
export * from './identity';
export * from './provider';
export * from './types';
export * from './utils';

// Default exports for convenience
export {
  getCurrentUser,
  signIn,
  signInWithOAuth,
  signOut,
  signUp,
  validateOAuthUser,
} from './client';
export { isOfflineMode, offlineLogin, setOfflineMode } from './offline';
export { AuthProvider, useAuth } from './provider';
export type { User } from './types';
