export interface ContactMetadata {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  robots?: Record<string, any>
}

export interface ContactImage {
  url?: string
  alt?: string
  device?: "desktop" | "mobile"
}

export interface ContactButton {
  label: string
  url: string
  style?: string
  action?: string
}

export interface ContactVideo {
  url: string
  poster?: string
  alt?: string
  device?: "desktop" | "mobile"
}

export interface ProcessItem {
  id: string
  index: string
  title: string
  description: string
}

export interface ContactInfoItem {
  id: string
  icon?: string
  label: string
  value: string
  url?: string | null
}

export interface ContactFieldOption {
  value: string
  label: string
  default?: boolean
}

export interface ContactField {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  row?: number
  icon?: string
  options?: ContactFieldOption[]
}

export interface ContactSectionContent {
  eyebrow?: string
  title?: string
  titleLine1?: string
  titleLine2?: string
  description?: string
  paragraphs?: string[]
}

export interface ContactSection {
  key: string
  type: string
  order: number
  bgColor?: string


  bgImages?: ContactImage

  bgVideos?: ContactVideo[]

  content?: ContactSectionContent

  items?: ProcessItem[] | ContactInfoItem[]

  fields?: ContactField[]

  sideImages?: ContactImage[]

  buttons?: ContactButton[]
}

export interface ContactPageData {
  name: string

  metadata: ContactMetadata

  data: {
    title?: string
    description?: string
    sections: ContactSection[]
  }
}