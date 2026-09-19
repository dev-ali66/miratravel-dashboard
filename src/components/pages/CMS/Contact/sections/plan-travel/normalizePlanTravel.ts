import { emptyPlanTravel } from "./emptyPlanTravel"
import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizePlanTravel(input: any) {
  const raw = input || {}

  // Handle legacy titlegraphs / paragraphs array conversion to rich text HTML
  let rawDesc = raw.description
  if (!rawDesc && Array.isArray(raw.titlegraphs)) {
    rawDesc = raw.titlegraphs.map((p: string) => `<p>${p}</p>`).join("")
  } else if (!rawDesc && Array.isArray(raw.paragraphs)) {
    rawDesc = raw.paragraphs.map((p: string) => `<p>${p}</p>`).join("")
  }

  const res = {
    ...emptyPlanTravel,
    ...raw,
    label: normalizeStyledField(
      raw.label,
      emptyPlanTravel.label.value,
      "#E5A84B"
    ),
    title: normalizeStyledField(
      raw.title,
      emptyPlanTravel.title.value,
      "#182D09"
    ),
    description: normalizeStyledField(
      rawDesc,
      emptyPlanTravel.description.value,
      "#44403C"
    ),
    leftSideMultimedia: normalizeMultimedia(
      raw.leftSideMultimedia ?? raw.multimedia,
      (emptyPlanTravel.leftSideMultimedia?.show as any) || "image"
    ),
    backgroundMultimedia: normalizeMultimedia(
      raw.backgroundMultimedia,
      (emptyPlanTravel.backgroundMultimedia?.show as any) || "color"
    ),
  }

  delete (res as any).key
  delete (res as any).type
  delete (res as any).titlegraphs
  delete (res as any).paragraphs
  delete (res as any).multimedia

  return res
}

export default normalizePlanTravel


