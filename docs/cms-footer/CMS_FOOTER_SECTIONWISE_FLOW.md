# CMS Footer Section-wise Flow

## Doc flow
Previous: [CMS_FOOTER_LAYOUT_FLOW.md](CMS_FOOTER_LAYOUT_FLOW.md)
Next: [CMS_FOOTER_MAIN_ROUTE.md](CMS_FOOTER_MAIN_ROUTE.md)

## Goal
Explain footer editing block by block.

## Footer blocks
- Footer Appearance
- Social Appearance
- Brand
- Columns
- Contact
- Newsletter
- Social Links
- Certifications
- Copyright

## Section-wise behavior
Each block is edited separately inside `FooterForm`.
Each block updates a small part of `data.content` or `data.theme`.

## Why section-wise editing helps
- Easier to understand
- Easier to debug
- Easier to maintain layout consistency
- Easier to add new footer blocks later

## Rule
Change one footer block at a time and keep the preview in sync.
