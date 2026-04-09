// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

function isKnownAstroUnusedExternalImportWarning(warning) {
  return (
    warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
    warning.exporter === '@astrojs/internal-helpers/remote' &&
    warning.ids?.some((id) =>
      id.includes('node_modules/astro/dist/assets/utils/index.js'),
    )
  );
}

export default defineConfig({
  site: 'https://realmindsai.github.io',
  base: '/haif-project/',
  compressHTML: true,

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (isKnownAstroUnusedExternalImportWarning(warning)) {
            return;
          }
          defaultHandler(warning);
        },
      },
    },
  },

  integrations: [sitemap()],
});
