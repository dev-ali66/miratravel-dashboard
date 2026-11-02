import { useState } from "react"
import { useJourneyDraft } from "./shared/JourneyDraftContext"
import { HeroPreview } from "./sections/hero/HeroPreview"
import { OverviewPreview } from "./sections/overview/OverviewPreview"
import { ItineraryPreview } from "./sections/itinerary/ItineraryPreview"
import { AccommodationsPreview } from "./sections/accommodations/AccommodationsPreview"
import { WhatsIncludedPreview } from "./sections/whats-included/WhatsIncludedPreview"
import { AddOnsPreview } from "./sections/add-ons/AddOnsPreview"
import { PriceCard } from "./sections/overview/PriceCard"
import { BookingModal } from "./sections/overview/BookingModal"

const JOURNEY_TABS = [
  { id: "overview", label: "OVERVIEW" },
  { id: "itinerary", label: "ITINERARY" },
  { id: "accommodation", label: "ACCOMMODATION" },
  { id: "included", label: "WHAT'S INCLUDED" },
  { id: "addons", label: "ADD-ONS" },
]

export function JourneyPreview() {
  const { draft } = useJourneyDraft()
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  if (!draft) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8 text-[#57534E] font-sans">
        No journey draft loaded.
      </div>
    )
  }

  const journeyTitle = draft.title || "Adventurous Journey"

  const priceCard = (
    <PriceCard
      title={journeyTitle}
      price={draft.price}
      currency={draft.currency}
      days={draft.days || ((draft.hero as any)?.days ? String((draft.hero as any).days) : undefined)}
      onRequestBooking={() => setIsBookingModalOpen(true)}
    />
  )

  return (
    <div className="w-full min-h-full bg-[#FFF7EF] text-[#222014] text-sm md:text-base selection:bg-[#8D6534]/20 selection:text-[#8D6534] flex flex-col font-sans overflow-x-hidden">
      {/* 1. Hero Section */}
      <div data-section="hero" className="w-full">
        <HeroPreview draft={draft} hero={draft.hero} />
      </div>

      {/* 2. Sticky Tabs Navigation Bar (Matching Frontend Luxury Tabs Bar) */}
      <div className="w-full sticky top-0 bg-[#FFF7EF]/95 backdrop-blur-md z-30 border-b border-[#E8E2D8] shadow-2xs">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
          <nav id="journey-tabs-nav" className="flex items-center gap-6 md:gap-10 xl:gap-[70px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {JOURNEY_TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-3 px-3 first:pl-0 text-sm md:text-base xl:text-lg font-sans tracking-[1.5px] cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                    isActive ? "text-[#8D6534] font-semibold" : "text-[#4A483E] hover:text-[#222014]"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#8D6534]" />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* 3. Full-width Tab Content Panels with Bottom PriceCard (1:1 with Frontend TabContentLayout) */}
      <div className="w-full flex-1">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 md:py-12">
            <div data-section="overview" className="w-full min-w-0 flex flex-col">
              <OverviewPreview overview={draft.overview} draft={draft} />
            </div>
            {priceCard}
          </div>
        )}

        {/* TAB 2: ITINERARY */}
        {activeTab === "itinerary" && (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 md:py-12">
            <div data-section="itinerary" className="w-full min-w-0">
              <ItineraryPreview itinerary={draft.itinerary} draft={draft} />
            </div>
            {priceCard}
          </div>
        )}

        {/* TAB 3: ACCOMMODATION */}
        {activeTab === "accommodation" && (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 md:py-12">
            <div data-section="accommodations" className="w-full min-w-0">
              <AccommodationsPreview accommodations={draft.accommodations} draft={draft} />
            </div>
            {priceCard}
          </div>
        )}

        {/* TAB 4: WHAT'S INCLUDED */}
        {activeTab === "included" && (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 md:py-12">
            <div data-section="whats-included" className="w-full min-w-0">
              <WhatsIncludedPreview whatsIncluded={draft.whatsIncluded} draft={draft} />
            </div>
            {priceCard}
          </div>
        )}

        {/* TAB 5: ADD ONN'S */}
        {activeTab === "addons" && (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 md:py-12">
            <div data-section="add-ons" className="w-full min-w-0">
              <AddOnsPreview addOns={draft.addOns} draft={draft} />
            </div>
            {priceCard}
          </div>
        )}
      </div>

      {/* Booking Modal on Request Click */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        journeyTitle={journeyTitle}
        price={draft.price}
        currency={draft.currency}
      />
    </div>
  )
}

export default JourneyPreview
