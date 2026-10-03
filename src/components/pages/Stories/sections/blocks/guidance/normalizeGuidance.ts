import { emptyGuidanceBlock } from "./emptyGuidance"
import { createDefaultMultimedia } from "../shared/defaultMediaHelper"
import { normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"

export function normalizeGuidanceBlock(rawBlock: any = {}) {
  const mediaPosition = rawBlock?.mediaPosition === "right" ? "right" : "left"

  const rawItems = Array.isArray(rawBlock?.items)
    ? rawBlock.items
    : []

  const items = rawItems.map((item: any) =>
    normalizeMultimedia(item?.multimedia || item, createDefaultMultimedia("image"))
  )

  const multimedia = normalizeMultimedia(
    rawBlock?.multimedia || (items.length > 0 ? items[0] : null),
    createDefaultMultimedia("image")
  )

  const experiences = Array.isArray(rawBlock?.experiences)
    ? rawBlock.experiences.map((exp: any) => (typeof exp === "string" ? exp : exp?.text || String(exp)))
    : emptyGuidanceBlock.experiences

  return {
    ...emptyGuidanceBlock,
    type: "guidance",
    title: {
      ...emptyGuidanceBlock.title,
      ...(rawBlock?.title || {}),
    },
    content: {
      ...emptyGuidanceBlock.content,
      ...(rawBlock?.content || {}),
    },
    experiencesTitle: {
      ...emptyGuidanceBlock.experiencesTitle,
      ...(rawBlock?.experiencesTitle || {}),
    },
    knowledgeTitle: {
      ...emptyGuidanceBlock.knowledgeTitle,
      ...(rawBlock?.knowledgeTitle || {}),
    },
    knowledgeContent: {
      ...emptyGuidanceBlock.knowledgeContent,
      ...(rawBlock?.knowledgeContent || {}),
    },
    routeInfo: {
      ...emptyGuidanceBlock.routeInfo,
      ...(rawBlock?.routeInfo || {}),
    },
    mediaPosition,
    multimedia,
    items,
    experiences,
  }
}
