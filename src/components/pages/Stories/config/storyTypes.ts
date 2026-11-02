import type { SeoMetadata } from "@/components/pages/CMS/shared/SeoForm"

export type SeoPayload = SeoMetadata
export type StoryType =
  | "TRAVEL_ESSENTIALS"
  | "MIRA_EDITORIAL"
  | "NORMAL_STORY"
  | "travel_essentials"
  | "mira_editorial"
  | "normal_story"

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
  hero?: Record<string, any>
  blocks?: any[]
  blocksBackgroundMultimedia?: Record<string, any>
  faq?: Record<string, any>
  seo?: SeoPayload
  locations?: any[]
  journeys?: any[]
  manualRelatedStories?: any[]
  locationIds?: string[]
  journeyIds?: string[]
  manualRelatedStoryIds?: string[]
  [key: string]: any
}
