import { THEME_COLORS } from "@/config/theme"
import { emptyHero } from "../sections/hero"
import { emptyExploreJourneys } from "../sections/explore-journeys"
import { emptyDestinations } from "../sections/destinations"
import { emptyMiraStories } from "../sections/mira-stories"
import { emptyWhyMira } from "../sections/why-mira"
import { emptyTravelInsights } from "../sections/travel-insights"
import { emptyCustomJourneyCta } from "../sections/custom-journey-cta"
import { emptySeoMetadata } from "../sections/seo"
import type { HomePageData } from "../homeTypes"

export const emptyHomePayload: HomePageData = {
  name: "Home",
  slug: "home",
  metadata: emptySeoMetadata,
  data: {
    page: "home",
    theme: {
      accentColor: THEME_COLORS.accentMuted,
      primaryColor: THEME_COLORS.primary,
      textColorDark: THEME_COLORS.primary,
      textColorLight: THEME_COLORS.white,
    },
    hero: emptyHero,
    explore_journeys: emptyExploreJourneys,
    destinations: emptyDestinations,
    mira_stories: emptyMiraStories,
    why_mira: emptyWhyMira,
    travel_insights: emptyTravelInsights,
    custom_journey_cta: emptyCustomJourneyCta,
    cta: emptyCustomJourneyCta,
  },
}
