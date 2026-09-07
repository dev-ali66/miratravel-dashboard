# Global Agent Guidelines & Single Sources of Truth

> **CRITICAL ARCHITECTURAL DIRECTIVE**:
> These components are the immutable **Single Source of Truth** for the entire Admin Dashboard (CMS, Location, Journeys, etc.). NEVER replace, recreate, or duplicate them with ad-hoc or custom input components.

---

## 📚 Documentation Structure
All project documentation has been organized into the `docs/` folder to keep the root directory clean. When referencing or updating documentation, look in these locations:
- **`docs/dashboard/`**: Contains all frontend/dashboard specific documentation (CMS flows, PRD, component overviews).
- **`docs/backend/`**: Contains all backend API references, domain logic, and architecture docs.
- **`docs/frontend/`**: Contains general frontend guidelines (e.g. `CLAUDE.md`, `AGENTS.md`).

*Note: This `AGENTS.md` file at the root remains the primary entry point and single source of truth for AI agents.*

---

## 1. Text, Number & Textarea Fields: `DynamicStyledField`
- **Location**: `src/components/pages/CMS/shared/FormControls.tsx` (re-exported in shared fields)
- **Rule**: Whenever any text, number, or textarea field is needed (titles, subtitles, descriptions, slugs, numbers, prices, days), **ALWAYS use `DynamicStyledField`**.
- **Forbidden**: NEVER introduce ad-hoc field components (such as `JourneyInputField` or raw custom inputs).

---

## 2. Media Form Management & Section Backgrounds: `UniversalMultimediaForm`
- **Location**: `src/components/pages/CMS/shared/UniversalMultimediaForm.tsx`
- **Mandatory Section Background Rule**: **EVERY form section MUST include a Background configuration using `UniversalMultimediaForm`** (supporting image, background video, solid color, opacity, overlay).
- **All Images & Videos Rule**: Whenever any image, photo gallery item, or video file is configured across ANY section form, **ALWAYS use `UniversalMultimediaForm`**.
- **Capabilities**: Supports background types (`image`, `video`, `color`), live color picker, alt text styles, video switches (autoplay, loop, muted).

---

## 3. Media & Background Rendering / Display: `UniversalMultimediaPreview`
- **Location**: `src/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview.tsx`
- **Rule**: Wherever multimedia or section backgrounds are shown (live preview heroes, section backgrounds, preview cards, list item thumbnails, modal images), **ALWAYS use `UniversalMultimediaPreview`** ("universal multimedia show").
- **Section Background Preview**: Every preview panel corresponding to a form section must render its background using `<UniversalMultimediaPreview multimedia={section.backgroundMultimedia} mode="background" ... />`.

---

## 4. Reusable Buttons: `ButtonsField` (CMS `/home` Hero Button Style)
- **Location**: `src/components/pages/CMS/shared/ButtonsField.tsx`
- **Rule**: Whenever buttons, CTAs, or navigation links are needed in a section, wrap them inside the standard container:
  ```tsx
  <div className="rounded-md border border-border/50 p-3">
    <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      Buttons
    </p>
    <ButtonsField
      value={buttons}
      onChange={(newButtons) => ...}
    />
  </div>
  ```

---

## 5. Universal SEO Form: `SeoForm`
- **Location**: `src/components/pages/CMS/shared/SeoForm.tsx`
- **Rule**: The SEO section at the bottom of forms **ALWAYS uses the universal `SeoForm`** from `CMS/shared/SeoForm`. Do not write standalone, custom SEO forms.
