// Documentation of all available login credentials in the system

export const availableCredentials = {
  // Current employees from employees.ts (all use password: "testuser" in offline mode)
  // Empty manager_id field means they are executives/top-level managers
  executives: [
    {
      email: 'sjc.71415@gmail.com', // Fixed to match employees.ts
      password: 'testuser',
      name: 'John Carlo Santos',
      role: 'exec', // Empty manager_id in employees.ts = executive
      department: 'Infra',
      id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
      note: 'Role is "fullstack" in DB but empty manager_id makes them executive',
    },
    {
      email: 'dagsmagalona@gmail.com',
      password: 'testuser',
      name: 'Adriel M. Magalona',
      role: 'exec', // Empty role in employees.ts = executive
      department: 'Engineering',
      id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
      note: 'Role is "frontend" in DB but empty manager_id makes them executive',
    },
    {
      email: 'kielethanlanzanas@gmail.com',
      password: 'testuser',
      name: 'Kiel Ethan L. Lanzanas',
      role: 'exec', // Empty role in employees.ts = executive
      department: 'Data',
      id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
      note: 'Role is "data-ml" in DB but empty manager_id makes them executive',
    },
    {
      email: 'ebenerado@gmail.com',
      password: 'testuser',
      name: 'Ellah D. Benerado',
      role: 'exec', // Empty role in employees.ts = executive
      department: 'Data',
      id: '88165ccb-2c80-455a-9ace-466a30448f67',
      note: 'Role is "data-ml" in DB but empty manager_id makes them executive',
    },
  ],

  // Extended roster - managers under executives
  managers: [
    {
      email: 'mike.johnson@worksight.com',
      password: 'testuser',
      name: 'Mike Johnson',
      role: 'manager',
      department: 'Infra',
      manager_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    },
    {
      email: 'sarah.wilson@worksight.com',
      password: 'testuser',
      name: 'Sarah Wilson',
      role: 'manager',
      department: 'Engineering',
      manager_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    },
    {
      email: 'alex.chen@worksight.com',
      password: 'testuser',
      name: 'Alex Chen',
      role: 'manager',
      department: 'Data',
      manager_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    },
  ],

  // Employees under managers
  employees: [
    {
      email: 'jane.doe@worksight.com',
      password: 'testuser',
      name: 'Jane Doe',
      role: 'employee',
      department: 'Infra',
    },
    {
      email: 'robert.taylor@worksight.com',
      password: 'testuser',
      name: 'Robert Taylor',
      role: 'employee',
      department: 'Engineering',
    },
    {
      email: 'lisa.garcia@worksight.com',
      password: 'testuser',
      name: 'Lisa Garcia',
      role: 'employee',
      department: 'Data',
    },
    {
      email: 'david.brown@worksight.com',
      password: 'testuser',
      name: 'David Brown',
      role: 'employee',
      department: 'Data',
    },
    {
      email: 'maria.lopez@worksight.com',
      password: 'testuser',
      name: 'Maria Lopez',
      role: 'employee',
      department: 'Engineering',
    },
  ],

  // Test accounts for different roles
  testAccounts: [
    {
      email: 'admin@worksight.com',
      password: 'testuser',
      name: 'System Admin',
      role: 'admin',
    },
    {
      email: 'guest@worksight.com',
      password: 'testuser',
      name: 'Guest User',
      role: 'guest',
    },
  ],

  // Quick login reference
  quickAccess: {
    executive: 'sjc.71415@gmail.com', // Fixed to match employees.ts
    manager: 'mike.johnson@worksight.com',
    employee: 'jane.doe@worksight.com',
    guest: 'guest@worksight.com',
    admin: 'admin@worksight.com',
    defaultPassword: 'testuser',
  },
};

// All available login emails for easy reference
export const allLoginEmails = [
  // Executives
  'sjc.71415@gmail.com', // Fixed to match employees.ts
  'dagsmagalona@gmail.com',
  'kielethanlanzanas@gmail.com',
  'ebenerado@gmail.com',

  // Managers
  'mike.johnson@worksight.com',
  'sarah.wilson@worksight.com',
  'alex.chen@worksight.com',

  // Employees
  'jane.doe@worksight.com',
  'robert.taylor@worksight.com',
  'lisa.garcia@worksight.com',
  'david.brown@worksight.com',
  'maria.lopez@worksight.com',

  // Test accounts
  'admin@worksight.com',
  'guest@worksight.com',
];
