/* =====================================================
   JOURNEYS — SECTION CONFIGURATION
   SINGLE SOURCE OF TRUTH for section order and registry.
===================================================== */

import type { ComponentType } from "react"
import type { Journey } from "../journeyTypes"

import { BasicInfoForm } from "../sections/basicInfo/BasicInfoForm"
import { HeroForm } from "../sections/hero/HeroForm"
import { TagsAttributesForm } from "../sections/tags/TagsAttributesForm"
import { WhyDesignedForm } from "../sections/whyDesigned/WhyDesignedForm"
import { RouteStopsForm } from "../sections/route/RouteStopsForm"
import { IsThisForYouForm } from "../sections/isThisForYou/IsThisForYouForm"
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
  | "why-designed"
  | "route"
  | "is-this-for-you"
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
  "why-designed": {
    label: "Why We Designed",
    form: WhyDesignedForm,
  },
  route: {
    label: "Route & Stops",
    form: RouteStopsForm,
  },
  "is-this-for-you": {
    label: "Is This For You",
    form: IsThisForYouForm,
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
  "why-designed",
  "route",
  "is-this-for-you",
  "highlights",
  "itinerary",
  "accommodation",
  "addons",
  "gallery",
  "seo",
]
