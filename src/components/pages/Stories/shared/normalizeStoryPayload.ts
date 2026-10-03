import type { StoryData } from "../config/storyTypes"
import { normalizeBlocks } from "../sections/blocks/normalizeBlocks"
import { emptyStory } from "./emptyStory"

export function normalizeStoryPayload(raw: Partial<StoryData> | null | undefined): StoryData {
  if (!raw || typeof raw !== "object") {
    return { ...emptyStory }
  }

  const payload: StoryData = {
    ...emptyStory,
    ...raw,
  }

  // Ensure boolean flags
  payload.featured = Boolean(raw.featured)
  payload.recommended = Boolean(raw.recommended)

  // Ensure categories array
  if (Array.isArray(raw.categories)) {
    payload.categories = raw.categories
  } else if (raw.category) {
    payload.categories = [raw.category]
  } else {
    payload.categories = []
  }

  payload.category = raw.category || (payload.categories.length > 0 ? payload.categories[0] : "")

  // Ensure blocks normalization
  if (Array.isArray(raw.blocks)) {
    payload.blocks = normalizeBlocks(raw.blocks)
  } else {
    payload.blocks = []
  }

  // Ensure arrays
  payload.locationIds = Array.isArray(raw.locationIds) ? raw.locationIds : []
  payload.journeyIds = Array.isArray(raw.journeyIds) ? raw.journeyIds : []
  payload.manualRelatedStoryIds = Array.isArray(raw.manualRelatedStoryIds) ? raw.manualRelatedStoryIds : []
  payload.practicalNotes = Array.isArray(raw.practicalNotes) ? raw.practicalNotes : []

  return payload
}

export default normalizeStoryPayload
