import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"
import { emptySharedInfo } from "./emptySharedInfo"

export function normalizeSharedInfo(input: any) {
  const safeInput = input && typeof input === "object" ? input : {}

  const normalized = {
    ...safeInput,
    text: normalizeStyledField(
      safeInput.text ?? emptySharedInfo.text,
      "",
      THEME_COLORS.accent
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeInput.backgroundMultimedia || emptySharedInfo.backgroundMultimedia,
      THEME_COLORS.bgBeige
    ),
  }

  delete (normalized as any).textStyle
  delete (normalized as any).style

  return normalized
}
