export interface NewsletterCmsHeroData {
  title?: any
  subtitle?: any
  buttonText?: any
  inputPlaceholder?: any
  emailLabel?: any
  image?: {
    url?: string
    alt?: string
    fit?: string
    width?: string
    height?: string
    opacity?: number
  }
  backgroundMultimedia?: any
  links?: {
    exploreJourneys?: {
      label?: string
      url?: string
    }
    returnHome?: {
      label?: string
      url?: string
    }
  }
}

export interface NewsletterCmsSeoData {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  robots?: {
    index: boolean
    follow: boolean
  }
}

export interface NewsletterCmsPayloadData {
  page: string
  hero: NewsletterCmsHeroData
}

export interface NewsletterCmsPayload {
  id?: string
  name: string
  slug: string
  page: string
  metadata: {
    title?: string
    description?: string
    keywords?: string[]
    canonicalUrl?: string
    robots?: {
      index: boolean
      follow: boolean
    }
    seo?: NewsletterCmsSeoData
  }
  data: NewsletterCmsPayloadData
  hero?: NewsletterCmsHeroData
}

export interface NewsletterCmsPreviewSectionProps {
  draft: NewsletterCmsPayload
}

export interface NewsletterCmsFormSectionProps {
  draft: any
  updateField: (fieldPath: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}
