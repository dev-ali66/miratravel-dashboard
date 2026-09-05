import type { FieldStyle } from "../shared/FormControls"

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
  apiUrl?: string
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
  name?: string
  mediaUrl?: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  row?: number
  icon?: string
  options?: ContactFieldOption[]
  pattern?: string
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  errorMessage?: string
  requiredErrorMessage?: string
  labelStyle?: FieldStyle
  nameStyle?: FieldStyle
  placeholderStyle?: FieldStyle
  requiredErrorStyle?: FieldStyle
  errorStyle?: FieldStyle
  fieldStyle?: FieldStyle
  mediaType?: "image" | "video" | "file" | "multimedia"
  allowedExtensions?: string
}

export interface ContactSectionContent {
  eyebrow?: string
  title?: string
  titleLine1?: string
  titleLine2?: string
  description?: string
  contentMultimedia?: Record<string, any>
  leftMultimedia?: Record<string, any>
  sideMultimedia?: Record<string, any>
  contactHeroEyebrowStyle?: FieldStyle
  contactHeroTitleLine1Style?: FieldStyle
  contactHeroTitleLine2Style?: FieldStyle
  contactHeroDescriptionStyle?: FieldStyle
  contactStepsTitleStyle?: FieldStyle
  contactSectionEyebrowStyle?: FieldStyle
  contactSectionTitleStyle?: FieldStyle
  contactSectionDescriptionStyle?: FieldStyle
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
  contactMultimedia?: Record<string, any>
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
