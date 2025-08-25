import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'WorkSight Documentation',
  description: 'Employee Burnout Assessment Tool - Comprehensive Documentation',
  base: '/docs/',
  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/overview' },
      { text: 'Legal', link: '/legal/privacy-policy' },
    ],

    sidebar: {
      '/guide/': [
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
            { text: 'Survey System', link: '/guide/survey-system' },
            { text: 'Burnout Assessment', link: '/guide/burnout-assessment' },
            { text: 'Admin Dashboard', link: '/guide/admin-dashboard' },
            { text: 'Reporting', link: '/guide/reporting' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Survey Endpoints', link: '/api/survey-endpoints' },
            { text: 'User Management', link: '/api/user-management' },
          ],
        },
      ],
      '/legal/': [
        {
          text: 'Legal Documents',
          items: [
            { text: 'Privacy Policy', link: '/legal/privacy-policy' },
            { text: 'Terms of Service', link: '/legal/terms-of-service' },
            { text: 'Cookie Policy', link: '/legal/cookie-policy' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/4sightorg/worksight' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present 4Sight Organization',
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
  ],
});
