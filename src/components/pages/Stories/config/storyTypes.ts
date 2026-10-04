import type { SeoMetadata } from "@/components/pages/CMS/shared/SeoForm"

export type SeoPayload = SeoMetadata
export type StoryType = "short_story" | "long_story" | "guidance"

export interface StoryData {
  id?: string
  title?: string
  slug?: string
  type?: StoryType
  status?: "DRAFT" | "PUBLISHED"
  featured?: boolean
  recommended?: boolean
  authorName?: string
  authorRole?: string
  readTime?: string
  categories?: string[]
  category?: string
  description?: string
  image?: string
  templateType?: string
  detail?: Record<string, any>
  hero?: Record<string, any>
  intro?: Record<string, any>
  blocks?: any[]
  practicalNotes?: any
  seo?: SeoPayload
  locations?: any[]
  journeys?: any[]
  manualRelatedStories?: any[]
  locationIds?: string[]
  journeyIds?: string[]
  manualRelatedStoryIds?: string[]
  [key: string]: any
}
