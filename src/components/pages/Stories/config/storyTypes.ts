import type { SeoMetadata } from "@/components/pages/CMS/shared/SeoForm"

export type SeoPayload = SeoMetadata
export type StoryType =
  | "travel_ease"
  | "mira_editorial"
  | "normal_story"
  | "short_story"
  | "long_story"
  | "guidance"

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
  seo?: SeoPayload
  locations?: any[]
  journeys?: any[]
  manualRelatedStories?: any[]
  locationIds?: string[]
  journeyIds?: string[]
  manualRelatedStoryIds?: string[]
  [key: string]: any
}
