#import "haif-template.typ": *

#show: haif-doc.with(
  title: "Phase 1: Exploration Checklist",
  subtitle: "Identifying Human Factors and Environmental Context",
  doc-type: "Checklist",
)

// Compact local helpers
#let chk(content) = {
  grid(columns: (14pt, 1fr), gutter: 2pt,
    box(width: 10pt, height: 10pt, stroke: 0.8pt + haif-border, radius: 2pt),
    content,
  )
  v(1pt)
}
#let tip(title: "", content) = {
  block(width: 100%, fill: haif-bg-alt, stroke: 0.5pt + haif-border, radius: 3pt, inset: 6pt)[
    #if title != "" { text(size: 7.5pt, fill: haif-primary, weight: "bold")[#title]; h(6pt) }
    #content
  ]
  v(1pt)
}

#set text(size: 8pt)
#set par(leading: 0.4em)
#show heading.where(level: 2): it => {
  set text(size: 10pt, fill: haif-primary, weight: "bold")
  v(2pt)
  it
  v(0pt)
  line(length: 100%, stroke: 0.5pt + haif-border)
}

#bottom-line[
  Assess internal needs, select an intervention, assemble the team, gauge staff and patient attitudes, confirm readiness (CARI #sym.gt.eq 80), and secure funding. Skipping exploration is the most common reason implementations stall.
]

== 1. Internal Needs Assessment

#chk[Review hospital guidelines for current PONV prevention and management.]
#chk[Verify PONV incidence is charted in Recovery, ward, and pre-discharge charts.]
#chk[Audit current PONV incidence rate (baseline: 30--50% of surgical patients).]
#chk[Track rescue antiemetic usage separately -- not equivalent to PONV. #cite-ref[(Gan, 2014)]]
#chk[Confirm PONV risk is formally assessed pre-operatively.]

#tip(title: "Risk Factors")[
  #set text(size: 7.5pt)
  Each factor adds ~20% risk #cite-ref[(Apfel, 1999)]:
  female #sym.dot.c non-smoker #sym.dot.c previous PONV/motion sickness #sym.dot.c post-op opioids.
]

== 2. Intervention Selection

#chk[Review all six modalities (see Intervention Comparison Card).]
#chk[Assess fit with local resources, staff skills, and patient population.]
#chk[First-time / nurse-led: default to *acupressure wristbands* (~\$5, strongest evidence).]
#chk[Credentialed acupuncturist available? Consider body or auricular acupuncture.]

#tip(title: "Pooled PC6 Evidence")[
  #set text(size: 7.5pt)
  *Nausea:* 47%#sym.arrow 31% (RR 0.68) #grade("High") #h(3pt) *Vomiting:* 33%#sym.arrow 19% (RR 0.60) #grade("High") #h(3pt) *Rescue:* 33%#sym.arrow 20% (RR 0.64) #grade("Moderate") #cite-ref[Lee 2015; Cheong 2013.]
]

== 3. Team Composition

#chk[Identify *Opinion Leaders* -- those with formal/informal influence on attitudes.]
#chk[Recruit *Champions* -- who will drive implementation past resistance.]
#chk[Engage *External Change Agents* -- external experts who facilitate decisions.]
#chk[Ensure early adopters share professional/cultural backgrounds with target staff.]

== 4. Staff Assessment

#chk[Survey anaesthetists, nurses, midwives, surgeons, and administrative staff.]
#chk[Assess baseline knowledge of acupuncture/acupressure for PONV.]
#chk[Gauge willingness to use and to pursue further education.]
#chk[Identify perceived barriers (evidence, credentialing, equipment, time).]

#tip(title: "Benchmarks")[
  #set text(size: 7.5pt)
  *USA:* 54% willing; 74% would pursue education; barriers: evidence 79%, providers 71%, equipment 49%. #cite-ref[(Faircloth, 2014)]
  *Aus:* 42% believed effective; 81% would encourage post-education; 88% wanted training.
]

== 5. Organisational Readiness (CARI)

#chk[Complete the Modified CARI assessment. #cite-ref[(Barwick, 2011)]]
#chk[Score 5 categories: system readiness, leadership, staff capability, plan maturity, training.]
#chk[Confirm total #sym.gt.eq *80/100* (min 15 per category). Address weakest area first if below.]

#grid(
  columns: (1fr, 1fr),
  gutter: 8pt,
  [
    == 6. Cost and Funding
    #chk[Estimate device costs (wristbands ~\$5; needles ~\$0.05; e-stim \$40--200; EA \$200--800).]
    #chk[Calculate staff time for delivery/monitoring.]
    #chk[Document current antiemetic costs. #cite-ref[(Myle, 2016)]]
    #chk[Build cost-effectiveness comparison.]
    #chk[Identify funding source.]
  ],
  [
    == 7. Patient Perspectives
    #chk[Survey patient willingness to use acupuncture/acupressure.]
    #chk[Provide education -- willingness: 65%#sym.arrow 87%. #cite-ref[(Weeks, 2017)]]
    #chk[Only 15% know acupuncture treats nausea at baseline.]
    #chk[Incorporate patient preferences per guidelines.]
  ],
)

#v(4pt)
#align(center)[
  #text(size: 7pt, fill: haif-text-muted)[
    Hospital Acupuncture Implementation Framework (HAIF) #sym.dot.c hospitalacupuncture.com #sym.dot.c April 2026
  ]
]
