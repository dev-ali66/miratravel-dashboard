/* =====================================================
   JOURNEYS — TYPE DEFINITIONS
   Matches Prisma schema backend and frontend design system
===================================================== */

export type JourneyType =
  | "PRIVATE_JOURNEY"
  | "SELF_DRIVE_JOURNEY"
  | "SMALL_GROUP"
  | "LUXURY_ESCAPE"
  | "FAMILY_JOURNEY"

export const JOURNEY_TYPES: { label: string; value: JourneyType }[] = [
  { label: "Private Journey", value: "PRIVATE_JOURNEY" },
  { label: "Self-Drive Journey", value: "SELF_DRIVE_JOURNEY" },
  { label: "Small Group", value: "SMALL_GROUP" },
  { label: "Luxury Escape", value: "LUXURY_ESCAPE" },
  { label: "Family Journey", value: "FAMILY_JOURNEY" },
]

export type TravelStyle =
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

export const TRAVEL_STYLES: { label: string; value: TravelStyle }[] = [
  { label: "Culture & Heritage", value: "CULTURE_HERITAGE" },
  { label: "Nature", value: "NATURE" },
  { label: "Adventure", value: "ADVENTURE" },
  { label: "Food & Wine", value: "FOOD_WINE" },
  { label: "Coastal Escape", value: "COASTAL_ESCAPE" },
  { label: "Mountains", value: "MOUNTAINS" },
  { label: "Slow Travel", value: "SLOW_TRAVEL" },
  { label: "Luxury", value: "LUXURY" },
  { label: "Photography", value: "PHOTOGRAPHY" },
  { label: "Wellness", value: "WELLNESS" },
]

export type PerfectFor =
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

export const PERFECT_FOR: { label: string; value: PerfectFor }[] = [
  { label: "Couples", value: "COUPLES" },
  { label: "Families", value: "FAMILIES" },
  { label: "Friends", value: "FRIENDS" },
  { label: "Food & Wine", value: "FOOD_WINE" },
  { label: "Solo Travellers", value: "SOLO_TRAVELLERS" },
  { label: "Honeymooners", value: "HONEYMOONERS" },
  { label: "First-Time Visitors", value: "FIRST_TIME_VISITORS" },
  { label: "Returning Visitors", value: "RETURNING_VISITORS" },
  { label: "Nature Lovers", value: "NATURE_LOVERS" },
  { label: "Adventure Seekers", value: "ADVENTURE_SEEKERS" },
]

export type Pace = "RELAXED" | "BALANCED" | "ACTIVE"
export const PACES: { label: string; value: Pace }[] = [
  { label: "Relaxed", value: "RELAXED" },
  { label: "Balanced", value: "BALANCED" },
  { label: "Active", value: "ACTIVE" },
]

export type ComfortLevel = "COMFORT" | "BOUTIQUE" | "PREMIUM_LUXURY"
export const COMFORT_LEVELS: { label: string; value: ComfortLevel }[] = [
  { label: "Comfort", value: "COMFORT" },
  { label: "Boutique", value: "BOUTIQUE" },
  { label: "Premium Luxury", value: "PREMIUM_LUXURY" },
]

export type JourneyStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"
export const JOURNEY_STATUSES: { label: string; value: JourneyStatus }[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
]

/* =====================================================
   SUB-ENTITIES
===================================================== */

export type ItineraryDayItem = {
  id?: string
  dayNumber: number
  dayLabel?: string
  title: string
  subtitle?: string
  location?: string
  detailedHeading?: string
  description: string
  thumbnail?: string
  journeyItineraryImage?: string[]
  images?: string[]
  meals?: string
  accommodation?: string
  activities?: string[]
  locationId?: string | null
  metadata?: Record<string, any> | null
  data?: Record<string, any> | null
}

export type AccommodationStayItem = {
  // Legacy fields
  step?: string
  duration?: string
  stayType?: string
  confirmationBadge?: string
  // Editor fields
  hotelName: string
  location: string
  nights: number
  roomType?: string
  description?: string
  amenities?: string[]
  images?: string[]
  image?: string
  rating?: number
}

export type AccommodationPrincipleItem = {
  title: string
  description: string
  icon?: string
}

export type AddonItem = {
  id?: string
  itemNumber?: number
  title: string
  price: number
  currency?: string
  duration?: string
  dayLabel?: string
  detailedHeading?: string
  description: string
  thumbnail?: string
  image?: string
}

export type RouteStopItem = {
  name?: string
  days?: string
  destination?: string
  nights?: number
  order?: number
  coordinates?: { lat: number; lng: number }
  highlights?: string
  summary?: string
}

/* =====================================================
   DATA JSON SHAPE
===================================================== */

export type JourneyDataContent = {
  hero?: {
    title?: string | null
    subtitle?: string | null
    background_image?: string | null
    video?: string | null
    backgroundMultimedia?: Record<string, any> | null
    badge?: string | null
    tags?: string[]
    highlightBadge?: string | null
    priceSuffix?: string | null
    occupancyText?: string | null
    taxesLabel?: string | null
    taxesValue?: string | null
    ctaText?: string | null
    contactPromptText?: string | null
    benefits?: string[]
    media?: {
      type: "image" | "video"
      src: string
      alt?: string
    }
  } | null

  whyWeDesigned?: {
    title?: string | null
    paragraphs?: string[]
    signature?: string | null
    quote?: string | null
  } | null

  isThisForYou?: {
    title?: string | null
    items?: string[]
  } | null

  overviewList?: {
    title?: string | null
    titlegraphs?: string[]
    highlightsTitle?: string | null
    highlights?: string[]
  } | null

  route?: {
    title?: string | null
    description?: string | null
    mapImage?: string | null
    mapOverviewImage?: string | null
    stops?: RouteStopItem[]
  } | null

  accommodation?: {
    philosophy?: any
    stays?: AccommodationStayItem[]
    destinations?: {
      badge?: string | null
      title?: string | null
      description?: string | null
      stays?: AccommodationStayItem[]
    } | null
  } | null

  whatsIncluded?: {
    includedTitle?: string | null
    includedItems?: string[]
    notIncludedTitle?: string | null
    notIncludedItems?: string[]
    importantInfoTitle?: string | null
    importantInfoItems?: string[]
    importantInfo?: string[]
  } | null

  addons?: any

  itinerary?: any

  gallery?: {
    title?: string | null
    images?: {
      url: string
      caption?: string
      alt?: string
    }[]
  } | null

  [key: string]: any
}

/* =====================================================
   CORE JOURNEY MODEL
===================================================== */

export type Journey = {
  id?: string
  slug: string
  title: string
  subtitle?: string | null
  price: number
  currency: string
  minDays: number
  maxDays: number

  journeyHeroImage: string[]
  journeyGallery: string[]
  highlights: string[]
  included: string[]
  notIncluded: string[]

  journeyType: JourneyType[]
  travelStyle: TravelStyle[]
  perfectFor: PerfectFor[]
  pace: Pace
  comfortLevel: ComfortLevel

  status: JourneyStatus
  featured: boolean

  metadata?: {
    seo?: {
      title?: string | null
      description?: string | null
      keywords?: string[]
      canonicalUrl?: string | null
      robots?: {
        index?: boolean
        follow?: boolean
      }
    } | null
    [key: string]: any
  } | null

  data?: JourneyDataContent | null

  itinerary?: ItineraryDayItem[]
  itineraryDays?: ItineraryDayItem[]
  accommodations?: any | null
  addOns?: any[]
  addons?: AddonItem[]

  createdAt?: string
  updatedAt?: string
}

export function getJourneyItineraryDays(journey: Journey): ItineraryDayItem[] {
  if (Array.isArray(journey.itineraryDays)) {
    return journey.itineraryDays
  }

  if (Array.isArray(journey.itinerary)) {
    return journey.itinerary
  }

  const itinerary = journey.data?.itinerary
  if (Array.isArray(itinerary)) {
    return itinerary
  }

  if (
    itinerary &&
    typeof itinerary === "object" &&
    Array.isArray((itinerary as { days?: unknown }).days)
  ) {
    return (itinerary as { days: ItineraryDayItem[] }).days
  }

  return []
}

export function getJourneyAddons(journey: Journey): AddonItem[] {
  if (Array.isArray(journey.addons)) {
    return journey.addons
  }

  if (Array.isArray(journey.addOns)) {
    return journey.addOns
  }

  const addons = journey.data?.addons
  if (Array.isArray(addons)) {
    return addons
  }

  if (
    addons &&
    typeof addons === "object" &&
    Array.isArray((addons as { items?: unknown }).items)
  ) {
    return (addons as { items: AddonItem[] }).items
  }

  return []
}

export function getJourneyAccommodationStays(
  journey: Journey
): AccommodationStayItem[] {
  const accommodation = journey.data?.accommodation
  const rawStays = Array.isArray(accommodation?.stays)
    ? accommodation.stays
    : Array.isArray(accommodation?.destinations?.stays)
      ? accommodation.destinations.stays
      : []

  return rawStays.map((stay: AccommodationStayItem) => ({
    ...stay,
    hotelName: stay.hotelName || stay.stayType || "Selected Property",
    nights: stay.nights || Number.parseInt(stay.duration || "", 10) || 0,
    images: stay.images?.length
      ? stay.images
      : stay.image
        ? [stay.image]
        : [],
  }))
}

export function getJourneyAccommodationPhilosophy(journey: Journey): string {
  const philosophy = journey.data?.accommodation?.philosophy
  if (typeof philosophy === "string") {
    return philosophy
  }

  if (philosophy && typeof philosophy === "object") {
    return philosophy.description || philosophy.title || ""
  }

  return ""
}

export type JourneySectionKey =
  | "basic-info"
  | "hero"
  | "tags-attributes"
  | "why-designed"
  | "highlights-inclusions"
  | "itinerary"
  | "accommodations"
  | "addons"
  | "gallery"
  | "seo"

export const journeySectionOrder: JourneySectionKey[] = [
  "basic-info",
  "hero",
  "tags-attributes",
  "why-designed",
  "highlights-inclusions",
  "itinerary",
  "accommodations",
  "addons",
  "gallery",
  "seo",
]
