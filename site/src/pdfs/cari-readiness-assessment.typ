#import "haif-template.typ": *

#show: haif-doc.with(
  title: "Organisational Readiness Assessment",
  subtitle: "Modified Checklist to Assess Readiness for Implementation (CARI)",
  doc-type: "Assessment Tool",
)

#bottom-line[
  Use this checklist before commencing implementation. A total score of *80 or above* (with a minimum of 15 in every category) indicates sufficient readiness to proceed. Scores below threshold should trigger targeted action on weak categories before moving forward.
]

#v(4pt)

#set text(size: 8.5pt)

#cite-ref[Adapted from Barwick M. (2011). Checklist to Assess Organisational Readiness (CARI) for EIP Implementation.]

#v(8pt)

== 1. System Readiness #h(1fr) _/ 20 points_

Rate each item 0 (not at all) to 4 (fully in place).

#table(
  columns: (3fr, 0.5fr),
  align: (left, center),
  stroke: 0.5pt + haif-border,
  inset: 6pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if calc.odd(y) { white } else { haif-bg-alt.lighten(50%) },
  table.header([*Item*], [*Score*]),
  [Organisational infrastructure supports new clinical practices], [],
  [Existing policies and procedures align with the proposed intervention], [],
  [Communication channels exist between relevant departments (theatre, recovery, wards)], [],
  [Quality improvement processes are in place to support ongoing evaluation], [],
  [There is an established pathway for introducing non-pharmacological interventions], [],
)

#v(2pt)
#align(right)[*Category subtotal:* #box(width: 24pt, height: 14pt, stroke: 1pt + haif-border) #text(size: 8pt)[#sym.slash 20]]

#v(6pt)

== 2. Senior Leadership #h(1fr) _/ 20 points_

#table(
  columns: (3fr, 0.5fr),
  align: (left, center),
  stroke: 0.5pt + haif-border,
  inset: 6pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if calc.odd(y) { white } else { haif-bg-alt.lighten(50%) },
  table.header([*Item*], [*Score*]),
  [Executive leadership has expressed verbal or written support for the initiative], [],
  [Resources (funding, staffing, equipment) have been committed or allocated], [],
  [Leadership is willing to champion the implementation publicly], [],
  [There is accountability at management level for implementation outcomes], [],
  [Leadership is engaged in regular progress review and feedback], [],
)

#v(2pt)
#align(right)[*Category subtotal:* #box(width: 24pt, height: 14pt, stroke: 1pt + haif-border) #text(size: 8pt)[#sym.slash 20]]

#v(6pt)

== 3. Staff Capability #h(1fr) _/ 20 points_

#table(
  columns: (3fr, 0.5fr),
  align: (left, center),
  stroke: 0.5pt + haif-border,
  inset: 6pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if calc.odd(y) { white } else { haif-bg-alt.lighten(50%) },
  table.header([*Item*], [*Score*]),
  [Staff have baseline knowledge of acupuncture/acupressure for PONV], [],
  [Staff attitudes toward complementary interventions are receptive], [],
  [Staff are willing to participate in training and adopt new practices], [],
  [There is a clinical champion or opinion leader among frontline staff], [],
  [Credentialed acupuncture practitioners are accessible (if needle-based modalities are planned)], [],
)

#v(2pt)
#align(right)[*Category subtotal:* #box(width: 24pt, height: 14pt, stroke: 1pt + haif-border) #text(size: 8pt)[#sym.slash 20]]

#v(6pt)

== 4. Implementation Plan #h(1fr) _/ 20 points_

#table(
  columns: (3fr, 0.5fr),
  align: (left, center),
  stroke: 0.5pt + haif-border,
  inset: 6pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if calc.odd(y) { white } else { haif-bg-alt.lighten(50%) },
  table.header([*Item*], [*Score*]),
  [A written implementation plan with defined objectives exists], [],
  [The plan identifies target patient populations and surgical procedures], [],
  [Roles and responsibilities of each team member are clearly defined], [],
  [A realistic timeline with milestones has been established], [],
  [Barriers have been identified with corresponding mitigation strategies], [],
)

#v(2pt)
#align(right)[*Category subtotal:* #box(width: 24pt, height: 14pt, stroke: 1pt + haif-border) #text(size: 8pt)[#sym.slash 20]]

#v(6pt)

== 5. Training #h(1fr) _/ 20 points_

#table(
  columns: (3fr, 0.5fr),
  align: (left, center),
  stroke: 0.5pt + haif-border,
  inset: 6pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if calc.odd(y) { white } else { haif-bg-alt.lighten(50%) },
  table.header([*Item*], [*Score*]),
  [Training programs have been developed for all relevant staff groups], [],
  [Training materials and resources are available and accessible], [],
  [On-the-job training and supervision processes are defined], [],
  [A plan for ongoing education and competency maintenance exists], [],
  [Staff have adequate protected time to complete required training], [],
)

#v(2pt)
#align(right)[*Category subtotal:* #box(width: 24pt, height: 14pt, stroke: 1pt + haif-border) #text(size: 8pt)[#sym.slash 20]]

#v(10pt)

== Total Score

#table(
  columns: (2fr, 1fr, 1fr),
  align: (left, center, center),
  stroke: 0.5pt + haif-border,
  inset: 6pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else { white },
  table.header([*Category*], [*Score*], [*Minimum*]),
  [1. System Readiness], [], [15],
  [2. Senior Leadership], [], [15],
  [3. Staff Capability], [], [15],
  [4. Implementation Plan], [], [15],
  [5. Training], [], [15],
  [*TOTAL*], [], [*80*],
)

#v(8pt)

#info-box(title: "Interpretation Guide")[
  #set text(size: 9pt)
  - *80--100 points (all categories #sym.gt.eq 15):* Organisation is ready to proceed with implementation.
  - *60--79 points:* Partial readiness. Address categories scoring below 15 before proceeding.
  - *Below 60 points:* Significant gaps exist. Focus on foundational elements (leadership buy-in, staff engagement) before planning implementation.
  #v(4pt)
  _Re-assess after addressing gaps. Readiness is dynamic --- revisit this checklist at each EPIS phase transition._
]

#v(6pt)

#grid(
  columns: (1fr, 1fr),
  gutter: 12pt,
  [*Assessed by:* #box(width: 100%, stroke: (bottom: 0.5pt + haif-border))[#v(14pt)]],
  [*Date:* #box(width: 100%, stroke: (bottom: 0.5pt + haif-border))[#v(14pt)]],
)

#v(10pt)

#align(center)[
  #text(size: 8pt, fill: haif-text-muted)[
    Hospital Acupuncture Implementation Framework (HAIF) #sym.dot.c hospitalacupuncture.com #sym.dot.c April 2026
  ]
]
