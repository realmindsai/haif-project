# Cloudflare Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace GitHub Pages with a manual Cloudflare Pages deployment flow for `hospitalacupuncture.com` and `www.hospitalacupuncture.com`, while keeping the HAIF Astro site verifiably correct at root-domain paths.

**Architecture:** Keep `main` as the only source branch, build the static site into `site/dist`, and deploy that artifact manually with `wrangler pages deploy`. Make the app root-domain aware by removing the GitHub Pages base path, then document the new operational workflow and the cutover steps in-repo.

**Tech Stack:** Astro 6, TypeScript, Vitest, Playwright, Node.js, Wrangler, Cloudflare Pages

---

## File Map

- `site/src/utils.ts` — Base-path helper for site URLs used by Astro pages and assets
- `site/tests/unit/url.test.ts` — Unit coverage for root-domain and subpath URL joining
- `site/astro.config.mjs` — Production site URL and base-path behavior
- `site/tests/integration/cloudflareDeployment.test.ts` — Source-level assertions for Cloudflare deployment config and docs
- `site/tests/e2e/exploration_intervention.spec.ts` — Browser smoke test proving root-path rendering still works
- `site/scripts/lib/cloudflareDeploy.mjs` — Pure helper functions for deployment guardrails and Wrangler arguments
- `site/scripts/deploy-cloudflare.mjs` — Manual production deploy entrypoint
- `site/tests/unit/cloudflareDeploy.test.ts` — Unit coverage for deployment guardrails
- `site/package.json` — Manual deployment script and Wrangler dependency
- `site/README.md` — Repo-local deploy instructions and correct production URL
- `docs/deployment/cloudflare_pages.md` — Canonical deployment runbook for Cloudflare setup, deploy, verification, and GitHub Pages retirement

---

### Task 1: Make URL generation root-domain safe

**Files:**
- Modify: `site/src/utils.ts`
- Test: `site/tests/unit/url.test.ts`

- [ ] **Step 1: Write the failing unit test**

Create `site/tests/unit/url.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { joinBaseUrl } from '../../src/utils';

describe('joinBaseUrl', () => {
  it('keeps root-domain asset paths rooted at slash', () => {
    expect(joinBaseUrl('/', '/images/hero-banner.jpg')).toBe(
      '/images/hero-banner.jpg',
    );
  });

  it('preserves an existing subpath deployment when present', () => {
    expect(joinBaseUrl('/haif-project/', '/images/hero-banner.jpg')).toBe(
      '/haif-project/images/hero-banner.jpg',
    );
  });

  it('normalizes paths that are missing a leading slash', () => {
    expect(joinBaseUrl('/', 'downloads/ponv_data_extraction_template.xlsx')).toBe(
      '/downloads/ponv_data_extraction_template.xlsx',
    );
  });
});
```

- [ ] **Step 2: Run the unit test to verify it fails**

Run: `cd site && npm run test:unit -- url.test.ts`

Expected: FAIL because `joinBaseUrl` is not exported from `src/utils.ts`.

- [ ] **Step 3: Implement a pure base-path helper and route `url()` through it**

Update `site/src/utils.ts`:

```ts
/** Prefix a path with the configured base URL so links work for both root-domain and subpath deployments. */
export function joinBaseUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedBase + normalizedPath;
}

export function url(path: string): string {
  return joinBaseUrl(import.meta.env.BASE_URL, path);
}
```

- [ ] **Step 4: Run the unit test to verify it passes**

Run: `cd site && npm run test:unit -- url.test.ts`

Expected: PASS with 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add site/src/utils.ts site/tests/unit/url.test.ts
git commit -m "test: cover root-domain url generation"
```

---

### Task 2: Cut Astro and browser smoke tests over to root paths

**Files:**
- Modify: `site/astro.config.mjs`
- Create: `site/tests/integration/cloudflareDeployment.test.ts`
- Modify: `site/tests/e2e/exploration_intervention.spec.ts`

- [ ] **Step 1: Write failing integration and e2e checks for root-domain behavior**

Create `site/tests/integration/cloudflareDeployment.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('cloudflare deployment configuration', () => {
  it('targets the production root domain without a GitHub Pages base path', () => {
    const astroConfigSource = readFileSync(
      resolve(process.cwd(), 'astro.config.mjs'),
      'utf8',
    );

    expect(astroConfigSource).toContain("site: 'https://hospitalacupuncture.com'");
    expect(astroConfigSource).not.toContain("base: '/haif-project/'");
  });

  it('uses root-relative navigation in the browser smoke test', () => {
    const e2eSource = readFileSync(
      resolve(process.cwd(), 'tests/e2e/exploration_intervention.spec.ts'),
      'utf8',
    );

    expect(e2eSource).toContain("await page.goto('/');");
    expect(e2eSource).toContain("await explorationPage.goto('/framework/exploration/');");
    expect(e2eSource).not.toContain('/haif-project/');
  });
});
```

Update `site/tests/e2e/exploration_intervention.spec.ts` so the root-path expectations are explicit:

```ts
import { expect, test } from '@playwright/test';

test('homepage hero and exploration intervention interactions render recovered content', async ({
  page,
}) => {
  await page.goto('/');
  const heroImage = page.getByRole('img', {
    name: /patient recovering in a hospital bed after surgery/i,
  });
  await expect(heroImage).toBeVisible();
  await expect(heroImage).toHaveAttribute('src', '/images/hero-banner.jpg');
  expect(
    await heroImage.evaluate((image) =>
      image instanceof HTMLImageElement ? image.naturalWidth : 0,
    ),
  ).toBeGreaterThan(0);

  const explorationPage = await page.context().newPage();
  await explorationPage.goto('/framework/exploration/');
  await expect(
    explorationPage.getByRole('heading', { name: /intervention/i }),
  ).toBeVisible();

  const manualAcupressureRow = explorationPage
    .locator('tbody tr')
    .filter({ hasText: 'Manual Acupressure' });
  await manualAcupressureRow.scrollIntoViewIfNeeded();
  const manualAcupressureDetails = manualAcupressureRow.locator(
    'details.comparison-toggle',
  );
  await manualAcupressureDetails
    .locator('summary', { hasText: 'View details' })
    .click();

  await expect(
    manualAcupressureDetails.getByText(/avoids needles/i),
  ).toBeVisible();
});
```

- [ ] **Step 2: Run the integration and e2e checks to verify they fail**

Run: `cd site && npm run test:integration -- cloudflareDeployment && npm run test:e2e -- exploration_intervention`

Expected:
- integration test FAILS because `astro.config.mjs` still contains the GitHub Pages `site` and `base`
- e2e FAILS because the hero `src` still renders as `/haif-project/images/hero-banner.jpg`

- [ ] **Step 3: Switch Astro to root-domain production config**

Update `site/astro.config.mjs`:

```js
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
```

- [ ] **Step 4: Run the integration and e2e checks to verify they pass**

Run: `cd site && npm run test:integration -- cloudflareDeployment && npm run test:e2e -- exploration_intervention`

Expected:
- integration test PASS
- e2e PASS with the hero image served from `/images/hero-banner.jpg`

- [ ] **Step 5: Commit**

```bash
git add site/astro.config.mjs site/tests/integration/cloudflareDeployment.test.ts site/tests/e2e/exploration_intervention.spec.ts
git commit -m "chore: switch site to root-domain paths"
```

---

### Task 3: Add a guarded manual Cloudflare deploy command

**Files:**
- Create: `site/scripts/lib/cloudflareDeploy.mjs`
- Create: `site/scripts/deploy-cloudflare.mjs`
- Modify: `site/package.json`
- Modify: `site/tests/integration/cloudflareDeployment.test.ts`
- Test: `site/tests/unit/cloudflareDeploy.test.ts`

- [ ] **Step 1: Write failing unit and integration tests for the deploy workflow**

Create `site/tests/unit/cloudflareDeploy.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  CLOUDFLARE_DEPLOY_DIR,
  CLOUDFLARE_PROJECT_NAME,
  getCloudflareDeployArgs,
  getCloudflareDeployBlockers,
} from '../../scripts/lib/cloudflareDeploy.mjs';

describe('cloudflare deploy helpers', () => {
  it('builds the wrangler deploy command for the production project', () => {
    expect(getCloudflareDeployArgs()).toEqual([
      'wrangler',
      'pages',
      'deploy',
      CLOUDFLARE_DEPLOY_DIR,
      `--project-name=${CLOUDFLARE_PROJECT_NAME}`,
    ]);
  });

  it('blocks deploys from a dirty or non-main worktree', () => {
    expect(
      getCloudflareDeployBlockers({
        branch: 'feature/cloudflare',
        gitStatusOutput: ' M site/README.md',
        distExists: false,
        env: {},
      }),
    ).toEqual([
      'Deploys must run from main. Current branch: feature/cloudflare.',
      'Working tree must be clean before deploying to Cloudflare Pages.',
      'Build output missing. Run `npm run build` before deploying.',
      'Missing CLOUDFLARE_ACCOUNT_ID.',
      'Missing CLOUDFLARE_API_TOKEN.',
    ]);
  });

  it('allows deploy when branch, build output, and credentials are ready', () => {
    expect(
      getCloudflareDeployBlockers({
        branch: 'main',
        gitStatusOutput: '',
        distExists: true,
        env: {
          CLOUDFLARE_ACCOUNT_ID: 'acct',
          CLOUDFLARE_API_TOKEN: 'token',
        },
      }),
    ).toEqual([]);
  });
});
```

Append this test block to `site/tests/integration/cloudflareDeployment.test.ts`:

```ts
  it('exposes a manual Cloudflare deploy script in package.json', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'),
    );

    expect(packageJson.scripts['deploy:cloudflare']).toBe(
      'node scripts/deploy-cloudflare.mjs',
    );
  });
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `cd site && npm run test:unit -- cloudflareDeploy && npm run test:integration -- cloudflareDeployment`

Expected:
- unit test FAILS because `cloudflareDeploy.mjs` does not exist
- integration test FAILS because `package.json` does not yet expose `deploy:cloudflare`

- [ ] **Step 3: Implement the deploy helper, deploy script, and package script**

Create `site/scripts/lib/cloudflareDeploy.mjs`:

```js
export const CLOUDFLARE_PROJECT_NAME = 'haif-project';
export const CLOUDFLARE_DEPLOY_DIR = 'dist';

export function getCloudflareDeployBlockers({
  branch,
  gitStatusOutput,
  distExists,
  env,
}) {
  const blockers = [];

  if (branch !== 'main') {
    blockers.push(`Deploys must run from main. Current branch: ${branch}.`);
  }

  if (gitStatusOutput.trim() !== '') {
    blockers.push('Working tree must be clean before deploying to Cloudflare Pages.');
  }

  if (!distExists) {
    blockers.push('Build output missing. Run `npm run build` before deploying.');
  }

  if (!env.CLOUDFLARE_ACCOUNT_ID) {
    blockers.push('Missing CLOUDFLARE_ACCOUNT_ID.');
  }

  if (!env.CLOUDFLARE_API_TOKEN) {
    blockers.push('Missing CLOUDFLARE_API_TOKEN.');
  }

  return blockers;
}

export function getCloudflareDeployArgs({
  directory = CLOUDFLARE_DEPLOY_DIR,
  projectName = CLOUDFLARE_PROJECT_NAME,
} = {}) {
  return ['wrangler', 'pages', 'deploy', directory, `--project-name=${projectName}`];
}
```

Create `site/scripts/deploy-cloudflare.mjs`:

```js
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  CLOUDFLARE_DEPLOY_DIR,
  getCloudflareDeployArgs,
  getCloudflareDeployBlockers,
} from './lib/cloudflareDeploy.mjs';

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `${command} ${args.join(' ')} failed`);
  }

  return result.stdout.trim();
}

const branch = run('git', ['branch', '--show-current']);
const gitStatusOutput = run('git', ['status', '--porcelain']);
const distPath = resolve(process.cwd(), CLOUDFLARE_DEPLOY_DIR);

const blockers = getCloudflareDeployBlockers({
  branch,
  gitStatusOutput,
  distExists: existsSync(distPath),
  env: process.env,
});

if (blockers.length > 0) {
  for (const blocker of blockers) {
    console.error(`- ${blocker}`);
  }
  process.exit(1);
}

const deploy = spawnSync('npx', getCloudflareDeployArgs(), {
  stdio: 'inherit',
  env: process.env,
});

process.exit(deploy.status ?? 1);
```

Update `site/package.json`:

```json
{
  "scripts": {
    "deploy:cloudflare": "node scripts/deploy-cloudflare.mjs"
  }
}
```

Install Wrangler as a repo-pinned dev dependency:

```bash
cd site && npm install -D wrangler
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd site && npm run test:unit -- cloudflareDeploy && npm run test:integration -- cloudflareDeployment`

Expected: PASS with the deploy helper tests and the package script assertion passing.

- [ ] **Step 5: Commit**

```bash
git add site/scripts/lib/cloudflareDeploy.mjs site/scripts/deploy-cloudflare.mjs site/tests/unit/cloudflareDeploy.test.ts site/tests/integration/cloudflareDeployment.test.ts site/package.json site/package-lock.json
git commit -m "feat: add manual cloudflare deploy command"
```

---

### Task 4: Document the production deployment path and Cloudflare runbook

**Files:**
- Modify: `site/README.md`
- Modify: `site/tests/integration/cloudflareDeployment.test.ts`
- Create: `docs/deployment/cloudflare_pages.md`

- [ ] **Step 1: Write failing integration assertions for the docs**

Append these assertions to `site/tests/integration/cloudflareDeployment.test.ts`:

```ts
  it('documents the Cloudflare production workflow', () => {
    const readmeSource = readFileSync(resolve(process.cwd(), 'README.md'), 'utf8');
    const deploymentDocSource = readFileSync(
      resolve(process.cwd(), '../docs/deployment/cloudflare_pages.md'),
      'utf8',
    );

    expect(readmeSource).toContain('**Live site:** https://hospitalacupuncture.com');
    expect(readmeSource).toContain('npm run deploy:cloudflare');
    expect(deploymentDocSource).toContain('# Cloudflare Pages Deployment');
    expect(deploymentDocSource).toContain('Current deployment path');
    expect(deploymentDocSource).toContain('npx wrangler pages project create');
    expect(deploymentDocSource).toContain('CLOUDFLARE_ACCOUNT_ID');
    expect(deploymentDocSource).toContain('CLOUDFLARE_API_TOKEN');
    expect(deploymentDocSource).toContain('Bulk Redirects');
    expect(deploymentDocSource).toContain('gh-pages');
  });
```

- [ ] **Step 2: Run the integration test to verify it fails**

Run: `cd site && npm run test:integration -- cloudflareDeployment`

Expected: FAIL because the README is still wrong and the Cloudflare deployment runbook does not exist yet.

- [ ] **Step 3: Update README and add the Cloudflare deployment runbook**

Update `site/README.md` so the live URL and deployment workflow are correct:

````md
# HAIF — Hospital Acupuncture Implementation Framework

A methodology for integrating acupuncture and acupressure into hospital practice. Evidence-based. Practitioner-tested.

**Live site:** https://hospitalacupuncture.com

## Development

Requires Node >= 22.12.0.

```bash
npm install
npm run dev
npm run build
npm run test
npm run deploy:cloudflare
```

## Deployment

- Production hosting: Cloudflare Pages
- Production domain: `https://hospitalacupuncture.com`
- Manual production deploy: `cd site && npm run test && npm run build && npm run deploy:cloudflare`
- Full runbook: `../docs/deployment/cloudflare_pages.md`
````

Create `docs/deployment/cloudflare_pages.md`:

````md
# Cloudflare Pages Deployment

## Current deployment path

- Source branch: `main`
- Historical GitHub Pages branch: `gh-pages`
- New production host: Cloudflare Pages
- Canonical production URL: `https://hospitalacupuncture.com`

## First-time project setup

From `site/`:

```bash
npx wrangler pages project create
```

Choose:

- Project name: `haif-project`
- Production branch: `main`

Then in the Cloudflare dashboard:

1. Open Workers & Pages -> `haif-project` -> Custom domains.
2. Add `hospitalacupuncture.com`.
3. Add `www.hospitalacupuncture.com`.
4. Confirm the domain is active before deploying production traffic.

## Authentication

The deployment shell must already expose:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Verify them locally:

```bash
env | rg '^CLOUDFLARE_(ACCOUNT_ID|API_TOKEN)='
```

## Manual production deploy

From repo root:

```bash
cd site
npm run test
npm run build
npm run deploy:cloudflare
```

## Redirect configuration

Use Cloudflare Bulk Redirects to redirect `www` to the apex domain:

- Source URL: `www.hospitalacupuncture.com`
- Target URL: `https://hospitalacupuncture.com`
- Status: `301`
- Enable:
  - Preserve query string
  - Subpath matching
  - Preserve path suffix
  - Include subdomains

Then add the proxied DNS record documented by Cloudflare for the `www` hostname.

## Verification

```bash
curl -I https://hospitalacupuncture.com/
curl -I https://www.hospitalacupuncture.com/
curl -s https://hospitalacupuncture.com/framework/exploration/ | rg 'exploration_acupressure_infographic_01_1.png|Manual Acupressure'
curl -s https://hospitalacupuncture.com/resources/ | rg 'ponv_data_extraction_template.xlsx'
```

Expected:

- apex returns `200`
- `www` returns `301` to `https://hospitalacupuncture.com`
- exploration page contains the recovered intervention content
- resources page links to the original-format `.xlsx`

## Retirement note

`gh-pages` is retired from the production workflow. Do not publish new deploys there once Cloudflare production is healthy.
````

- [ ] **Step 4: Run the integration test to verify it passes**

Run: `cd site && npm run test:integration -- cloudflareDeployment`

Expected: PASS with the README and deployment runbook assertions succeeding.

Then open the runbook:

```bash
open docs/deployment/cloudflare_pages.md
```

- [ ] **Step 5: Commit**

```bash
git add site/README.md site/tests/integration/cloudflareDeployment.test.ts docs/deployment/cloudflare_pages.md
git commit -m "docs: add cloudflare deployment runbook"
```

---

### Task 5: Perform the Cloudflare cutover and retire GitHub Pages from practice

**Files:**
- No repo file changes in this task

- [ ] **Step 1: Create the Cloudflare Pages project if it does not already exist**

Run from `site/`:

```bash
npx wrangler pages project create
```

Expected:
- Wrangler prompts for the project name
- Use `haif-project`
- Use `main` as the production branch
- The project becomes available at a `*.pages.dev` URL
- This is a Direct Upload project, so do not expect to switch it over to Git integration later

- [ ] **Step 2: Attach the production domains in Cloudflare**

In the Cloudflare dashboard:

1. Open Workers & Pages -> `haif-project` -> Custom domains.
2. Add `hospitalacupuncture.com`.
3. Add `www.hospitalacupuncture.com`.
4. Wait until both domains show as active before doing the production smoke test.

Expected: both hostnames resolve to the Pages project.

- [ ] **Step 3: Configure the `www` to apex redirect**

In Cloudflare Bulk Redirects:

1. Create a redirect list entry:
   - Source URL: `www.hospitalacupuncture.com`
   - Target URL: `https://hospitalacupuncture.com`
   - Status: `301`
2. Enable:
   - Preserve query string
   - Subpath matching
   - Preserve path suffix
   - Include subdomains
3. Create the proxied DNS record for `www` using Cloudflare’s documented Pages redirect setup.

Expected: `curl -I https://www.hospitalacupuncture.com/` returns `301` with a `location` header pointing at the apex domain.

- [ ] **Step 4: Verify Cloudflare credentials are available in the deploy shell**

Run:

```bash
env | rg '^CLOUDFLARE_(ACCOUNT_ID|API_TOKEN)='
```

Expected: both `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are present.

- [ ] **Step 5: Run the first manual production deploy**

Run:

```bash
cd site
npm run test
npm run build
npm run deploy:cloudflare
```

Expected:
- tests PASS
- build PASS
- deploy command exits `0`
- Wrangler reports a successful Pages deployment for `haif-project`

- [ ] **Step 6: Run the production smoke test**

Run:

```bash
curl -I https://hospitalacupuncture.com/
curl -I https://www.hospitalacupuncture.com/
curl -s https://hospitalacupuncture.com/framework/exploration/ | rg 'exploration_acupressure_infographic_01_1.png|Manual Acupressure'
curl -s https://hospitalacupuncture.com/resources/ | rg 'ponv_data_extraction_template.xlsx'
```

Expected:
- apex returns `200`
- `www` returns `301` to `https://hospitalacupuncture.com`
- exploration page contains the recovered infographic and comparison-table content
- resources page exposes the original-format spreadsheet link

- [ ] **Step 7: Retire GitHub Pages from the production workflow**

Do not run this step until the Cloudflare smoke test passes and Doctor Dee confirms the cutover is healthy.

Manual retirement actions:

1. Stop doing any deploys to `gh-pages`.
2. In GitHub repo settings, disable GitHub Pages if the repo still serves `https://realmindsai.github.io/haif-project/`.
3. Only after that, optionally delete the stale branch:

```bash
git push origin --delete gh-pages
```

Expected:
- Cloudflare is the only production path in active use
- no one is publishing fresh artifacts to GitHub Pages anymore

No commit: this task changes external Cloudflare and GitHub state rather than repo files.

---

## Coverage Check

- Root-domain Astro config: Task 2
- Root-safe URL behavior: Task 1
- Manual CLI deploy path: Task 3
- Deployment documentation: Task 4
- Cloudflare project, custom domains, `www` redirect, and first production deploy: Task 5
- GitHub Pages retirement from production practice: Task 5
