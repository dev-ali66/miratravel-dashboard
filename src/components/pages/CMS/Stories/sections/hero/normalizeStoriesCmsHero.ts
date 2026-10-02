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
    breadcrumb: normalizeStyledField(src.breadcrumb || src.eyebrow, emptyStoriesCmsHero.breadcrumb.value, "#E5E7EB"),
    title: normalizeStyledField(src.title, emptyStoriesCmsHero.title.value, "#ffffff"),
    subtitle: normalizeStyledField(src.subtitle, emptyStoriesCmsHero.subtitle.value, "#E5E7EB"),
    description: normalizeStyledField(src.description, emptyStoriesCmsHero.description.value, "#E5E7EB"),
    isCenter: Boolean(src.isCenter),
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyStoriesCmsHero.backgroundMultimedia
    ),
  }
}
