import { normalizeHero } from "../sections/hero"
import { normalizeExploreJourneys } from "../sections/explore-journeys"
import { normalizeDestinations } from "../sections/destinations"
import { normalizeMiraStories } from "../sections/mira-stories"
import { normalizeWhyMira } from "../sections/why-mira"
import { normalizeTravelInsights } from "../sections/travel-insights"
import { normalizeCustomJourneyCta } from "../sections/custom-journey-cta"
import { normalizeSeoMetadata } from "../sections/seo"
import { recursivelyReplaceUndefinedWithNull } from "@/components/pages/Location/shared/normalizeHelpers"
import type { HomePageData } from "../homeTypes"

export function normalizeHomePayload(raw: any): HomePageData {
  const safePayload = raw && typeof raw === "object" ? raw : {}
  const safeData = safePayload.data && typeof safePayload.data === "object" ? safePayload.data : safePayload

  // Handle legacy array format if present in legacy records
  const legacySections = Array.isArray(safeData.sections) ? safeData.sections : []
  const findLegacySection = (key: string) => legacySections.find((s: any) => s.key === key || s.type === key)

  const heroRaw = safeData.hero ?? findLegacySection("hero") ?? {}
  const exploreRaw = safeData.explore_journeys ?? safeData.exploreJourneys ?? findLegacySection("explore_journeys") ?? {}
  const destinationsRaw = safeData.destinations ?? findLegacySection("destinations") ?? {}
  const storiesRaw = safeData.mira_stories ?? safeData.miraStories ?? findLegacySection("mira_stories") ?? {}
  const whyRaw = safeData.why_mira ?? safeData.whyMira ?? findLegacySection("why_mira") ?? {}
  const insightsRaw = safeData.travel_insights ?? safeData.travelInsights ?? findLegacySection("travel_insights") ?? {}
  const ctaRaw = safeData.custom_journey_cta ?? safeData.customJourneyCta ?? safeData.cta ?? findLegacySection("custom_journey_cta") ?? findLegacySection("cta") ?? {}

  const finalHero = normalizeHero(heroRaw)
  const finalExplore = normalizeExploreJourneys(exploreRaw)
  const finalDestinations = normalizeDestinations(destinationsRaw)
  const finalStories = normalizeMiraStories(storiesRaw)
  const finalWhy = normalizeWhyMira(whyRaw)
  const finalInsights = normalizeTravelInsights(insightsRaw)
  const finalCta = normalizeCustomJourneyCta(ctaRaw)

  const normalized = {
    ...(safePayload.id ? { id: safePayload.id } : {}),
    name: safePayload.name ?? "Home",
    ...(safePayload.slug ? { slug: safePayload.slug } : {}),
    metadata: normalizeSeoMetadata(safePayload.metadata),
    data: {
      page: "home",
      theme: {
        accentColor: safeData.theme?.accentColor ?? "#E5A84B",
        primaryColor: safeData.theme?.primaryColor ?? "#182D09",
        textColorDark: safeData.theme?.textColorDark ?? "#182D09",
        textColorLight: safeData.theme?.textColorLight ?? "#FFFFFF",
      },
      hero: finalHero,
      explore_journeys: finalExplore,
      destinations: finalDestinations,
      mira_stories: finalStories,
      why_mira: finalWhy,
      travel_insights: finalInsights,
      custom_journey_cta: finalCta,
      cta: finalCta,
    },
  }

  return recursivelyReplaceUndefinedWithNull(normalized) as HomePageData
}
