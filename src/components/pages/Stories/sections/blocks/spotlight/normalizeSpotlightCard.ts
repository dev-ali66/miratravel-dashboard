import { emptySpotlightCard } from "./emptySpotlightCard"
import { createDefaultMultimedia } from "../shared/defaultMediaHelper"
import { normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"

export function normalizeSpotlightCard(rawBlock: any = {}) {
  const mediaPosition = rawBlock?.mediaPosition === "right" ? "right" : "left"

  const rawItems = Array.isArray(rawBlock?.items)
    ? rawBlock.items
    : Array.isArray(rawBlock?.spotlightItems)
    ? rawBlock.spotlightItems
    : []

  const items = rawItems.map((item: any) =>
    normalizeMultimedia(item?.multimedia || item, createDefaultMultimedia("image"))
  )

  const multimedia = normalizeMultimedia(
    rawBlock?.multimedia || (items.length > 0 ? items[0] : null),
    createDefaultMultimedia("image")
  )

  return {
    ...emptySpotlightCard,
    type: "spotlight",
    title: {
      ...emptySpotlightCard.title,
      ...(rawBlock?.title || {}),
    },
    content: {
      ...emptySpotlightCard.content,
      ...(rawBlock?.content || {}),
    },
    mediaPosition,
    multimedia,
    items,
  }
}
