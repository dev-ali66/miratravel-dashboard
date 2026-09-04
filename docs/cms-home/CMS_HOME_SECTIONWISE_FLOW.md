# CMS Home Section-wise Flow

## Goal
Explain how each Home section is handled separately while still following the same pattern.

## Section-wise thinking
Each Home section is treated as an independent module:
- Hero
- Explore Journeys
- Destinations
- Mira Stories
- Why Mira
- Travel Insights
- Custom Journey CTA

Each module has:
1. A form component
2. A preview component
3. A registry entry in `homeSections.ts`

## Standard flow per section
1. Load the section object.
2. Render the matching form from the registry.
3. Edit content through shared field controls.
4. Save changes back into the same section.
5. Preview reads the same section object.

## Why this helps
- Each section can have different layout and content.
- The editing pattern remains consistent.
- New sections can be added without breaking old ones.

## Section-specific logic
- Hero uses its own top banner layout.
- Mira Stories and Why Mira use reusable multimedia blocks.
- Travel Insights and CTA sections use shared background logic.
- All sections still follow the same data flow.

## Rule
Think section by section, but never break the common CMS pattern.
