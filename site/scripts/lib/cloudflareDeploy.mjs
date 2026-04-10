import { createRequire } from 'node:module';

export const CLOUDFLARE_PROJECT_NAME = 'haif-project';
export const CLOUDFLARE_DEPLOY_DIR = 'dist';

const require = createRequire(import.meta.url);

export function getCloudflareDeployBlockers({
  branch,
  gitStatusOutput,
  env,
}) {
  const blockers = [];

  if (branch !== 'main') {
    blockers.push(`Deploys must run from main. Current branch: ${branch}.`);
  }

  if (gitStatusOutput.trim() !== '') {
    blockers.push('Working tree must be clean before deploying to Cloudflare Pages.');
  }

  if (!env.CLOUDFLARE_ACCOUNT_ID) {
    blockers.push('Missing CLOUDFLARE_ACCOUNT_ID.');
  }

  if (!env.CLOUDFLARE_API_TOKEN) {
    blockers.push('Missing CLOUDFLARE_API_TOKEN.');
  }

  return blockers;
}

export function getCloudflareDeployArgs({
  directory = CLOUDFLARE_DEPLOY_DIR,
  projectName = CLOUDFLARE_PROJECT_NAME,
} = {}) {
  return ['pages', 'deploy', directory, `--project-name=${projectName}`];
}

export function resolveLocalWranglerEntrypoint(cwd = process.cwd()) {
  try {
    return require.resolve('wrangler/bin/wrangler.js', {
      paths: [cwd],
    });
  } catch (error) {
    throw new Error(
      `Unable to resolve local Wrangler in ${cwd}. Install dependencies before deploying.`,
      {
        cause: error,
      },
    );
  }
}
