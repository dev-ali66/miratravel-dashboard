import { THEME_COLORS } from "@/config/theme"
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
    eyebrow: normalizeStyledField(src.eyebrow, emptyJourneyCmsSignatureJourneys.eyebrow.value, THEME_COLORS.accent),
    title: normalizeStyledField(src.title, emptyJourneyCmsSignatureJourneys.title.value, THEME_COLORS.darkNeutral),
    subtitle: normalizeStyledField(src.subtitle || src.description, emptyJourneyCmsSignatureJourneys.subtitle.value, THEME_COLORS.sub),
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyJourneyCmsSignatureJourneys.backgroundMultimedia
    ),
  }
}
