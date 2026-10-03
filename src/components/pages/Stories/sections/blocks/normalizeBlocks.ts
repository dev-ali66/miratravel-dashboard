import { normalizeParagraph } from "./paragraph"
import { normalizeQuote } from "./quote"
import { normalizeImageBlock } from "./image"
import { normalizeVideoBlock } from "./video"
import { normalizeSpotlightCard } from "./spotlight"
import { normalizeGuidanceBlock } from "./guidance"
import { normalizeNotesBlock } from "./notes"
import { emptyBlocksBackgroundMultimedia } from "./emptyBlocks"
import { normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"

export function normalizeBlockItem(rawBlock: any = {}) {
  const type = rawBlock?.type || "paragraph"

  switch (type) {
    case "paragraph":
      return normalizeParagraph(rawBlock)
    case "quote":
      return normalizeQuote(rawBlock)
    case "image":
      return normalizeImageBlock(rawBlock, (m: any) => normalizeMultimedia(m, "image"))
    case "video":
      return normalizeVideoBlock(rawBlock)
    case "spotlight":
      return normalizeSpotlightCard(rawBlock)
    case "guidance":
    case "guideline":
      return normalizeGuidanceBlock(rawBlock)
    case "notes":
      return normalizeNotesBlock(rawBlock)
    default:
      return normalizeParagraph(rawBlock)
  }
}

export function normalizeBlocks(blocksData: any[]) {
  if (!Array.isArray(blocksData)) return []
  return blocksData.map((block) => normalizeBlockItem(block))
}

export function normalizeBlocksBackgroundMultimedia(bgData: any) {
  return normalizeMultimedia(bgData, emptyBlocksBackgroundMultimedia)
}
