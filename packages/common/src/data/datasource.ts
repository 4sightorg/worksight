// Data Sources - Integration points for WorkSight

import { DataSource } from "../types";

// 🔗 4sight WorkSight Data Sources - Our Integration Arsenal
export const DataSources: DataSource[] = [
  {
    id: '56a0b012-c267-4c33-b198-26ffbf31c98a',
    name: 'Jira Cloud',
    type: ['task_management', 'project_management'],
    base_url: 'https://4sight.atlassian.net',
    is_active: true,
    modules: ['sprints', 'epics'],
    created_at: new Date('2025-08-24T19:14:28.070207+00:00'),
    updated_at: new Date('2025-08-24T19:14:28.070207+00:00'),
  },
  {
    id: '88ff6d64-4749-4fa6-a89b-7ffded103c08',
    name: 'Trello Board',
    type: ['task_management', 'project_management'],
    base_url: 'https://trello.com/b/boardid',
    is_active: true,
    modules: ['taskboard'],
    created_at: new Date('2025-08-24T19:14:28.070207+00:00'),
    updated_at: new Date('2025-08-24T19:14:28.070207+00:00'),
  },
  {
    id: '98e79144-5209-470a-8930-4568edf9172f',
    name: 'GitHub Repo',
    type: ['vcs'],
    base_url: 'https://github.com/4sight/worksight',
    is_active: true,
    modules: ['issues', 'prs', 'commits'],
    created_at: new Date('2025-08-24T19:14:28.070207+00:00'),
    updated_at: new Date('2025-08-24T19:14:28.070207+00:00'),
  },
  {
    id: 'a95a41a3-e95d-4b93-a07c-b59bbd4001e6',
    name: 'Odoo HR',
    type: ['erp'],
    base_url: 'https://odoo.4sight.local',
    is_active: true,
    modules: ['hr', 'attendance'],
    created_at: new Date('2025-08-24T19:14:28.070207+00:00'),
    updated_at: new Date('2025-08-24T19:14:28.070207+00:00'),
  },
  {
    id: 'b2c4d8e1-9f7a-4b3e-8c5d-1a2f3e4d5c6b',
    name: 'Slack Workspace',
    type: ['communication', 'collaboration'],
    base_url: 'https://4sight.slack.com',
    is_active: true,
    modules: ['messages', 'channels', 'reactions'],
    created_at: new Date('2025-08-25T19:20:00.000000+00:00'),
    updated_at: new Date('2025-08-25T19:20:00.000000+00:00'),
  },
];
