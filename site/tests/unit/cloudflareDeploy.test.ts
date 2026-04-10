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
        distExists: true,
        env: {},
      }),
    ).toEqual([
      'Deploys must run from main. Current branch: feature/cloudflare.',
      'Working tree must be clean before deploying to Cloudflare Pages.',
      'Missing CLOUDFLARE_ACCOUNT_ID.',
      'Missing CLOUDFLARE_API_TOKEN.',
    ]);
  });

  it('allows deploy when branch and credentials are ready', () => {
    expect(
      getCloudflareDeployBlockers({
        branch: 'main',
        gitStatusOutput: '',
        distExists: false,
        env: {
          CLOUDFLARE_ACCOUNT_ID: 'acct',
          CLOUDFLARE_API_TOKEN: 'token',
        },
      }),
    ).toEqual([]);
  });
});
