export type StoryTemplateType = 'long-story' | 'short-story' | 'guide-story' | 'editorial-story' | string;

export interface CmsButton {
  label: string
  url: string
  variant?: string
  style?: "primary" | "outline" | "secondary" | "link" | string
  rounded?: string
  backgroundColor?: string
  backgroundOpacity?: number
  textColor?: string
  textOpacity?: number
  hoverBackgroundColor?: string
  hoverTextColor?: string
  target?: string
  showIcon?: boolean
  [key: string]: any
}

export interface PracticalNoteItem {
  title: string
  content: string
}

export interface ArticleBlock {
  id: string
  type: 'paragraph' | 'heading' | 'quote' | 'image' | 'spotlight' | 'gallery' | 'practical-notes'
  title?: string
  text?: string
  textStyle?: Record<string, any>
  url?: string
  secondUrl?: string
  layout?: 'image-left' | 'image-right' | 'full'
  caption?: string
  captionStyle?: Record<string, any>
  multimedia?: Record<string, any>
  secondMultimedia?: Record<string, any>
  items?: PracticalNoteItem[]
  highlights?: string[]
}

export interface StoryDetail {
  breadcrumb?: Record<string, any>
  title?: Record<string, any>
  subtitle?: Record<string, any>
  description?: Record<string, any>
  isCenter?: boolean
  tagPlace?: string
  tagTheme?: string
  tagLens?: string
  destinationPlace?: string
  journeyIds?: string[]
  manualRelatedStoryIds?: string[]
  author?: string
  authorStyle?: Record<string, any>
  authorTitle?: string
  authorTitleStyle?: Record<string, any>
  backgroundMultimedia?: Record<string, any>
  heroMultimedia?: Record<string, any>
  heroBackgroundStyle?: Record<string, any>
  titleStyle?: Record<string, any>
  descriptionStyle?: Record<string, any>
  readTimeStyle?: Record<string, any>
  buttons?: CmsButton[]
  blocks?: ArticleBlock[]
  [key: string]: any
}

export interface Story {
  id: string
  slug: string
  category: string
  categories?: string[]
  title: string
  description: string
  readTime?: string
  image?: string
  templateType: StoryTemplateType
  detail?: StoryDetail
  createdAt?: string
  updatedAt?: string
}
