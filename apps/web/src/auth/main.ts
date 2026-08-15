import { createBrowserClient } from '@/utils/supabase/client';
import { generateMockToken, storage } from './core';
import { AUTH_CONFIG, OFFLINE_EMAILS } from './identity';
import { SessionData, User } from './types';

// Check if session is expired
export const isSessionExpired = (timestamp: number, saveLogin: boolean): boolean => {
  const now = Date.now();
  const timeout = saveLogin ? AUTH_CONFIG.EXTENDED_SESSION_TIMEOUT : AUTH_CONFIG.SESSION_TIMEOUT;
  return now - timestamp > timeout;
};
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

export async function signIn(
  email: string,
  password: string,
  saveLogin: boolean = false,
  is_offline?: boolean
) {
  const isValidOfflinePassword =
    password === 'testuser' ||
    (email === 'admin@worksight.app' && password === 'admin123') ||
    (email === 'manager@worksight.app' && password === 'manager123');

  if (OFFLINE_EMAILS.includes(email) && isValidOfflinePassword) {
    let roleConfig:
      | typeof AUTH_CONFIG.EMPLOYEE
      | typeof AUTH_CONFIG.ADMIN
      | typeof AUTH_CONFIG.MANAGER = AUTH_CONFIG.EMPLOYEE;
    if (email === AUTH_CONFIG.ADMIN.email) roleConfig = AUTH_CONFIG.ADMIN;
    if (email === AUTH_CONFIG.MANAGER.email) roleConfig = AUTH_CONFIG.MANAGER;

    const user = {
      ...roleConfig,
      email,
      lastLogin: new Date().toISOString(),
    };
    const accessToken = generateMockToken();
    storeSession(user, accessToken, saveLogin);
    return { user, error: null, accessToken };
  }

  const isOffline =
    typeof is_offline !== 'undefined' ? is_offline : process.env.IS_OFFLINE === 'true';

  if (isOffline) {
    // Local credentials check (replace with your own logic)
    const localEmail = process.env.LOCAL_EMAIL!;
    const localPassword = process.env.LOCAL_PASSWORD!;
    if (email === localEmail && password === localPassword) {
      return { user: { email: localEmail }, session: { local: true } };
    } else {
      throw new Error('Invalid local credentials');
    }
  } else {
    const supabase = createBrowserClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
