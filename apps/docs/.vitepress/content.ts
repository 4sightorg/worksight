import type { DefaultTheme } from 'vitepress';

const mainguide = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Introduction', link: '/guide/introduction' },
      { text: 'Quick Start', link: '/guide/getting-started' },
      { text: 'Installation', link: '/guide/installation' },
      { text: 'Configuration', link: '/guide/configuration' },
    ],
  },
  {
    text: 'Features',
    items: [
      { text: 'Survey System', link: '/features/survey-system' },
      { text: 'Burnout Assessment', link: '/features/burnout-assessment' },
      { text: 'Admin Dashboard', link: '/features/admin-dashboard' },
      { text: 'Reporting', link: '/features/reporting' },
    ],
  },
];

const legal = [
  {
    text: 'Legal Documents',
    items: [
      { text: 'Privacy Policy', link: '/legal/privacy-policy' },
      { text: 'Terms of Service', link: '/legal/terms-of-service' },
      { text: 'Cookie Policy', link: '/legal/cookie-policy' },
    ],
  },
];

const dev = [
  {
    text: 'Dev Documentation',
    link: '/dev/overview',
    items: [
      { text: 'Features', link: '/dev/features' },
      { text: 'Steps', link: '/dev/steps' },
      {
        text: 'Tech Stack',
        items: [
          { text: 'Jest', link: '/dev/jest' },
          { text: 'JSDoc', link: '/dev/jsdoc' },
          { text: 'NextJS', link: '/dev/nextjs' },
          { text: 'VitePress', link: '/dev/vitepress' },
          { text: 'Zustand', link: '/dev/zustand' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Overview', link: '/dev/api/overview' },
          { text: 'Authentication', link: '/dev/api/authentication' },
          { text: 'Survey Endpoints', link: '/dev/api/survey-endpoints' },
          { text: 'User Management', link: '/dev/api/user-management' },
        ],
      },
    ],
  },
];

export const nav = [
  { text: 'Guide', link: '/guide/getting-started' },
  { text: 'Dev', link: '/dev/overview' },
  { text: 'Legal', link: '/legal/privacy-policy' },
];

export const sidebar: DefaultTheme.Sidebar = {
  '/guide/': mainguide,
  '/legal/': legal,
  '/dev': dev,
};
