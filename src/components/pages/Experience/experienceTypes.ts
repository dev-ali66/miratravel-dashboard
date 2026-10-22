export type StyledField = any
export type MultimediaObject = Record<string, any>

export interface ExperienceData {
  id?: string
  name: string
  slug?: string
  featured?: boolean
  price: number
  currency: string
  priceType?: string | null
  parentId?: string | null
  parent?: {
    id: string
    name: string
    slug?: string
    type?: string
    hero?: any
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
  createdAt?: string
  updatedAt?: string
}

export type ExperienceSectionKey =
  | "basic-info"
  | "hero"
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

