#import "haif-template.typ": *

#show: haif-doc.with(
  title: "Staff Knowledge and Attitudes Survey",
  subtitle: "Acupuncture and Acupressure for Post-Operative Nausea and Vomiting",
  doc-type: "Survey Instrument",
)

#info-box(title: "About This Survey")[
  #set text(size: 9pt)
  This anonymous survey assesses staff knowledge, attitudes, and perceived barriers regarding acupuncture and acupressure use in hospital settings. Results will inform implementation planning and training priorities. Completion takes approximately 5--10 minutes.
]

#v(6pt)

== Section A: Demographics

#set text(size: 9pt)

*A1. Role* (tick one): \
#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 4pt,
  check-item[Anaesthetist],
  check-item[Nurse],
  check-item[Midwife],
  check-item[Surgeon],
  check-item[Obstetrician / Gynaecologist],
  check-item[Other: #box(width: 60pt, stroke: (bottom: 0.5pt + haif-border))[#v(10pt)]],
)

#v(4pt)

*A2. Department:* #box(width: 200pt, stroke: (bottom: 0.5pt + haif-border))[#v(12pt)]

#v(4pt)

*A3. Years of clinical experience* (tick one): \
#grid(
  columns: (1fr, 1fr, 1fr, 1fr),
  gutter: 4pt,
  check-item[< 2 years],
  check-item[2--5 years],
  check-item[6--15 years],
  check-item[> 15 years],
)

#v(6pt)

== Section B: Knowledge

#set text(size: 9pt)

For each statement, tick *Yes*, *No*, or *Unsure*.

#table(
  columns: (3fr, 0.6fr, 0.6fr, 0.6fr),
  align: (left, center, center, center),
  stroke: 0.5pt + haif-border,
  inset: 5pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if calc.odd(y) { white } else { haif-bg-alt.lighten(50%) },
  table.header([*Statement*], [*Yes*], [*No*], [*Unsure*]),
  [B1. I have heard of acupuncture or acupressure being used in hospitals], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [B2. I know what the PC6 (Neiguan) acupressure point is], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [B3. I am aware of evidence supporting acupuncture/acupressure for PONV], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [B4. I have previously used or observed acupuncture/acupressure in a clinical setting], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [B5. I know that acupuncture/acupressure is included in PONV management guidelines], [#sym.ballot], [#sym.ballot], [#sym.ballot],
)

#v(6pt)

== Section C: Attitudes

Rate your agreement with each statement.

#let scale-header = table.header(
  [*Statement*], [*SD*], [*D*], [*N*], [*A*], [*SA*],
)

#table(
  columns: (3fr, 0.45fr, 0.45fr, 0.45fr, 0.45fr, 0.45fr),
  align: (left, center, center, center, center, center),
  stroke: 0.5pt + haif-border,
  inset: 5pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if calc.odd(y) { white } else { haif-bg-alt.lighten(50%) },
  scale-header,
  [C1. I believe acupuncture/acupressure can be effective for managing PONV], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [C2. I would consider using acupuncture/acupressure in my practice], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [C3. I would encourage patients to try acupressure wristbands for PONV], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [C4. I would pursue further education on acupuncture/acupressure], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [C5. Acupuncture/acupressure is a valuable addition to hospital care], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
)

#v(2pt)
#text(size: 7.5pt, fill: haif-text-muted)[SD = Strongly Disagree, D = Disagree, N = Neutral, A = Agree, SA = Strongly Agree]

#v(6pt)

== Section D: Perceived Barriers

Rate how significant each barrier is in your setting (1 = not a barrier, 5 = major barrier).

#table(
  columns: (3fr, 0.45fr, 0.45fr, 0.45fr, 0.45fr, 0.45fr),
  align: (left, center, center, center, center, center),
  stroke: 0.5pt + haif-border,
  inset: 5pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if calc.odd(y) { white } else { haif-bg-alt.lighten(50%) },
  table.header([*Barrier*], [*1*], [*2*], [*3*], [*4*], [*5*]),
  [D1. Lack of scientific evidence for acupuncture/acupressure], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [D2. Unavailability of credentialed acupuncture providers], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [D3. Lack of appropriate equipment (wristbands, devices)], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [D4. Time constraints during clinical workflow], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [D5. Patient reluctance or refusal], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [D6. Insufficient training opportunities], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
  [D7. Lack of organisational support or policy], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot],
)

#v(2pt)
#text(size: 7.5pt, fill: haif-text-muted)[1 = Not a barrier #h(6pt) 2 = Minor barrier #h(6pt) 3 = Moderate barrier #h(6pt) 4 = Significant barrier #h(6pt) 5 = Major barrier]

#v(6pt)

== Section E: Open Response

*E1. What would make you more likely to support acupuncture or acupressure use in this hospital?*

#block(
  width: 100%,
  height: 60pt,
  stroke: 0.5pt + haif-border,
  radius: 2pt,
  inset: 6pt,
)[]

#v(4pt)

*E2. Any additional comments?*

#block(
  width: 100%,
  height: 45pt,
  stroke: 0.5pt + haif-border,
  radius: 2pt,
  inset: 6pt,
)[]

#v(10pt)

#align(center)[
  #text(size: 8pt, fill: haif-text-muted)[
    Thank you for completing this survey. Your responses are anonymous and will be used to improve implementation planning.
  ]
]

#v(4pt)

#cite-ref[Survey design informed by Faircloth (2014) USA anaesthesia staff survey and Australian hospital survey (Zheng et al.). See also Cohen et al. 2005; Wardle et al. 2013.]
