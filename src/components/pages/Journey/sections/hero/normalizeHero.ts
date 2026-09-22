import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyHero } from "./emptyHero"

export function normalizeHero(hero: any) {
  const safeHero = hero && typeof hero === "object" ? hero : {}

  const normalizedHero = {
    ...safeHero,
    label: normalizeStyledField(safeHero.label ?? emptyHero.label, "", "#af6348"),
    badge: normalizeStyledField(safeHero.badge ?? emptyHero.badge, "", "#af6348"),
    title: normalizeStyledField(safeHero.title ?? emptyHero.title, "", "#FFFFFF"),
    subtitle: normalizeStyledField(safeHero.subtitle ?? emptyHero.subtitle, "", "#E5E7EB"),
    buttons: normalizeButtonsArray(safeHero.buttons ?? emptyHero.buttons),
    backgroundMultimedia: normalizeMultimedia(
      safeHero.backgroundMultimedia ?? safeHero.multimedia ?? emptyHero.backgroundMultimedia
    ),
  }

  delete (normalizedHero as any).background_image
  delete (normalizedHero as any).video
  delete (normalizedHero as any).showVideo
  delete (normalizedHero as any).multimedia

  return normalizedHero
}
