import { emptyStay } from "./emptyStay"
import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeStay(raw: any) {
  const safe = raw && typeof raw === "object" ? raw : {}

  const title = normalizeStyledField(
    safe.title,
    emptyStay.title.value,
    emptyStay.title.textColor
  )

  const closingText = normalizeStyledField(
    safe.closingText ?? safe.closing_text,
    emptyStay.closingText.value,
    emptyStay.closingText.textColor
  )

  const rawItems = Array.isArray(safe.items)
    ? safe.items
    : Array.isArray(safe.sentences)
    ? safe.sentences
    : emptyStay.items

  const items = rawItems.map((s: any) =>
    normalizeStyledField(s, typeof s === "string" ? s : s?.value || "", "#F3F4F6")
  )

  const backgroundMultimedia = normalizeMultimedia(
    safe.backgroundMultimedia || safe.background_multimedia,
    emptyStay.backgroundMultimedia
  )

  return {
    title,
    items,
    closingText,
    backgroundMultimedia,
  }
}

export default normalizeStay
