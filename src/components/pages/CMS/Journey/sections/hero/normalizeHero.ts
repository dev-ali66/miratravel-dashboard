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
    breadcrumb: normalizeStyledField(src.breadcrumb || src.eyebrow, emptyHero.breadcrumb.value, "#E5E7EB"),
    title: normalizeStyledField(src.title, emptyHero.title.value, "#ffffff"),
    subtitle: normalizeStyledField(src.subtitle, emptyHero.subtitle.value, "#E5E7EB"),
    description: normalizeStyledField(src.description, emptyHero.description.value, "#E5E7EB"),
    isCenter: Boolean(src.isCenter),
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyHero.backgroundMultimedia
    ),
  }
}
