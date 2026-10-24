import { THEME_COLORS } from "@/config/theme"
import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyAllJourneys } from "./emptyAllJourneys"

export function normalizeAllJourneys(rawSec: any): typeof emptyAllJourneys {
  if (!rawSec || typeof rawSec !== "object") return emptyAllJourneys

  const src = rawSec.all_journeys || rawSec.allJourneys || rawSec.content || rawSec

  return {
    eyebrow: normalizeStyledField(src.eyebrow, emptyAllJourneys.eyebrow.value, THEME_COLORS.accent),
    title: normalizeStyledField(src.title, emptyAllJourneys.title.value, THEME_COLORS.darkNeutral),
    subtitle: normalizeStyledField(src.subtitle || src.description, emptyAllJourneys.subtitle.value, THEME_COLORS.sub),
    searchPlaceholder: String(src.searchPlaceholder || emptyAllJourneys.searchPlaceholder),
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia || src.backgroundMedia,
      emptyAllJourneys.backgroundMultimedia
    ),
  }
}
