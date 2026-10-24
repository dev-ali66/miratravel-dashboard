import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyWhatsIncluded } from "./emptyWhatsIncluded"

export function normalizeWhatsIncluded(whatsIncluded: any) {
  const safe = whatsIncluded && typeof whatsIncluded === "object" ? whatsIncluded : {}

  const rawInclusions = Array.isArray(safe.items) && safe.items.length > 0
    ? safe.items
    : Array.isArray(safe.inclusions) && safe.inclusions.length > 0
    ? safe.inclusions
    : emptyWhatsIncluded.items

  const normalizedInclusions = rawInclusions.map((item: any) => ({
    category: normalizeStyledField(item.category, "General", THEME_COLORS.accent),
    title: normalizeStyledField(item.title ?? item, "", THEME_COLORS.navText),
    description: normalizeStyledField(item.description, "", THEME_COLORS.muted),
  }))

  const rawExclusions = Array.isArray(safe.exclusions) && safe.exclusions.length > 0
    ? safe.exclusions
    : emptyWhatsIncluded.exclusions

  const normalizedExclusions = rawExclusions.map((item: any) => ({
    category: normalizeStyledField(item.category, "General", THEME_COLORS.badgeYellowText),
    title: normalizeStyledField(item.title ?? item, "", THEME_COLORS.navText),
    description: normalizeStyledField(item.description, "", THEME_COLORS.muted),
  }))

  const rawNotes = Array.isArray(safe.notes) && safe.notes.length > 0
    ? safe.notes
    : emptyWhatsIncluded.notes

  const normalizedNotes = rawNotes.map((n: any) => normalizeStyledField(n, "", THEME_COLORS.navText))

  return {
    badge: normalizeStyledField(safe.badge ?? emptyWhatsIncluded.badge, "", THEME_COLORS.accent),
    title: normalizeStyledField(safe.title ?? emptyWhatsIncluded.title, "", THEME_COLORS.titleLight),
    description: normalizeStyledField(safe.description ?? emptyWhatsIncluded.description, "", THEME_COLORS.muted),
    items: normalizedInclusions,
    exclusions: normalizedExclusions,
    notes: normalizedNotes,
    backgroundMultimedia: normalizeMultimedia(
      safe.backgroundMultimedia ?? safe.multimedia ?? emptyWhatsIncluded.backgroundMultimedia
    ),
  }
}
