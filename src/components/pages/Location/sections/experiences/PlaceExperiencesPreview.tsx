import { useState } from "react"
import { MapPin } from "lucide-react"

import type { LocationPreviewSectionProps } from "../../config/locationSections"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { ExperienceCard } from "../../locationTypes"

export function PlaceExperiencesPreview({ draft }: LocationPreviewSectionProps) {
  if (!draft) return null

  const expData = draft.experience || draft.experiences || {}

  const defaultLocation = draft.name ? `${draft.name}, ALBANIA` : null
  const featured = expData.featured_experience || {}
  const rawCards: ExperienceCard[] = Array.isArray(expData.cards) ? expData.cards : []

  const [showAll, setShowAll] = useState(false)
  const visibleCards = showAll ? rawCards : rawCards.slice(0, 3)

  const featuredButtons = Array.isArray(featured.buttons) && featured.buttons.length > 0
    ? featured.buttons
    : featured.button
    ? [featured.button]
    : featured.action_text
    ? [{ label: featured.action_text, url: "#", variant: "primary" }]
    : []

  return (
    <div className="relative w-full py-8 md:py-10 lg:py-12 overflow-hidden">
      <UniversalMultimediaPreview
        multimedia={expData.backgroundMultimedia}
        fallbackColor="#F1EEE5"
        mode="background"
      />

      <div className="@container container mx-auto px-4 lg:px-6 relative z-10">
        <div className="mx-auto flex w-full flex-col items-center">
          {/* Header */}
          <div className="flex w-full flex-col items-start gap-4">
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
                className="text-2xl md:text-3xl xl:text-[40px] font-semibold font-heading"
              />

              <DynamicStyledTextPreview
                data={expData.description}
                fallbackColor="#565e69"
                as="p"
                className="w-full lg:w-[384px] text-xs md:text-sm font-normal leading-relaxed"
              />
            </div>

            {/* Divider Line */}
            <div className="w-full pt-4 md:pt-6">
              <div className="h-px w-full bg-neutral-300/60" />
            </div>
          </div>

          {/* Featured Experience Banner */}
          {(featured.title || featured.imageMultimedia) && (
            <div className="w-full pt-6 md:pt-8">
              <div className="relative w-full rounded-xl overflow-hidden min-h-[340px] md:min-h-[400px] flex items-end p-6 md:p-8 bg-neutral-900 text-white">
                <UniversalMultimediaPreview
                  multimedia={featured.imageMultimedia}
                  fallbackColor="#1c2813"
                  mode="background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 pointer-events-none" />

                <div className="relative z-20 flex flex-col items-start gap-3 max-w-2xl">
                  {featured.category && (
                    <span className="text-[11px] font-bold tracking-widest text-[#E5C1A2] uppercase bg-black/40 px-2.5 py-1 rounded backdrop-blur-sm">
                      {featured.category} {featured.duration ? `• ${featured.duration}` : ""}
                    </span>
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

          {/* Experience Cards Grid */}
          <div className="w-full pt-6 md:pt-8 lg:pt-10">
            {rawCards.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-neutral-300/80 bg-white/40">
                <p className="text-xs text-neutral-500 italic">
                  No experience cards added yet. Edit the &quot;Curated Experiences&quot; form to add cards.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCards.map((card, idx) => {
                  const cardButtons = Array.isArray(card.buttons) && card.buttons.length > 0
                    ? card.buttons
                    : card.button
                    ? [card.button]
                    : card.action_text
                    ? [{ label: card.action_text, url: "#", variant: "link" }]
                    : []

                  return (
                    <div
                      key={card.id || idx}
                      className="flex flex-col rounded-xl overflow-hidden bg-white border border-neutral-200/80 shadow-sm transition hover:shadow-md"
                    >
                      {/* Card Media */}
                      <div className="relative h-48 md:h-52 w-full overflow-hidden bg-neutral-200">
                        <UniversalMultimediaPreview
                          multimedia={card.imageMultimedia}
                          fallbackColor="#EDE7D8"
                          mode="background"
                        />
                        {card.category && (
                          <span className="absolute top-3 left-3 z-10 rounded bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm uppercase">
                            {card.category}
                          </span>
                        )}
                        {card.price && (
                          <span className="absolute bottom-3 right-3 z-10 rounded bg-[#182d09] px-2.5 py-1 text-[11px] font-bold text-white">
                            {card.price}
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          <DynamicStyledTextPreview
                            data={card.title}
                            fallbackColor="#182d09"
                            as="h4"
                            className="text-base font-semibold font-heading"
                          />

                          <DynamicStyledTextPreview
                            data={card.subtitle || card.description}
                            fallbackColor="#565e69"
                            as="p"
                            className="text-xs line-clamp-3 leading-relaxed"
                          />
                        </div>

                        {cardButtons.length > 0 && (
                          <div className="self-start">
                            <DynamicCmsButtonPreview buttons={cardButtons} defaultVariant="link" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Load More Button */}
            {rawCards.length > 3 && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="rounded bg-[#af6348] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#9c553d] cursor-pointer"
                >
                  {showAll ? "Show Less" : "Load More"}
                </button>
              </div>
            )}

            {/* Bottom Season Info Bar */}
            {(expData.seasonInfo || expData.seasonLocation) && (
              <div className="mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-neutral-300/60 text-xs text-neutral-600">
                {expData.seasonInfo && <p className="max-w-md">{expData.seasonInfo}</p>}
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
    </div>
  )
}
