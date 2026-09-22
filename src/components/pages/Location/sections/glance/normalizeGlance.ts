import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"
import { emptyGlance } from "./emptyGlance"

export function normalizeGlance(regionGlance: any) {
  const safeGlance = regionGlance && typeof regionGlance === "object" ? regionGlance : {}

  const rawGlanceItems = Array.isArray(safeGlance.items)
    ? safeGlance.items
    : Array.isArray(safeGlance.locationIds)
      ? safeGlance.locationIds
      : []

  const rawGlanceItemIds: string[] = rawGlanceItems
    .map((it: any) => (typeof it === "string" ? it : it?.id || it?.locationId))
    .filter(Boolean)

  const normalizedGlance = {
    ...safeGlance,
    label: normalizeStyledField(safeGlance.label ?? emptyGlance.label, "AT A GLANCE", "#af6348"),
    title: normalizeStyledField(safeGlance.title ?? emptyGlance.title, "", "#182d09"),
    items: rawGlanceItemIds,
    backgroundMultimedia: normalizeMultimedia(safeGlance.backgroundMultimedia || emptyGlance.backgroundMultimedia, "color"),
    style: safeGlance.style ?? null,
  }

  delete (normalizedGlance as any).labelStyle
  delete (normalizedGlance as any).titleStyle
  delete (normalizedGlance as any).style

  return normalizedGlance
}

