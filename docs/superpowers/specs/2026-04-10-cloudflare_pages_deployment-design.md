# Cloudflare Pages Deployment Design

Date: 2026-04-10
Project: HAIF (`haif-project`)
Status: Proposed

## Purpose

Document the current deployment path, define the replacement deployment path for Cloudflare Pages, and specify the manual production workflow for `hospitalacupuncture.com` and `www.hospitalacupuncture.com`.

This design replaces GitHub Pages as the production host. GitHub Pages becomes historical context only, not an active fallback.

## Current Deployment Path

### What is live now

- Source repository: `https://github.com/realmindsai/haif-project`
- Source branch: `main`
- Public host: `https://realmindsai.github.io/haif-project/`
- GitHub Pages source branch: `gh-pages`
- Build output: `site/dist`
- Astro production config:
  - `site: 'https://realmindsai.github.io'`
  - `base: '/haif-project/'`

### How the current deployment works

1. Work is committed to `main`.
2. A production build is generated from `site/dist`.
3. The build artifact is copied into the `gh-pages` branch root.
4. GitHub Pages publishes from `gh-pages`.
5. `.nojekyll` must exist in the published artifact so GitHub Pages does not ignore the `_astro` asset directory.

### Problems with the current deployment path

- Production depends on a second branch that exists only as a rendered artifact dump.
- The production URL lives on a subpath (`/haif-project/`), which forces Astro `base` handling everywhere.
- The README currently points at the wrong live URL (`haif-website`), which proves the deployment path is already drifting into folklore.
- GitHub Pages requires `_astro`-preserving hacks like `.nojekyll`.
- Manual deploys are reproducible only if someone remembers the exact branch-copy ritual.

## Goals

- Make `main` the only meaningful source branch for production.
- Make Cloudflare Pages the only production host.
- Serve the site from the root domain, not a GitHub subpath.
- Support both `hospitalacupuncture.com` and `www.hospitalacupuncture.com`.
- Keep deploys manual and local via CLI, not automatic on every push.
- Make the deployment path explicit, documented, and repeatable.

## Non-Goals

- Keeping GitHub Pages as a parallel production fallback
- Supporting two different production build modes long-term
- Adding automatic production deploys from GitHub Actions

## Options Considered

### Option A: Cloudflare-only manual CLI deploy

Build locally, then deploy `site/dist` using `wrangler pages deploy`.

Why this is recommended:

- matches the requested manual workflow
- keeps the deployment path scriptable and reproducible
- removes the need for `gh-pages`
- makes root-domain deployment straightforward

Tradeoff:

- requires local Cloudflare authentication on the machine performing deploys

### Option B: Cloudflare-only manual dashboard deploy

Use the Cloudflare UI to deploy production from the latest commit.

Why this was rejected:

- too much critical behavior lives in a web UI instead of the repo
- harder to document and repeat exactly
- easier to deploy the wrong thing

### Option C: Hybrid GitHub Pages + Cloudflare

Maintain both deployment targets.

Why this was rejected:

- creates config complexity for no approved value
- keeps subpath and root-path concerns alive at the same time
- increases the chance of stale or contradictory production state

## Recommended Architecture

### Production hosting

- Production host: Cloudflare Pages
- Production branch: `main`
- Production artifact: `site/dist`
- Production domains:
  - `hospitalacupuncture.com`
  - `www.hospitalacupuncture.com`

### Canonical domain

Use `hospitalacupuncture.com` as the canonical domain.

`www.hospitalacupuncture.com` should redirect to `hospitalacupuncture.com`.

Reason:

- cleaner public URL
- simpler canonical metadata
- avoids splitting authority between two public URLs

### Source-of-truth model

- Source code lives on `main`
- Production build is always generated from committed code on `main`
- No artifact branch is maintained
- `gh-pages` is removed from the production process after cutover

## Configuration Design

### Astro production config

Current Astro config is GitHub Pages specific and must be changed for root-domain hosting.

Required production config state:

- `site: 'https://hospitalacupuncture.com'`
- remove `base: '/haif-project/'`

Implications:

- asset URLs become root-relative instead of subpath-relative
- generated sitemap URLs become correct for the production domain
- local and production path behavior becomes simpler

### Public artifact behavior

Cloudflare Pages does not need `.nojekyll`.

That file may remain harmlessly in the repo during transition, but it is no longer part of the production correctness story once GitHub Pages is retired.

### Deployment command

The repo should expose a single manual production command, likely one of:

- `npm run deploy:cloudflare`
- `npm run publish`

Recommended underlying command:

```bash
wrangler pages deploy dist --project-name haif-project
```

This command should run from `site/` after a verified production build.

### Tooling expectation

`wrangler` should be part of the documented toolchain for this repo, either:

- as a dev dependency invoked from npm scripts, or
- as an explicitly required CLI installed on the deployment machine

Preferred option: add `wrangler` as a dev dependency so deploy behavior is repo-pinned instead of machine-random.

## Manual Production Workflow

### Deploy flow

From repo root:

1. `cd site`
2. `npm run test`
3. `npm run build`
4. `npm run deploy:cloudflare`

### Expected behavior

- tests pass before any production deploy
- build output is generated into `site/dist`
- deploy uploads the current `dist` artifact to the Cloudflare Pages project
- production becomes available at `https://hospitalacupuncture.com`

### Authentication

The deployment machine must have Cloudflare auth configured for the account owning the Pages project.

Document one of these explicitly:

- `wrangler login`, or
- API token-based auth through environment variables

Preferred option: API-token-based auth for repeatability, with `wrangler login` acceptable for initial setup.

## Cloudflare Pages Project Design

### Project

Create one Cloudflare Pages project for HAIF.

Recommended project name:

- `haif-project`

This keeps naming aligned with the repo and avoids making deployment commands harder than necessary.

### Domains

Attach:

- `hospitalacupuncture.com`
- `www.hospitalacupuncture.com`

Configure redirect:

- `www.hospitalacupuncture.com` -> `https://hospitalacupuncture.com`

### Build mode

Because deploys are manual from local CLI, Cloudflare Pages should accept uploaded static assets rather than owning the build logic.

That avoids duplicating Node version, build command, and build-environment concerns inside Cloudflare for production deploys.

## Cutover Plan

### Stage 1: Prepare repo

- add deployment documentation
- add a manual Cloudflare deploy script
- update Astro config from GitHub Pages mode to root-domain mode
- update any stale hardcoded live URLs
- verify all local paths still work without `/haif-project/`

### Stage 2: Prepare Cloudflare

- create the Pages project
- authenticate local deploy workflow
- attach apex and `www` domains
- configure canonical redirect from `www` to apex

### Stage 3: Validate before cutover

Run local verification:

- `npm run test`
- `npm run build`

Then perform first Cloudflare deploy from local CLI and verify:

- homepage loads
- framework pages load
- exploration comparison table renders
- recovered images load
- original-format `.xlsx` download works
- sitemap and robots are present
- redirects behave correctly

### Stage 4: Retire GitHub Pages

After Cloudflare production is validated:

- stop deploying `gh-pages`
- remove GitHub Pages deployment instructions from docs
- optionally delete `gh-pages` branch after a short confidence window

Deleting `gh-pages` is not required for correctness, but keeping it around invites future confusion.

## Verification Checklist

### Local verification

- `cd site && npm run test`
- `cd site && npm run build`

### Production smoke test

- `/`
- `/framework/exploration/`
- `/resources/`
- key image assets
- key download assets
- sitemap
- canonical domain behavior

### Deployment correctness checks

- site HTML references root-relative paths, not `/haif-project/`
- generated sitemap uses `https://hospitalacupuncture.com`
- no production dependency on `gh-pages`

## Risks

### Highest risk: path breakage after removing `base`

Anything implicitly relying on `/haif-project/` can break during cutover.

Mitigation:

- search for hardcoded `/haif-project/`
- run local verification after config change
- smoke-test public pages after first Cloudflare deploy

### Medium risk: stale documentation

The repo already contains deployment statements that disagree with reality.

Mitigation:

- write one canonical deployment document
- update README live URL and deployment section
- remove obsolete GitHub Pages deployment instructions

### Medium risk: DNS cutover mistakes

The code can be right while the domain still points somewhere dumb.

Mitigation:

- document exact Cloudflare domain setup
- verify apex and `www` after cutover
- make the redirect behavior explicit

## Rollback

Rollback should be operational, not theoretical.

If the first Cloudflare production deploy is bad:

- fix the issue locally
- rebuild
- redeploy the previous known-good artifact or commit through the same manual CLI path

GitHub Pages is not treated as an official fallback in this design. If rollback is needed, rollback happens within Cloudflare deployment history or by redeploying a prior git revision.

## Documentation Deliverables

Implementation should produce:

- a deployment operations document describing the real production path
- updated README live URL and deployment instructions
- a documented Cloudflare CLI deploy command
- explicit note that GitHub Pages is retired from production use

## Acceptance Criteria

This design is satisfied when:

1. Production is served from Cloudflare Pages at `https://hospitalacupuncture.com`
2. `www.hospitalacupuncture.com` redirects to the apex domain
3. Production deploys are manual via local CLI
4. Astro no longer uses the GitHub Pages subpath base
5. `gh-pages` is no longer part of the production workflow
6. Deployment documentation reflects reality rather than historical accidents
