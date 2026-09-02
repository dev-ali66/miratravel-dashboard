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
    buttons: CtaButton[]
  }
}