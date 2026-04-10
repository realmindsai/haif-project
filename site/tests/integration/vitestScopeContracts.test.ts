import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { relative, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const scopeFixturePaths: string[] = [];

function runNpmTestScript(args: string[]) {
  return spawnSync('npm', args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NO_COLOR: '1',
    },
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

function runScopeRunner(args: string[]) {
  return spawnSync(process.execPath, ['scripts/run-vitest-scope.mjs', ...args], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NO_COLOR: '1',
    },
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

describe('scoped npm test contracts', () => {
  afterEach(() => {
    for (const fixturePath of scopeFixturePaths.splice(0)) {
      rmSync(fixturePath, { recursive: true, force: true });
    }
  });

  it('isolates the real unit command to the cloudflareDeploy unit file', () => {
    const result = runNpmTestScript(['run', 'test:unit', '--', 'cloudflareDeploy']);
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(0);
    expect(combinedOutput).toContain('tests/unit/cloudflareDeploy.test.ts');
    expect(combinedOutput).not.toContain('tests/integration/cloudflareDeployment.test.ts');
  });

  it('isolates the real integration command to the cloudflareDeployment integration file', () => {
    const result = runNpmTestScript(['run', 'test:integration', '--', 'cloudflareDeployment']);
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(0);
    expect(combinedOutput).toContain('tests/integration/cloudflareDeployment.test.ts');
    expect(combinedOutput).not.toContain('tests/integration/recoveredAssets.test.ts');
    expect(combinedOutput).not.toContain('tests/integration/vitestScopeContracts.test.ts');
  });

  it('preserves Vitest multi-filter OR semantics inside unit scope', () => {
    const result = runNpmTestScript(['run', 'test:unit', '--', 'cloudflareDeploy', 'url']);
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(0);
    expect(combinedOutput).toContain('tests/unit/cloudflareDeploy.test.ts');
    expect(combinedOutput).toContain('tests/unit/url.test.ts');
    expect(combinedOutput).not.toContain('tests/integration/cloudflareDeployment.test.ts');
  });

  it('fails cleanly when the requested scope directory does not exist', () => {
    const result = runScopeRunner(['tests/does-not-exist']);
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(combinedOutput).toContain('Scope directory');
    expect(combinedOutput).not.toContain('Error: ENOENT');
  });

  it('fails when a discovered scope contains no tests', () => {
    const fixtureRoot = mkdtempSync(resolve(tmpdir(), 'empty-vitest-scope-'));
    scopeFixturePaths.push(fixtureRoot);
    const emptyScope = resolve(fixtureRoot, 'empty');
    mkdirSync(emptyScope, { recursive: true });

    const result = runScopeRunner([relative(process.cwd(), emptyScope)]);
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(combinedOutput).toContain('No test files found within');
  });
});
