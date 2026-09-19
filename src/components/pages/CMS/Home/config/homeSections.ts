import type { ComponentType, ReactNode } from "react"

import type {
  HomeButton,
  HomeImage,
  HomeSection,
  HomeVideo,
} from "../homeTypes"

import { HeroForm, HeroPreview } from "../sections/hero"
import { ExploreJourneysForm, ExploreJourneysPreview } from "../sections/explore-journeys"
import { DestinationsForm, DestinationsPreview } from "../sections/destinations"
import { MiraStoriesForm, MiraStoriesPreview } from "../sections/mira-stories"
import { WhyMiraForm, WhyMiraPreview } from "../sections/why-mira"
import { TravelInsightsForm, TravelInsightsPreview } from "../sections/travel-insights"
import { CustomJourneyCtaForm, CustomJourneyCtaPreview } from "../sections/custom-journey-cta"

export type HomeSectionKey =
  | "hero"
  | "explore_journeys"
  | "destinations"
  | "mira_stories"
  | "why_mira"
  | "travel_insights"
  | "custom_journey_cta"

export type HomeFormSectionProps = {
  section: HomeSection
  index: number
  updateSection: (index: number, patch: Partial<HomeSection>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
  updateSectionImages: (index: number, images: HomeImage[]) => void
  updateSectionVideos: (index: number, videos: HomeVideo[]) => void
  updateSectionButtons: (index: number, buttons: HomeButton[]) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export type HomePreviewSectionProps = {
  section: HomeSection
  accentColor: string
  darkText: string
  primaryColor: string
  lightText: string
  renderButtons: (
    buttons?: HomeButton[],
    fullWidth?: boolean,
    alignRight?: boolean,
    mainButtonWidth?: boolean
  ) => ReactNode
}

export type SectionRegistryEntry = {
  label: string
  form: ComponentType<HomeFormSectionProps>
  preview: ComponentType<HomePreviewSectionProps>
}

export const homeSectionRegistry: Record<HomeSectionKey, SectionRegistryEntry> =
  {
    hero: {
      label: "Hero",
      form: HeroForm,
      preview: HeroPreview,
    },
    explore_journeys: {
      label: "Explore Journeys",
      form: ExploreJourneysForm,
      preview: ExploreJourneysPreview,
    },
    destinations: {
      label: "Destinations",
      form: DestinationsForm,
      preview: DestinationsPreview,
    },
    mira_stories: {
      label: "Mira Stories",
      form: MiraStoriesForm,
      preview: MiraStoriesPreview,
    },
    why_mira: {
      label: "Why Mira",
      form: WhyMiraForm,
      preview: WhyMiraPreview,
    },
    travel_insights: {
      label: "Travel Insights",
      form: TravelInsightsForm,
      preview: TravelInsightsPreview,
    },
    custom_journey_cta: {
      label: "Custom Journey CTA",
      form: CustomJourneyCtaForm,
      preview: CustomJourneyCtaPreview,
    },
  }

export const homeSectionOrder: HomeSectionKey[] = [
  "hero",
  "explore_journeys",
  "destinations",
  "mira_stories",
  "why_mira",
  "travel_insights",
  "custom_journey_cta",
]
