import type { FieldStyle } from "../shared/FormControls"

export interface CtaButton {
  label: string
  url: string
  style?: string
  action?: string
}

export interface CtaPageData {
  name: string
  metadata: {
    title: string
    description: string
    keywords: string[]
    canonicalUrl: string
    robots: {
      index: boolean
      follow: boolean
    }
  }
  data: {
    page: "cta"
    eyebrow: string
    titleLine1: string
    titleHighlight: string
    description: string
    bgColor: string
    bgImage: {
      ctaLeftImage: string
      alt: string
    }
    backgroundMultimedia?: Record<string, any>
    rightMultimedia?: Record<string, any>
    eyebrowStyle?: FieldStyle
    titleLine1Style?: FieldStyle
    titleHighlightStyle?: FieldStyle
    descriptionStyle?: FieldStyle
    buttons: CtaButton[]
  }
}
