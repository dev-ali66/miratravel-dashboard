import { useState } from "react"
import { Sparkles, ChevronDown } from "lucide-react"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"

export function PracticalInfoPreview({ draft }: LocationPreviewSectionProps) {
  const practicalData =
    draft?.practicalInfo ||
    (draft as any)?.data?.practicalInfo ||
    (draft as any)?.travelInfo?.beforeTravel ||
    (draft as any)?.beforeTravel ||
    {}

  const rawItems = practicalData.items
  const items: any[] = Array.isArray(rawItems) ? rawItems : []

  const [openIndex, setOpenIndex] = useState<number | null>(
    items.length > 0 ? 0 : null
  )

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx))
  }

  const activeItem = openIndex !== null && items[openIndex] ? items[openIndex] : null
  const activeItemMedia = activeItem?.multimedia || activeItem?.imageMultimedia

  const hasMediaContent = (media: any) => {
    if (!media) return false
    const show = media.show || "image"
    if (show === "image" && media.image?.url) return true
    if (show === "video" && media.video?.url) return true
    if (show === "color" && media.color?.color) return true
    return false
  }

  const featuredMedia = hasMediaContent(activeItemMedia)
    ? activeItemMedia
    : (practicalData.sideImageMultimedia || practicalData.imageMultimedia)

  const bgMultimedia = practicalData.backgroundMultimedia

  return (
    <section
      data-section="practical-info"
      className="relative w-full bg-surface-accent xl:py-[90px] xlg:py-[85px] lg:py-[80px] md:py-[70px] py-[60px] overflow-hidden font-sans"
    >
      <UniversalMultimediaPreview
        multimedia={bgMultimedia}
        fallbackColor="#FFF8F2"
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4 @xs:px-5 @sm:px-6 @md:px-8 @lg:px-6 @xl:px-0">
        <div className="w-full xl:px-[88.5px] flex flex-col items-start">
          {/* Eyebrow Label with Amber Accent Line */}
          <div className="flex items-center gap-3 mb-4 xl:mb-6">
            <div className="w-8 h-px bg-[#af6348]" />
            <DynamicStyledTextPreview
              as="span"
              data={practicalData.label}
              fallbackColor="#af6348"
              className="text-[#af6348] text-[11px] md:text-xs xl:text-sm font-normal uppercase leading-4 tracking-[3px] md:tracking-[4.2px]"
            />
          </div>

          {/* Main 2-Column Layout */}
          <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-10 md:gap-12 lg:gap-[60px] xl:gap-[80px]">
            {/* Left Column: Heading & Sticky/Square Image */}
            <div className="w-full lg:w-[360px] xlg:w-[370px] xl:w-[380px] shrink-0 flex flex-col items-start">
              <DynamicStyledTextPreview
                as="h2"
                data={practicalData.title}
                fallbackColor="#182d09"
                className="text-[#182d09] font-serif text-[26px] sm:text-[28px] md:text-[30px] lg:text-[32px] xlg:text-[34px] xl:text-[36px] leading-[36px] lg:leading-[42px] xl:leading-[49.5px] font-semibold"
              />

              <div className="mt-6 md:mt-10 lg:mt-12 xlg:mt-[52px] xl:mt-[56px] relative w-[260px] md:w-[334px] xlg:w-[314px] lg:w-[300px] xl:w-[334px] aspect-square overflow-hidden group rounded-[2px] border border-black/10 shadow-xs">
                <UniversalMultimediaPreview
                  multimedia={featuredMedia}
                  fallbackColor="#182d09"
                  mode="container"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: Accordion List or Admin Empty State */}
            <div className="w-full lg:flex-1 lg:max-w-[780px] flex flex-col">
              {items.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-muted/20 p-10 text-center min-h-[220px]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#af6348]/10 text-[#af6348] mb-2.5">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-serif font-medium text-foreground mb-1">
                    Practical Information (Empty State)
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md">
                    No practical guide items added yet. Click &quot;Add Accordion Item&quot; in the left form panel to add visa requirements, currency guides, safety tips, and travel advice.
                  </p>
                </div>
              ) : (
                items.map((item: any, idx: number) => {
                  const isOpen = openIndex === idx

                  return (
                    <div
                      key={idx}
                      className="w-full border-b border-stone-900/15 transition-colors duration-200"
                    >
                      {/* Accordion Trigger */}
                      <button
                        type="button"
                        onClick={() => toggleItem(idx)}
                        className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 sm:py-6 text-left outline-none"
                      >
                        <DynamicStyledTextPreview
                          as="span"
                          data={item.title}
                          fallbackColor="#182d09"
                          className="text-[15px] md:text-base font-serif lg:text-[18px] xl:text-lg font-semibold leading-6 text-[#182d09] transition-colors duration-300 group-hover:text-[#af6348]"
                        />

                        {/* Chevron Indicator */}
                        <div className="relative size-6 shrink-0 flex items-center justify-center text-[#565e69] group-hover:text-[#af6348] transition-colors duration-300">
                          <ChevronDown
                            className={`size-4 transition-transform duration-300 ease-out ${
                              isOpen ? "rotate-180 text-[#af6348]" : "rotate-0"
                            }`}
                          />
                        </div>
                      </button>

                      {/* Accordion Content Panel */}
                      {isOpen && (
                        <div className="pb-6">
                          <DynamicStyledTextPreview
                            as="p"
                            type="richtext"
                            data={item.content}
                            fallbackColor="#565e69"
                            className="w-full md:text-sm text-xs font-normal leading-[18px] md:leading-[22.5px] text-[#565e69]"
                          />
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PracticalInfoPreview
