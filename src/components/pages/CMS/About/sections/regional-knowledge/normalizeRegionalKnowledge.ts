import { THEME_COLORS } from "@/config/theme"
import { emptyRegionalKnowledge } from "./emptyRegionalKnowledge"
import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeRegionalKnowledge(input: any) {
  const raw = input || {}
  const res = {
    ...emptyRegionalKnowledge,
    ...raw,
    eyebrow: normalizeStyledField(raw.eyebrow, emptyRegionalKnowledge.eyebrow.value, THEME_COLORS.accentWarm),
    title: normalizeStyledField(raw.title, emptyRegionalKnowledge.title.value, THEME_COLORS.primary),
    description: normalizeStyledField(raw.description, emptyRegionalKnowledge.description.value, THEME_COLORS.sub),
    secondaryDescription: normalizeStyledField(
      raw.secondaryDescription,
      emptyRegionalKnowledge.secondaryDescription.value,
      THEME_COLORS.sub
    ),
    multimedia1: normalizeMultimedia(
      raw.multimedia1,
      emptyRegionalKnowledge.multimedia1.show
    ),
    multimedia2: normalizeMultimedia(
      raw.multimedia2,
      emptyRegionalKnowledge.multimedia2.show
    ),
    backgroundMultimedia: normalizeMultimedia(
      raw.backgroundMultimedia,
      emptyRegionalKnowledge.backgroundMultimedia.show
    ),
  }

  delete (res as any).key
  delete (res as any).type
  return res
}

export default normalizeRegionalKnowledge
