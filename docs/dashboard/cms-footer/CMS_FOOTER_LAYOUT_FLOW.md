# CMS Footer Layout Flow

## Doc flow
Previous: [CMS_FOOTER_SINGLE_SOURCE_OF_TRUTH.md](CMS_FOOTER_SINGLE_SOURCE_OF_TRUTH.md)
Next: [CMS_FOOTER_SECTIONWISE_FLOW.md](CMS_FOOTER_SECTIONWISE_FLOW.md)

## Goal
Show how the footer layout is built from the CMS data.

## Flow
1. Load footer page data.
2. Read theme values.
3. Read content values.
4. Render the footer preview with the same data.
5. Save form changes back into the same footer page state.

## Layout blocks
- Background and overlay
- Brand area
- Link columns
- Contact block
- Newsletter block
- Social links block
- Certifications block
- Copyright row

## Rule
Keep the visual layout stable while editing different footer blocks.

## Why this matters
The footer is a single page, but it is still built from smaller layout blocks.
Each block should stay independent while using the same shared page state.
