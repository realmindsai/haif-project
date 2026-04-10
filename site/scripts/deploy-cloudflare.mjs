import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  CLOUDFLARE_DEPLOY_DIR,
  getCloudflareDeployArgs,
  getCloudflareDeployBlockers,
} from './lib/cloudflareDeploy.mjs';

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    const message = result.stderr.trim() || `${command} ${args.join(' ')} failed`;
    throw new Error(message);
  }

  return result.stdout.trim();
}

const branch = run('git', ['branch', '--show-current']);
const gitStatusOutput = run('git', ['status', '--porcelain']);
const distPath = resolve(process.cwd(), CLOUDFLARE_DEPLOY_DIR);

const blockers = getCloudflareDeployBlockers({
  branch,
  gitStatusOutput,
  distExists: existsSync(distPath),
  env: process.env,
});

if (blockers.length > 0) {
  for (const blocker of blockers) {
    console.error(`- ${blocker}`);
  }

  process.exit(1);
}

const deploy = spawnSync('npx', getCloudflareDeployArgs(), {
  env: process.env,
  stdio: 'inherit',
});

process.exit(deploy.status ?? 1);
