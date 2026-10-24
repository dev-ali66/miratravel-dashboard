import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyHero } from "./emptyHero"

export function normalizeHero(hero: any) {
  const safeHero = hero && typeof hero === "object" ? hero : {}

  const normalizedHero = {
    ...safeHero,
    title: normalizeStyledField(safeHero.title ?? emptyHero.title, "", THEME_COLORS.white),
    description: normalizeStyledField(safeHero.description ?? emptyHero.description, "", THEME_COLORS.white),
    breadcrumb: normalizeStyledField(safeHero.breadcrumb ?? emptyHero.breadcrumb, "", null),
    subtitle: normalizeStyledField(safeHero.subtitle ?? emptyHero.subtitle, "", null),
    isCenter: safeHero.isCenter !== undefined ? Boolean(safeHero.isCenter) : emptyHero.isCenter,
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
