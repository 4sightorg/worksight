// Extended employee roster - team members under current managers

import { EmployeeProfile } from './employees';

export const extendedEmployees: EmployeeProfile = {
  // Team members under John Carlo Santos (Infra Manager)
  'e5a1b2c3-d4e5-f6g7-h8i9-j0k1l2m3n4o5': {
    internal_id: 'E005',
    email: 'mike.johnson@worksight.com',
    name: 'Mike Johnson',
    role: 'employee',
    manager_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    date_joined: new Date('2025-08-20'),
    department: 'Infra',
    created_at: new Date('2025-08-20T10:00:00.000Z'),
    updated_at: new Date('2025-08-20T10:00:00.000Z'),
  },
  'f6b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6': {
    internal_id: 'E006',
    email: 'sarah.wilson@worksight.com',
    name: 'Sarah Wilson',
    role: 'employee',
    manager_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    date_joined: new Date('2025-08-22'),
    department: 'Infra',
    created_at: new Date('2025-08-22T10:00:00.000Z'),
    updated_at: new Date('2025-08-22T10:00:00.000Z'),
  },

  // Team members under Adriel M. Magalona (Engineering Manager)
  'g7c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7': {
    internal_id: 'E007',
    email: 'jane.doe@worksight.com',
    name: 'Jane Doe',
    role: 'employee',
    manager_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date_joined: new Date('2025-08-18'),
    department: 'Engineering',
    created_at: new Date('2025-08-18T10:00:00.000Z'),
    updated_at: new Date('2025-08-18T10:00:00.000Z'),
  },
  'h8d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8': {
    internal_id: 'E008',
    email: 'alex.chen@worksight.com',
    name: 'Alex Chen',
    role: 'employee',
    manager_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date_joined: new Date('2025-08-21'),
    department: 'Engineering',
    created_at: new Date('2025-08-21T10:00:00.000Z'),
    updated_at: new Date('2025-08-21T10:00:00.000Z'),
  },
  'i9e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9': {
    internal_id: 'E009',
    email: 'robert.taylor@worksight.com',
    name: 'Robert Taylor',
    role: 'employee',
    manager_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date_joined: new Date('2025-08-19'),
    department: 'Engineering',
    created_at: new Date('2025-08-19T10:00:00.000Z'),
    updated_at: new Date('2025-08-19T10:00:00.000Z'),
  },

  // Team members under Kiel Ethan L. Lanzanas (Data Manager)
  'j0f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0': {
    internal_id: 'E010',
    email: 'lisa.garcia@worksight.com',
    name: 'Lisa Garcia',
    role: 'employee',
    manager_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    date_joined: new Date('2025-08-17'),
    department: 'Data',
    created_at: new Date('2025-08-17T10:00:00.000Z'),
    updated_at: new Date('2025-08-17T10:00:00.000Z'),
  },
  'k1g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1': {
    internal_id: 'E011',
    email: 'david.brown@worksight.com',
    name: 'David Brown',
    role: 'employee',
    manager_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    date_joined: new Date('2025-08-23'),
    department: 'Data',
    created_at: new Date('2025-08-23T10:00:00.000Z'),
    updated_at: new Date('2025-08-23T10:00:00.000Z'),
  },

  // Team members under Ellah D. Benerado (Data Manager)
  'l2h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2': {
    internal_id: 'E012',
    email: 'maria.lopez@worksight.com',
    name: 'Maria Lopez',
    role: 'employee',
    manager_id: '88165ccb-2c80-455a-9ace-466a30448f67',
    date_joined: new Date('2025-08-16'),
    department: 'Data',
    created_at: new Date('2025-08-16T10:00:00.000Z'),
    updated_at: new Date('2025-08-16T10:00:00.000Z'),
  },
  'm3i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3': {
    internal_id: 'E013',
    email: 'james.anderson@worksight.com',
    name: 'James Anderson',
    role: 'employee',
    manager_id: '88165ccb-2c80-455a-9ace-466a30448f67',
    date_joined: new Date('2025-08-15'),
    department: 'Data',
    created_at: new Date('2025-08-15T10:00:00.000Z'),
    updated_at: new Date('2025-08-15T10:00:00.000Z'),
  },
};

// All available login credentials for offline mode (password: "testuser" for all)
export const allLoginCredentials = [
  // Managers (from original employees.ts)
  'sjc.71415+me@gmail.com',
  'dagsmagalona@gmail.com',
  'kielethanlanzanas@gmail.com',
  'ebenerado@gmail.com',

  // Employees (from extended roster)
  'mike.johnson@worksight.com',
  'sarah.wilson@worksight.com',
  'jane.doe@worksight.com',
  'alex.chen@worksight.com',
  'robert.taylor@worksight.com',
  'lisa.garcia@worksight.com',
  'david.brown@worksight.com',
  'maria.lopez@worksight.com',
  'james.anderson@worksight.com',

  // Test accounts
  'admin@worksight.com',
  'exec@worksight.com',
  'guest@worksight.com',
];
