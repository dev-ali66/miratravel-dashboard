import { normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyGallery } from "./emptyGallery"

export function normalizeGallery(gallery: any) {
  const safe = gallery && typeof gallery === "object" ? gallery : {}

  const normalizedItems = Array.isArray(safe.items) && safe.items.length > 0
    ? safe.items.map((item: any, idx: number) => ({
        id: item.id || `gal-${idx + 1}`,
        type: item.type || "image",
        url: typeof item === "string" ? item : item.url || "",
        title: item.title || "",
        caption: item.caption || "",
      }))
    : emptyGallery.items

  return {
    ...safe,
    badge: safe.badge ?? emptyGallery.badge,
    title: safe.title ?? emptyGallery.title,
    description: safe.description ?? emptyGallery.description,
    items: normalizedItems,
    backgroundMultimedia: normalizeMultimedia(
      safe.backgroundMultimedia ?? safe.multimedia ?? emptyGallery.backgroundMultimedia
    ),
  }
}
