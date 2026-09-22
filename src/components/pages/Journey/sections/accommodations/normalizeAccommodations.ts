import { normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyAccommodations } from "./emptyAccommodations"

export function normalizeAccommodations(accommodations: any) {
  const safe = accommodations && typeof accommodations === "object" ? accommodations : {}

  const normalizedStays = Array.isArray(safe.staysList) && safe.staysList.length > 0
    ? safe.staysList.map((stay: any, idx: number) => ({
        id: stay.id || `stay-${idx + 1}`,
        name: stay.name || "Stay Name",
        stayType: stay.stayType || "Boutique Hotel",
        city: stay.city || "Region",
        duration: stay.duration || "1 Night",
        nights: Number(stay.nights || 1),
        description: stay.description || "",
        image: stay.image || "",
        amenities: Array.isArray(stay.amenities) ? stay.amenities : [],
        websiteUrl: stay.websiteUrl || "",
      }))
    : emptyAccommodations.staysList

  return {
    ...safe,
    badge: safe.badge ?? emptyAccommodations.badge,
    title: safe.title ?? emptyAccommodations.title,
    description: safe.description ?? emptyAccommodations.description,
    staysList: normalizedStays,
    backgroundMultimedia: normalizeMultimedia(
      safe.backgroundMultimedia ?? safe.multimedia ?? emptyAccommodations.backgroundMultimedia
    ),
  }
}
