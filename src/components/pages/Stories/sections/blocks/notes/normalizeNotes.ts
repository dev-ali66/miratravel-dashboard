import { THEME_COLORS } from "@/config/theme"
import { emptyNotesBlock, emptyNotesItem } from "./emptyNotes"

export function normalizeNotesBlock(rawBlock: any = {}) {
  const rawItems = Array.isArray(rawBlock?.items)
    ? rawBlock.items
    : Array.isArray(rawBlock?.notesItems)
    ? rawBlock.notesItems
    : []

  const items = rawItems.map((item: any) => {
    const rawDesc = item?.description?.value !== undefined ? item.description.value : (item?.description || item?.content || "")

    return {
      description: {
        value: String(rawDesc || ""),
        textColor: item?.description?.textColor || emptyNotesItem.description.textColor,
        textOpacity: item?.description?.textOpacity ?? 1,
        backgroundColor: item?.description?.backgroundColor || null,
        backgroundOpacity: item?.description?.backgroundOpacity ?? 1,
      },
      content: String(rawDesc || ""),
    }
  })

  const rawDescValue =
    rawBlock?.description?.value ??
    (typeof rawBlock?.description === "string"
      ? rawBlock.description
      : rawBlock?.title?.value ??
        (typeof rawBlock?.title === "string" ? rawBlock.title : emptyNotesBlock.description.value))

  const descObj = {
    value: String(rawDescValue || ""),
    textColor: rawBlock?.description?.textColor || rawBlock?.title?.textColor || emptyNotesBlock.description.textColor,
    textOpacity: rawBlock?.description?.textOpacity ?? rawBlock?.title?.textOpacity ?? 1,
    backgroundColor: rawBlock?.description?.backgroundColor || rawBlock?.title?.backgroundColor || null,
    backgroundOpacity: rawBlock?.description?.backgroundOpacity ?? rawBlock?.title?.backgroundOpacity ?? 1,
  }

  return {
    type: "notes" as const,
    description: descObj,
    title: descObj,
    items,
  }
}
