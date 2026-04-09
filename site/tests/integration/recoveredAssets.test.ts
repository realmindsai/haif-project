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
