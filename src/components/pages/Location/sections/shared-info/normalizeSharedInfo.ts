import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"
import { emptySharedInfo } from "./emptySharedInfo"

export function normalizeSharedInfo(input: any) {
  const safeInput = input && typeof input === "object" ? input : {}

  const normalized = {
    ...safeInput,
    text: normalizeStyledField(
      safeInput.text ?? emptySharedInfo.text,
      "",
      "#AF6348"
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeInput.backgroundMultimedia || emptySharedInfo.backgroundMultimedia,
      "#FAF6F0"
    ),
  }

  delete (normalized as any).textStyle
  delete (normalized as any).style

  return normalized
}
