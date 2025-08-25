// Re-export everything from the auth module
export * from './client';
export * from './config';
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
export { AuthProvider, useAuth } from './provider';
