import { normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyWhatsIncluded } from "./emptyWhatsIncluded"

export function normalizeWhatsIncluded(whatsIncluded: any) {
  const safe = whatsIncluded && typeof whatsIncluded === "object" ? whatsIncluded : {}

  const normalizedInclusions = Array.isArray(safe.inclusions) && safe.inclusions.length > 0
    ? safe.inclusions.map((item: any, idx: number) => ({
        id: item.id || `inc-${idx + 1}`,
        category: item.category || "General",
        title: typeof item === "string" ? item : item.title || "",
        description: item.description || "",
      }))
    : emptyWhatsIncluded.inclusions

  const normalizedExclusions = Array.isArray(safe.exclusions) && safe.exclusions.length > 0
    ? safe.exclusions.map((item: any, idx: number) => ({
        id: item.id || `exc-${idx + 1}`,
        category: item.category || "General",
        title: typeof item === "string" ? item : item.title || "",
        description: item.description || "",
      }))
    : emptyWhatsIncluded.exclusions

  const normalizedNotes = Array.isArray(safe.notes) && safe.notes.length > 0
    ? safe.notes.map((n: any) => (typeof n === "string" ? n : n.title || ""))
    : emptyWhatsIncluded.notes

  return {
    ...safe,
    badge: safe.badge ?? emptyWhatsIncluded.badge,
    title: safe.title ?? emptyWhatsIncluded.title,
    description: safe.description ?? emptyWhatsIncluded.description,
    inclusions: normalizedInclusions,
    exclusions: normalizedExclusions,
    notes: normalizedNotes,
    backgroundMultimedia: normalizeMultimedia(
      safe.backgroundMultimedia ?? safe.multimedia ?? emptyWhatsIncluded.backgroundMultimedia
    ),
  }
}
