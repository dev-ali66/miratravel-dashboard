export interface ContactButton {
  label: string
  url: string
  style?: string
  action?: string
  backgroundColor?: string
  textColor?: string
}

export interface ContactMultimedia {
  type?: "image" | "video" | "color"
  url?: string
  alt?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  color?: string
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
  imageData?: ContactMultimedia
  videoData?: ContactMultimedia
}

export interface ContactHeroContent {
  breadcrumb?: any
  title?: any
  subtitle?: any
  description?: any
  buttons?: ContactButton[]
  backgroundMultimedia?: ContactMultimedia
  [key: string]: any
}

export interface ProcessItem {
  title: any
  description: any
}

export interface ContactProcessContent {
  title?: any
  items?: ProcessItem[]
  steps?: ProcessItem[]
  [key: string]: any
}

export interface ContactInquiryFormContent {
  eyebrow?: any
  title?: any
  rightSideMultimedia?: ContactMultimedia
  [key: string]: any
}

export interface ContactPlanTravelContent {
  label?: any
  title?: any
  titlegraphs?: any[]
  leftSideMultimedia?: ContactMultimedia
  [key: string]: any
}

export interface ContactInfoItem {
  id: string
  icon: string
  label: any
  value: any
  href?: string
}

export interface ContactInfoSectionContent {
  items?: ContactInfoItem[]
  [key: string]: any
}

export interface ContactCtaContent {
  title?: any
  description?: any
  buttons?: ContactButton[]
  buttonLabel?: any
  buttonHref?: any
  [key: string]: any
}

export interface ContactSection {
  key: string
  type: string
  order?: number
  content?: Record<string, any>
  [key: string]: any
}

export interface ContactPageData {
  name?: string
  slug?: string
  metadata?: {
    title?: string
    description?: string
    keywords?: string[]
    canonicalUrl?: string
    robots?: {
      index?: boolean
      follow?: boolean
    }
    [key: string]: any
  }
  data?: {
    page?: "contact-us"
    sections?: ContactSection[]
    [key: string]: any
  }
  [key: string]: any
}
