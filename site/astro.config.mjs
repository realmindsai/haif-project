// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://realmindsai.github.io',
  base: '/haif-project/',
  compressHTML: true,

  build: {
    inlineStylesheets: 'auto',
  },

  integrations: [sitemap()],
});