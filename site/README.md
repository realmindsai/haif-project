# HAIF — Hospital Acupuncture Implementation Framework

A methodology for integrating acupuncture and acupressure into hospital practice. Evidence-based. Practitioner-tested.

**Live site:** https://hospitalacupuncture.com

## What is HAIF?

HAIF provides a 4-phase implementation framework (Exploration → Preparation → Implementation → Sustainment) based on the EPIS model from implementation science. It guides hospitals through the process of introducing acupuncture and acupressure services — from initial needs assessment through to long-term sustainment.

The framework is application-agnostic: the same methodology applies whether implementing nurse-led acupressure for post-operative nausea (PONV) or registrar-led acupuncture in emergency departments.

## Site Structure

- **Framework** — the 4 EPIS phases, each with collapsible detail sections and downloadable checklists
- **Examples** — real-world application case studies (PONV acupressure at Northern Hospital, Victoria)
- **Audience paths** — tailored entry points for hospital administrators, clinicians, acupuncture practitioners, and researchers
- **Evidence** — GRADE-rated evidence summaries with Cochrane citations
- **Resources** — downloadable PDFs: phase checklists, clinical decision aids, staff surveys

## Development

Requires Node >= 22.12.0 and Typst on `PATH`. `npm run build` and `npm run deploy:cloudflare` both compile the PDF resources before the Astro build.

```bash
npm install
npm run dev        # Dev server at localhost:4321
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

## Deployment

Production is served from Cloudflare Pages at `https://hospitalacupuncture.com`. Deploy from the `main` branch with a clean working tree after exporting `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`.

```bash
npm run deploy:cloudflare
```

Deployment runbook: `../docs/deployment/cloudflare_pages.md`.

## POPA4Ease recovery workflow

- `npm run recover:popa4ease` crawls the legacy site, writes the manifest, updates the gap report, and syncs recovered local files.
- `npm run test:unit` verifies recovery helpers.
- `npm run test:integration` verifies manifest-backed rendering and original-format downloads.
- `npm run test:e2e` verifies the Exploration intervention interaction.

## Author

Dr Zhen Zheng, PhD — RMIT University, NHMRC Translating Research into Practice Fellow.
