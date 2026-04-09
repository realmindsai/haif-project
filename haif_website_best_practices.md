# HAIF Website Best Practices Research
# Synthesized: 2026-04-06

---

## The Opportunity

No existing website covers **hospital implementation of acupuncture** with proper structure and authority. Cleveland Clinic, Mayo, and NCCIH dominate general acupuncture queries, but the implementation niche is wide open. A well-built, GEO-optimized HAIF site could become THE default AI-cited source for "how do I implement acupuncture in a hospital?"

---

## 1. Audience & What They Care About

| Audience | Primary Need | Trust Signal | Content Format |
|----------|-------------|--------------|----------------|
| **Hospital administrators** | Cost-effectiveness, liability, credentialing, workflow impact | Institutional case studies, named hospitals | Checklists, ROI calculators, decision aids |
| **Emergency physicians** (skeptics) | RCT-level evidence, NNT/NNH, safety profiles, Cochrane citations | GRADE evidence ratings, neutral tone, no advocacy | Evidence summaries, clinical algorithms |
| **Nurses & clinicians** | Practical protocols, scope-of-practice, training pathways | Training package details, competency frameworks | Step-by-step guides, downloadable PDFs |
| **Acupuncture/TCM practitioners** | Hospital credentialing, interprofessional collaboration | Real implementation stories | Case studies, protocol adaptations |

**Critical design decision:** Lead with neutral, graded evidence — not advocacy. A skeptical ED physician and an enthusiastic acupuncturist must both feel the site respects their intelligence.

### Audience-Segmented Entry Points
Use "I am a..." landing paths (pattern from AHRQ, NICE, WHO toolkits):
- "I am a hospital administrator"
- "I am a clinician"  
- "I am an acupuncture practitioner"
- "I am a researcher"

---

## 2. Content Architecture

### Framework Navigation
- **Horizontal stepper/progress bar** at top: Phase 1 → 2 → 3 → 4 (clickable, with visual progress)
- **Breadcrumbs**: Home > Phase 2 > Timing Considerations
- **Sticky sidebar TOC** on desktop, hamburger TOC on mobile (highlights current section via Intersection Observer)

### Progressive Disclosure (Key Pattern)
- Show phase overview cards on landing → expand to subsections on click
- Use native `<details>`/`<summary>` HTML for collapsible sections (zero JS, accessible by default)
- **Target <30 seconds to key information** — front-loaded "bottom line" boxes at top of each section
- Clinicians between patients need sub-second loads and scannable content

### Content Formats That Work
1. **Evidence summaries with GRADE ratings** — the single most important format
2. **One-page clinical algorithms** (flowcharts for "when to consider acupuncture")
3. **Implementation checklists** — downloadable, printable
4. **Case studies** — real hospitals, named institutions, timelines, measurable outcomes
5. **FAQs segmented by audience** — separate tracks per audience
6. **Circular/cycle SVG diagram** for the 4 phases (CSS hover/focus, not JS charting library)

### Trust Signals (Non-Negotiable)
- RMIT University logo / institutional affiliation
- Named authors with credentials and COI disclosures
- Evidence grading badges (GRADE: High / Moderate / Low) displayed prominently
- "Last reviewed: [date]" on every clinical page
- Peer review statement
- Separation of evidence from advocacy

---

## 3. Tech Stack Recommendation

### Astro + Markdown + Cloudflare Pages

| Choice | Why |
|--------|-----|
| **Astro** | Zero JS shipped by default, Content Collections for structured Markdown/MDX, built-in image optimization, islands architecture for interactive bits only |
| **Markdown/MDX** | Version-controlled content in git, frontmatter validation, no CMS overhead |
| **Cloudflare Pages** | Global edge CDN, free tier, near-instant TTFB |

**Why not WordPress (like the current site)?** $60/month hosting, SSL issues, slow, JS-heavy themes, security maintenance burden. Static HTML is faster, cheaper ($0), more secure, and more accessible to AI crawlers.

### Performance Targets
- LCP < 2.5s, INP < 200ms, CLS < 0.1
- Page load under 3 seconds (clinicians abandon slow sites immediately)
- Inline critical CSS, lazy-load images (WebP/AVIF), preload fonts with `font-display: swap`

### Accessibility (WCAG 2.2)
- Color contrast 4.5:1 for text
- Touch targets min 44x44px
- Skip-to-content link, ARIA landmarks
- Readable without zoom at 320px viewport
- High-contrast, minimal animation (clinical environments = bright lighting + distraction)

---

## 4. Generative AI Optimization (GEO)

### Content Structure for AI
- **One concept per section** with descriptive H2/H3 (phrased as question or topic label)
- **Lead with the answer** — first sentence should be standalone, quotable
- **FAQ blocks** — literal Q&A pairs map directly to how users query AI
- **Lists and tables** for protocols, steps, costs — LLMs extract structured formats more reliably than prose
- **Glossary** defining key terms
- **Explicit claim statements** — "Hospital acupuncture programs reduce average length of stay by 0.8 days" is more citable than vague hedging
- **Inline citations** — "A 2023 meta-analysis (JAMA, n=4,200) found..." is what AI quotes

### Schema.org (JSON-LD)
| Schema Type | Use Case |
|---|---|
| `FAQPage` | Q&A pairs about implementation |
| `HowTo` | Step-by-step implementation guides |
| `MedicalWebPage` | Signal medical authority to AI |
| `Article` / `ScholarlyArticle` | Evidence summaries |
| `Organization` | Establish entity identity |
| `Person` | Author credentials (MD, PhD) |
| `BreadcrumbList` | Site hierarchy for context |

### llms.txt
Place at `/llms.txt` — a markdown file that gives LLMs a human-readable site summary:
- Site name, purpose, authority statement
- Key topics covered with links to canonical pages
- Structured list of resources
- Optional `/llms-full.txt` with deeper content for ingestion

### AI Crawling — robots.txt
```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

- XML sitemap with `lastmod` dates
- **No JavaScript-gated content** — LLM crawlers don't execute JS (Astro's SSG handles this perfectly)
- Consistent entity naming everywhere ("Hospital Acupuncture Implementation Framework" — never variants)
- `sameAs` in Organization schema linking to social/professional profiles

### Knowledge Graph
- Wikidata/Wikipedia stub for HAIF (establishes entity recognition)
- Link to/from PubMed, WHO, Cochrane, hospital systems using the framework
- Canonical URLs — one authoritative URL per topic, no duplicate content

---

## 5. Exemplar Sites to Study

| Site | What to Learn |
|------|--------------|
| **NICE Guidelines** (nice.org.uk) | Audience segmentation, evidence grading display |
| **AHRQ Evidence-Based Practice** (ahrq.gov) | Gold standard for evidence summaries |
| **Choosing Wisely** (choosingwisely.org) | Clean, scannable, condition-based navigation |
| **Cleveland Clinic Health Essentials** | FAQ schema, clear definitions, cited statistics — frequently surfaced by AI |
| **VA/DoD Evidence Map for Acupuncture** | Directly relevant evidence mapping by condition |

---

## 6. Summary: What Makes HAIF Win

1. **Neutral evidence, not advocacy** — earns trust from skeptics AND believers
2. **Audience-segmented entry points** — administrators, clinicians, practitioners each get tailored paths
3. **Progressive disclosure** — scannable summaries first, detail on demand
4. **Static HTML** (Astro) — fast, free, secure, AI-crawlable
5. **GEO-first content** — quotable claims, inline citations, FAQ schema, llms.txt
6. **Mobile-first** — clinicians check between patients on phones
7. **GRADE evidence badges** — visual trust at a glance
8. **Downloadable assets** — PDF checklists, protocols, pocket cards
