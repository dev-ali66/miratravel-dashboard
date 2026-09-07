/* =====================================================
   JOURNEYS — MASTER LIVE PREVIEW COMPONENT
   100% Pixel-Perfect Match with:
   frontend/app/(site)/journeys/[slug]/page.tsx &
   frontend/components/journey-overview/journey-overview-client.tsx
===================================================== */

import { useJourneyDraft } from "../shared/JourneyDraftContext"
import { OverviewHeroPreview } from "./OverviewHeroPreview"
import { JourneyTabsPreview } from "./JourneyTabsPreview"
import { SimilarJourneysPreview } from "./SimilarJourneysPreview"
import type { Journey } from "../journeyTypes"

export function JourneyPreview({ draft: propDraft }: { draft?: Journey }) {
  const { draft: contextDraft } = useJourneyDraft()
  const draft = propDraft || contextDraft || ({} as Journey)

  return (
    <div className="w-full bg-[#F9F9F9] min-h-screen text-[#080c1d] font-sans antialiased selection:bg-[#af6348] selection:text-white">
      {/* 1. Hero with floating OverviewCard */}
      <div data-section="basic-info">
        <OverviewHeroPreview draft={draft} />
      </div>

      {/* 2. Sticky Tab Navigation & Dynamic Panels */}
      <div data-section="overview">
        <JourneyTabsPreview draft={draft} />
      </div>

      {/* 3. Similar Journeys 3-Card Grid */}
      <div data-section="similar-journeys">
        <SimilarJourneysPreview />
      </div>
    </div>
  )
}
