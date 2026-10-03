export interface NewsletterCmsSubscribeData {
  title?: any
  subtitle?: any
  leftSideMultimedia?: any
  backgroundMultimedia?: any
}

export interface NewsletterCmsUnsubscribeData {
  title?: any
  unsubscribedTitle?: any
  subtitle?: any
  unsubscribedSubtitle?: any
  reasonsTitle?: any
  reasonsList?: string[]
  leftSideMultimedia?: any
  backgroundMultimedia?: any
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
  subscribe: NewsletterCmsSubscribeData
  unsubscribe: NewsletterCmsUnsubscribeData
  hero?: NewsletterCmsSubscribeData
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
  subscribe?: NewsletterCmsSubscribeData
  unsubscribe?: NewsletterCmsUnsubscribeData
  hero?: NewsletterCmsSubscribeData
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
