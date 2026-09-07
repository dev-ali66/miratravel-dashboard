# CMS Footer Master Prompt

## Purpose
Use this as the single working prompt for Footer CMS tasks.

## Working style
- Do one small change at a time.
- Keep layout stable.
- Keep form and preview in sync.
- Check after each step.
- Never try to finish everything in one pass.

## Footer source of truth
- Footer page data lives in the page draft.
- Form updates write into `data.theme` and `data.content`.
- Preview reads from the same footer state.
- Shared controls must stay the same across form and preview.

## Footer flow order
1. [CMS_FOOTER_FORMCONTROLS_GUIDE.md](CMS_FOOTER_FORMCONTROLS_GUIDE.md)
2. [CMS_FOOTER_SINGLE_SOURCE_OF_TRUTH.md](CMS_FOOTER_SINGLE_SOURCE_OF_TRUTH.md)
3. [CMS_FOOTER_LAYOUT_FLOW.md](CMS_FOOTER_LAYOUT_FLOW.md)
4. [CMS_FOOTER_SECTIONWISE_FLOW.md](CMS_FOOTER_SECTIONWISE_FLOW.md)
5. [CMS_FOOTER_MAIN_ROUTE.md](CMS_FOOTER_MAIN_ROUTE.md)

## How to work
- If the change is about inputs, start with shared `FormControls` behavior.
- If the change is about data, update the shared footer state first.
- If the change is about rendering, update the preview using the same data shape.
- If the change is about one footer block, follow the main route one unchecked step at a time.

## Footer layout blocks
- Appearance
- Social appearance
- Brand
- Columns
- Contact
- Newsletter
- Social links
- Certifications
- Copyright

## Rule
Follow the footer docs in order and only do the next small step.
