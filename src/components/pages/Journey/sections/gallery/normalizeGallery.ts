import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyGallery } from "./emptyGallery"

export function normalizeGallery(gallery: any) {
  const safe = gallery && typeof gallery === "object" ? gallery : {}

  const rawItems = Array.isArray(safe.items) && safe.items.length > 0 ? safe.items : emptyGallery.items

  const normalizedItems = rawItems.map((item: any) => ({
    type: item.type || (item.multimedia?.show === "video" ? "video" : "image"),
    title: normalizeStyledField(item.title ?? item, "", THEME_COLORS.dark),
    caption: normalizeStyledField(item.caption, "", THEME_COLORS.muted),
    multimedia: normalizeMultimedia(item.multimedia ?? item.multimediaData ?? item.url ?? item),
  }))

  return {
    ...safe,
    badge: normalizeStyledField(safe.badge ?? emptyGallery.badge, "", THEME_COLORS.accent),
    title: normalizeStyledField(safe.title ?? emptyGallery.title, "", THEME_COLORS.dark),
    description: normalizeStyledField(safe.description ?? emptyGallery.description, "", THEME_COLORS.muted),
    items: normalizedItems,
    backgroundMultimedia: normalizeMultimedia(
      safe.backgroundMultimedia ?? safe.multimedia ?? emptyGallery.backgroundMultimedia
    ),
  }
}
