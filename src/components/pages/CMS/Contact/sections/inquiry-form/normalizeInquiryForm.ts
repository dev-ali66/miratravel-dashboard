import { emptyInquiryForm } from "./emptyInquiryForm"
import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeInquiryForm(input: any) {
  const raw = input || {}
  const res = {
    ...emptyInquiryForm,
    ...raw,
    eyebrow: normalizeStyledField(
      raw.eyebrow,
      emptyInquiryForm.eyebrow.value,
      "#F06543"
    ),
    title: normalizeStyledField(
      raw.title,
      emptyInquiryForm.title.value,
      "#182D09"
    ),
    rightSideMultimedia: normalizeMultimedia(
      raw.rightSideMultimedia ?? raw.multimedia,
      (emptyInquiryForm.rightSideMultimedia?.show as any) || "image"
    ),
    backgroundMultimedia: normalizeMultimedia(
      raw.backgroundMultimedia,
      (emptyInquiryForm.backgroundMultimedia?.show as any) || "color"
    ),
  }

  delete (res as any).key
  delete (res as any).type
  delete (res as any).multimedia

  return res
}

export default normalizeInquiryForm

