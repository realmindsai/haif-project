import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
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

  it('accepts an absolute-path unit filter like raw Vitest does', () => {
    const result = runNpmTestScript([
      'run',
      'test:unit',
      '--',
      resolve(process.cwd(), 'tests/unit/cloudflareDeploy.test.ts'),
    ]);
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(0);
    expect(combinedOutput).toContain('tests/unit/cloudflareDeploy.test.ts');
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
    const fixtureRoot = mkdtempSync(resolve(process.cwd(), 'tests/.tmp-empty-vitest-scope-'));
    scopeFixturePaths.push(fixtureRoot);
    const emptyScope = resolve(fixtureRoot, 'empty');
    mkdirSync(emptyScope, { recursive: true });

    const result = runScopeRunner([relative(process.cwd(), emptyScope)]);
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(combinedOutput).toContain('No test files found within');
  });

  it('prints help without running scoped tests', () => {
    const result = runNpmTestScript(['run', 'test:unit', '--', '--help']);
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(0);
    expect(combinedOutput).toContain('Usage:');
    expect(combinedOutput).not.toContain('tests/unit/cloudflareDeploy.test.ts');
  });

  it('rejects scope directories outside the project root', () => {
    const fixtureRoot = mkdtempSync(resolve(tmpdir(), 'outside-vitest-scope-'));
    scopeFixturePaths.push(fixtureRoot);
    mkdirSync(resolve(fixtureRoot, 'outside'), { recursive: true });

    const result = runScopeRunner([resolve(fixtureRoot, 'outside')]);
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(combinedOutput).toContain('must stay within the project root');
  });

  it('rejects in-repo symlinks that point outside the project root', () => {
    const externalRoot = mkdtempSync(resolve(tmpdir(), 'outside-vitest-symlink-target-'));
    const symlinkPath = resolve(process.cwd(), 'tests/.tmp-symlink-scope');
    scopeFixturePaths.push(externalRoot, symlinkPath);

    writeFileSync(
      resolve(externalRoot, 'outside.test.ts'),
      `import { expect, test } from 'vitest';

test('outside scope via symlink executes', () => {
  expect(1).toBe(1);
});
`,
      'utf8',
    );
    symlinkSync(externalRoot, symlinkPath);

    const result = runScopeRunner(['tests/.tmp-symlink-scope', 'outside']);
    const combinedOutput = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(combinedOutput).toContain('must stay within the project root');
    expect(combinedOutput).not.toContain('outside scope via symlink executes');
  });
});
