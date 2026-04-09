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

  vite: {
    logLevel: 'error',
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (
            warning.id?.includes('node_modules/astro/dist/assets/utils/index.js') &&
            warning.message.includes('matchHostname')
          ) {
            return;
          }

          defaultHandler(warning);
        },
      },
    },
  },

  integrations: [sitemap()],
});
