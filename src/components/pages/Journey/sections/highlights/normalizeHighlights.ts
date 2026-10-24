import { THEME_COLORS } from "@/config/theme"
import { normalizeStyledField } from "@/components/pages/Journey/shared/normalizeHelpers"

export function normalizeHighlights(data?: any) {
  const safeData = data || {}
  const rawItems = Array.isArray(safeData.items)
    ? safeData.items
    : Array.isArray(safeData.highlightsList)
    ? safeData.highlightsList
    : []

  const items = rawItems.map((item: any) => ({
    title: normalizeStyledField(item.title ?? item, "", THEME_COLORS.navText),
  }))

  return {
    title: normalizeStyledField(safeData.title, "Highlights", THEME_COLORS.titleLight),
    items,
  }
}
