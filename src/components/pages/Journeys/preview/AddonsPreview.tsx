/* =====================================================
   JOURNEYS — ADD-ONS TAB PREVIEW
   Matches frontend/components/journey-overview/AddonsContent.tsx
===================================================== */

import { Clock, Sparkles } from "lucide-react"
import { getJourneyAddons, type Journey, type AddonItem } from "../journeyTypes"

export function AddonsPreview({ draft }: { draft: Journey }) {
  const addons: AddonItem[] = getJourneyAddons(draft)

  if (addons.length === 0) {
    return (
      <div className="py-20 text-center text-[#121816]/60">
        <Sparkles className="mx-auto h-12 w-12 text-[#EDE7D8]" />
        <p className="mt-4 font-serif text-lg">No optional add-ons configured.</p>
        <p className="text-xs">Add-on experiences let travelers personalize their journey.</p>
      </div>
    )
  }

  return (
    <div className="py-12 space-y-12 text-[#235347]">
      {/* Header */}
      <div className="border-b border-[#EDE7D8] pb-6">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#121816]">
          Optional Enhancements & Excursions
        </h2>
        <p className="mt-2 text-sm text-[#121816]/70">
          Personalize your journey with private tastings, helicopter hops, and masterclasses.
        </p>
      </div>

      {/* Addons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addons.map((addon, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-[#EDE7D8] bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {addon.image ? (
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <img
                    src={addon.image}
                    alt={addon.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {addon.duration && (
                    <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[11px] text-white backdrop-blur-md flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#af6348]" />
                      {addon.duration}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-32 bg-[#EDE7D8]/30 flex items-center justify-center text-[#af6348]">
                  <Sparkles className="h-8 w-8 opacity-40" />
                </div>
              )}

              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#af6348] uppercase tracking-wider">
                    Add-on
                  </span>
                  <span className="text-sm font-bold text-[#121816]">
                    +{addon.currency || "USD"} ${addon.price}
                  </span>
                </div>

                <h3 className="font-serif text-base font-semibold text-[#121816]">
                  {addon.title}
                </h3>

                {addon.description && (
                  <p className="text-xs text-[#121816]/75 leading-relaxed">
                    {addon.description}
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                className="w-full rounded-lg border border-[#af6348] py-2 text-xs font-medium text-[#af6348] hover:bg-[#af6348] hover:text-white transition"
              >
                Request Experience
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
