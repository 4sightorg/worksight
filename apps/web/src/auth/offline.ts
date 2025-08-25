import { Employees } from '@/data/employees';
import { User } from './types';

// Check if app is in offline mode
export const isOfflineMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('offline_mode') === 'true' || !navigator.onLine;
};

// Enable/disable offline mode
export const setOfflineMode = (offline: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('offline_mode', offline.toString());
};

// Map employee to user object
const mapEmployeeToUser = (employeeId: string, employee: any): User => {
  return {
    id: employeeId,
    email: employee.email,
    name: employee.name,
    role: employee.manager_id === '' ? 'exec' : 'employee',
    department: employee.department,
  } as User;
};

// Offline login function
export const offlineLogin = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> => {
  // Always accept "testuser" as password in offline mode
  if (password !== 'testuser') {
    return { user: null, error: 'Invalid credentials' };
  }

  // Check in employees data
  const employeeEntry = Object.entries(Employees).find(([_, emp]) => emp.email === email);

  if (employeeEntry) {
    const [employeeId, employee] = employeeEntry;
    const user = mapEmployeeToUser(employeeId, employee);
    return { user, error: null };
  }

  // Check test accounts
  const testAccounts = [
    { email: 'admin@worksight.com', name: 'System Admin', role: 'admin' as const },
    { email: 'guest@worksight.com', name: 'Guest User', role: 'guest' as const },
  ];

  const testAccount = testAccounts.find((acc) => acc.email === email);
  if (testAccount) {
    const user: User = {
      id: `test-${testAccount.role}`,
      email: testAccount.email,
      name: testAccount.name,
      role: testAccount.role,
    } as User;
    return { user, error: null };
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
