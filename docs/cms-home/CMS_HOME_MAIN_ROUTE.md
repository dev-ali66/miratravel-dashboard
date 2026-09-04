# CMS Home Main Route

## Purpose
This is the main working route for Home CMS changes.
Do work in small steps only.
Do not try to change everything at once.

## Working rule
1. Pick one section or one shared system.
2. Make the change.
3. Check the result.
4. Mark it done.
5. Move to the next item.

## Step-by-step order
- [x] Understand the shared field system in `FormControls.tsx`
- [x] Keep normal fields normal in SEO where styles are not needed
- [x] Add shared style-capable fields where styles are needed
- [x] Create the universal multimedia form
- [x] Create the universal multimedia preview
- [x] Add cached image/video data to preserve mode switches
- [x] Wire reusable multimedia blocks into Home section forms
- [x] Wire the same multimedia structure into Home previews
- [ ] Check every Home section one by one
- [ ] Confirm section-specific layout stays unchanged
- [ ] Confirm all previews still match the old layout
- [ ] Add any missing shared helper if a section needs it
- [ ] Validate no section is breaking after each small change

## How to use this route
When you ask for the next task, follow the next unchecked item only.
Do not jump ahead.

## Maintenance style
- Keep changes small.
- Keep layout stable.
- Keep one shared source of truth.
- Check after each step.
- Continue only after the previous step is confirmed.

## Suggested future flow
- Home Hero
- Explore Journeys
- Destinations
- Mira Stories
- Why Mira
- Travel Insights
- Custom Journey CTA

Each section should be handled separately, but with the same shared system.
