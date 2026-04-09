#import "haif-template.typ": *

#show: haif-doc.with(
  title: "Phase 4: Sustainment Checklist",
  subtitle: "Normalising Practice into Routine Operations",
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
#show heading.where(level: 3): it => {
  set text(size: 9pt, fill: haif-primary, weight: "bold")
  v(1pt)
  it
  v(0pt)
}

#bottom-line[
  Implementations often fail once the project team departs. Sustainment requires embedding the intervention into routine workflows, maintaining fidelity, sustaining staff support, and leveraging internal leadership and external drivers. If the practice is not normalised, it will decay.
]

== 1. External Factors

#chk[*Government/policy:* Identify guidelines, policies, or incentives supporting acupuncture/acupressure. Monitor changes.]
#chk[*Inter-organisational:* Connect with peer hospitals; share outcomes; leverage external peer pressure.]
#chk[*Funding:* Confirm cost-neutrality (wristbands ~\$5 vs. rescue antiemetic costs). Secure recurrent budget line.]
#chk[Document cost savings from reduced PONV complications and shorter stays.]

== 2. Internal Leadership

#chk[Maintain leadership engagement beyond initial implementation; schedule quarterly audit reports.]
#chk[Align outcomes with organisational mission and strategic priorities.]
#chk[Ensure leadership transitions include handover of implementation responsibilities.]
#chk[Present outcome data at departmental and hospital-level meetings.]

== 3. Fidelity Monitoring

#chk[Establish a schedule for monitoring whether the intervention is delivered as intended.]
#chk[Audit for common drift issues:]

#tip(title: "Common Fidelity Drift")[
  #set text(size: 7.5pt)
  *SeaBand displacement* below correct PC6 location (most common failure) #sym.dot.c *Inconsistent timing* (too late or too brief) #sym.dot.c *Point location errors* by undertrained staff #sym.dot.c *Documentation gaps* (delivered but not recorded) #sym.dot.c *Selective application* (only offered on request, not protocol-driven).
]

#chk[Conduct onsite spot-checks of wristband placement and point location accuracy.]
#chk[Maintain visible education materials at point of care (posters, laminated cards).]
#chk[Schedule regular refresher sessions aligned with routine practice protocols.]

== 4. Staff Support

#chk[Identify and empower at least one *champion* per unit (ward, theatre, recovery).]
#chk[Schedule ongoing education as part of regular in-service training -- not just at launch.]
#chk[Implement manager reminders about intervention protocols.]
#chk[Keep materials visible and accessible (break rooms, handover areas, supply rooms).]
#chk[Support new staff through onboarding that includes the intervention protocol.]

== 5. Self-Assessment Checklist

#tip(title: "Quarterly Sustainment Review -- Rate 1 (not at all) to 5 (fully embedded)")[
  #set text(size: 7.5pt)
]

#chk[Intervention is documented in current hospital guidelines and protocols.]
#chk[New staff receive training during onboarding.]
#chk[PONV incidence and intervention uptake are routinely audited.]
#chk[Leadership receives regular outcome reports.]
#chk[At least one active champion exists in each participating unit.]
#chk[Fidelity checks are conducted at least quarterly.]
#chk[Consumables managed through standard procurement (not ad hoc).]
#chk[Staff report confidence delivering the intervention.]
#chk[Patient feedback is collected and reviewed.]
#chk[The intervention is perceived as "how we do things here."]

#tip(title: "Scoring")[
  #set text(size: 7.5pt)
  *40--50:* Fully sustained. #h(4pt) *30--39:* Mostly sustained -- address gaps. #h(4pt) *20--29:* At risk -- prioritise fidelity and support. #h(4pt) *Below 20:* Re-implement (Phase 3).
]

#v(4pt)
#align(center)[
  #text(size: 7pt, fill: haif-text-muted)[
    Hospital Acupuncture Implementation Framework (HAIF) #sym.dot.c hospitalacupuncture.com #sym.dot.c April 2026
  ]
]
