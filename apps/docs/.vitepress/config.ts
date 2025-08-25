import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vitepress';

const env = loadEnv('', process.cwd());
const hostname = env.VITE_HOSTNAME || 'http://localhost:4173';

export default defineConfig({
  outDir: 'dist',
  cleanUrls: true,
  title: 'WorkSight',
  description: 'Check your tasks, manage your well being.',
  sitemap: {
    hostname,
  },
  base: '/docs/',
  themeConfig: {
    logo: '/home/logo.png',
    siteTitle: 'WorkSight',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/overview' },
    ],
  },
  ignoreDeadLinks: true,

  vite: {
    resolve: {
      alias: [
        {
          find: /^.*VPSwitchAppearance\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/CustomSwitchAppearance.vue', import.meta.url)
          ),
        },
      ],
    },
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
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
