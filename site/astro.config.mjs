// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

const ASTRO_REMOTE_UNUSED_IMPORT_NAMES = [
  'matchHostname',
  'matchPathname',
  'matchPort',
  'matchProtocol',
];

function isKnownAstroUnusedExternalImportWarning(warning) {
  return (
    warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
    warning.exporter === '@astrojs/internal-helpers/remote' &&
    Array.isArray(warning.names) &&
    warning.names.length === ASTRO_REMOTE_UNUSED_IMPORT_NAMES.length &&
    ASTRO_REMOTE_UNUSED_IMPORT_NAMES.every((name) =>
      warning.names.includes(name),
    )
  );
}

export default defineConfig({
  site: 'https://hospitalacupuncture.com',
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
