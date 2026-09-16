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
  | "region-experiences"
  | "geo-map"
  | "travel-insights"
  | "signature-experiences"
  | "faq"
  | "cta"
  | "seo"

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
  "region-experiences": {
    label: "05. Region Experiences",
    form: RegionExperiencesForm,
    preview: RegionExperiencesPreview,
  },
  "geo-map": {
    label: "06. Interactive Map & Geo Data",
    form: GeoMapForm,
    preview: GeoMapPreview,
  },
  "travel-insights": {
    label: "07. Travel Insights & Guide Articles",
    form: TravelInsightsForm,
    preview: TravelInsightsPreview,
  },
  "signature-experiences": {
    label: "08. Signature Experiences",
    form: SignatureExperiencesForm,
    preview: SignatureExperiencesPreview,
  },
  faq: {
    label: "09. Frequently Asked Questions",
    form: FaqForm,
    preview: FaqPreview,
  },
  cta: {
    label: "10. Call to Action (CTA)",
    form: DestinationCtaForm,
    preview: DestinationCtaPreview,
  },
  seo: {
    label: "11. SEO & Metadata",
    form: SeoForm,
    preview: null,
  },
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
