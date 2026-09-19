import {
  normalizeMultimedia,
  normalizeStyledField,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeDestinations(section: any) {
  const safeSection = section && typeof section === "object" ? section : {}
  const content =
    safeSection.content && typeof safeSection.content === "object"
      ? safeSection.content
      : {}

  const normalized = {
    ...safeSection,
    eyebrow: normalizeStyledField(
      safeSection.eyebrow ?? content.eyebrow,
      "Destinations",
      "#C5A880"
    ),
    title: normalizeStyledField(
      safeSection.title ?? content.title,
      "Explore the countries that shape our journeys",
      "#182D09"
    ),
    subtitle: normalizeStyledField(
      safeSection.subtitle ?? content.subtitle,
      "Discover rich cultures, breathtaking landscapes, and timeless cities — one journey at a time",
      "#4B5563"
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeSection.backgroundMultimedia ?? content.backgroundMultimedia,
      "color"
    ),
    buttons: normalizeButtonsArray(safeSection.buttons ?? content.buttons),
  }

  delete (normalized as any).key
  delete (normalized as any).type
  delete (normalized as any).bgColor
  delete (normalized as any).content
  return normalized
}

export default normalizeDestinations
