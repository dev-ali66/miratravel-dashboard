# Location Module Refactor — Claude Code Handoff Brief

> Paste this whole file as your first message to Claude Code (in the repo root, with both
> `dashboard/` and `backend/` checked out, or point Claude Code at the correct paths).
> This has already been verified against the actual source (not assumed) in a prior session.
> Do not re-derive the API contract from scratch — start from the facts below, but DO
> re-read the actual files before editing them (paths given below).

## Goal

Refactor the Location module in the MIRA Admin Dashboard (React/TS) into a fully
componentized, section-registry-driven, API-integrated, production-ready CMS module —
per the full original spec (attached separately / see project context), without breaking
the existing working CMS section (`src/components/pages/CMS/**`).

## Repo paths (adjust to actual checkout)

- Frontend: `dashboard/dashboard/src/components/pages/Location/`
- Frontend hooks: `dashboard/dashboard/src/hooks/location/`
- Frontend shared upload: `dashboard/dashboard/src/services/fileUpload.ts`
- Frontend CMS reusable components (reuse, don't duplicate):
  `dashboard/dashboard/src/components/pages/CMS/shared/`
  (`ImageUploader.tsx`, `VideoUploader.tsx`, `ImageListField.tsx`, `GenericItemsField.tsx`,
  `RepeaterList.tsx`, `FormControls.tsx`, `ButtonsField.tsx`, `SaveBar.tsx`)
- Backend: `backend/backend/src/modules/location/`
  (`location.routes.ts`, `location.controller.ts`, `location.service.ts`, `location.validator.ts`)
- Backend shared: `backend/backend/src/shared/getRecords.service.ts`,
  `backend/backend/src/shared/manageRecordWithFiles.service.ts`
- Backend file upload: `backend/backend/src/modules/fileUpload/` (mounted at `/api/v1/file-upload`)
- Prisma model: `backend/backend/prisma/schema/location.prisma`

## Verified backend API contract (confirmed from source, do not assume otherwise)

### `GET /api/v1/locations`
Query params actually read (validator + `getRecords.service.ts` generic filter logic):
- `page`, `limit` — pagination, default limit 10
- `id` — exact match (still returns `data` as an **array**, never a bare object —
  `singleRecordAsArray` defaults true)
- `name` — partial, case-insensitive
- `slug` — exact match
- `type` — exact match against `LocationType` enum; **invalid value throws a plain `Error`**
  (not a structured 400/zod error) from `location.service.ts` — handle this on the frontend
  defensively (generic error toast), and ideally flag to backend team to wrap in `ApiError`.
- `parentId` — exact match
- `search` — backend-side OR search across `name`, `slug`, and `LocationType` enum tokens.
  This is fully server-driven; do not implement client-side filtering on top of it.

Response shape (always):
```json
{
  "success": true,
  "message": "...",
  "code": 200,
  "meta": { "total": 0, "page": 1, "limit": 10, "totalPages": 0 },
  "data": [ /* Location[] */ ]
}
```

### `LocationType` enum (Prisma, exact, do not hardcode differently)
```
CONTINENT, SUBCONTINENT, REGION, COUNTRY, ADMINISTRATIVE_AREA,
CITY, TOWN, VILLAGE, DESTINATION, PLACE, LANDMARK
```

### `POST /api/v1/locations` — used for BOTH create and update
- `manageLocationService` → `manageRecordWithFiles` shared helper.
- Body has `id` → UPDATE; no `id` → CREATE. There is no separate PATCH/PUT route.
- On CREATE, `name` and `type` are required; `slug` is **always server-derived from `name`**
  via a zod `.transform()` (slugify), even if the client sends its own `slug`. If the user
  needs manual slug editing, this is a backend behavior to potentially change — flag it,
  don't silently work around it on the frontend.
- Request body: JSON is fine (existing `useAddLocation` hook already does this correctly —
  reuse it, don't switch to multipart for the main save call).
- **Important gotcha:** although this route also has `uploadFile()` multer middleware
  attached, `manageRecordWithFiles` pushes any uploaded file directly onto a **top-level
  model field** (`updateData[field].push(url)`). The `Location` Prisma model has no
  top-level array fields — `hero image`, `gallery`, `video gallery` etc. all live nested
  inside the `data` JSON column. So uploading files directly through `POST /locations`
  will NOT reach the nested fields correctly. Do not build the image/video upload flow
  through this endpoint.

### Actual file upload flow (separate endpoint, already partially wired on frontend)
- `POST /api/v1/file-upload` (multipart, protected) → returns uploaded URLs grouped by
  field name: `{ success, code, message, data: { [fieldname]: string[] } }`.
- Delete: same endpoint, body `fileRemove: string[]` (JSON-stringified array in a multipart
  field) triggers Cloudinary deletion for matching URLs.
- Frontend already has `dashboard/dashboard/src/services/fileUpload.ts` with
  `uploadFile(file, fieldName): Promise<string>` and `removeFiles(urls: string[])` —
  **reuse these**, they already talk to the correct endpoint. Wire them into
  `ImageUploadField`/`VideoUploadField` per section, writing the returned URL into the
  right nested path in the draft (e.g. `draft.data.hero.background_image`), never
  submitting raw files through `POST /locations`.
- Note: `fileUpload.ts` currently hardcodes `API_URL = "http://localhost:5011/api/v1"`
  and uses a bare `axios` import instead of the shared `apiPrivate` client used everywhere
  else (`lib/api-client.ts`). Fix this to use `apiPrivate` for consistent base URL/auth
  handling across environments — this is a real bug, not intentional.

## Verified current frontend state

- `LocationDraftContext.tsx` (72 lines) — clean, minimal, keep as-is.
- `hooks/location/useGetLocation.ts` (`useGetLocationPages`) — currently calls plain
  `/locations` with **no query params at all**. Needs to accept
  `{ page, limit, search, type, parentId }` and pass them through.
- `hooks/location/useAddLocation.ts` — posts JSON to `/locations`, correctly matches the
  backend contract above. Keep the pattern, just make sure the payload always includes
  `id` when editing.
- `hooks/location/useGetLocationById.ts`, `useGetLocationBySlug.ts` — check these against
  the same `GET /locations?id=...` contract before reusing.
- `components/pages/Location/index.tsx` (325 lines) — currently a bare list + delete
  modal, **no search bar, no type filter, no parent filter, no pagination controls**.
  Needs a full rewrite per the Index page spec (search/filter/pagination/add/edit/loading/
  empty/error states), backend-driven, no client-side filtering.
- `LocationForm.tsx` — **3763 lines**, monolithic, all sections inline.
- `LocationPreview.tsx` — **1864 lines**, monolithic, all sections inline.
- `locationTypes.ts` (231 lines) — already well-typed. The `LocationData["data"]` object
  has these confirmed top-level section keys (do not invent others without checking):
  ```
  name, title, subtitle, description, shortDescription   (treat as an "Overview" section)
  hero, card, why, info, essence, statistics, climate, culture, safety, geography,
  travelInfo, experiences, practical_information, faq_section, imageGalary,
  local_guide, travel_insights, videoGalary
  ```
  That's 18 structured sections + 1 overview group — more than a token example, this is
  the real, complete list. Confirm field-level shape for each against `locationTypes.ts`
  before writing its Form/Preview pair — don't guess field names.
- Sample real API response for one location + its parent is available (a full `Theth`
  place + its `Albanian Riviera` region parent) — use it as reference data if a fixture is
  needed for local testing/Storybook-style checks, but always type against
  `locationTypes.ts`, not the raw sample.

## Target architecture (already agreed, build to this)

```
Location/
├── index.tsx                      → Index/List: search + type filter + parent filter +
│                                     pagination + add + edit action + loading/empty/error
├── LocationEditPage.tsx           → thin wiring, reuse/adjust existing
├── LocationEditorLayout.tsx       → reuse existing layout shell
├── LocationForm.tsx               → THIN shell: loops over `locationSections` config,
│                                     renders `sectionRegistry[key].form`
├── LocationPreview.tsx            → THIN shell: same loop, renders
│                                     `sectionRegistry[key].preview`
├── locationTypes.ts               → reuse, extend only if a real gap is found
├── config/
│   └── locationSections.ts        → SINGLE SOURCE OF TRUTH: ordered section key array +
│                                     `sectionRegistry` mapping key → {form, preview}
│                                     components. Form and Preview both read this — no
│                                     separate order arrays anywhere else.
├── shared/
│   ├── LocationDraftContext.tsx   → unchanged
│   ├── emptyLocation.ts           → default/empty draft covering all 18 sections
│   ├── mergeWithDefaults.ts       → deep-merge API data over emptyLocation so partial/
│   │                                 malformed records never crash the form/preview
│   └── ParentLocationSelect.tsx   → searchable dropdown: debounced
│                                     `GET /locations?search=...` (and/or `type=` filter
│                                     for narrowing to plausible parent types), displays
│                                     `name`, stores `id` in draft.parentId; in edit mode,
│                                     resolves and displays the existing parent's name from
│                                     `location.parent` (already included via `include:
│                                     { parent: true }` on the backend GET) rather than an
│                                     extra fetch when available.
└── sections/
    └── <section-key>/
        ├── <Section>Form.tsx
        └── <Section>Preview.tsx
```

Section grouping guidance (avoid over-fragmenting trivial sections):
- Simple text/single-object sections (`why`, `info`, `essence`, `statistics`, `climate`,
  `culture`, `safety`, `geography`, `travelInfo`, `card`) can each be a small dedicated
  pair, or grouped 2–3 per file if truly trivial — use judgment, but keep the section
  **registry keys** granular enough to match the `locationSections.ts` order even if some
  share an implementation file.
- Array/repeater sections (`experiences.cards`, `faq_section.questions`,
  `practical_information.accordion_items`, `local_guide.articles`,
  `travel_insights.articles`) — reuse `CMS/shared/GenericItemsField.tsx` /
  `RepeaterList.tsx`, don't hand-roll new add/remove/reorder logic.
- Media sections (`hero.background_image`, `card.background_image`, `imageGalary`,
  `videoGalary`) — reuse `CMS/shared/ImageUploader.tsx` / `ImageListField.tsx` /
  `VideoUploader.tsx`, wired to the fixed `services/fileUpload.ts`.

## Implementation order (do in this order, verify each step compiles/works before next)

1. Fix `services/fileUpload.ts` to use `apiPrivate` instead of hardcoded axios/localhost.
2. Build `shared/emptyLocation.ts` + `shared/mergeWithDefaults.ts`.
3. Build `config/locationSections.ts` (registry + order), initially with placeholder
   components so the app still compiles.
4. Rewrite `hooks/location/useGetLocation.ts` to accept and forward
   `{ page, limit, search, type, parentId }`.
5. Rewrite `index.tsx`: search input (debounced), type dropdown, parent dropdown
   (`ParentLocationSelect`), pagination, add/edit actions, loading/empty/error states.
6. Build `shared/ParentLocationSelect.tsx`.
7. Migrate sections one at a time out of the current `LocationForm.tsx` /
   `LocationPreview.tsx` into `sections/<key>/`, wiring each into the registry and
   deleting the corresponding inline block from the two shell files as you go — start
   with `hero` as the reference pattern (it's the best-covered by the sample data), then
   the rest.
8. Once all 18 section keys are migrated, `LocationForm.tsx` and `LocationPreview.tsx`
   should be thin loops only — delete any leftover inline JSX.
9. Confirm Add flow (no id → `emptyLocation` → clean draft) and Edit flow (id → fetch →
   `mergeWithDefaults` → draft) both go through the same `LocationForm`.
10. Do not touch anything under `components/pages/CMS/**` except to import from
    `CMS/shared/` — that section must keep working exactly as before.

## Non-negotiables from the original product spec

- Add and Edit use the exact same `LocationForm` component.
- Form and Preview must always share one section order (`config/locationSections.ts`),
  never two separate arrays.
- No hardcoded location names or hardcoded enum values anywhere in the frontend — type
  dropdown values must match the verified `LocationType` list above; parent options must
  come from the real API, never a static list.
- No raw JSON editor for the structured sections; only the flexible/future-fields area (if
  you build one) should be a generic key/value editor, and even that should be optional
  scope, not required for v1 — prioritize the 18 known sections first.
- Don't duplicate any `CMS/shared/*` component — extend/reuse.
