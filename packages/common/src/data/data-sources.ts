// Data Sources - Integration points for WorkSight
export type DataSource = {
  id: string;
  name: string;
  type: string[];
  base_url: string;
  is_active: boolean;
  modules: string[];
  created_at: Date;
  updated_at: Date;
};

type DataSourceData = {
  [key: string]: DataSource;
};

// 🔗 4sight WorkSight Data Sources - Our Integration Arsenal
export const dataSources: DataSourceData = {
  '56a0b012-c267-4c33-b198-26ffbf31c98a': {
    id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    name: 'Jira Cloud',
    type: ['task_management', 'project_management'],
    base_url: 'https://4sight.atlassian.net',
    is_active: true,
    modules: ['sprints', 'epics'],
    created_at: new Date('2025-08-24T19:14:28.070207+00:00'),
    updated_at: new Date('2025-08-24T19:14:28.070207+00:00'),
  },
  '88ff6d64-4749-4fa6-a89b-7ffded103c08': {
    id: '88ff6d64-4749-4fa6-a89b-7ffded103c08',
    name: 'Trello Board',
    type: ['task_management', 'project_management'],
    base_url: 'https://trello.com/b/boardid',
    is_active: true,
    modules: ['taskboard'],
    created_at: new Date('2025-08-24T19:14:28.070207+00:00'),
    updated_at: new Date('2025-08-24T19:14:28.070207+00:00'),
  },
  '98e79144-5209-470a-8930-4568edf9172f': {
    id: '98e79144-5209-470a-8930-4568edf9172f',
    name: 'GitHub Repo',
    type: ['vcs'],
    base_url: 'https://github.com/4sight/worksight',
    is_active: true,
    modules: ['issues', 'prs', 'commits'],
    created_at: new Date('2025-08-24T19:14:28.070207+00:00'),
    updated_at: new Date('2025-08-24T19:14:28.070207+00:00'),
  },
  'a95a41a3-e95d-4b93-a07c-b59bbd4001e6': {
    id: 'a95a41a3-e95d-4b93-a07c-b59bbd4001e6',
    name: 'Odoo HR',
    type: ['erp'],
    base_url: 'https://odoo.4sight.local',
    is_active: true,
    modules: ['hr', 'attendance'],
    created_at: new Date('2025-08-24T19:14:28.070207+00:00'),
    updated_at: new Date('2025-08-24T19:14:28.070207+00:00'),
  },
  'b2c4d8e1-9f7a-4b3e-8c5d-1a2f3e4d5c6b': {
    id: 'b2c4d8e1-9f7a-4b3e-8c5d-1a2f3e4d5c6b',
    name: 'Slack Workspace',
    type: ['communication', 'collaboration'],
    base_url: 'https://4sight.slack.com',
    is_active: true,
    modules: ['messages', 'channels', 'reactions'],
    created_at: new Date('2025-08-25T19:20:00.000000+00:00'),
    updated_at: new Date('2025-08-25T19:20:00.000000+00:00'),
  },
};

// Helper constants for easy reference
export const DATA_SOURCE_IDS = {
  JIRA_CLOUD: '56a0b012-c267-4c33-b198-26ffbf31c98a',
  TRELLO_BOARD: '88ff6d64-4749-4fa6-a89b-7ffded103c08',
  GITHUB_REPO: '98e79144-5209-470a-8930-4568edf9172f',
  ODOO_HR: 'a95a41a3-e95d-4b93-a07c-b59bbd4001e6',
  SLACK_WORKSPACE: 'b2c4d8e1-9f7a-4b3e-8c5d-1a2f3e4d5c6b',
} as const;

// Utility functions for working with data sources
export const getDataSourceById = (id: string): DataSource | undefined => {
  return dataSources[id];
};

export const getDataSourcesByType = (type: string): DataSource[] => {
  return Object.values(dataSources).filter((source) => source.type.includes(type));
};

export const getActiveDataSources = (): DataSource[] => {
  return Object.values(dataSources).filter((source) => source.is_active);
};

export const getDataSourcesByModule = (module: string): DataSource[] => {
  return Object.values(dataSources).filter((source) => source.modules.includes(module));
};

export const getDataSourceStats = () => {
  const allSources = Object.values(dataSources);
  const activeSources = getActiveDataSources();

  const typeBreakdown = allSources.reduce(
    (acc, source) => {
      source.type.forEach((type) => {
        acc[type] = (acc[type] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const moduleBreakdown = allSources.reduce(
    (acc, source) => {
      source.modules.forEach((module) => {
        acc[module] = (acc[module] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalSources: allSources.length,
    activeSources: activeSources.length,
    inactiveSources: allSources.length - activeSources.length,
    typeBreakdown,
    moduleBreakdown,
    integrationCoverage: (activeSources.length / allSources.length) * 100,
  };
};

// Example usage:
// const jiraSource = getDataSourceById(DATA_SOURCE_IDS.JIRA_CLOUD);
// const taskManagementSources = getDataSourcesByType("task_management");
// const sprintCapableSources = getDataSourcesByModule("sprints");
// const stats = getDataSourceStats();
