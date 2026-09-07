export const JourneyType = {
  PRIVATE_JOURNEY: "PRIVATE_JOURNEY",
  SELF_DRIVE_JOURNEY: "SELF_DRIVE_JOURNEY",
  SMALL_GROUP: "SMALL_GROUP",
  LUXURY_ESCAPE: "LUXURY_ESCAPE",
  FAMILY_JOURNEY: "FAMILY_JOURNEY",
} as const;
export type JourneyType = typeof JourneyType[keyof typeof JourneyType];

export const TravelStyle = {
  CULTURE_HERITAGE: "CULTURE_HERITAGE",
  NATURE: "NATURE",
  ADVENTURE: "ADVENTURE",
  FOOD_WINE: "FOOD_WINE",
  COASTAL_ESCAPE: "COASTAL_ESCAPE",
  MOUNTAINS: "MOUNTAINS",
  SLOW_TRAVEL: "SLOW_TRAVEL",
  LUXURY: "LUXURY",
  PHOTOGRAPHY: "PHOTOGRAPHY",
  WELLNESS: "WELLNESS",
} as const;
export type TravelStyle = typeof TravelStyle[keyof typeof TravelStyle];

export const PerfectFor = {
  COUPLES: "COUPLES",
  FAMILIES: "FAMILIES",
  FRIENDS: "FRIENDS",
  FOOD_WINE: "FOOD_WINE",
  SOLO_TRAVELLERS: "SOLO_TRAVELLERS",
  HONEYMOONERS: "HONEYMOONERS",
  FIRST_TIME_VISITORS: "FIRST_TIME_VISITORS",
  RETURNING_VISITORS: "RETURNING_VISITORS",
  NATURE_LOVERS: "NATURE_LOVERS",
  ADVENTURE_SEEKERS: "ADVENTURE_SEEKERS",
} as const;
export type PerfectFor = typeof PerfectFor[keyof typeof PerfectFor];

export const Pace = {
  RELAXED: "RELAXED",
  BALANCED: "BALANCED",
  ACTIVE: "ACTIVE",
} as const;
export type Pace = typeof Pace[keyof typeof Pace];

export const ComfortLevel = {
  COMFORT: "COMFORT",
  BOUTIQUE: "BOUTIQUE",
  PREMIUM_LUXURY: "PREMIUM_LUXURY",
} as const;
export type ComfortLevel = typeof ComfortLevel[keyof typeof ComfortLevel];

export const JourneyStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
export type JourneyStatus = typeof JourneyStatus[keyof typeof JourneyStatus];

export interface JourneyItinerary {
  id: string
  journeyId: string
  dayNumber: number
  title: string
  slug: string
  description?: string
  journeyItineraryImage: string[]
  locationId?: string
  metadata?: Record<string, any>
  data?: Record<string, any>
  deletedAt?: string
  createdAt: string
  updatedAt: string
}

export interface JourneyAddOn {
  id: string
  journeyId: string
  dayNumber: number
  title: string
  slug: string
  price: string | number
  description?: string
  journeyItineraryImage: string[]
  locationId?: string
  metadata?: Record<string, any>
  data?: Record<string, any>
  deletedAt?: string
  createdAt: string
  updatedAt: string
}

export interface JourneyData {
  id: string
  slug: string
  title: string
  subtitle?: string
  price: string | number
  currency: string
  minDays: number
  maxDays: number
  pace: Pace
  comfortLevel: ComfortLevel
  status: JourneyStatus
  
  journeyHeroImage: string[]
  journeyGallery: string[]
  highlights: string[]
  included: string[]
  notIncluded: string[]

  journeyType: JourneyType[]
  travelStyle: TravelStyle[]
  perfectFor: PerfectFor[]

  featured: boolean

  metadata?: Record<string, any>
  data?: Record<string, any>

  itinerary?: JourneyItinerary[]
  accommodations?: Record<string, any>
  addOns?: JourneyAddOn[]
  bookings?: any[]

  deletedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedJourneysResponse {
  data: JourneyData[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
