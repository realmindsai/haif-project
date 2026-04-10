import { execFileSync, spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import { afterEach, beforeAll, describe, expect, it } from 'vitest';

const TEXT_ARTIFACT_EXTENSIONS = new Set(['.css', '.html', '.js', '.txt', '.xml']);
const TEXT_ARTIFACT_NAMES = new Set(['_redirects']);
const DIST_DIR = resolve(process.cwd(), 'dist');
const DEPLOY_ENTRYPOINT = resolve(process.cwd(), 'scripts/deploy-cloudflare.mjs');
const VITEST_SCOPE_ENTRYPOINT = resolve(process.cwd(), 'scripts/run-vitest-scope.mjs');
const UNIT_SCOPE_DIRECTORY = 'tests/unit';

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

function initGitRepo(cwd: string): void {
  execFileSync('git', ['init', '-b', 'main'], { cwd, stdio: 'pipe' });
  execFileSync('git', ['config', 'user.email', 'integration@example.com'], { cwd, stdio: 'pipe' });
  execFileSync('git', ['config', 'user.name', 'Integration Test'], { cwd, stdio: 'pipe' });
}

function writeExecutable(path: string, content: string): void {
  writeFileSync(path, content, 'utf8');
  chmodSync(path, 0o755);
}

function commitAll(cwd: string): void {
  execFileSync('git', ['add', '.'], { cwd, stdio: 'pipe' });
  execFileSync('git', ['commit', '-m', 'fixture'], {
    cwd,
    env: {
      ...process.env,
      NO_COLOR: '1',
    },
    stdio: 'pipe',
  });
}

function createDeployFixture(): string {
  const fixtureRoot = mkdtempSync(resolve(tmpdir(), 'cloudflare-deploy-'));
  initGitRepo(fixtureRoot);

  writeFileSync(
    resolve(fixtureRoot, 'package.json'),
    JSON.stringify(
      {
        name: 'cloudflare-fixture',
        version: '1.0.0',
        private: true,
        scripts: {
          build: 'node build-site.mjs',
        },
      },
      null,
      2,
    ),
    'utf8',
  );

  writeFileSync(
    resolve(fixtureRoot, 'build-site.mjs'),
    `
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distPath = resolve(process.cwd(), 'dist');
rmSync(distPath, { recursive: true, force: true });
mkdirSync(distPath, { recursive: true });
writeFileSync(resolve(distPath, 'build.marker'), 'built-fresh\\n', 'utf8');
`,
    'utf8',
  );

  const wranglerBinDir = resolve(fixtureRoot, 'node_modules/wrangler/bin');
  mkdirSync(wranglerBinDir, { recursive: true });
  writeFileSync(
    resolve(fixtureRoot, 'node_modules/wrangler/package.json'),
    JSON.stringify(
      {
        name: 'wrangler',
        version: '1.0.0',
        bin: {
          wrangler: './bin/wrangler.js',
        },
      },
      null,
      2,
    ),
    'utf8',
  );
  writeExecutable(
    resolve(wranglerBinDir, 'wrangler.js'),
    `#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outDir = resolve(process.cwd(), '.deploy-artifacts');
mkdirSync(outDir, { recursive: true });
writeFileSync(
  resolve(outDir, 'wrangler-call.json'),
  JSON.stringify(
    {
      nodeExecPath: process.execPath,
      argv: process.argv.slice(2),
    },
    null,
    2,
  ),
  'utf8',
);
`,
  );

  mkdirSync(resolve(fixtureRoot, 'dist'), { recursive: true });
  writeFileSync(resolve(fixtureRoot, 'dist/stale.marker'), 'stale-build', 'utf8');

  const binPath = resolve(fixtureRoot, 'bin');
  mkdirSync(binPath, { recursive: true });
  writeExecutable(
    resolve(binPath, 'npx'),
    `#!/usr/bin/env node
process.stderr.write('npx should not be invoked during deploy\\n');
process.exit(101);
`,
  );

  commitAll(fixtureRoot);
  return fixtureRoot;
}

const fixturePaths: string[] = [];
const scopedRunnerFixturePaths: string[] = [];

function runScopedVitest(args: string[]) {
  return spawnSync(process.execPath, [VITEST_SCOPE_ENTRYPOINT, ...args], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NO_COLOR: '1',
    },
    encoding: 'utf8',
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

describe('deploy-cloudflare entrypoint', () => {
  afterEach(() => {
    for (const fixturePath of fixturePaths.splice(0)) {
      rmSync(fixturePath, { recursive: true, force: true });
    }
  });

  it('builds fresh artifacts and deploys via the local wrangler package', () => {
    const fixtureRoot = createDeployFixture();
    fixturePaths.push(fixtureRoot);
    const shimBin = resolve(fixtureRoot, 'bin');

    const deploy = spawnSync(process.execPath, [DEPLOY_ENTRYPOINT], {
      cwd: fixtureRoot,
      env: {
        ...process.env,
        NO_COLOR: '1',
        CLOUDFLARE_ACCOUNT_ID: 'acct',
        CLOUDFLARE_API_TOKEN: 'token',
        PATH: `${shimBin}:${process.env.PATH ?? ''}`,
      },
      encoding: 'utf8',
      stdio: 'pipe',
    });

    expect(deploy.status).toBe(0);
    expect(existsSync(resolve(fixtureRoot, 'dist/build.marker'))).toBe(true);
    expect(existsSync(resolve(fixtureRoot, 'dist/stale.marker'))).toBe(false);

    const wranglerCall = JSON.parse(
      readFileSync(resolve(fixtureRoot, '.deploy-artifacts/wrangler-call.json'), 'utf8'),
    );
    expect(wranglerCall.nodeExecPath).toBe(process.execPath);
    expect(wranglerCall.argv).toEqual([
      'pages',
      'deploy',
      'dist',
      '--project-name=haif-project',
    ]);
  });

  it('surfaces missing command errors without crashing on TypeError', () => {
    const fixtureRoot = mkdtempSync(resolve(tmpdir(), 'cloudflare-missing-command-'));
    fixturePaths.push(fixtureRoot);

    const deploy = spawnSync(process.execPath, [DEPLOY_ENTRYPOINT], {
      cwd: fixtureRoot,
      env: {
        ...process.env,
        NO_COLOR: '1',
        PATH: fixtureRoot,
      },
      encoding: 'utf8',
      stdio: 'pipe',
    });

    const combinedOutput = `${deploy.stdout}${deploy.stderr}`;

    expect(deploy.status).toBe(1);
    expect(combinedOutput).toContain('Failed to run `git branch --show-current`');
    expect(combinedOutput).toContain('ENOENT');
    expect(combinedOutput).not.toContain('TypeError');
  });
});

describe('run-vitest-scope entrypoint', () => {
  afterEach(() => {
    for (const fixturePath of scopedRunnerFixturePaths.splice(0)) {
      rmSync(fixturePath, { recursive: true, force: true });
    }
  });

  it('keeps unit scope isolated when filtering cloudflareDeploy', () => {
    const scopedRun = runScopedVitest([
      UNIT_SCOPE_DIRECTORY,
      'cloudflareDeploy',
      '--reporter=verbose',
    ]);
    const combinedOutput = `${scopedRun.stdout}${scopedRun.stderr}`;

    expect(scopedRun.status).toBe(0);
    expect(combinedOutput).toContain('tests/unit/cloudflareDeploy.test.ts');
    expect(combinedOutput).not.toContain('tests/integration/cloudflareDeployment.test.ts');
  });

  it('fails when a positional filter matches no files in scope', () => {
    const scopedRun = runScopedVitest([UNIT_SCOPE_DIRECTORY, 'does-not-exist']);
    const combinedOutput = `${scopedRun.stdout}${scopedRun.stderr}`;

    expect(scopedRun.status).toBe(1);
    expect(combinedOutput).toContain('No test files matched');
  });

  it('forwards Vitest options after positional filters', () => {
    const scopedRun = runScopedVitest([
      UNIT_SCOPE_DIRECTORY,
      'cloudflareDeploy',
      '-t',
      'builds the wrangler deploy command for the production project',
      '--reporter=verbose',
    ]);
    const combinedOutput = `${scopedRun.stdout}${scopedRun.stderr}`;

    expect(scopedRun.status).toBe(0);
    expect(combinedOutput).toContain(
      'builds the wrangler deploy command for the production project',
    );
  });

  it('discovers .spec.ts tests within scope', () => {
    const fixtureRoot = mkdtempSync(resolve(process.cwd(), 'tests/.tmp-vitest-scope-'));
    scopedRunnerFixturePaths.push(fixtureRoot);
    const fixtureVitestConfig = resolve(fixtureRoot, 'vitest.scope.config.ts');

    writeFileSync(
      resolve(fixtureRoot, 'scopePattern.spec.ts'),
      `import { expect, test } from 'vitest';

test('scope pattern spec file executes', () => {
  expect(1).toBe(1);
});
`,
      'utf8',
    );
    writeFileSync(
      fixtureVitestConfig,
      `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
});
`,
      'utf8',
    );

    const scopedRun = runScopedVitest([
      fixtureRoot,
      'scopePattern',
      '--config',
      fixtureVitestConfig,
      '--reporter=verbose',
    ]);
    const combinedOutput = `${scopedRun.stdout}${scopedRun.stderr}`;

    expect(scopedRun.status).toBe(0);
    expect(combinedOutput).toContain('scope pattern spec file executes');
  });
});
