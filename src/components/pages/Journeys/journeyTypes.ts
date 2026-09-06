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

export type ItineraryTextWithStyle = {
  text?: string
  style?: Record<string, any> | null
}

export type ItineraryLocationValue = {
  id?: string | null
  name?: string
  geoData?: {
    latitude?: number | null
    longitude?: number | null
  } | null
}

export type ItineraryMediaValue = {
  type?: "image" | "video" | "color"
  color?: string
  image?: {
    url?: string | null
    alt?: string | null
    opacity?: number
    overlayColor?: string | null
    overlayOpacity?: number
  }
  video?: {
    url?: string | null
    alt?: string | null
    poster?: string | null
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    opacity?: number
    overlayColor?: string | null
    overlayOpacity?: number
  }
  url?: string | null
  alt?: string | null
  opacity?: number
  overlayColor?: string | null
  overlayOpacity?: number
}

export type ItineraryDayItem = {
  id?: string
  dayNumber: number
  dayLabel?: string

  // Grouped structure: { eyebrow: {}, title: {}, location: {}, description: {}, itineraryMedia: {} }
  eyebrow?: string | ItineraryTextWithStyle
  title: string | ItineraryTextWithStyle
  location?: string | ItineraryLocationValue
  description: string | ItineraryTextWithStyle
  itineraryMedia?: ItineraryMediaValue | Record<string, any> | null

  // Flat fields for backwards compatibility
  eyebrowStyle?: Record<string, any> | null
  titleStyle?: Record<string, any> | null
  slug?: string
  subtitle?: string
  locationId?: string | null
  locationName?: string | null
  detailedHeading?: string
  descriptionStyle?: Record<string, any> | null
  multimedia?: Record<string, any> | null
  thumbnail?: string
  journeyItineraryImage?: string[]
  images?: string[]
  meals?: string
  accommodation?: string
  activities?: string[]
  metadata?: Record<string, any> | null
  data?: Record<string, any> | null
}

export function sanitizeFieldStyle(style: any): { textColor: string | null; backgroundColor: string | null } {
  if (typeof style === "object" && style !== null) {
    return {
      textColor: typeof style.textColor === "string" && style.textColor.trim() !== "" ? style.textColor : null,
      backgroundColor: typeof style.backgroundColor === "string" && style.backgroundColor.trim() !== "" ? style.backgroundColor : null,
    }
  }
  return {
    textColor: null,
    backgroundColor: null,
  }
}

export function getDayEyebrow(day: ItineraryDayItem): { text: string; style: { textColor: string | null; backgroundColor: string | null } } {
  if (typeof day.eyebrow === "object" && day.eyebrow !== null) {
    return { text: day.eyebrow.text || "", style: sanitizeFieldStyle(day.eyebrow.style || day.eyebrowStyle) }
  }
  return { text: (day.eyebrow as string) || "", style: sanitizeFieldStyle(day.eyebrowStyle) }
}

export function getDayTitle(day: ItineraryDayItem, defaultNum?: number): { text: string; style: { textColor: string | null; backgroundColor: string | null } } {
  if (typeof day.title === "object" && day.title !== null) {
    return { text: day.title.text || `Day ${day.dayNumber || defaultNum || 1}`, style: sanitizeFieldStyle(day.title.style || day.titleStyle) }
  }
  return { text: (day.title as string) || `Day ${day.dayNumber || defaultNum || 1}`, style: sanitizeFieldStyle(day.titleStyle) }
}

export function sanitizeLocation(loc: any): {
  id: string | null
  name: string
  geoData: {
    latitude: number | null
    longitude: number | null
  }
} {
  const cleanId =
    typeof loc?.id === "string" && loc.id.trim()
      ? loc.id.trim()
      : typeof loc?.locationId === "string" && loc.locationId.trim()
      ? loc.locationId.trim()
      : null
  const cleanName =
    typeof loc?.name === "string"
      ? loc.name
      : typeof loc?.locationName === "string"
      ? loc.locationName
      : typeof loc === "string"
      ? loc
      : ""

  const rawGeo = loc?.geoData
  const lat =
    typeof rawGeo?.latitude === "number"
      ? rawGeo.latitude
      : typeof rawGeo?.lat === "number"
      ? rawGeo.lat
      : null
  const lng =
    typeof rawGeo?.longitude === "number"
      ? rawGeo.longitude
      : typeof rawGeo?.lng === "number"
      ? rawGeo.lng
      : null

  return {
    id: cleanId,
    name: cleanName,
    geoData: {
      latitude: lat,
      longitude: lng,
    },
  }
}

export function getDayLocation(day: ItineraryDayItem): {
  id: string | null
  name: string
  geoData: {
    latitude: number | null
    longitude: number | null
  }
} {
  const rawLoc = day.location ?? { id: day.locationId, name: day.locationName }
  return sanitizeLocation(rawLoc)
}

export function getDayDescription(day: ItineraryDayItem): { text: string; style: { textColor: string | null; backgroundColor: string | null } } {
  if (typeof day.description === "object" && day.description !== null) {
    return { text: day.description.text || "", style: sanitizeFieldStyle(day.description.style || day.descriptionStyle) }
  }
  return { text: (day.description as string) || "", style: sanitizeFieldStyle(day.descriptionStyle) }
}

export function sanitizeMultimedia(rawMedia: any, fallbackAlt: string = ""): Record<string, any> {
  const m = rawMedia || {}
  const rawImg = m.image || m.imageData || {}
  const rawVid = m.video || m.videoData || {}

  const cleanStringOrNull = (val: any): string | null => {
    if (typeof val === "string" && val.trim() !== "") return val.trim()
    return null
  }

  const imgUrl = cleanStringOrNull(rawImg.url)
  const vidUrl = cleanStringOrNull(rawVid.url)
  const rootUrl = cleanStringOrNull(m.url)

  const mediaType: "image" | "video" | "color" =
    m.type === "video" || (!m.type && vidUrl)
      ? "video"
      : m.type === "color"
      ? "color"
      : "image"

  const url =
    mediaType === "video"
      ? (vidUrl || rootUrl || null)
      : mediaType === "image"
      ? (imgUrl || rootUrl || null)
      : null

  const imgAlt = cleanStringOrNull(rawImg.alt)
  const vidAlt = cleanStringOrNull(rawVid.alt)
  const rootAlt = cleanStringOrNull(m.alt)

  const alt =
    mediaType === "video"
      ? (vidAlt || rootAlt || (url ? (fallbackAlt || null) : null))
      : mediaType === "image"
      ? (imgAlt || rootAlt || (url ? (fallbackAlt || null) : null))
      : null

  const color = cleanStringOrNull(m.color) || "#F8F6F0"
  const poster = cleanStringOrNull(rawVid.poster || rawVid.posterUrl || m.posterUrl)

  return {
    type: mediaType,
    color,
    url,
    alt,
    image: {
      url: imgUrl || (mediaType === "image" ? url : null),
      alt: imgAlt || (mediaType === "image" ? alt : null),
      opacity: typeof rawImg.opacity === "number" ? rawImg.opacity : (typeof m.opacity === "number" ? m.opacity : 100),
      overlayColor: cleanStringOrNull(rawImg.overlayColor) || cleanStringOrNull(m.overlayColor) || "#000000",
      overlayOpacity: typeof rawImg.overlayOpacity === "number" ? rawImg.overlayOpacity : (typeof m.overlayOpacity === "number" ? m.overlayOpacity : 0),
    },
    video: {
      url: vidUrl || (mediaType === "video" ? url : null),
      alt: vidAlt || (mediaType === "video" ? alt : null),
      poster,
      autoplay: rawVid.autoplay ?? m.autoplay ?? true,
      loop: rawVid.loop ?? m.loop ?? true,
      muted: rawVid.muted ?? m.muted ?? true,
      opacity: typeof rawVid.opacity === "number" ? rawVid.opacity : (typeof m.opacity === "number" ? m.opacity : 100),
      overlayColor: cleanStringOrNull(rawVid.overlayColor) || cleanStringOrNull(m.overlayColor) || "#000000",
      overlayOpacity: typeof rawVid.overlayOpacity === "number" ? rawVid.overlayOpacity : (typeof m.overlayOpacity === "number" ? m.overlayOpacity : 0),
    },
  }
}

export function getDayMedia(day: ItineraryDayItem): Record<string, any> {
  const m = (day as any).itineraryMedia || day.multimedia || {}
  const dayTitle = typeof day.title === "object" && day.title !== null ? day.title.text : (day.title as string) || ""
  return sanitizeMultimedia(m, dayTitle)
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
  dayNumber?: number
  itemNumber?: number
  title: string
  slug?: string
  price: number
  currency?: string
  duration?: string
  dayLabel?: string
  detailedHeading?: string
  description: string
  thumbnail?: string
  image?: string
  journeyItineraryImage?: string[]
  locationId?: string | null
  metadata?: Record<string, any> | null
  data?: Record<string, any> | null
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
    buttons?: any[] | null
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
    backgroundMultimedia?: Record<string, any> | null
    philosophySection?: {
      eyebrow?: any
      title?: any
      description?: any
      items?: {
        title?: any
        description?: any
        iconMultimedia?: Record<string, any> | null
      }[]
    }
    accommodationSection?: {
      eyebrow?: any
      title?: any
      description?: any
      items?: {
        hotelName?: any
        location?: any
        nights?: any
        roomType?: any
        boardBasis?: any
        description?: any
        multimedia?: Record<string, any> | null
      }[]
    }
    standardsSection?: {
      title?: any
      description?: any
      items?: {
         title?: any
         description?: any
      }[]
    }
    visualsSection?: {
      title?: any
      description?: any
      mediaItems?: Record<string, any>[]
    }

    // Legacy fields for backward compatibility
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
  itineraryData?: any

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
  itineraryData?: ItineraryDayItem[]
  accommodations?: any | null
  addOns?: any[]
  addons?: AddonItem[]

  createdAt?: string
  updatedAt?: string
}

export function sanitizeItineraryDay(day: any, index: number): ItineraryDayItem {
  const dayNum = typeof day?.dayNumber === "number" ? day.dayNumber : index + 1
  const defaultTitle = `Day ${dayNum}: Exploration & Discovery`

  const dayData = day?.data && typeof day.data === "object" ? day.data : {}
  const dayMeta = day?.metadata && typeof day.metadata === "object" ? day.metadata : {}

  // 1. Eyebrow: strictly { text, style: { textColor, backgroundColor } }
  const rawEyebrow = day?.eyebrow ?? dayData?.eyebrow ?? dayMeta?.eyebrow
  const rawEyebrowStyle = day?.eyebrowStyle ?? dayData?.eyebrowStyle ?? dayMeta?.eyebrowStyle
  const eyebrow =
    typeof rawEyebrow === "object" && rawEyebrow !== null
      ? {
          text: rawEyebrow.text ?? "",
          style: sanitizeFieldStyle(rawEyebrow.style ?? rawEyebrowStyle),
        }
      : {
          text: typeof rawEyebrow === "string" ? rawEyebrow : "",
          style: sanitizeFieldStyle(rawEyebrowStyle),
        }

  // 2. Title: strictly { text, style: { textColor, backgroundColor } }
  const rawTitle = day?.title ?? dayData?.title ?? dayMeta?.title
  const rawTitleStyle = day?.titleStyle ?? dayData?.titleStyle ?? dayMeta?.titleStyle
  const title =
    typeof rawTitle === "object" && rawTitle !== null
      ? {
          text: rawTitle.text ?? defaultTitle,
          style: sanitizeFieldStyle(rawTitle.style ?? rawTitleStyle),
        }
      : {
          text: typeof rawTitle === "string" && rawTitle.trim() ? rawTitle : defaultTitle,
          style: sanitizeFieldStyle(rawTitleStyle),
        }

  // 3. Location: strictly { id, name, geoData: { latitude, longitude } }
  const rawLoc = day?.location ?? dayData?.location ?? dayMeta?.location
  const location = sanitizeLocation(
    typeof rawLoc === "object" && rawLoc !== null
      ? rawLoc
      : {
          id: day?.locationId ?? dayData?.locationId ?? null,
          name: typeof rawLoc === "string" ? rawLoc : (day?.locationName ?? dayData?.locationName ?? ""),
          geoData: day?.geoData ?? dayData?.geoData ?? null,
        }
  )

  // 4. Description: strictly { text, style: { textColor, backgroundColor } }
  const rawDesc = day?.description ?? dayData?.description ?? dayMeta?.description
  const rawDescStyle = day?.descriptionStyle ?? dayData?.descriptionStyle ?? dayMeta?.descriptionStyle
  const description =
    typeof rawDesc === "object" && rawDesc !== null
      ? {
          text: rawDesc.text ?? "",
          style: sanitizeFieldStyle(rawDesc.style ?? rawDescStyle),
        }
      : {
          text: typeof rawDesc === "string" ? rawDesc : "",
          style: sanitizeFieldStyle(rawDescStyle),
        }

  // 5. ItineraryMedia: strictly { type, color, url, alt, image: {}, video: {} }
  const rawMedia =
    day?.itineraryMedia ||
    dayData?.itineraryMedia ||
    day?.multimedia ||
    dayData?.multimedia ||
    (day?.journeyItineraryImage?.[0]
      ? { type: "image", url: day.journeyItineraryImage[0] }
      : {})
  const itineraryMedia = sanitizeMultimedia(rawMedia, title.text)

  return {
    dayNumber: dayNum,
    dayLabel: day?.dayLabel || dayData?.dayLabel || `Day ${dayNum}`,
    eyebrow,
    title,
    location,
    description,
    itineraryMedia,
    ...(day?.id ? { id: day.id } : {}),
  }
}

export function getJourneyItineraryDays(journey?: Journey | null): ItineraryDayItem[] {
  if (!journey) return []

  // Check authoritative user-edited arrays first (respect empty array if user deleted all cards)
  if (Array.isArray((journey as any).itineraryData)) {
    return (journey as any).itineraryData.map((d: any, idx: number) => sanitizeItineraryDay(d, idx))
  }
  if (Array.isArray(journey.itineraryDays)) {
    return journey.itineraryDays.map((d: any, idx: number) => sanitizeItineraryDay(d, idx))
  }
  if (Array.isArray((journey.data as any)?.itineraryData)) {
    return (journey.data as any).itineraryData.map((d: any, idx: number) => sanitizeItineraryDay(d, idx))
  }
  if (Array.isArray(journey.data?.itinerary)) {
    return (journey.data as any).itinerary.map((d: any, idx: number) => sanitizeItineraryDay(d, idx))
  }

  let rawDays: any[] = []

  const candidates = [
    (journey.data as any)?.itinerary?.days,
    (journey.data as any)?.itinerarySection?.days,
    (journey.data as any)?.dayByDay?.days,
    journey.itinerary,
  ]

  for (const cand of candidates) {
    if (Array.isArray(cand) && cand.length > 0) {
      rawDays = cand
      break
    }
  }

  return rawDays.map((d, idx) => sanitizeItineraryDay(d, idx))
}

export function getJourneyAddons(journey: Journey): AddonItem[] {
  if (Array.isArray(journey.addons) && journey.addons.length > 0) {
    return journey.addons
  }

  if (Array.isArray(journey.addOns) && journey.addOns.length > 0) {
    return journey.addOns
  }

  const addons = journey.data?.addons
  if (Array.isArray(addons) && addons.length > 0) {
    return addons
  }

  if (
    addons &&
    typeof addons === "object" &&
    Array.isArray((addons as { items?: unknown }).items) &&
    (addons as { items: AddonItem[] }).items.length > 0
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
  | "tags"
  | "overview"
  | "highlights"
  | "itinerary"
  | "accommodation"
  | "addons"
  | "gallery"
  | "seo"

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
