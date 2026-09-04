# CMS Footer Single Source of Truth

## Doc flow
Previous: [CMS_FOOTER_MASTER_PROMPT.md](CMS_FOOTER_MASTER_PROMPT.md)
Next: [CMS_FOOTER_LAYOUT_FLOW.md](CMS_FOOTER_LAYOUT_FLOW.md)

## Goal
Keep Footer CMS editing and preview logic in one shared data shape.

## Source of truth
The footer state lives in the page draft object:
- `data.theme`
- `data.content`

## What each part controls
- **Theme**: background, text, heading, muted text, accent, borders, social styles, newsletter styles, bottom text
- **Content**: brand, columns, contact, social links, newsletter, certifications, copyright

## Rule
- Footer form writes to the page draft.
- Footer preview reads from the same page draft.
- Avoid duplicate local state for the same footer data.

## Result
This keeps the footer predictable and easy to extend without breaking the preview.
