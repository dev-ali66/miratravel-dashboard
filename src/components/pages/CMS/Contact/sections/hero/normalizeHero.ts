import {
  normalizeMultimedia,
  normalizeStyledField,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyHero } from "./emptyHero"

export function normalizeHero(hero: any) {
  const safeHero = hero && typeof hero === "object" ? hero : {}

  const normalizedHero = {
    ...emptyHero,
    ...safeHero,
    title: normalizeStyledField(
      safeHero.title,
      emptyHero.title.value,
      "#FFFFFF"
    ),
    description: normalizeStyledField(
      safeHero.description,
      emptyHero.description.value,
      "#FFFFFF"
    ),
    breadcrumb: normalizeStyledField(
      safeHero.breadcrumb,
      emptyHero.breadcrumb.value,
      "#E5A84B"
    ),
    subtitle: normalizeStyledField(
      safeHero.subtitle,
      emptyHero.subtitle.value,
      "#E5E7EB"
    ),
    isCenter: Boolean(safeHero.isCenter),
    buttons: normalizeButtonsArray(safeHero.buttons ?? emptyHero.buttons),
    backgroundMultimedia: normalizeMultimedia(
      safeHero.backgroundMultimedia ?? safeHero.multimedia ?? emptyHero.backgroundMultimedia
    ),
  }

  delete (normalizedHero as any).key
  delete (normalizedHero as any).type
  delete (normalizedHero as any).background_image
  delete (normalizedHero as any).video
  delete (normalizedHero as any).showVideo
  delete (normalizedHero as any).button
  delete (normalizedHero as any).titleStyle
  delete (normalizedHero as any).breadcrumbStyle
  delete (normalizedHero as any).descriptionStyle
  delete (normalizedHero as any).multimedia

  return normalizedHero
}

export default normalizeHero
