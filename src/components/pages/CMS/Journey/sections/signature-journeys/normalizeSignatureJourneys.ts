import { THEME_COLORS } from "@/config/theme"
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
    eyebrow: normalizeStyledField(src.eyebrow, emptySignatureJourneys.eyebrow.value, THEME_COLORS.accent),
    title: normalizeStyledField(src.title, emptySignatureJourneys.title.value, THEME_COLORS.darkNeutral),
    subtitle: normalizeStyledField(src.subtitle || src.description, emptySignatureJourneys.subtitle.value, THEME_COLORS.sub),
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptySignatureJourneys.backgroundMultimedia
    ),
  }
}
