import { useState } from "react"
import { MapPin, ChevronDown, ChevronUp, Compass } from "lucide-react"

import type { LocationPreviewSectionProps } from "../../config/locationSections"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"

function PreviewExperienceCard({ card }: { card: any }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const cardCategory = typeof card.category === "object" ? card.category?.value : card.category || card.tag?.value || card.tag || "DISCOVERY"
  const cardPrice = card.price || "From $250"

  return (
    <div className="group relative flex w-full flex-col items-start overflow-hidden rounded-[14px] bg-white border border-neutral-200/70 shadow-2xs transition-all duration-300 hover:shadow-md self-start h-fit">
      {/* Top Image / Video Container */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-t-[14px] bg-[#FAF7F2]">
        <UniversalMultimediaPreview
          multimedia={card.imageMultimedia}
          fallbackColor="#FAF7F2"
          mode="background"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

        {/* Category Pill Badge */}
        <div className="absolute left-3 top-3 z-20 inline-flex items-center rounded-full bg-[#2C5F8A] px-2.5 py-1 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-100">
            {cardCategory}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex w-full flex-col items-start gap-2.5 p-4 md:p-5 lg:p-6">
        {/* Title Row */}
        <div className="flex w-full items-start justify-between gap-2">
          <DynamicStyledTextPreview
            data={card.title}
            fallbackColor="#182d09"
            as="h4"
            className="font-heading text-base md:text-lg font-semibold text-[#182d09] leading-snug group-hover:text-[#af6348] transition-colors"
          />
          <div className="pt-0.5 shrink-0 text-[#C8956C]">
            <Compass className="h-4 w-4 md:h-4.5 md:w-4.5 text-[#C8956C]" />
          </div>
        </div>

        {/* Subtitle */}
        <DynamicStyledTextPreview
          data={card.subtitle}
          fallbackColor="#565e69"
          as="p"
          className="text-xs md:text-[13px] font-normal text-neutral-500 leading-relaxed"
        />

        {/* Collapsible Description */}
        {isExpanded && (
          <div className="w-full pt-1 border-t border-neutral-100 mt-1">
            <DynamicStyledTextPreview
              data={card.description}
              fallbackColor="#444a53"
              as="p"
              className="text-xs md:text-sm font-normal text-neutral-600 leading-relaxed"
            />
          </div>
        )}

        {/* Card Footer */}
        <div className="flex w-full items-center justify-between border-t border-neutral-200/60 pt-3 mt-1 text-xs text-neutral-500">
          <span className="font-medium text-neutral-600">
            {cardPrice}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="inline-flex cursor-pointer items-center gap-1 text-[#af6348] hover:text-[#8e4c35] font-semibold text-xs transition-colors"
          >
            <span>{isExpanded ? "Collapse" : "Expand"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export function PlaceExperiencesPreview({ draft }: LocationPreviewSectionProps) {
  if (!draft) return null

  const expData = draft.experiences || draft.experience || {}

  const defaultLocation = draft.name ? `${draft.name}, ALBANIA` : "DESTINATION"

  // Unified items list: items[0] is Featured Banner, items[1+] are Grid Cards
  const items: any[] = Array.isArray(expData.items) && expData.items.length > 0
    ? expData.items
    : Array.isArray(expData.cards) && expData.cards.length > 0
    ? (expData.featured_experience ? [expData.featured_experience, ...expData.cards] : expData.cards)
    : expData.featured_experience
    ? [expData.featured_experience]
    : []

  const featured = items[0] ?? null
  const rawCards = items.length > 1 ? items.slice(1) : []

  const [showAll, setShowAll] = useState(false)
  const visibleCards = showAll ? rawCards : rawCards.slice(0, 3)

  const featuredButtons = Array.isArray(featured?.buttons) && featured.buttons.length > 0
    ? featured.buttons
    : featured?.button
    ? [featured.button]
    : featured?.action_text
    ? [{ label: featured.action_text, url: "#", variant: "primary" }]
    : []

  const featuredCategory = typeof featured?.category === "object" ? featured.category?.value : featured?.category || featured?.tag?.value || featured?.tag || ""

  return (
    <section className="relative w-full py-8 md:py-12 lg:py-14 overflow-hidden">
      {/* Background Media */}
      <UniversalMultimediaPreview
        multimedia={expData.backgroundMultimedia}
        fallbackColor="#F1EEE5"
        mode="background"
      />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="mx-auto flex w-full flex-col items-center">
          {/* Header */}
          <div className="flex w-full flex-col items-start gap-3 md:gap-4">
            {/* Eyebrow Location Tag */}
            {Boolean(expData.location || defaultLocation) && (
              <span className="text-[#af6348] font-semibold text-xs md:text-sm tracking-[2.64px] uppercase">
                {expData.location || defaultLocation}
              </span>
            )}

            {/* Title & Subtitle Row */}
            <div className="flex w-full flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
              <DynamicStyledTextPreview
                data={expData.title}
                fallbackColor="#182d09"
                as="h2"
                className="text-2xl md:text-3xl lg:text-4xl font-semibold font-heading text-[#182d09]"
              />

              <DynamicStyledTextPreview
                data={expData.description}
                fallbackColor="#565e69"
                as="p"
                className="w-full lg:w-[392px] text-xs md:text-sm font-normal text-neutral-600 leading-relaxed"
              />
            </div>

            {/* Divider Line */}
            <div className="w-full pt-4 md:pt-6">
              <div className="h-px w-full bg-neutral-300/60" />
            </div>
          </div>

          {/* Featured Experience Banner (Item 0) */}
          {featured && (
            <div className="w-full pt-6 md:pt-8">
              <div className="group relative flex min-h-[340px] md:min-h-[380px] lg:h-[420px] w-full flex-col justify-end items-start overflow-hidden rounded-xl p-6 md:p-8 lg:p-10 text-white bg-neutral-900 border border-neutral-800">
                <UniversalMultimediaPreview
                  multimedia={featured.imageMultimedia}
                  fallbackColor="#1c2813"
                  mode="background"
                />

                {/* Ambient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

                <div className="relative z-20 flex flex-col items-start gap-3 max-w-2xl">
                  {featuredCategory && (
                    <div className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[#182d09] px-3 py-1 text-[11px] font-semibold uppercase text-neutral-200 tracking-wider">
                        {featuredCategory}
                      </span>
                      {featured.duration && (
                        <span className="text-xs text-neutral-300 font-normal">
                          • {featured.duration}
                        </span>
                      )}
                    </div>
                  )}

                  <DynamicStyledTextPreview
                    data={featured.title}
                    fallbackColor="#FFFFFF"
                    as="h3"
                    className="text-xl md:text-2xl lg:text-3xl font-semibold font-heading text-white"
                  />

                  <DynamicStyledTextPreview
                    data={featured.subtitle}
                    fallbackColor="#E5E5E5"
                    as="p"
                    className="text-xs md:text-sm text-neutral-200 line-clamp-2"
                  />

                  {featuredButtons.length > 0 && (
                    <div className="mt-2">
                      <DynamicCmsButtonPreview buttons={featuredButtons} defaultVariant="primary" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Experience Cards Grid (Items 1+) */}
          <div className="w-full pt-6 md:pt-8 lg:pt-10">
            {items.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-neutral-300/80 bg-white/50">
                <p className="text-xs text-neutral-500 italic">
                  No experience items added yet. Search a location or import children to add curated experiences.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {visibleCards.map((card, idx) => (
                  <PreviewExperienceCard key={card.id || idx} card={card} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {rawCards.length > 3 && (
              <div className="mt-8 mb-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="rounded bg-[#af6348] px-6 py-2.5 text-xs md:text-sm font-semibold text-white transition hover:bg-[#9c553d] cursor-pointer shadow-2xs"
                >
                  {showAll ? "Show Less" : "Load More"}
                </button>
              </div>
            )}

            {/* Bottom Season Info Bar */}
            {(expData.seasonInfo || expData.seasonLocation) && (
              <div className="mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-neutral-300/60 text-xs text-neutral-600">
                {expData.seasonInfo && (
                  <p className="max-w-md text-xs md:text-sm leading-relaxed text-neutral-600">
                    {expData.seasonInfo}
                  </p>
                )}
                {expData.seasonLocation && (
                  <div className="inline-flex items-center gap-1.5 font-semibold text-[#af6348]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{expData.seasonLocation}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
