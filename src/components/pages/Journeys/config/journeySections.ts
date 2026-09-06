/* =====================================================
   JOURNEYS — SECTION CONFIGURATION
   SINGLE SOURCE OF TRUTH for section order and registry.
   Aligned directly with the Prisma Journey schema.
===================================================== */

import type { ComponentType } from "react"
import type { Journey } from "../journeyTypes"

import { BasicInfoForm } from "../sections/basicInfo/BasicInfoForm"
import { HeroForm } from "../sections/hero/HeroForm"
import { TagsAttributesForm } from "../sections/tags/TagsAttributesForm"
import { OverviewForm } from "../sections/overview/OverviewForm"
import { HighlightsInclusionsForm } from "../sections/highlights/HighlightsInclusionsForm"
import { ItineraryForm } from "../sections/itinerary/ItineraryForm"
import { AccommodationForm } from "../sections/accommodation/AccommodationForm"
import { AddonsForm } from "../sections/addons/AddonsForm"
import { GalleryForm } from "../sections/gallery/GalleryForm"
import { SeoForm } from "../sections/seo/SeoForm"

export type JourneyFormSectionProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export type JourneySectionKey =
  | "basic-info"
  | "hero"
  | "tags"
  | "overview"
  | "highlights"
  | "itinerary"
  | "accommodation"
  | "addons"
  | "gallery"
  | "seo"

type SectionRegistryEntry = {
  label: string
  form: ComponentType<JourneyFormSectionProps>
}

export const journeySectionRegistry: Record<
  JourneySectionKey,
  SectionRegistryEntry
> = {
  "basic-info": {
    label: "Basic Info",
    form: BasicInfoForm,
  },
  hero: {
    label: "Hero & Media",
    form: HeroForm,
  },
  tags: {
    label: "Tags & Styles",
    form: TagsAttributesForm,
  },
  overview: {
    label: "Overview & Why We Designed",
    form: OverviewForm,
  },
  highlights: {
    label: "Highlights & Inclusions",
    form: HighlightsInclusionsForm,
  },
  itinerary: {
    label: "Day-by-Day Itinerary",
    form: ItineraryForm,
  },
  accommodation: {
    label: "Accommodations",
    form: AccommodationForm,
  },
  addons: {
    label: "Add-ons & Upgrades",
    form: AddonsForm,
  },
  gallery: {
    label: "Image Gallery",
    form: GalleryForm,
  },
  seo: {
    label: "SEO & Metadata",
    form: SeoForm,
  },
}

export const journeySectionOrder: JourneySectionKey[] = [
  "basic-info",
  "hero",
  "tags",
  "overview",
  "highlights",
  "itinerary",
  "accommodation",
  "addons",
  "gallery",
  "seo",
]
