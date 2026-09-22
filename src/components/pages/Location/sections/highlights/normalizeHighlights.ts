import { normalizeMultimedia, normalizeStyledField, LOCATION_THEME_COLORS } from "../../shared/normalizeHelpers"
import { emptyHighlights } from "./emptyHighlights"

export function normalizeHighlights(highlights: any) {
  const safeHighlights = highlights && typeof highlights === "object" ? highlights : {}

  const rawItemIds: string[] = Array.isArray(safeHighlights.items)
    ? safeHighlights.items
        .map((it: any) => (typeof it === "string" ? it : it?.id || it?.locationId))
        .filter(Boolean)
    : Array.isArray(safeHighlights.locationIds)
      ? safeHighlights.locationIds
      : []

  const normalizedHighlights = {
    ...safeHighlights,
    label: normalizeStyledField(safeHighlights.label ?? emptyHighlights.label, "SEASONAL HIGHLIGHTS", LOCATION_THEME_COLORS.accent),
    title: normalizeStyledField(safeHighlights.title ?? emptyHighlights.title, "", LOCATION_THEME_COLORS.primary),
    description: normalizeStyledField(safeHighlights.description ?? emptyHighlights.description, "", LOCATION_THEME_COLORS.muted),
    items: rawItemIds,
    backgroundMultimedia: normalizeMultimedia(safeHighlights.backgroundMultimedia || emptyHighlights.backgroundMultimedia, "color"),
    style: safeHighlights.style ?? null,
  }

  delete (normalizedHighlights as any).id
  delete (normalizedHighlights as any).labelStyle
  delete (normalizedHighlights as any).titleStyle
  delete (normalizedHighlights as any).descriptionStyle
  delete (normalizedHighlights as any).style

  return normalizedHighlights
}

