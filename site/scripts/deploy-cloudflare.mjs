import { spawnSync } from 'node:child_process';

import {
  getCloudflareDeployArgs,
  getCloudflareDeployBlockers,
  resolveLocalWranglerEntrypoint,
} from './lib/cloudflareDeploy.mjs';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    ...options,
  });

  if (result.error) {
    throw new Error(`Failed to run \`${command} ${args.join(' ')}\`: ${result.error.message}`);
  }

  if (result.status !== 0) {
    const stderr = typeof result.stderr === 'string' ? result.stderr.trim() : '';
    const stdout = typeof result.stdout === 'string' ? result.stdout.trim() : '';
    const details = stderr || stdout || `${command} ${args.join(' ')} failed`;
    throw new Error(`Failed to run \`${command} ${args.join(' ')}\`: ${details}`);
  }

  return typeof result.stdout === 'string' ? result.stdout.trim() : '';
}

function main() {
  const branch = run('git', ['branch', '--show-current']);
  const gitStatusOutput = run('git', ['status', '--porcelain']);

  const blockers = getCloudflareDeployBlockers({
    branch,
    gitStatusOutput,
    env: process.env,
  });

  if (blockers.length > 0) {
    for (const blocker of blockers) {
      console.error(`- ${blocker}`);
    }

    return 1;
  }

  run('npm', ['run', 'build'], { stdio: 'inherit' });

  const postBuildGitStatusOutput = run('git', ['status', '--porcelain']);
  const unexpectedChanges = postBuildGitStatusOutput
    .split('\n')
    .filter((line) => line.trim() !== '')
    .filter((line) => !line.trim().endsWith('.pdf'));
  if (unexpectedChanges.length > 0) {
    console.error('- Build created uncommitted changes:');
    for (const line of unexpectedChanges) {
      console.error(`  ${line}`);
    }
    return 1;
  }
  // Reset expected PDF regeneration so wrangler deploys the committed versions
  if (postBuildGitStatusOutput.trim() !== '') {
    run('git', ['checkout', '--', '.']);
  }

  const deploy = spawnSync(
    process.execPath,
    [resolveLocalWranglerEntrypoint(), ...getCloudflareDeployArgs()],
    {
      env: process.env,
      stdio: 'inherit',
    },
  );

  if (deploy.error) {
    throw new Error(`Failed to run local wrangler deploy: ${deploy.error.message}`);
  }

  return deploy.status ?? 1;
}

try {
  process.exit(main());
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
