# HAIF Website Vision Synthesis
# Zhen's Requirements + Best Practice Research
# 2026-04-06

---

## Core Concept

ONE framework, MULTIPLE applications, MULTIPLE audiences.

The 4-phase EPIS framework (Exploration → Preparation → Implementation → Sustainment) is the spine. Application examples (PONV/acupressure, hospital acupuncture) plug into it. Audience entry points (administrator, clinician, practitioner, researcher) provide tailored framing that funnels into the same framework content.

---

## Alignment Summary

| Dimension | Zhen's Vision | Best Practice | Synthesis |
|---|---|---|---|
| Structure | Collapsible stages, drill-down | Progressive disclosure, `<details>/<summary>` | Native HTML collapsibles, "bottom line" boxes at top of each section |
| Navigation | Circular phase diagram | Interactive SVG, clickable | CSS-animated SVG cycle diagram as hero, phases link to detail pages |
| Mobile | "I now realize everyone clicks on phones" | Mobile-first, sub-3s load, 44px touch targets | Static HTML (Astro), zero JS by default, fast on hospital WiFi |
| Updateability | "I like it to be more alive" | Markdown in git | ZZ edits .md files, DW handles deployment |
| Cost | $60/month WordPress is too much | Static hosting = $0 | Cloudflare Pages free tier, automatic HTTPS |
| Discoverability | "People can't find it" | GEO + SEO + better domain | hospitalacupuncture.com + llms.txt + FAQ schema |
| Teaching | "Teach people how to put theory to practice" | HowTo schema, step-by-step guides | Each phase = structured how-to with downloadable checklists |
| Authority | "I can become the leading figure" | Neutral evidence, named authors, GRADE badges | Evidence does the positioning; Dr Zhen Zheng PhD on every page |
| Imagery | "Patients and doctors," likes current aesthetic | Real photos > stock, but mobile-optimized | Keep visual warmth, optimize for mobile, lazy-load images |
| Content model | ONE framework, examples plug in | Audience-segmented entry + unified core | "I am a..." landing paths → same framework content |

---

## What Best Practice Adds (Zhen's Gaps)

### 1. Audience-Segmented Entry Points
Zhen thinks of one audience. Best practice splits:
- **Hospital administrators** → cost/ROI, credentialing, liability framing
- **Emergency physicians** → RCT evidence, NNT/NNH, safety, Cochrane citations
- **Nurses/clinicians** → protocols, scope-of-practice, training pathways
- **Acupuncture practitioners** → hospital credentialing, interprofessional collaboration
- **Researchers** → methodology, data, publications

Each gets a tailored landing that frames WHY the framework matters to THEM, then funnels into the same core content.

### 2. GRADE Evidence Badges
Visual evidence grading (High / Moderate / Low) on every clinical claim. Turns ZZ from "acupuncture advocate" into "neutral evidence presenter." Critical for skeptical ED physicians.

### 3. GEO (Generative AI Optimization)
The biggest gap and biggest opportunity. This niche has ZERO AI competition.
- llms.txt at site root
- FAQ schema on every page
- Quotable claims with inline citations
- Allow GPTBot, ClaudeBot, PerplexityBot in robots.txt
- Consistent entity naming ("Hospital Acupuncture Implementation Framework")

### 4. Downloadable Assets
Clinicians want to print and save:
- PDF pocket cards for each phase
- One-page decision aids / clinical algorithms
- Implementation checklists
- Staff survey templates
- Patient education materials

### 5. Currency Dates
"Last reviewed: [date]" on every clinical page. Current site is 3+ years stale — this destroys trust.

### 6. Author Attribution
"Dr Zhen Zheng, PhD, RMIT University, NHMRC TRIP Fellow" on every page with COI disclosure. This IS the positioning play AND the trust signal.

---

## Resolved Tensions

### "Pretty website" vs mobile-first
Keep visual warmth (ZZ values it), restructure for mobile. Photos of real patients/doctors, not decorative stock. Lazy-load, WebP format, don't let images push content below the fold.

### ONE framework vs audience segmentation
Not in conflict. Framework stays central and unified. Audience entry points are just different DOORS into the same house. Each door has a welcome mat that speaks their language.

### "Leading figure" vs neutral evidence
Let the evidence do the positioning. The most authoritative clinical sites (NICE, AHRQ, Choosing Wisely) never advocate — they organize and present evidence so well that everyone references them. That IS authority.

---

## Delivery Phases

### Phase A: NOW (before US conference, ~2 weeks)
- New site on hospitalacupuncture.com with SSL
- Rebrand to HAIF
- Keep existing PONV content as "Example 1: Acupressure for PONV (Nurse-Led)"
- Add framing paragraph: same framework, different applications
- Circular phase diagram as hero
- Collapsible sections for each phase
- Mobile-first
- Author attribution on every page
- llms.txt + robots.txt + basic schema

### Phase B: LATER (after paper publishes)
- Add "Example 2: Acupuncture in Emergency Department (Registrar-Led)"
- Integrate 10-interview qualitative study
- Workflow literature integration
- Audience-segmented landing pages
- Full downloadable asset library
- GRADE evidence badges on all clinical claims
- FAQ expansion for GEO
- Wikidata/Wikipedia stub for HAIF entity

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro | Zero JS default, Content Collections, MDX for interactive bits |
| Content | Markdown/MDX files in git | ZZ can edit, version-controlled, no CMS overhead |
| Hosting | Cloudflare Pages | Free, global CDN, automatic HTTPS, fast |
| Diagrams | SVG (hand-crafted or Mermaid-generated) | No JS charting library, accessible, CSS hover/focus |
| Images | WebP/AVIF, lazy-loaded | Fast on hospital WiFi |
| Schema | JSON-LD in page templates | MedicalWebPage, HowTo, FAQPage, Person, Organization |
| AI access | llms.txt + permissive robots.txt | GPTBot, ClaudeBot, PerplexityBot allowed |
