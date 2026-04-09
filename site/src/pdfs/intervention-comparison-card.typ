#import "haif-template.typ": *

#show: haif-doc.with(
  title: "Intervention Comparison Card",
  subtitle: "Acupuncture and Acupressure Modalities for Hospital Use",
  doc-type: "Clinical Tool",
)

#bottom-line[
  Six modalities are available for hospital-based acupoint stimulation. Acupressure wristbands offer the best balance of evidence, cost, and ease of implementation for most hospital settings. All PC6 stimulation modalities reduce nausea (RR 0.68), vomiting (RR 0.60), and rescue antiemetic use (RR 0.64) compared to sham or no treatment.
]

#v(8pt)

== Modality Comparison

#set text(size: 8.5pt)

#table(
  columns: (1.8fr, 1.2fr, 1.2fr, 0.8fr, 0.8fr),
  align: (left, center, center, center, center),
  stroke: 0.5pt + haif-border,
  inset: 6pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else if calc.odd(y) { white } else { haif-bg-alt.lighten(50%) },
  table.header(
    [*Modality*], [*Nausea RR*], [*Vomiting RR*], [*Cost*], [*Evidence*],
  ),
  [Acupressure Wristbands], [0.60 (0.53–0.69)], [0.54 (0.45–0.64)], [\~\$5 AUD], [#grade("High")],
  [Body Acupuncture (PC6+)], [0.56 (0.39–0.80)], [0.51 (0.34–0.76)], [\~\$0.05], [#grade("Moderate")],
  [Electroacupressure], [0.71 (0.62–0.81)], [0.60 (0.50–0.73)], [\$40–200], [#grade("Moderate")],
  [Electroacupuncture], [\~0.56], [\~0.51], [\$200–800], [#grade("Moderate")],
  [Auricular Acupuncture], [Varies], [Varies], [\~\$0.05], [#grade("Low")],
  [Manual Acupressure], [Varies], [Varies], [\$0], [#grade("Low")],
)

#v(4pt)
#cite-ref[RR = Relative Risk. Values < 1.0 favour acupuncture/acupressure. Source: Lee et al., 2015 (Cochrane); Cheong et al., 2013.]

#v(12pt)

== Modality Characteristics

#set text(size: 8.5pt)

#table(
  columns: (1.5fr, 2fr, 2fr, 1.2fr),
  align: (left, left, left, center),
  stroke: 0.5pt + haif-border,
  inset: 6pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else { white },
  table.header(
    [*Modality*], [*Advantages*], [*Disadvantages*], [*Training*],
  ),
  [Wristbands],
  [No infection risk; extended use; home continuation; minimal training; flexible delivery],
  [Limited sizing for large wrists; impractical with multiple IV lines],
  [Minimal],

  [Body Acupuncture],
  [Economical; individualised point selection; combinable with other points],
  [Needle monitoring required; staff training needed],
  [Moderate],

  [Electroacupressure],
  [Extended duration; adjustable intensity],
  [Equipment cost; training required],
  [Moderate],

  [Electroacupuncture],
  [Reusable equipment; adjustable stimulus],
  [Higher equipment cost; monitoring required],
  [Significant],

  [Auricular],
  [Economical; individualised; low misplacement risk],
  [Qualified acupuncturist may be needed],
  [Significant],

  [Manual Acupressure],
  [No equipment; no needles; easily trained],
  [Effectiveness varies by practitioner skill],
  [Minimal],
)

#v(12pt)

== Combined PC6 Stimulation Evidence (All Modalities)

#info-box(title: "Pooled Effect Sizes")[
  #set text(size: 9pt)
  - *Nausea:* 47% → 31% #h(4pt) (RR 0.68, 95% CI 0.60–0.77) #h(4pt) #grade("High")
  - *Vomiting:* 33% → 19% #h(4pt) (RR 0.60, 95% CI 0.51–0.71) #h(4pt) #grade("High")
  - *Rescue antiemetics:* 33% → 20% #h(4pt) (RR 0.64, 95% CI 0.55–0.73) #h(4pt) #grade("Moderate")
  - *Side effects:* Mild and transient only
  - *Drug interaction:* Enhanced efficacy when combined with pharmacological antiemetics

  #v(4pt)
  #cite-ref[Source: Lee A, Chan SK, Fan LT. Stimulation of the wrist acupuncture point PC6 for preventing postoperative nausea and vomiting. Cochrane Database Syst Rev. 2015.]
]

#v(12pt)

== Decision Guide

#info-box(title: "Which modality should I choose?")[
  #set text(size: 9pt)
  - *First-time implementation / nurse-led:* Start with *acupressure wristbands* — lowest barrier, strongest evidence, minimal training
  - *Credentialed acupuncturist available:* Consider *body or auricular acupuncture* for individualised treatment
  - *High-risk patients / extended prevention:* Consider *electroacupressure* for adjustable, continuous stimulation
  - *Research setting:* *Electroacupuncture* provides standardised, reproducible stimulus
  - *Combined approach:* PC6 + additional acupoints reduces PONV from 21% to 6% (RR 0.29, 95% CI 0.17–0.49)
]

#v(16pt)
#align(center)[
  #text(size: 8pt, fill: haif-text-muted)[
    Hospital Acupuncture Implementation Framework (HAIF) #sym.dot.c hospitalacupuncture.com #sym.dot.c April 2026
  ]
]
