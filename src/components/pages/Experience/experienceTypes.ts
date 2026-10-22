import type { StyledField } from "../CMS/shared/FormControls"
import type { MultimediaObject } from "../CMS/shared/UniversalMultimediaForm"

export interface ExperienceData {
  id?: string
  name: string
  slug?: string
  featured?: boolean
  price?: number | null
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
