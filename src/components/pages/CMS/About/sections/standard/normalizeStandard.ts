import { THEME_COLORS } from "@/config/theme"
import { emptyStandard, emptyStandardItemIcon } from "./emptyStandard"
import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeStandard(input: any) {
  const raw = input || {}
  const rawItems = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.features)
    ? raw.features
    : emptyStandard.items

  const items = rawItems.map((item: any) => {
    const rawTitle = typeof item?.title === "string" ? { value: item.title } : item?.title
    const rawDesc = typeof item?.description === "string" ? { value: item.description } : item?.description
    const rawIcon = item?.icon ?? item?.multimedia ?? emptyStandardItemIcon

    return {
      title: normalizeStyledField(rawTitle, "Standard Feature", THEME_COLORS.accentWarm),
      description: normalizeStyledField(rawDesc, "", THEME_COLORS.sub),
      icon: normalizeMultimedia(rawIcon, "image"),
    }
  })

  const rawMedia = raw.multimedia || raw.leftSideMultimedia || raw.image

  const res = {
    ...emptyStandard,
    ...raw,
    eyebrow: normalizeStyledField(raw.eyebrow, emptyStandard.eyebrow.value, THEME_COLORS.accentWarm),
    title: normalizeStyledField(raw.title, emptyStandard.title.value, THEME_COLORS.primary),
    multimedia: normalizeMultimedia(rawMedia, emptyStandard.multimedia.show),
    items,
    backgroundMultimedia: normalizeMultimedia(
      raw.backgroundMultimedia,
      emptyStandard.backgroundMultimedia.show
    ),
  }

  delete (res as any).key
  delete (res as any).type
  delete (res as any).features
  delete (res as any).leftSideMultimedia
  return res
}

export default normalizeStandard
