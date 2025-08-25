// Authentication configuration
import { UserRole } from './types';

export const AUTH_CONFIG = {
  // Session timeouts
  SESSION_TIMEOUT: 5 * 60 * 1000, // 5 minutes in milliseconds
  EXTENDED_SESSION_TIMEOUT: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds

  // Storage keys
  STORAGE_KEYS: {
    USER: 'worksight_user',
    ACCESS_TOKEN: 'worksight_access_token',
    SAVE_LOGIN: 'worksight_save_login',
    LOGIN_TIMESTAMP: 'worksight_login_timestamp',
  },

  // Mock users for offline mode
  OFFLINE_USER: {
    id: 'offline-user-123',
    email: 'test@worksight.app',
    name: 'Test User',
    role: UserRole.EMPLOYEE,
  },

  ADMIN_USER: {
    id: 'admin-user-456',
    email: 'admin@worksight.app',
    name: 'Admin User',
    role: UserRole.ADMIN,
    department: 'IT',
    team: 'System Administration',
  },

  MANAGER_USER: {
    id: 'manager-user-789',
    email: 'manager@worksight.app',
    name: 'Manager User',
    role: UserRole.MANAGER,
    department: 'Engineering',
    team: 'Product Development',
  },

  // OAuth providers
  OAUTH_PROVIDERS: ['google', 'github', 'discord', 'facebook'] as const,
} as const;

export type OAuthProvider = (typeof AUTH_CONFIG.OAUTH_PROVIDERS)[number];
