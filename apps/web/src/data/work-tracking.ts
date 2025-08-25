import { dataSources, type DataSource } from './data-sources';

// Types matching the database schema with direct data source references
export type Assignment = {
  id: string;
  source: DataSource | null; // Direct reference instead of source_id
  external_id: string | null;
  employee_id: string | null;
  assignment_type: string | null;
  title: string | null;
  status: string | null;
  created_at: Date;
  updated_at: Date;
  sprint_name: string | null;
  epic_key: string | null;
  story_points: number | null;
  priority_level: string | null;
};

export type Activity = {
  id: string;
  source: DataSource | null; // Direct reference instead of source_id
  external_id: string | null;
  employee_id: string | null;
  activity_type: string | null;
  activity_timestamp: Date;
  description: string | null;
  is_after_hours: boolean | null;
  is_weekend: boolean | null;
  is_urgent: boolean | null;
  created_at: Date;
};

type AssignmentData = {
  [key: string]: Assignment;
};

type ActivityData = {
  [key: string]: Activity;
};

// Direct data source references - much cleaner!
const DATA_SOURCES = {
  JIRA_CLOUD: dataSources['56a0b012-c267-4c33-b198-26ffbf31c98a'],
  TRELLO_BOARD: dataSources['88ff6d64-4749-4fa6-a89b-7ffded103c08'],
  GITHUB_REPO: dataSources['98e79144-5209-470a-8930-4568edf9172f'],
  ODOO_HR: dataSources['a95a41a3-e95d-4b93-a07c-b59bbd4001e6'],
  SLACK_WORKSPACE: dataSources['b2c4d8e1-9f7a-4b3e-8c5d-1a2f3e4d5c6b'],
};

// 🎬 4sight WorkSight Assignments - Breaking the 4th Wall!
export const assignments: AssignmentData = {
  // Epic: WorkSight Platform Development 🚀
  'task-0001-4sight-meta-001': {
    id: 'task-0001-4sight-meta-001',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'WS-001',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    assignment_type: 'feature',
    title: 'Implement theme toggle with sun/moon icons for WorkSight docs',
    status: 'completed',
    created_at: new Date('2025-08-20T09:00:00+00:00'),
    updated_at: new Date('2025-08-25T14:30:00+00:00'),
    sprint_name: 'Meta Sprint 1 - Building Our Own Tools',
    epic_key: 'WORKSIGHT-BOOTSTRAP',
    story_points: 5,
    priority_level: 'high',
  },
  'task-0002-4sight-meta-002': {
    id: 'task-0002-4sight-meta-002',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'WS-002',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    assignment_type: 'technical-debt',
    title: 'Unify Supabase client utilities across Next.js app',
    status: 'completed',
    created_at: new Date('2025-08-25T08:00:00+00:00'),
    updated_at: new Date('2025-08-25T16:45:00+00:00'),
    sprint_name: 'Meta Sprint 1 - Building Our Own Tools',
    epic_key: 'WORKSIGHT-BOOTSTRAP',
    story_points: 8,
    priority_level: 'critical',
  },
  'task-0003-4sight-frontend-001': {
    id: 'task-0003-4sight-frontend-001',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'WS-003',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b', // Adriel M. Magalona
    assignment_type: 'feature',
    title: 'Design and implement employee dashboard with real-time attendance',
    status: 'in-progress',
    created_at: new Date('2025-08-22T10:00:00+00:00'),
    updated_at: new Date('2025-08-25T11:20:00+00:00'),
    sprint_name: 'Meta Sprint 1 - Building Our Own Tools',
    epic_key: 'EMPLOYEE-DASHBOARD',
    story_points: 13,
    priority_level: 'high',
  },
  'task-0004-4sight-data-001': {
    id: 'task-0004-4sight-data-001',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'WS-004',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8', // Kiel Ethan L. Lanzanas
    assignment_type: 'analytics',
    title: 'Build ML model for burnout prediction using attendance patterns',
    status: 'in-progress',
    created_at: new Date('2025-08-21T14:00:00+00:00'),
    updated_at: new Date('2025-08-25T09:15:00+00:00'),
    sprint_name: 'AI/ML Sprint 1 - Predictive Insights',
    epic_key: 'BURNOUT-DETECTION',
    story_points: 21,
    priority_level: 'medium',
  },
  'task-0005-4sight-data-002': {
    id: 'task-0005-4sight-data-002',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'WS-005',
    employee_id: '88165ccb-2c80-455a-9ace-466a30448f67', // Ellah D. Benerado
    assignment_type: 'research',
    title: 'Research employee wellness indicators from productivity data',
    status: 'planning',
    created_at: new Date('2025-08-24T16:00:00+00:00'),
    updated_at: new Date('2025-08-24T16:00:00+00:00'),
    sprint_name: 'AI/ML Sprint 1 - Predictive Insights',
    epic_key: 'BURNOUT-DETECTION',
    story_points: 8,
    priority_level: 'medium',
  },
  // Fun meta tasks - Breaking the 4th wall! 🎭
  'task-0006-4sight-meta-003': {
    id: 'task-0006-4sight-meta-003',
    source: DATA_SOURCES.TRELLO_BOARD,
    external_id: 'META-001',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    assignment_type: 'documentation',
    title: 'Document the irony of tracking our own productivity while building productivity tools',
    status: 'backlog',
    created_at: new Date('2025-08-25T15:30:00+00:00'),
    updated_at: new Date('2025-08-25T15:30:00+00:00'),
    sprint_name: 'Meta Sprint 2 - Self-Awareness',
    epic_key: 'FOURTH-WALL-BREAKS',
    story_points: 3,
    priority_level: 'low',
  },
  'task-0007-4sight-frontend-002': {
    id: 'task-0007-4sight-frontend-002',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'WS-007',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b', // Adriel M. Magalona
    assignment_type: 'feature',
    title: "Add easter egg: 'You're being watched' notification when viewing surveillance features",
    status: 'backlog',
    created_at: new Date('2025-08-25T12:00:00+00:00'),
    updated_at: new Date('2025-08-25T12:00:00+00:00'),
    sprint_name: 'Meta Sprint 2 - Self-Awareness',
    epic_key: 'FOURTH-WALL-BREAKS',
    story_points: 2,
    priority_level: 'low',
  },
  'task-0008-4sight-infra-001': {
    id: 'task-0008-4sight-infra-001',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'WS-008',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    assignment_type: 'infrastructure',
    title: 'Set up monitoring for our monitoring system (meta-monitoring)',
    status: 'todo',
    created_at: new Date('2025-08-25T13:45:00+00:00'),
    updated_at: new Date('2025-08-25T13:45:00+00:00'),
    sprint_name: 'Infrastructure Sprint 1',
    epic_key: 'PLATFORM-STABILITY',
    story_points: 5,
    priority_level: 'medium',
  },
};

// 🎬 4sight WorkSight Activities - The Plot Thickens!
export const activities: ActivityData = {
  // Today's activities - Aug 25, 2025
  'activity-0001-today-001': {
    id: 'activity-0001-today-001',
    source: DATA_SOURCES.GITHUB_REPO,
    external_id: 'commit-abc123',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    activity_type: 'code_commit',
    activity_timestamp: new Date('2025-08-25T08:30:00+00:00'),
    description:
      "feat: unified Supabase client - ironic that we're fixing auth while building auth tracking",
    is_after_hours: false,
    is_weekend: true, // Sunday work!
    is_urgent: false,
    created_at: new Date('2025-08-25T08:30:00+00:00'),
  },
  'activity-0002-today-002': {
    id: 'activity-0002-today-002',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'WS-002-update',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    activity_type: 'task_update',
    activity_timestamp: new Date('2025-08-25T10:15:00+00:00'),
    description:
      "Moved Supabase unification task to 'completed' - our own productivity just got tracked!",
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T10:15:00+00:00'),
  },
  'activity-0003-today-003': {
    id: 'activity-0003-today-003',
    source: DATA_SOURCES.GITHUB_REPO,
    external_id: 'commit-def456',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b', // Adriel M. Magalona
    activity_type: 'code_commit',
    activity_timestamp: new Date('2025-08-25T11:45:00+00:00'),
    description: "ui: added 'Big Brother is watching' tooltip to attendance tracker (very meta)",
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T11:45:00+00:00'),
  },
  'activity-0004-today-004': {
    id: 'activity-0004-today-004',
    source: DATA_SOURCES.SLACK_WORKSPACE,
    external_id: 'msg-789',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8', // Kiel Ethan L. Lanzanas
    activity_type: 'communication',
    activity_timestamp: new Date('2025-08-25T13:20:00+00:00'),
    description:
      "Posted in #ai-ml: 'Training AI to detect burnout while experiencing burnout. The recursion is real.'",
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T13:20:00+00:00'),
  },
  'activity-0005-today-005': {
    id: 'activity-0005-today-005',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'WS-004-update',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8', // Kiel Ethan L. Lanzanas
    activity_type: 'task_update',
    activity_timestamp: new Date('2025-08-25T14:00:00+00:00'),
    description: 'Added story point estimate for burnout ML model - feeling the irony intensely',
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T14:00:00+00:00'),
  },

  // Yesterday's activities - Aug 24, 2025 (Saturday)
  'activity-0006-yesterday-001': {
    id: 'activity-0006-yesterday-001',
    source: DATA_SOURCES.TRELLO_BOARD,
    external_id: 'research-001',
    employee_id: '88165ccb-2c80-455a-9ace-466a30448f67', // Ellah D. Benerado
    activity_type: 'research',
    activity_timestamp: new Date('2025-08-24T16:30:00+00:00'),
    description:
      'Started researching wellness indicators - immediately felt surveilled by our own future product',
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-24T16:30:00+00:00'),
  },
  'activity-0007-yesterday-002': {
    id: 'activity-0007-yesterday-002',
    source: DATA_SOURCES.GITHUB_REPO,
    external_id: 'commit-ghi789',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b', // Adriel M. Magalona
    activity_type: 'code_commit',
    activity_timestamp: new Date('2025-08-24T19:15:00+00:00'),
    description:
      'refactor: dashboard components - working late to build a system that will tell us we work too late',
    is_after_hours: true,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-24T19:15:00+00:00'),
  },

  // Friday activities - Aug 22, 2025 (Regular workday)
  'activity-0008-friday-001': {
    id: 'activity-0008-friday-001',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'WS-003-create',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b', // Adriel M. Magalona
    activity_type: 'task_creation',
    activity_timestamp: new Date('2025-08-22T10:00:00+00:00'),
    description: "Created dashboard task - we're literally building the panopticon",
    is_after_hours: false,
    is_weekend: false,
    is_urgent: false,
    created_at: new Date('2025-08-22T10:00:00+00:00'),
  },
  'activity-0009-friday-002': {
    id: 'activity-0009-friday-002',
    source: DATA_SOURCES.SLACK_WORKSPACE,
    external_id: 'msg-456',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    activity_type: 'communication',
    activity_timestamp: new Date('2025-08-22T14:30:00+00:00'),
    description:
      "Team standup: 'We're 4sight, we have 4sight, and we're breaking the 4th wall. Meta level: maximum.'",
    is_after_hours: false,
    is_weekend: false,
    is_urgent: false,
    created_at: new Date('2025-08-22T14:30:00+00:00'),
  },
  'activity-0010-friday-003': {
    id: 'activity-0010-friday-003',
    source: DATA_SOURCES.GITHUB_REPO,
    external_id: 'commit-jkl012',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8', // Kiel Ethan L. Lanzanas
    activity_type: 'code_commit',
    activity_timestamp: new Date('2025-08-22T16:45:00+00:00'),
    description: 'ml: initial burnout detection model - using our own stress to train it',
    is_after_hours: false,
    is_weekend: false,
    is_urgent: false,
    created_at: new Date('2025-08-22T16:45:00+00:00'),
  },

  // After-hours and urgent activities
  'activity-0011-urgent-001': {
    id: 'activity-0011-urgent-001',
    source: DATA_SOURCES.SLACK_WORKSPACE,
    external_id: 'alert-001',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    activity_type: 'incident_response',
    activity_timestamp: new Date('2025-08-23T22:30:00+00:00'),
    description: 'URGENT: Authentication server down - ironic timing while building auth tracking',
    is_after_hours: true,
    is_weekend: false,
    is_urgent: true,
    created_at: new Date('2025-08-23T22:30:00+00:00'),
  },
  'activity-0012-urgent-002': {
    id: 'activity-0012-urgent-002',
    source: DATA_SOURCES.GITHUB_REPO,
    external_id: 'hotfix-001',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    activity_type: 'hotfix',
    activity_timestamp: new Date('2025-08-23T23:15:00+00:00'),
    description: 'hotfix: restored auth service - our surveillance system can continue surveilling',
    is_after_hours: true,
    is_weekend: false,
    is_urgent: true,
    created_at: new Date('2025-08-23T23:15:00+00:00'),
  },

  // More meta activities
  'activity-0013-meta-001': {
    id: 'activity-0013-meta-001',
    source: DATA_SOURCES.TRELLO_BOARD,
    external_id: 'meta-reflection-001',
    employee_id: '88165ccb-2c80-455a-9ace-466a30448f67', // Ellah D. Benerado
    activity_type: 'documentation',
    activity_timestamp: new Date('2025-08-25T15:45:00+00:00'),
    description:
      'Documented the philosophical implications of building WorkSight while being subjected to WorkSight',
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T15:45:00+00:00'),
  },
  'activity-0014-meta-002': {
    id: 'activity-0014-meta-002',
    source: DATA_SOURCES.JIRA_CLOUD,
    external_id: 'META-001-create',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025', // John Carlo Santos
    activity_type: 'task_creation',
    activity_timestamp: new Date('2025-08-25T15:30:00+00:00'),
    description: 'Created meta-documentation task - the recursion deepens',
    is_after_hours: false,
    is_weekend: true,
    is_urgent: false,
    created_at: new Date('2025-08-25T15:30:00+00:00'),
  },
};

// Utility functions for working with assignments and activities
export const getAssignmentsByEmployee = (employeeId: string): Assignment[] => {
  return Object.values(assignments).filter((assignment) => assignment.employee_id === employeeId);
};

export const getActivitiesByEmployee = (employeeId: string): Activity[] => {
  return Object.values(activities).filter((activity) => activity.employee_id === employeeId);
};

export const getAssignmentsByStatus = (status: string): Assignment[] => {
  return Object.values(assignments).filter((assignment) => assignment.status === status);
};

export const getActivitiesByDate = (date: Date): Activity[] => {
  const targetDate = date.toISOString().split('T')[0];
  return Object.values(activities).filter(
    (activity) => activity.activity_timestamp.toISOString().split('T')[0] === targetDate
  );
};

export const getAfterHoursActivities = (): Activity[] => {
  return Object.values(activities).filter((activity) => activity.is_after_hours === true);
};

export const getWeekendActivities = (): Activity[] => {
  return Object.values(activities).filter((activity) => activity.is_weekend === true);
};

export const getUrgentActivities = (): Activity[] => {
  return Object.values(activities).filter((activity) => activity.is_urgent === true);
};

export const getEmployeeProductivityStats = (employeeId: string) => {
  const employeeAssignments = getAssignmentsByEmployee(employeeId);
  const employeeActivities = getActivitiesByEmployee(employeeId);

  const completedTasks = employeeAssignments.filter((a) => a.status === 'completed').length;
  const totalStoryPoints = employeeAssignments.reduce((sum, a) => sum + (a.story_points || 0), 0);
  const completedStoryPoints = employeeAssignments
    .filter((a) => a.status === 'completed')
    .reduce((sum, a) => sum + (a.story_points || 0), 0);

  const afterHoursActivities = employeeActivities.filter((a) => a.is_after_hours).length;
  const weekendActivities = employeeActivities.filter((a) => a.is_weekend).length;
  const urgentActivities = employeeActivities.filter((a) => a.is_urgent).length;

  return {
    totalTasks: employeeAssignments.length,
    completedTasks,
    completionRate:
      employeeAssignments.length > 0 ? (completedTasks / employeeAssignments.length) * 100 : 0,
    totalStoryPoints,
    completedStoryPoints,
    storyPointsCompletionRate:
      totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0,
    totalActivities: employeeActivities.length,
    afterHoursActivities,
    weekendActivities,
    urgentActivities,
    workLifeBalanceScore: Math.max(0, 100 - afterHoursActivities * 10 - weekendActivities * 5), // Lower is worse
  };
};

export const getTeamMetaStats = () => {
  const allActivities = Object.values(activities);
  const metaActivities = allActivities.filter(
    (a) =>
      a.description?.toLowerCase().includes('meta') ||
      a.description?.toLowerCase().includes('ironic') ||
      a.description?.toLowerCase().includes('4th wall') ||
      a.description?.toLowerCase().includes('recursive')
  );

  const allAssignments = Object.values(assignments);
  const metaAssignments = allAssignments.filter(
    (a) =>
      a.epic_key === 'FOURTH-WALL-BREAKS' ||
      a.title?.toLowerCase().includes('meta') ||
      a.title?.toLowerCase().includes('ironic')
  );

  return {
    totalMetaActivities: metaActivities.length,
    totalMetaAssignments: metaAssignments.length,
    metaActivityPercentage: (metaActivities.length / allActivities.length) * 100,
    selfAwarenessLevel: metaActivities.length + metaAssignments.length,
    fourthWallIntegrity: Math.max(0, 100 - metaActivities.length * 5), // How broken is the 4th wall?
  };
};

// Example usage and fun statistics:
// const johnStats = getEmployeeProductivityStats("08b6fc43-77e6-4fcf-8ed8-dafc16b4b025");
// const teamMeta = getTeamMetaStats();
// const todayActivities = getActivitiesByDate(new Date("2025-08-25"));
// const weekendWarriors = getWeekendActivities();
// console.log("4sight's self-awareness level:", teamMeta.selfAwarenessLevel);
// console.log("4th wall integrity:", teamMeta.fourthWallIntegrity + "%");

// 🚀 DIRECT OBJECT LINKING BENEFITS - No more ID lookups!
export const getAssignmentsByDataSource = (dataSourceName: string): Assignment[] => {
  return Object.values(assignments).filter(
    (assignment) => assignment.source?.name === dataSourceName
  );
};

export const getActivitiesByDataSourceType = (type: string): Activity[] => {
  return Object.values(activities).filter((activity) => activity.source?.type.includes(type));
};

export const getDataSourceUsageStats = () => {
  const allAssignments = Object.values(assignments);
  const allActivities = Object.values(activities);

  const sourceStats = {} as Record<
    string,
    {
      name: string;
      assignments: number;
      activities: number;
      total: number;
      types: string[];
    }
  >;

  // Count assignments by source
  allAssignments.forEach((assignment) => {
    if (assignment.source) {
      const sourceId = assignment.source.id;
      if (!sourceStats[sourceId]) {
        sourceStats[sourceId] = {
          name: assignment.source.name,
          assignments: 0,
          activities: 0,
          total: 0,
          types: assignment.source.type,
        };
      }
      sourceStats[sourceId].assignments++;
      sourceStats[sourceId].total++;
    }
  });

  // Count activities by source
  allActivities.forEach((activity) => {
    if (activity.source) {
      const sourceId = activity.source.id;
      if (!sourceStats[sourceId]) {
        sourceStats[sourceId] = {
          name: activity.source.name,
          assignments: 0,
          activities: 0,
          total: 0,
          types: activity.source.type,
        };
      }
      sourceStats[sourceId].activities++;
      sourceStats[sourceId].total++;
    }
  });

  return sourceStats;
};

// 🎭 Fun fact: This file itself is being tracked as an activity while we create sample tracking data!
// Meta level: MAXIMUM 🚀
// Performance impact of direct linking: ZERO (for our scale) 📈
