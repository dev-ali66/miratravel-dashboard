import type { StoryData, StoryType } from "../config/storyTypes"
import { normalizeBlocks } from "../sections/blocks/normalizeBlocks"
import { emptyStory } from "./emptyStory"

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function normalizeStoryPayload(raw: Partial<StoryData> | null | undefined): StoryData {
  if (!raw || typeof raw !== "object") {
    return { ...emptyStory }
  }

  const title = (raw.title || "").trim()

  const categories = Array.isArray(raw.categories)
    ? raw.categories
    : raw.category
    ? [raw.category]
    : []

  const rawType = (raw.type || raw.templateType || "short_story") as StoryType
  const storyType: StoryType = ["short_story", "long_story", "guidance"].includes(rawType)
    ? rawType
    : "short_story"

  const locations = Array.isArray(raw.locations) && raw.locations.length > 0
    ? raw.locations.map((l: any) => (typeof l === "string" ? l : l?.id)).filter(Boolean)
    : Array.isArray(raw.locationIds)
    ? raw.locationIds
    : []

  const journeys = Array.isArray(raw.journeys) && raw.journeys.length > 0
    ? raw.journeys.map((j: any) => (typeof j === "string" ? j : j?.id)).filter(Boolean)
    : Array.isArray(raw.journeyIds)
    ? raw.journeyIds
    : []

  const manualRelatedStories = Array.isArray(raw.manualRelatedStories) && raw.manualRelatedStories.length > 0
    ? raw.manualRelatedStories.map((s: any) => (typeof s === "string" ? s : s?.id)).filter(Boolean)
    : Array.isArray(raw.manualRelatedStoryIds)
    ? raw.manualRelatedStoryIds
    : []

  const payload: StoryData = {
    id: raw.id || undefined,
    title,
    type: storyType,
    status: raw.status || "DRAFT",
    readTime: raw.readTime || "",
    authorName: raw.authorName || "",
    authorRole: raw.authorRole || "",
    featured: Boolean(raw.featured),
    recommended: Boolean(raw.recommended),
    categories,
    hero: raw.hero || emptyStory.hero,
    intro: raw.intro || emptyStory.intro,
    blocks: Array.isArray(raw.blocks) ? normalizeBlocks(raw.blocks) : [],
    practicalNotes: raw.practicalNotes !== undefined ? raw.practicalNotes : emptyStory.practicalNotes,
    seo: raw.seo || {},
    locations,
    journeys,
    manualRelatedStories,
  }

  return payload
}

export default normalizeStoryPayload
