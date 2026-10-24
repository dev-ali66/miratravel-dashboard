import { THEME_COLORS } from "@/config/theme"
import {
  normalizeStyledField,
  normalizeMultimedia,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyStoriesCmsHero } from "./emptyStoriesCmsHero"

export function normalizeStoriesCmsHero(rawHero: any): typeof emptyStoriesCmsHero {
  if (!rawHero || typeof rawHero !== "object") return emptyStoriesCmsHero

  const src = rawHero.hero || rawHero.content || rawHero

  return {
    breadcrumb: normalizeStyledField(src.breadcrumb || src.eyebrow, emptyStoriesCmsHero.breadcrumb.value, THEME_COLORS.mediaPlaceholder),
    title: normalizeStyledField(src.title, emptyStoriesCmsHero.title.value, THEME_COLORS.white),
    subtitle: normalizeStyledField(src.subtitle, emptyStoriesCmsHero.subtitle.value, THEME_COLORS.mediaPlaceholder),
    description: normalizeStyledField(src.description, emptyStoriesCmsHero.description.value, THEME_COLORS.mediaPlaceholder),
    isCenter: Boolean(src.isCenter),
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyStoriesCmsHero.backgroundMultimedia
    ),
  }
}
