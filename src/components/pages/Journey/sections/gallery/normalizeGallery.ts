import { normalizeMultimedia, normalizeStyledField } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyGallery } from "./emptyGallery"

export function normalizeGallery(gallery: any) {
  const safe = gallery && typeof gallery === "object" ? gallery : {}

  const rawItems = Array.isArray(safe.items) && safe.items.length > 0 ? safe.items : emptyGallery.items

  const normalizedItems = rawItems.map((item: any) => ({
    type: item.type || (item.multimedia?.show === "video" ? "video" : "image"),
    title: normalizeStyledField(item.title ?? item, "", "#080c1d"),
    caption: normalizeStyledField(item.caption, "", "#565e69"),
    multimedia: normalizeMultimedia(item.multimedia ?? item.multimediaData ?? item.url ?? item),
  }))

  return {
    ...safe,
    badge: normalizeStyledField(safe.badge ?? emptyGallery.badge, "", "#af6348"),
    title: normalizeStyledField(safe.title ?? emptyGallery.title, "", "#080c1d"),
    description: normalizeStyledField(safe.description ?? emptyGallery.description, "", "#565e69"),
    items: normalizedItems,
    backgroundMultimedia: normalizeMultimedia(
      safe.backgroundMultimedia ?? safe.multimedia ?? emptyGallery.backgroundMultimedia
    ),
  }
}
