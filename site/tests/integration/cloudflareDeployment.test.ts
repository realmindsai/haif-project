import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const TEXT_ARTIFACT_EXTENSIONS = new Set(['.css', '.html', '.js', '.txt', '.xml']);
const TEXT_ARTIFACT_NAMES = new Set(['_redirects']);

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

describe('cloudflare deployment configuration', () => {
  it('keeps built deployment artifacts free of the old /haif-project/ base path', () => {
    const distDir = resolve(process.cwd(), 'dist');
    const artifactPaths = collectTextArtifacts(distDir);

    expect(artifactPaths.length).toBeGreaterThan(0);
    expect(
      artifactPaths.filter((artifactPath) =>
        readFileSync(artifactPath, 'utf8').includes('/haif-project/'),
      ),
    ).toEqual([]);

    const homepage = readFileSync(resolve(distDir, 'index.html'), 'utf8');
    expect(homepage).toContain('href="/framework/exploration/"');
    expect(homepage).toContain('href="/" aria-current="page">Home');

    const explorationPage = readFileSync(
      resolve(distDir, 'framework/exploration/index.html'),
      'utf8',
    );
    expect(explorationPage).toContain(
      'https://hospitalacupuncture.com/framework/exploration/',
    );
  });
});
