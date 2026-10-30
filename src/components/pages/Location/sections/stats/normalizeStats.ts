import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"
import { emptyStats, DEFAULT_STATS_TEXT_COLOR } from "./emptyStats"

export function normalizeStats(statistics: any) {
  const safeStats = statistics && typeof statistics === "object" ? statistics : {}

  const rawItems = Array.isArray(safeStats.items)
    ? safeStats.items
    : (Array.isArray(safeStats.facts)
      ? safeStats.facts
      : (emptyStats.items ?? []))

  const normalizedItems = rawItems.map((item: any) => {
    const normItem = {
      label: normalizeStyledField(item?.label, "", DEFAULT_STATS_TEXT_COLOR),
      value: normalizeStyledField(item?.value, "", DEFAULT_STATS_TEXT_COLOR),
      description: normalizeStyledField(item?.description, "", DEFAULT_STATS_TEXT_COLOR),
    }

    // Explicitly ensure no icon, image, or media fields inside items
    delete (normItem as any).image
    delete (normItem as any).icon
    delete (normItem as any).media
    delete (normItem as any).multimedia
    delete (normItem as any).labelStyle
    delete (normItem as any).valueStyle
    delete (normItem as any).descriptionStyle
    delete (normItem as any).style

    return normItem
  })

  const normalizedStatistics = {
    ...safeStats,
    title: normalizeStyledField(safeStats.title ?? emptyStats.title, "", DEFAULT_STATS_TEXT_COLOR),
    items: normalizedItems,
    ...(safeStats.area ? {
      area: {
        unit: safeStats.area.unit ?? "km²",
        value: safeStats.area.value ?? 0,
      },
    } : {}),
    ...(safeStats.elevation ? {
      elevation: {
        unit: safeStats.elevation.unit ?? "m",
        value: safeStats.elevation.value ?? 0,
      },
    } : {}),
    ...(safeStats.population ? {
      population: {
        year: safeStats.population.year ?? 2026,
        value: safeStats.population.value ?? 0,
      },
    } : {}),
    backgroundMultimedia: normalizeMultimedia(
      safeStats.backgroundMultimedia || emptyStats.backgroundMultimedia,
      "color"
    ),
  }

  // Ensure legacy duplicate facts property is removed - only items remains
  delete (normalizedStatistics as any).facts
  delete (normalizedStatistics as any).style

  return normalizedStatistics
}
