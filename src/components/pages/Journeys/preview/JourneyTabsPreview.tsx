/* =====================================================
   JOURNEYS — INTERACTIVE TABS PREVIEW
   100% Pixel-Perfect Match with:
   frontend/components/journey-overview/journey-tabs.tsx
===================================================== */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { journeyTabsData } from "./journeyStaticData"
import { OverviewContentPreview } from "./OverviewContentPreview"
import { ItineraryContentPreview } from "./ItineraryContentPreview"
import { AccommodationContentPreview } from "./AccommodationContentPreview"
import { WhatsIncludedPreview } from "./WhatsIncludedPreview"
import { AddonsPreview } from "./AddonsPreview"
import type { Journey } from "../journeyTypes"

const SECTION_PX = "px-4 lg:px-0"

export function JourneyTabsPreview({ draft }: { draft: Journey }) {
  const [activeTab, setActiveTab] = useState<string>("overview")

  return (
    <div className="w-full flex flex-col">
      {/* Tabs Navigation Bar */}
      <div className="w-full sticky top-0 z-20 bg-[#F9F9F9]/95 backdrop-blur-md border-b border-[#D8CBB8]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className={`w-full container mx-auto ${SECTION_PX}`}>
          <div className="max-w-[1216px]">
            <nav className="flex items-center xl:gap-[70px] gap-4 xlg:gap-8 overflow-x-auto no-scrollbar">
              {journeyTabsData.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-2.5 text-sm md:text-base xlg:text-[17px] xl:text-xl font-normal whitespace-nowrap xl:leading-8 xlg:leading-[30px] lgx:leading-7 md:leading-[26px] leading-6 xl:tracking-[2px] tracking-[1.5px] cursor-pointer transition-colors duration-200 relative ${
                      isActive
                        ? "text-accent font-semibold border-b-2 border-accent"
                        : "text-nav-text hover:text-title"
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Dynamic Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col"
          >
            <OverviewContentPreview draft={draft} />
          </motion.div>
        )}

        {activeTab === "itinerary" && (
          <motion.div
            key="itinerary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col"
          >
            <ItineraryContentPreview draft={draft} />
          </motion.div>
        )}

        {activeTab === "accommodation" && (
          <motion.div
            key="accommodation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col"
          >
            <AccommodationContentPreview draft={draft} />
          </motion.div>
        )}

        {activeTab === "included" && (
          <motion.div
            key="included"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col"
          >
            <WhatsIncludedPreview draft={draft} />
          </motion.div>
        )}

        {activeTab === "addons" && (
          <motion.div
            key="addons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col"
          >
            <AddonsPreview draft={draft} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
