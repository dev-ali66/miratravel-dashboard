# CMS HomeForm / HomePreview Refactor — Safe Incremental Migration

We need to refactor the existing CMS Home page code by splitting the monolithic `HomeForm.tsx` and `HomePreview.tsx` into reusable section-based form and preview components.

## PRIMARY GOAL

Refactor the code structure **WITHOUT changing the existing UI, layout, styling, content structure, data structure, or behavior**.

The final rendered Home page must look and behave exactly the same as before.

This is a **code organization/refactoring task only**, NOT a UI redesign.

---

# VERY IMPORTANT — DO NOT MIGRATE EVERYTHING AT ONCE

You MUST work **one section at a time**.

Do NOT extract all sections in one pass.

The required workflow is:

1. Pick ONE section.
2. Inspect the existing implementation in `HomeForm.tsx` and `HomePreview.tsx`.
3. Create its shared form/preview components.
4. Copy the EXISTING JSX and logic into those components.
5. Replace only that section in the monolithic files with the new component.
6. Fix imports/types/props.
7. Check that the section still behaves exactly as before.
8. Run TypeScript/build checks if available.
9. ONLY after the current section is successfully migrated, move to the next section.

If a section is not successfully migrated, STOP and fix it before touching another section.

Do not make unrelated improvements while migrating a section.

---

# EXISTING ARCHITECTURE

Keep these files as the page-level shells:

```text
src/components/pages/CMS/Home/HomeForm.tsx
src/components/pages/CMS/Home/HomePreview.tsx
```

Create/use:

```text
src/components/pages/CMS/Home/shared/form/
src/components/pages/CMS/Home/shared/preview/
```

Each Home section should eventually have:

```text
shared/
├── form/
│   ├── HeroForm.tsx
│   ├── ExploreJourneysForm.tsx
│   ├── DestinationsForm.tsx
│   ├── MiraStoriesForm.tsx
│   ├── WhyMiraForm.tsx
│   ├── TravelInsightsForm.tsx
│   └── CustomJourneyCTAForm.tsx
│
└── preview/
    ├── HeroPreview.tsx
    ├── ExploreJourneysPreview.tsx
    ├── DestinationsPreview.tsx
    ├── MiraStoriesPreview.tsx
    ├── WhyMiraPreview.tsx
    ├── TravelInsightsPreview.tsx
    └── CustomJourneyCTAPreview.tsx
```

Use naming that matches the existing project conventions if equivalent names already exist.

---

# MIGRATION ORDER

1. Hero — migrated
2. Explore journeys — migrated
3. Destinations — migrated
4. Mira stories — migrated
5. Why Mira — migrated
6. Travel insights — migrated
7. Custom journey CTA — migrated

---

# CURRENT STATUS

All Home CMS sections have been migrated into the shared section-based structure.

Current state:

* `HomeForm.tsx` remains the shell for CMS editing
* `HomePreview.tsx` remains the shell for preview rendering
* shared section form/preview components exist under `src/components/pages/CMS/Home/shared/`
* section order is controlled centrally via `src/components/pages/CMS/Home/config/homeSections.ts`
* no duplicate legacy inline section JSX remains for the migrated sections

---

# VALIDATION / CLEANUP

Run the final checks to confirm the refactor remains safe:

* confirm there are no duplicate legacy section blocks left in the shell files
* confirm section ordering remains exactly the same as before
* confirm shell files are minimal and only orchestrate section rendering
* confirm no unrelated files or data structures were changed
* confirm TypeScript/build checks pass

---

# DONE

The Home section refactor is complete.

No further section migration should be performed unless a real bug is discovered during validation.
