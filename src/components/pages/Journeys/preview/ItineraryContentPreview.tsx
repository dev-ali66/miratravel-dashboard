/* =====================================================
   JOURNEYS — ITINERARY TAB PREVIEW
   Matches frontend/components/journey-overview/ItineraryContent.tsx
===================================================== */

import { MapPin, Utensils, Hotel, Check, Compass } from "lucide-react"
import {
  getJourneyItineraryDays,
  type Journey,
  type ItineraryDayItem,
} from "../journeyTypes"

export function ItineraryContentPreview({ draft }: { draft: Journey }) {
  const days: ItineraryDayItem[] = getJourneyItineraryDays(draft)

  if (days.length === 0) {
    return (
      <div className="py-20 text-center text-[#121816]/60">
        <Compass className="mx-auto h-12 w-12 text-[#EDE7D8]" />
        <p className="mt-4 font-serif text-lg">No itinerary days added yet.</p>
        <p className="text-xs">Add days in the editor to view the day-by-day story timeline.</p>
      </div>
    )
  }

  return (
    <div className="py-12 space-y-12 text-[#235347]">
      {/* Intro Header */}
      <div className="border-b border-[#EDE7D8] pb-6">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#121816]">
          Daily Itinerary & Experiences
        </h2>
        <p className="mt-2 text-sm text-[#121816]/70">
          A thoughtfully curated flow from vibrant cultural quarters to remote alpine heights.
        </p>
      </div>

      {/* Timeline container */}
      <div className="relative pl-6 md:pl-10 space-y-12 before:absolute before:left-3 md:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#EDE7D8]">
        {days.map((day, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 md:-left-10 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#af6348] text-white shadow-md text-xs font-bold">
              {day.dayNumber || idx + 1}
            </div>

            {/* Day Card */}
            <div className="rounded-2xl border border-[#EDE7D8] bg-white p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow">
              {/* Day Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDE7D8]/60 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#af6348]">
                    Day {day.dayNumber || idx + 1}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl font-normal text-[#121816] mt-0.5">
                    {day.title}
                  </h3>
                  {day.subtitle && (
                    <p className="text-xs font-medium text-[#235347]/80 mt-1">
                      {day.subtitle}
                    </p>
                  )}
                </div>

                {day.location && (
                  <div className="flex items-center gap-1.5 rounded-full bg-[#EDE7D8]/40 px-3 py-1 text-xs text-[#235347] font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[#af6348]" />
                    {day.location}
                  </div>
                )}
              </div>

              {/* Day Narrative */}
              {day.description && (
                <p className="mt-4 text-sm text-[#121816]/85 leading-relaxed whitespace-pre-line">
                  {day.description}
                </p>
              )}

              {/* Activities */}
              {day.activities && day.activities.length > 0 && (
                <div className="mt-5 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#121816]/80">
                    Day Highlights & Activities
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {day.activities.map((act, actIdx) => (
                      <div
                        key={actIdx}
                        className="flex items-start gap-2 text-xs text-[#121816]/80"
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#235347]/10 text-[#235347] mt-0.5">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day Imagery */}
              {day.images && day.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {day.images.map((imgUrl, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="overflow-hidden rounded-xl border border-[#EDE7D8] aspect-4/3"
                    >
                      <img
                        src={imgUrl}
                        alt={`${day.title} - photo ${imgIdx + 1}`}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Meals & Stays Badges Footer */}
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[#EDE7D8]/60 pt-4 text-xs text-[#121816]/75">
                {day.meals && (
                  <div className="flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-[#af6348]" />
                    <span className="font-medium text-[#121816]">Meals:</span> {day.meals}
                  </div>
                )}
                {day.accommodation && (
                  <div className="flex items-center gap-1.5">
                    <Hotel className="h-3.5 w-3.5 text-[#af6348]" />
                    <span className="font-medium text-[#121816]">Stay:</span> {day.accommodation}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
