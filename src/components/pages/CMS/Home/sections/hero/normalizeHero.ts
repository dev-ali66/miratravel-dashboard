import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeHero(hero: any) {
  const safeHero = hero && typeof hero === "object" ? hero : {}

  const normalizedHero = {
    ...safeHero,
    title: normalizeStyledField(safeHero.title, "", "#FFFFFF"),
    description: normalizeStyledField(safeHero.description, "", "#FFFFFF"),
    breadcrumb: normalizeStyledField(safeHero.breadcrumb, "", null),
    subtitle: normalizeStyledField(safeHero.subtitle, "", null),
    isCenter: Boolean(safeHero.isCenter),
    buttons: normalizeButtonsArray(safeHero.buttons),
    backgroundMultimedia: normalizeMultimedia(
      safeHero.backgroundMultimedia ?? safeHero.multimedia
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
