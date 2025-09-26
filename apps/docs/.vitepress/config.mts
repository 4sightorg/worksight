
import { defineConfig, loadEnv } from 'vitepress';

const env = loadEnv('', process.cwd());
const hostname = env.VITE_HOSTNAME || 'http://localhost:4173';

export default defineConfig({
  title: 'WorkSight',
  description: 'See the signs. Prevent burnout. Build resilience.',
  srcDir: 'website',
  outDir: '.vitepress/dist',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/assets/logo.png' }],
  ],
  sitemap: {
    hostname,
  },
  base: env.VITE_BASE || '/',

  themeConfig: {
    logo: '/assets/logo.png',
    siteTitle: 'WorkSight',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Dev', link: '/dev/overview' },
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
            { text: 'Survey System', link: '/features/survey-system' },
            { text: 'Burnout Assessment', link: '/features/burnout-assessment' },
            { text: 'Admin Dashboard', link: '/features/admin-dashboard' },
            { text: 'Reporting', link: '/features/reporting' },
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
      '/dev': [
        {
          text: 'Dev Documentation',
          link: "/dev/overview",
          items: [
            { text: 'Features', link: '/dev/features' },
            { text: 'Steps', link: '/dev/steps' },
            {
              text: "Tech Stack",
              items: [
                { text: 'Jest', link: '/dev/jest' },
                { text: 'JSDoc', link: '/dev/jsdoc' },
                { text: 'NextJS', link: '/dev/nextjs' },
                { text: 'VitePress', link: '/dev/vitepress' },
                { text: 'Zustand', link: '/dev/zustand' },
              ]
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
          ]
        }
      ]
    },
    search: {
      provider: 'local'
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/4sightorg/worksight' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present 4Sight',
    },
  },
});
