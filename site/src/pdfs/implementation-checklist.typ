#import "haif-template.typ": *

#show: haif-doc.with(
  title: "Phase 3: Implementation Checklist",
  subtitle: "Executing the Plan with Internal and External Enablers",
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
  Align organisational structure, select evidence-based strategies (opinion leaders yield 12% effect -- the highest), deliver role-specific training, engage all management levels, and execute a staged rollout: practice run #sym.arrow pilot #sym.arrow controlled expansion.
]

== 1. Organisational Structure Review

#chk[Identify all departments across the patient journey (admission, theatre, recovery, wards).]
#chk[Confirm coordination and communication pathways between units. #cite-ref[(CFIR: Structural Characteristics)]]
#chk[Ensure all key stakeholders are formally part of the implementation team.]
#chk[Map patient flow to identify every handover point where intervention status must be communicated.]

== 2. Priority and Goal Alignment

#chk[Communicate implementation goals to all participating staff.]
#chk[Align objectives with clinician priorities (PONV reduction, patient satisfaction, recovery time).]
#chk[Set measurable targets (e.g., PONV rate reduction, intervention uptake %).]
#chk[Plan regular feedback cycles to keep goals visible and progress transparent.]

#tip(title: "Priority Alignment")[
  #set text(size: 7.5pt)
  Clinician priority alignment is *a stronger predictor of implementation effectiveness* than any single strategy. Staff who see the intervention advancing their own goals sustain it. #cite-ref[(CFIR)]
]

== 3. Strategy Selection

#set text(size: 7.5pt)
#table(
  columns: (1.5fr, 0.6fr, 2.2fr),
  align: (left, center, left),
  stroke: 0.5pt + haif-border,
  inset: 5pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else { white },
  table.header([*Strategy*], [*Effect*], [*Acupressure Example*]),
  [Printed materials], [4.3%], [Evidence cards, PC6 location guides],
  [Educational meetings], [6%], [Lunch-and-learn, ward in-services],
  [*Local opinion leaders*], [*12%*], [Respected anaesthetist or senior nurse],
  [Audit and feedback], [5%], [Monthly PONV rate reports to staff],
)
#set text(size: 8pt)
#cite-ref[Effectiveness: Grimshaw et al., 2012.]

#chk[Prioritise *opinion leader engagement* as the highest-yield strategy.]
#chk[Combine at least two strategies for reinforcement (e.g., opinion leader + audit/feedback).]

== 4. Training Packages

#chk[Develop role-specific training:]

#tip(title: "Training by Role")[
  #set text(size: 7.5pt)
  *Anaesthetists:* Evidence review, timing protocols, integration with antiemetic practice.
  *Nurses/Midwives:* Hands-on wristband application, PC6 location, patient education.
  *Surgeons:* Evidence briefing, patient selection, referral pathways. #cite-ref[(CFIR: Access to Knowledge)]
]

#chk[Schedule on-the-job training for practical skill development.]
#chk[Prepare quick-reference materials (laminated cards, posters). Document training completion.]

== 5. Management Engagement

#chk[*Executive:* Secure formal endorsement and resource commitment.]
#chk[*Middle management:* Ensure department heads support scheduling and workflow changes.]
#chk[*Frontline managers:* Engage charge nurses/team leaders as daily drivers. #cite-ref[(CFIR: Leadership)]]

== 6. Assessment and Evaluation

#chk[Define primary outcomes (PONV incidence, rescue antiemetic use, patient satisfaction).]
#chk[Establish tracking system. Consider JBI PACES audit tool. #cite-ref[(Joanna Briggs Institute)]]
#chk[Plan regular staff feedback sessions to surface issues early.]

== 7. Staged Rollout

#chk[*Practice run:* Dry runs with willing staff to test protocols and identify workflow issues.]
#chk[*Pilot:* Single ward or surgical list with supportive staff and close monitoring.]
#chk[*Controlled expansion:* Extend based on pilot data and staff readiness.]
#chk[Debrief after each stage. Set go/no-go criteria for each expansion step.]

#v(4pt)
#align(center)[
  #text(size: 7pt, fill: haif-text-muted)[
    Hospital Acupuncture Implementation Framework (HAIF) #sym.dot.c hospitalacupuncture.com #sym.dot.c April 2026
  ]
]
