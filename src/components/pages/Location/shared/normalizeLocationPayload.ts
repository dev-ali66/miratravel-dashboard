/* =====================================================
   LOCATION — PAYLOAD NORMALIZER (MASTER ORCHESTRATOR)
   Ensures that every section, multimedia key, and empty
   field is preserved with `null` or explicit defaults.
   Delegates section normalization to section-specific child
   normalizers located in their respective section folders.
===================================================== */

import type { LocationData } from "../locationTypes"
import { getSectionsForLocationType } from "../config/locationSections"
import {
  normalizeMultimedia,
  normalizeStyledField,
  recursivelyReplaceUndefinedWithNull,
} from "./normalizeHelpers"

import { normalizeHero } from "../sections/hero/normalizeHero"
import { normalizeEssence } from "../sections/essence/normalizeEssence"
import { normalizeHighlights } from "../sections/highlights/normalizeHighlights"
import { normalizeWhyVisit } from "../sections/why-visit/normalizeWhyVisit"
import { normalizePlaceInfo } from "../sections/place-info/normalizePlaceInfo"
import { normalizeGlance } from "../sections/glance/normalizeGlance"
import { normalizeCharacter } from "../sections/character/normalizeCharacter"
import { normalizePracticalInfo } from "../sections/practical-info/normalizePracticalInfo"
import { normalizeStats } from "../sections/stats/normalizeStats"
import { normalizePlaceExperiences } from "../sections/experiences/normalizePlaceExperiences"
import { normalizeRegionExperiences } from "../sections/region-experiences/normalizeRegionExperiences"
import { normalizeSignatureExperiences } from "../sections/signature-experiences/normalizeSignatureExperiences"
import { normalizeTravelInsights } from "../sections/travel-insights/normalizeTravelInsights"
import { normalizeFaq } from "../sections/faq/normalizeFaq"
import { normalizeCta } from "../sections/cta/normalizeCta"
import { normalizeGeoMap } from "../sections/geo-map/normalizeGeoMap"
import { normalizeSeo } from "../sections/seo/normalizeSeo"
import { normalizeSharedInfo } from "../sections/shared-info/normalizeSharedInfo"
import { normalizeStories } from "../sections/stories/normalizeStories"

// Re-export helpers for backward compatibility across the app
export { normalizeMultimedia, normalizeStyledField, recursivelyReplaceUndefinedWithNull }

export function normalizeLocationPayload(
  draft: Partial<LocationData>
): LocationData {
  const safeDraft: any = draft ?? {}
  const safeData = (safeDraft.data ?? {}) as Record<string, any>

  const activeSectionKeys = getSectionsForLocationType(safeDraft.type)
  const isSectionActive = (key: string) => activeSectionKeys.includes(key as any)


  // Raw section data extraction
  const heroData = safeDraft.hero ?? safeData.hero ?? {}
  const essenceData = safeDraft.essence ?? safeData.essence ?? {}
  const highlightsData = safeDraft.highlights ?? safeData.highlights ?? {}
  const whyData = safeDraft.why ?? safeData.why ?? {}
  const infoData = safeDraft.info ?? safeData.info ?? {}
  const glanceData =
    safeDraft.glance ??
    safeDraft.regionGlance ??
    safeData.regionGlance ??
    safeData.glance ??
    {}
  const characterData =
    safeDraft.character ??
    safeDraft.regionCharacter ??
    safeData.regionCharacter ??
    safeData.character ??
    {}
  const practicalData =
    safeDraft.practicalInfo ??
    safeDraft.beforeTravel ??
    safeData.practicalInfo ??
    safeData.beforeTravel ??
    {}
  const statsData =
    safeDraft.statistics ??
    safeDraft.stats ??
    safeData.statistics ??
    safeData.stats ??
    {}
  const experiencesData =
    (safeDraft.experiences && Array.isArray(safeDraft.experiences.items) && safeDraft.experiences.items.length > 0)
      ? safeDraft.experiences
      : safeDraft.experiences ?? safeDraft.experience ?? safeData.experiences ?? safeData.experience ?? {}

  const regionExperiencesData =
    safeDraft.regionExperiences ??
    safeData.regionExperiences ??
    {}
  const signatureExperiencesData =
    safeDraft.signatureExperiences ??
    safeDraft.signature_experiences ??
    safeData.signature_experiences ??
    safeData.signatureExperiences ??
    {}
  const travelInsightsData =
    safeDraft.travelInsight ??
    safeDraft.travelInsights ??
    safeDraft.travel_insights ??
    safeData.travel_insights ??
    safeData.travelInsight ??
    {}
  const faqData =
    safeDraft.faq ??
    safeDraft.faqSection ??
    safeDraft.faq_section ??
    safeData.faq_section ??
    safeData.faq ??
    {}
  const ctaData =
    safeDraft.cta ??
    safeDraft.destinationCta ??
    safeData.destinationCta ??
    safeData.cta ??
    {}
  const geoDataRaw =
    safeDraft.geoData ??
    safeDraft.geo_data ??
    safeData.geo_data ??
    safeData.geoData ??
    {}
  const sharedInfoData =
    safeDraft.sharedInfo ??
    safeDraft.shared_info ??
    safeData.shared_info ??
    safeData.sharedInfo ??
    {}
  const storiesDataRaw =
    safeDraft.stories ??
    safeDraft.miraStories ??
    safeData.miraStories ??
    safeData.stories ??
    {}

  // Normalized sections strictly scoped to active sections configured for the location type
  const finalHero = isSectionActive("hero") ? normalizeHero(heroData) : null
  const finalEssence = isSectionActive("essence") ? normalizeEssence(essenceData) : null
  const finalHighlights = isSectionActive("highlights") ? normalizeHighlights(highlightsData) : null
  const finalWhy = isSectionActive("why-visit") ? normalizeWhyVisit(whyData) : null
  const finalInfo = isSectionActive("place-info") ? normalizePlaceInfo(infoData) : null
  const finalGlance = isSectionActive("glance") ? normalizeGlance(glanceData) : null
  const finalCharacter = isSectionActive("character") ? normalizeCharacter(characterData) : null
  const finalPracticalInfo = isSectionActive("practical-info") ? normalizePracticalInfo(practicalData) : null
  const finalStats = isSectionActive("stats") ? normalizeStats(statsData) : null
  const finalExperiences = isSectionActive("experiences") ? normalizePlaceExperiences(experiencesData) : null
  const finalRegionExperiences = isSectionActive("region-experiences") ? normalizeRegionExperiences(regionExperiencesData) : null
  const finalSignatureExperiences = isSectionActive("signature-experiences") ? normalizeSignatureExperiences(signatureExperiencesData) : null
  const finalTravelInsights = isSectionActive("travel-insights") ? normalizeTravelInsights(travelInsightsData) : null
  const finalFaq = isSectionActive("faq") ? normalizeFaq(faqData) : null
  const finalCta = isSectionActive("cta") ? normalizeCta(ctaData) : null
  const finalGeoData = isSectionActive("geo-map") ? normalizeGeoMap(geoDataRaw) : null
  const finalSharedInfo = isSectionActive("shared-info") ? normalizeSharedInfo(sharedInfoData) : null
  const finalStories = isSectionActive("stories") ? normalizeStories(storiesDataRaw) : null
  const finalSeo = isSectionActive("seo") ? normalizeSeo(safeDraft.metadata?.seo) : null

  const normalized: LocationData = {
    ...(safeDraft.id ? { id: safeDraft.id } : {}),
    name: safeDraft.name ?? "",
    ...(safeDraft.slug ? { slug: safeDraft.slug } : {}),
    type: safeDraft.type ?? "PLACE",
    featured: Boolean(safeDraft.featured),
    parentId: safeDraft.parentId || null,

    // Dedicated root section JSON fields (strictly included only if section is configured for location type)
    ...(finalHero ? { hero: finalHero } : {}),
    ...(finalEssence ? { essence: finalEssence } : {}),
    ...(finalHighlights ? { highlights: finalHighlights } : {}),
    ...(finalWhy ? { why: finalWhy } : {}),
    ...(finalInfo ? { infoCard: finalInfo } : {}),
    ...(finalGlance ? { glance: finalGlance } : {}),
    ...(finalCharacter ? { character: finalCharacter } : {}),
    ...(finalPracticalInfo ? { practicalInfo: finalPracticalInfo } : {}),
    ...(finalStats ? { statistics: finalStats } : {}),
    ...(finalExperiences ? { experience: finalExperiences } : {}),
    ...(finalRegionExperiences ? { regionExperiences: finalRegionExperiences } : {}),
    ...(finalSignatureExperiences ? { signatureExperiences: finalSignatureExperiences } : {}),
    ...(finalTravelInsights ? { travelInsight: finalTravelInsights } : {}),
    ...(finalFaq ? { faq: finalFaq } : {}),
    ...(finalCta ? { cta: finalCta } : {}),
    ...(finalGeoData ? { geoData: finalGeoData as any } : {}),
    ...(finalSharedInfo ? { sharedInfo: finalSharedInfo } : {}),
    ...(finalStories ? { stories: finalStories } : {}),

    ...(finalSeo ? { metadata: { seo: finalSeo } } : {}),
  }

  // Safety net: any remaining undefined anywhere becomes null
  return recursivelyReplaceUndefinedWithNull(normalized)
}
