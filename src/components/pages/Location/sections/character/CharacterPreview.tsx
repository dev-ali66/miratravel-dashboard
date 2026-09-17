/* =====================================================
   LOCATION — CHARACTER PREVIEW SECTION
   Renders pixel-perfect 1:1 preview matching frontend RegionCharacter component
   (frontend/components/region/character.tsx).
   Includes admin empty-state placeholder when no items exist.
===================================================== */

import { Sparkles } from "lucide-react"
import { DynamicStyledPreview } from "@/components/shared/DynamicStyledPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"

export function CharacterPreview({ draft }: LocationPreviewSectionProps) {
  const characterData =
    draft?.character ||
    draft?.regionCharacter ||
    (draft as any)?.data?.character ||
    (draft as any)?.data?.regionCharacter ||
    {}

  const rawItems = characterData.items
  const items: any[] = Array.isArray(rawItems) ? rawItems : []

  const bgMultimedia = characterData.backgroundMultimedia

  return (
    <section
      data-section="character"
      className="relative w-full overflow-hidden pb-[40px] @xs:pb-[45px] @sm:pb-[48px] @md:pb-[50px] @lg:pb-[55px] @xl:pb-[59px] font-sans"
    >
      <UniversalMultimediaPreview
        multimedia={bgMultimedia}
        fallbackColor="#FFF8F2"
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4 @xs:px-5 @sm:px-6 @md:px-8 @lg:px-6 @xl:px-0">
        <div className="w-full flex flex-col items-start gap-8 sm:gap-10 md:gap-12 xl:gap-14 pt-8">
          {/* Section Header */}
          <div className="w-full flex flex-col items-start">
            <DynamicStyledPreview
              as="span"
              field={characterData.label}
              fallback="CHARACTER"
              fallbackColor="#af6348"
              className="font-normal uppercase text-xs @xs:text-sm @md:text-[15px] @xl:text-base tracking-[3px] leading-tight"
            />
            <div className="w-full max-w-[1023px] pt-3">
              <DynamicStyledPreview
                as="h2"
                field={characterData.title}
                fallback={`What makes ${draft?.name || "this region"} singular`}
                fallbackColor="#182d09"
                className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight font-normal tracking-tight"
              />
            </div>
          </div>

          {/* Pillars Grid or Admin Empty State Notice */}
          {items.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-muted/20 p-10 text-center min-h-[200px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#af6348]/10 text-[#af6348] mb-2.5">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-serif font-medium text-foreground mb-1">
                Character Section (Empty State)
              </h3>
              <p className="text-xs text-muted-foreground max-w-md">
                No character pillar items added yet. Click &quot;Add Character Pillar Item&quot; in the left form panel to add regional characteristics, culture, and wilderness highlights.
              </p>
            </div>
          ) : (
            <div className="w-full border-t border-[#182d09]/15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#182d09]/15">
              {items.map((item: any, index: number) => {
                const itemTitle =
                  typeof item.title === "object" ? item.title?.value : item.title || ""
                const itemTitleStr = typeof itemTitle === "string" ? itemTitle : ""
                const itemDesc =
                  typeof item.description === "object"
                    ? item.description?.value
                    : item.description || ""
                const rawButtons =
                  Array.isArray(item.buttons) && item.buttons.length > 0
                    ? item.buttons
                    : item.button
                    ? [item.button]
                    : item.href || item.linkText
                    ? [{ label: item.linkText || "Read More", url: item.href || "#", variant: "primary" }]
                    : []

                return (
                  <div
                    key={item.id || index}
                    className="flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 gap-6 transition-colors hover:bg-black/[0.015]"
                  >
                    <div className="flex flex-col gap-4 items-start">
                      {/* Icon or Multimedia */}
                      {item.multimedia && item.multimedia.show === "image" && item.multimedia.image?.url ? (
                        <div className="size-10 rounded-lg overflow-hidden border border-black/10">
                          <img
                            src={item.multimedia.image.url}
                            alt={item.multimedia.image.alt || itemTitleStr}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : item.iconImage ? (
                        <div className="size-10 rounded-lg overflow-hidden border border-black/10">
                          <img
                            src={item.iconImage}
                            alt={itemTitleStr}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[#af6348]/10 text-[#af6348]">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-5"
                          >
                            <path
                              d="M2 17L8.5 4.5L13.5 13.5L15.5 9.5L18.5 17H2Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Pillar Title */}
                      <DynamicStyledPreview
                        as="h3"
                        field={item.title}
                        fallback={itemTitleStr || "Pillar Title"}
                        fallbackColor="#182d09"
                        className="font-serif text-lg sm:text-xl md:text-2xl font-normal leading-snug"
                      />

                      {/* Pillar Description */}
                      <DynamicStyledPreview
                        as="p"
                        field={item.description}
                        fallback={typeof itemDesc === "string" ? itemDesc : "Pillar description goes here..."}
                        fallbackColor="#565e69"
                        className="text-sm md:text-[15px] leading-relaxed font-sans"
                      />
                    </div>

                    {/* Read More / Action Buttons */}
                    {rawButtons.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        {rawButtons.map((btn: any, bIdx: number) => {
                          const label = btn.label || btn.text || "Read More"
                          const url = btn.url || btn.href || "#"
                          return (
                            <a
                              key={bIdx}
                              href={url}
                              onClick={(e) => e.preventDefault()}
                              className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-[#af6348] group cursor-pointer hover:underline"
                            >
                              <span>{label}</span>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              >
                                <path
                                  d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
