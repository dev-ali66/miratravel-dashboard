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
    breadcrumb: normalizeStyledField(src.breadcrumb || src.eyebrow, emptyJourneyCmsHero.breadcrumb.value, "#E5E7EB"),
    title: normalizeStyledField(src.title, emptyJourneyCmsHero.title.value, "#ffffff"),
    subtitle: normalizeStyledField(src.subtitle, emptyJourneyCmsHero.subtitle.value, "#E5E7EB"),
    description: normalizeStyledField(src.description, emptyJourneyCmsHero.description.value, "#E5E7EB"),
    isCenter: Boolean(src.isCenter),
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyJourneyCmsHero.backgroundMultimedia
    ),
  }
}
