import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  classifyLegacyUrl,
  isRecoverableLegacyUrl,
  toEvergreenFilename,
} from './lib/assetRecovery.mjs';

const SITE_ROOT = resolve(process.cwd());
const MANIFEST_PATH = resolve(SITE_ROOT, 'src/data/legacy/popa4ease_manifest.json');
const REPORT_PATH = resolve(SITE_ROOT, '../docs/reports/2026-04-10-popa4ease-gap-report.md');
const PUBLIC_ROOT = resolve(SITE_ROOT, 'public');

const SEED_PAGES = ['https://popa4ease.com/site/'];
const PAGE_LINK_PATTERN = /^https?:\/\/popa4ease\.com\/site\/(?:index\.php\/[^"'#?]+\/?)?$/i;
const NOISY_PAGE_PATTERNS = [
  /\/feed\/?$/i,
  /\/comments\/feed\/?$/i,
  /\/sample-page\/feed\/?$/i,
  /\/wp-json(?:\/|$)/i,
];
const ASSET_ATTRIBUTE_PATTERN = /\b(?:href|src|data-json-src)=["']([^"']+)["']/gi;

function normalizeUrl(raw) {
  return raw.replace(/^http:\/\//i, 'https://');
}

function isCrawlablePage(raw) {
  if (!PAGE_LINK_PATTERN.test(raw)) {
    return false;
  }

  return !NOISY_PAGE_PATTERNS.some((pattern) => pattern.test(raw));
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.json();
}

function getLocalTarget(itemType, localFilename) {
  const folder = itemType === 'download' ? 'downloads' : 'images';
  return resolve(PUBLIC_ROOT, folder, localFilename);
}

function getCoverageStatus(itemType, localFilename) {
  if (itemType === 'config_asset') {
    return 'missing_interaction';
  }

  if (existsSync(getLocalTarget(itemType, localFilename))) {
    return 'already_covered';
  }

  return itemType === 'download' ? 'missing_download' : 'missing_asset';
}

function makeManifestItem({ sourcePage, legacyUrl, itemType }) {
  const normalizedLegacyUrl = normalizeUrl(legacyUrl);
  const localFilename = toEvergreenFilename({
    sourcePage,
    legacyUrl: normalizedLegacyUrl,
    itemType,
  });

  return {
    sourcePage,
    legacyUrl: normalizedLegacyUrl,
    itemType,
    localFilename,
    coverageStatus: getCoverageStatus(itemType, localFilename),
  };
}

async function crawlLegacySite() {
  const queue = [...SEED_PAGES];
  const seenPages = new Set();
  const discoveredItems = [];

  while (queue.length > 0) {
    const nextPage = normalizeUrl(queue.shift());
    if (!isCrawlablePage(nextPage) || seenPages.has(nextPage)) {
      continue;
    }

    seenPages.add(nextPage);

    const html = await fetchText(nextPage);
    let match;

    while ((match = ASSET_ATTRIBUTE_PATTERN.exec(html)) !== null) {
      const absoluteUrl = normalizeUrl(new URL(match[1], nextPage).href);

      if (isCrawlablePage(absoluteUrl) && !seenPages.has(absoluteUrl)) {
        queue.push(absoluteUrl);
      }

      if (!isRecoverableLegacyUrl(absoluteUrl)) {
        continue;
      }

      const itemType = classifyLegacyUrl(absoluteUrl);
      if (itemType === 'other') {
        continue;
      }

      discoveredItems.push(
        makeManifestItem({
          sourcePage: nextPage,
          legacyUrl: absoluteUrl,
          itemType,
        }),
      );

      if (itemType !== 'config_asset') {
        continue;
      }

      const config = await fetchJson(absoluteUrl);
      const nestedImageUrl = config?.imgSrc ? normalizeUrl(new URL(config.imgSrc, absoluteUrl).href) : null;

      if (!nestedImageUrl || !isRecoverableLegacyUrl(nestedImageUrl)) {
        continue;
      }

      const nestedType = classifyLegacyUrl(nestedImageUrl);
      if (nestedType === 'other') {
        continue;
      }

      discoveredItems.push(
        makeManifestItem({
          sourcePage: nextPage,
          legacyUrl: nestedImageUrl,
          itemType: nestedType,
        }),
      );
    }
  }

  const uniqueItems = [
    ...new Map(
      discoveredItems.map((item) => [`${item.itemType}:${item.legacyUrl}`, item]),
    ).values(),
  ].sort((left, right) => left.legacyUrl.localeCompare(right.legacyUrl));

  return {
    generatedAt: new Date().toISOString(),
    pages: [...seenPages].sort(),
    items: uniqueItems,
  };
}

function formatSection(title, rows) {
  return [
    title,
    '',
    ...(rows.length > 0 ? rows : ['- none']),
    '',
  ];
}

async function writeOutputs(result) {
  await mkdir(dirname(MANIFEST_PATH), { recursive: true });
  await mkdir(dirname(REPORT_PATH), { recursive: true });

  await writeFile(MANIFEST_PATH, `${JSON.stringify(result, null, 2)}\n`);

  const report = [
    '# POPA4Ease Gap Report',
    '',
    `Generated: ${result.generatedAt}`,
    `Pages crawled: ${result.pages.length}`,
    `Recoverable items: ${result.items.length}`,
    '',
    ...formatSection(
      '## already_covered',
      result.items
        .filter((item) => item.coverageStatus === 'already_covered')
        .map((item) => `- \`${item.itemType}\` ${item.legacyUrl} -> \`${item.localFilename}\``),
    ),
    ...formatSection(
      '## missing_asset',
      result.items
        .filter((item) => item.coverageStatus === 'missing_asset')
        .map((item) => `- ${item.legacyUrl}`),
    ),
    ...formatSection(
      '## missing_download',
      result.items
        .filter((item) => item.coverageStatus === 'missing_download')
        .map((item) => `- ${item.legacyUrl}`),
    ),
    ...formatSection(
      '## missing_interaction',
      result.items
        .filter((item) => item.coverageStatus === 'missing_interaction')
        .map((item) => `- ${item.legacyUrl}`),
    ),
  ].join('\n');

  await writeFile(REPORT_PATH, report);
}

const result = await crawlLegacySite();
await writeOutputs(result);
console.log(`Wrote ${result.items.length} manifest rows`);
process.exit(0);
