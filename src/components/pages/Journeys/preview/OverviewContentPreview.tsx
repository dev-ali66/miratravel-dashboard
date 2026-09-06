/* =====================================================
   JOURNEYS — OVERVIEW TAB PREVIEW
   Matches frontend/components/journey-overview/OverviewContent.tsx
===================================================== */

import { Quote, CheckCircle2, Sparkles } from "lucide-react"
import type { Journey } from "../journeyTypes"

export function OverviewContentPreview({ draft }: { draft: Journey }) {
  const whyData = draft.data?.whyWeDesigned
  const routeData = draft.data?.route
  const isThisForYou = draft.data?.isThisForYou
  const highlights = draft.highlights || []

  return (
    <div className="space-y-16 py-12 text-[#235347]">
      {/* 1. WHY WE DESIGNED THIS JOURNEY */}
      {(whyData?.paragraphs?.length || whyData?.quote) && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#af6348]" />
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#121816]">
              {whyData.title || "Why We Designed This Journey"}
            </h2>
          </div>

          {whyData.quote && (
            <div className="relative rounded-2xl bg-[#EDE7D8]/30 border border-[#EDE7D8] p-6 md:p-8">
              <Quote className="absolute top-4 left-4 h-8 w-8 text-[#af6348]/20 -scale-x-100" />
              <p className="relative z-10 font-serif italic text-lg md:text-xl text-[#121816]/90 leading-relaxed pl-8">
                "{whyData.quote}"
              </p>
              <div className="mt-3 text-right text-xs font-semibold tracking-wider text-[#af6348] uppercase">
                — MIRA Journey Curator
              </div>
            </div>
          )}

          {whyData.paragraphs && whyData.paragraphs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#121816]/80 leading-relaxed">
              {whyData.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 2. ROUTE & STOPS AT A GLANCE */}
      {routeData?.stops && routeData.stops.length > 0 && (
        <section className="space-y-6 border-t border-[#EDE7D8] pt-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#af6348]" />
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#121816]">
              The Route At A Glance
            </h2>
          </div>

          {routeData.mapOverviewImage && (
            <div className="overflow-hidden rounded-2xl border border-[#EDE7D8] shadow-sm max-h-72">
              <img
                src={routeData.mapOverviewImage}
                alt="Route Map"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {routeData.stops.map((stop, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border border-[#EDE7D8] bg-white p-5 shadow-xs hover:border-[#af6348]/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#af6348]/10 text-xs font-bold text-[#af6348]">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-[#235347] bg-[#EDE7D8]/40 px-2.5 py-0.5 rounded-full">
                    {stop.nights} {stop.nights === 1 ? "Night" : "Nights"}
                  </span>
                </div>
                <h3 className="font-serif text-base font-semibold text-[#121816]">
                  {stop.destination}
                </h3>
                {stop.summary && (
                  <p className="mt-1.5 text-xs text-[#121816]/70 line-clamp-2">
                    {stop.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. IS THIS JOURNEY FOR YOU? */}
      {isThisForYou?.items && isThisForYou.items.length > 0 && (
        <section className="space-y-6 border-t border-[#EDE7D8] pt-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#af6348]" />
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#121816]">
              {isThisForYou.title || "Is This Journey For You?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isThisForYou.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-[#EDE7D8]/80 bg-[#EDE7D8]/20 p-4"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#235347] mt-0.5" />
                <span className="text-xs md:text-sm text-[#121816]/85 leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. JOURNEY HIGHLIGHTS */}
      {highlights.length > 0 && (
        <section className="space-y-6 border-t border-[#EDE7D8] pt-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#af6348]" />
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#121816]">
              Journey Highlights
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((hl, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#EDE7D8] bg-white p-5 shadow-xs flex items-start gap-3.5 hover:shadow-md transition"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#235347]/10 text-[#235347]">
                  <Sparkles className="h-4 w-4 text-[#af6348]" />
                </div>
                <p className="text-xs md:text-sm font-medium text-[#121816] leading-snug">
                  {hl}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
