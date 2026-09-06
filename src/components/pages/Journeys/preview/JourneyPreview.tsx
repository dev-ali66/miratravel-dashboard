/* =====================================================
   JOURNEYS — MASTER LIVE PREVIEW COMPONENT
===================================================== */

import { useJourneyDraft } from "../shared/JourneyDraftContext"
import { OverviewHeroPreview } from "./OverviewHeroPreview"
import { JourneyTabsPreview } from "./JourneyTabsPreview"
import type { Journey } from "../journeyTypes"
import { Compass } from "lucide-react"

export function JourneyPreview({ draft: propDraft }: { draft?: Journey }) {
  const { draft: contextDraft } = useJourneyDraft()
  const draft = propDraft || contextDraft

  if (!draft) {
    return (
      <div className="flex h-full min-h-[500px] flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <Compass className="h-10 w-10 animate-spin opacity-40" />
        <p className="mt-4 text-sm font-medium">Loading Journey preview...</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#FDFBF7] min-h-screen text-[#121816] font-sans antialiased selection:bg-[#af6348] selection:text-white">
      {/* 1. Hero */}
      <OverviewHeroPreview draft={draft} />

      {/* 2. Sticky Tab Nav & Panels */}
      <JourneyTabsPreview draft={draft} />
    </div>
  )
}
