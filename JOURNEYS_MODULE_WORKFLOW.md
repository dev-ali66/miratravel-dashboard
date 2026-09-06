# Journeys Module Implementation & Tracking Workflow

> **Mission**: Build the complete, production-ready MIRA Journeys Management Engine in the Admin Dashboard.
> The layout, design flow, and typography must match the public `frontend/` (Karena Serif, Sansation, MIRA color tokens, 5 interactive tabs) 1-to-1, backed by the real `backend/` Prisma schema and REST APIs (`/api/v1/journeys`, `/journey-itinerary`, etc.).

---

## 1. Progress Checklist

- [ ] **Phase 1: Architecture & API Hooks**
  - [ ] Inspect existing backend endpoints and response shapes
  - [ ] Define `journeyTypes.ts` matching Prisma schema + `data` JSON extensions
  - [ ] Implement `useGetJourneys.ts`
  - [ ] Implement `useGetJourneyById.ts`
  - [ ] Implement `useSaveJourney.ts` (with payload normalization & cache invalidation)
  - [ ] Implement `useDeleteJourney.ts`
  - [ ] Implement draft state provider (`JourneyDraftContext.tsx`) and empty skeleton (`emptyJourney.ts`)
  - [ ] Prepare authentic sample journey data (`classicAlbaniaSampleJourney.ts`)

- [ ] **Phase 2: Navigation & Routes**
  - [ ] Register `/journeys`, `/journeys/new`, `/journeys/:id/:slug` in `App.tsx`
  - [ ] Add `Journeys` to `Sidebar.tsx` and `RootLayout.tsx` with `Compass` icon

- [ ] **Phase 3: Journeys List Page (`/journeys`)**
  - [ ] Header with title, subtitle, and "Add Journey" button
  - [ ] Filter bar: Search input, Status filter (`ALL`, `PUBLISHED`, `DRAFT`, `ARCHIVED`), Journey Type filter
  - [ ] Card Grid displaying:
    - Hero thumbnail (via `UniversalMultimediaPreview`)
    - Duration badge (`X DAYS`), Price (`From €...`), Featured star
    - Title, Subtitle, Tags chips (`PRIVATE`, `NATURE`, etc.)
    - Status badge (`PUBLISHED`, `DRAFT`, `ARCHIVED`)
    - Edit button and Delete button with confirmation modal
  - [ ] Pagination controls

- [ ] **Phase 4: Split-Screen Editor & Live Preview Shell**
  - [ ] `JourneyEditorLayout.tsx`: Top header with Back, Title, Status badge, Save/Publish button
  - [ ] 30% Left Editor Panel / 70% Right Live Preview with `<ScaledWorkspace>`
  - [ ] Modular Form Sections (`FormSection`):
    - [ ] `BasicInfoForm` (Title, Subtitle, Price, Currency, Min/Max Days, Pace, Comfort, Status, Featured)
    - [ ] `HeroForm` (Hero background media via `UniversalMultimediaForm`, tags, highlightBadge, priceSuffix, benefits)
    - [ ] `TagsAttributesForm` (Journey Type, Travel Style, Perfect For chips)
    - [ ] `WhyDesignedForm` (Why we designed this journey, Is this for you checklist)
    - [ ] `HighlightsInclusionsForm` (Highlights list, Included list, Not Included list, Important Notes)
    - [ ] `ItineraryForm` (Day-by-Day repeater: dayNumber, title, locationId picker, route description, photos)
    - [ ] `AccommodationForm` (Lodging philosophy, Destination stays repeater)
    - [ ] `AddonsForm` (Optional add-on items, title, price, description, images)
    - [ ] `GalleryForm` (Secondary photo gallery)
    - [ ] `SeoForm` (Title, Description, Keywords, Canonical)

- [ ] **Phase 5: Public-Fidelity Live Preview**
  - [ ] `JourneyPreview.tsx` container matching frontend styling tokens (`#F9F9F9`, `#080c1d`, `#af6348`, `#235347`)
  - [ ] `OverviewHeroPreview.tsx` (Hero banner with real typography, floating price card, contact prompt)
  - [ ] `JourneyTabsPreview.tsx` (Interactive sticky tabs: Overview, Itinerary, Where You Stay, Inclusions, Add-ons)
  - [ ] `OverviewContentPreview.tsx` (Why We Designed, Highlights grid, Route overview, Is this for you)
  - [ ] `ItineraryContentPreview.tsx` (Day-by-day numbered route with photos and narrative)
  - [ ] `AccommodationContentPreview.tsx` (Lodging standards and daily stay cards)
  - [ ] `WhatsIncludedPreview.tsx` (Included checkmarks vs Not Included dashes)
  - [ ] `AddonsPreview.tsx` (Add-on activity cards with pricing)

- [ ] **Phase 6: Quality Assurance & Build Verification**
  - [ ] Verify `npm run build` succeeds with 0 TypeScript/bundler errors
  - [ ] Format code with `npm run format`
  - [ ] Test save, edit, template loading, and delete operations
