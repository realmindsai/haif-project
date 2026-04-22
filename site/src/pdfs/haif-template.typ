// HAIF PDF Template — shared by all HAIF downloadable resources
// Usage: #import "haif-template.typ": *

#let haif-primary = rgb("#1a5276")
#let haif-primary-light = rgb("#2980b9")
#let haif-accent = rgb("#d4a017")
#let haif-bg-alt = rgb("#f8f9fa")
#let haif-bg-highlight = rgb("#eaf2f8")
#let haif-border = rgb("#dee2e6")
#let haif-text = rgb("#2c3e50")
#let haif-text-muted = rgb("#6c757d")
#let haif-grade-high = rgb("#27ae60")
#let haif-grade-moderate = rgb("#2980b9")
#let haif-grade-low = rgb("#e67e22")
#let haif-grade-very-low = rgb("#c0392b")

#let haif-doc(
  title: "",
  subtitle: "",
  doc-type: "Resource",
  body,
) = {
  set document(title: title, author: "Professor Zhen Zheng, RMIT University and Northern Health")
  set page(
    paper: "a4",
    margin: (top: 3cm, bottom: 2.5cm, left: 2cm, right: 2cm),
    header: context {
      if counter(page).get().first() > 1 {
        set text(size: 8pt, fill: haif-text-muted)
        grid(
          columns: (1fr, 1fr),
          align(left)[HAIF — Hospital Acupuncture Implementation Framework],
          align(right)[#title],
        )
        v(2pt)
        line(length: 100%, stroke: 0.5pt + haif-border)
      }
    },
    footer: {
      set text(size: 7.5pt, fill: haif-text-muted)
      line(length: 100%, stroke: 0.5pt + haif-border)
      v(4pt)
      grid(
        columns: (1fr, 1fr),
        align(left)[Professor Zhen Zheng, PhD #sym.dot.c RMIT University #sym.dot.c Northern Health #sym.dot.c hospitalacupuncture.com],
        align(right)[Page #context counter(page).display("1 of 1", both: true)],
      )
    },
  )
  set text(font: "Helvetica Neue", size: 10pt, fill: haif-text)
  set par(leading: 0.65em, justify: true)
  set heading(numbering: none)
  show heading.where(level: 1): it => {
    set text(size: 16pt, fill: haif-primary, weight: "bold")
    v(4pt)
    it
    v(2pt)
  }
  show heading.where(level: 2): it => {
    set text(size: 12pt, fill: haif-primary, weight: "bold")
    v(6pt)
    it
    v(2pt)
    line(length: 100%, stroke: 0.5pt + haif-border)
    v(2pt)
  }
  show heading.where(level: 3): it => {
    set text(size: 10.5pt, fill: haif-primary, weight: "bold")
    v(4pt)
    it
    v(2pt)
  }

  // Title block
  block(
    width: 100%,
    fill: haif-primary,
    radius: 4pt,
    inset: (x: 20pt, y: 16pt),
  )[
    #set text(fill: white)
    #text(size: 8pt, weight: "bold", tracking: 0.1em)[#upper(doc-type)]
    #v(4pt)
    #text(size: 18pt, weight: "bold")[#title]
    #if subtitle != "" {
      v(4pt)
      text(size: 11pt)[#subtitle]
    }
  ]
  v(12pt)

  body
}

// GRADE badge
#let grade(level) = {
  let color = if level == "High" { haif-grade-high }
    else if level == "Moderate" { haif-grade-moderate }
    else if level == "Low" { haif-grade-low }
    else { haif-grade-very-low }
  box(
    fill: color,
    radius: 2pt,
    inset: (x: 5pt, y: 2pt),
  )[#text(size: 7pt, fill: white, weight: "bold")[#upper(level)]]
}

// Bottom-line box
#let bottom-line(content) = {
  block(
    width: 100%,
    fill: haif-bg-highlight,
    stroke: (left: 3pt + haif-primary),
    radius: (right: 4pt),
    inset: 12pt,
  )[
    #text(size: 8pt, fill: haif-primary, weight: "bold", tracking: 0.05em)[BOTTOM LINE]
    #v(4pt)
    #content
  ]
}

// Checklist item
#let check-item(content) = {
  grid(
    columns: (16pt, 1fr),
    gutter: 4pt,
    box(width: 12pt, height: 12pt, stroke: 1pt + haif-border, radius: 2pt),
    content,
  )
  v(4pt)
}

// Info box
#let info-box(title: "", content) = {
  block(
    width: 100%,
    fill: haif-bg-alt,
    stroke: 1pt + haif-border,
    radius: 4pt,
    inset: 10pt,
  )[
    #if title != "" {
      text(size: 9pt, fill: haif-primary, weight: "bold")[#title]
      v(4pt)
    }
    #content
  ]
}

// Citation
#let cite-ref(content) = {
  text(size: 8pt, fill: haif-text-muted)[#content]
}
