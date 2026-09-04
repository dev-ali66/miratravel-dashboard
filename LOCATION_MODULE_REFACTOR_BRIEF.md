# Location Module Refactor — Verified Repo Status (Updated)

This document reflects the actual code currently present in the workspace as of September 4, 2026, not a hypothetical target state.

## Goal

Refactor the location feature into a modular, section-driven CMS without breaking the working CMS area under `src/components/pages/CMS/**`.

## Verified current status

The repo already contains a large portion of the intended architecture.

### Already implemented in the frontend

- `src/components/pages/Location/config/locationSections.ts`
  - Exists as the single source of truth for section ordering and mapping.
  - `locationSectionOrder` and `locationSectionRegistry` are both present.
  - `LocationForm.tsx` and `LocationPreview.tsx` both consume this registry.

- `src/components/pages/Location/shared/emptyLocation.ts`
  - Exists and provides the default empty draft skeleton.

- `src/components/pages/Location/shared/mergeWithDefaults.ts`
  - Exists and deep-merges partial API data with defaults so incomplete records do not crash the UI.

- `src/components/pages/Location/shared/ParentLocationSelect.tsx`
  - Exists and is API-driven via `GET /locations?search=...`.
  - Uses `currentName` from `draft.parent` in edit mode instead of forcing an extra fetch when available.

- `src/components/pages/Location/LocationForm.tsx`
  - Already works as a thin shell: it determines add/edit mode, loads data, normalizes merge, and loops over `locationSectionOrder`.

- `src/components/pages/Location/LocationPreview.tsx`
  - Already works as a thin shell and follows the same ordering as the form.

- `src/components/pages/Location/index.tsx`
  - Already includes search + type filter + parent filter + pagination + add/edit actions + empty/error/loading states.

- `src/hooks/location/useGetLocation.ts`
  - Already accepts and forwards `page`, `limit`, `search`, `type`, and `parentId`.

- `src/hooks/location/useLocationPage.ts`
  - Already handles edit-mode load, field updates, and save flow for both create and update.

- `src/hooks/location/useAddLocation.ts`
  - Already posts JSON to `/locations` and includes `id` for updates.

- `src/services/fileUpload.ts`
  - Already uses the shared `apiPrivate` client and talks to `/file-upload`.

## Verified API contract

The backend contract used by the frontend matches the earlier handoff brief:

- `GET /api/v1/locations` supports pagination and server-side filtering.
- `id` is used for exact lookup and still returns an array under `data`.
- `search` is server-driven.
- `type` is strict and must match the Prisma enum values.
- `POST /api/v1/locations` is used for both create and update.
- Media uploads must go through `/api/v1/file-upload`, not through the main location save route.

## Verified data model

The canonical location schema in `src/components/pages/Location/locationTypes.ts` is already the source of truth. It contains the supported structured section keys and nested payload shapes used by the current editor and preview.

## Build and lint verification

### Build

- `npm run build` : passes successfully.

### Lint

- `npm run lint` : currently fails with a large number of existing repo-wide lint errors.
- These are not isolated to the location module; they include many `@typescript-eslint/no-explicit-any`, effect-driven state resets, and other legacy patterns across the dashboard.

## Current implementation assessment

The location module is already advanced and largely matches the intended refactor direction:

- modular registry structure is in place
- add/edit logic is centralized
- preview/form order is synchronized
- draft defaults are in place
- server-side filters are wired
- media upload path is separated correctly

## What remains to be cleaned up

The remaining work is not a full rewrite — it is mainly cleanup and consistency work:

1. Continue aligning all location sections to the exact backend schema if more edge cases appear.
2. Remove repo-wide lint violations if the team wants a strict clean ESLint pass.
3. Consider standardizing any remaining legacy `any` usages and effect-driven state updates.
4. Keep the location section registry as the single source of truth for all future form/preview changes.

## Final verdict

The repo is already much further along than the original brief suggested. The architecture is largely implemented and the code is consistent with the refactor plan. The major outstanding issue is not missing core architecture, but existing lint debt across the rest of the project.
