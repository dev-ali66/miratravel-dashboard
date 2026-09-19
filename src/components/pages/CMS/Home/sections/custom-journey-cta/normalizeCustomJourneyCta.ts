import {
  normalizeMultimedia,
  normalizeStyledField,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeCustomJourneyCta(section: any) {
  const safeSection = section && typeof section === "object" ? section : {}
  const content =
    safeSection.content && typeof safeSection.content === "object"
      ? safeSection.content
      : {}

  const rawTitle =
    safeSection.title ??
    content.title ??
    safeSection.titleLine1 ??
    content.titleLine1 ??
    "Prefer something more personal? Let’s design it together"

  const normalized = {
    ...safeSection,
    title: normalizeStyledField(
      rawTitle,
      "Prefer something more personal? Let’s design it together",
      "#182D09"
    ),
    description: normalizeStyledField(
      safeSection.description ?? content.description,
      "Tell us how you like to travel. We will create a personal journey shaped around your pace, interests, and preferred level of comfort — tailored with intimate local insight down to every unhurried detail.",
      "#4B5563"
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeSection.backgroundMultimedia ?? content.backgroundMultimedia,
      "color"
    ),
    rightSideMultimedia: normalizeMultimedia(
      safeSection.rightSideMultimedia ?? content.rightSideMultimedia,
      "image"
    ),
    buttons: normalizeButtonsArray(safeSection.buttons ?? content.buttons),
  }

  delete (normalized as any).key
  delete (normalized as any).type
  delete (normalized as any).bgColor
  delete (normalized as any).content
  return normalized
}

export default normalizeCustomJourneyCta
