import { THEME_COLORS } from "@/config/theme"
import { emptyApproach } from "./emptyApproach"
import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeApproach(input: any) {
  const raw = input || {}
  const res = {
    ...emptyApproach,
    ...raw,
    eyebrow: normalizeStyledField(raw.eyebrow, emptyApproach.eyebrow.value, THEME_COLORS.accentWarm),
    title: normalizeStyledField(raw.title, emptyApproach.title.value, THEME_COLORS.primary),
    description: normalizeStyledField(raw.description, emptyApproach.description.value, THEME_COLORS.sub),
    quote: normalizeStyledField(raw.quote, emptyApproach.quote?.value ?? "", THEME_COLORS.accentWarm),
    leftMultimedia: normalizeMultimedia(
      raw.leftMultimedia,
      emptyApproach.leftMultimedia.show
    ),
    rightMultimedia: normalizeMultimedia(
      raw.rightMultimedia,
      emptyApproach.rightMultimedia.show
    ),
    backgroundMultimedia: normalizeMultimedia(
      raw.backgroundMultimedia,
      emptyApproach.backgroundMultimedia.show
    ),
  }

  delete (res as any).key
  delete (res as any).type
  return res
}

export default normalizeApproach
