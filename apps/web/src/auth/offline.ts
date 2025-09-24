import { Employees } from '@/data/employees';
import { OFFLINE_ACCOUNTS, OFFLINE_CREDENTIALS } from './identity';
import { User } from './types';

// Check if app is in offline mode
export const isOfflineMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check if forced offline mode is enabled
  const isForceOffline = process.env.NEXT_PUBLIC_IS_OFFLINE === 'true';
  if (isForceOffline) return true;

  // Check user preference or network status
  return localStorage.getItem('connectivity-mode') === 'offline' || !navigator.onLine;
};

// Enable/disable offline mode
export const setOfflineMode = (offline: boolean): void => {
  if (typeof window === 'undefined') return;

  // Don't allow changes if forced offline mode is enabled
  const isForceOffline = process.env.NEXT_PUBLIC_IS_OFFLINE === 'true';
  if (isForceOffline) return;

  localStorage.setItem('connectivity-mode', offline ? 'offline' : 'online');
};

// Map employee to user object
const mapEmployeeToUser = (employeeId: string, employee: unknown): User => {
  const emp = employee as {
    email: string;
    name: string;
    manager_id: string;
    department: string;
  };
  return {
    id: employeeId,
    email: emp.email,
    name: emp.name,
    role: emp.manager_id === '' ? 'exec' : 'employee',
    department: emp.department,
  } as User;
};

// Offline login function
export const offlineLogin = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> => {
  // If email matches one of our offline demo accounts, check mapped password
  if (email in OFFLINE_CREDENTIALS) {
    const expected = OFFLINE_CREDENTIALS[email as keyof typeof OFFLINE_CREDENTIALS];
    if (password !== expected) {
      return { user: null, error: 'Invalid credentials' };
    }
    // Map to configured offline user
    const account = OFFLINE_ACCOUNTS.find((u) => u.email === email)!;
    const user: User = { ...account };
    return { user, error: null };
  }

  // Otherwise, try to match against Employees dataset (password must be 'testuser')
  if (password === 'testuser') {
    const employeeEntry = Object.entries(Employees).find(([_, emp]) => emp.email === email);
    if (employeeEntry) {
      const [employeeId, employee] = employeeEntry;
      const user = mapEmployeeToUser(employeeId, employee);
      return { user, error: null };
    }
  }

  return { user: null, error: 'User not found' };
};

// Get available offline users (for development convenience)
export const getOfflineUsers = () => {
  return Object.values(Employees).map((employee) => ({
    email: employee.email,
    name: employee.name,
    role: employee.manager_id === '' ? 'exec' : 'employee',
    department: employee.department,
    id: Object.keys(Employees).find((key) => Employees[key] === employee),
  }));
};

// Validate offline token
export const validateOfflineToken = (token: string) => {
  if (!isOfflineMode() || !token) return null;

  try {
    // Simple validation for offline tokens
    if (!token.startsWith('eyJ') || !token.includes('offline-signature')) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    // Find user by ID (payload.sub contains the UUID key)
    const employee = Employees[payload.sub];
    if (!employee) return null;

    return mapEmployeeToUser(payload.sub, employee);
  } catch {
    return null;
  }
};
