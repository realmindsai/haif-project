# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

All commands run from `site/`:

```bash
cd site
npm install          # Install dependencies (Node >=22.12.0 required)
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to site/dist/
npm run preview      # Preview production build locally
```

PDF generation (planned, not yet implemented):
```bash
# Typst-based PDF pipeline: site/src/pdfs/*.typ → site/public/downloads/*.pdf
# See pdf_generation_plan.md for details
```

## Architecture

### Tech Stack
- **Astro 6** static site (zero JS by default), deployed to Cloudflare Pages
- **Target domain:** hospitalacupuncture.com (not yet live)
- **Integrations:** @astrojs/sitemap
- All styling in a single `site/src/styles/global.css` (CSS custom properties, mobile-first)
- No component framework (React/Vue/etc) — pure `.astro` files

### Site Structure (`site/src/`)

```
layouts/
  BaseLayout.astro       ← Root layout: <head>, sticky header, nav, footer, JSON-LD schema slot
  FrameworkLayout.astro  ← Wraps BaseLayout for phase pages: breadcrumbs, phase stepper, prev/next nav
pages/
  index.astro            ← Landing: hero, circular SVG diagram, audience cards, evidence table
  about.astro
  contact.astro
  evidence.astro
  faq.astro
  references.astro
  resources.astro
  framework/             ← 4 EPIS phases (exploration, preparation, implementation, sustainment)
  examples/              ← PONV acupressure (done) + ED acupuncture (shell only, blocked on paper)
  for/                   ← Audience entry points: administrators, clinicians, practitioners, researchers
public/
  llms.txt               ← AI site summary for GEO
  robots.txt             ← Allows GPTBot, ClaudeBot, PerplexityBot
  downloads/             ← PDF resources (to be generated)
```

### Key Patterns
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
- `pdf_generation_plan.md` — plan for Typst-based PDF checklists and clinical tools

### Delivery Phases
- **Phase A (NOW):** Site live on hospitalacupuncture.com, PONV content as Example 1, framework pages, mobile-first
- **Phase B (LATER):** ED acupuncture as Example 2 (after paper publishes), full downloadable assets, GRADE badges on all claims

## Conventions
- Transcript speaker labels: DW = Speaker 1, ZZ = Speaker 2
- MVTT = compressed transcript format (see vtt-compressor-skill)
