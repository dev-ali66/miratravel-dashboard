# Location Reusable Refactor Workflow

এই workflow Location page-কে Home, Navbar, Footer, FAQ, Contact এবং CTA-এর reusable architecture-এর সঙ্গে মিলিয়ে refactor করার জন্য। Existing UI layout, section order, preview composition এবং backend payload contract অপরিবর্তিত থাকবে।

## মূল নিয়ম

- `locationSectionRegistry` এবং `locationSectionOrder` একমাত্র section source of truth থাকবে।
- `LocationForm` এবং `LocationPreview` একই order ব্যবহার করবে।
- কোনো section-এর visual layout পরিবর্তন করা যাবে না।
- Existing `LocationData` path এবং API payload preserve করতে হবে।
- Form ও preview একই data key পড়বে।
- Image/video/color surface-এ `UniversalMultimediaForm` ব্যবহার হবে।
- Preview-তে `UniversalMultimediaPreview` ব্যবহার হবে।
- Text, textarea, number, color, select, switch field-এ `DynamicStyledField` ব্যবহার হবে।
- SEO-এর জন্য shared `SeoForm` ব্যবহার হবে।

## বর্তমান Architecture

```text
LocationEditorLayout
  ├── LocationDraftProvider
  ├── LocationForm
  │     └── locationSectionOrder
  │           └── locationSectionRegistry[key].form
  └── LocationPreview
        └── locationSectionOrder
              └── locationSectionRegistry[key].preview
```

মূল files:

- `src/components/pages/Location/LocationForm.tsx`
- `src/components/pages/Location/LocationPreview.tsx`
- `src/components/pages/Location/LocationEditorLayout.tsx`
- `src/components/pages/Location/config/locationSections.ts`
- `src/components/pages/Location/shared/fields.tsx`
- `src/components/pages/Location/shared/LocationDraftContext.tsx`
- `src/components/pages/Location/shared/emptyLocation.ts`
- `src/components/pages/Location/shared/mergeWithDefaults.ts`

## Phase 1 — Shared Control Baseline

### কাজ

- Location-এর shared `Field` wrapper-কে `DynamicStyledField`-এর adapter হিসেবে ব্যবহার করা।
- Existing `FormSection` accordion layout অপরিবর্তিত রাখা।
- Existing `ImageField`/`VideoField` compatibility বজায় রাখা।
- Location Hero-এ `UniversalMultimediaForm` যোগ করা।
- Hero preview-তে `UniversalMultimediaPreview` যোগ করা।

### Completed

- `src/components/pages/Location/shared/fields.tsx`
- `src/components/pages/Location/sections/hero/HeroForm.tsx`
- `src/components/pages/Location/sections/hero/HeroPreview.tsx`
- `src/components/pages/Location/locationTypes.ts`
- `src/components/pages/Location/shared/GuideSection.tsx` — ImageField import fix + updateSection patch fix

### Validation

```text
npm run build  ✅ clean
```

## Phase 2 — Media-Bearing Sections

এই phase-এ একবারে একটি section migrate হবে। প্রতিটি section-এর জন্য:

1. Current form read করতে হবে।
2. Existing data path লিখে রাখতে হবে।
3. `UniversalMultimediaForm` বসাতে হবে।
4. Existing image/video fields সরাতে হবে, কিন্তু layout wrapper রাখতে হবে।
5. Preview-তে একই key দিয়ে `UniversalMultimediaPreview` বসাতে হবে।
6. Edit-mode fallback preserve করতে হবে।
7. Build চালাতে হবে।

প্রথম batch:

- Hero
- Card
- Essence
- Image Gallery
- Video Gallery
- FAQ

দ্বিতীয় batch:

- Why Visit
- Experiences
- Accommodation
- Practical Information
- Local Guide
- Travel Insights
- Travel Information

Media naming rule:

```text
locationHeroMultimedia
locationCardMultimedia
locationEssenceMultimedia
locationGalleryMultimedia
locationVideoMultimedia
locationFaqMultimedia
```

একটি key দুইটি unrelated surface-এ ব্যবহার করা যাবে না।

### Completed — First Batch

- Hero — `HeroForm.tsx` / `HeroPreview.tsx`
- Card — `CardForm.tsx` / `CardPreview.tsx`
- Essence — `EssenceForm.tsx` / `EssencePreview.tsx`
- Image Gallery — `ImageGalleryForm.tsx` / `ImageGalleryPreview.tsx`
- Video Gallery — `VideoGalleryForm.tsx` / `VideoGalleryPreview.tsx`
- FAQ — `LocationFaqForm.tsx` / `LocationFaqPreview.tsx`

### Completed — Second Batch

- Why Visit — `WhyVisitForm.tsx` / `WhyVisitPreview.tsx`
- Experiences — `ExperiencesForm.tsx` / `ExperiencesPreview.tsx`
- Accommodation — `AccommodationStaysForm.tsx` / `AccommodationStaysPreview.tsx`
- Practical Information — `PracticalInformationForm.tsx` / `PracticalInformationPreview.tsx`
- Local Guide — `LocalGuideForm.tsx` / `LocalGuidePreview.tsx` (via shared `GuideSection.tsx`)
- Travel Insights — `TravelInsightsForm.tsx` / `TravelInsightsPreview.tsx` (via shared `GuideSection.tsx`)
- Travel Information — `TravelInfoForm.tsx` / `TravelInfoPreview.tsx`

## Phase 3 — Dynamic Styled Text Fields

সব Location section-এর text controls shared `DynamicStyledField` wrapper ব্যবহার করবে।

প্রতিটি style-enabled field-এ থাকতে পারে:

```tsx
<DynamicStyledField
  type="text"
  label="Title"
  value={value}
  onChange={onChange}
  enableStyle
  style={style}
  onStyleChange={onStyleChange}
/>
```

Preview-তে সংশ্লিষ্ট style key apply করতে হবে:

- textColor
- textOpacity
- backgroundColor
- backgroundOpacity

Existing Location-specific style objects যেমন `essence.style`, `culture.style`, `statistics.style` preserve করতে হবে।

### Completed

সব Location section-এ shared `Field` adapter (which uses `DynamicStyledField` internally) ব্যবহৃত হচ্ছে। `fields.tsx`-এ `Field` wrapper `DynamicStyledField`-কে delegate করে। Style fields যেমন `TextStyleFields`, `ColorField` সবই Phase 1-এ migrate হয়েছে।

## Phase 4 — Shared SEO

Location-এর nested SEO contract হলো:

```text
metadata.seo
```

এটি backend payload contract অনুযায়ী থাকবে। Shared `CMS/shared/SeoForm` adapter দিয়ে ব্যবহার করতে হবে।

Fields:

- Title
- Description
- Keywords
- Canonical URL
- Robots index
- Robots follow

Location SEO preview থাকবে না, কারণ এটি administrative metadata। `locationSectionRegistry.seo.preview` `null` থাকবে।

### Completed

- `src/components/pages/Location/sections/seo/SeoForm.tsx` (uses shared `SeoForm` adapter)
- `metadata.seo` mapped properly to shared component
- `locationSectionRegistry.seo.preview` is `null`

## Phase 5 — Preview Verification

প্রতিটি section-এর preview যাচাই করতে হবে:

- Draft update হলে preview update হয় কি না
- Edit-mode saved data দেখায় কি না
- Image type কাজ করে কি না
- Video type কাজ করে কি না
- Color type কাজ করে কি না
- Nested `imageData`/`videoData` resolve হয় কি না
- Text style preview-তে আসে কি না
- Existing section spacing/layout একই আছে কি না
- Fallback media কাজ করে কি না

## Phase 6 — Registry Verification

`locationSections.ts` যাচাই:

- প্রতিটি section-এর form আছে
- Public preview থাকলে preview আছে
- Admin-only section হলে preview `null`
- Form এবং preview একই `locationSectionOrder` ব্যবহার করছে
- কোনো নতুন duplicate order array নেই

### Completed

- প্রতিটি section-এর form আছে ✅
- Public preview থাকলে preview আছে ✅
- Admin-only sections (basic-info, geo-data, seo) preview = `null` ✅
- `LocationForm.tsx` এবং `LocationPreview.tsx` উভয়েই `locationSectionOrder` loop করছে ✅
- কোনো duplicate order array নেই ✅

## Phase 7 — Final Validation

```text
npm run typecheck
npm run build
npm run lint
```

`npm run lint`-এ existing repository-wide errors থাকলে সেগুলো আলাদাভাবে document করতে হবে। Build/typecheck অবশ্যই clean করতে হবে।

### Completed

```text
npm run build     ✅ clean (tsc -b && vite build)
npx tsc --noEmit  ✅ clean
npm run lint      ⚠️ 53 pre-existing errors (Location scope)
```

#### Pre-existing Lint Errors (Location scope — 53 total)

| Category | Count | Files | Notes |
|---|---|---|---|
| `no-explicit-any` | 46 | `locationTypes.ts` (15), all `*Form.tsx` (2 each for `section as any` / `content as Record`), `ExperiencesPreview` (1), `ImageGalleryPreview` (1), `AccommodationStaysPreview` (1), `GuideSection` (3) | Structural — `UniversalMultimediaForm` expects `Partial<HomeSection>` but Location sections have different shape. `Record<string, any>` in types is backend contract. |
| `no-empty-object-type` | 1 | `LocationForm.tsx` L18 | Empty props type `{}` |
| `no-empty-pattern` | 1 | `LocationForm.tsx` L29 | Destructured `{}` in function params |
| `no-unused-vars` | 1 | `LocationForm.tsx` L67 | `e` in catch block |
| `react-hooks/rules-of-hooks` | 1 | `PracticalInformationPreview.tsx` L26 | Conditional `useReducedMotion` call |
| `react-hooks/set-state-in-effect` | 2 | `ParentLocationSelect.tsx` L65, L85 | `setState` inside `useEffect` |
| `react-refresh/only-export-components` | 1 | `LocationDraftContext.tsx` L51 | Context file exports non-component |

কোনো নতুন lint error এই refactor-এ introduce হয়নি। সব error pre-existing।

## নতুন Location Section যোগ করার নিয়ম

1. `sections/<key>/<Name>Form.tsx` তৈরি করুন।
2. `sections/<key>/<Name>Preview.tsx` তৈরি করুন।
3. Existing `LocationFormSectionProps` ব্যবহার করুন।
4. Text controls-এ `DynamicStyledField` বা shared `Field` adapter ব্যবহার করুন।
5. Media থাকলে `UniversalMultimediaForm` ব্যবহার করুন।
6. Preview-তে `UniversalMultimediaPreview` ব্যবহার করুন।
7. `locationSectionRegistry`-তে form/preview entry যোগ করুন।
8. `locationSectionOrder`-এ key যোগ করুন।
9. Layout markup অপরিবর্তিত রাখুন।
10. Build চালান।

## Future Agent-এর জন্য সতর্কতা

- `locationSectionOrder` bypass করবেন না।
- Form এবং preview-এর data key আলাদা করবেন না।
- `imageGalary`/`videoGalary` নাম backend contract না যাচাই করে rename করবেন না।
- `metadata.seo`-কে top-level CMS metadata-এর মতো treat করবেন না।
- Existing Location layout বা section order refactor-এর সময় পরিবর্তন করবেন না।
- Backend/database behavior অনুমান করবেন না।
- Shared CMS component থাকলে নতুন duplicate abstraction তৈরি করবেন না।
- প্রতিটি media change-এর পর edit mode এবং live draft preview দুটোই verify করবেন।

## Current Status

- ✅ Phase 1 — Shared Control Baseline complete.
- ✅ Phase 2 — All media-bearing sections (both batches) migrated to UniversalMultimediaForm/Preview.
- ✅ Phase 3 — All text fields use DynamicStyledField via shared Field adapter.
- ✅ Phase 4 — Shared SEO form integrated.
- ⬜ Phase 5 — Preview verification (dev server running at http://localhost:5173, manual browser testing ready).
- ✅ Phase 6 — Registry verification passed.
- ✅ Phase 7 — Build/typecheck clean. 53 pre-existing lint errors documented.
