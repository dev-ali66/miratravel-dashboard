import { emptyVideoBlock } from "./emptyVideoBlock"
import { createDefaultMultimedia } from "../shared/defaultMediaHelper"
import { normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"

export function normalizeVideoBlock(rawBlock: any = {}) {
  const rawItems = Array.isArray(rawBlock?.items)
    ? rawBlock.items
    : Array.isArray(rawBlock?.videoItems)
    ? rawBlock.videoItems
    : []

  const items = rawItems.map((item: any) =>
    normalizeMultimedia(item?.multimedia || item, createDefaultMultimedia("video"))
  )

  const multimedia = normalizeMultimedia(
    rawBlock?.multimedia || (items.length > 0 ? items[0] : null),
    createDefaultMultimedia("video")
  )

  return {
    ...emptyVideoBlock,
    type: "video",
    title: {
      ...emptyVideoBlock.title,
      ...(rawBlock?.title || {}),
    },
    multimedia,
    items,
  }
}
