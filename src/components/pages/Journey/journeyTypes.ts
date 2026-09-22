import type { CmsButton } from "@/components/pages/CMS/shared/ButtonsField"

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
  label?: any
  title?: any
  subtitle?: any
  badge?: any
  buttons?: CmsButton[]
  background_image?: string
  video?: string
  backgroundMultimedia?: any
  style?: Record<string, any> | null
}

export interface OverviewHighlightItem {
  id: string
  title: any
  description?: any
  icon?: string
}

export interface OverviewSectionData {
  badge?: any
  title?: any
  subtitle?: any
  overviewText?: any
  highlightsList?: OverviewHighlightItem[]
  routeSummary?: any
  featuresList?: any[]
  backgroundMultimedia?: any
  style?: Record<string, any> | null
}

export interface ItineraryDayItem {
  id: string
  dayNumber: number
  title: any
  subtitle?: any
  duration?: any
  location?: any
  description?: any
  meals?: string[]
  activities?: string[]
  highlights?: string[]
  stayName?: any
  image?: string
  imageMultimedia?: any
  style?: Record<string, any> | null
}

export interface ItineraryChapter {
  id: string
  chapterNumber: any // e.g. "Chapter I", "Chapter II"
  title: any // e.g. "The Beginning", "Into the Mountains"
  subtitle?: any // e.g. "Days 1–3 · Tirana & surroundings"
  description?: any
  days: ItineraryDayItem[]
}

export interface ItinerarySectionData {
  badge?: any
  title?: any
  description?: any
  daysList?: ItineraryDayItem[]
  chaptersList?: ItineraryChapter[]
  backgroundMultimedia?: any
  style?: Record<string, any> | null
}

export interface AccommodationStayItem {
  id: string
  name: any
  stayType?: any
  city?: any
  duration?: any
  nights?: number
  description?: any
  image?: string
  imageMultimedia?: any
  amenities?: any
  websiteUrl?: string
  style?: Record<string, any> | null
}

export interface AccommodationsSectionData {
  badge?: any
  title?: any
  description?: any
  staysList?: AccommodationStayItem[]
  backgroundMultimedia?: any
  style?: Record<string, any> | null
}

export interface WhatsIncludedItem {
  id: string
  category?: any
  title: any
  description?: any
  icon?: string
}

export interface WhatsIncludedSectionData {
  badge?: any
  title?: any
  description?: any
  inclusions?: WhatsIncludedItem[]
  exclusions?: WhatsIncludedItem[]
  notes?: any[]
  backgroundMultimedia?: any
  style?: Record<string, any> | null
}

export interface AddOnItem {
  id: string
  title: any
  category?: any
  duration?: any
  price?: number
  currency?: string
  description?: any
  image?: string
  imageMultimedia?: any
  features?: any
  style?: Record<string, any> | null
}

export interface AddOnsSectionData {
  badge?: any
  title?: any
  description?: any
  itemsList?: AddOnItem[]
  backgroundMultimedia?: any
  style?: Record<string, any> | null
}

export interface GalleryMediaItem {
  id: string
  title?: any
  type: string
  url?: string
  multimedia?: any
  thumbnail?: string
  caption?: any
}

export interface GallerySectionData {
  badge?: any
  title?: any
  description?: any
  items?: GalleryMediaItem[]
  backgroundMultimedia?: any
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
