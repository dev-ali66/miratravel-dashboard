import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyEditorialHighlight } from "./emptyEditorialHighlight"

export function normalizeEditorialHighlight(rawSec: any): typeof emptyEditorialHighlight {
  if (!rawSec || typeof rawSec !== "object") return emptyEditorialHighlight

  const src = rawSec.editorial_highlight || rawSec.sharedInfo || rawSec.content || rawSec

  return {
    text: normalizeStyledField(src.text || src.statement || src.quote, emptyEditorialHighlight.text.value, "#AF6348"),
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyEditorialHighlight.backgroundMultimedia
    ),
  }
}
