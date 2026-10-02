import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyJourneyCmsEditorialHighlight } from "./emptyJourneyCmsEditorialHighlight"

export function normalizeJourneyCmsEditorialHighlight(rawSec: any): typeof emptyJourneyCmsEditorialHighlight {
  if (!rawSec || typeof rawSec !== "object") return emptyJourneyCmsEditorialHighlight

  const src = rawSec.editorial_highlight || rawSec.sharedInfo || rawSec.content || rawSec

  return {
    text: normalizeStyledField(src.text || src.statement || src.quote, emptyJourneyCmsEditorialHighlight.text.value, "#AF6348"),
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyJourneyCmsEditorialHighlight.backgroundMultimedia
    ),
  }
}
