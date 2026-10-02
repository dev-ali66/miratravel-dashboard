import {
  normalizeStyledField,
  normalizeMultimedia,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptySignatureJourneys } from "./emptySignatureJourneys"

export function normalizeSignatureJourneys(rawSec: any): typeof emptySignatureJourneys {
  if (!rawSec || typeof rawSec !== "object") return emptySignatureJourneys

  const src = rawSec.signature_journeys || rawSec.signatureJourneys || rawSec.content || rawSec

  return {
    eyebrow: normalizeStyledField(src.eyebrow, emptySignatureJourneys.eyebrow.value, "#AF6348"),
    title: normalizeStyledField(src.title, emptySignatureJourneys.title.value, "#111827"),
    subtitle: normalizeStyledField(src.subtitle || src.description, emptySignatureJourneys.subtitle.value, "#4B5563"),
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptySignatureJourneys.backgroundMultimedia
    ),
  }
}
