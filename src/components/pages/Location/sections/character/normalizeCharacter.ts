import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "../../shared/normalizeHelpers"

export function normalizeCharacter(regionCharacter: any) {
  const safeChar = regionCharacter && typeof regionCharacter === "object" ? regionCharacter : {}

  const rawItems = Array.isArray(safeChar.items)
    ? safeChar.items
    : Array.isArray(safeChar.pillars)
      ? safeChar.pillars
      : []

  const normalizedItems = rawItems.map((p: any, idx: number) => {
    const rawButtons = Array.isArray(p.buttons) && p.buttons.length > 0
      ? p.buttons
      : p.button
        ? [p.button]
        : (p.linkUrl || p.url || p.linkText)
          ? [{ label: p.linkText || "Explore", url: p.linkUrl || p.url || "" }]
          : []

    const itemObject = {
      title: normalizeStyledField(p.title, "", "#182d09"),
      description: normalizeStyledField(p.description, "", "#565e69"),
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
    label: normalizeStyledField(safeChar.label, "CHARACTER", "#af6348"),
    title: normalizeStyledField(safeChar.title, "", "#182d09"),
    items: normalizedItems,
    backgroundMultimedia: normalizeMultimedia(safeChar.backgroundMultimedia),
    style: safeChar.style ?? null,
  }

  delete (normalizedCharacter as any).labelStyle
  delete (normalizedCharacter as any).titleStyle
  delete (normalizedCharacter as any).pillars

  return normalizedCharacter
}
