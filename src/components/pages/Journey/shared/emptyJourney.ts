/* =====================================================
   JOURNEY — DEFAULT / INITIAL DRAFT (MASTER SKELETON)
   Default data loaded when creating a new journey.
   Modularized 1:1 like Location by importing section-level defaults.
===================================================== */

import type { JourneyData } from "../journeyTypes"
import { emptyBasicInfo } from "../sections/basic-info/emptyBasicInfo"
import { emptyHero } from "../sections/hero/emptyHero"
import { emptyOverview } from "../sections/overview/emptyOverview"
import { emptyItinerary } from "../sections/itinerary/emptyItinerary"
import { emptyAccommodations } from "../sections/accommodations/emptyAccommodations"
import { emptyWhatsIncluded } from "../sections/whats-included/emptyWhatsIncluded"
import { emptyAddOns } from "../sections/add-ons/emptyAddOns"
import { emptySeoMetadata } from "../sections/seo/emptySeoMetadata"

export const emptyJourney: JourneyData = {
  ...emptyBasicInfo,

  hero: emptyHero,
  overview: emptyOverview,
  itinerary: emptyItinerary,
  accommodations: emptyAccommodations,
  whatsIncluded: emptyWhatsIncluded,
  addOns: emptyAddOns,

  metadata: {
    seo: emptySeoMetadata,
  },
}

export const emptyJourneyPayload = emptyJourney
export default emptyJourney
