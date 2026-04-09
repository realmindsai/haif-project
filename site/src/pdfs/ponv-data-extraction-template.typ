#import "haif-template.typ": *

#show: haif-doc.with(
  title: "PONV Data Extraction Template",
  subtitle: "Recording Post-Operative Nausea and Vomiting Outcomes",
  doc-type: "Data Collection Tool",
)

#info-box(title: "Instructions")[
  #set text(size: 9pt)
  Complete one row per patient. Record PONV risk factors on admission, intervention details peri-operatively, and outcomes at Recovery, Ward, and Discharge. Note: rescue antiemetic use is not equivalent to PONV --- record both independently.
]

#v(6pt)

== Patient Details and Risk Factors

#set text(size: 7.5pt)

#table(
  columns: (0.6fr, 0.7fr, 1fr, 0.35fr, 0.35fr, 0.35fr, 0.35fr, 0.4fr),
  align: (center, center, left, center, center, center, center, center),
  stroke: 0.5pt + haif-border,
  inset: 4pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if y == 1 { haif-bg-alt.lighten(50%) } else { white },
  table.header(
    [*Patient ID*], [*Date*], [*Surgery Type*],
    [*Female*], [*Non-#linebreak()smoker*], [*Prior#linebreak()PONV \/#linebreak()Motion#linebreak()Sick*], [*Post-op#linebreak()Opioid*], [*Risk#linebreak()Score#linebreak()#text[(0--4)]*],
  ),
  // Row descriptors
  [], [], [], [#sym.ballot], [#sym.ballot], [#sym.ballot], [#sym.ballot], [],
  // 10 blank data rows
  ..([],) * 80,
)

#v(8pt)

== Intervention and Outcomes

#set text(size: 7.5pt)

#table(
  columns: (0.6fr, 0.8fr, 0.55fr, 0.55fr, 0.6fr, 0.6fr, 0.6fr, 0.5fr, 0.6fr, 0.6fr),
  align: center,
  stroke: 0.5pt + haif-border,
  inset: 3.5pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if y == 1 { haif-bg-alt.lighten(50%) } else { white },
  table.header(
    [*Patient ID*],
    [*Intervention#linebreak()Type*],
    [*Timing*],
    [*Duration#linebreak()#text[(min)]*],
    [*PONV#linebreak()Recovery*],
    [*PONV#linebreak()Ward*],
    [*PONV#linebreak()Discharge*],
    [*Rescue#linebreak()Anti-#linebreak()emetic?*],
    [*Drug /#linebreak()Dose*],
    [*Notes*],
  ),
  // Row descriptors
  table.cell(align: left)[],
  table.cell(align: left)[#text(size: 6.5pt)[WB / BA /#linebreak()EA / AU /#linebreak()MA / EAP]],
  table.cell(align: left)[#text(size: 6.5pt)[Pre / Post /#linebreak()Symptom]],
  [],
  table.cell(align: left)[#text(size: 6.5pt)[N / Mild /#linebreak()Mod / Sev]],
  table.cell(align: left)[#text(size: 6.5pt)[N / Mild /#linebreak()Mod / Sev]],
  table.cell(align: left)[#text(size: 6.5pt)[N / Mild /#linebreak()Mod / Sev]],
  table.cell(align: left)[#text(size: 6.5pt)[Y / N]],
  [],
  [],
  // 10 blank data rows
  ..([],) * 100,
)

#v(8pt)

== Legend

#set text(size: 8pt)

#grid(
  columns: (1fr, 1fr),
  gutter: 8pt,
  [
    *Intervention Type Codes:*
    - *WB* = Acupressure wristbands
    - *BA* = Body acupuncture (PC6+)
    - *EA* = Electroacupuncture
    - *AU* = Auricular acupuncture
    - *MA* = Manual acupressure
    - *EAP* = Electroacupressure
  ],
  [
    *PONV Severity Scale:*
    - *N* = None
    - *Mild* = Nausea only, no vomiting
    - *Mod* = Nausea with 1--2 vomiting episodes
    - *Sev* = 3+ vomiting episodes or intractable nausea

    *Timing:*
    - *Pre* = Pre-operative (prevention)
    - *Post* = Post-operative (prevention)
    - *Symptom* = At symptom onset (management)
  ],
)

#v(8pt)

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 12pt,
  [*Collected by:* #box(width: 100%, stroke: (bottom: 0.5pt + haif-border))[#v(12pt)]],
  [*Department:* #box(width: 100%, stroke: (bottom: 0.5pt + haif-border))[#v(12pt)]],
  [*Date range:* #box(width: 100%, stroke: (bottom: 0.5pt + haif-border))[#v(12pt)]],
)

#v(10pt)

#cite-ref[PONV risk factors: Apfel et al. 1999. Note: rescue antiemetic use is not equivalent to PONV (track both). Template adapted from POPA4Ease data extraction tool.]
