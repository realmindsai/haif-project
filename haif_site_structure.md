# HAIF Website Structure
# Hospital Acupuncture Implementation Framework
# hospitalacupuncture.com

---

## Site Map

```
/                               ← Landing page (hero + circular diagram + audience paths)
/about/                         ← About HAIF, author bio, methodology, COI disclosure
/framework/                     ← Framework overview (4 phases explained)
/framework/exploration/         ← Phase 1: Exploration
/framework/preparation/         ← Phase 2: Preparation
/framework/implementation/      ← Phase 3: Implementation
/framework/sustainment/         ← Phase 4: Sustainment
/examples/                      ← Application examples index
/examples/ponv-acupressure/     ← Example 1: Acupressure for PONV (nurse-led)
/examples/ed-acupuncture/       ← Example 2: Acupuncture in ED (registrar-led) [BLOCKED — awaiting paper]
/for/administrators/            ← Audience: Hospital administrators
/for/clinicians/                ← Audience: ED physicians, anaesthetists
/for/practitioners/             ← Audience: Acupuncture/TCM practitioners
/for/researchers/               ← Audience: Academics, implementation scientists
/evidence/                      ← Evidence summaries with GRADE badges
/resources/                     ← Downloadable checklists, templates, pocket cards
/faq/                           ← FAQ (GEO-optimized, schema-tagged)
/references/                    ← Full reference list
/contact/                       ← Contact form
/llms.txt                       ← AI site summary
/robots.txt                     ← AI crawler permissions
/sitemap.xml                    ← Auto-generated
```

---

## Page Designs

### Landing Page `/`

```
┌─────────────────────────────────────────────┐
│  HAIF — Hospital Acupuncture                │
│  Implementation Framework                    │
│                                             │
│  A methodology for integrating acupuncture  │
│  and acupressure into hospital practice.    │
│  Evidence-based. Practitioner-tested.       │
│                                             │
│  [Explore the Framework]                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         ┌──────────┐                        │
│    ┌────┤  Phase 1 ├────┐                   │
│    │    │Exploration│    │                   │
│    │    └──────────┘    │                   │
│ ┌──┴───┐           ┌───┴──┐                │
│ │Phase 4│           │Phase 2│                │
│ │Sustain│           │Prepare│                │
│ └──┬───┘           └───┬──┘                │
│    │    ┌──────────┐    │                   │
│    └────┤  Phase 3 ├────┘                   │
│         │Implement │                        │
│         └──────────┘                        │
│                                             │
│  (Interactive SVG — click any phase)        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  "The Bottom Line"                          │
│                                             │
│  Acupuncture and acupressure are the only   │
│  non-pharmacological interventions in PONV  │
│  management guidelines. Despite strong      │
│  evidence, systematic implementation in     │
│  hospitals remains rare. This framework     │
│  shows you how.                             │
└─────────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│ Example 1│ │ Example 2│ │ Evidence │
│ PONV     │ │ ED Acup. │ │ Summary  │
│ Acupress.│ │ [Coming] │ │          │
│ Nurse-led│ │ Reg.-led │ │ [View]   │
│ [View]   │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘

┌─────────────────────────────────────────────┐
│  Dr Zhen Zheng, PhD                         │
│  RMIT University                            │
│  NHMRC Translating Research into            │
│  Practice Fellow                            │
│                                             │
│  [About the Framework →]                    │
└─────────────────────────────────────────────┘
```

### Framework Phase Page (e.g., `/framework/exploration/`)

```
┌─────────────────────────────────────────────┐
│  ← Framework    Phase 1 of 4                │
│                                             │
│  PHASE 1: EXPLORATION                       │
│  Identifying human factors and              │
│  environmental factors                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ⚡ Bottom Line                              │
│  Before implementing, assess: internal      │
│  needs, intervention options, team          │
│  composition, staff attitudes, patient      │
│  needs, funding, and organizational         │
│  readiness.                                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ▸ 1. Identify Internal Needs               │
│  ▸ 2. Intervention Types                    │
│  ▸ 3. The Implementation Team               │
│  ▸ 4. Staff Assessment                      │
│  ▸ 5. Organizational Readiness              │
│  ▸ 6. Cost and Funding                      │
│  ▸ 7. Patient Perspectives                  │
│                                             │
│  (Collapsible — click ▸ to expand)          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📥 Downloads                                │
│  • Exploration phase checklist (PDF)        │
│  • PONV data extraction template (Excel)    │
│  • Modified CARI readiness tool (PDF)       │
│  • Staff survey template (PDF)              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [← Home]  [Phase 2: Preparation →]        │
└─────────────────────────────────────────────┘
```

### Expanded Section (within Phase page)

```
┌─────────────────────────────────────────────┐
│  ▾ 2. Intervention Types                    │
│                                             │
│  Seven acupoint stimulation modalities      │
│  are available for hospital use:            │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Modality      │ RR Nausea │ Cost    │    │
│  │───────────────│──────────│─────────│    │
│  │ Wristbands    │ 0.60     │ ~$5     │    │
│  │ Body acup.    │ 0.56     │ ~$0.05  │    │
│  │ E-acupressure │ 0.71     │ $40-200 │    │
│  │ E-acupuncture │ ~0.56    │ $200-800│    │
│  │ Auricular     │ varies   │ ~$0.05  │    │
│  │ Manual acupr. │ varies   │ $0      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [Evidence: GRADE Moderate ██░░]            │
│  Source: Lee et al., 2015 (Cochrane)        │
│                                             │
│  📥 Intervention comparison card (PDF)       │
└─────────────────────────────────────────────┘
```

---

## Example Page (e.g., `/examples/ponv-acupressure/`)

```
┌─────────────────────────────────────────────┐
│  APPLICATION EXAMPLE 1                      │
│  Acupressure for PONV                       │
│  Nurse-Led Initiative                       │
│  Northern Hospital, Victoria                │
│                                             │
│  This example shows how the HAIF framework  │
│  was applied to implement acupressure       │
│  wristbands for post-operative nausea and   │
│  vomiting prevention.                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  How each phase played out:                 │
│                                             │
│  ▸ Exploration: Surveyed 165 staff,         │
│    assessed PONV incidence, selected        │
│    wristbands as intervention               │
│  ▸ Preparation: FAME assessment, timing     │
│    protocol, patient risk identification    │
│  ▸ Implementation: Training packages,       │
│    pilot program, opinion leader strategy   │
│  ▸ Sustainment: Fidelity monitoring,        │
│    champion identification, audit cycle     │
│                                             │
│  (Collapsible — click for detail)           │
└─────────────────────────────────────────────┘
```

---

## llms.txt

```markdown
# Hospital Acupuncture Implementation Framework (HAIF)

> A methodology for integrating acupuncture and acupressure
> into hospital practice, developed by Dr Zhen Zheng (RMIT University).

## About
- [Framework Overview](https://hospitalacupuncture.com/framework/): The 4-phase EPIS model (Exploration, Preparation, Implementation, Sustainment) for hospital acupuncture integration
- [About HAIF](https://hospitalacupuncture.com/about/): Background, methodology, author credentials

## Framework Phases
- [Phase 1: Exploration](https://hospitalacupuncture.com/framework/exploration/): Needs assessment, intervention selection, team building, readiness evaluation
- [Phase 2: Preparation](https://hospitalacupuncture.com/framework/preparation/): FAME criteria, timing, barriers, guideline revision
- [Phase 3: Implementation](https://hospitalacupuncture.com/framework/implementation/): Strategies, training, leadership engagement, pilot execution
- [Phase 4: Sustainment](https://hospitalacupuncture.com/framework/sustainment/): Fidelity, funding, leadership, ongoing support

## Evidence
- [Evidence Summaries](https://hospitalacupuncture.com/evidence/): GRADE-rated evidence for acupuncture/acupressure in hospital settings
- [FAQ](https://hospitalacupuncture.com/faq/): Frequently asked questions about hospital acupuncture implementation
- [References](https://hospitalacupuncture.com/references/): Full academic reference list

## Application Examples
- [PONV Acupressure](https://hospitalacupuncture.com/examples/ponv-acupressure/): Nurse-led acupressure wristband implementation for post-operative nausea (Northern Hospital, Victoria)

## Resources
- [Downloads](https://hospitalacupuncture.com/resources/): Implementation checklists, readiness assessments, staff surveys, patient education materials
```

---

## Combined Deliverables (build now)

### Pages (18 total)
1. Landing page with circular SVG diagram + audience entry cards
2. Framework overview page
3. Phase 1: Exploration (migrated + restructured, GRADE badges, collapsible)
4. Phase 2: Preparation (migrated + restructured, GRADE badges, collapsible)
5. Phase 3: Implementation (migrated + restructured, GRADE badges, collapsible)
6. Phase 4: Sustainment (migrated + restructured, GRADE badges, collapsible)
7. Example 1: PONV acupressure (Northern Hospital case study)
8. Example 2: ED acupuncture — SHELL ONLY (structure + "research in progress" notice)
9. Audience: Hospital administrators
10. Audience: Clinicians (ED physicians, anaesthetists)
11. Audience: Acupuncture/TCM practitioners
12. Audience: Researchers
13. About page (Dr Zhen Zheng bio, methodology, COI disclosure)
14. Evidence summaries page (GRADE-rated)
15. FAQ page (30-50 questions, FAQPage schema)
16. Resources/downloads page (checklists, templates, pocket cards)
17. References page (full academic reference list)
18. Contact page

### Infrastructure
19. llms.txt (AI site summary)
20. robots.txt (allow AI crawlers)
21. sitemap.xml (auto-generated)
22. JSON-LD schema on all pages (MedicalWebPage, HowTo, FAQPage, Person, Organization)
23. Deploy to hospitalacupuncture.com via Cloudflare Pages

### Downloadable Assets (PDF)
24. Phase checklists (one per phase)
25. Intervention comparison card
26. CARI readiness assessment (migrated)
27. PONV data extraction template (migrated)
28. Staff survey template (migrated)
29. Patient education materials (migrated)
30. One-page clinical decision aid

### External
31. Wikidata stub for HAIF entity
32. Wikipedia draft stub (if verifiable sources sufficient)

## BLOCKED (awaiting paper publication)

- Example 2 content: ED acupuncture findings (10 interviews, workflow data)
- Populate the shell page once published
