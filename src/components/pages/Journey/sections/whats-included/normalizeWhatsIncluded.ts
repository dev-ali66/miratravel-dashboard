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
    category: normalizeStyledField(item.category, "General", "#af6348"),
    title: normalizeStyledField(item.title ?? item, "", "#464136"),
    description: normalizeStyledField(item.description, "", "#565e69"),
  }))

  const rawExclusions = Array.isArray(safe.exclusions) && safe.exclusions.length > 0
    ? safe.exclusions
    : emptyWhatsIncluded.exclusions

  const normalizedExclusions = rawExclusions.map((item: any) => ({
    category: normalizeStyledField(item.category, "General", "#9A3412"),
    title: normalizeStyledField(item.title ?? item, "", "#464136"),
    description: normalizeStyledField(item.description, "", "#565e69"),
  }))

  const rawNotes = Array.isArray(safe.notes) && safe.notes.length > 0
    ? safe.notes
    : emptyWhatsIncluded.notes

  const normalizedNotes = rawNotes.map((n: any) => normalizeStyledField(n, "", "#464136"))

  return {
    badge: normalizeStyledField(safe.badge ?? emptyWhatsIncluded.badge, "", "#af6348"),
    title: normalizeStyledField(safe.title ?? emptyWhatsIncluded.title, "", "#313131"),
    description: normalizeStyledField(safe.description ?? emptyWhatsIncluded.description, "", "#565e69"),
    items: normalizedInclusions,
    exclusions: normalizedExclusions,
    notes: normalizedNotes,
    backgroundMultimedia: normalizeMultimedia(
      safe.backgroundMultimedia ?? safe.multimedia ?? emptyWhatsIncluded.backgroundMultimedia
    ),
  }
}
