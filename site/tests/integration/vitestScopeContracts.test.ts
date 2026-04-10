import { spawnSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

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

describe('scoped npm test contracts', () => {
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
});
