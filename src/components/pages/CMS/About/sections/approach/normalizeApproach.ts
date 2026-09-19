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
    eyebrow: normalizeStyledField(raw.eyebrow, emptyApproach.eyebrow.value, "#B86B3A"),
    title: normalizeStyledField(raw.title, emptyApproach.title.value, "#182D09"),
    description: normalizeStyledField(raw.description, emptyApproach.description.value, "#4B5563"),
    quote: normalizeStyledField(raw.quote, emptyApproach.quote?.value ?? "", "#B86B3A"),
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
