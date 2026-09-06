/* =====================================================
   JOURNEYS — SIMILAR JOURNEYS PREVIEW
   100% Pixel-Perfect Match with:
   frontend/components/journey-overview/similar-journeys.tsx &
   frontend/components/shared/journey-card.tsx
   Uses UniversalMultimediaPreview Single Source of Truth
===================================================== */

import { useState } from "react"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { similarJourneysData } from "./journeyStaticData"

const SECTION_PX = "px-4 lg:px-0"
const SECTION_GAP_TOP = "pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px]"
const SECTION_GAP_BOTTOM = "pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"

export function SimilarJourneysPreview() {
  const { title, subtitle, journeys } = similarJourneysData
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({})

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <section className={`w-full bg-[#F1EEE5] ${SECTION_GAP_TOP} ${SECTION_GAP_BOTTOM} overflow-hidden`}>
      <div className={`w-full container mx-auto ${SECTION_PX}`}>
        <div className="flex flex-col gap-8 md:gap-12 lgx:gap-14 xl:gap-[62px]">
          {/* Section Title */}
          <div className="flex flex-col items-start md:gap-[9px] gap-[7px] max-w-[862px]">
            <h2 className="self-stretch shrink-0 h-auto justify-start font-semibold text-primary font-heading text-[28px] leading-[28px] md:text-[38px] md:leading-[38px] lg:text-[42px] lg:leading-[42px] lgx:text-[42px] lgx:leading-[42px] mid:text-[44px] mid:leading-[44px] xlg:text-[46px] xlg:leading-[46px] xl:text-[48px] xl:leading-[48px]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-subtitle xl:text-base text-sm md:text-[15px] font-normal leading-7 md:leading-8 xl:leading-[35.944px] max-w-[548px] w-full">
                {subtitle}
              </p>
            )}
          </div>

          {/* Journeys Grid matching JourneyCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lgx:grid-cols-3 gap-6 sm:gap-8 lg:gap-11 w-full items-stretch">
            {journeys.map((journey: any) => {
              const isLiked = !!wishlist[journey.id]

              return (
                <div
                  key={journey.id}
                  className="group relative flex w-full flex-col overflow-hidden rounded-[8px] border border-border-muted/40 bg-neutral-100 transition-all duration-500 ease-out"
                >
                  <div className="flex h-full flex-col gap-y-5 md:gap-y-6 lg:gap-y-[27px]">
                    {/* Card Image Area */}
                    <div className="relative h-[280px] md:h-[380px] lgx:h-[413.344px] rounded-[2px] self-stretch shrink-0 w-full overflow-hidden">
                      <UniversalMultimediaPreview
                        multimedia={{
                          type: "image",
                          url: journey.image,
                          alt: journey.title,
                        }}
                        fallbackImageSrc={journey.image}
                        fallbackAlt={journey.title}
                        mode="background"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        containerClassName="absolute inset-0"
                      />

                      {/* Left-to-Right Primary Color Slide-In Layer */}
                      <div
                        className="absolute inset-0 -translate-x-full bg-primary-hover/50 transition-transform duration-800 delay-300 ease-out group-hover:translate-x-0 pointer-events-none z-10"
                        aria-hidden="true"
                      />

                      {/* Top-Left Category Badge */}
                      {journey.label && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "9999px",
                            background: journey.labelBg || "rgba(154, 52, 18, 0.30)",
                            color: journey.labelTextColor || "#FFFFFF",
                          }}
                          className="absolute left-4 top-4 z-20 xl:text-[12px] mid:text-[11.5px] lgx:text-[11px] md:text-[10.5px] text-[10px] font-bold uppercase tracking-[1.5px] xl:py-1.5 xl:px-[14px] mid:py-[5.75px] mid:px-[13.5px] md:py-[5.50px] md:px-[13px] xl:leading-[15px] mid:leading-[14.5px] lgx:leading-[14px] md:leading-[13.5px] leading-[13px]"
                        >
                          {journey.label}
                        </div>
                      )}

                      {/* Top-Right Wishlist Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleWishlist(journey.id)
                        }}
                        className="group/heart xl:size-10 mid:size-[38px] lgx:size-9 lg:size-[34px] md:size-8 size-[30px] bg-neutral-100 rounded-full border border-transparent hover:border-accent shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] inline-flex justify-center items-center absolute right-4 top-4 z-20 cursor-pointer transition-colors duration-200"
                        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <div className="mid:size-4 lgx:size-3.5 md:size-3 size-2.5 inline-flex flex-col justify-center items-center shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="14"
                            viewBox="0 0 15 14"
                            fill="none"
                            className={`transition-colors duration-200 ${
                              isLiked ? "text-red-500 fill-red-500" : "text-muted group-hover/heart:text-accent"
                            }`}
                          >
                            <path
                              d="M7.5 13.7625L6.4125 12.7875C5.15 11.65 4.10625 10.6687 3.28125 9.84375C2.45625 9.01875 1.8 8.27812 1.3125 7.62187C0.825 6.96562 0.484375 6.3625 0.290625 5.8125C0.096875 5.2625 0 4.7 0 4.125C0 2.95 0.39375 1.96875 1.18125 1.18125C1.96875 0.39375 2.95 0 4.125 0C4.775 0 5.39375 0.1375 5.98125 0.4125C6.56875 0.6875 7.075 1.075 7.5 1.575C7.925 1.075 8.43125 0.6875 9.01875 0.4125C9.60625 0.1375 10.225 0 10.875 0C12.05 0 13.0312 0.39375 13.8188 1.18125C14.6063 1.96875 15 2.95 15 4.125C15 4.7 14.9031 5.2625 14.7094 5.8125C14.5156 6.3625 14.175 6.96562 13.6875 7.62187C13.2 8.27812 12.5437 9.01875 11.7188 9.84375C10.8938 10.6687 9.85 11.65 8.5875 12.7875L7.5 13.7625ZM7.5 11.7375C8.7 10.6625 9.6875 9.74063 10.4625 8.97188C11.2375 8.20312 11.85 7.53437 12.3 6.96562C12.75 6.39687 13.0625 5.89062 13.2375 5.44688C13.4125 5.00313 13.5 4.5625 13.5 4.125C13.5 3.375 13.25 2.75 12.75 2.25C12.25 1.75 11.625 1.5 10.875 1.5C10.2875 1.5 9.74375 1.66563 9.24375 1.99688C8.74375 2.32812 8.4 2.75 8.2125 3.2625H6.7875C6.6 2.75 6.25625 2.32812 5.75625 1.99688C5.25625 1.66563 4.7125 1.5 4.125 1.5C3.375 1.5 2.75 1.75 2.25 2.25C1.75 2.75 1.5 3.375 1.5 4.125C1.5 4.5625 1.5875 5.00313 1.7625 5.44688C1.9375 5.89062 2.25 6.39687 2.7 6.96562C3.15 7.53437 3.7625 8.20312 4.5375 8.97188C5.3125 9.74063 6.3 10.6625 7.5 11.7375Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                      </button>

                      {/* Bottom-Left Days Duration Badge */}
                      {journey.days && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "9999px",
                          }}
                          className="bg-black/40 absolute left-4 bottom-4 z-20 xl:text-[12px] mid:text-[11.5px] lgx:text-[11px] md:text-[10.5px] text-[10px] font-bold xl:py-1.5 xl:px-[14px] mid:py-[5.75px] mid:px-[13.5px] md:py-[5.50px] md:px-[13px] xl:leading-[15px] mid:leading-[14.5px] lgx:leading-[14px] md:leading-[13.5px] leading-[13px] tracking-[0.5px] text-neutral-100 uppercase"
                        >
                          <span>{journey.days}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col px-4 sm:px-5 xl:px-6 pb-5 xl:pb-6">
                      <div className="flex flex-col gap-2.5">
                        <h3 className="font-heading md:text-[20px] text-[18px] lgx:text-[21px] mid:text-[22px] xl:text-[24px] font-normal tracking-[1.5px] lgx:tracking-[1.8px] mid:tracking-[1.9px] xl:tracking-[2px] text-secondary leading-[22px] md:leading-6 lgx:leading-[26px] xl:leading-[28px] group-hover:text-accent transition-colors">
                          {journey.title}
                        </h3>
                        <p className="text-xs md:text-[13px] xl:text-sm font-normal tracking-[1.5px] leading-4 md:leading-5 xl:leading-6 text-subtitle">
                          {journey.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-auto xl:pt-4 lgx:pt-[15px] md:pt-[14px] pt-[13px]">
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0">
                          {journey.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="rounded-[38px] px-1.5 sm:px-2 xl:px-2.5 py-0.5 xl:py-1 text-[8.5px] xl:text-[10px] font-normal leading-4 tracking-[1.5px] whitespace-nowrap text-subtitle border border-border-light shrink-0 uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0 whitespace-nowrap">
                          <span className="text-[11px] md:text-[11.5px] xl:text-[12px] font-normal leading-6 text-accent">
                            From{" "}
                            <span className="text-[13px] md:text-[13.5px] xl:text-[14px] font-semibold text-accent">
                              {journey.priceFrom}
                            </span>
                          </span>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                            <path
                              d="M4 12L12 4M12 4H5M12 4V11"
                              stroke="var(--color-accent)"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
