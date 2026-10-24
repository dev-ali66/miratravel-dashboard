import { THEME_COLORS } from "@/config/theme"
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
      THEME_COLORS.goldMuted
    ),
    title: normalizeStyledField(
      safeSection.title ?? content.title,
      "Explore the countries that shape our journeys",
      THEME_COLORS.primary
    ),
    subtitle: normalizeStyledField(
      safeSection.subtitle ?? content.subtitle,
      "Discover rich cultures, breathtaking landscapes, and timeless cities — one journey at a time",
      THEME_COLORS.sub
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
