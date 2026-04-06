# PDF Generation Plan for HAIF Resources

## PDFs to Generate

### Phase Checklists (4 PDFs)
1. **exploration-checklist.pdf** — Phase 1 checklist: internal needs assessment, intervention selection criteria, team composition requirements, staff survey questions, organizational readiness (CARI) scoring, cost tracking template, patient preference considerations
2. **preparation-checklist.pdf** — Phase 2 checklist: FAME assessment, timing decisions, patient risk factors, documentation revision list, barrier-strategy mapping, team role assignment
3. **implementation-checklist.pdf** — Phase 3 checklist: organizational structure review, priority/goal alignment, strategy selection (from Grimshaw data), training package selection, management engagement steps, assessment measures, staged rollout steps
4. **sustainment-checklist.pdf** — Phase 4 checklist: external leadership engagement, inter-organizational links, funding model, fidelity monitoring schedule, champion identification, staff support plan

### Clinical Tools (3 PDFs)
5. **intervention-comparison-card.pdf** — One-page comparison of all 6 modalities: manual acupressure, electroacupressure, auricular acupuncture, body acupuncture, electroacupuncture, wristbands. Columns: modality, RR for nausea/vomiting, cost, training needed, pros/cons. Pocket-card format.
6. **clinical-decision-aid.pdf** — Flowchart: "Should I consider acupuncture/acupressure?" → risk assessment → modality selection → timing → who delivers. One page, A4.
7. **patient-education-sheet.pdf** — Patient-facing: what is acupressure/acupuncture, what to expect, wristband instructions, PC6 location diagram, FAQ for patients. Plain language, A4.

### Assessment Tools (3 PDFs — migrated from POPA4Ease)
8. **cari-readiness-assessment.pdf** — Modified CARI checklist (Barwick 2011). 5 categories, 100-point scale, 80+ threshold. Exists on current site — reformat with HAIF branding.
9. **ponv-data-extraction-template.pdf** — PONV incidence tracking template. Exists on current site as Excel — create PDF version with HAIF branding.
10. **staff-survey-template.pdf** — Staff knowledge and attitudes survey. Questions from Faircloth 2014 and the Australian hospital survey. Exists on current site — reformat with HAIF branding.

## Technical Approach

### Option A: Typst (Recommended)
- **What:** Modern typesetting system, Markdown-like syntax, compiles to PDF
- **Why:** Clean academic output, supports tables/diagrams, version-controlled source files, no LaTeX complexity
- **Install:** `brew install typst` or `cargo install typst-cli`
- **Workflow:** Write .typ source files → `typst compile` → PDF
- **Template:** Create one HAIF template with branding (colors, header, footer, RMIT logo placeholder)

### Option B: Pandoc + LaTeX
- **What:** Markdown → PDF via LaTeX
- **Why:** More widely known, good for text-heavy documents
- **Cons:** LaTeX dependency is heavy, table formatting is painful

### Option C: Playwright/Puppeteer HTML-to-PDF
- **What:** Render styled HTML pages → print to PDF
- **Why:** Reuses existing site CSS, consistent look
- **Cons:** Browser dependency, less control over pagination

### Recommendation: Typst
Best balance of quality, simplicity, and version control. One template, 10 source files, one build command.

## HAIF PDF Template Requirements
- Header: "HAIF — Hospital Acupuncture Implementation Framework"
- Footer: "Dr Zhen Zheng, PhD | RMIT University | hospitalacupuncture.com | Page X of Y"
- Colors: match site (primary #1a5276, accent #d4a017)
- Font: system sans-serif (Segoe UI / Helvetica)
- Paper: A4
- GRADE badges rendered as colored inline labels
- Tables styled consistently with site

## Build Integration
- Source files: `site/src/pdfs/*.typ`
- Output: `site/public/downloads/*.pdf`
- Build script: `scripts/build-pdfs.sh` (runs typst compile on all .typ files)
- Add to npm scripts: `"build:pdfs": "bash scripts/build-pdfs.sh"`
- PDFs committed to git (small enough, ensures they're always in sync with deploy)

## Execution Order
1. Install Typst
2. Create HAIF PDF template
3. Build intervention-comparison-card.pdf first (most useful, validates template)
4. Build 4 phase checklists
5. Migrate 3 existing POPA4Ease assessment tools
6. Build clinical-decision-aid.pdf and patient-education-sheet.pdf
7. Update site /resources/ page with actual download links
8. Rebuild and redeploy site
