import { type Activity, type Assignment } from '@worksight/common/types/tasks';

// 🎬 4sight WorkSight Assignments - Breaking the 4th Wall!
export const Assignments: Assignment[] = [
  // Epic: WorkSight Platform Development 🚀
  {
    id: '34fee761-d1c6-47a7-92e2-b07cc103be0a',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'WS-001',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    type: 'feature',
    title: 'Implement theme toggle with sun/moon icons for WorkSight docs',
    status: 'completed',
    sprint: 'Meta Sprint 1 - Building Our Own Tools',
    epic: 'WORKSIGHT-BOOTSTRAP',
    points: 5,
    priority: 'high',
    created_at: new Date('2025-08-20T09:00:00+00:00'),
    updated_at: new Date('2025-08-25T14:30:00+00:00'),
  },
  {
    id: 'c26318a6-51a9-4880-8103-edb4129d44ba',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'WS-002',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    type: 'task',
    title: 'Unify Supabase client utilities across Next.js app',
    status: 'completed',
    sprint: 'Meta Sprint 1 - Building Our Own Tools',
    epic: 'WORKSIGHT-BOOTSTRAP',
    points: 8,
    priority: 'critical',
    created_at: new Date('2025-08-25T08:00:00+00:00'),
    updated_at: new Date('2025-08-25T16:45:00+00:00'),
  },
  {
    id: 'bf86d837-da40-4aa7-940c-3719175244ae',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'WS-003',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b', // Adriel M. Magalona
    type: 'feature',
    title: 'Design and implement employee dashboard with real-time attendance',
    status: 'in_progress',
    created_at: new Date('2025-08-22T10:00:00+00:00'),
    updated_at: new Date('2025-08-25T11:20:00+00:00'),
    sprint: 'Meta Sprint 1 - Building Our Own Tools',
    epic: 'EMPLOYEE-DASHBOARD',
    points: 13,
    priority: 'high',
  },
  {
    id: 'a26b0eea-7c1c-4a7e-8a30-46829e873182',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'WS-004',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8', // Kiel Ethan L. Lanzanas
    type: 'task',
    title: 'Build ML model for burnout prediction using attendance patterns',
    status: 'in_progress',
    created_at: new Date('2025-08-21T14:00:00+00:00'),
    updated_at: new Date('2025-08-25T09:15:00+00:00'),
    sprint: 'AI/ML Sprint 1 - Predictive Insights',
    epic: 'BURNOUT-DETECTION',
    points: 21,
    priority: 'medium',
  },
  {
    id: '9788905d-a3f5-41cd-965e-e900e7b3d88d',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'WS-005',
    employee_id: '88165ccb-2c80-455a-9ace-466a30448f67', // Ellah D. Benerado
    type: 'research',
    title: 'Research employee wellness indicators from productivity data',
    status: 'todo',
    created_at: new Date('2025-08-24T16:00:00+00:00'),
    updated_at: new Date('2025-08-24T16:00:00+00:00'),
    sprint: 'AI/ML Sprint 1 - Predictive Insights',
    epic: 'BURNOUT-DETECTION',
    points: 8,
    priority: 'medium',
  },
  // Fun meta tasks - Breaking the 4th wall! 🎭
  {
    id: 'b2467921-fc30-4225-9234-87f64b1c475a',
    source_id: '88ff6d64-4749-4fa6-a89b-7ffded103c08',
    external_id: 'META-001',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    type: 'documentation',
    title: 'Document the irony of tracking our own productivity while building productivity tools',
    status: 'todo',
    created_at: new Date('2025-08-25T15:30:00+00:00'),
    updated_at: new Date('2025-08-25T15:30:00+00:00'),
    sprint: 'Meta Sprint 2 - Self-Awareness',
    epic: 'FOURTH-WALL-BREAKS',
    points: 3,
    priority: 'low',
  },
  {
    id: '919ca0a0-4cdf-4936-8ece-32aebade631e',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'WS-007',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b', // Adriel M. Magalona
    type: 'feature',
    title: "Add easter egg: 'You're being watched' notification when viewing surveillance features",
    status: 'todo',
    created_at: new Date('2025-08-25T12:00:00+00:00'),
    updated_at: new Date('2025-08-25T12:00:00+00:00'),
    sprint: 'Meta Sprint 2 - Self-Awareness',
    epic: 'FOURTH-WALL-BREAKS',
    points: 2,
    priority: 'low',
  },
  {
    id: '5ef946a1-416d-4f45-b76f-1af50b5ccb20',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'WS-008',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    type: 'infrastructure',
    title: 'Set up monitoring for our monitoring system (meta-monitoring)',
    status: 'todo',
    created_at: new Date('2025-08-25T13:45:00+00:00'),
    updated_at: new Date('2025-08-25T13:45:00+00:00'),
    sprint: 'Infrastructure Sprint 1',
    epic: 'PLATFORM-STABILITY',
    points: 5,
    priority: 'medium',
  },
];

// 🎬 4sight WorkSight Activities - The Plot Thickens!
export const Activities: Activity[] = [
  // Today's activities - Aug 25, 2025
  {
    id: '3d3696e7-356b-4773-8a91-a74a68bddf28',
    source_id: '98e79144-5209-470a-8930-4568edf9172f',
    external_id: 'commit-abc123',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    type: 'code_commit',
    timestamp: new Date('2025-08-25T08:30:00+00:00'),
    description:
      "feat: unified Supabase client - ironic that we're fixing auth while building auth tracking",
    is_after_hours: false,
    is_weekend: true, // Sunday work!
    is_urgent: false,
    created_at: new Date('2025-08-25T08:30:00+00:00'),
  },
  {
    id: '91237fd8-e7f2-475a-a9c5-17dc2bf166ab',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'WS-002-update',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    type: 'task_update',
    timestamp: new Date('2025-08-25T10:15:00+00:00'),
    description:
      "Moved Supabase unification task to 'completed' - our own productivity just got tracked!",
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T10:15:00+00:00'),
  },
  {
    id: '77250f0c-9738-4131-bb0a-0af3fd02eedb',
    source_id: '98e79144-5209-470a-8930-4568edf9172f',
    external_id: 'commit-def456',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b', // Adriel M. Magalona
    type: 'code_commit',
    timestamp: new Date('2025-08-25T11:45:00+00:00'),
    description: "ui: added 'Big Brother is watching' tooltip to attendance tracker (very meta)",
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T11:45:00+00:00'),
  },
  {
    id: 'cfefc2b9-b72c-4624-9352-91ae9c2fd755',
    source_id: 'b2c4d8e1-9f7a-4b3e-8c5d-1a2f3e4d5c6b',
    external_id: 'msg-789',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8', // Kiel Ethan L. Lanzanas
    type: 'communication',
    timestamp: new Date('2025-08-25T13:20:00+00:00'),
    description:
      "Posted in #ai-ml: 'Training AI to detect burnout while experiencing burnout. The recursion is real.'",
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T13:20:00+00:00'),
  },
  {
    id: '87c718af-6dc8-4371-9487-82d3257f5400',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'WS-004-update',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8', // Kiel Ethan L. Lanzanas
    type: 'task_update',
    timestamp: new Date('2025-08-25T14:00:00+00:00'),
    description: 'Added story point estimate for burnout ML model - feeling the irony intensely',
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T14:00:00+00:00'),
  },

  // Yesterday's activities - Aug 24, 2025 (Saturday)
  {
    id: '324f0460-6ced-45cb-a79b-16a4463aff20',
    source_id: '88ff6d64-4749-4fa6-a89b-7ffded103c08',
    external_id: 'research-001',
    employee_id: '88165ccb-2c80-455a-9ace-466a30448f67', // Ellah D. Benerado
    type: 'research',
    timestamp: new Date('2025-08-24T16:30:00+00:00'),
    description:
      'Started researching wellness indicators - immediately felt surveilled by our own future product',
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-24T16:30:00+00:00'),
  },
  {
    id: '21af1aad-a8d4-44ca-b374-cbfa13819dd3',
    source_id: '98e79144-5209-470a-8930-4568edf9172f',
    external_id: 'commit-ghi789',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b', // Adriel M. Magalona
    type: 'code_commit',
    timestamp: new Date('2025-08-24T19:15:00+00:00'),
    description:
      'refactor: dashboard components - working late to build a system that will tell us we work too late',
    is_after_hours: true,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-24T19:15:00+00:00'),
  },

  // Friday activities - Aug 22, 2025 (Regular workday)
  {
    id: 'bca7d92f-bafd-4ae6-837f-360ebb548932',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'WS-003-create',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b', // Adriel M. Magalona
    type: 'task_creation',
    timestamp: new Date('2025-08-22T10:00:00+00:00'),
    description: "Created dashboard task - we're literally building the panopticon",
    is_after_hours: false,
    is_weekend: false,
    is_urgent: false,
    created_at: new Date('2025-08-22T10:00:00+00:00'),
  },
  {
    id: 'c56492eb-dfa9-448c-ba0f-39c710d2d8de',
    source_id: 'b2c4d8e1-9f7a-4b3e-8c5d-1a2f3e4d5c6b',
    external_id: 'msg-456',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    type: 'communication',
    timestamp: new Date('2025-08-22T14:30:00+00:00'),
    description:
      "Team standup: 'We're 4sight, we have 4sight, and we're breaking the 4th wall. Meta level: maximum.'",
    is_after_hours: false,
    is_weekend: false,
    is_urgent: false,
    created_at: new Date('2025-08-22T14:30:00+00:00'),
  },
  {
    id: '0b0e07dd-6909-466f-8591-29e5311c38aa',
    source_id: '98e79144-5209-470a-8930-4568edf9172f',
    external_id: 'commit-jkl012',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8', // Kiel Ethan L. Lanzanas
    type: 'code_commit',
    timestamp: new Date('2025-08-22T16:45:00+00:00'),
    description: 'ml: initial burnout detection model - using our own stress to train it',
    is_after_hours: false,
    is_weekend: false,
    is_urgent: false,
    created_at: new Date('2025-08-22T16:45:00+00:00'),
  },

  // After-hours and urgent activities
  {
    id: 'cc4376e9-4aab-4810-a1b9-3b038c02b36f',
    source_id: 'b2c4d8e1-9f7a-4b3e-8c5d-1a2f3e4d5c6b',
    external_id: 'alert-001',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    type: 'incident_response',
    timestamp: new Date('2025-08-23T22:30:00+00:00'),
    description: 'URGENT: Authentication server down - ironic timing while building auth tracking',
    is_after_hours: true,
    is_weekend: false,
    is_urgent: true,
    created_at: new Date('2025-08-23T22:30:00+00:00'),
  },
  {
    id: 'b74ed22d-ed4b-4f2e-9b6a-b4a2cd808e95',
    source_id: '98e79144-5209-470a-8930-4568edf9172f',
    external_id: 'hotfix-001',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    type: 'hotfix',
    timestamp: new Date('2025-08-23T23:15:00+00:00'),
    description: 'hotfix: restored auth service - our surveillance system can continue surveilling',
    is_after_hours: true,
    is_weekend: false,
    is_urgent: true,
    created_at: new Date('2025-08-23T23:15:00+00:00'),
  },

  // More meta activities
  {
    id: 'cb3326f8-8df0-4d4a-9c18-1b4b3cfea0c9',
    source_id: '88ff6d64-4749-4fa6-a89b-7ffded103c08',
    external_id: 'meta-reflection-001',
    employee_id: '88165ccb-2c80-455a-9ace-466a30448f67', // Ellah D. Benerado
    type: 'documentation',
    timestamp: new Date('2025-08-25T15:45:00+00:00'),
    description:
      'Documented the philosophical implications of building WorkSight while being subjected to WorkSight',
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T15:45:00+00:00'),
  },
  {
    id: '4aee156a-86b5-4c37-94e7-4f3f3208e27a',
    source_id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    external_id: 'META-001-create',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    type: 'task_creation',
    timestamp: new Date('2025-08-25T15:30:00+00:00'),
    description: 'Created meta-documentation task - the recursion deepens',
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T15:30:00+00:00'),
  },
];
