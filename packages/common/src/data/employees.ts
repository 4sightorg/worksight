import { EmployeeProfile, Team } from '../types';

export const Employees: EmployeeProfile[] = [
  // Team members under John Carlo Santos (Infra Manager)
  {
    id: 'e5a1b2c3-d4e5-f6g7-h8i9-j0k1l2m3n4o5',
    internal_id: 'E005',
    email: 'mike.johnson@worksight.com',
    name: 'Mike Johnson',
    role: 'employee',
    manager_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    date_joined: new Date('2025-08-20'),
    department: ['frontend', 'backend'],
    created_at: new Date('2025-08-20T10:00:00.000Z'),
    updated_at: new Date('2025-08-20T10:00:00.000Z'),
  },
  {
    id: 'f6b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    internal_id: 'E006',
    email: 'sarah.wilson@worksight.com',
    name: 'Sarah Wilson',
    role: 'employee',
    manager_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    date_joined: new Date('2025-08-22'),
    department: ['frontend', 'backend'],
    created_at: new Date('2025-08-22T10:00:00.000Z'),
    updated_at: new Date('2025-08-22T10:00:00.000Z'),
  },

  // Team members under Adriel M. Magalona (Engineering Manager)
  {
    id: 'g7c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
    internal_id: 'E007',
    email: 'jane.doe@worksight.com',
    name: 'Jane Doe',
    role: 'employee',
    manager_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date_joined: new Date('2025-08-18'),
    department: ['sysadmin'],
    created_at: new Date('2025-08-18T10:00:00.000Z'),
    updated_at: new Date('2025-08-18T10:00:00.000Z'),
  },
  {
    id: 'h8d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    internal_id: 'E008',
    email: 'alex.chen@worksight.com',
    name: 'Alex Chen',
    role: 'employee',
    manager_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date_joined: new Date('2025-08-21'),
    department: ['sysadmin'],
    created_at: new Date('2025-08-21T10:00:00.000Z'),
    updated_at: new Date('2025-08-21T10:00:00.000Z'),
  },
  {
    id: 'i9e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
    internal_id: 'E009',
    email: 'robert.taylor@worksight.com',
    name: 'Robert Taylor',
    role: 'employee',
    manager_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date_joined: new Date('2025-08-19'),
    department: ['sysadmin'],
    created_at: new Date('2025-08-19T10:00:00.000Z'),
    updated_at: new Date('2025-08-19T10:00:00.000Z'),
  },

  // Team members under Kiel Ethan L. Lanzanas (Data Manager)
  {
    id: 'j0f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0',
    internal_id: 'E010',
    email: 'lisa.garcia@worksight.com',
    name: 'Lisa Garcia',
    role: 'employee',
    manager_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    date_joined: new Date('2025-08-17'),
    department: ['data'],
    created_at: new Date('2025-08-17T10:00:00.000Z'),
    updated_at: new Date('2025-08-17T10:00:00.000Z'),
  },
  {
    id: 'k1g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1',
    internal_id: 'E011',
    email: 'david.brown@worksight.com',
    name: 'David Brown',
    role: 'employee',
    manager_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    date_joined: new Date('2025-08-23'),
    department: ['data'],
    created_at: new Date('2025-08-23T10:00:00.000Z'),
    updated_at: new Date('2025-08-23T10:00:00.000Z'),
  },

  // Team members under Ellah D. Benerado (Data Manager)
  {
    id: 'l2h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2',
    internal_id: 'E012',
    email: 'maria.lopez@worksight.com',
    name: 'Maria Lopez',
    role: 'employee',
    manager_id: '88165ccb-2c80-455a-9ace-466a30448f67',
    date_joined: new Date('2025-08-16'),
    department: ['data'],
    created_at: new Date('2025-08-16T10:00:00.000Z'),
    updated_at: new Date('2025-08-16T10:00:00.000Z'),
  },

  {
    id: '7f1fcc2a-4025-49e3-9090-bf0ff9fee898',
    internal_id: 'E008',
    email: 'admin@worksight.app',
    name: 'System Admin',
    role: 'super_admin',
    manager_id: '',
    date_joined: new Date('2025-09-09'),
    department: ['data'],
    created_at: new Date('2025-09-09T16:51:38.176858+00:00'),
    updated_at: new Date('2025-09-09T16:51:38.176858+00:00'),
  },
  {
    id: 'f52281b2-064e-4ee7-b4bb-6327fe1f74f7',
    internal_id: 'E009',
    email: 'guest@worksight.app',
    name: 'Server Guest',
    role: 'guest',
    manager_id: '',
    date_joined: new Date('2025-09-09'),
    department: [''],
    created_at: new Date('2025-09-09T16:51:38.176858+00:00'),
    updated_at: new Date('2025-09-09T16:51:38.176858+00:00'),
  },
  {
    id: '077788f9-e8a7-4cc9-b7e0-5e4610a56a39',
    internal_id: 'E010',
    email: 'test@worksight.app',
    name: 'Employee',
    role: 'employee',
    manager_id: 'admin',
    date_joined: new Date('2025-09-09'),
    department: ['data'],
    created_at: new Date('2025-09-09T16:51:38.176858+00:00'),
    updated_at: new Date('2025-09-09T16:51:38.176858+00:00'),
  },
];

export const Teams: Team[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Engineering",
    description: "Top-level engineering org",
    department: "engineering",
    manager_id: "7f1fcc2a-4025-49e3-9090-bf0ff9fee898",
    member_ids: [],
    parent_team_id: null,
    created_at: new Date("2025-09-28T12:00:00.000Z"),
    updated_at: new Date("2025-09-28T12:00:00.000Z")
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Infrastructure Team",
    description: "Handles infra and cross-cutting concerns",
    department: "backend",
    manager_id: "08b6fc43-77e6-4fcf-8ed8-dafc16b4b025",
    member_ids: [
      "e5a1b2c3-d4e5-f6g7-h8i9-j0k1l2m3n4o5",
      "f6b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
    ],
    parent_team_id: "11111111-1111-1111-1111-111111111111",
    created_at: new Date("2025-09-28T12:00:00.000Z"),
    updated_at: new Date("2025-09-28T12:00:00.000Z")
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "SysAdmin Team",
    description: "Manages system administration",
    department: "sysadmin",
    manager_id: "58f36d76-f382-41b4-ad3e-f8192958d12b",
    member_ids: [
      "g7c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
      "h8d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
      "i9e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9"
    ],
    parent_team_id: "11111111-1111-1111-1111-111111111111",
    created_at: new Date("2025-09-28T12:00:00.000Z"),
    updated_at: new Date("2025-09-28T12:00:00.000Z")
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Data Engineering Team A",
    description: "Data pipeline and analytics",
    department: "data",
    manager_id: "71400e28-3c2a-4694-8124-8fbb9a0b66d8",
    member_ids: [
      "j0f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
      "k1g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
    ],
    parent_team_id: "11111111-1111-1111-1111-111111111111",
    created_at: new Date("2025-09-28T12:00:00.000Z"),
    updated_at: new Date("2025-09-28T12:00:00.000Z")
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "Data Engineering Team B",
    description: "Data operations and governance",
    department: "data",
    manager_id: "88165ccb-2c80-455a-9ace-466a30448f67",
    member_ids: [
      "l2h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2"
    ],
    parent_team_id: "11111111-1111-1111-1111-111111111111",
    created_at: new Date("2025-09-28T12:00:00.000Z"),
    updated_at: new Date("2025-09-28T12:00:00.000Z")
  }
];
