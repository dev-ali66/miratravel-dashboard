/* =====================================================
   JOURNEYS — INTERACTIVE TABS PREVIEW
   Matches frontend/components/journey-overview/StickyNav.tsx + tab panels
===================================================== */

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Journey } from "../journeyTypes"
import { OverviewContentPreview } from "./OverviewContentPreview"
import { ItineraryContentPreview } from "./ItineraryContentPreview"
import { AccommodationContentPreview } from "./AccommodationContentPreview"
import { WhatsIncludedPreview } from "./WhatsIncludedPreview"
import { AddonsPreview } from "./AddonsPreview"

type TabKey = "overview" | "itinerary" | "stay" | "inclusions" | "addons"

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "itinerary", label: "Itinerary" },
  { key: "stay", label: "Where You Stay" },
  { key: "inclusions", label: "Inclusions" },
  { key: "addons", label: "Add-ons" },
]

export function JourneyTabsPreview({ draft }: { draft: Journey }) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview")

  return (
    <div className="w-full bg-[#FDFBF7]">
      {/* Sticky Tab Bar */}
      <div className="sticky top-0 z-30 border-b border-[#EDE7D8] bg-[#FDFBF7]/95 backdrop-blur shadow-xs">
        <div className="mx-auto max-w-6xl px-8 flex items-center justify-between">
          <nav className="flex space-x-8 overflow-x-auto py-4 scrollbar-none">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative text-xs md:text-sm font-medium tracking-wider uppercase transition-colors whitespace-nowrap pb-1",
                    isActive
                      ? "text-[#af6348] font-semibold"
                      : "text-[#121816]/70 hover:text-[#121816]"
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#af6348] rounded-full" />
                  )}
                </button>
              )
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-[#121816]/60">Live Preview</span>
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Tab Panel Content Container */}
      <div className="mx-auto max-w-6xl px-8 min-h-[600px]">
        {activeTab === "overview" && <OverviewContentPreview draft={draft} />}
        {activeTab === "itinerary" && <ItineraryContentPreview draft={draft} />}
        {activeTab === "stay" && <AccommodationContentPreview draft={draft} />}
        {activeTab === "inclusions" && <WhatsIncludedPreview draft={draft} />}
        {activeTab === "addons" && <AddonsPreview draft={draft} />}
      </div>
    </div>
  )
}
