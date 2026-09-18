/* =====================================================
   LOCATION — DEFAULT / INITIAL DRAFT (EUROPE)
   Default data loaded when creating a new location.
   Modularized by importing section-level defaults.
===================================================== */

import type { LocationData } from "../locationTypes"
import { emptyHero } from "../sections/hero/emptyHero"
import { emptyPlaceInfo } from "../sections/place-info/emptyPlaceInfo"
import { emptyWhyVisit } from "../sections/why-visit/emptyWhyVisit"
import { emptyExperiences } from "../sections/experiences/emptyExperiences"
import { emptyEssence } from "../sections/essence/emptyEssence"
import { emptyStats } from "../sections/stats/emptyStats"
import { emptyGlance } from "../sections/glance/emptyGlance"
import { emptyCharacter } from "../sections/character/emptyCharacter"
import { emptyHighlights } from "../sections/highlights/emptyHighlights"
import { emptyRegionExperiences } from "../sections/region-experiences/emptyRegionExperiences"
import { emptyGeoData } from "../sections/geo-map/emptyGeoMap"
import { emptyTravelInsights } from "../sections/travel-insights/emptyTravelInsights"
import { emptyPracticalInfo } from "../sections/practical-info/emptyPracticalInfo"
import { emptySignatureExperiences } from "../sections/signature-experiences/emptySignatureExperiences"
import { emptyFaq } from "../sections/faq/emptyFaq"
import { emptyCta } from "../sections/cta/emptyCta"
import { emptySeo } from "../sections/seo/emptySeo"

export const emptyLocation: LocationData = {
  name: "",
  type: "" as any,
  parentId: null,

  hero: emptyHero,
  infoCard: emptyPlaceInfo,
  why: emptyWhyVisit,
  experiences: emptyExperiences,
  essence: emptyEssence,
  stats: emptyStats,
  glance: emptyGlance,
  character: emptyCharacter,
  highlights: emptyHighlights,
  regionExperiences: emptyRegionExperiences,
  geoData: emptyGeoData,
  travelInsight: emptyTravelInsights,
  practicalInfo: emptyPracticalInfo,
  signatureExperiences: emptySignatureExperiences,
  faq: emptyFaq,
  cta: emptyCta,
  metadata: emptySeo,
}
