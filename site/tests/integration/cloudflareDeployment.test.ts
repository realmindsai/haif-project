import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

describe('cloudflare deployment configuration', () => {
  it('targets the production root domain without a GitHub Pages base path', () => {
    const astroConfigSource = readFileSync(
      resolve(process.cwd(), 'astro.config.mjs'),
      'utf8',
    );

    expect(astroConfigSource).toContain(
      "site: 'https://hospitalacupuncture.com'",
    );
    expect(astroConfigSource).not.toContain("base: '/haif-project/'");
  });

  it('uses root-relative navigation in the browser smoke test', () => {
    const e2eSource = readFileSync(
      resolve(process.cwd(), 'tests/e2e/exploration_intervention.spec.ts'),
      'utf8',
    );

    expect(e2eSource).toContain("await page.goto('/');");
    expect(e2eSource).toContain(
      "await explorationPage.goto('/framework/exploration/');",
    );
    expect(e2eSource).not.toContain('/haif-project/');
  });
});
