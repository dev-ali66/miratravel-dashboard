import {
  normalizeMultimedia,
  normalizeStyledField,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeExploreJourneys(section: any) {
  const safeSection = section && typeof section === "object" ? section : {}
  const content =
    safeSection.content && typeof safeSection.content === "object"
      ? safeSection.content
      : {}

  const normalized = {
    ...safeSection,
    eyebrow: normalizeStyledField(
      safeSection.eyebrow ?? content.eyebrow,
      "Journeys",
      "#C5A880"
    ),
    title: normalizeStyledField(
      safeSection.title ?? content.title,
      "Explore Our Journeys",
      "#182D09"
    ),
    subtitle: normalizeStyledField(
      safeSection.subtitle ?? content.subtitle,
      "Find the journey that matches the way you want to travel.",
      "#4B5563"
    ),
    description: normalizeStyledField(
      safeSection.description ?? content.description,
      "A series of intentionally paced journeys designed for those who seek the authentic grain of history, from mountain monasteries to coastal ruins.",
      "#4B5563"
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeSection.backgroundMultimedia ?? content.backgroundMultimedia,
      "color"
    ),
    items: Array.isArray(safeSection.items)
      ? safeSection.items
      : Array.isArray(content.items)
      ? content.items
      : [],
    buttons: normalizeButtonsArray(safeSection.buttons ?? content.buttons),
  }

  delete (normalized as any).key
  delete (normalized as any).type
  delete (normalized as any).bgColor
  delete (normalized as any).content
  return normalized
}

export default normalizeExploreJourneys
