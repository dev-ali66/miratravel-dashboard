import type { JourneyData } from "../journeyTypes"
import { emptyBasicInfo } from "../sections/basic-info/emptyBasicInfo"
import { emptyHero } from "../sections/hero/emptyHero"
import { emptyOverview } from "../sections/overview/emptyOverview"
import { emptyItinerary } from "../sections/itinerary/emptyItinerary"
import { emptyAccommodations } from "../sections/accommodations/emptyAccommodations"
import { emptyWhatsIncluded } from "../sections/whats-included/emptyWhatsIncluded"
import { emptyAddOns } from "../sections/add-ons/emptyAddOns"
import { emptyGallery } from "../sections/gallery/emptyGallery"
import { emptySeoMetadata } from "../sections/seo/emptySeoMetadata"

export const emptyJourneyPayload: JourneyData = {
  ...emptyBasicInfo,
  hero: emptyHero,
  overview: emptyOverview,
  itinerary: emptyItinerary,
  accommodations: emptyAccommodations,
  whatsIncluded: emptyWhatsIncluded,
  addOns: emptyAddOns,
  gallery: emptyGallery,
  metadata: {
    seo: emptySeoMetadata,
  },
  data: {},
}

export const emptyJourney = emptyJourneyPayload
