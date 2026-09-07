# Task: Analyze the MIRA Frontend and Build the Location CMS Preview System

You are working inside the MIRA CMS/Dashboard project.

This project already contains a real Location CMS implementation in the dashboard, and it uses a section-based architecture driven by `src/components/pages/Location/config/locationSections.ts`.

Your job is to treat the real MIRA frontend as the source of truth and then align the dashboard Location forms and previews with the actual frontend behavior.

## Critical Rule: Frontend First, Then CMS

Do not start by inventing fields or building a generic schema.

First inspect the real MIRA frontend and understand:

- how Location data is structured
- what sections exist on the real pages
- what each section expects
- which fields are required vs optional
- which values are arrays vs objects vs strings
- which media fields are actually used
- how hero/media logic works in production
- how map/geography is used in real pages
- how cards, sections, galleries, FAQs, guides, and experiences are rendered

The real MIRA frontend is the source of truth.

---

# Phase 1 — Understand the Existing Dashboard Architecture

Before adding or refactoring anything, understand the current implementation shape.

The dashboard already uses:

- `src/components/pages/Location/LocationForm.tsx`
- `src/components/pages/Location/config/locationSections.ts`
- `src/components/pages/Location/sections/*`
- `src/components/pages/Location/shared/*`
- `src/components/pages/Location/locationTypes.ts`

This architecture is already organized by section, and each section has:

- a form component
- a preview component
- registry entry in `locationSectionRegistry`
- ordering in `locationSectionOrder`

Use this structure instead of creating a parallel design.

---

# Phase 2 — Analyze the Real MIRA Frontend

Inspect the MIRA frontend and determine:

- all pages that consume Location data
- all Location-related sections
- all location cards, hero blocks, detail sections, galleries, maps, and guides
- which location data is reused across multiple pages
- which values are required by the frontend and which are optional
- which pieces are CMS-editable vs frontend-only

Trace the actual data flow:

```text
Location data
  ↓
Page
  ↓
Section
  ↓
Component
  ↓
UI
```

Do not assume any field exists unless it is used in the real MIRA frontend implementation.

---

# Phase 3 — Map Frontend Data to CMS Data

Before changing code, build a clear internal mapping between:

```text
Frontend component
  ↓
Frontend data shape
  ↓
Location field / object structure
  ↓
CMS form field
  ↓
CMS preview
```

Identify:

- missing fields
- incorrect fields
- duplicate fields
- unused fields
- required fields missing from the dashboard schema
- previews that are out of sync with the real frontend

Only add fields if the real frontend actually uses them.

---

# Phase 4 — Inspect and Reuse Existing Location Section Components

The dashboard already has sections for many location blocks, including:

- Hero
- Card
- Why Visit
- Info
- Essence
- Statistics
- Climate
- Culture
- Safety
- Geography
- Travel Info
- Experiences
- Practical Information
- FAQ
- Image Gallery
- Local Guide
- Travel Insights
- Video Gallery
- SEO / metadata

Before creating anything new:

1. inspect the existing section form and preview
2. compare it with the real frontend
3. keep or fix what is correct
4. only add new work if the real frontend requires it

The goal is to improve the existing dashboard implementation, not replace it with a new architecture.

---

# Phase 5 — Match the Real Frontend Design

The CMS preview should match the real MIRA frontend as closely as practical.

For each affected section, preserve:

- layout
- spacing
- typography
- responsive behavior
- media treatment
- button styling
- card structure
- visual hierarchy
- interaction pattern

Do not create generic preview blocks when the real frontend already has a specific design.

---

# Phase 6 — Hero Logic Must Follow the Real Frontend

Hero media must be simple and predictable.

The required logic is:

- `Background Image` is the main image field
- `Video` is the video field
- `showVideo` is the toggle/boolean that decides whether the video is used

Behavior:

- if `showVideo === true` and video exists: render the video background
- use the background image as the video poster/thumbnail
- do not add a separate video poster field
- if `showVideo === false` or video is missing: render the background image only
- do not render or load the video when it is disabled

This is the required media model.

---

# Phase 7 — Geography and Map Requirement

The Geography section must use the real interactive map approach from the frontend, not a fake map.

Inspect the real frontend and determine:

- map library/provider
- latitude, longitude, zoom behavior
- markers and popups if applicable
- map configuration and environment usage
- how current location data maps to map state

The geography preview should reflect the current location draft and update live when latitude/longitude/zoom values change.

---

# Phase 8 — Preview System Must Reflect Real Data

Each section preview must display the actual content shape used by the real frontend.

Examples include:

- hero content blocks
- card metadata
- essence content and layout
- statistics values and labels
- climate/culture/safety content blocks
- travel info and practical info formatting
- FAQ accordion structure
- image gallery presentation
- local guide and travel insights blocks
- video gallery behavior

Use the real frontend as the truth source for each section.

---

# Phase 9 — No Guessing

Do not add fields because they “might be useful” or “seem logical.”

Only add or change fields when the real frontend requires them.

Examples of what not to do:

- creating duplicate thumbnail fields
- adding extra media configuration without frontend use
- creating fake map controls that the frontend does not use
- adding new content sections that are not on the real site

If the frontend does not use it, do not add it.

---

# Phase 10 — Preserve Existing System Architecture

Keep the existing dashboard structure intact.

Do not create a separate competing architecture.

Use the current location module structure:

- section config
- section registry
- form components
- preview components
- shared field utilities
- location data types
- merge/default logic

If a change is needed, integrate it into the existing design.

---

# Phase 11 — Validation Requirement

After each task, validate the implementation.

Check:

- TypeScript compile
- lint if available
- runtime behavior in the app
- preview rendering
- draft sync
- data integrity
- section-specific behavior

Fix any errors before moving on.

---

# Phase 12 — Required Task Workflow

This project is large, so work must be incremental.

## 1. Create a TODO file

Create or update a task file such as:

```text
LOCATION_PREVIEW_TODO.md
```

The todo should list the actual section tasks discovered during frontend analysis.

Example:

```md
# MIRA Location Preview Implementation

## Analysis
- [x] Analyze frontend location usage
- [x] Analyze hero behavior
- [x] Analyze geography/map behavior

## Tasks
- [ ] Hero
- [ ] Card
- [ ] Essence
- [ ] Statistics
- [ ] Geography
- [ ] FAQ
- [ ] Gallery
- [ ] Travel Information
- [ ] Experiences
- [ ] Local Guide
- [ ] Travel Insights

## Validation
- [ ] TypeScript
- [ ] Lint
- [ ] Preview verification
```

Update the todo after each section task.

---

## 2. Work one task at a time

Do not implement large batches of sections at once.

Use a loop like:

```text
Task: Hero
  → analyze
  → form update
  → preview update
  → data/type fix
  → run validation
  → fix issues
  → update TODO
  → stop
```

Only after the current task is done and verified should the next task begin.

---

## 3. Stop after the current task is complete

Do not continue automatically to the next section after finishing a task.

Complete the current task, validate it, update the todo, then stop and wait for the next instruction.

---

# Final Development Loop

```text
Analyze section
  ↓
Implement form + preview
  ↓
Connect data/draft
  ↓
Run app/checks
  ↓
Debug + fix
  ↓
Verify
  ↓
Update TODO
  ↓
STOP
```

This is the required mode of work.

---

# Final Output Requirement

The final result should be a Location CMS preview system that is closely aligned with the actual MIRA frontend and works within the existing dashboard architecture.

The focus is to be systematic:

- analyze first
- map real frontend data
- implement one section at a time
- validate thoroughly
- stop after each completed task

Do not guess.
Do not invent extra fields.
Do not build a separate architecture.
Do not skip the incremental task workflow.

Use the real MIRA frontend as the truth source for every decision.