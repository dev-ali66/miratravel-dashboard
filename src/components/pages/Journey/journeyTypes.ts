import type { CmsButton } from "@/components/pages/CMS/shared/ButtonsField"
import type { UniversalMultimediaValue } from "@/components/pages/CMS/shared/UniversalMultimediaForm"

/* =====================================================
   ENUMS
===================================================== */

export type JourneyTypeEnum =
  | "PRIVATE_JOURNEY"
  | "SELF_DRIVE_JOURNEY"
  | "SMALL_GROUP"
  | "LUXURY_ESCAPE"
  | "FAMILY_JOURNEY"

export type TravelStyleEnum =
  | "CULTURE_HERITAGE"
  | "NATURE"
  | "ADVENTURE"
  | "FOOD_WINE"
  | "COASTAL_ESCAPE"
  | "MOUNTAINS"
  | "SLOW_TRAVEL"
  | "LUXURY"
  | "PHOTOGRAPHY"
  | "WELLNESS"

export type PerfectForEnum =
  | "COUPLES"
  | "FAMILIES"
  | "FRIENDS"
  | "FOOD_WINE"
  | "SOLO_TRAVELLERS"
  | "HONEYMOONERS"
  | "FIRST_TIME_VISITORS"
  | "RETURNING_VISITORS"
  | "NATURE_LOVERS"
  | "ADVENTURE_SEEKERS"

export type PaceEnum = "RELAXED" | "BALANCED" | "ACTIVE"

export type ComfortLevelEnum = "COMFORT" | "BOUTIQUE" | "PREMIUM_LUXURY"

export type JourneyStatusEnum = "DRAFT" | "PUBLISHED" | "ARCHIVED"

export const JOURNEY_TYPES: JourneyTypeEnum[] = [
  "PRIVATE_JOURNEY",
  "SELF_DRIVE_JOURNEY",
  "SMALL_GROUP",
  "LUXURY_ESCAPE",
  "FAMILY_JOURNEY",
]

export const TRAVEL_STYLES: TravelStyleEnum[] = [
  "CULTURE_HERITAGE",
  "NATURE",
  "ADVENTURE",
  "FOOD_WINE",
  "COASTAL_ESCAPE",
  "MOUNTAINS",
  "SLOW_TRAVEL",
  "LUXURY",
  "PHOTOGRAPHY",
  "WELLNESS",
]

export const PERFECT_FOR_LIST: PerfectForEnum[] = [
  "COUPLES",
  "FAMILIES",
  "FRIENDS",
  "FOOD_WINE",
  "SOLO_TRAVELLERS",
  "HONEYMOONERS",
  "FIRST_TIME_VISITORS",
  "RETURNING_VISITORS",
  "NATURE_LOVERS",
  "ADVENTURE_SEEKERS",
]

export const PACE_LIST: PaceEnum[] = ["RELAXED", "BALANCED", "ACTIVE"]

export const COMFORT_LEVELS: ComfortLevelEnum[] = [
  "COMFORT",
  "BOUTIQUE",
  "PREMIUM_LUXURY",
]

export const JOURNEY_STATUS_LIST: JourneyStatusEnum[] = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]

/* =====================================================
   SECTION DATA TYPES
===================================================== */

export interface HeroSectionData {
  label?: string
  title?: string
  subtitle?: string
  badge?: string
  buttons?: CmsButton[]
  background_image?: string
  video?: string
  backgroundMultimedia?: UniversalMultimediaValue | null
  style?: Record<string, any> | null
}

export interface OverviewHighlightItem {
  id: string
  title: string
  description?: string
  icon?: string
}

export interface OverviewSectionData {
  badge?: string
  title?: string
  subtitle?: string
  overviewText?: string
  highlightsList?: OverviewHighlightItem[]
  routeSummary?: string
  featuresList?: string[]
  backgroundMultimedia?: UniversalMultimediaValue | null
  style?: Record<string, any> | null
}

export interface ItineraryDayItem {
  id: string
  dayNumber: number
  title: string
  subtitle?: string
  duration?: string
  location?: string
  description?: string
  meals?: string[]
  activities?: string[]
  highlights?: string[]
  stayName?: string
  image?: string
  imageMultimedia?: Record<string, any> | null
  style?: Record<string, any> | null
}

export interface ItineraryChapter {
  id: string
  chapterNumber: string // e.g. "Chapter I", "Chapter II"
  title: string // e.g. "The Beginning", "Into the Mountains"
  subtitle?: string // e.g. "Days 1–3 · Tirana & surroundings"
  description?: string
  days: ItineraryDayItem[]
}

export interface ItinerarySectionData {
  badge?: string
  title?: string
  description?: string
  daysList?: ItineraryDayItem[]
  chaptersList?: ItineraryChapter[]
  backgroundMultimedia?: UniversalMultimediaValue | null
  style?: Record<string, any> | null
}

export interface AccommodationStayItem {
  id: string
  name: string
  stayType?: string
  city?: string
  duration?: string
  nights?: number
  description?: string
  image?: string
  imageMultimedia?: Record<string, any> | null
  amenities?: string[]
  websiteUrl?: string
  style?: Record<string, any> | null
}

export interface AccommodationsSectionData {
  badge?: string
  title?: string
  description?: string
  staysList?: AccommodationStayItem[]
  backgroundMultimedia?: UniversalMultimediaValue | null
  style?: Record<string, any> | null
}

export interface WhatsIncludedItem {
  id: string
  category?: string
  title: string
  description?: string
  icon?: string
}

export interface WhatsIncludedSectionData {
  badge?: string
  title?: string
  description?: string
  inclusions?: WhatsIncludedItem[]
  exclusions?: WhatsIncludedItem[]
  notes?: string[]
  backgroundMultimedia?: UniversalMultimediaValue | null
  style?: Record<string, any> | null
}

export interface AddOnItem {
  id: string
  title: string
  category?: string
  duration?: string
  price?: number
  currency?: string
  description?: string
  image?: string
  imageMultimedia?: Record<string, any> | null
  features?: string[]
  style?: Record<string, any> | null
}

export interface AddOnsSectionData {
  badge?: string
  title?: string
  description?: string
  itemsList?: AddOnItem[]
  backgroundMultimedia?: UniversalMultimediaValue | null
  style?: Record<string, any> | null
}

export interface GalleryMediaItem {
  id: string
  title?: string
  type: "image" | "video"
  url?: string
  multimedia?: Record<string, any> | null
  thumbnail?: string
  caption?: string
}

export interface GallerySectionData {
  badge?: string
  title?: string
  description?: string
  items?: GalleryMediaItem[]
  backgroundMultimedia?: UniversalMultimediaValue | null
  style?: Record<string, any> | null
}

export interface SeoMetadata {
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
  [key: string]: any
}

/* =====================================================
   JOURNEY MAIN DATA TYPE
===================================================== */

export interface JourneyData {
  id?: string
  slug: string
  title: string
  subtitle?: string | null
  price: number
  currency: string
  minDays: number
  maxDays: number
  pace: PaceEnum
  comfortLevel: ComfortLevelEnum
  status: JourneyStatusEnum
  featured: boolean

  journeyType: JourneyTypeEnum[]
  travelStyle: TravelStyleEnum[]
  perfectFor: PerfectForEnum[]

  hero?: HeroSectionData | null
  overview?: OverviewSectionData | null
  itinerary?: ItinerarySectionData | null
  accommodations?: AccommodationsSectionData | null
  addOns?: AddOnsSectionData | null
  gallery?: GallerySectionData | null
  highlightsInclusions?: Record<string, any> | null
  whatsIncluded?: WhatsIncludedSectionData | null
  tagsAttributes?: Record<string, any> | null
  metadata?: { seo?: SeoMetadata; [key: string]: any } | null
  data?: Record<string, any> | null

  createdAt?: string
  updatedAt?: string
  [key: string]: any
}
