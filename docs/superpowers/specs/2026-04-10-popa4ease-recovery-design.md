# POPA4Ease Recovery Design Spec

**Date:** 2026-04-10
**Status:** Draft for review
**Scope:** Recover missing legacy POPA4Ease graphics, downloads, and high-value interactions into the current Astro site

## Context

The current Astro site already carries much of the POPA4Ease text content, but it does not yet preserve the full legacy asset set or the useful parts of the old interaction model. Some old images are present, some are missing, and at least one important interaction, the Exploration intervention widget, was flattened into plain static content.

The old WordPress site also depended on fragile plugin behavior. That behavior is not worth preserving as-is. The goal is to recover the substance of the old site, then present it through modern, maintainable Astro-native components.

## Goals

1. Spider the full legacy POPA4Ease site and treat it as the source of truth for recoverable assets and downloads.
2. Build a normalized manifest of legacy graphics, downloads, and information-bearing interaction content.
3. Compare that manifest against the current Astro site and identify gaps.
4. Recover missing graphics and downloads into the Astro repo with clean evergreen filenames.
5. Preserve original download file formats where available, including formats such as `.xlsx`.
6. Replace old plugin-driven interaction patterns with modern, accessible Astro-native UI.
7. Rebuild the Exploration intervention section as a comparison table with expandable rows, using recovered legacy content.

## Non-Goals

1. Pixel-match the WordPress site.
2. Recreate legacy plugin behavior for its own sake.
3. Preserve hover-only or hotspot-first interaction as the primary experience.
4. Keep messy WordPress naming in the live Astro site.

## Source Audit Strategy

The recovery starts with a full-site crawl of the old POPA4Ease site, not a page-by-page manual patch job.

The crawl must capture:

1. Direct graphics referenced through `<img>` and related markup.
2. Downloads referenced through links.
3. Indirect assets referenced through configuration files or widget markup, such as the `imagelinks` intervention widget.
4. Popup and tooltip content that contains real comparison or clinical information.

The output of this step is a manifest with one row per recoverable item. Each row should include:

- legacy URL
- item type: `image`, `download`, `interaction_content`, or `config_asset`
- source page
- current Astro coverage status
- proposed local filename
- notes on whether the item should be rendered directly, transformed, or used only as migration source material

## Recovery Model

Recovered assets will be copied into local Astro-managed folders.

### Images

- Stored under `site/public/images`
- Renamed to clean evergreen filenames
- Referenced only through local Astro paths in live pages

### Downloads

- Stored under `site/public/downloads`
- Renamed to clean evergreen filenames
- Original format preserved where available
- If both a legacy original and a newer Astro-generated derivative exist, the original remains the recovery target and the derivative becomes optional

### Migration Metadata

The migration must preserve traceability from old WordPress URLs to new local filenames. That mapping should live in migration metadata or recovery data, not in rendered page markup.

## Interaction Modernization

Old POPA4Ease interactions should be kept only when they carry meaningful information. Decorative plugin behavior should be dropped.

The key case is the `Intervention` section on the Exploration page.

### Legacy State

The old site used a hub-and-spoke infographic with hotspots and popup tables. The visual hinted at modality taxonomy, but the useful content lived inside the popup tables. The interaction was fragile, inaccessible, and poorly suited to mobile.

### New State

The new Astro site should present this content as a modern comparison table with expandable rows.

Collapsed rows should show the comparison dimensions users actually need:

- modality
- invasiveness
- evidence snapshot
- equipment or cost burden
- training burden

Expanded rows should reveal the recovered legacy substance:

- effectiveness data
- advantages
- disadvantages
- notes and citations

The old diagram may be retained only as secondary supporting art if it still earns its place. It should not be the primary interaction model.

### Rule for Other Legacy Interactions

If a legacy popup, tooltip, or widget contains real information, convert it into one of these modern patterns:

1. expandable details
2. inline callout
3. accessible tooltip or popover for genuinely short content

If the old interaction contains no meaningful information beyond decoration, do not reproduce it.

## Architecture

The recovery should be data-driven.

1. A recovery manifest captures legacy source items and their mapped local targets.
2. Structured legacy comparison content is stored in a source data file rather than hardcoded repeatedly in page templates.
3. Astro components render recovered assets and modernized interaction patterns from that structured data.

This keeps the migration auditable and prevents WordPress plugin residue from leaking into page code.

## Deliverables

1. Full POPA4Ease asset and download manifest
2. Gap report against the current Astro site with these buckets:
   - already covered
   - missing asset
   - missing download
   - missing interaction
3. Recovered local graphics and downloads
4. Source-to-target mapping for renamed assets
5. Modern intervention comparison table built from recovered legacy content
6. Any additional rebuilt interaction only where the legacy interaction carried real information

## Testing Strategy

The work must follow the project testing rules.

### Unit Tests

- manifest or parsing utilities
- any transformation logic that normalizes legacy content

### Integration Tests

- pages render local recovered asset references
- recovered comparison content appears in the intended sections
- legacy downloads resolve to local files in their original formats where available

### E2E Tests

- Exploration intervention comparison table renders
- row expansion reveals the expected content
- interaction works on click or tap without requiring hover

## Risks

1. Some WordPress content may contain malformed HTML or pasted Word cruft. The migration should normalize it rather than preserve garbage.
2. Some assets may be referenced only indirectly through widget config. The full crawl is meant to catch these.
3. Some current Astro assets may be visual replacements rather than strict recoveries. The gap report must separate "already present" from "present but substituted."

## Acceptance Criteria

The recovery design is satisfied when:

1. The entire old POPA4Ease site has been crawled for recoverable graphics, downloads, and information-bearing interaction content.
2. A normalized manifest and Astro gap report exist.
3. Missing graphics and downloads have local Astro-managed copies with clean evergreen filenames.
4. Original download file formats are preserved where available.
5. The Exploration intervention widget has been rebuilt as a modern comparison table with expandable rows.
6. The rebuilt interaction preserves the useful legacy comparison content without reproducing the old plugin model.
7. Tests cover manifest logic, local asset rendering, and the new intervention interaction.

## Recommended Implementation Approach

Use a manifest-first recovery workflow.

This is slower upfront than patching pages ad hoc, but it is the only approach that fits the approved scope:

- full legacy POPA4Ease site as audit source
- modern Astro-native interaction model
- renamed local assets
- preserved original file formats

Page-by-page retrofits or widget-first rescue may look faster, but they increase the chance of missing indirect assets, buried downloads, and config-driven content.
