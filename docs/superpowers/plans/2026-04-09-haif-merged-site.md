# HAIF Merged Site Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the existing HAIF Astro site to merge POPA4Ease visual identity with HAIF architecture — POPA4Ease-style homepage + phase content, expanded navigation, citation tooltips, images from old site.

**Architecture:** Modify the existing Astro static site in place. Homepage gets a POPA4Ease-style hero with phase cards above the fold, HAIF content below. Navigation expands to 8 items with 2 dropdowns. Phase pages keep existing content (already ported from POPA4Ease). Citation tooltips added as minimal inline JS. Images extracted from WordPress and served locally.

**Tech Stack:** Astro 6, CSS custom properties, minimal vanilla JS (tooltips + mobile nav), Cloudflare Pages

**Spec:** `docs/superpowers/specs/2026-04-09-haif-merged-site-design.md`

---

## File Map

### Modified files
- `site/src/layouts/BaseLayout.astro` — Navigation restructure (8 items, 2 dropdowns, footer update)
- `site/src/styles/global.css` — Add dropdown nav styles, phase card image styles, gold accent color update, citation tooltip styles
- `site/src/pages/index.astro` — Homepage redesign (POPA4Ease hero + HAIF below fold)
- `site/src/pages/references.astro` — Convert to redirect
- `site/astro.config.mjs` — Update site URL to hospitalacupuncture.com (remove GitHub Pages base path)

### New files
- `site/public/images/` — Directory for extracted POPA4Ease images
- `site/public/_redirects` — Cloudflare Pages redirect rules
- `site/src/components/CitationTooltip.astro` — Citation tooltip component + inline script

### Unchanged files (already have correct content)
- All 4 framework phase pages (`exploration.astro`, `preparation.astro`, `implementation.astro`, `sustainment.astro`)
- `site/src/layouts/FrameworkLayout.astro`
- `site/src/pages/evidence.astro`
- `site/src/pages/faq.astro`
- `site/src/pages/resources.astro`
- `site/src/pages/about.astro`
- `site/src/pages/contact.astro`
- `site/src/pages/examples/*.astro`
- `site/src/pages/for/*.astro`
- `site/public/llms.txt`, `robots.txt`

---

## Chunk 1: Infrastructure (Nav, Config, Redirects)

### Task 1: Update Astro config for hospitalacupuncture.com

**Files:**
- Modify: `site/astro.config.mjs`

- [ ] **Step 1: Read current config**

Current config has `site: 'https://realmindsai.github.io'` and `base: '/haif-website/'`. This needs to change for the production domain.

- [ ] **Step 2: Update config**

```javascript
// site/astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hospitalacupuncture.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [sitemap()],
});
```

Remove the `base` property entirely — no longer deploying to a subpath.

- [ ] **Step 3: Verify utils.ts — DO NOT modify**

The `url()` helper at `site/src/utils.ts` reads from `import.meta.env.BASE_URL`. With `base` removed from astro config, `BASE_URL` defaults to `"/"`. The existing implementation strips the trailing slash via `.replace(/\/$/, '')`, resulting in an empty string prefix. This means `url('/images/foo.jpg')` returns `"/images/foo.jpg"` — correct for root deployment. **The existing utils.ts works without modification. Do not rewrite it.**

- [ ] **Step 4: Build and verify**

Run: `cd site && npm run build`
Expected: Build succeeds, no errors about base path.

- [ ] **Step 5: Commit**

```bash
git add site/astro.config.mjs
git commit -m "chore: update site config for hospitalacupuncture.com domain"
```

---

### Task 2: Create Cloudflare _redirects file

**Files:**
- Create: `site/public/_redirects`

- [ ] **Step 1: Create redirects file**

```
/references/ /evidence/#references 301
```

- [ ] **Step 2: Build and verify file appears in dist**

Run: `cd site && npm run build && ls dist/_redirects`
Expected: File exists in build output.

- [ ] **Step 3: Commit**

```bash
git add site/public/_redirects
git commit -m "chore: add Cloudflare redirects for /references/ to /evidence/#references"
```

---

### Task 3: Restructure navigation in BaseLayout

**Files:**
- Modify: `site/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Update the nav section**

Replace the `<nav>` block (lines 54-61 of BaseLayout.astro) with the new 8-item navigation including dropdown menus:

```astro
<nav class="main-nav" role="navigation" aria-label="Main">
  <a href={url('/')} aria-current={currentPath === '/' ? 'page' : undefined}>Home</a>
  <div class="nav-dropdown">
    <a href={url('/framework/')} class="nav-dropdown-trigger" aria-current={currentPath.startsWith('/framework') ? 'page' : undefined}>Framework</a>
    <div class="nav-dropdown-menu">
      <a href={url('/framework/exploration/')}>Exploration</a>
      <a href={url('/framework/preparation/')}>Preparation</a>
      <a href={url('/framework/implementation/')}>Implementation</a>
      <a href={url('/framework/sustainment/')}>Sustainment</a>
    </div>
  </div>
  <a href={url('/examples/')} aria-current={currentPath.startsWith('/examples') ? 'page' : undefined}>Examples</a>
  <div class="nav-dropdown">
    <a href={url('/for/clinicians/')} class="nav-dropdown-trigger" aria-current={currentPath.startsWith('/for') ? 'page' : undefined}>For You</a>
    <div class="nav-dropdown-menu">
      <a href={url('/for/administrators/')}>Administrators</a>
      <a href={url('/for/clinicians/')}>Clinicians</a>
      <a href={url('/for/practitioners/')}>Practitioners</a>
      <a href={url('/for/researchers/')}>Researchers</a>
    </div>
  </div>
  <a href={url('/evidence/')} aria-current={currentPath === '/evidence/' ? 'page' : undefined}>Evidence</a>
  <a href={url('/faq/')} aria-current={currentPath === '/faq/' ? 'page' : undefined}>FAQ</a>
  <a href={url('/resources/')} aria-current={currentPath === '/resources/' ? 'page' : undefined}>Resources</a>
  <a href={url('/contact/')} aria-current={currentPath === '/contact/' ? 'page' : undefined}>Contact</a>
</nav>
```

- [ ] **Step 2: Update footer links**

Replace the footer links section (line 82-86) — remove References link (now redirects), add Acknowledgements text inline:

```astro
<footer class="site-footer" role="contentinfo">
  <div class="footer-inner">
    <p>
      <strong>Hospital Acupuncture Implementation Framework (HAIF)</strong><br />
      Developed by Dr Zhen Zheng, PhD &middot; RMIT University<br />
      NHMRC Translating Research into Practice Fellow
    </p>
    <p>
      <a href={url('/about/')}>About</a> &middot;
      <a href={url('/contact/')}>Contact</a> &middot;
      <a href={url('/evidence/#references')}>References</a>
    </p>
    <p class="footer-acknowledgement">
      Development funded by RMIT University Seed Grant and NHMRC TRIP Fellowship (App 1110446).
    </p>
  </div>
</footer>
```

- [ ] **Step 3: Update the mobile nav toggle script**

The existing toggle script (lines 90-99) works for the simple nav. For dropdowns on mobile, extend it to handle tap-to-toggle on dropdown triggers:

```astro
<script>
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }
  // Mobile dropdown toggle
  document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdown = trigger.closest('.nav-dropdown');
        if (dropdown) dropdown.classList.toggle('open');
      }
    });
  });
</script>
```

- [ ] **Step 4: Build and verify**

Run: `cd site && npm run build`
Expected: Build succeeds. Check `dist/index.html` contains the new nav structure.

- [ ] **Step 5: Commit**

```bash
git add site/src/layouts/BaseLayout.astro
git commit -m "feat: restructure navigation to 8 items with Framework and For You dropdowns"
```

---

### Task 4: Add dropdown and footer CSS to global.css

**Files:**
- Modify: `site/src/styles/global.css`

- [ ] **Step 1: Add dropdown nav styles**

Add after the existing `.main-nav a:hover` block (~line 149):

```css
/* Dropdown nav */
.nav-dropdown {
  position: relative;
  display: flex;
  align-items: center;
}
.nav-dropdown-trigger {
  cursor: pointer;
}
.nav-dropdown-trigger::after {
  content: ' \25BE';
  font-size: 0.7em;
}
.nav-dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--color-primary);
  border-radius: 0 0 var(--radius) var(--radius);
  min-width: 180px;
  z-index: 60;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.nav-dropdown:hover .nav-dropdown-menu {
  display: flex;
  flex-direction: column;
}
.nav-dropdown-menu a {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.85rem;
  min-height: 44px;
  display: flex;
  align-items: center;
  border-radius: 0;
}
.nav-dropdown-menu a:hover {
  background: rgba(255,255,255,0.15);
}

@media (max-width: 768px) {
  .nav-dropdown-menu {
    position: static;
    box-shadow: none;
    display: none;
    padding-left: var(--spacing-md);
  }
  .nav-dropdown.open .nav-dropdown-menu {
    display: flex;
    flex-direction: column;
  }
  .nav-dropdown:hover .nav-dropdown-menu {
    display: none;
  }
  .nav-dropdown.open:hover .nav-dropdown-menu {
    display: flex;
  }
}
```

- [ ] **Step 2: Add footer acknowledgement style**

Add after existing `.footer-inner` block:

```css
.footer-acknowledgement {
  font-size: 0.75rem;
  margin-top: var(--spacing-sm);
}
```

- [ ] **Step 3: Build and verify**

Run: `cd site && npm run build`
Expected: No CSS errors, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add site/src/styles/global.css
git commit -m "feat: add dropdown navigation and footer acknowledgement styles"
```

---

## Chunk 2: Image Extraction and Homepage Redesign

### Task 5: Extract images from POPA4Ease WordPress site

**Files:**
- Create: `site/public/images/` directory and image files

- [ ] **Step 1: Create images directory**

```bash
mkdir -p site/public/images
```

- [ ] **Step 2: Download images from POPA4Ease**

Use curl to download each image. The WordPress upload paths use date-based directories. Try common patterns:

```bash
cd site/public/images

# Homepage hero
curl -fLO "http://popa4ease.com/site/wp-content/uploads/2018/08/frontpage-image1-e1534678544443.jpg" || echo "FAILED: hero image"

# Phase card images
curl -fLO "http://popa4ease.com/site/wp-content/uploads/2018/03/Digital-Strategy-for-Medical-Brand-Intervention-IQ-e1534562115603.jpg" || echo "FAILED: phase 1 image"
curl -fLO "http://popa4ease.com/site/wp-content/uploads/2018/03/Prescription-preparation-in-bangladesh-300x168.jpg" || echo "FAILED: phase 2 image"
curl -fLO "http://popa4ease.com/site/wp-content/uploads/2018/03/promo248112192-300x169.jpeg" || echo "FAILED: phase 3 image"
curl -fLO "http://popa4ease.com/site/wp-content/uploads/2018/03/1-300x169.jpg" || echo "FAILED: phase 4 image"

# Content images
curl -fLO "http://popa4ease.com/site/wp-content/uploads/2019/05/algorithm-image.jpg" || echo "FAILED: algorithm image"
curl -fLO "http://popa4ease.com/site/wp-content/uploads/2018/03/risk-score.png" || echo "FAILED: risk score"
curl -fLO "http://popa4ease.com/site/wp-content/uploads/2018/03/checklist-300x200.jpg" || echo "FAILED: checklist"
```

If any downloads fail, spider the actual page HTML to find correct image URLs:

```bash
curl -sL "http://popa4ease.com/site/" | grep -oP 'src="[^"]*uploads/[^"]*"' | sort -u
curl -sL "http://popa4ease.com/site/index.php/exploration/" | grep -oP 'src="[^"]*uploads/[^"]*"' | sort -u
```

- [ ] **Step 3: Rename images to clean filenames**

```bash
cd site/public/images
# Rename to sensible names (adjust based on what actually downloaded)
mv frontpage-image1-e1534678544443.jpg hero-banner.jpg 2>/dev/null
mv Digital-Strategy-for-Medical-Brand-Intervention-IQ-e1534562115603.jpg phase-1-exploration.jpg 2>/dev/null
mv Prescription-preparation-in-bangladesh-300x168.jpg phase-2-preparation.jpg 2>/dev/null
mv promo248112192-300x169.jpeg phase-3-implementation.jpg 2>/dev/null
mv 1-300x169.jpg phase-4-sustainment.jpg 2>/dev/null
mv algorithm-image.jpg ponv-algorithm.jpg 2>/dev/null
mv risk-score.png ponv-risk-score.png 2>/dev/null
mv checklist-300x200.jpg cari-checklist.jpg 2>/dev/null
```

- [ ] **Step 4: Verify all images are present**

```bash
ls -la site/public/images/
```

Expected: 5-8 image files with clean names. If any are missing, note which ones failed for manual retrieval later.

- [ ] **Step 5: Commit**

```bash
git add site/public/images/
git commit -m "feat: extract and add POPA4Ease images for homepage and phase pages"
```

---

### Task 6: Redesign homepage

**Files:**
- Modify: `site/src/pages/index.astro`
- Modify: `site/src/styles/global.css` (add phase card image styles)

- [ ] **Step 1: Add phase card image styles to global.css**

Add after the existing `.card` styles (~line 290):

```css
/* Phase cards with images (homepage) */
.phase-card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin: var(--spacing-xl) 0;
}
@media (min-width: 769px) {
  .phase-card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.phase-card {
  display: block;
  text-decoration: none;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: transform 0.2s, box-shadow 0.2s;
}
.phase-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.phase-card img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}
.phase-card .phase-card-body {
  padding: var(--spacing-md);
  background: var(--color-bg);
}
.phase-card .phase-card-body h3 {
  margin: 0 0 var(--spacing-xs);
  font-size: 0.95rem;
  color: var(--color-primary);
}
.phase-card .phase-card-body p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
```

- [ ] **Step 2: Rewrite index.astro**

Replace the entire content of `site/src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { url } from '../utils';

const schema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "Hospital Acupuncture Implementation Framework (HAIF)",
  "description": "A methodology for integrating acupuncture and acupressure into hospital practice. Evidence-based. Practitioner-tested.",
  "url": "https://hospitalacupuncture.com/",
  "author": {
    "@type": "Person",
    "name": "Dr Zhen Zheng",
    "jobTitle": "Senior Research Fellow",
    "affiliation": {
      "@type": "Organization",
      "name": "RMIT University"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "Hospital Acupuncture Implementation Framework",
    "url": "https://hospitalacupuncture.com"
  }
};
---

<BaseLayout title="Home" schema={schema}>
  <!-- Above the fold: POPA4Ease-style hero -->
  <section class="hero">
    <h1>Hospital Acupuncture<br />Implementation Framework</h1>
    <p class="subtitle">
      Post-operative nausea and vomiting (PONV) affects 30-50% of surgical patients.
      Acupuncture and acupressure are the only non-pharmacological interventions included
      in PONV management guidelines. This framework helps clinicians implement them
      systematically in hospital settings.
    </p>
  </section>

  <!-- Four phase cards with images -->
  <div class="phase-card-grid">
    <a href={url('/framework/exploration/')} class="phase-card">
      <img src={url('/images/phase-1-exploration.jpg')} alt="Phase 1: Exploration — identifying factors" loading="lazy" />
      <div class="phase-card-body">
        <h3>Phase 1: Exploration</h3>
        <p>Identifying human factors and environmental factors</p>
      </div>
    </a>
    <a href={url('/framework/preparation/')} class="phase-card">
      <img src={url('/images/phase-2-preparation.jpg')} alt="Phase 2: Preparation — addressing barriers" loading="lazy" />
      <div class="phase-card-body">
        <h3>Phase 2: Preparation</h3>
        <p>Addressing barriers and using enablers</p>
      </div>
    </a>
    <a href={url('/framework/implementation/')} class="phase-card">
      <img src={url('/images/phase-3-implementation.jpg')} alt="Phase 3: Implementation — executing the plan" loading="lazy" />
      <div class="phase-card-body">
        <h3>Phase 3: Implementation</h3>
        <p>Executing with evidence-based strategies</p>
      </div>
    </a>
    <a href={url('/framework/sustainment/')} class="phase-card">
      <img src={url('/images/phase-4-sustainment.jpg')} alt="Phase 4: Sustainment — maintaining practice" loading="lazy" />
      <div class="phase-card-body">
        <h3>Phase 4: Sustainment</h3>
        <p>Normalising into routine practice</p>
      </div>
    </a>
  </div>

  <!-- Below the fold: HAIF content -->

  <!-- Bottom Line -->
  <div class="bottom-line">
    <strong>The Bottom Line</strong>
    Acupuncture and acupressure are the only non-pharmacological interventions included in post-operative nausea and vomiting management guidelines. Despite strong evidence, systematic implementation in hospitals remains rare. This framework shows you how.
  </div>

  <!-- Audience Entry Points -->
  <h2>I am a...</h2>
  <div class="audience-grid">
    <a href={url('/for/administrators/')} class="audience-card">
      <span class="role">Hospital Administrator</span>
      <span class="desc">Cost, credentialing, and workflow impact</span>
    </a>
    <a href={url('/for/clinicians/')} class="audience-card">
      <span class="role">Clinician</span>
      <span class="desc">Evidence, protocols, and safety data</span>
    </a>
    <a href={url('/for/practitioners/')} class="audience-card">
      <span class="role">Acupuncture Practitioner</span>
      <span class="desc">Hospital credentialing and collaboration</span>
    </a>
    <a href={url('/for/researchers/')} class="audience-card">
      <span class="role">Researcher</span>
      <span class="desc">Methodology, data, and publications</span>
    </a>
  </div>

  <!-- Application Examples -->
  <h2>Application Examples</h2>
  <div class="card-grid">
    <div class="card">
      <h3>Acupressure for PONV</h3>
      <p>Nurse-led acupressure wristband implementation for post-operative nausea and vomiting at Northern Hospital, Victoria.</p>
      <a href={url('/examples/ponv-acupressure/')}>View case study &rarr;</a>
    </div>
    <div class="card">
      <h3>Acupuncture in Emergency <span class="coming-soon">Coming Soon</span></h3>
      <p>Registrar-led acupuncture implementation in the emergency department. Research in progress.</p>
    </div>
  </div>

  <!-- Evidence snapshot -->
  <h2>Key Evidence</h2>
  <table>
    <thead>
      <tr>
        <th>Outcome</th>
        <th>Effect (RR)</th>
        <th>Evidence</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Nausea (PC6 stimulation)</td>
        <td>0.68 (95% CI 0.60-0.77)</td>
        <td><span class="grade grade-high">High</span></td>
      </tr>
      <tr>
        <td>Vomiting (PC6 stimulation)</td>
        <td>0.60 (95% CI 0.51-0.71)</td>
        <td><span class="grade grade-high">High</span></td>
      </tr>
      <tr>
        <td>Rescue antiemetics</td>
        <td>0.64 (95% CI 0.55-0.73)</td>
        <td><span class="grade grade-moderate">Moderate</span></td>
      </tr>
    </tbody>
  </table>
  <p style="font-size: 0.85rem; color: var(--color-text-muted);">
    Source: Lee et al., 2015 (Cochrane Database of Systematic Reviews).
    <a href={url('/evidence/')}>Full evidence summaries &rarr;</a>
  </p>

  <!-- Author attribution -->
  <section style="margin-top: var(--spacing-2xl); padding: var(--spacing-lg); background: var(--color-bg-alt); border-radius: var(--radius);">
    <h3 style="margin-top: 0;">About the Framework</h3>
    <p>
      Developed by <strong>Dr Zhen Zheng, PhD</strong>, Senior Research Fellow at RMIT University and
      NHMRC Translating Research into Practice Fellow. The HAIF framework draws on implementation science
      methodology (EPIS, CFIR) and real-world hospital implementation experience.
    </p>
    <a href={url('/about/')}>Learn more about HAIF &rarr;</a>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Build and verify**

Run: `cd site && npm run build`
Expected: Build succeeds. Check `dist/index.html` contains the phase cards with image paths.

- [ ] **Step 4: Visual check with dev server**

Run: `cd site && npm run dev`
Open http://localhost:4321 and verify:
- Hero title and intro paragraph render
- 4 phase cards display (images may 404 if download failed — that's OK to note)
- Below fold: Bottom Line, audience cards, examples, evidence table, about section all render
- Navigation shows 8 items with dropdowns
- Mobile hamburger works

- [ ] **Step 5: Commit**

```bash
git add site/src/pages/index.astro site/src/styles/global.css
git commit -m "feat: redesign homepage with POPA4Ease-style phase cards above fold, HAIF content below"
```

---

## Chunk 3: Evidence Page References Section and Cleanup

### Task 7: Add references section to evidence page

**Files:**
- Modify: `site/src/pages/evidence.astro`
- Read: `site/src/pages/references.astro` (for content to merge)

- [ ] **Step 1: Read current references.astro content**

Read `site/src/pages/references.astro` to get the full reference list.

- [ ] **Step 2: Add references section to bottom of evidence.astro**

At the end of the evidence page content (before the closing `</BaseLayout>` tag), add:

```astro
<h2 id="references">References</h2>
```

Then paste the full ordered list of references from `references.astro`.

- [ ] **Step 3: Convert references.astro to a redirect page**

Replace the content of `site/src/pages/references.astro` with a meta-refresh redirect (belt-and-suspenders with the `_redirects` file):

```astro
---
import { url } from '../utils';
---
<html>
  <head>
    <meta http-equiv="refresh" content={`0;url=${url('/evidence/#references')}`} />
    <title>Redirecting to Evidence page</title>
  </head>
  <body>
    <p>Redirecting to <a href={url('/evidence/#references')}>Evidence &rarr; References</a></p>
  </body>
</html>
```

- [ ] **Step 4: Build and verify**

Run: `cd site && npm run build`
Expected: Both pages build. `dist/references/index.html` contains meta-refresh. `dist/evidence/index.html` contains `#references` anchor.

- [ ] **Step 5: Commit**

```bash
git add site/src/pages/evidence.astro site/src/pages/references.astro
git commit -m "feat: merge references into evidence page, redirect /references/ to /evidence/#references"
```

---

### Task 8: Create citation tooltip component

**Files:**
- Create: `site/src/components/CitationTooltip.astro`

- [ ] **Step 1: Create the component**

```astro
---
// CitationTooltip.astro
// Include this component once per page (in BaseLayout or FrameworkLayout)
// to enable citation tooltips.
//
// Usage in page content:
//   <span data-cite="Lee2015">Lee et al., 2015</span>
//
// Citation content is stored in a <template> block:
//   <template id="citations">
//     <div data-ref="Lee2015">Lee, A., Chan, S. K. & Fan, L. T. 2015. Stimulation of the wrist acupuncture point PC6...</div>
//   </template>
---

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const citesTemplate = document.getElementById('citations');
    if (!citesTemplate) return;

    let activeTooltip = null;

    document.querySelectorAll('[data-cite]').forEach(el => {
      const ref = el.getAttribute('data-cite');
      const content = citesTemplate.content.querySelector(`[data-ref="${ref}"]`);
      if (!content) return;

      el.style.cursor = 'help';
      el.style.borderBottom = '1px dotted currentColor';

      const show = (e) => {
        if (activeTooltip) activeTooltip.remove();
        const tip = document.createElement('div');
        tip.className = 'citation-tooltip';
        tip.textContent = content.textContent;
        tip.style.cssText = `
          position: fixed;
          background: var(--color-text, #2c3e50);
          color: #fff;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          max-width: 320px;
          z-index: 100;
          pointer-events: none;
          line-height: 1.4;
        `;
        document.body.appendChild(tip);
        const rect = el.getBoundingClientRect();
        tip.style.left = Math.min(rect.left, window.innerWidth - tip.offsetWidth - 8) + 'px';
        tip.style.top = (rect.bottom + 6) + 'px';
        activeTooltip = tip;
      };

      const hide = () => {
        if (activeTooltip) { activeTooltip.remove(); activeTooltip = null; }
      };

      el.addEventListener('mouseenter', show);
      el.addEventListener('mouseleave', hide);
      el.addEventListener('click', (e) => {
        e.preventDefault();
        activeTooltip ? hide() : show(e);
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-cite]') && activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
      }
    });
  });
</script>
```

- [ ] **Step 2: Wire into FrameworkLayout**

Modify `site/src/layouts/FrameworkLayout.astro` to import and include the component. Add at the top of the frontmatter:

```astro
import CitationTooltip from '../components/CitationTooltip.astro';
```

Add `<CitationTooltip />` just before the closing `</BaseLayout>` tag (after the phase-nav block).

- [ ] **Step 3: Add a sample citation to the exploration page**

In `site/src/pages/framework/exploration.astro`, find the first reference to Lee et al. (or any citation) and wrap it:

```html
<span data-cite="Lee2015">Lee et al., 2015</span>
```

Then add a `<template id="citations">` block at the bottom of the page (before the closing layout tag):

```html
<template id="citations">
  <div data-ref="Lee2015">Lee, A., Chan, S. K. & Fan, L. T. 2015. Stimulation of the wrist acupuncture point PC6 for preventing postoperative nausea and vomiting. Cochrane Database of Systematic Reviews.</div>
</template>
```

- [ ] **Step 4: Build and verify**

Run: `cd site && npm run build`
Expected: Build succeeds. Run dev server and hover over the citation on the exploration page — tooltip should appear.

- [ ] **Step 5: Commit**

```bash
git add site/src/components/CitationTooltip.astro site/src/layouts/FrameworkLayout.astro site/src/pages/framework/exploration.astro
git commit -m "feat: add citation tooltip component and wire into framework pages"
```

---

## Chunk 4: Verification and Final Build

### Task 9: Full build verification and link check

**Files:**
- No file changes — verification only

- [ ] **Step 1: Clean build**

```bash
cd site && rm -rf dist && npm run build
```

Expected: Build succeeds with no errors or warnings.

- [ ] **Step 2: Check all pages generated**

```bash
find site/dist -name "index.html" | sort
```

Expected output should include at minimum:
```
site/dist/index.html
site/dist/about/index.html
site/dist/contact/index.html
site/dist/evidence/index.html
site/dist/examples/index.html
site/dist/examples/ponv-acupressure/index.html
site/dist/examples/ed-acupuncture/index.html
site/dist/faq/index.html
site/dist/for/administrators/index.html
site/dist/for/clinicians/index.html
site/dist/for/practitioners/index.html
site/dist/for/researchers/index.html
site/dist/framework/index.html
site/dist/framework/exploration/index.html
site/dist/framework/preparation/index.html
site/dist/framework/implementation/index.html
site/dist/framework/sustainment/index.html
site/dist/references/index.html
site/dist/resources/index.html
```

- [ ] **Step 3: Verify download links survive base-path removal**

```bash
grep -roh 'href="[^"]*downloads/[^"]*"' site/dist/ | sort -u
```

Verify each path resolves to a file in `site/dist/downloads/`. Since `base` was removed, paths using `url('/downloads/...')` now resolve to `/downloads/...` instead of `/haif-website/downloads/...`. Confirm the files exist at the new paths.

```bash
ls site/dist/downloads/
```

Expected: 10 PDF files present.

- [ ] **Step 4: Check for broken internal links**

```bash
grep -roh 'href="[^"]*"' site/dist/ | sort -u | grep -v '^href="http' | grep -v '^href="#' | grep -v '^href="mailto'
```

Verify each internal link path has a corresponding directory in `dist/`.

- [ ] **Step 5: Check critical files present**

```bash
ls site/dist/_redirects site/dist/llms.txt site/dist/robots.txt site/dist/sitemap-index.xml
```

Expected: All 4 files present.

- [ ] **Step 6: Check images present**

```bash
ls site/dist/images/
```

Expected: Phase card images and content images present (whatever was successfully downloaded in Task 5).

- [ ] **Step 7: Preview the site**

Run: `cd site && npm run preview`

Open the preview URL and manually check:
- [ ] Homepage: hero, phase cards, below-fold content
- [ ] Navigation: all 8 items visible, dropdowns work
- [ ] Mobile nav: hamburger menu, touch targets
- [ ] Framework pages: content renders, stepper bar works, prev/next works
- [ ] Evidence page: tables render, `#references` section exists
- [ ] FAQ: questions expand/collapse
- [ ] All audience pages load
- [ ] Contact page loads
- [ ] No 404s when clicking through site

- [ ] **Step 8: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address issues found during final verification"
```

Only if fixes were made. Skip if everything passed.

---

## Done Checklist (from spec acceptance criteria)

- [ ] Homepage renders with HAIF title, intro, 4 phase cards with images, all below-fold sections
- [ ] All 4 phase pages render with content
- [ ] Navigation: 8 top-level items, dropdowns functional on desktop and mobile
- [ ] Mobile hamburger menu works with 48px touch targets
- [ ] POPA4Ease images display locally
- [ ] `<details>/<summary>` collapsibles work on phase pages
- [ ] Evidence page renders with GRADE badges table and references section
- [ ] All pages exist and render (FAQ, Resources, About, Contact, audience pages, Examples)
- [ ] No broken internal links
- [ ] `npm run build` succeeds with no errors
- [ ] JSON-LD schema present on pages
- [ ] llms.txt, robots.txt, sitemap present
- [ ] `/references/` redirects to `/evidence/#references`
- [ ] Citation tooltips functional (component wired into FrameworkLayout, at least one data-cite example on exploration page)
- [ ] Download links resolve to real files (10 PDFs in dist/downloads/)
