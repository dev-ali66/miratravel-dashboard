import { THEME_COLORS } from "@/config/theme"
import {
  normalizeStyledField,
  normalizeMultimedia,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyHero } from "./emptyHero"

export function normalizeHero(rawHero: any): typeof emptyHero {
  if (!rawHero || typeof rawHero !== "object") return emptyHero

  const src = rawHero.hero || rawHero.content || rawHero

  return {
    breadcrumb: normalizeStyledField(src.breadcrumb || src.eyebrow, emptyHero.breadcrumb.value, THEME_COLORS.mediaPlaceholder),
    title: normalizeStyledField(src.title, emptyHero.title.value, THEME_COLORS.white),
    subtitle: normalizeStyledField(src.subtitle, emptyHero.subtitle.value, THEME_COLORS.mediaPlaceholder),
    description: normalizeStyledField(src.description, emptyHero.description.value, THEME_COLORS.mediaPlaceholder),
    isCenter: Boolean(src.isCenter),
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyHero.backgroundMultimedia
    ),
  }
}
