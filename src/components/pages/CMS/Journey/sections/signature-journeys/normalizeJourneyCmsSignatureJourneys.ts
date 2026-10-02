import {
  normalizeStyledField,
  normalizeMultimedia,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyJourneyCmsSignatureJourneys } from "./emptyJourneyCmsSignatureJourneys"

export function normalizeJourneyCmsSignatureJourneys(rawSec: any): typeof emptyJourneyCmsSignatureJourneys {
  if (!rawSec || typeof rawSec !== "object") return emptyJourneyCmsSignatureJourneys

  const src = rawSec.signature_journeys || rawSec.signatureJourneys || rawSec.content || rawSec

  return {
    eyebrow: normalizeStyledField(src.eyebrow, emptyJourneyCmsSignatureJourneys.eyebrow.value, "#AF6348"),
    title: normalizeStyledField(src.title, emptyJourneyCmsSignatureJourneys.title.value, "#111827"),
    subtitle: normalizeStyledField(src.subtitle || src.description, emptyJourneyCmsSignatureJourneys.subtitle.value, "#4B5563"),
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyJourneyCmsSignatureJourneys.backgroundMultimedia
    ),
  }
}
