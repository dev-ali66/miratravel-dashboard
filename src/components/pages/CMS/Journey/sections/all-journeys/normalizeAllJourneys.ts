import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyAllJourneys } from "./emptyAllJourneys"

export function normalizeAllJourneys(rawSec: any): typeof emptyAllJourneys {
  if (!rawSec || typeof rawSec !== "object") return emptyAllJourneys

  const src = rawSec.all_journeys || rawSec.allJourneys || rawSec.content || rawSec

  return {
    eyebrow: normalizeStyledField(src.eyebrow, emptyAllJourneys.eyebrow.value, "#AF6348"),
    title: normalizeStyledField(src.title, emptyAllJourneys.title.value, "#111827"),
    subtitle: normalizeStyledField(src.subtitle || src.description, emptyAllJourneys.subtitle.value, "#4B5563"),
    searchPlaceholder: String(src.searchPlaceholder || emptyAllJourneys.searchPlaceholder),
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyAllJourneys.backgroundMultimedia
    ),
  }
}
