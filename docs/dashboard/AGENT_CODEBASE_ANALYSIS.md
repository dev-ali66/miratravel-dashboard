# MIRA Dashboard — Full Codebase Analysis

This document is the consolidated project-level analysis of the frontend dashboard in this repo. It is based on the actual files currently in the workspace and is intended as a handoff/reference for an AI coding agent.

## 1. Project summary

This is a React + TypeScript + Vite admin dashboard for MIRA. The app is organized around a protected admin experience with:

- Dashboard home
- User management
- Requests management
- CMS editing
- Location CMS/editor/preview system
- Authentication flow
- Privacy / Terms pages

The project uses:

- React 19
- TypeScript
- Vite
- React Router
- TanStack React Query
- Tailwind CSS
- shadcn-style UI primitives
- Framer Motion
- Sonner toast notifications
- maplibre-gl
- Axios with centralized API client

## 2. Main app structure

Key source directories:

- `src/App.tsx` — route setup
- `src/main.tsx` — app bootstrap, providers
- `src/components/layout/RootLayout.tsx` — authenticated app shell
- `src/lib/api-client.ts` — shared API configuration
- `src/hooks/*` — React Query hooks
- `src/components/pages/*` — feature pages
- `src/components/ui/*` — shared UI primitives

## 3. Application bootstrap and global shell

### `src/main.tsx`

The app bootstraps with:

- `StrictMode`
- `ErrorBoundary`
- `ThemeProvider`
- `QueryClientProvider`
- `BrowserRouter`
- `App`
- `Toaster`

This means all page features share the same global context for API data, router, and toast UX.

### `src/App.tsx`

Routing is split into:

- Public routes
  - `/login`
- Protected routes
  - `/` -> `RootLayout`
  - `/user`
  - `/requests`
  - `/privacy-policy`
  - `/terms-of-service`
  - `/cms`
  - `/location`
  - `/journeys`
- CMS editor route
  - `/cms/:slug`
- Journey editor route
  - `/journeys/new`
  - `/journeys/:id/:slug`
- Location editor route
  - `/locations/new`
  - `/locations/:id/:slug`
- 404 fallback

The app enforces auth via `PrivateRoute` and `PublicRoute` wrappers.

### `src/components/layout/RootLayout.tsx`

This is the authenticated layout shell. It renders a left sidebar and the main content outlet.

Sidebar sections include:

- Dashboard
- User
- Requests
- CMS
- Locations
- Journeys
- Privacy Policy
- Terms of Service
- Logout

## 4. API layer and auth handling

### `src/lib/api-client.ts`

The API client centralizes request configuration:

- `apiPublic` for unauthenticated requests
- `apiPrivate` for authenticated requests
- `withCredentials: true`
- JSON headers
- automatic token injection from `localStorage.getItem("accessToken")`
- global error toast via `sonner`
- automatic `localStorage.removeItem("accessToken")` on 401, plus `unauthorized` event dispatch

This is the main single point for consistent auth + error handling across the app.

### `src/lib/api-error.ts`

This file likely contains helpers for translating API errors into user-friendly messages. The app uses it in mutation hooks like location saving and other feature hooks.

## 5. Feature architecture by module

## 5.1 Auth module

Path: `src/components/pages/Auth/`, `src/hooks/auth/`

Implemented patterns:

- `useLogin.ts`
- `useMe.ts`
- `PrivateRoute.tsx`
- `PublicRoute.tsx`
- `SignIn` page

Behavior:

- Public route blocks logged-in users
- Private route blocks unauthenticated access
- `useMe` is likely used to resolve current user info
- login flow stores access token and redirects appropriately

## 5.2 Home module

Path: `src/components/pages/Home/`

This module is a dashboard landing page with likely analytics cards and summaries. The app calls into analytics hooks in:

- `src/hooks/analysis/useGetDashboardStatistics.ts`

This suggests the dashboard uses server metrics and summary widgets.

## 5.3 CMS module

Path: `src/components/pages/CMS/`, `src/hooks/cms/`

Core files:

- `src/components/pages/CMS/index.tsx`
- `src/components/pages/CMS/PageSections.tsx`
- `src/hooks/cms/useGetPages.ts`
- `src/hooks/cms/useCreatePage.ts`
- `src/hooks/cms/useGetPageSectionBySlug.ts`
- `src/hooks/cms/useSavePageSection.ts`
- `src/hooks/cms/useDeletePage.ts`
- `src/hooks/cms/useImageUpload.ts`
- `src/hooks/cms/useVideoUpload.ts`

Pattern:

- list CMS pages
- open each page editor by slug/id
- save section content through dedicated hooks
- image/video upload via upload hooks
- generic page section editing with reusable CMS shared components

The module is designed around an existing content management pattern and is intentionally meant to remain stable while the location system is refactored.

## 5.4 User management

Path: `src/components/pages/UserList/`, `src/hooks/users/`, `src/hooks/role/`, `src/hooks/permission/`

This part of the app is likely multi-role / permission-based admin management:

- list users
- permission inspection
- role hooks
- user role actions

The project has a clear separation between route-level UI and data-layer hooks, which is consistent with a typical admin dashboard.

## 5.5 Requests module

Path: `src/components/pages/Requests/`, `src/hooks/requests/`

This module is structured for request inbox/management. It is likely built as a list/detail or table-driven admin flow using TanStack Query.

## 5.6 Privacy / Terms pages

Paths:

- `src/components/pages/PrivacyPolicy/`
- `src/components/pages/TermsOfService/`

These are simple route-level content pages and not complex dashboards.

## 5.7 Location module

This is the most advanced and most important feature in the repo.

### High-level structure

`src/components/pages/Location/`

Key files:

- `index.tsx` — location list page
- `LocationForm.tsx` — editor shell for add/edit forms
- `LocationPreview.tsx` — preview shell for live draft preview
- `LocationEditorLayout.tsx` — split editor/preview layout
- `LocationEditPage.tsx` — thin editor wrapper
- `locationTypes.ts` — all strongly typed location schema definitions
- `config/locationSections.ts` — registry and order for sections
- `shared/LocationDraftContext.tsx` — draft state provider
- `sections/*` — per-section form + preview components

### Registry-driven section architecture

The current location module is built around a single source of truth:

- `locationSectionOrder`
- `locationSectionRegistry`

Both `LocationForm.tsx` and `LocationPreview.tsx` iterate over the same registry/ordered list. This ensures:

- one order for editor and preview
- no duplicated section ordering logic
- much easier maintenance and extension

This matches the intended refactor pattern described in the brief.

### Draft flow

Draft state is managed with `LocationDraftContext`:

- `draft`
- `setDraft`
- `resetDraft`

This allows the form and preview to stay in sync while editing a location.

### `LocationForm.tsx`

This component does not contain all section details inline. It behaves as a thin shell:

- reads route params (`id`, `slug`)
- determines edit vs create mode
- loads existing record when editing
- merges API data with defaults via `mergeWithDefaults`
- walks `locationSectionOrder`
- renders each section form from `locationSectionRegistry`

This is a production-ready modular pattern.

### `LocationPreview.tsx`

The preview shell similarly loops over the same registry and renders the matching section preview component. The preview is presented inside `LocationEditorLayout` in a 30/70 editor-preview split.

### Section registry keys and content model

The key section types are:

- `basic-info`
- `hero`
- `info`
- `why`
- `experiences`
- `geo-data`
- `shared-info`
- `accommodation`
- `travel-insights`
- `practical-information`
- `essence`
- `statistics`
- `region-glance`
- `region-character`
- `travel-info`
- `faq`
- `culture`
- `card`
- `climate`
- `safety`
- `geography`
- `image-gallery`
- `local-guide`
- `video-gallery`
- `seo`

This matches the conceptual model of a structured location CMS with many nested sections.

### `locationTypes.ts`

This file is the critical contract for the location data model. It defines:

- `LocationType` enum-like const values
- `LocationData`
- nested structure for:
  - overview fields
  - hero
  - card
  - why visit
  - info
  - essence
  - statistics
  - climate
  - culture
  - safety
  - geography
  - travel info
  - experiences
  - practical info
  - FAQ
  - gallery
  - local guide
  - travel insights
  - video gallery

This is the canonical type for the location CMS and should be treated as source-of-truth for any feature work.

### Data fetching and save hooks

Files:

- `src/hooks/location/useGetLocation.ts`
- `src/hooks/location/useGetLocationById.ts`
- `src/hooks/location/useAddLocation.ts`
- `src/hooks/location/useDeleteLocation.ts`
- `src/hooks/location/useLocationPage.ts`

Pattern:

- list query uses `GET /locations` with server-side pagination/filtering
- edit query uses `GET /locations?id=<id>`
- create/update uses the same `POST /locations` endpoint
- save uses `id` for update and omits it for create
- React Query invalidations refresh list data

### `useGetLocation.ts`

This hook implements server-driven filtering for:

- page
- limit
- search
- type
- parentId

It uses `apiPrivate.get("/locations", { params: ... })` and keeps the query key aligned to the filters.

### `useAddLocation.ts`

This mutation posts JSON to `/locations` and shows success/error toasts. It invalidates `locations` and `location` queries on success.

### `useLocationPage.ts`

This hook encapsulates the main location edit flow:

- determines edit mode
- loads location by id
- merges incoming record into defaults
- provides `updateField(path, value)` to deep-update nested data
- provides `save()` with correct create/update payload behavior

This is the core abstraction for the location editor.

## 6. File upload service

Path: `src/services/fileUpload.ts`

This service is the correct integration point for media uploads:

- `uploadFile(file, fieldName)`
- `removeFiles(urls)`

It sends multipart form-data to `/file-upload` and returns the uploaded URL. The current implementation uses the shared `apiPrivate` client and is consistent with the multi-environment auth strategy.

This is important because the location CMS stores media in nested data fields, not as top-level array fields on the main `Location` model.

## 7. Shared reusable UI / CMS patterns

There are reusable UI components under:

- `src/components/shared/`
- `src/components/ui/`
- `src/components/pages/CMS/shared/`

These include:

- Rich text editor
- image preview uploader components
- video upload field
- map preview
- dropdowns
- scroll areas
- dialogs
- buttons

This suggests the project is intentionally built around reusable UI primitives and section-specific CMS building blocks.

## 8. Key project conventions

### Data fetching

The project uses React Query heavily. Most stateful features follow this pattern:

- `useQuery` for reads
- `useMutation` for writes
- query invalidation after mutations
- route-specific hooks for resource access

### Error handling

The app standardizes toast-based user feedback, especially for API failures. The central API client already emits general toasts; some hooks also translate backend errors with `getApiErrorMessage`.

### Component style

The codebase uses:

- functional components
- local UI state with hooks
- route-driven navigation
- composition over monolithic screen components
- type-safe data models for the location module

## 9. Current status of the location module

The repo already reflects an advanced version of the intended refactor:

- `LocationForm.tsx` is a thin shared shell
- `LocationPreview.tsx` is a thin shared shell
- `config/locationSections.ts` is the section registry source of truth
- the editor + preview share section ordering
- `locationTypes.ts` is present and strongly typed
- the module is split into dedicated per-section folders
- `useLocationPage.ts` centralizes create/edit data flow
- `useGetLocation.ts` supports server-side filtering
- the list page supports search, type filtering, parent filtering, and pagination

In short: the codebase is already much farther along than a basic draft, and the architecture aligns with the refactor brief in a meaningful way.

## 10. Strengths

- Clear separation of concerns
- Strong use of React Query
- Centralized auth + API client
- Good modularity in the location editor
- Strong typed data model for location content
- Section registry pattern prevents preview/form drift
- Shared layout and preview/editor shell are clean

## 11. Risks / watchouts

- Route names and slugs can be brittle when editing nested locations
- Some sections may still require validation against backend JSON payloads if API contracts evolve
- The location draft can become large and deeply nested; `updateField` paths must remain consistent
- The project mixes old and refactored patterns across modules; a careful pass is still needed if new features are introduced
- Some hooks and responses are broad `any` types; if strictness increases, these are likely pain points

## 12. Recommended next moves

1. Keep the location registry architecture as the single source of truth.
2. Validate every section against actual backend payloads before broad changes.
3. Continue using `locationTypes.ts` as the canonical schema.
4. Prefer server-side filtering and pagination over client-side filtering.
5. Reuse shared CMS component primitives instead of reimplementing media fields.
6. Keep route-level auth boundaries and shared API client patterns intact.

## 13. Conclusion

This dashboard is a structured admin application with a well-defined modular approach. The most mature feature is the Location CMS, which already follows a componentized registry model and strong typed schema pattern. The repo overall is in a good state for further extension, especially if future work continues to follow the same architecture and API conventions.

 # #   5 .   R e c e n t   C o d e   U p d a t e s   ( J o u r n e y s   &   G l o b a l   L a y o u t ) 
 
 # # #   B a c k e n d   U p d a t e s   ( J o u r n e y s   M o d u l e ) 
 T h e   b a c k e n d   n o w   f u l l y   s u p p o r t s   t h e   J o u r n e y s   f e a t u r e   t h r o u g h   t h e   f o l l o w i n g   e n t i t i e s   a n d   A P I s : 
 -   * * J o u r n e y * * :   C o r e   m o d e l   c o n t a i n i n g   b a s i c   i n f o ,   h e r o   f i e l d s ,   p r i c i n g ,   a n d   j o u r n e y   m e t a d a t a . 
 -   * * J o u r n e y I t i n e r a r y * * :   S u p p o r t s   d y n a m i c   d a y - b y - d a y   i t i n e r a r i e s ,   i n c l u d i n g   l o c a t i o n   a s s i g n m e n t s ,   n e s t e d   g e o D a t a ,   m u l t i m e d i a   ( v i d e o s / i m a g e s ) ,   a n d   d y n a m i c   s t y l e s   f o r   t e x t . 
 -   * * J o u r n e y A c c o m m o d a t i o n * * :   M a p s   a c c o m m o d a t i o n   d e t a i l s   t o   a   j o u r n e y . 
 -   * * J o u r n e y A d d O n * * :   R e p r e s e n t s   o p t i o n a l   a d d - o n s   o r   e x p e r i e n c e s   a t t a c h e d   t o   a   j o u r n e y . 
 A l l   t h e s e   u s e   P r i s m a   f o r   D B   o p e r a t i o n s   a n d   Z o d   f o r   s t r i c t   t y p e   v a l i d a t i o n   ( e . g . ,   \ J o u r n e y T y p e E n u m \ ,   \ T r a v e l S t y l e E n u m \ ) . 
 
 # # #   F r o n t e n d   U p d a t e s 
 -   * * J o u r n e y s   C M S   U I * * :   T h e   \ / c m s / j o u r n e y s \   m o d u l e   f e a t u r e s   a   d y n a m i c   f o r m   e n g i n e   u s i n g   \ D y n a m i c S t y l e d F i e l d \   f o r   s t y l i z e d   t e x t   i n p u t s   a n d   \ U n i v e r s a l M u l t i m e d i a F o r m \   f o r   r i c h   m e d i a   b a c k g r o u n d s .   I t   f e a t u r e s   a   f u l l y   i n t e r a c t i v e   i t i n e r a r y   b u i l d e r   t h a t   d y n a m i c a l l y   g r o u p s   d a y s   b y   l o c a t i o n . 
 -   * * G l o b a l   L a y o u t   &   B o o k i n g   S u m m a r y * * :   U p d a t e d   g l o b a l   l a y o u t   s t y l e s   i n   \ l a b i b - d a s h b o a r d - g l o b a l c s s \ . 
 -   * * W i s h l i s t   C a r d * * :   A d d e d   \ W i s h l i s t C a r d \   c o m p o n e n t   ( i n   \ s r c / c o m p o n e n t s / d a s h b o a r d / w i s h l i s t \ )   t o   r e n d e r   s a v e d   i t i n e r a r i e s . 
 -   * * P a s t   J o u r n e y s * * :   A d d e d   c a r d s   a n d   l i s t s   t o   s h o w   p a s t   b o o k i n g s . 
  
 