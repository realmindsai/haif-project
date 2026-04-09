#import "haif-template.typ": *

#show: haif-doc.with(
  title: "Phase 2: Preparation Checklist",
  subtitle: "Developing Strategies to Address Barriers and Leverage Enablers",
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
  Translate Exploration findings into an actionable plan. Validate the intervention via FAME criteria, decide timing, select target patients, prepare documentation, map barriers to strategies, and assign CFIR-aligned roles. Complete this phase before any clinical activity begins.
]

== 1. FAME Assessment

#chk[*Feasibility* -- Confirm delivery within existing staffing, equipment, and infrastructure.]
#chk[*Appropriateness* -- Verify the intervention fits local clinical context and patient population.]
#chk[*Meaningfulness* -- Confirm the intervention is valued by patients and clinicians (Phase 1 data).]
#chk[*Effectiveness* -- Review evidence the modality reduces PONV in the target surgical population.]

#tip(title: "FAME Conclusion")[
  #set text(size: 7.5pt)
  Acupressure is assessed as *feasible, appropriate, meaningful, and effective* for PONV management in hospital settings. #cite-ref[(Pearson et al., 2005)]
]

== 2. Timing Decisions

#chk[Define primary goal: *prevention* (pre-/peri-operative) or *management* (post-symptom onset).]
#chk[Prevention: plan application 30 min pre-op, or up to 12--24 hours before surgery.]
#chk[Management: establish protocol for application after PONV symptoms appear.]
#chk[Assess staff availability at each timing window (pre-op clinic, anaesthetic bay, recovery, ward).]
#chk[Determine which staff role delivers the intervention at each stage.]

== 3. Patient Selection Criteria

#chk[Define high-risk patient inclusion criteria using established risk factors.]
#chk[Decide: offer to all surgical patients or only high-risk patients?]
#chk[Define exclusion criteria (e.g., wrist injuries, IV line placement for wristbands).]
#chk[Document the patient selection protocol for staff reference.]

#tip(title: "High-Risk PONV Indicators")[
  #set text(size: 7.5pt)
  Female #sym.dot.c prior PONV/motion sickness #sym.dot.c non-smoker #sym.dot.c younger age #sym.dot.c anticipated post-op opioids.
  *High-risk surgeries:* cholecystectomy, gynaecological, laparoscopic.
]

== 4. Documentation Requirements

#chk[Revise/create hospital PONV management guidelines to include acupuncture/acupressure.]
#chk[Develop PONV assessment checklists for pre-op, recovery, and ward settings.]
#chk[Create patient education materials (information sheets, consent forms if required).]
#chk[Update operative documentation to capture intervention delivery.]
#chk[Modify ward observation charts to record intervention use and outcomes.]
#chk[Amend drug charts to include acupuncture/acupressure alongside pharmacological antiemetics.]

== 5. Barrier--Strategy Mapping

#set text(size: 7.5pt)
#table(
  columns: (1fr, 2.5fr),
  align: (left, left),
  stroke: 0.5pt + haif-border,
  inset: 5pt,
  fill: (x, y) => if y == 0 { haif-bg-alt } else { white },
  table.header([*Barrier*], [*Strategy*]),
  [Lack of awareness], [Educational meetings, printed materials, evidence summaries],
  [Insufficient capability], [Role-specific training packages, on-the-job mentoring],
  [Equipment unavailability], [Procurement plan, budget allocation, stock management],
  [Time constraints], [Workflow integration, timing protocol, task delegation],
)
#set text(size: 8pt)

#chk[Assign an owner and deadline to each barrier-strategy pair.]
#chk[Review barrier--strategy map with the full implementation team.]

== 6. Team Role Assignment (CFIR)

#chk[Assign *Opinion Leaders* to champion evidence communication.]
#chk[Assign *Champions* to drive day-to-day implementation.]
#chk[Assign *External Change Agents* for training, credibility, and expert guidance.]
#chk[Define which staff deliver the intervention at each timing point.]
#chk[Document each role's responsibilities. Schedule kick-off meeting before Phase 3.]

#v(4pt)
#align(center)[
  #text(size: 7pt, fill: haif-text-muted)[
    Hospital Acupuncture Implementation Framework (HAIF) #sym.dot.c hospitalacupuncture.com #sym.dot.c April 2026
  ]
]
