/* =====================================================
   LOCATION — SECTION CONFIGURATION
   SINGLE SOURCE OF TRUTH for Location section registry and order.
   Only active, built sections are registered here.
===================================================== */

import type { ComponentType } from "react"
import type { LocationData } from "../locationTypes"
import { BasicInfoForm } from "../sections/basic-info/BasicInfoForm"
import { HeroForm } from "../sections/hero/HeroForm"
import { HeroPreview } from "../sections/hero/HeroPreview"
import { EssenceForm } from "../sections/essence/EssenceForm"
import { EssencePreview } from "../sections/essence/EssencePreview"
import { HighlightsForm } from "../sections/highlights/HighlightsForm"
import { HighlightsPreview } from "../sections/highlights/HighlightsPreview"

export type LocationFormSectionProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export type LocationPreviewSectionProps = {
  draft: LocationData | null
}

export type LocationSectionKey =
  | "basic-info"
  | "hero"
  | "essence"
  | "highlights"

export type SectionRegistryEntry = {
  label: string
  form: ComponentType<LocationFormSectionProps> | null
  preview: ComponentType<LocationPreviewSectionProps> | null
}

export const locationSectionRegistry: Record<LocationSectionKey, SectionRegistryEntry> = {
  "basic-info": {
    label: "01. Basic Information",
    form: BasicInfoForm,
    preview: null,
  },
  hero: {
    label: "02. Hero Banner",
    form: HeroForm,
    preview: HeroPreview,
  },
  essence: {
    label: "03. Essence of Location",
    form: EssenceForm,
    preview: EssencePreview,
  },
  highlights: {
    label: "04. Seasonal Highlights & Regions",
    form: HighlightsForm,
    preview: HighlightsPreview,
  },
}

export const locationSectionOrder: LocationSectionKey[] = [
  "basic-info",
  "hero",
  "essence",
  "highlights",
]
