import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyJourneyCmsAllJourneys } from "./emptyJourneyCmsAllJourneys"

export function normalizeJourneyCmsAllJourneys(rawSec: any): typeof emptyJourneyCmsAllJourneys {
  if (!rawSec || typeof rawSec !== "object") return emptyJourneyCmsAllJourneys

  const src = rawSec.all_journeys || rawSec.allJourneys || rawSec.content || rawSec

  return {
    eyebrow: normalizeStyledField(src.eyebrow, emptyJourneyCmsAllJourneys.eyebrow.value, "#AF6348"),
    title: normalizeStyledField(src.title, emptyJourneyCmsAllJourneys.title.value, "#111827"),
    subtitle: normalizeStyledField(src.subtitle || src.description, emptyJourneyCmsAllJourneys.subtitle.value, "#4B5563"),
    searchPlaceholder: String(src.searchPlaceholder || emptyJourneyCmsAllJourneys.searchPlaceholder),
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyJourneyCmsAllJourneys.backgroundMultimedia
    ),
  }
}
