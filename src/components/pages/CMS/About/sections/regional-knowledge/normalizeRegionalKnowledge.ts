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
    eyebrow: normalizeStyledField(raw.eyebrow, emptyRegionalKnowledge.eyebrow.value, "#B86B3A"),
    title: normalizeStyledField(raw.title, emptyRegionalKnowledge.title.value, "#182D09"),
    description: normalizeStyledField(raw.description, emptyRegionalKnowledge.description.value, "#4B5563"),
    secondaryDescription: normalizeStyledField(
      raw.secondaryDescription,
      emptyRegionalKnowledge.secondaryDescription.value,
      "#4B5563"
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
