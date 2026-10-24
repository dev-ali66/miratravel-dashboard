import { THEME_COLORS } from "@/config/theme"
import {
  normalizeMultimedia,
  normalizeStyledField,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeTravelInsights(section: any) {
  const safeSection = section && typeof section === "object" ? section : {}
  const content =
    safeSection.content && typeof safeSection.content === "object"
      ? safeSection.content
      : {}

  const normalized = {
    ...safeSection,
    eyebrow: normalizeStyledField(
      safeSection.eyebrow ?? content.eyebrow,
      "THE EDITORIAL",
      THEME_COLORS.goldMuted
    ),
    title: normalizeStyledField(
      safeSection.title ?? content.title,
      "Travel Insights",
      THEME_COLORS.primary
    ),
    subtitle: normalizeStyledField(
      safeSection.subtitle ?? content.subtitle,
      "A collection of personal, cultural and inspiring stories. Each piece offers a deeper view of the Balkans and its people beyond the expected.",
      THEME_COLORS.sub
    ),
    description: normalizeStyledField(
      safeSection.description ?? content.description,
      "Prepare for your journey with our comprehensive insider guides.",
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
  delete (normalized as any).items
  delete (normalized as any).insightsList
  delete (normalized as any).leftSideMultimedia
  delete (normalized as any).leftSideMedia
  return normalized
}

export default normalizeTravelInsights
