import { THEME_COLORS } from "@/config/theme"
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
      THEME_COLORS.primary
    ),
    description: normalizeStyledField(
      safeSection.description ?? content.description,
      "Tell us how you like to travel. We will create a personal journey shaped around your pace, interests, and preferred level of comfort — tailored with intimate local insight down to every unhurried detail.",
      THEME_COLORS.sub
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
