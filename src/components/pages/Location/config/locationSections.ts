/* =====================================================
   LOCATION — SECTION CONFIGURATION
   SINGLE SOURCE OF TRUTH for Location section registry and order.
   Only active, built sections are registered here.
===================================================== */

import type { ComponentType } from "react"
import { isDevModeActive, type LocationData } from "../locationTypes"
import { BasicInfoForm } from "../sections/basic-info/BasicInfoForm"
import { HeroForm } from "../sections/hero/HeroForm"
import { HeroPreview } from "../sections/hero/HeroPreview"
import { EssenceForm } from "../sections/essence/EssenceForm"
import { EssencePreview } from "../sections/essence/EssencePreview"
import { HighlightsForm } from "../sections/highlights/HighlightsForm"
import { HighlightsPreview } from "../sections/highlights/HighlightsPreview"
import { RegionExperiencesForm } from "../sections/region-experiences/RegionExperiencesForm"
import { RegionExperiencesPreview } from "../sections/region-experiences/RegionExperiencesPreview"
import { GeoMapForm } from "../sections/geo-map/GeoMapForm"
import { GeoMapPreview } from "../sections/geo-map/GeoMapPreview"
import { TravelInsightsForm } from "../sections/travel-insights/TravelInsightsForm"
import { TravelInsightsPreview } from "../sections/travel-insights/TravelInsightsPreview"
import { SignatureExperiencesForm } from "../sections/signature-experiences/SignatureExperiencesForm"
import { SignatureExperiencesPreview } from "../sections/signature-experiences/SignatureExperiencesPreview"
import { FaqForm } from "../sections/faq/FaqForm"
import { FaqPreview } from "../sections/faq/FaqPreview"
import { DestinationCtaForm } from "../sections/cta/DestinationCtaForm"
import { DestinationCtaPreview } from "../sections/cta/DestinationCtaPreview"
import { SeoForm } from "../sections/seo/SeoForm"
import { StatsForm } from "../sections/stats/StatsForm"
import { StatsPreview } from "../sections/stats/StatsPreview"
import { GlanceForm } from "../sections/glance/GlanceForm"
import { GlancePreview } from "../sections/glance/GlancePreview"
import { CharacterForm } from "../sections/character/CharacterForm"
import { CharacterPreview } from "../sections/character/CharacterPreview"
import { PracticalInfoForm } from "../sections/practical-info/PracticalInfoForm"
import { PracticalInfoPreview } from "../sections/practical-info/PracticalInfoPreview"
import { PlaceInfoForm } from "../sections/place-info/PlaceInfoForm"
import { PlaceInfoPreview } from "../sections/place-info/PlaceInfoPreview"
import { WhyVisitForm } from "../sections/why-visit/WhyVisitForm"
import { WhyVisitPreview } from "../sections/why-visit/WhyVisitPreview"
import { PlaceExperiencesForm } from "../sections/experiences/PlaceExperiencesForm"
import { PlaceExperiencesPreview } from "../sections/experiences/PlaceExperiencesPreview"
import { SharedInfoForm } from "../sections/shared-info/SharedInfoForm"
import { SharedInfoPreview } from "../sections/shared-info/SharedInfoPreview"
import { LocationStoriesForm } from "../sections/stories/LocationStoriesForm"
import { LocationStoriesPreview } from "../sections/stories/LocationStoriesPreview"

export type LocationFormSectionProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
  sectionNumber?: string
}

export type LocationPreviewSectionProps = {
  draft: LocationData | null
}

export type LocationSectionKey =
  | "basic-info"
  | "hero"
  | "essence"
  | "stats"
  | "glance"
  | "character"
  | "practical-info"
  | "highlights"
  | "region-experiences"
  | "geo-map"
  | "travel-insights"
  | "signature-experiences"
  | "faq"
  | "cta"
  | "seo"
  | "place-info"
  | "why-visit"
  | "experiences"
  | "shared-info"
  | "stories"

export type SectionRegistryEntry = {
  label: string
  form: ComponentType<LocationFormSectionProps> | null
  preview: ComponentType<LocationPreviewSectionProps> | null
}

export const locationSectionRegistry: Record<LocationSectionKey, SectionRegistryEntry> = {
  "basic-info": {
    label: "Basic Information",
    form: BasicInfoForm,
    preview: null,
  },
  hero: {
    label: "Hero Banner",
    form: HeroForm,
    preview: HeroPreview,
  },
  essence: {
    label: "Essence of Location",
    form: EssenceForm,
    preview: EssencePreview,
  },
  stats: {
    label: "Location Statistics",
    form: StatsForm,
    preview: StatsPreview,
  },
  glance: {
    label: "Glance",
    form: GlanceForm,
    preview: GlancePreview,
  },
  character: {
    label: "Character",
    form: CharacterForm,
    preview: CharacterPreview,
  },
  "practical-info": {
    label: "Practical Information (Before Travel)",
    form: PracticalInfoForm,
    preview: PracticalInfoPreview,
  },
  highlights: {
    label: "Seasonal Highlights & Regions",
    form: HighlightsForm,
    preview: HighlightsPreview,
  },
  "region-experiences": {
    label: "Region Experiences",
    form: RegionExperiencesForm,
    preview: RegionExperiencesPreview,
  },
  "geo-map": {
    label: "Interactive Map & Geo Data",
    form: GeoMapForm,
    preview: GeoMapPreview,
  },
  "travel-insights": {
    label: "Travel Insights & Guide Articles",
    form: TravelInsightsForm,
    preview: TravelInsightsPreview,
  },
  "signature-experiences": {
    label: "Signature Experiences",
    form: SignatureExperiencesForm,
    preview: SignatureExperiencesPreview,
  },
  faq: {
    label: "Frequently Asked Questions",
    form: FaqForm,
    preview: FaqPreview,
  },
  cta: {
    label: "Call to Action (CTA)",
    form: DestinationCtaForm,
    preview: DestinationCtaPreview,
  },
  seo: {
    label: "SEO & Metadata",
    form: SeoForm,
    preview: null,
  },
  "place-info": {
    label: "Place Information / Overview",
    form: PlaceInfoForm,
    preview: PlaceInfoPreview,
  },
  "why-visit": {
    label: "Why Visit",
    form: WhyVisitForm,
    preview: WhyVisitPreview,
  },
  experiences: {
    label: "Curated Experiences",
    form: PlaceExperiencesForm,
    preview: PlaceExperiencesPreview,
  },
  "shared-info": {
    label: "Shared Info / Highlight Statement",
    form: SharedInfoForm,
    preview: SharedInfoPreview,
  },
  stories: {
    label: "Location Stories",
    form: LocationStoriesForm,
    preview: LocationStoriesPreview,
  },
}

export const LOCATION_TYPE_SECTION_CONFIG: Record<string, LocationSectionKey[]> = {
  CONTINENT: [
    "basic-info",
    "hero",
    "shared-info",
    "travel-insights",
    "geo-map",
    "cta",
    "seo",
  ],
  COUNTRY: [
    "basic-info",
    "hero",
    "essence",
    "geo-map",
    "highlights",
    "region-experiences",
    "travel-insights",
    "signature-experiences",
    "faq",
    "cta",
    "seo",
  ],
  REGION: [
    "basic-info",
    "hero",
    "essence",
    "stats",
    "geo-map",
    "glance",
    "character",
    "stories",
    "practical-info",
    "seo",
  ],
  PLACE: [
    "basic-info",
    "hero",
    "place-info",
    "why-visit",
    "experiences",
    "geo-map",
    "shared-info",
    "travel-insights",
    "stories",
    "practical-info",
    "seo",
  ],
  LANDMARK: [
    "basic-info",
    "hero",
    "place-info",
    "why-visit",
    "geo-map",
    "cta",
    "seo",
  ],
  ACCOMMODATION: [
    "basic-info",
    "hero",
    "place-info",
    "why-visit",
    "geo-map",
    "cta",
    "seo",
  ],
  OTHER: [
    "basic-info",
    "hero",
    "seo",
  ],
  TEST: [
    "basic-info",
    "hero",
    "essence",
    "stats",
    "glance",
    "character",
    "practical-info",
    "highlights",
    "region-experiences",
    "geo-map",
    "travel-insights",
    "signature-experiences",
    "faq",
    "cta",
    "place-info",
    "why-visit",
    "experiences",
    "shared-info",
    "stories",
    "seo",
  ],
}

/**
 * Dynamically resolves ordered section keys for a given location type.
 * Returns PLACE sections if type is not set or not registered.
 */
export function getSectionsForLocationType(type?: string | null): LocationSectionKey[] {
  if (!type || typeof type !== "string" || !type.trim()) {
    return isDevModeActive() ? LOCATION_TYPE_SECTION_CONFIG.TEST : LOCATION_TYPE_SECTION_CONFIG.PLACE
  }

  const normalizedType = type.trim().toUpperCase()
  const configured = LOCATION_TYPE_SECTION_CONFIG[normalizedType]

  if (!configured || configured.length === 0) {
    return isDevModeActive() ? LOCATION_TYPE_SECTION_CONFIG.TEST : LOCATION_TYPE_SECTION_CONFIG.PLACE
  }

  const result = [...configured]

  if (!result.includes("basic-info")) {
    result.unshift("basic-info")
  }

  if (!result.includes("seo")) {
    result.push("seo")
  }

  return result
}

export const locationSectionOrder: LocationSectionKey[] = [
  "basic-info",
  "hero",
  "essence",
  "highlights",
  "region-experiences",
  "geo-map",
  "travel-insights",
  "signature-experiences",
  "faq",
  "cta",
  "seo",
]
