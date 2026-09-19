import React from "react"
import { BasicInfoForm } from "../sections/basic-info/BasicInfoForm"
import { HeroForm } from "../sections/hero/HeroForm"
import { OverviewForm } from "../sections/overview/OverviewForm"
import { ItineraryForm } from "../sections/itinerary/ItineraryForm"
import { AccommodationsForm } from "../sections/accommodations/AccommodationsForm"
import { WhatsIncludedForm } from "../sections/whats-included/WhatsIncludedForm"
import { AddOnsForm } from "../sections/add-ons/AddOnsForm"
import { GalleryForm } from "../sections/gallery/GalleryForm"
import { SeoForm } from "../sections/seo/SeoForm"

export type JourneySectionKey =
  | "basic-info"
  | "hero"
  | "overview"
  | "itinerary"
  | "accommodations"
  | "whats-included"
  | "add-ons"
  | "gallery"
  | "seo"

export interface JourneySectionConfig {
  key: JourneySectionKey
  label: string
  form: React.ComponentType<{
    draft: any
    updateField: (path: string, value: any) => void
    openSections: Record<string, boolean>
    toggleSection: (key: string) => void
    sectionNumber: string
  }>
}

export const journeySectionRegistry: Record<JourneySectionKey, JourneySectionConfig> = {
  "basic-info": {
    key: "basic-info",
    label: "Basic Info & Schema",
    form: BasicInfoForm,
  },
  hero: {
    key: "hero",
    label: "Hero Header",
    form: HeroForm,
  },
  overview: {
    key: "overview",
    label: "Overview Narrative",
    form: OverviewForm,
  },
  itinerary: {
    key: "itinerary",
    label: "Day-by-Day Itinerary",
    form: ItineraryForm,
  },
  accommodations: {
    key: "accommodations",
    label: "Accommodations & Stays",
    form: AccommodationsForm,
  },
  "whats-included": {
    key: "whats-included",
    label: "What's Included & Excluded",
    form: WhatsIncludedForm,
  },
  "add-ons": {
    key: "add-ons",
    label: "Optional Upgrades & Add-ons",
    form: AddOnsForm,
  },
  gallery: {
    key: "gallery",
    label: "Media Gallery",
    form: GalleryForm,
  },
  seo: {
    key: "seo",
    label: "SEO Metadata",
    form: SeoForm,
  },
}

export const ALL_JOURNEY_SECTIONS: JourneySectionKey[] = [
  "basic-info",
  "hero",
  "overview",
  "itinerary",
  "accommodations",
  "whats-included",
  "add-ons",
  "gallery",
  "seo",
]

export function getSectionsForJourney(): JourneySectionKey[] {
  return ALL_JOURNEY_SECTIONS
}
