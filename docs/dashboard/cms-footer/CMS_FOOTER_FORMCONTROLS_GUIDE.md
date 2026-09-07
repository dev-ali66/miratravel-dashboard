# CMS Footer FormControls Guide

## Doc flow
Next: [CMS_FOOTER_SINGLE_SOURCE_OF_TRUTH.md](CMS_FOOTER_SINGLE_SOURCE_OF_TRUTH.md)

## Goal
Show how the shared field system is used in Footer CMS.

## Shared controls used in footer
Footer form uses shared controls from `src/components/pages/CMS/shared/FormControls.tsx`:
- `TextField`
- `TextAreaField`
- `ColorField`
- `DynamicStyledField`
- `DynamicStyledField` image controls for logo, social icons, and certification images

## Why this matters
The footer should not build separate input logic for every field.
Using shared controls keeps the UI consistent with the rest of CMS.

## Typical usage
- Use `ColorField` for theme colors
- Use `TextField` for labels and URLs
- Use `TextAreaField` for longer description text
- Use shared image controls for logo, custom icons, and certification images

## Validation
The normal field system already supports:
- required
- min/max length
- regex pattern
- custom validation

## Rule
Keep footer inputs on the shared form control layer so all CMS pages behave the same way.
