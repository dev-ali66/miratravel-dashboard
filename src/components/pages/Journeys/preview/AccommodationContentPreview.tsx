/* =====================================================
   JOURNEYS — ACCOMMODATIONS TAB PREVIEW
   Matches frontend/components/journey-overview/AccommodationContent.tsx
===================================================== */

import { Building2, MapPin, Moon, Check } from "lucide-react"
import {
  getJourneyAccommodationPhilosophy,
  getJourneyAccommodationStays,
  type Journey,
} from "../journeyTypes"

export function AccommodationContentPreview({ draft }: { draft: Journey }) {
  const stays = getJourneyAccommodationStays(draft)
  const philosophy = getJourneyAccommodationPhilosophy(draft)

  return (
    <div className="py-12 space-y-12 text-[#235347]">
      {/* Philosophy Header */}
      <div className="border-b border-[#EDE7D8] pb-6 space-y-3">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#121816]">
          Where You Stay
        </h2>
        {philosophy ? (
          <p className="max-w-3xl text-sm text-[#121816]/80 leading-relaxed font-light">
            {philosophy}
          </p>
        ) : (
          <p className="text-sm text-[#121816]/70">
            Selected for charm, authentic hospitality, and breathtaking settings.
          </p>
        )}
      </div>

      {/* Stays List */}
      <div className="space-y-8">
        {stays.map((stay, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-[#EDE7D8] bg-white shadow-xs hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12"
          >
            {/* Image section */}
            <div className="relative md:col-span-5 min-h-[220px] bg-muted">
              {stay.images && stay.images[0] ? (
                <img
                  src={stay.images[0]}
                  alt={stay.hotelName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#EDE7D8]/30 text-[#af6348]">
                  <Building2 className="h-12 w-12 opacity-40" />
                </div>
              )}
              {stay.nights && (
                <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-md flex items-center gap-1.5">
                  <Moon className="h-3 w-3 text-[#af6348]" />
                  {stay.nights} {stay.nights === 1 ? "Night" : "Nights"}
                </div>
              )}
            </div>

            {/* Info section */}
            <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold tracking-wider text-[#af6348] uppercase">
                    {stay.roomType || "Boutique Accommodation"}
                  </span>
                  {stay.location && (
                    <div className="flex items-center gap-1 text-xs text-[#235347]/80">
                      <MapPin className="h-3 w-3 text-[#af6348]" />
                      {stay.location}
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-normal text-[#121816] mt-1">
                  {stay.hotelName}
                </h3>

                {stay.description && (
                  <p className="mt-3 text-xs md:text-sm text-[#121816]/80 leading-relaxed">
                    {stay.description}
                  </p>
                )}
              </div>

              {/* Amenities */}
              {stay.amenities && stay.amenities.length > 0 && (
                <div className="border-t border-[#EDE7D8]/60 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {stay.amenities.map((am, amIdx) => (
                      <span
                        key={amIdx}
                        className="inline-flex items-center gap-1 rounded-full bg-[#EDE7D8]/40 px-2.5 py-1 text-[11px] font-medium text-[#235347]"
                      >
                        <Check className="h-3 w-3 text-[#af6348]" />
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
