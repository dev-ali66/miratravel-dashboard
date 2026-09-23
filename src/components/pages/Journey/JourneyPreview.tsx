import { useState } from "react"
import { useJourneyDraft } from "./shared/JourneyDraftContext"
import { HeroPreview } from "./sections/hero/HeroPreview"
import { OverviewPreview } from "./sections/overview/OverviewPreview"
import { ItineraryPreview } from "./sections/itinerary/ItineraryPreview"
import { AccommodationsPreview } from "./sections/accommodations/AccommodationsPreview"
import { WhatsIncludedPreview } from "./sections/whats-included/WhatsIncludedPreview"
import { AddOnsPreview } from "./sections/add-ons/AddOnsPreview"
import { BookingOverviewCard } from "./sections/overview/BookingOverviewCard"
import { BookingModal } from "./sections/overview/BookingModal"

const JOURNEY_TABS = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "accommodations", label: "Accommodation" },
  { id: "whats-included", label: "What's Included" },
  { id: "add-ons", label: "Add Onn’s" },
]

export function JourneyPreview() {
  const { draft } = useJourneyDraft()
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  if (!draft) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8 text-muted-foreground font-sans">
        No journey draft loaded.
      </div>
    )
  }

  const journeyTitle = draft.title || "Journey Experience"
  const bookingCard = (
    <BookingOverviewCard
      price={draft.price}
      currency={draft.currency}
      onRequestBooking={() => setIsBookingModalOpen(true)}
      className="w-full"
    />
  )

  return (
    <div className="@container w-full min-h-full bg-[#FAF6F0] text-foreground text-sm md:text-base selection:bg-[#af6348]/20 selection:text-[#af6348] flex flex-col">
      {/* 1. Hero Section */}
      <div data-section="hero" className="w-full">
        <HeroPreview draft={draft} hero={draft.hero} />
      </div>

      {/* 2. Tabs Navigation Bar */}
      <div className="w-full sticky top-0 bg-[#FAF6F0] z-30 border-b border-[#D8CBB8] shadow-xs">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
          <nav className="flex items-center gap-4 md:gap-8 xl:gap-[50px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
            {JOURNEY_TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-3.5 px-2 text-sm md:text-base xl:text-lg font-serif tracking-[1.5px] cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                    isActive ? "text-[#af6348] font-semibold" : "text-[#464136] hover:text-[#080c1d]"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#af6348]" />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* 3. Tab Content Panels */}
      <div className="w-full flex-1">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="w-full flex flex-col">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 md:py-12">
              <div className="w-full flex flex-col xlg:grid xlg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_380px] justify-between gap-8 xl:gap-12 items-start">
                <div data-section="overview" className="w-full min-w-0 flex flex-col gap-10">
                  <OverviewPreview overview={draft.overview} draft={draft} />
                </div>

                <aside className="hidden xlg:block shrink-0 w-full sticky top-20">
                  {bookingCard}
                </aside>
              </div>

              <div className="xlg:hidden w-full pt-8 pb-4">
                {bookingCard}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ITINERARY */}
        {activeTab === "itinerary" && (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 md:py-12">
            <div className="w-full flex flex-col xlg:grid xlg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_380px] justify-between gap-8 xl:gap-12 items-start">
              <div data-section="itinerary" className="w-full min-w-0">
                <ItineraryPreview itinerary={draft.itinerary} draft={draft} />
              </div>

              <aside className="hidden xlg:block shrink-0 w-full sticky top-20">
                {bookingCard}
              </aside>
            </div>

            <div className="xlg:hidden w-full pt-8 pb-4">
              {bookingCard}
            </div>
          </div>
        )}

        {/* TAB 3: ACCOMMODATION */}
        {activeTab === "accommodations" && (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 md:py-12">
            <div className="w-full flex flex-col xlg:grid xlg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_380px] justify-between gap-8 xl:gap-12 items-start">
              <div data-section="accommodations" className="w-full min-w-0">
                <AccommodationsPreview accommodations={draft.accommodations} draft={draft} />
              </div>

              <aside className="hidden xlg:block shrink-0 w-full sticky top-20">
                {bookingCard}
              </aside>
            </div>

            <div className="xlg:hidden w-full pt-8 pb-4">
              {bookingCard}
            </div>
          </div>
        )}

        {/* TAB 4: WHAT'S INCLUDED */}
        {activeTab === "whats-included" && (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 md:py-12">
            <div className="w-full flex flex-col xlg:grid xlg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_380px] justify-between gap-8 xl:gap-12 items-start">
              <div data-section="whats-included" className="w-full min-w-0">
                <WhatsIncludedPreview whatsIncluded={draft.whatsIncluded} draft={draft} />
              </div>

              <aside className="hidden xlg:block shrink-0 w-full sticky top-20">
                {bookingCard}
              </aside>
            </div>

            <div className="xlg:hidden w-full pt-8 pb-4">
              {bookingCard}
            </div>
          </div>
        )}

        {/* TAB 5: ADD ONN'S */}
        {activeTab === "add-ons" && (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 md:py-12">
            <div className="w-full flex flex-col xlg:grid xlg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_380px] justify-between gap-8 xl:gap-12 items-start">
              <div data-section="add-ons" className="w-full min-w-0">
                <AddOnsPreview addOns={draft.addOns} draft={draft} />
              </div>

              <aside className="hidden xlg:block shrink-0 w-full sticky top-20">
                {bookingCard}
              </aside>
            </div>

            <div className="xlg:hidden w-full pt-8 pb-4">
              {bookingCard}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
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
