# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

All commands run from `site/`:

```bash
cd site
npm install          # Install dependencies (Node >=22.12.0 required)
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to site/dist/ (includes PDF generation)
npm run preview      # Preview production build locally
```

### Testing

```bash
npm run test                    # Run all tests (unit → integration → e2e)
npm run test:unit               # Vitest unit tests only
npm run test:integration        # Vitest integration tests only
npm run test:e2e                # Playwright browser tests only
npm run test:unit cloudflareDeploy   # Run a single test file by name fragment
```

- **Vitest** (unit + integration): `tests/**/*.test.ts`, node environment, 30s timeout
- **Playwright** (e2e): `tests/e2e/*.spec.ts`, auto-launches dev server on 127.0.0.1:4321
- Test organization: `tests/unit/` (pure functions), `tests/integration/` (build/deploy flows with temp fixtures), `tests/e2e/` (browser)

### PDF Generation

Typst-based pipeline: `site/src/pdfs/*.typ` → `site/public/downloads/*.pdf`

```bash
npm run build:pdfs     # Build PDFs only (requires `typst` CLI on PATH)
```

`haif-template.typ` is the shared template — not compiled directly. The `build` script chains PDF generation before `astro build`.

### Deployment

Manual CLI deploy to Cloudflare Pages (not git-connected):

```bash
npm run deploy:cloudflare
```

Requires env vars `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` (stored in `.env` at repo root, gitignored). The deploy script enforces: must be on `main`, working tree must be clean, build must not create unexpected uncommitted changes. See `docs/deployment/cloudflare_pages.md` for full runbook.

## Architecture

### Tech Stack
- **Astro 6** static site (zero JS by default), deployed to Cloudflare Pages
- **Production domain:** hospitalacupuncture.com (`www.` 301-redirects to apex)
- **Integrations:** @astrojs/sitemap
- All styling in a single `site/src/styles/global.css` (CSS custom properties, mobile-first)
- No component framework (React/Vue/etc) — pure `.astro` files

### Site Structure (`site/src/`)

```
layouts/
  BaseLayout.astro       ← Root layout: <head>, sticky header, nav, footer, JSON-LD schema slot
  FrameworkLayout.astro  ← Wraps BaseLayout for phase pages: breadcrumbs, phase stepper, prev/next nav
pages/
  index.astro            ← Landing: hero, phase cards, audience cards, evidence table
  about.astro, contact.astro, evidence.astro, faq.astro, references.astro, resources.astro
  framework/             ← 4 EPIS phases (exploration, preparation, implementation, sustainment)
  examples/              ← PONV acupressure (done) + ED acupuncture (shell only, blocked on paper)
  for/                   ← Audience entry points: administrators, clinicians, practitioners, researchers
```

### Key Patterns
- **`url()` helper** (`src/utils.ts`) — wraps all internal hrefs/srcs with `import.meta.env.BASE_URL`; use it for every link and asset path
- **FrameworkLayout** handles phase navigation (stepper bar, prev/next links) — all `/framework/*` pages use it
- **BaseLayout** accepts `schema` prop for JSON-LD structured data (MedicalWebPage, FAQPage, etc.)
- **`<details>/<summary>`** for collapsible content sections — no JS, native HTML
- **GRADE evidence badges** via CSS classes: `.grade-high`, `.grade-moderate`, `.grade-low`, `.grade-very-low`
- **"Bottom Line" boxes** appear at top of clinical pages (`.bottom-line` class) — summary before detail
- **`lastReviewed` prop** on layouts — every clinical page should show "Last reviewed: [date]"
- **Audience entry points** (`/for/*`) are tailored framings that funnel into the same core framework content

### Design System (CSS custom properties in global.css)
- Primary: `#1a5276`, accent: `#d4a017`, success/green: `#27ae60`
- Max content width: 52rem
- 44px minimum touch targets (WCAG), 48px on mobile nav
- Mobile breakpoint: 768px (hamburger nav)

## Project Context

Collaboration with Dr Zhen Zheng (ZZ), RMIT academic. Two parallel projects:

1. **HAIF** (Hospital Acupuncture Implementation Framework) — rebuild the POPA4Ease website into a broader hospital acupuncture implementation resource
2. **How We Live** — podcast/content platform (separate from the site build)

### Key People
- **DW** (Dennis Wollersheim) — tech/AI lead
- **ZZ** (Zhen Zheng) — RMIT researcher, content owner, NHMRC TRIP Fellow

### Domain Knowledge
- **EPIS framework** = Exploration → Preparation → Implementation → Sustainment (the 4 phases)
- ONE framework, MULTIPLE applications: PONV/acupressure (nurse-led, done) + ED acupuncture (registrar-led, blocked on paper publication)
- Audience segments: hospital administrators (cost/ROI), clinicians (evidence/protocols), acupuncture practitioners (credentialing), researchers (methodology)
- **GEO** (Generative AI Optimization) is a key strategy — llms.txt, FAQ schema, quotable claims with citations

### Key Files (non-code)
- `haif_vision-synthesis.md` — merged requirements + best practices, delivery phases
- `haif_site-structure.md` — full sitemap, page wireframes, llms.txt content
- `zhen_requirements.md` — ZZ's requirements extracted from transcript
- `popa4ease_site_content.md` — spider of the old WordPress site (content source)

### Delivery Phases
- **Phase A (NOW):** Site live on hospitalacupuncture.com, PONV content as Example 1, framework pages, mobile-first
- **Phase B (LATER):** ED acupuncture as Example 2 (after paper publishes), full downloadable assets, GRADE badges on all claims

## Conventions
- Transcript speaker labels: DW = Speaker 1, ZZ = Speaker 2
- MVTT = compressed transcript format (see vtt-compressor-skill)
