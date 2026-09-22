import type { JourneyData } from "../journeyTypes"
import { recursivelyReplaceUndefinedWithNull } from "./normalizeHelpers"

import { normalizeBasicInfo } from "../sections/basic-info/normalizeBasicInfo"
import { normalizeHero } from "../sections/hero/normalizeHero"
import { normalizeOverview } from "../sections/overview/normalizeOverview"
import { normalizeItinerary } from "../sections/itinerary/normalizeItinerary"
import { normalizeAccommodations } from "../sections/accommodations/normalizeAccommodations"
import { normalizeWhatsIncluded } from "../sections/whats-included/normalizeWhatsIncluded"
import { normalizeAddOns } from "../sections/add-ons/normalizeAddOns"
import { normalizeGallery } from "../sections/gallery/normalizeGallery"
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
  const galleryData = safeDraft.gallery ?? safeData.gallery ?? {}
  const seoData = safeDraft.metadata?.seo ?? safeData.metadata?.seo ?? {}

  const finalHero = normalizeHero(heroData)
  const finalOverview = normalizeOverview(overviewData)
  const finalItinerary = normalizeItinerary(itineraryData)
  const finalAccommodations = normalizeAccommodations(accommodationsData)
  const finalWhatsIncluded = normalizeWhatsIncluded(whatsIncludedData)
  const finalAddOns = normalizeAddOns(addOnsData)
  const finalGallery = normalizeGallery(galleryData)
  const finalSeo = normalizeSeo(seoData)

  const normalized: JourneyData = {
    ...(safeDraft.id ? { id: safeDraft.id } : {}),
    ...basicInfo,

    hero: finalHero,
    overview: finalOverview,
    itinerary: finalItinerary,
    accommodations: finalAccommodations,
    whatsIncluded: finalWhatsIncluded,
    addOns: finalAddOns,
    gallery: finalGallery,

    metadata: {
      seo: finalSeo,
    },

    data: {
      hero: finalHero,
      overview: finalOverview,
      itinerary: finalItinerary,
      accommodations: finalAccommodations,
      whatsIncluded: finalWhatsIncluded,
      addOns: finalAddOns,
      gallery: finalGallery,
      metadata: {
        seo: finalSeo,
      },
    },
  }

  return recursivelyReplaceUndefinedWithNull(normalized)
}
