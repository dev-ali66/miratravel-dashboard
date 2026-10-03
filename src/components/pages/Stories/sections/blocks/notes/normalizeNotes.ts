import { emptyNotesBlock } from "./emptyNotes"

export function normalizeNotesBlock(rawBlock: any = {}) {
  const rawItems = Array.isArray(rawBlock?.items)
    ? rawBlock.items
    : Array.isArray(rawBlock?.notesItems)
    ? rawBlock.notesItems
    : emptyNotesBlock.items

  const items = rawItems.map((item: any) => ({
    title: item?.title || "",
    content: item?.content || (typeof item?.value === "string" ? item.value : ""),
  }))

  return {
    ...emptyNotesBlock,
    type: "notes",
    title: {
      ...emptyNotesBlock.title,
      ...(rawBlock?.title || {}),
    },
    subtitle: {
      ...emptyNotesBlock.subtitle,
      ...(rawBlock?.subtitle || {}),
    },
    items,
  }
}
