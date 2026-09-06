import type { Journey } from "../journeyTypes"
import { getJourneyItineraryDays } from "../journeyTypes"

function recursivelyReplaceUndefinedWithNull(input: any): any {
  if (input === undefined) return null
  if (input === null) return null
  if (Array.isArray(input)) {
    return input.map((item) => recursivelyReplaceUndefinedWithNull(item))
  }
  if (typeof input === "object") {
    const res: Record<string, any> = {}
    for (const key of Object.keys(input)) {
      res[key] = recursivelyReplaceUndefinedWithNull(input[key])
    }
    return res
  }
  return input
}

export function normalizeJourneyPayload(draft: Journey): Record<string, any> {
  const cleanDays = recursivelyReplaceUndefinedWithNull(getJourneyItineraryDays(draft))
  const cleanData = recursivelyReplaceUndefinedWithNull(draft.data || {})

  cleanData.itineraryData = cleanDays
  cleanData.itinerary = cleanDays

  const payload: Record<string, any> = {
    title: draft.title?.trim() || "Untitled Journey",
    subtitle: draft.subtitle?.trim() || null,
    slug:
      draft.slug?.trim() ||
      draft.title
        ?.trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") ||
      "untitled-journey",
    price: Number(draft.price) || 0,
    currency: draft.currency || "EUR",
    minDays: Number(draft.minDays) || 1,
    maxDays: Math.max(Number(draft.maxDays) || 1, Number(draft.minDays) || 1),

    journeyType: draft.journeyType?.length ? draft.journeyType : ["PRIVATE_JOURNEY"],
    travelStyle: draft.travelStyle?.length ? draft.travelStyle : ["CULTURE_HERITAGE"],
    perfectFor: draft.perfectFor?.length ? draft.perfectFor : ["COUPLES"],
    pace: draft.pace || "BALANCED",
    comfortLevel: draft.comfortLevel || "BOUTIQUE",

    status: draft.status || "DRAFT",
    featured: Boolean(draft.featured),

    journeyHeroImage: draft.journeyHeroImage?.length
      ? draft.journeyHeroImage
      : draft.data?.hero?.background_image
        ? [draft.data.hero.background_image]
        : [],
    journeyGallery: draft.journeyGallery || [],
    highlights: draft.highlights || [],
    included: draft.included || [],
    notIncluded: draft.notIncluded || [],

    metadata: recursivelyReplaceUndefinedWithNull(draft.metadata || {}),
    data: cleanData,

    // Top-level itinerary, addons, accommodations
    itineraryData: cleanDays,
    itineraryDays: cleanDays,
    itinerary: cleanDays,
    addons: recursivelyReplaceUndefinedWithNull(draft.addons || draft.addOns || []),
    accommodations: recursivelyReplaceUndefinedWithNull(draft.accommodations || null),
  }

  if (draft.id) {
    payload.id = draft.id
  }

  return payload
}
