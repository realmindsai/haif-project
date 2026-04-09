# POPA4Ease Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recover missing legacy POPA4Ease graphics, downloads, and information-bearing interactions into the Astro site, then rebuild the Exploration intervention section as a modern comparison table.

**Architecture:** Add a small recovery layer to the Astro project: a crawl-and-sync script, structured legacy data files, and a modern Astro component for intervention comparison. Keep the current Astro layout intact, but move recovered legacy assets and downloads behind local, evergreen filenames and swap old plugin behavior for accessible click/tap-driven UI.

**Tech Stack:** Astro 6, TypeScript, Node 22 scripts, Vitest, Playwright, minimal vanilla JS only where Astro markup alone is insufficient

**Spec:** `docs/superpowers/specs/2026-04-10-popa4ease-recovery-design.md`

---

## File Map

### New files

- `site/vitest.config.ts` — Vitest configuration for unit and build-backed integration tests
- `site/playwright.config.ts` — Playwright configuration for end-to-end coverage
- `site/tests/unit/assetRecovery.test.ts` — Unit tests for legacy asset classification and filename normalization
- `site/tests/integration/recoveredAssets.test.ts` — Integration tests for manifest-backed local asset rendering and original-format downloads
- `site/tests/e2e/exploration_intervention.spec.ts` — End-to-end test for intervention table expansion
- `site/scripts/lib/assetRecovery.mjs` — Shared Node-native helpers for classifying, normalizing, and mapping legacy POPA4Ease assets
- `site/scripts/recover-popa4ease.mjs` — Crawl old site, emit manifest and gap report, sync recovered assets locally
- `site/src/data/legacy/resourceDownloads.ts` — Structured list of recovered downloads and labels for the Resources page
- `site/src/data/legacy/interventionComparison.ts` — Structured legacy intervention comparison content normalized from popup tables
- `site/src/components/InterventionComparisonTable.astro` — Modern comparison table with expandable detail rows
- `site/src/data/legacy/popa4ease_manifest.json` — Generated manifest of recoverable legacy items
- `docs/reports/2026-04-10-popa4ease-gap-report.md` — Human-readable gap report produced from the manifest

### Modified files

- `site/package.json` — Add recovery and test scripts plus dev dependencies
- `site/package-lock.json` — Lockfile updates for new dev dependencies
- `site/src/pages/resources.astro` — Render recovered original-format downloads from structured data
- `site/src/pages/framework/exploration.astro` — Replace static intervention details with comparison table and recovered supporting figure
- `site/src/pages/index.astro` — Point homepage image references at manifest-approved recovered local filenames if the crawl shows current substitutions
- `site/src/styles/global.css` — Styles for comparison table, recovered figure, download metadata, and mobile behavior
- `site/README.md` — Document recovery workflow and verification commands

### Asset directories updated by the implementation

- `site/public/images/` — Recovered local graphics with evergreen names
- `site/public/downloads/` — Recovered local downloads in original formats where available

---

## Task 1: Add recovery and test tooling

**Files:**
- Modify: `site/package.json`
- Modify: `site/package-lock.json`
- Create: `site/vitest.config.ts`
- Create: `site/playwright.config.ts`

- [ ] **Step 1: Add dev dependencies and scripts**

Update `site/package.json` to add recovery and test commands:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "bash scripts/build-pdfs.sh && astro build",
    "build:pdfs": "bash scripts/build-pdfs.sh",
    "preview": "astro preview",
    "astro": "astro",
    "recover:popa4ease": "node scripts/recover-popa4ease.mjs",
    "test:unit": "vitest run tests/unit --passWithNoTests",
    "test:integration": "vitest run tests/integration --passWithNoTests",
    "test:e2e": "playwright test --pass-with-no-tests",
    "test": "npm run test:unit && npm run test:integration && npm run test:e2e"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.0",
    "jsdom": "^26.1.0",
    "vitest": "^2.1.9"
  }
}
```

- [ ] **Step 2: Install the new dependencies**

Run: `cd site && npm install`

Expected: `package-lock.json` updates and `npm` exits with code `0`.

- [ ] **Step 3: Create Vitest config**

```ts
// site/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 30000,
  },
});
```

- [ ] **Step 4: Create Playwright config**

```ts
// site/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4321',
    port: 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

- [ ] **Step 5: Verify the scaffolding**

Run: `cd site && npx vitest --config vitest.config.ts --run --passWithNoTests && npx playwright test --config playwright.config.ts --list --pass-with-no-tests`

Expected: both commands exit `0`; Vitest accepts the config and Playwright lists the suite without a config error.

- [ ] **Step 6: Commit**

```bash
git add site/package.json site/package-lock.json site/vitest.config.ts site/playwright.config.ts
git commit -m "chore: add recovery and test tooling"
```

---

## Task 2: Build and test legacy asset recovery helpers

**Files:**
- Create: `site/tests/unit/assetRecovery.test.ts`
- Create: `site/scripts/lib/assetRecovery.mjs`

- [ ] **Step 1: Write the failing unit test**

```ts
// site/tests/unit/assetRecovery.test.ts
import { describe, expect, it } from 'vitest';
import {
  classifyLegacyUrl,
  isRecoverableLegacyUrl,
  toEvergreenFilename,
} from '../../scripts/lib/assetRecovery.mjs';

describe('assetRecovery helpers', () => {
  it('classifies WordPress upload images as image assets', () => {
    expect(
      classifyLegacyUrl('http://popa4ease.com/site/wp-content/uploads/2018/08/risk-score.png')
    ).toBe('image');
  });

  it('classifies source downloads by file extension', () => {
    expect(
      classifyLegacyUrl('http://popa4ease.com/site/wp-content/uploads/2019/05/PONV-study-data-extraction-template.xlsx')
    ).toBe('download');
  });

  it('accepts imagelinks config as a recoverable config asset', () => {
    expect(
      isRecoverableLegacyUrl('http://popa4ease.com/site/wp-content/uploads/imagelinks/1/config.json?ver=1558022196')
    ).toBe(true);
  });

  it('normalizes old WordPress paths to evergreen local filenames', () => {
    expect(
      toEvergreenFilename({
        sourcePage: 'http://popa4ease.com/site/index.php/exploration/',
        legacyUrl: 'http://popa4ease.com/site/wp-content/uploads/2018/08/risk-score.png',
        itemType: 'image',
      })
    ).toBe('exploration_ponv_risk_score.png');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd site && npm run test:unit -- assetRecovery`

Expected: FAIL with `Cannot find module '../../scripts/lib/assetRecovery.mjs'`.

- [ ] **Step 3: Implement the helper module**

```js
// site/scripts/lib/assetRecovery.mjs
const DOWNLOAD_EXTENSIONS = new Set(['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.zip']);
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

function cleanUrl(raw) {
  return new URL(raw.replace(/^http:\/\//, 'https://'));
}

function extname(pathname) {
  const match = pathname.toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match ? match[1] : '';
}

export function classifyLegacyUrl(raw) {
  const url = cleanUrl(raw);
  if (!url.hostname.includes('popa4ease.com')) return null;
  if (url.pathname.includes('/uploads/imagelinks/') && url.pathname.endsWith('/config.json')) {
    return 'config_asset';
  }
  const extension = extname(url.pathname);
  if (IMAGE_EXTENSIONS.has(extension)) return 'image';
  if (DOWNLOAD_EXTENSIONS.has(extension)) return 'download';
  return null;
}

export function isRecoverableLegacyUrl(raw) {
  return classifyLegacyUrl(raw) !== null;
}

export function toEvergreenFilename(input) {
  const url = cleanUrl(input.legacyUrl);
  const extension = extname(url.pathname);

  if (url.pathname.endsWith('/risk-score.png')) return `exploration_ponv_risk_score${extension}`;
  if (url.pathname.endsWith('/checklist-300x200.jpg')) return `exploration_cari_checklist${extension}`;
  if (url.pathname.endsWith('/PONV-study-data-extraction-template.xlsx')) {
    return `ponv_data_extraction_template${extension}`;
  }

  const pageSlug = input.sourcePage.includes('/exploration/')
    ? 'exploration'
    : input.sourcePage === 'http://popa4ease.com/site/' ? 'home' : 'legacy';

  const basename = url.pathname
    .split('/')
    .pop()
    ?.replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();

  return `${pageSlug}_${basename}${extension}`;
}
```

- [ ] **Step 4: Run the unit test to verify it passes**

Run: `cd site && npm run test:unit -- assetRecovery`

Expected: PASS with `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add site/tests/unit/assetRecovery.test.ts site/scripts/lib/assetRecovery.mjs
git commit -m "feat: add legacy asset recovery helpers"
```

---

## Task 3: Crawl the old site and generate the manifest plus gap report

**Files:**
- Create: `site/scripts/recover-popa4ease.mjs`
- Create: `site/src/data/legacy/popa4ease_manifest.json`
- Create: `docs/reports/2026-04-10-popa4ease-gap-report.md`

- [ ] **Step 1: Write the failing integration test**

```ts
// site/tests/integration/recoveredAssets.test.ts
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const manifestPath = resolve(process.cwd(), 'src/data/legacy/popa4ease_manifest.json');
const reportPath = resolve(process.cwd(), '../docs/reports/2026-04-10-popa4ease-gap-report.md');

describe('legacy recovery outputs', () => {
  it('writes a JSON manifest', () => {
    expect(existsSync(manifestPath)).toBe(true);
  });

  it('writes a human-readable gap report', () => {
    expect(existsSync(reportPath)).toBe(true);
    const report = readFileSync(reportPath, 'utf8');
    expect(report).toContain('# POPA4Ease Gap Report');
    expect(report).toContain('## missing_asset');
    expect(report).toContain('## missing_interaction');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd site && npm run test:integration -- recoveredAssets`

Expected: FAIL because neither output file exists yet.

- [ ] **Step 3: Implement the recovery script**

```js
// site/scripts/recover-popa4ease.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  classifyLegacyUrl,
  isRecoverableLegacyUrl,
  toEvergreenFilename,
} from './lib/assetRecovery.mjs';

const ROOT = resolve(process.cwd());
const SITE_ROOT = ROOT;
const REPORT_ROOT = resolve(ROOT, '../docs/reports');
const manifestPath = resolve(SITE_ROOT, 'src/data/legacy/popa4ease_manifest.json');
const reportPath = resolve(REPORT_ROOT, '2026-04-10-popa4ease-gap-report.md');
const publicRoot = resolve(SITE_ROOT, 'public');

const seeds = ['http://popa4ease.com/site/'];
const pagePattern = /^https?:\/\/popa4ease\.com\/site\/(?:index\.php\/[^"'#?]+\/?)?$/i;
const assetPattern = /\b(?:src|href|data-json-src)=["']([^"']+)["']/gi;

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return await res.text();
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return await res.json();
}

function normalize(url) {
  return url.replace(/^http:\/\//, 'https://');
}

async function crawl() {
  const queue = [...seeds];
  const seenPages = new Set();
  const items = [];

  while (queue.length) {
    const page = normalize(queue.shift());
    if (seenPages.has(page)) continue;
    seenPages.add(page);

    const html = await fetchText(page);
    let match;
    while ((match = assetPattern.exec(html)) !== null) {
      const raw = match[1];
      const absolute = new URL(raw, page).href;
      if (isRecoverableLegacyUrl(absolute)) {
        const itemType = classifyLegacyUrl(absolute);
        const localFilename = toEvergreenFilename({
          sourcePage: page,
          legacyUrl: absolute,
          itemType,
        });
        const localFolder = itemType === 'download' ? 'downloads' : 'images';
        const localTarget = resolve(publicRoot, localFolder, localFilename);
        const coverageStatus = itemType === 'config_asset'
          ? 'missing_interaction'
          : existsSync(localTarget)
            ? 'already_covered'
            : itemType === 'download'
              ? 'missing_download'
              : 'missing_asset';

        items.push({
          sourcePage: page,
          legacyUrl: normalize(absolute),
          itemType,
          localFilename,
          coverageStatus,
        });

        if (itemType === 'config_asset') {
          const config = await fetchJson(normalize(absolute));
          if (config?.imgSrc && isRecoverableLegacyUrl(config.imgSrc)) {
            const nestedType = classifyLegacyUrl(config.imgSrc);
            const nestedFilename = toEvergreenFilename({
              sourcePage: page,
              legacyUrl: config.imgSrc,
              itemType: nestedType,
            });
            const nestedTarget = resolve(publicRoot, 'images', nestedFilename);
            items.push({
              sourcePage: page,
              legacyUrl: normalize(config.imgSrc),
              itemType: nestedType,
              localFilename: nestedFilename,
              coverageStatus: existsSync(nestedTarget) ? 'already_covered' : 'missing_asset',
            });
          }
        }
      }
      if (pagePattern.test(absolute)) {
        queue.push(absolute);
      }
    }
  }

  const uniqueItems = [
    ...new Map(items.map(item => [`${item.itemType}:${item.legacyUrl}`, item])).values(),
  ].sort((a, b) => a.legacyUrl.localeCompare(b.legacyUrl));

  return { pages: [...seenPages].sort(), items: uniqueItems };
}

async function writeOutputs(result) {
  await mkdir(dirname(manifestPath), { recursive: true });
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(result, null, 2) + '\n');

  const report = [
    '# POPA4Ease Gap Report',
    '',
    `Pages crawled: ${result.pages.length}`,
    `Recoverable items: ${result.items.length}`,
    '',
    '## already_covered',
    '',
    ...result.items
      .filter(item => item.coverageStatus === 'already_covered')
      .map(item => `- \`${item.itemType}\` ${item.legacyUrl} -> \`${item.localFilename}\``),
    '',
    '## missing_asset',
    '',
    ...result.items
      .filter(item => item.coverageStatus === 'missing_asset')
      .map(item => `- ${item.legacyUrl}`),
    '',
    '## missing_download',
    '',
    ...result.items
      .filter(item => item.coverageStatus === 'missing_download')
      .map(item => `- ${item.legacyUrl}`),
    '',
    '## missing_interaction',
    '',
    ...result.items
      .filter(item => item.coverageStatus === 'missing_interaction')
      .map(item => `- ${item.legacyUrl}`),
    '',
  ].join('\n');

  await writeFile(reportPath, report);
}

const result = await crawl();
await writeOutputs(result);
console.log(`Wrote ${result.items.length} manifest rows`);
```

- [ ] **Step 4: Run the recovery script**

Run: `cd site && npm run recover:popa4ease`

Expected: Script exits `0` and creates both output files.

- [ ] **Step 5: Run the integration test to verify it passes**

Run: `cd site && npm run test:integration -- recoveredAssets`

Expected: PASS with both files present.

- [ ] **Step 6: Commit**

```bash
git add site/scripts/recover-popa4ease.mjs site/src/data/legacy/popa4ease_manifest.json docs/reports/2026-04-10-popa4ease-gap-report.md site/tests/integration/recoveredAssets.test.ts
git commit -m "feat: crawl POPA4Ease and generate recovery manifest"
```

---

## Task 4: Sync recovered local images and original-format downloads

**Files:**
- Modify: `site/scripts/recover-popa4ease.mjs`
- Modify: `site/src/data/legacy/popa4ease_manifest.json`
- Modify: `docs/reports/2026-04-10-popa4ease-gap-report.md`
- Update: `site/public/images/*`
- Update: `site/public/downloads/*`

- [ ] **Step 1: Write the failing unit test for format preservation**

Add this case to `site/tests/integration/recoveredAssets.test.ts`:

```ts
it('keeps original-format downloads when the source file is not a PDF', () => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const xlsxItem = manifest.items.find(
    item => item.legacyUrl.includes('PONV-study-data-extraction-template.xlsx')
  );
  expect(xlsxItem.localFilename.endsWith('.xlsx')).toBe(true);
  expect(
    existsSync(resolve(process.cwd(), 'public/downloads', xlsxItem.localFilename))
  ).toBe(true);
});
```

- [ ] **Step 2: Run the test to verify it fails if the manifest lost the format**

Run: `cd site && npm run test:integration -- recoveredAssets`

Expected: FAIL because the manifest preserves `.xlsx`, but the original-format file has not been synced into `site/public/downloads` yet.

- [ ] **Step 3: Extend the recovery script to download files locally**

```js
async function syncRecoveredFiles(result) {
  for (const item of result.items) {
    const folder = item.itemType === 'download' ? 'downloads' : 'images';
    const target = resolve(publicRoot, folder, item.localFilename);
    if (existsSync(target)) continue;

    const res = await fetch(item.legacyUrl);
    if (!res.ok) throw new Error(`Download failed ${item.legacyUrl}: ${res.status}`);
    const body = Buffer.from(await res.arrayBuffer());

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, body);
  }
}

// After crawl:
await syncRecoveredFiles(result);
```

- [ ] **Step 4: Run the script and inspect recovered originals**

Run: `cd site && npm run recover:popa4ease`

Expected: Local files appear under `site/public/images` and `site/public/downloads`, including `ponv_data_extraction_template.xlsx`.

- [ ] **Step 5: Re-run the integration test**

Run: `cd site && npm run test:integration -- recoveredAssets`

Expected: PASS with the original `.xlsx` preserved in manifest data and present in `site/public/downloads`.

- [ ] **Step 6: Commit**

```bash
git add site/scripts/recover-popa4ease.mjs site/src/data/legacy/popa4ease_manifest.json docs/reports/2026-04-10-popa4ease-gap-report.md site/public/images site/public/downloads site/tests/integration/recoveredAssets.test.ts
git commit -m "feat: sync recovered POPA4Ease assets and original downloads"
```

---

## Task 5: Make the Resources page use recovered original-format files

**Files:**
- Create: `site/src/data/legacy/resourceDownloads.ts`
- Modify: `site/src/pages/resources.astro`
- Modify: `site/tests/integration/recoveredAssets.test.ts`

- [ ] **Step 1: Write the failing integration test**

Add this test:

```ts
it('renders the original xlsx download on the Resources page', async () => {
  const resourcesSource = readFileSync(resolve(process.cwd(), 'src/pages/resources.astro'), 'utf8');
  const metadataSource = readFileSync(
    resolve(process.cwd(), 'src/data/legacy/resourceDownloads.ts'),
    'utf8',
  );

  expect(resourcesSource).toContain('resourceDownloads.ponvDataExtractionTemplate');
  expect(metadataSource).toContain('ponv_data_extraction_template.xlsx');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd site && npm run test:integration -- recoveredAssets`

Expected: FAIL because the metadata file does not exist yet and `resources.astro` still links to the PDF.

- [ ] **Step 3: Create structured download metadata**

```ts
// site/src/data/legacy/resourceDownloads.ts
import { url } from '../../utils';

export const resourceDownloads = {
  ponvDataExtractionTemplate: {
    href: url('/downloads/ponv_data_extraction_template.xlsx'),
    label: 'PONV Data Extraction Template',
    format: 'XLSX',
  },
  explorationChecklist: {
    href: url('/downloads/exploration-checklist.pdf'),
    label: 'Phase 1: Exploration Checklist',
    format: 'PDF',
  },
} as const;
```

- [ ] **Step 4: Update the Resources page to use the metadata**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { url } from '../utils';
import { resourceDownloads } from '../data/legacy/resourceDownloads';
---

<li>
  <a href={resourceDownloads.ponvDataExtractionTemplate.href}>
    {resourceDownloads.ponvDataExtractionTemplate.label}
  </a>
  ({resourceDownloads.ponvDataExtractionTemplate.format})
</li>
```

Leave the remaining download entries on their current PDF paths in this task. The required behavior change here is the PONV data extraction template moving from PDF to original-format XLSX.

- [ ] **Step 5: Run the integration test to verify it passes**

Run: `cd site && npm run test:integration -- recoveredAssets`

Expected: PASS with the `.xlsx` link present in page source.

- [ ] **Step 6: Commit**

```bash
git add site/src/data/legacy/resourceDownloads.ts site/src/pages/resources.astro site/tests/integration/recoveredAssets.test.ts
git commit -m "feat: use recovered original-format downloads on resources page"
```

---

## Task 6: Rebuild the Intervention section as a modern comparison table

**Files:**
- Create: `site/src/data/legacy/interventionComparison.ts`
- Create: `site/src/components/InterventionComparisonTable.astro`
- Modify: `site/src/pages/framework/exploration.astro`
- Modify: `site/src/styles/global.css`

- [ ] **Step 1: Write the failing integration test**

Append this test:

```ts
it('stores normalized intervention comparison data in a dedicated source file', () => {
  const dataSource = readFileSync(
    resolve(process.cwd(), 'src/data/legacy/interventionComparison.ts'),
    'utf8'
  );
  expect(dataSource).toContain('manualAcupressure');
  expect(dataSource).toContain('bandOrPatch');
  expect(dataSource).toContain('pc6AllModalities');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd site && npm run test:integration -- recoveredAssets`

Expected: FAIL because the data file does not exist yet.

- [ ] **Step 3: Create the normalized intervention data**

```ts
// site/src/data/legacy/interventionComparison.ts
export interface InterventionRow {
  id: string;
  label: string;
  invasiveness: 'Non-invasive' | 'Needle-based' | 'Mixed';
  evidence: string;
  cost: string;
  training: string;
  advantages: string[];
  disadvantages: string[];
  effectiveness: string[];
}

export const interventionComparison: InterventionRow[] = [
  {
    id: 'manualAcupressure',
    label: 'Manual Acupressure',
    invasiveness: 'Non-invasive',
    evidence: 'Nausea 45% to 30%; vomiting 30% to 18%',
    cost: 'No equipment',
    training: 'Low',
    advantages: ['Avoids needles'],
    disadvantages: ['Limited detail in legacy source'],
    effectiveness: [
      'Lee et al., 2015: nausea reduced from 45% to 30% (RR 0.71, 95% CI 0.62-0.81)',
      'Lee et al., 2015: vomiting reduced from 30% to 18% (RR 0.60, 95% CI 0.50-0.73)',
    ],
  },
  {
    id: 'transcutaneousElectrostimulation',
    label: 'Transcutaneous Electrostimulation',
    invasiveness: 'Non-invasive',
    evidence: 'Strong non-invasive evidence with equipment support',
    cost: '$40-$200 equipment',
    training: 'Moderate',
    advantages: [
      'Able to be used over extended periods',
      'Adjustable intensity',
    ],
    disadvantages: [
      'Requires equipment',
      'Requires training',
    ],
    effectiveness: [
      'Lee et al., 2015: nausea reduced from 45% to 30% (RR 0.71, 95% CI 0.62-0.81)',
      'Lee et al., 2015: vomiting reduced from 30% to 18% (RR 0.60, 95% CI 0.50-0.73)',
    ],
  },
  {
    id: 'auricularAcupuncture',
    label: 'Auricular Acupuncture',
    invasiveness: 'Needle-based',
    evidence: 'Procedure-specific evidence in legacy source',
    cost: 'Few cents per needle or bead',
    training: 'Moderate',
    advantages: [
      'Economical',
      'Individualized point selection',
      'Low risk of misplaced needles',
      'Remote from most surgical sites',
    ],
    disadvantages: ['Requires staff training or a qualified acupuncturist'],
    effectiveness: [
      'Huang et al., 2005: effective following gynaecological surgery',
      'Kim et al., 2003: effective following gynaecological surgery',
      'Sahmeddini and Fazelzadeh, 2008: effective following laparoscopic cholecystectomy',
    ],
  },
  {
    id: 'needleAcupuncture',
    label: 'Needle Acupuncture',
    invasiveness: 'Needle-based',
    evidence: 'Direct body acupuncture with strong PONV reduction',
    cost: '$0.05 per needle',
    training: 'Moderate',
    advantages: [
      'Economical',
      'Individualized point selection',
      'PC6 plus other acupoints reduced PONV from 21% to 6%',
    ],
    disadvantages: [
      'Requires staff training or a qualified acupuncturist',
      'Requires monitoring for misplaced needles',
    ],
    effectiveness: [
      'Lee et al., 2015: nausea reduced from 54% to 29% (RR 0.56, 95% CI 0.39-0.80)',
      'Lee et al., 2015: vomiting reduced from 41% to 20% (RR 0.51, 95% CI 0.34-0.76)',
      'Cheong et al., 2013: PC6 plus other acupoints reduced PONV from 21% to 6% (RR 0.29, 95% CI 0.17-0.49)',
    ],
  },
  {
    id: 'electroAcupuncture',
    label: 'Electroacupuncture',
    invasiveness: 'Needle-based',
    evidence: 'Body acupuncture with adjustable electrical stimulus',
    cost: '$200-$800 equipment plus needles',
    training: 'Moderate',
    advantages: [
      'Reusable stimulation units',
      'Adjustable intensity',
      'Individualized point selection',
      'PC6 plus other acupoints reduced PONV from 21% to 6%',
    ],
    disadvantages: [
      'Requires staff training or a qualified acupuncturist',
      'Requires equipment purchase',
      'Requires monitoring for misplaced needles',
    ],
    effectiveness: [
      'Lee et al., 2015: nausea reduced from 54% to 29% (RR 0.56, 95% CI 0.39-0.80)',
      'Lee et al., 2015: vomiting reduced from 41% to 20% (RR 0.51, 95% CI 0.34-0.76)',
      'Cheong et al., 2013: PC6 plus other acupoints reduced PONV from 21% to 6% (RR 0.29, 95% CI 0.17-0.49)',
    ],
  },
  {
    id: 'bandOrPatch',
    label: 'Acupressure Band or Patch',
    invasiveness: 'Non-invasive',
    evidence: 'Nausea, vomiting, and rescue antiemetics improved',
    cost: 'About $5 AUD',
    training: 'Low',
    advantages: [
      'Extended use',
      'No infection risk',
      'Flexible delivery',
    ],
    disadvantages: [
      'Not suitable for some wrist sizes or injuries',
      'Can be awkward with multiple lines in place',
    ],
    effectiveness: [
      'Shiao and Dune, 2006: nausea reduced from 36% to 24%',
      'Shiao and Dune, 2006: vomiting reduced from 20% to 15%',
      'Shiao and Dune, 2006: rescue antiemetics reduced from 22% to 13%',
    ],
  },
  {
    id: 'pc6AllModalities',
    label: 'PC6 Acupoint Stimulation (All Modalities)',
    invasiveness: 'Mixed',
    evidence: 'Strong pooled effect across modalities',
    cost: 'Varies by modality',
    training: 'Moderate',
    advantages: [
      'Equivalent effectiveness to common antiemetics',
      'Mild transient side effects',
    ],
    disadvantages: ['Requires staff training or a qualified acupuncturist'],
    effectiveness: [
      'Lee et al., 2015: nausea reduced from 47% to 31%',
      'Lee et al., 2015: vomiting reduced from 33% to 19%',
      'Lee et al., 2015: rescue antiemetics reduced from 33% to 20%',
    ],
  },
];
```

- [ ] **Step 4: Build the Astro comparison table component**

```astro
---  
// site/src/components/InterventionComparisonTable.astro
import type { InterventionRow } from '../data/legacy/interventionComparison';

interface Props {
  rows: InterventionRow[];
}

const { rows } = Astro.props;
---

<div class="comparison-table-wrap">
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Modality</th>
        <th>Invasiveness</th>
        <th>Evidence Snapshot</th>
        <th>Cost / Equipment</th>
        <th>Training</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <>
          <tr>
            <td>{row.label}</td>
            <td>{row.invasiveness}</td>
            <td>{row.evidence}</td>
            <td>{row.cost}</td>
            <td>{row.training}</td>
            <td>
              <details>
                <summary>View details</summary>
                <div class="comparison-detail">
                  <h4>Effectiveness</h4>
                  <ul>{row.effectiveness.map((item) => <li>{item}</li>)}</ul>
                  <h4>Advantages</h4>
                  <ul>{row.advantages.map((item) => <li>{item}</li>)}</ul>
                  <h4>Disadvantages</h4>
                  <ul>{row.disadvantages.map((item) => <li>{item}</li>)}</ul>
                </div>
              </details>
            </td>
          </tr>
        </>
      ))}
    </tbody>
  </table>
</div>
```

- [ ] **Step 5: Replace the old intervention markup in `exploration.astro`**

```astro
---
import FrameworkLayout from '../../layouts/FrameworkLayout.astro';
import { url } from '../../utils';
import { interventionComparison } from '../../data/legacy/interventionComparison';
import InterventionComparisonTable from '../../components/InterventionComparisonTable.astro';
---

<h2 id="intervention">Intervention</h2>
<p>
  Compare the main acupuncture and acupressure modalities below. Expand any row for
  detailed effectiveness data, advantages, disadvantages, and implementation notes
  recovered from the legacy POPA4Ease site.
</p>

<figure class="recovered-figure">
  <img
    src={url('/images/exploration_acupressure_infographic_01_1.png')}
    alt="Overview of acupuncture and acupressure modalities"
    loading="lazy"
  />
  <figcaption>
    Legacy POPA4Ease overview graphic retained as supporting context, not as the primary interaction.
  </figcaption>
</figure>

<InterventionComparisonTable rows={interventionComparison} />
```

- [ ] **Step 6: Add the supporting styles**

```css
.comparison-table-wrap {
  overflow-x: auto;
  margin: var(--spacing-lg) 0;
}

.comparison-table {
  min-width: 760px;
}

.comparison-detail {
  padding-top: var(--spacing-sm);
}

.recovered-figure {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-md);
  background: var(--color-bg-alt);
  border-radius: var(--radius);
}

.recovered-figure img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--radius);
}

.recovered-figure figcaption {
  margin-top: var(--spacing-sm);
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
```

- [ ] **Step 7: Run the integration test to verify it passes**

Run: `cd site && npm run test:integration -- recoveredAssets`

Expected: PASS with the dedicated intervention data source present.

- [ ] **Step 8: Commit**

```bash
git add site/src/data/legacy/interventionComparison.ts site/src/components/InterventionComparisonTable.astro site/src/pages/framework/exploration.astro site/src/styles/global.css site/tests/integration/recoveredAssets.test.ts
git commit -m "feat: rebuild intervention content as comparison table"
```

---

## Task 7: Add end-to-end verification and finish the asset swap

**Files:**
- Create: `site/tests/e2e/exploration_intervention.spec.ts`
- Modify: `site/playwright.config.ts`
- Modify: `site/src/pages/index.astro`
- Modify: `site/src/styles/global.css`
- Modify: `site/README.md`

- [ ] **Step 1: Write the failing e2e test**

```ts
// site/tests/e2e/exploration_intervention.spec.ts
import { expect, test } from '@playwright/test';

test('homepage hero and exploration intervention interactions render recovered content', async ({ page }) => {
  await page.goto('/haif-project/');
  await expect(
    page.getByRole('img', {
      name: /hospital recovery context from the legacy popa4ease homepage/i,
    }),
  ).toBeVisible();

  await page.goto('/haif-project/framework/exploration/');
  await expect(page.getByRole('heading', { name: /intervention/i })).toBeVisible();

  await page.getByText('Manual Acupressure').scrollIntoViewIfNeeded();
  await page.locator('summary', { hasText: 'View details' }).first().click();

  await expect(page.getByText(/avoids needles/i)).toBeVisible();
});
```

- [ ] **Step 2: Run the e2e test to verify it fails**

Run: `cd site && npm run test:e2e -- exploration_intervention`

Expected: FAIL because the recovered homepage hero image is not wired into `index.astro` yet.

- [ ] **Step 3: Add the recovered homepage hero image**

Before rerunning the e2e suite, align Playwright with the Astro base path by updating `site/playwright.config.ts`:

```ts
use: {
  baseURL: 'http://127.0.0.1:4321',
  trace: 'retain-on-failure',
},
```

- [ ] **Step 4: Add the recovered homepage hero image**

Update `site/src/pages/index.astro` so the homepage hero uses the recovered legacy banner image that already exists locally as `hero-banner.jpg`:

```astro
<section class="hero hero-split">
  <div class="hero-copy">
    <h1>Hospital Acupuncture<br />Implementation Framework</h1>
    <p class="subtitle">
      Post-operative nausea and vomiting (PONV) affects 30-50% of surgical patients.
      Acupuncture and acupressure are the only non-pharmacological interventions included
      in PONV management guidelines. This framework helps clinicians implement them
      systematically in hospital settings.
    </p>
  </div>
  <img
    class="hero-image"
    src={url('/images/hero-banner.jpg')}
    alt="Hospital recovery context from the legacy POPA4Ease homepage"
    loading="eager"
  />
</section>
```

Add the corresponding responsive styles to `site/src/styles/global.css`:

```css
.hero-split {
  display: grid;
  gap: var(--spacing-lg);
  align-items: center;
}

.hero-copy {
  min-width: 0;
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--radius);
}

@media (min-width: 768px) {
  .hero-split {
    grid-template-columns: 1.2fr 1fr;
  }
}
```

- [ ] **Step 4: Document the workflow in the README**
- [ ] **Step 5: Document the workflow in the README**

Add a short section:

```md
## POPA4Ease recovery workflow

- `npm run recover:popa4ease` crawls the legacy site, writes the manifest, updates the gap report, and syncs recovered local files.
- `npm run test:unit` verifies recovery helpers.
- `npm run test:integration` verifies manifest-backed rendering and original-format downloads.
- `npm run test:e2e` verifies the Exploration intervention interaction.
```

- [ ] **Step 5: Run the e2e test to verify it passes**
- [ ] **Step 6: Run the e2e test to verify it passes**

Run: `cd site && npm run test:e2e -- exploration_intervention`

Expected: PASS with the recovered homepage hero visible and the intervention row expansion revealing the recovered detail content.

- [ ] **Step 6: Run full verification**
- [ ] **Step 7: Run full verification**

Run: `cd site && npm run test && npm run build`

Expected:
- unit tests pass
- integration tests pass
- e2e tests pass
- Astro build succeeds with no warnings or noise

- [ ] **Step 7: Commit**
- [ ] **Step 8: Commit**

```bash
git add site/tests/e2e/exploration_intervention.spec.ts site/playwright.config.ts site/src/pages/index.astro site/src/styles/global.css site/README.md
git commit -m "test: verify recovered intervention interaction end to end"
```

---

## Notes for Execution

- Do not overwrite unrelated PDF changes already present in `site/public/downloads/`. Review diffs carefully before staging.
- Do not revert user files such as `AGENTS.md` or the local `.mhtml` capture.
- Prefer modifying existing Astro pages in place. Do not rebuild the site architecture.
- Keep live page references local. Legacy WordPress URLs belong only in manifest or migration metadata.
