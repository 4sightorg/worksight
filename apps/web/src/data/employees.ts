export type EmployeeProfile = {
  [key: string]: {
    internal_id: string;
    email: string;
    name: string;
    role: string;
    manager_id: string;
    date_joined: Date;
    department: string;
    created_at: Date;
    updated_at: Date;
  };
};

export const Employees: EmployeeProfile = {
  '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025': {
    internal_id: 'E001',
    email: 'sjc.71415@gmail.com',
    name: 'John Carlo Santos',
    role: 'fullstack',
    manager_id: '',
    date_joined: new Date('2025-08-24'),
    department: 'Infra',
    created_at: new Date('2025-08-24T16:51:38.176858+00:00'),
    updated_at: new Date('2025-08-24T16:51:38.176858+00:00'),
  },
  '58f36d76-f382-41b4-ad3e-f8192958d12b': {
    internal_id: 'E002',
    email: 'dagsmagalona@gmail.com',
    name: 'Adriel M. Magalona',
    role: 'frontend',
    manager_id: '',
    date_joined: new Date('2025-08-24'),
    department: 'Engineering',
    created_at: new Date('2025-08-24T16:51:38.176858+00:00'),
    updated_at: new Date('2025-08-24T16:51:38.176858+00:00'),
  },
  '71400e28-3c2a-4694-8124-8fbb9a0b66d8': {
    internal_id: 'E003',
    email: 'kielethanlanzanas@gmail.com',
    name: 'Kiel Ethan L. Lanzanas',
    role: 'data-ml',
    manager_id: '',
    date_joined: new Date('2025-08-24'),
    department: 'Data',
    created_at: new Date('2025-08-24T16:51:38.176858+00:00'),
    updated_at: new Date('2025-08-24T16:51:38.176858+00:00'),
  },
  '88165ccb-2c80-455a-9ace-466a30448f67': {
    internal_id: 'E004',
    email: 'ebenerado@gmail.com',
    name: 'Ellah D. Benerado',
    role: 'data-ml',
    manager_id: '',
    date_joined: new Date('2025-08-24'),
    department: 'Data',
    created_at: new Date('2025-08-24T16:51:38.176858+00:00'),
    updated_at: new Date('2025-08-24T16:51:38.176858+00:00'),
  },
};

// Also export with the old name for backward compatibility
export const employees = Employees;
