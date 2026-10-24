import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "../../shared/normalizeHelpers"
import { emptyCharacter } from "./emptyCharacter"

export function normalizeCharacter(regionCharacter: any) {
  const safeChar = regionCharacter && typeof regionCharacter === "object" ? regionCharacter : {}

  const rawItems = Array.isArray(safeChar.items)
    ? safeChar.items
    : Array.isArray(safeChar.pillars)
      ? safeChar.pillars
      : (emptyCharacter.items ?? [])

  const normalizedItems = rawItems.map((p: any) => {
    const rawButtons = Array.isArray(p.buttons) && p.buttons.length > 0
      ? p.buttons
      : p.button
        ? [p.button]
        : (p.linkUrl || p.url || p.linkText)
          ? [{ label: p.linkText || "Explore", url: p.linkUrl || p.url || "" }]
          : []

    const itemObject = {
      title: normalizeStyledField(p.title, "", THEME_COLORS.primary),
      description: normalizeStyledField(p.description, "", THEME_COLORS.muted),
      buttons: normalizeButtonsArray(rawButtons),
      multimedia: normalizeMultimedia(p.multimedia ?? p.imageMultimedia),
    }

    delete (itemObject as any).titleStyle
    delete (itemObject as any).descriptionStyle
    delete (itemObject as any).style

    return itemObject
  })

  const normalizedCharacter = {
    ...safeChar,
    label: normalizeStyledField(safeChar.label ?? emptyCharacter.label, "CHARACTER", THEME_COLORS.accent),
    title: normalizeStyledField(safeChar.title ?? emptyCharacter.title, "", THEME_COLORS.primary),
    items: normalizedItems,
    backgroundMultimedia: normalizeMultimedia(safeChar.backgroundMultimedia || emptyCharacter.backgroundMultimedia),
    style: safeChar.style ?? null,
  }

  delete (normalizedCharacter as any).labelStyle
  delete (normalizedCharacter as any).titleStyle
  delete (normalizedCharacter as any).pillars

  return normalizedCharacter
}
