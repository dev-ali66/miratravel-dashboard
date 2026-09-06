/* =====================================================
   JOURNEYS — OVERVIEW HERO PREVIEW
   Matches frontend/components/journey-overview/OverviewHero.tsx
===================================================== */

import { Clock, Compass, Sparkles, DollarSign } from "lucide-react"
import type { Journey } from "../journeyTypes"

export function OverviewHeroPreview({ draft }: { draft: Journey }) {
  const hero = draft.data?.hero
  const media = hero?.media
  const mediaSrc =
    media?.src ||
    (media as any)?.url ||
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80"
  const isVideo = media?.type === "video"

  const durationText =
    draft.minDays === draft.maxDays
      ? `${draft.minDays} Days`
      : `${draft.minDays} - ${draft.maxDays} Days`

  return (
    <div className="relative min-h-[640px] w-full overflow-hidden bg-[#121816] text-[#F9F9F9] flex flex-col justify-end">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video
            src={mediaSrc}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-60"
          />
        ) : (
          <img
            src={mediaSrc}
            alt={draft.title || "Journey Hero"}
            className="h-full w-full object-cover opacity-60 transition-transform duration-700 hover:scale-105"
          />
        )}
        {/* Cinematic gradient overlays matching frontend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121816] via-[#121816]/50 to-black/30" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-8 pb-16 pt-32">
        {/* Badge & Breadcrumb */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EDE7D8]/30 bg-black/40 px-3.5 py-1 text-xs font-medium tracking-widest text-[#EDE7D8] uppercase backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#af6348]" />
            {hero?.badge || "Signature Journey"}
          </span>
          {draft.journeyType && draft.journeyType.length > 0 && (
            <span className="rounded-full bg-[#af6348]/20 border border-[#af6348]/40 px-3 py-0.5 text-xs text-[#EDE7D8]">
              {draft.journeyType.join(" • ")}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="max-w-4xl font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F9F9F9] leading-[1.15]">
          {draft.title || "Untitled Journey"}
        </h1>

        {/* Subtitle */}
        {draft.subtitle && (
          <p className="mt-4 max-w-2xl text-base sm:text-lg font-light text-[#EDE7D8]/90 leading-relaxed">
            {draft.subtitle}
          </p>
        )}

        {/* Quick Attribute Badges Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#EDE7D8]/20 pt-6 text-xs text-[#EDE7D8]/90">
          {/* Duration */}
          <div className="flex items-center gap-2 rounded-lg bg-black/30 px-3.5 py-2 backdrop-blur-md border border-white/10">
            <Clock className="h-4 w-4 text-[#af6348]" />
            <div>
              <div className="text-[10px] text-[#EDE7D8]/60 uppercase tracking-wider">
                Duration
              </div>
              <div className="font-semibold text-white">{durationText}</div>
            </div>
          </div>

          {/* Pace */}
          <div className="flex items-center gap-2 rounded-lg bg-black/30 px-3.5 py-2 backdrop-blur-md border border-white/10">
            <Compass className="h-4 w-4 text-[#af6348]" />
            <div>
              <div className="text-[10px] text-[#EDE7D8]/60 uppercase tracking-wider">
                Pace
              </div>
              <div className="font-semibold text-white capitalize">
                {draft.pace?.toLowerCase() || "Moderate"}
              </div>
            </div>
          </div>

          {/* Comfort */}
          <div className="flex items-center gap-2 rounded-lg bg-black/30 px-3.5 py-2 backdrop-blur-md border border-white/10">
            <Sparkles className="h-4 w-4 text-[#af6348]" />
            <div>
              <div className="text-[10px] text-[#EDE7D8]/60 uppercase tracking-wider">
                Comfort
              </div>
              <div className="font-semibold text-white capitalize">
                {draft.comfortLevel?.replace(/_/g, " ").toLowerCase() || "Luxury"}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 rounded-lg bg-black/30 px-3.5 py-2 backdrop-blur-md border border-white/10">
            <DollarSign className="h-4 w-4 text-[#af6348]" />
            <div>
              <div className="text-[10px] text-[#EDE7D8]/60 uppercase tracking-wider">
                From
              </div>
              <div className="font-semibold text-white">
                {draft.currency || "USD"} ${draft.price?.toLocaleString()}
                <span className="text-[11px] font-normal text-[#EDE7D8]/70"> / person</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="ml-auto">
            <button
              type="button"
              className="rounded-full bg-[#af6348] hover:bg-[#af6348]/90 text-white px-6 py-2.5 text-xs font-medium tracking-wider uppercase transition shadow-lg"
            >
              Inquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
