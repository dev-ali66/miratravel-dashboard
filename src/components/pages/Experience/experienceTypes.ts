export type StyledField = any
export type MultimediaObject = Record<string, any>

export type ExperienceType =
  | "CULTURE_HERITAGE"
  | "NATURE_WILDLIFE"
  | "ADVENTURE_OUTDOORS"
  | "FOOD_WINE"
  | "LOCAL_LIFE_TRADITIONS"
  | "ART_ARCHITECTURE"
  | "COASTAL_MARITIME"
  | "WELLNESS_SLOW_LIVING"

export type JourneyStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

export interface ExperienceTypeMeta {
  value: ExperienceType
  label: string
  scope: string
  badgeColor: string
}

export const EXPERIENCE_TYPE_CONFIG: Record<ExperienceType, ExperienceTypeMeta> = {
  CULTURE_HERITAGE: {
    value: "CULTURE_HERITAGE",
    label: "Culture & Heritage",
    scope: "Historical sites, archaeology, local history and heritage",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300",
  },
  NATURE_WILDLIFE: {
    value: "NATURE_WILDLIFE",
    label: "Nature & Wildlife",
    scope: "National parks, landscapes, wildlife and nature encounters",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  ADVENTURE_OUTDOORS: {
    value: "ADVENTURE_OUTDOORS",
    label: "Adventure & Outdoors",
    scope: "Hiking, kayaking, rafting, cycling, diving, active pursuits",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300",
  },
  FOOD_WINE: {
    value: "FOOD_WINE",
    label: "Food & Wine",
    scope: "Culinary tours, wine tastings, cooking classes, foraging, market visits",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300",
  },
  LOCAL_LIFE_TRADITIONS: {
    value: "LOCAL_LIFE_TRADITIONS",
    label: "Local Life & Traditions",
    scope: "Village visits, artisanal crafts, folklore, festivals, daily life immersion",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300",
  },
  ART_ARCHITECTURE: {
    value: "ART_ARCHITECTURE",
    label: "Art & Architecture",
    scope: "Museums, galleries, monuments, vernacular and classical architecture",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300",
  },
  COASTAL_MARITIME: {
    value: "COASTAL_MARITIME",
    label: "Coastal & Maritime",
    scope: "Sailing, boat excursions, coastal heritage, marine activities",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/60 dark:text-cyan-300",
  },
  WELLNESS_SLOW_LIVING: {
    value: "WELLNESS_SLOW_LIVING",
    label: "Wellness & Slow Living",
    scope: "Thermal baths, retreat experiences, scenic slow journeys, mindfulness",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300",
  },
}

export const EXPERIENCE_TYPES = Object.values(EXPERIENCE_TYPE_CONFIG)

export const EXPERIENCE_ATTRIBUTES = [
  { value: "PRIVATE", label: "Private" },
  { value: "EXCLUSIVE", label: "Exclusive Access" },
  { value: "FAMILY_FRIENDLY", label: "Family Friendly" },
  { value: "ACTIVE", label: "Active" },
  { value: "SEASONAL", label: "Seasonal" },
  { value: "BESPOKE", label: "Bespoke" },
]

export const EXPERIENCE_STATUS_OPTIONS: { label: string; value: JourneyStatus; color: string }[] = [
  { label: "Draft", value: "DRAFT", color: "bg-muted text-muted-foreground border-border" },
  { label: "Published", value: "PUBLISHED", color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300" },
  { label: "Archived", value: "ARCHIVED", color: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300" },
]

export interface ExperienceHighlightItem {
  id?: string
  title?: StyledField
  description?: StyledField
  badge?: string
}

export interface ExperiencePracticalInfo {
  duration?: StyledField
  season?: StyledField
  activityLevel?: StyledField
  groupSize?: StyledField
  locationNotes?: StyledField
}

export interface ExperienceMiraTouch {
  label?: StyledField
  title?: StyledField
  description?: StyledField
  items?: Array<{
    title?: StyledField
    description?: StyledField
  }>
  imageMultimedia?: MultimediaObject
}

export interface ExperienceEnquiryCta {
  title?: StyledField
  subtitle?: StyledField
  primaryButtonText?: string
  secondaryButtonText?: string
  badgeText?: string
  note?: StyledField
  backgroundMultimedia?: MultimediaObject
}

export interface ExperienceTheExperience {
  label?: StyledField
  title?: StyledField
  summary?: StyledField
  narrative?: StyledField
  quote?: StyledField
  imageMultimedia?: MultimediaObject
  backgroundMultimedia?: MultimediaObject
}

export interface ExperienceData {
  id?: string
  name: string
  slug?: string
  status?: JourneyStatus
  featured?: boolean

  // Classification
  primaryType: ExperienceType
  secondaryTypes: ExperienceType[]
  attributes: string[]

  // Commercial & Pricing
  price: number
  currency: string
  priceType?: string | null

  // Geography Linking
  countryId?: string | null
  country?: {
    id: string
    name: string
    slug?: string
    type?: string
  } | null
  regionId?: string | null
  region?: {
    id: string
    name: string
    slug?: string
    type?: string
  } | null
  placeId?: string | null
  place?: {
    id: string
    name: string
    slug?: string
    type?: string
  } | null
  parentId?: string | null
  parent?: {
    id: string
    name: string
    slug?: string
    type?: string
    hero?: any
  } | null

  // Editorial Sections
  subtitle?: string | null
  summary?: string | null
  theExperience?: ExperienceTheExperience | null
  highlights?: {
    label?: StyledField
    title?: StyledField
    items: ExperienceHighlightItem[]
  } | null
  practicalInfo?: ExperiencePracticalInfo | null
  miraTouch?: ExperienceMiraTouch | null
  enquiryCta?: ExperienceEnquiryCta | null

  // Related Entities
  journeys?: Array<{
    id: string
    title: string
    slug?: string
    hero?: any
    price?: number
    currency?: string
    status?: string
  }>
  stories?: Array<{
    id: string
    title: string
    slug?: string
    hero?: any
    status?: string
  }>

  // Multimedia & CMS
  hero?: {
    breadcrumb?: StyledField
    title?: StyledField
    subtitle?: StyledField
    description?: StyledField
    isCenter?: boolean
    buttons?: any[]
    backgroundMultimedia?: MultimediaObject
    multimedia?: MultimediaObject
    [key: string]: any
  } | null
  gallery?: {
    items?: Array<{
      multimedia?: MultimediaObject
      caption?: string
    }>
  } | null
  essence?: {
    label?: StyledField
    title?: StyledField
    paragraphs?: StyledField
    quote?: StyledField
    stat?: {
      statValue?: StyledField
      statLabel?: StyledField
      statBadgeBg?: string
    }
    imageMultimedia?: MultimediaObject
    backgroundMultimedia?: MultimediaObject
    multimedia?: MultimediaObject
    [key: string]: any
  } | null
  faq?: {
    title?: StyledField
    imageMultimedia?: MultimediaObject
    backgroundMultimedia?: MultimediaObject
    items?: Array<{
      question?: StyledField
      answer?: StyledField
      multimedia?: MultimediaObject
      imageMultimedia?: MultimediaObject
    }>
    [key: string]: any
  } | null
  geoData?: any
  metadata?: {
    seo?: {
      title?: string
      description?: string
      keywords?: string[]
      canonicalUrl?: string
      robots?: {
        index?: boolean
        follow?: boolean
      }
    }
    [key: string]: any
  } | null
  createdAt?: string
  updatedAt?: string
}

export type ExperienceSectionKey =
  | "basic-info"
  | "hero"
  | "the-experience"
  | "highlights"
  | "practical-info"
  | "mira-touch"
  | "related-journeys"
  | "enquiry-cta"
  | "essence"
  | "faq"
  | "seo"

export const EXPERIENCE_CURRENCY_OPTIONS = [
  { label: "EUR (€ - Euro)", value: "EUR" },
  { label: "USD ($ - US Dollar)", value: "USD" },
  { label: "GBP (£ - British Pound)", value: "GBP" },
  { label: "CHF (CHF - Swiss Franc)", value: "CHF" },
  { label: "ALL (Lek - Albanian Lek)", value: "ALL" },
]
