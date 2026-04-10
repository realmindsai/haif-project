export const CLOUDFLARE_PROJECT_NAME = 'haif-project';
export const CLOUDFLARE_DEPLOY_DIR = 'dist';

export function getCloudflareDeployBlockers({
  branch,
  gitStatusOutput,
  distExists,
  env,
}) {
  const blockers = [];

  if (branch !== 'main') {
    blockers.push(`Deploys must run from main. Current branch: ${branch}.`);
  }

  if (gitStatusOutput.trim() !== '') {
    blockers.push('Working tree must be clean before deploying to Cloudflare Pages.');
  }

  if (!distExists) {
    blockers.push('Build output missing. Run `npm run build` before deploying.');
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
  return ['wrangler', 'pages', 'deploy', directory, `--project-name=${projectName}`];
}
