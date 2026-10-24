import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"
import { emptyPlaceInfo } from "./emptyPlaceInfo"

export function normalizePlaceInfo(info: any) {
  const safeInfo = info && typeof info === "object" ? info : {}

  const normalizedInfo = {
    ...safeInfo,
    headline: normalizeStyledField(safeInfo.headline ?? emptyPlaceInfo.headline, "", THEME_COLORS.primary),
    description: normalizeStyledField(safeInfo.description ?? emptyPlaceInfo.description, "", THEME_COLORS.muted),
    backgroundMultimedia: normalizeMultimedia(safeInfo.backgroundMultimedia || emptyPlaceInfo.backgroundMultimedia),
  }

  delete (normalizedInfo as any).headlineStyle
  delete (normalizedInfo as any).descriptionStyle
  delete (normalizedInfo as any).style

  return normalizedInfo
}

