/* =====================================================
   LOCATION — SECTION CONFIGURATION
   SINGLE SOURCE OF TRUTH for section order. Both
   LocationForm.tsx and LocationPreview.tsx loop over
   `locationSectionOrder` and look each key up in
   `locationSectionRegistry` — there is no separate order
   array anywhere else. Reordering this array reorders both
   the Form accordion and the Preview render, together.

   To add a new section in the future:
     1. Build <Name>Form.tsx / <Name>Preview.tsx under sections/<key>/
     2. Add one entry to `locationSectionRegistry` below
     3. Add its key to `locationSectionOrder` wherever it belongs
   No other file needs to change.
===================================================== */

import type { ComponentType } from "react"
import type { LocationData } from "../locationTypes"

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
  | "geo-data"
  | "card"
  | "why"
  | "info"
  | "essence"
  | "statistics"
  | "climate"
  | "culture"
  | "safety"
  | "geography"
  | "travel-info"
  | "accommodation"
  | "experiences"
  | "practical-information"
  | "faq"
  | "image-gallery"
  | "local-guide"
  | "travel-insights"
  | "video-gallery"
  | "seo"

type SectionRegistryEntry = {
  label: string
  form: ComponentType<LocationFormSectionProps>
  /**
   * null = this section has no public-facing detail preview
   * (administrative-only sections: identifiers, geo metadata,
   * SEO), or its content is rendered as part of another
   * section's preview (see "culture" below).
   */
  preview: ComponentType<LocationPreviewSectionProps> | null
}

/* =====================================================
   FORM IMPORTS
===================================================== */

import { BasicInfoForm } from "../sections/basicInfo/BasicInfoForm"
import { GeoDataForm } from "../sections/geoData/GeoDataForm"
import { HeroForm } from "../sections/hero/HeroForm"
import { CardForm } from "../sections/card/CardForm"
import { WhyVisitForm } from "../sections/why/WhyVisitForm"
import { InfoForm } from "../sections/info/InfoForm"
import { EssenceForm } from "../sections/essence/EssenceForm"
import { StatisticsForm } from "../sections/statistics/StatisticsForm"
import { ClimateForm } from "../sections/climate/ClimateForm"
import { CultureForm } from "../sections/culture/CultureForm"
import { SafetyForm } from "../sections/safety/SafetyForm"
import { GeographyForm } from "../sections/geography/GeographyForm"
import { TravelInfoForm } from "../sections/travelInfo/TravelInfoForm"
import { ExperiencesForm } from "../sections/experiences/ExperiencesForm"
import { AccommodationStaysForm } from "../sections/accommodation/AccommodationStaysForm"
import { PracticalInformationForm } from "../sections/practicalInformation/PracticalInformationForm"
import { FaqForm } from "../sections/faq/FaqForm"
import { ImageGalleryForm } from "../sections/imageGallery/ImageGalleryForm"
import { LocalGuideForm } from "../sections/localGuide/LocalGuideForm"
import { TravelInsightsForm } from "../sections/travelInsights/TravelInsightsForm"
import { VideoGalleryForm } from "../sections/videoGallery/VideoGalleryForm"
import { SeoForm } from "../sections/seo/SeoForm"

/* =====================================================
   PREVIEW IMPORTS
===================================================== */

import { HeroPreview } from "../sections/hero/HeroPreview"
import { CardPreview } from "../sections/card/CardPreview"
import { GeoDataPreview } from "../sections/geoData/GeoDataPreview"
import { WhyVisitPreview } from "../sections/why/WhyVisitPreview"
import { IntroInfoPreview } from "../sections/info/IntroInfoPreview"
import { EssencePreview } from "../sections/essence/EssencePreview"
import { StatisticsPreview } from "../sections/statistics/StatisticsPreview"
import { ClimateCulturePreview } from "../sections/climate/ClimateCulturePreview"
import { SafetyPreview } from "../sections/safety/SafetyPreview"
import { GeographyPreview } from "../sections/geography/GeographyPreview"
import { TravelInfoPreview } from "../sections/travelInfo/TravelInfoPreview"
import { ExperiencesPreview } from "../sections/experiences/ExperiencesPreview"
import { AccommodationStaysPreview } from "../sections/accommodation/AccommodationStaysPreview"
import { PracticalInformationPreview } from "../sections/practicalInformation/PracticalInformationPreview"
import { FaqPreview } from "../sections/faq/FaqPreview"
import { ImageGalleryPreview } from "../sections/imageGallery/ImageGalleryPreview"
import { LocalGuidePreview } from "../sections/localGuide/LocalGuidePreview"
import { TravelInsightsPreview } from "../sections/travelInsights/TravelInsightsPreview"
import { VideoGalleryPreview } from "../sections/videoGallery/VideoGalleryPreview"

/* =====================================================
   REGISTRY
===================================================== */

export const locationSectionRegistry: Record<
  LocationSectionKey,
  SectionRegistryEntry
> = {
  "basic-info": {
    label: "Basic Information",
    form: BasicInfoForm,
    preview: null, // identifiers/meta only, not part of the public preview
  },
  hero: {
    label: "Hero",
    form: HeroForm,
    preview: HeroPreview,
  },
  "geo-data": {
    label: "Geo Information",
    form: GeoDataForm,
    preview: GeoDataPreview,
  },
  card: {
    label: "Card",
    form: CardForm,
    preview: CardPreview,
  },
  why: {
    label: "Why Visit",
    form: WhyVisitForm,
    preview: WhyVisitPreview,
  },
  info: {
    label: "Info",
    form: InfoForm,
    preview: IntroInfoPreview,
  },
  essence: {
    label: "Essence",
    form: EssenceForm,
    preview: EssencePreview,
  },
  statistics: {
    label: "Statistics",
    form: StatisticsForm,
    preview: StatisticsPreview,
  },
  climate: {
    label: "Climate",
    form: ClimateForm,
    // renders BOTH climate + culture (one combined visual
    // block in the original design) — see "culture" below.
    preview: ClimateCulturePreview,
  },
  culture: {
    label: "Culture",
    form: CultureForm,
    // no separate preview: already rendered by "climate"'s
    // ClimateCulturePreview, so this stays null to avoid a
    // duplicate render of the same block.
    preview: null,
  },
  safety: {
    label: "Safety",
    form: SafetyForm,
    preview: SafetyPreview,
  },
  geography: {
    label: "Geography",
    form: GeographyForm,
    preview: GeographyPreview,
  },
  "travel-info": {
    label: "Travel Information",
    form: TravelInfoForm,
    preview: TravelInfoPreview,
  },
  accommodation: {
    label: "Accommodation",
    form: AccommodationStaysForm,
    preview: AccommodationStaysPreview,
  },
  experiences: {
    label: "Experiences",
    form: ExperiencesForm,
    preview: ExperiencesPreview,
  },
  "practical-information": {
    label: "Practical Information",
    form: PracticalInformationForm,
    preview: PracticalInformationPreview,
  },
  faq: {
    label: "FAQ",
    form: FaqForm,
    preview: FaqPreview,
  },
  "image-gallery": {
    label: "Image Gallery",
    form: ImageGalleryForm,
    preview: ImageGalleryPreview,
  },
  "local-guide": {
    label: "Local Guide",
    form: LocalGuideForm,
    preview: LocalGuidePreview,
  },
  "travel-insights": {
    label: "Travel Insights",
    form: TravelInsightsForm,
    preview: TravelInsightsPreview,
  },
  "video-gallery": {
    label: "Video Gallery",
    form: VideoGalleryForm,
    preview: VideoGalleryPreview,
  },
  seo: {
    label: "SEO",
    form: SeoForm,
    preview: null,
  },
}

/* =====================================================
   ORDER — reorder this array to reorder Form + Preview together
===================================================== */

export const locationSectionOrder: LocationSectionKey[] = [
  "basic-info",
  "hero",
  "info",
  "why",
  "experiences",
  "geo-data",
  "accommodation",
  "travel-insights",
  "practical-information",
  "card",
  "essence",
  "statistics",
  "climate",
  "culture",
  "safety",
  "geography",
  "travel-info",
  "faq",
  "image-gallery",
  "local-guide",
  "video-gallery",
  "seo",
]
