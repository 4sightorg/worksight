import { defineConfig, loadEnv } from 'vitepress';
import { nav, sidebar } from './content';

const env = loadEnv('', process.cwd());
const hostname = env.VITE_HOSTNAME || 'http://localhost:4173';

export default defineConfig({
  title: 'WorkSight',
  description: 'See the signs. Prevent burnout. Build resilience.',
  srcDir: 'website',
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/assets/logos/logo.png' }],
  ],

  sitemap: {
    hostname,
  },
  base: env.VITE_BASE || '/',

  themeConfig: {
    logo: '/assets/logos/logo.png',
    siteTitle: 'WorkSight',
    nav,
    sidebar,
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