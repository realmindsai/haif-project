import { describe, expect, it } from 'vitest';
import {
  CLOUDFLARE_DEPLOY_DIR,
  CLOUDFLARE_PROJECT_NAME,
  getCloudflareDeployArgs,
  getCloudflareDeployBlockers,
} from '../../scripts/lib/cloudflareDeploy.mjs';

describe('cloudflare deploy helpers', () => {
  it('builds the wrangler deploy command for the production project', () => {
    expect(getCloudflareDeployArgs()).toEqual([
      'wrangler',
      'pages',
      'deploy',
      CLOUDFLARE_DEPLOY_DIR,
      `--project-name=${CLOUDFLARE_PROJECT_NAME}`,
    ]);
  });

  it('blocks deploys from a dirty or non-main worktree', () => {
    expect(
      getCloudflareDeployBlockers({
        branch: 'feature/cloudflare',
        gitStatusOutput: ' M site/README.md',
        distExists: false,
        env: {},
      }),
    ).toEqual([
      'Deploys must run from main. Current branch: feature/cloudflare.',
      'Working tree must be clean before deploying to Cloudflare Pages.',
      'Build output missing. Run `npm run build` before deploying.',
      'Missing CLOUDFLARE_ACCOUNT_ID.',
      'Missing CLOUDFLARE_API_TOKEN.',
    ]);
  });

  it('allows deploy when branch, build output, and credentials are ready', () => {
    expect(
      getCloudflareDeployBlockers({
        branch: 'main',
        gitStatusOutput: '',
        distExists: true,
        env: {
          CLOUDFLARE_ACCOUNT_ID: 'acct',
          CLOUDFLARE_API_TOKEN: 'token',
        },
      }),
    ).toEqual([]);
  });
});
