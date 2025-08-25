// This file documents all available login credentials found in the codebase

export const availableCredentials = {
  // From auth context - hardcoded test users
  testUsers: [
    {
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
      name: 'Admin User',
    },
    {
      email: 'user@example.com',
      password: 'password',
      role: 'employee',
      name: 'Test User',
    },
    {
      email: 'manager@example.com',
      password: 'password',
      role: 'manager',
      name: 'Manager User',
    },
    {
      email: 'guest@example.com',
      password: 'password',
      role: 'guest',
      name: 'Guest User',
    },
    {
      email: 'exec@example.com',
      password: 'password',
      role: 'exec',
      name: 'Executive User',
    },
  ],

  // From employees data file - if it contains login info
  employeeAccounts: [
    // These would need to be checked in the employees data file
    // to see if they have associated login credentials
  ],

  // Default/fallback credentials
  defaults: {
    password: 'password', // Common default password
    adminEmail: 'admin@worksight.com',
    testEmail: 'test@worksight.com',
  },
};

// Export for easy access in development
export const quickLoginCredentials = {
  admin: { email: 'admin@example.com', password: 'password' },
  employee: { email: 'user@example.com', password: 'password' },
  manager: { email: 'manager@example.com', password: 'password' },
  guest: { email: 'guest@example.com', password: 'password' },
  exec: { email: 'exec@example.com', password: 'password' },
};
