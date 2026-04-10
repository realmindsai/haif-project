import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

const TEXT_ARTIFACT_EXTENSIONS = new Set(['.css', '.html', '.js', '.txt', '.xml']);
const TEXT_ARTIFACT_NAMES = new Set(['_redirects']);
const DIST_DIR = resolve(process.cwd(), 'dist');

function collectTextArtifacts(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return collectTextArtifacts(absolutePath);
    }

    const extension = absolutePath.slice(absolutePath.lastIndexOf('.'));
    if (TEXT_ARTIFACT_NAMES.has(entry.name) || TEXT_ARTIFACT_EXTENSIONS.has(extension)) {
      return [absolutePath];
    }

    return [];
  });
}

function buildSite(): void {
  rmSync(DIST_DIR, { recursive: true, force: true });
  execFileSync('npm', ['run', 'astro', '--', 'build'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NO_COLOR: '1',
    },
    stdio: 'pipe',
  });
}

describe('cloudflare deployment configuration', () => {
  beforeAll(() => {
    buildSite();
  });

  it('keeps built deployment artifacts free of the old /haif-project/ base path', () => {
    expect(existsSync(DIST_DIR)).toBe(true);

    const artifactPaths = collectTextArtifacts(DIST_DIR);

    expect(artifactPaths.length).toBeGreaterThan(0);
    expect(
      artifactPaths.filter((artifactPath) =>
        readFileSync(artifactPath, 'utf8').includes('/haif-project/'),
      ),
    ).toEqual([]);

    const homepage = readFileSync(resolve(DIST_DIR, 'index.html'), 'utf8');
    expect(homepage).toContain('href="/framework/exploration/"');
    expect(homepage).toContain('href="/" aria-current="page">Home');

    const explorationPage = readFileSync(
      resolve(DIST_DIR, 'framework/exploration/index.html'),
      'utf8',
    );
    expect(explorationPage).toContain(
      'https://hospitalacupuncture.com/framework/exploration/',
    );
  });

  it('exposes a manual Cloudflare deploy script in package.json', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'),
    );

    expect(packageJson.scripts['deploy:cloudflare']).toBe(
      'node scripts/deploy-cloudflare.mjs',
    );
  });
});
