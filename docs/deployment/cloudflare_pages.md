# Cloudflare Pages Deployment Runbook

## Current path and history

- Historical production path: GitHub Pages from the `gh-pages` branch.
- Current production path: manual CLI deploy to Cloudflare Pages.
- Canonical production URL: `https://hospitalacupuncture.com`.
- `www` host is supported, but should always redirect to the apex domain.

## Prerequisites

- Run deploys from the `main` branch.
- Keep the working tree clean before starting the deploy.
- Install Node >= 22.12.0 dependencies in [`site/`](/Users/dewoller/code/people/zhen_zheng/hospital_acupuncture/site).
- Install Typst and ensure `typst` is available on `PATH`. `npm run build` and `npm run deploy:cloudflare` both compile the tracked PDF resources before Astro builds `dist/`.

## First-time Cloudflare Pages setup

Run from [`site/`](/Users/dewoller/code/people/zhen_zheng/hospital_acupuncture/site):

```bash
npm exec wrangler pages project create haif-project
```

Recommended project settings:

- Framework preset: `None` (manual static deploy).
- Production branch: not used for deploys (deploys are CLI-driven).
- Build output directory: `dist`.

Then add custom domains in Cloudflare Pages:

1. `hospitalacupuncture.com`
2. `www.hospitalacupuncture.com`

## Authentication requirements

Deploy requires both environment variables:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Example shell setup:

```bash
export CLOUDFLARE_ACCOUNT_ID=your_account_id
export CLOUDFLARE_API_TOKEN=your_api_token
```

## Manual production deploy

Run from [`site/`](/Users/dewoller/code/people/zhen_zheng/hospital_acupuncture/site) on `main`:

```bash
npm run test
npm run deploy:cloudflare
```

Do not run `npm run build` separately here. `npm run deploy:cloudflare` performs the production build itself and aborts if that build creates uncommitted changes.

The deploy script enforces guardrails:

- `main` branch only
- clean working tree before deploy
- clean working tree after build, including generated PDF updates
- local Wrangler CLI invocation (no `npx`)

## Redirect setup (`www` -> apex)

In Cloudflare dashboard:

1. Ensure `www.hospitalacupuncture.com` is proxied by Cloudflare.
2. Open **Rules** and create a **Single Redirect** for the `www.hospitalacupuncture.com` hostname.
3. Set source to `https://www.hospitalacupuncture.com/*`.
4. Set destination to `https://hospitalacupuncture.com/${1}`.
5. Use `301` permanent redirect.

This should yield: `www -> apex`.

## Verification checklist

- `curl -I https://hospitalacupuncture.com/` returns `200`.
- `curl -I https://www.hospitalacupuncture.com/` returns `301`.
- `location` header points to `https://hospitalacupuncture.com/...`.
- `curl -s https://hospitalacupuncture.com/framework/exploration/ | rg 'Manual Acupressure'` returns a match.
- `curl -s https://hospitalacupuncture.com/resources/ | rg 'ponv_data_extraction_template.xlsx'` returns a match.

## Retire `gh-pages`

Retire `gh-pages` from active operations once Cloudflare production is confirmed healthy.

1. Stop all deploys to GitHub Pages.
2. Remove deployment references to `gh-pages` from operational docs/scripts.
3. Optionally delete the branch:

```bash
git push origin --delete gh-pages
```
