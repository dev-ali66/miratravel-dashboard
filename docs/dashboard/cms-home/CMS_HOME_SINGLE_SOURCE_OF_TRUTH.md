# CMS Home Single Source of Truth

## Goal
Keep all Home CMS data, editing, and preview logic in one consistent structure.

## Core idea
- Section data lives in `section.content`, `section.bgImages`, `section.bgVideos`, `section.sideImages`, and `section.backgroundType`.
- Shared components read and write from the same source.
- Form changes should update the same section object that preview uses.

## What is the source of truth?
1. **Section content**
   - Text, title, description, paragraphs, button labels, style keys.
2. **Section media state**
   - Background image/video/color state.
   - Cached media data inside multimedia blocks.
3. **Shared field controls**
   - `DynamicStyledField` and its legacy wrappers.
4. **Shared preview renderer**
   - `UniversalMultimediaPreview` and section preview components.

## Rules
- Do not keep separate local copies of the same CMS data unless it is only temporary UI state.
- Form and preview should always use the same section object shape.
- If a field is edited in the form, the preview should reflect it without manual sync.
- Keep section-specific style keys inside section content so they remain editable and portable.

## Example
- Edit `homeHeroTitleStyle` in the form.
- Preview reads the same `homeHeroTitleStyle`.
- No duplicate style store is needed.

## Result
This keeps the CMS predictable, easier to debug, and easier to extend section by section.
