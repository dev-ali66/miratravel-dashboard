# CMS Home FormControls Guide

## Goal
Show how `FormControls.tsx` works as the shared field system.

## Why this file matters
`src/components/pages/CMS/shared/FormControls.tsx` is the base layer for most CMS inputs.
It provides:
- `DynamicStyledField`
- `TextField`
- `TextAreaField`
- `SelectField`
- `SwitchField`
- `ColorField`
- validation helpers
- style controls
- image and video field wrappers

## Single field system
Instead of writing separate UI for every input, the project uses one dynamic field system:
- `type="text"`
- `type="textarea"`
- `type="select"`
- `type="switch"`
- `type="image"`
- `type="video"`

## Validation support
The normal field system supports:
- `required`
- `minLength`
- `maxLength`
- `min`
- `max`
- `pattern`
- `patternMessage`
- custom validation function

## Style support
For text-like fields, style editing is optional:
- `enableStyle`
- `style`
- `onStyleChange`

This is why styled fields can be used where needed and plain fields can be used where styles are not needed.

## When to use which
- Use `DynamicStyledField` for most CMS form inputs.
- Use `TextField` or `TextAreaField` when you want the normal field only.
- Use validation on text and textarea fields when regex or length checks are needed.

## Important rule
Do not duplicate field logic in each section form.
Use the shared controls so every section behaves consistently.
