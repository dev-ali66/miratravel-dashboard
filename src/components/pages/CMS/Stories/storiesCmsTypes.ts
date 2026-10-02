export interface StoriesCmsHeroData {
  breadcrumb?: any
  title?: any
  subtitle?: any
  description?: any
  isCenter?: boolean
  buttons?: any[]
  backgroundMultimedia?: any
}

export interface StoriesCmsMiraStoriesData {
  eyebrow?: any
  title?: any
  description?: any
  items?: any[]
  backgroundMultimedia?: any
  leftSideMultimedia?: any
  buttons?: any[]
}

export interface StoriesCmsSeoData {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  robots?: {
    index: boolean
    follow: boolean
  }
}

export interface StoriesCmsPayloadData {
  page: string
  hero: StoriesCmsHeroData
  mira_stories: StoriesCmsMiraStoriesData
}

export interface StoriesCmsPayload {
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
    seo?: StoriesCmsSeoData
  }
  data: StoriesCmsPayloadData
  hero?: StoriesCmsHeroData
  mira_stories?: StoriesCmsMiraStoriesData
}

export interface StoriesCmsPreviewSectionProps {
  draft: StoriesCmsPayload
}

export interface StoriesCmsFormSectionProps {
  draft: any
  updateField: (fieldPath: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

