const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);
const DOWNLOAD_EXTENSIONS = new Set(['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.zip']);

function normalizeUrl(raw) {
  return new URL(raw.replace(/^http:\/\//i, 'https://'));
}

function getPathname(raw) {
  return normalizeUrl(raw).pathname.toLowerCase();
}

function getBasename(raw) {
  const pathname = normalizeUrl(raw).pathname;
  const lastSlash = pathname.lastIndexOf('/');
  return lastSlash >= 0 ? pathname.slice(lastSlash + 1) : pathname;
}

function getExtension(name) {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot).toLowerCase() : '';
}

function sanitizeSegment(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function getSourcePrefix(sourcePage) {
  if (
    sourcePage === 'http://popa4ease.com/site/' ||
    sourcePage === 'https://popa4ease.com/site/'
  ) {
    return 'home';
  }

  if (sourcePage.includes('/exploration/')) {
    return 'exploration';
  }

  return 'legacy';
}

export function classifyLegacyUrl(raw) {
  const pathname = getPathname(raw);
  const basename = pathname.slice(pathname.lastIndexOf('/') + 1);
  const isUploadsAsset = pathname.includes('/wp-content/uploads/');

  if (isUploadsAsset && pathname.includes('/imagelinks/') && basename === 'config.json') {
    return 'config_asset';
  }

  if (!isUploadsAsset) {
    return 'other';
  }

  const extension = getExtension(basename);

  if (IMAGE_EXTENSIONS.has(extension)) {
    return 'image';
  }

  if (DOWNLOAD_EXTENSIONS.has(extension)) {
    return 'download';
  }

  return 'other';
}

export function isRecoverableLegacyUrl(raw) {
  return classifyLegacyUrl(raw) !== 'other';
}

export function toEvergreenFilename(input) {
  const basename = getBasename(input.legacyUrl);
  const extension = getExtension(basename);

  const specificMappings = {
    'risk-score.png': 'exploration_ponv_risk_score.png',
    'checklist-300x200.jpg': 'exploration_cari_checklist.jpg',
    'ponv-study-data-extraction-template.xlsx': 'ponv_data_extraction_template.xlsx',
  };

  const mapped = specificMappings[basename.toLowerCase()];
  if (mapped) {
    return mapped;
  }

  const prefix = getSourcePrefix(input.sourcePage);
  const sanitizedBasename = sanitizeSegment(basename.slice(0, basename.length - extension.length));
  const fallbackBasename = sanitizedBasename || 'asset';

  return `${prefix}_${fallbackBasename}${extension}`;
}
