import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const manifestPath = resolve(process.cwd(), 'src/data/legacy/popa4ease_manifest.json');
const reportPath = resolve(process.cwd(), '../docs/reports/2026-04-10-popa4ease-gap-report.md');
const publicRoot = resolve(process.cwd(), 'public');

describe('legacy recovery outputs', () => {
  it('writes a JSON manifest', () => {
    expect(existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    expect(manifest.generatedAt).toBeUndefined();

    const aliasBackedItems = [
      [
        '/2018/03/Digital-Strategy-for-Medical-Brand-Intervention-IQ-e1534562115603.jpg',
        'images/phase-1-exploration.jpg',
      ],
      [
        '/2018/03/Prescription-preparation-in-bangladesh-300x168.jpg',
        'images/phase-2-preparation.jpg',
      ],
      ['/2018/03/promo248112192-300x169.jpeg', 'images/phase-3-implementation.jpg'],
      ['/2018/03/1-300x169.jpg', 'images/phase-4-sustainment.jpg'],
      ['/2018/08/frontpage-image1-e1534678544443.jpg', 'images/hero-banner.jpg'],
      ['/2018/08/risk-score.png', 'images/ponv-risk-score.png'],
      ['/2018/08/checklist-300x200.jpg', 'images/cari-checklist.jpg'],
      ['/2019/05/algorithm-image.jpg', 'images/ponv-algorithm.jpg'],
    ];

    for (const [legacyPath, localPath] of aliasBackedItems) {
      const item = manifest.items.find((entry) => entry.legacyUrl.includes(legacyPath));
      expect(item?.coverageStatus).toBe('missing_asset');
      expect(item?.existingLocalPath).toBe(localPath);
      expect(existsSync(resolve(publicRoot, localPath))).toBe(true);
    }

    for (const item of manifest.items.filter((entry) => entry.coverageStatus === 'already_covered')) {
      const folder = item.itemType === 'download' ? 'downloads' : 'images';
      expect(existsSync(resolve(publicRoot, folder, item.localFilename))).toBe(true);
    }

    expect(manifest.pages).not.toContain(
      'https://popa4ease.com/site/index.php/situation-analysis-of-acupressure-wristband-for-ponv',
    );
    expect(manifest.pages).toContain(
      'https://popa4ease.com/site/index.php/situation-analysis-of-acupressure-wristband-for-ponv/',
    );
    expect(
      manifest.items.find((item) =>
        item.legacyUrl.includes('/PONV-study-data-extraction-template.xlsx'),
      )?.coverageStatus,
    ).toBe('missing_download');
    expect(
      manifest.items.find((item) => item.itemType === 'config_asset')?.coverageStatus,
    ).toBe('missing_interaction');
  });

  it('writes a human-readable gap report', () => {
    expect(existsSync(reportPath)).toBe(true);
    const report = readFileSync(reportPath, 'utf8');
    expect(report).toContain('# POPA4Ease Gap Report');
    expect(report).toContain('## missing_asset');
    expect(report).toContain('## missing_interaction');
    expect(report).not.toContain('Generated:');
    expect(report).toContain('existing local counterpart: `images/ponv-risk-score.png`');
  });
});
