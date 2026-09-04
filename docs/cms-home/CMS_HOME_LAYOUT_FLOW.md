# CMS Home Layout Flow

## Goal
Show how Home CMS layout is built from shared data and section-specific rendering.

## Flow
1. Load Home page data.
2. Read shared theme values.
3. Read each section object.
4. Send the section into its matching form component.
5. Send the same section into its matching preview component.
6. Keep the layout stable while the content changes.

## Layout blocks
- Hero
- Explore Journeys
- Destinations
- Mira Stories
- Why Mira
- Travel Insights
- Custom Journey CTA

## Rule
Keep section layout stable and only change the content/data path needed for that section.
