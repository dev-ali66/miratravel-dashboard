/* =====================================================
   LOCATION — PREVIEW BASICS
   Small shared derivation used by almost every preview
   section (name / subtitle / description with the same
   fallback chain the original monolithic LocationPreview
   used). Centralized here instead of duplicated per file;
   each section only destructures the fields it actually
   uses, so there's no unused-variable noise.
===================================================== */

import type { LocationData } from "../locationTypes"

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"

export const FALLBACK_TEXT = "Information not available."

export function getLocationBasics(draft: LocationData | null | undefined) {
  const data = (draft?.data ?? {}) as NonNullable<LocationData["data"]>

  const name = data?.name || draft?.name || "Location"

  const subtitle = data?.subtitle || data?.shortDescription || FALLBACK_TEXT

  const description = data?.description || data?.shortDescription || FALLBACK_TEXT

  return { data, name, subtitle, description }
}
