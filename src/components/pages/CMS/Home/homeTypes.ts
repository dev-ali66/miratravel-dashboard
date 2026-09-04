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
}

export interface HomeHeroContent {
  titleLine1?: string
  titleLine2?: string
  titleHighlight?: string
  description?: string
  backgroundMultimedia?: HomeMultimedia
  textColors?: {
    titleLine1?: string
    titleLine2?: string
    titleHighlight?: string
    description?: string
  }
}

export interface HomeTrustBadge {
  url?: string
  text?: string
  rating?: number
  source?: string
}

export interface HomeExploreJourneysContent {
  title?: string
  eyebrow?: string
  subtitle?: string
  description?: string
  trustBadge?: HomeTrustBadge
  backgroundMultimedia?: HomeMultimedia
}

export interface HomeDestinationsContent {
  title?: string
  eyebrow?: string
  subtitle?: string
  backgroundMultimedia?: HomeMultimedia
}

export interface HomeStoryItem {
  url?: string
  index?: string
  title?: string
  subtitle?: string
}

export interface HomeMiraStoriesContent {
  title?: string
  eyebrow?: string
  description?: string
  backgroundMultimedia?: HomeMultimedia
  leftSideMultimedia?: HomeMultimedia
  rightSideMultimedia?: HomeMultimedia
}

export interface HomeWhyMiraContent {
  title?: string
  eyebrow?: string
  signature?: string
  paragraphs?: string[]
  backgroundMultimedia?: HomeMultimedia
  rightSideMultimedia?: HomeMultimedia
}

export interface HomeTravelInsightsContent {
  title?: string
  eyebrow?: string
  description?: string
  backgroundMultimedia?: HomeMultimedia
}

export interface HomeCustomJourneyCtaContent {
  titleLine1?: string
  titleHighlight?: string
  description?: string
  backgroundMultimedia?: HomeMultimedia
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

  bgImages?: HomeImage[]

  bgVideos?: HomeVideo[]

  items?: HomeStoryItem[]

  sideImages?: HomeImage[]
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
  }

  data?: {
    page?: "home"

    theme?: HomeTheme

    sections?: HomeSection[]
  }
}