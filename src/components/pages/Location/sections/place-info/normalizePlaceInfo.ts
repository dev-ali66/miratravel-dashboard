import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"

export function normalizePlaceInfo(info: any) {
  const safeInfo = info && typeof info === "object" ? info : {}

  const normalizedInfo = {
    ...safeInfo,
    headline: normalizeStyledField(safeInfo.headline, "", "#182d09"),
    description: normalizeStyledField(safeInfo.description, "", "#565e69"),
    backgroundMultimedia: normalizeMultimedia(safeInfo.backgroundMultimedia),
  }

  delete (normalizedInfo as any).headlineStyle
  delete (normalizedInfo as any).descriptionStyle
  delete (normalizedInfo as any).style

  return normalizedInfo
}
