import type { JourneyData } from "../journeyTypes"
import { recursivelyReplaceUndefinedWithNull } from "./normalizeHelpers"

import { normalizeBasicInfo } from "../sections/basic-info/normalizeBasicInfo"
import { normalizeHero } from "../sections/hero/normalizeHero"
import { normalizeOverview } from "../sections/overview/normalizeOverview"
import { normalizeItinerary } from "../sections/itinerary/normalizeItinerary"
import { normalizeAccommodations } from "../sections/accommodations/normalizeAccommodations"
import { normalizeWhatsIncluded } from "../sections/whats-included/normalizeWhatsIncluded"
import { normalizeAddOns } from "../sections/add-ons/normalizeAddOns"
import { normalizeSeo } from "../sections/seo/normalizeSeoMetadata"

export function normalizeJourneyPayload(draft: Partial<JourneyData>): JourneyData {
  const safeDraft: any = draft ?? {}
  const safeData = (safeDraft.data ?? {}) as Record<string, any>

  const basicInfo = normalizeBasicInfo(safeDraft)

  const heroData = safeDraft.hero ?? safeData.hero ?? {}
  const overviewData = safeDraft.overview ?? safeData.overview ?? {}
  const itineraryData = safeDraft.itinerary ?? safeData.itinerary ?? {}
  const accommodationsData = safeDraft.accommodations ?? safeData.accommodations ?? {}
  const whatsIncludedData = safeDraft.whatsIncluded ?? safeData.whatsIncluded ?? {}
  const addOnsData = safeDraft.addOns ?? safeData.addOns ?? {}
  const seoData = safeDraft.metadata?.seo ?? safeData.metadata?.seo ?? {}

  const finalHero = normalizeHero(heroData)
  const finalOverview = normalizeOverview(overviewData)
  const finalItinerary = normalizeItinerary(itineraryData)
  const finalAccommodations = normalizeAccommodations(accommodationsData)
  const finalWhatsIncluded = normalizeWhatsIncluded(whatsIncludedData)
  const finalAddOns = normalizeAddOns(addOnsData)
  const finalSeo = normalizeSeo(seoData)

  // Extract location IDs selected in itinerary & accommodations
  const locationIdsSet = new Set<string>()

  const chapters = finalItinerary?.items || finalItinerary?.chapters || []
  if (Array.isArray(chapters)) {
    chapters.forEach((chap: any) => {
      const days = chap?.days || []
      if (Array.isArray(days)) {
        days.forEach((day: any) => {
          const locId = typeof day?.locationId === "string" ? day.locationId : day?.locationId?.id || ""
          if (locId && typeof locId === "string" && locId.trim()) {
            locationIdsSet.add(locId.trim())
          }
        })
      }
    })
  }

  const accAny = finalAccommodations as any
  const stays = accAny?.destinationStays?.items || accAny?.destinations?.items || accAny?.items || []
  if (Array.isArray(stays)) {
    stays.forEach((stay: any) => {
      const locId = typeof stay?.locationId === "string" ? stay.locationId : stay?.locationId?.id || ""
      if (locId && typeof locId === "string" && locId.trim()) {
        locationIdsSet.add(locId.trim())
      }
    })
  }

  // Fallback to explicit string IDs if no itinerary or accommodations present
  if (locationIdsSet.size === 0 && Array.isArray(safeDraft.locations)) {
    safeDraft.locations.forEach((item: any) => {
      if (typeof item === "string" && item.trim()) {
        locationIdsSet.add(item.trim())
      }
    })
  }

  const extractedLocationIds = Array.from(locationIdsSet)

  const normalized: JourneyData = {
    ...(safeDraft.id ? { id: safeDraft.id } : {}),
    ...basicInfo,

    hero: finalHero,
    overview: finalOverview,
    itinerary: finalItinerary,
    accommodations: finalAccommodations,
    whatsIncluded: finalWhatsIncluded,
    addOns: finalAddOns,
    locations: extractedLocationIds as any,
    metadata: {
      seo: finalSeo,
    },
  }

  return recursivelyReplaceUndefinedWithNull(normalized)
}
