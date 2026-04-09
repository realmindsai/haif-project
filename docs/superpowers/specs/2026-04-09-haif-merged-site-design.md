# HAIF Merged Site Design Spec

**Date:** 2026-04-09
**Status:** Approved
**Approach:** Reskin existing Astro site to merge POPA4Ease visual identity with HAIF architecture

---

## Context

Dr Zhen Zheng (ZZ) wants the new HAIF site at hospitalacupuncture.com to look and feel like the existing POPA4Ease WordPress site, while incorporating new features from the HAIF Astro build. The site must be ready before ZZ's US conference trip (~April 18). She will present a QR code linking to the live site.

Key constraint from ZZ: "I quite like POPA4Ease design" — she wants the familiar structure, visual warmth, and images. But the site must rebrand to HAIF and add new content sections.

---

## Homepage

### Above the fold

1. **HAIF title and intro paragraph.** Large heading: "Hospital Acupuncture Implementation Framework". One short paragraph adapted from POPA4Ease explaining what the framework is and why PONV matters.

2. **Four phase cards.** Displayed in a row (2x2 on mobile). Each card has:
   - Image from the old POPA4Ease site
   - Phase number and name (e.g., "Phase 1: Exploration")
   - One-line description (e.g., "Identifying human factors and environmental factors")
   - Clickable — links to the corresponding phase page

### Below the fold

3. **"Bottom Line" summary box.** Acupuncture/acupressure as only non-pharmacological interventions in PONV guidelines, framework rationale. Note: CLAUDE.md convention places Bottom Line boxes at top of clinical pages; this homepage placement is intentional — the homepage is a landing page, not a clinical page, so the Bottom Line serves as a value proposition below the phase cards rather than a clinical summary.

4. **"I am a..." audience cards.** Four cards linking to audience-tailored entry points:
   - Hospital Administrator — Cost, credentialing, and workflow impact
   - Clinician — Evidence, protocols, and safety data
   - Acupuncture Practitioner — Hospital credentialing and collaboration
   - Researcher — Methodology, data, and publications

5. **Application Examples.** Two cards:
   - Acupressure for PONV (nurse-led) — links to case study page
   - Acupuncture in Emergency — "Coming Soon" badge

6. **Key Evidence table.** Three-row table showing PC6 stimulation outcomes (nausea, vomiting, rescue antiemetics) with RR values, confidence intervals, and GRADE badges.

7. **About the Framework blurb.** Author attribution: Dr Zhen Zheng, PhD, RMIT University, NHMRC TRIP Fellow. Link to About page.

---

## Navigation

```
Home | Framework > | Examples | For You > | Evidence | FAQ | Resources | Contact
                |                          |
                +- Exploration             +- Administrators
                +- Preparation             +- Clinicians
                +- Implementation          +- Practitioners
                +- Sustainment             +- Researchers
```

- 8 top-level items
- "Framework" and "For You" have dropdown submenus
- Evidence page incorporates the full references list as a section at the bottom
- `/references/` redirects to `/evidence/#references` via `site/public/_redirects` file (Cloudflare Pages convention)
- About page is accessible from footer link only — not in primary nav (keeps nav to 8 items)
- Dropdowns: CSS-only on desktop (hover), tap-to-toggle on mobile (small JS in hamburger menu script)
- Mobile: hamburger menu with 48px touch targets
- Acknowledgements content moves to the site footer (rendered in BaseLayout footer area)
- `/framework/` index page becomes the dropdown landing — shows framework overview with links to all 4 phases
- FrameworkLayout stepper bar is kept on phase pages (provides prev/next navigation within the framework); it coexists with the top nav dropdown

---

## Phase Pages

Four pages: Exploration, Preparation, Implementation, Sustainment.

Each phase page uses the same structure:

### Header
- Phase title: "Phase 1: Exploration"
- Subtitle: one-line description from POPA4Ease (e.g., "Identifying human factors and environmental factors")

### Section navigation
- Anchor link list at top of page for jumping to subsections
- Matches the POPA4Ease pattern (e.g., Exploration has: Identify Internal Needs, Intervention, The Team, Staff, Readiness for Change, Funding, Patient)

### Content
- Content ported directly from POPA4Ease — PONV-specific, kept as-is
- No restructuring to separate generic framework from PONV examples (that's a future task)
- `<details>/<summary>` collapsibles for subsection content
- Lightweight citation tooltips: references marked with `<span data-cite="AuthorYear">` attributes. A single inline `<script>` (~30 lines) at end of BaseLayout creates hover popups on desktop, tap popups on mobile. Tooltip content stored in a `<template id="citations">` block on each page. This is the only JS on the site.
- Images extracted from old WordPress site placed where they originally appeared. Image URLs need discovery from live site (WordPress uses date-based upload paths like `/uploads/2018/08/`). Implementation task includes spidering actual image URLs.
- Downloadable resources: Excel templates and checklists from POPA4Ease must be downloaded and placed in `site/public/downloads/`. Link to actual files, not WordPress URLs. If any files are inaccessible, mark as "coming soon" rather than leaving broken links.

### Intervention comparison (Exploration page)
- Interactive expandable panels for each modality (Manual Acupressure, Electroacupressure, Auricular, Body Acupuncture, Electroacupuncture, Acupressure Wristbands)
- Each panel shows: advantages, disadvantages, effectiveness data
- Uses `<details>/<summary>` pattern

### Implementation strategies table (Implementation page)
- Three-column table: strategy type, effectiveness %, acupressure-specific examples
- Health Professional vs Patient-Focused rows

---

## New Pages (not in old POPA4Ease site)

### Evidence (`/evidence/`)
- Evidence summary table with GRADE badges (High, Moderate, Low, Very Low)
- Organized by outcome/intervention
- Full references list as a section at page bottom (replaces separate References page)
- References in standard academic bibliography format, alphabetical by author

### FAQ (`/faq/`)
- FAQPage schema markup for GEO
- Organized by topic (general, clinical, implementation, credentialing)
- Content source: existing `/site/src/pages/faq.astro` already has FAQ content. Supplement with questions derived from POPA4Ease site content and the `popa4ease_site_content.md` spider. ZZ to review clinical accuracy before launch.

### Resources (`/resources/`)
- Downloadable checklists, templates, pocket cards
- Links to whatever assets currently exist
- Placeholder sections for planned future downloads (PDF clinical tools)

### Audience Entry Points (`/for/administrators/`, `/for/clinicians/`, `/for/practitioners/`, `/for/researchers/`)
- Four tailored landing pages
- Each frames the framework from that audience's perspective (cost/ROI, evidence/protocols, credentialing, methodology)
- Funnels into the same core framework content

### Examples (`/examples/`)
- Index page listing application examples
- `/examples/ponv-acupressure/` — PONV acupressure case study (content exists in current Astro build)
- `/examples/ed-acupuncture/` — ED acupuncture shell page (Coming Soon, blocked on paper publication)

### Contact (`/contact/`)
- ZZ's RMIT email for contact
- Simple page, no contact form needed initially

### About (`/about/`)
- About HAIF, author bio, methodology, COI disclosure
- Acknowledgements content (funding sources, team credits) incorporated here or in footer

---

## Styling

### Color palette (modernized gold/grey)
- Gold accent: `#d4a017` (from existing global.css — warmer than POPA4Ease's #f1c30f, passes WCAG AA on white)
- Primary dark: `#1a5276` (existing — used for nav, headers, phase card backgrounds)
- Text: `#2c3e50` (existing)
- Light grey backgrounds: `#f8f9fa` and `#e9ecef` for section alternation
- Success/evidence green: `#27ae60` (for GRADE High badges)
- Keep existing global.css custom properties; update values to these colors. No mid-implementation color decisions needed.

### Typography
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- No Google Fonts dependency (faster loading)
- Clean hierarchy: large h1 for page titles, clear h2/h3 for sections

### Layout
- Mobile-first responsive design
- Max content width ~52rem (existing Astro convention)
- 44px minimum touch targets (WCAG)
- Clean whitespace, no attempt to pixel-match old Vase WordPress theme
- CSS custom properties for theming (existing pattern in global.css)

---

## Under the Hood

All existing Astro infrastructure stays:

- **JSON-LD schema** on every page (MedicalWebPage, FAQPage, HowTo, Person, Organization)
- **llms.txt** at site root for AI crawlers
- **robots.txt** allowing GPTBot, ClaudeBot, PerplexityBot
- **Sitemap** auto-generated via @astrojs/sitemap
- **Zero JS by default** — only exception is the citation tooltip script
- **Static build** deploying to Cloudflare Pages
- **"Last reviewed" dates** on clinical pages
- **Author attribution** (Dr Zhen Zheng) on every page
- **BaseLayout / FrameworkLayout** pattern continues

---

## Assets to Extract from POPA4Ease

Images to download from `popa4ease.com/site/wp-content/uploads/`:
- Homepage hero: `frontpage-image1-e1534678544443.jpg`
- Phase 1 card: `Digital-Strategy-for-Medical-Brand-Intervention-IQ-e1534562115603.jpg`
- Phase 2 card: `Prescription-preparation-in-bangladesh-300x168.jpg`
- Phase 3 card: `promo248112192-300x169.jpeg`
- Phase 4 card: `1-300x169.jpg`
- PONV algorithm: `algorithm-image.jpg`
- Risk score diagram: `risk-score.png`
- CARI checklist: `checklist-300x200.jpg`
- Any other images found on phase pages

These will be placed in `site/public/images/` and optimized (WebP conversion, responsive sizes).

---

## Author Attribution

Dr Zhen Zheng attribution appears in two places:
- **Footer:** Every page includes "Developed by Dr Zhen Zheng, PhD — RMIT University" in the BaseLayout footer
- **About section on homepage:** More detailed attribution with NHMRC TRIP Fellow title
- **About page:** Full bio, COI disclosure, funding sources

---

## Acceptance Criteria (Definition of Done)

The site is shippable when:

1. Homepage renders with HAIF title, intro paragraph, 4 phase cards with images, and all below-fold sections
2. All 4 phase pages render with content ported from POPA4Ease
3. Navigation works: 8 top-level items, dropdowns functional on desktop and mobile
4. Mobile hamburger menu works with 48px touch targets
5. All POPA4Ease images display (extracted from WordPress, served locally)
6. `<details>/<summary>` collapsibles work on phase pages
7. Citation tooltips functional (hover on desktop, tap on mobile)
8. Evidence page renders with GRADE badges table and references section
9. All new pages exist and render (FAQ, Resources, About, Contact, 4 audience pages, Examples)
10. No broken internal links
11. `npm run build` succeeds with no errors
12. JSON-LD schema present on all pages
13. llms.txt, robots.txt, sitemap.xml present
14. Downloadable resources link to real files or show "coming soon" — no broken download links
15. `/references/` redirects to `/evidence/#references`

**Stretch goals (nice to have, not blocking launch):**
- WebP image optimization
- PDF downloads via Typst pipeline
- Full 30+ FAQ content reviewed by ZZ

---

## Out of Scope (Future Work)

- Separating generic HAIF framework content from PONV-specific examples on phase pages
- ED acupuncture example content (blocked on paper publication)
- Typst-based PDF generation pipeline
- Full GRADE badge system on all clinical claims
- Wikidata/Wikipedia stub for HAIF entity
- Domain registration and DNS setup for hospitalacupuncture.com
- Custom contact form (just email link for now)
