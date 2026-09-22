import {
  Compass,
  LayoutTemplate,
  FileText,
  Calendar,
  Bed,
  CheckSquare,
  Sparkles,
  Image as ImageIcon,
  Globe,
} from "lucide-react"

import { BasicInfoForm } from "../sections/basic-info/BasicInfoForm"
import { HeroForm } from "../sections/hero/HeroForm"
import { HeroPreview } from "../sections/hero/HeroPreview"
import { OverviewForm } from "../sections/overview/OverviewForm"
import { OverviewPreview } from "../sections/overview/OverviewPreview"
import { ItineraryForm } from "../sections/itinerary/ItineraryForm"
import { ItineraryPreview } from "../sections/itinerary/ItineraryPreview"
import { AccommodationsForm } from "../sections/accommodations/AccommodationsForm"
import { AccommodationsPreview } from "../sections/accommodations/AccommodationsPreview"
import { WhatsIncludedForm } from "../sections/whats-included/WhatsIncludedForm"
import { WhatsIncludedPreview } from "../sections/whats-included/WhatsIncludedPreview"
import { AddOnsForm } from "../sections/add-ons/AddOnsForm"
import { AddOnsPreview } from "../sections/add-ons/AddOnsPreview"
import { GalleryForm } from "../sections/gallery/GalleryForm"
import { GalleryPreview } from "../sections/gallery/GalleryPreview"
import { SeoForm } from "../sections/seo/SeoForm"

export interface JourneySectionConfig {
  key: string
  label: string
  icon: any
  formComponent: any
  previewComponent: any | null
}

export const JOURNEY_SECTION_CONFIGS: Record<string, JourneySectionConfig> = {
  "basic-info": {
    key: "basic-info",
    label: "Basic Journey Information",
    icon: Compass,
    formComponent: BasicInfoForm,
    previewComponent: null,
  },
  hero: {
    key: "hero",
    label: "Hero Section",
    icon: LayoutTemplate,
    formComponent: HeroForm,
    previewComponent: HeroPreview,
  },
  overview: {
    key: "overview",
    label: "Journey Overview & Highlights",
    icon: FileText,
    formComponent: OverviewForm,
    previewComponent: OverviewPreview,
  },
  itinerary: {
    key: "itinerary",
    label: "Day-by-Day Itinerary",
    icon: Calendar,
    formComponent: ItineraryForm,
    previewComponent: ItineraryPreview,
  },
  accommodations: {
    key: "accommodations",
    label: "Where You Stay (Accommodations)",
    icon: Bed,
    formComponent: AccommodationsForm,
    previewComponent: AccommodationsPreview,
  },
  "whats-included": {
    key: "whats-included",
    label: "What's Included & Excluded",
    icon: CheckSquare,
    formComponent: WhatsIncludedForm,
    previewComponent: WhatsIncludedPreview,
  },
  "add-ons": {
    key: "add-ons",
    label: "Optional Experience Add-Ons",
    icon: Sparkles,
    formComponent: AddOnsForm,
    previewComponent: AddOnsPreview,
  },
  gallery: {
    key: "gallery",
    label: "Visual Impressions & Gallery",
    icon: ImageIcon,
    formComponent: GalleryForm,
    previewComponent: GalleryPreview,
  },
  seo: {
    key: "seo",
    label: "SEO & Social Metadata",
    icon: Globe,
    formComponent: SeoForm,
    previewComponent: null,
  },
}

export const JOURNEY_SECTION_KEYS = Object.keys(JOURNEY_SECTION_CONFIGS)
