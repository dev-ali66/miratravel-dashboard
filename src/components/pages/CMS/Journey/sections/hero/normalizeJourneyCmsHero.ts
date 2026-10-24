import { THEME_COLORS } from "@/config/theme"
import {
  normalizeStyledField,
  normalizeMultimedia,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyJourneyCmsHero } from "./emptyJourneyCmsHero"

export function normalizeJourneyCmsHero(rawHero: any): typeof emptyJourneyCmsHero {
  if (!rawHero || typeof rawHero !== "object") return emptyJourneyCmsHero

  const src = rawHero.hero || rawHero.content || rawHero

  return {
    breadcrumb: normalizeStyledField(src.breadcrumb || src.eyebrow, emptyJourneyCmsHero.breadcrumb.value, THEME_COLORS.mediaPlaceholder),
    title: normalizeStyledField(src.title, emptyJourneyCmsHero.title.value, THEME_COLORS.white),
    subtitle: normalizeStyledField(src.subtitle, emptyJourneyCmsHero.subtitle.value, THEME_COLORS.mediaPlaceholder),
    description: normalizeStyledField(src.description, emptyJourneyCmsHero.description.value, THEME_COLORS.mediaPlaceholder),
    isCenter: Boolean(src.isCenter),
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyJourneyCmsHero.backgroundMultimedia
    ),
  }
}
