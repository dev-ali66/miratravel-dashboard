export interface HomeButton {
  label: string
  url: string
  style?: string
  action?: string
  backgroundColor?: string
  textColor?: string
}

export interface HomeImage {
  url?: string
  alt?: string
  device?: string
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
}

export interface HomeVideo {
  url?: string
  alt?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
}

export interface HomeMultimedia extends HomeImage {
  type?: "image" | "video" | "color"
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  imageData?: HomeMultimedia
  videoData?: HomeMultimedia
  color?: string
}

export interface HomeHeroContent {
  titleLine1?: any
  titleLine2?: any
  titleHighlight?: any
  description?: any
  backgroundMultimedia?: HomeMultimedia
  textColors?: Record<string, string>
  [key: string]: any
}

export interface HomeTrustBadge {
  url?: string
  text?: string
  rating?: number
  source?: string
}

export interface HomeExploreJourneysContent {
  title?: any
  eyebrow?: any
  subtitle?: any
  description?: any
  trustBadge?: HomeTrustBadge
  backgroundMultimedia?: HomeMultimedia
  [key: string]: any
}

export interface HomeDestinationsContent {
  title?: any
  eyebrow?: any
  subtitle?: any
  backgroundMultimedia?: HomeMultimedia
  [key: string]: any
}

export interface HomeStoryItem {
  url?: string
  index?: any
  title?: any
  subtitle?: any
  [key: string]: any
}

export interface HomeMiraStoriesContent {
  title?: any
  eyebrow?: any
  description?: any
  backgroundMultimedia?: HomeMultimedia
  leftSideMultimedia?: HomeMultimedia
  rightSideMultimedia?: HomeMultimedia
  [key: string]: any
}

export interface HomeWhyMiraContent {
  title?: any
  eyebrow?: any
  signature?: any
  paragraphs?: any[]
  backgroundMultimedia?: HomeMultimedia
  rightSideMultimedia?: HomeMultimedia
  [key: string]: any
}

export interface HomeTravelInsightsContent {
  title?: any
  eyebrow?: any
  subtitle?: any
  description?: any
  insightsList?: any[]
  backgroundMultimedia?: HomeMultimedia
  [key: string]: any
}

export interface HomeCustomJourneyCtaContent {
  titleLine1?: any
  titleHighlight?: any
  description?: any
  backgroundMultimedia?: HomeMultimedia
  [key: string]: any
}

export interface HomeSection {
  key: string
  type: string
  order?: number

  bgColor?: string

  /** Hero background mode. Only one mode can be active at a time. */
  backgroundType?: "image" | "video" | "color"

  /** When true the hero will render the video instead of the background image */
  showVideo?: boolean

  buttons?: HomeButton[]

  content?:
    | HomeHeroContent
    | HomeExploreJourneysContent
    | HomeDestinationsContent
    | HomeMiraStoriesContent
    | HomeWhyMiraContent
    | HomeTravelInsightsContent
    | HomeCustomJourneyCtaContent
    | Record<string, any>

  bgImages?: HomeImage[]

  bgVideos?: HomeVideo[]

  items?: HomeStoryItem[]

  sideImages?: HomeImage[]
  [key: string]: any
}

export interface HomeTheme {
  accentColor?: string
  primaryColor?: string
  textColorDark?: string
  textColorLight?: string
}

export interface HomePageData {
  name?: string

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
    page?: "home"

    theme?: HomeTheme

    sections?: HomeSection[]
    [key: string]: any
  }
  [key: string]: any
}
