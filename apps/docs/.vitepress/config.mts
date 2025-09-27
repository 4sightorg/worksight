
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vitepress';
import { nav, sidebar } from './content';


const __dirname = dirname(fileURLToPath(import.meta.url));
const env = loadEnv('', process.cwd());
const hostname = env.VITE_HOSTNAME || 'http://localhost:4173';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@worksight/assets': resolve(__dirname, '../../../packages/assets')
      }
    }
  },
  title: 'WorkSight',
  description: 'See the signs. Prevent burnout. Build resilience.',
  srcDir: 'website',
  outDir: '.vitepress/dist',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
  ],
  sitemap: {
    hostname,
  },
  base: env.VITE_BASE || '/',

  themeConfig: {
    logo: '/logo.png',
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
