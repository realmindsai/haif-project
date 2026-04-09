#import "haif-template.typ": *

#show: haif-doc.with(
  title: "Clinical Decision Aid",
  subtitle: "Acupuncture / Acupressure for PONV Prevention and Management",
  doc-type: "Clinical Tool",
)

#bottom-line[
  Patients with 2 or more Apfel risk factors should be considered for PC6 acupoint stimulation. Acupressure wristbands are the lowest-barrier starting point (RR 0.60 nausea, 0.54 vomiting). #grade("High")
]

#v(6pt)

== Step 1: Assess PONV Risk (Apfel Score)

#info-box(title: "Score 1 point for each factor present")[
  #set text(size: 9pt)
  #grid(
    columns: (1fr, 1fr),
    gutter: 8pt,
    [
      #check-item[*Female gender*]
      #check-item[*Non-smoker*]
    ],
    [
      #check-item[*History of PONV or motion sickness*]
      #check-item[*Post-operative opioid use expected*]
    ],
  )
  #v(4pt)
  *Risk score:* #box(width: 20pt, height: 14pt, stroke: 1pt + haif-border) #text(size: 8pt)[#sym.slash 4] #h(12pt)
  _Each additional factor increases PONV risk by ~20% (Apfel et al., 1999)._
  #v(2pt)
  #table(
    columns: (1fr, 1fr, 1fr, 1fr, 1fr),
    align: center,
    stroke: 0.5pt + haif-border,
    inset: 4pt,
    fill: (x, y) => if y == 0 { haif-bg-alt } else { white },
    [*Score*], [*0*], [*1*], [*2*], [*3--4*],
    [*Risk*], [~10%], [~20%], [~40%], [~60--80%],
  )
]

#v(6pt)

== Step 2: Is Acupuncture / Acupressure Indicated?

#set text(size: 9pt)

#grid(
  columns: (16pt, 1fr),
  gutter: 4pt,
  text(fill: haif-primary, weight: "bold")[▸],
  [*Score 0--1:* Standard pharmacological prophylaxis per local guidelines. Acupoint stimulation optional.],
)
#v(2pt)
#grid(
  columns: (16pt, 1fr),
  gutter: 4pt,
  text(fill: haif-primary, weight: "bold")[▸],
  [*Score 2+:* Acupuncture/acupressure *recommended* as adjunct or alternative. Combined with antiemetics, PC6 stimulation provides additive benefit. #grade("Moderate")],
)

#v(6pt)

== Step 3: Select Modality

#set text(size: 8.5pt)

#table(
  columns: (1.4fr, 1.4fr, 1fr, 0.8fr),
  align: (left, left, center, center),
  stroke: 0.5pt + haif-border,
  inset: 5pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if calc.odd(y) { white } else { haif-bg-alt.lighten(50%) },
  table.header(
    [*Setting*], [*Recommended Modality*], [*Nausea RR*], [*Evidence*],
  ),
  [Nurse-led / first implementation], [*Acupressure wristbands*], [0.60], [#grade("High")],
  [Credentialed acupuncturist available], [*Body or auricular acupuncture*], [0.56], [#grade("Moderate")],
  [High-risk (score 3--4)], [*Electroacupressure* #sym.plus wristbands], [0.71], [#grade("Moderate")],
  [Combined approach], [*PC6 + additional acupoints*], [RR 0.29], [#grade("Moderate")],
)

#v(6pt)

== Step 4: Determine Timing

#grid(
  columns: (16pt, 1fr),
  gutter: 4pt,
  text(fill: haif-primary, weight: "bold")[▸],
  [*Prevention:* Apply 30 minutes pre-operatively. Wristbands may be applied up to 12--24 hours before surgery.],
)
#v(2pt)
#grid(
  columns: (16pt, 1fr),
  gutter: 4pt,
  text(fill: haif-primary, weight: "bold")[▸],
  [*Management:* Apply at symptom onset. Position wristband button firmly over PC6; press for 2 minutes.],
)

#v(6pt)

== Step 5: Who Delivers the Intervention?

#set text(size: 9pt)

#table(
  columns: (1.5fr, 2fr, 1.5fr),
  align: (left, left, left),
  stroke: 0.5pt + haif-border,
  inset: 5pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else { white },
  table.header(
    [*Modality*], [*Delivered By*], [*Training Required*],
  ),
  [Wristbands / manual acupressure], [Nurses, midwives, ward staff], [Minimal (PC6 location)],
  [Body / auricular acupuncture], [Credentialed acupuncturist], [Formal qualification],
  [Electroacupressure], [Trained nurse or acupuncturist], [Moderate (device + PC6)],
)

#v(6pt)

== Step 6: Document and Monitor

#check-item[Record modality, timing, and duration in patient notes]
#check-item[Assess PONV at Recovery, Ward, and pre-Discharge]
#check-item[Document rescue antiemetic use (drug, dose, time)]
#check-item[Report adverse events (expected: mild, transient only)]
#check-item[Audit outcomes monthly to sustain fidelity]

#v(8pt)

#cite-ref[Sources: Apfel et al. 1999; Lee et al. 2015 (Cochrane); Cheong et al. 2013; Gan et al. 2014 PONV Guidelines.]
