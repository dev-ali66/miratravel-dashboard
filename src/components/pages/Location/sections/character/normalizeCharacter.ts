import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "../../shared/normalizeHelpers"

export function normalizeCharacter(regionCharacter: any) {
  const safeChar = regionCharacter && typeof regionCharacter === "object" ? regionCharacter : {}

  const rawPillars = Array.isArray(safeChar.pillars)
    ? safeChar.pillars
    : Array.isArray(safeChar.items)
      ? safeChar.items
      : []

  const normalizedPillars = rawPillars.map((p: any, idx: number) => {
    const rawButtons = Array.isArray(p.buttons) && p.buttons.length > 0
      ? p.buttons
      : p.button
        ? [p.button]
        : (p.linkUrl || p.url || p.linkText)
          ? [{ label: p.linkText || "Explore", url: p.linkUrl || p.url || "" }]
          : []

    const pillarObject = {
      id: p.id || `pillar-${idx}-${Date.now()}`,
      title: normalizeStyledField(p.title, "", "#182d09"),
      description: normalizeStyledField(p.description, "", "#565e69"),
      buttons: normalizeButtonsArray(rawButtons),
      multimedia: normalizeMultimedia(p.multimedia ?? p.imageMultimedia),
    }

    delete (pillarObject as any).titleStyle
    delete (pillarObject as any).descriptionStyle
    delete (pillarObject as any).style

    return pillarObject
  })

  const normalizedCharacter = {
    ...safeChar,
    label: normalizeStyledField(safeChar.label, "CHARACTER", "#af6348"),
    title: normalizeStyledField(safeChar.title, "", "#182d09"),
    pillars: normalizedPillars,
    backgroundMultimedia: normalizeMultimedia(safeChar.backgroundMultimedia),
    style: safeChar.style ?? null,
  }

  delete (normalizedCharacter as any).labelStyle
  delete (normalizedCharacter as any).titleStyle
  delete (normalizedCharacter as any).style

  return normalizedCharacter
}
