/* =====================================================
   JOURNEYS — ADD-ONS TAB PREVIEW
   100% Pixel-Perfect Match with:
   frontend/components/journey-overview/addon-content.tsx
   Uses UniversalMultimediaPreview Single Source of Truth
===================================================== */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { addonsData } from "./journeyStaticData"
import { getJourneyAddons, getDayTitle, getDayDescription, getDayEyebrow, getDayMedia, getCurrencySymbol, getFieldStyleProps, type Journey } from "../journeyTypes"

const SECTION_PX = "px-4 lg:px-0"
const SECTION_GAP_BOTTOM = "pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"

export function AddonsPreview({ draft }: { draft?: Journey }) {
  const addonsSection = (draft?.data?.addonsSection as any) || {}
  const addonsBg = addonsSection?.backgroundMultimedia

  const title = addonsSection?.title || addonsData.title

  const draftAddons = draft ? getJourneyAddons(draft) : []
  const items =
    draftAddons.length > 0
      ? draftAddons.map((item, idx) => {
          const titleObj = getDayTitle(item, idx + 1)
          const descObj = getDayDescription(item)
          const eyebrowObj = getDayEyebrow(item)
          const mediaObj = getDayMedia(item)
          return {
            id: item.id || idx + 1,
            itemNumber: idx + 1,
            title: titleObj.text,
            titleStyle: titleObj.style,
            price: item.price 
              ? `${getCurrencySymbol(item.currency)}${item.price} / ${(item as any).personCount ?? Number((item as any).priceSuffix) > 1 ? `${(item as any).personCount ?? (item as any).priceSuffix} persons` : "person"}` 
              : "€120 / person",
            dayLabel: eyebrowObj.text || (item as any).dayLabel || "OPTIONAL EXPERIENCE",
            dayLabelStyle: eyebrowObj.style,
            detailedHeading: (item as any).detailedHeading || titleObj.text,
            description: descObj.text,
            descriptionStyle: descObj.style,
            thumbnail: item.thumbnail || (item as any).image || "/images/albania-journey4.jpg",
            image: (item as any).image || item.thumbnail || "/images/albania-journey4.jpg",
            multimedia: mediaObj,
          }
        })
      : addonsData.items

  const [expandedId, setExpandedId] = useState<string | number | null>(null)
  const [addedItems, setAddedItems] = useState<Record<string | number, boolean>>({})

  const toggleExpand = (id: string | number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const toggleAddItem = (id: string | number) => {
    setAddedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className={`relative w-full flex flex-col xl:pt-[51px] pt-6 md:pt-11 lgx:pt-12 ${SECTION_GAP_BOTTOM}`}>
      {/* Background Universal Multimedia */}
      {addonsBg && (
        <UniversalMultimediaPreview
          multimedia={addonsBg}
          mode="background"
          className="h-full w-full object-cover"
          containerClassName="absolute inset-0 z-0 pointer-events-none"
        />
      )}

      <section className="relative z-10 w-full">
        <div className={`w-full container mx-auto ${SECTION_PX}`}>
          <div className="max-w-[1105px] flex flex-col gap-6">
            {/* Section Header */}
            <div className="flex flex-col">
              <h2 className="text-title-light font-heading text-xl md:text-2xl lgx:text-3xl xl:text-4xl font-semibold leading-7 md:leading-8 xl:leading-[36px]">
                {title}
              </h2>
            </div>

            {/* Addon Accordion List */}
            <div className="flex flex-col gap-4 w-full">
              {items.map((item: any, index: number) => {
                const itemId = item.id ?? item.itemNumber ?? index + 1
                const isExpanded = expandedId === itemId
                const isAdded = !!addedItems[itemId]
                const itemNum = item.itemNumber ?? index + 1
                const currentImage = item.image || item.thumbnail || "/images/albania-journey4.jpg"

                return (
                  <div
                    key={itemId}
                    className={`w-full xl:rounded-[14px] md:rounded-[12px] rounded-[8px] border transition-all duration-300 overflow-hidden bg-neutral-100 ${
                      isExpanded
                        ? "border-black/15 xl:py-6 md:py-5 py-4 shadow-sm"
                        : "border-black/10 hover:border-black/20 xl:h-[130px] md:h-[120px] h-[110px]"
                    }`}
                  >
                    {/* Clickable Header Row */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(itemId)}
                      className={`w-full xl:p-4 md:p-3.5 p-3 flex items-center justify-between text-left cursor-pointer transition-colors ${
                        !isExpanded ? "h-full" : ""
                      }`}
                    >
                      <div className="flex items-center xl:gap-4 md:gap-3.5 gap-3 min-w-0 flex-1">
                        {/* Number Badge */}
                        <div className="xl:size-8 md:size-7 size-6 shrink-0 bg-dark text-neutral-100 rounded-full flex items-center justify-center xl:text-sm text-[12px] md:text-[13px] font-medium leading-5">
                          {itemNum}
                        </div>

                        {/* Thumbnail */}
                        <div className="relative xl:w-24 xl:h-24 md:w-20 md:h-20 w-16 h-16 xl:rounded-[10px] md:rounded-[8px] rounded-[6px] shrink-0 overflow-hidden bg-neutral-200">
                          <UniversalMultimediaPreview
                            multimedia={item.multimedia}
                            fallbackImageSrc={item.thumbnail}
                            fallbackAlt={item.title}
                            mode="background"
                            className="h-full w-full object-cover object-center"
                            containerClassName="absolute inset-0"
                          />
                        </div>

                        {/* Title and Price */}
                        <div className="flex flex-col items-start justify-center gap-2 md:gap-4 min-w-0">
                          <h3 
                            className="text-secondary text-[20px] md:text-[22px] xl:text-[24px] font-bold leading-5 md:leading-6 font-heading"
                            style={getFieldStyleProps(item.titleStyle)}
                          >
                            {item.title}
                          </h3>
                          {item.price && (
                            <span className="text-accent text-[20px] md:text-[22px] xl:text-[24px] font-semibold leading-5 md:leading-6">
                              {item.price}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand/Collapse Chevron */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="xl:w-6 xl:h-6 md:w-5 md:h-5 w-4 h-4 aspect-square shrink-0 text-dark"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-full h-full">
                          <path
                            d="M12.0002 16.0002C11.8686 16.0009 11.7381 15.9757 11.6163 15.926C11.4944 15.8762 11.3836 15.8029 11.2902 15.7102L5.29019 9.71019C5.10188 9.52188 4.99609 9.26649 4.99609 9.00019C4.99609 8.73388 5.10188 8.47849 5.29019 8.29019C5.47849 8.10188 5.73388 7.99609 6.00019 7.99609C6.26649 7.99609 6.52188 8.10188 6.71019 8.29019L12.0002 13.5902L17.2902 8.30019C17.4815 8.13636 17.7276 8.05075 17.9792 8.06047C18.2309 8.0702 18.4697 8.17453 18.6477 8.35262C18.8258 8.53072 18.9302 8.76946 18.9399 9.02113C18.9496 9.27281 18.864 9.51888 18.7002 9.71019L12.7002 15.7102C12.5139 15.8949 12.2625 15.9991 12.0002 16.0002Z"
                            fill="currentColor"
                          />
                        </svg>
                      </motion.div>
                    </button>

                    {/* Expanded Content Panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 flex flex-col xl:gap-6 gap-3.5 md:gap-4 xlg:gap-5 xl:px-4 md:px-3.5 px-2.5">
                            <div className="flex flex-col lg:flex-row items-center">
                              {/* Left Narrative Text */}
                              <div className="flex-1 flex flex-col justify-center xl:p-[35px] lgx:p-8 md:p-7 p-5">
                                <div className="flex flex-col">
                                  {item.dayLabel && (
                                    <span 
                                      className="text-accent-hover text-[11.8px] mb-[9px] leading-[19.5px] font-bold uppercase tracking-[0.85px]"
                                      style={getFieldStyleProps(item.dayLabelStyle)}
                                    >
                                      {item.dayLabel}
                                    </span>
                                  )}
                                  <h4 
                                    className="text-black font-heading xl:text-base md:text-[15px] text-sm font-semibold uppercase xl:tracking-[2px] tracking-[1.5px] leading-6 md:leading-[27px] mb-[12.75px]"
                                    style={getFieldStyleProps(item.titleStyle)}
                                  >
                                    {item.detailedHeading}
                                  </h4>
                                  <p 
                                    className="text-subtitle xl:text-sm md:text-[13px] text-xs font-normal md:tracking-[2px] tracking-[1px] xl:leading-[27px] md:leading-[25px] leading-[23px]"
                                    style={getFieldStyleProps(item.descriptionStyle)}
                                  >
                                    {item.description}
                                  </p>
                                </div>

                                {/* Add this item CTA Button */}
                                <div className="pt-6">
                                  <button
                                    type="button"
                                    onClick={() => toggleAddItem(itemId)}
                                    className={`group relative flex h-[46px] md:h-[50px] lgx:h-[54px] xl:h-[56px] w-[340px] max-w-full items-center justify-center overflow-hidden rounded-[2px] px-4 py-2 md:px-5 md:py-2.5 xl:px-[17px] xl:py-[10px] text-sm md:text-[15px] xl:text-base font-semibold leading-[20px] text-neutral-100 transition-colors duration-200 cursor-pointer ${
                                      isAdded ? "bg-lime-900" : "bg-[#235347]"
                                    }`}
                                  >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                      {isAdded ? "Added to trip ✓" : "Add this item"}
                                    </span>
                                  </button>
                                </div>
                              </div>

                              {/* Right Visual Image */}
                              <div className="w-[calc(100%-40px)] md:w-[calc(100%-48px)] lg:w-[380px] xl:w-[410px] h-[220px] md:h-[260px] xl:h-[280px] relative lg:rounded-r-[16px] rounded-[10px] lg:rounded-l-none overflow-hidden shrink-0 group select-none cursor-pointer mx-5 md:mx-6 lg:mx-0">
                                <UniversalMultimediaPreview
                                  multimedia={item.multimedia}
                                  fallbackImageSrc={currentImage}
                                  fallbackAlt={item.detailedHeading || item.title}
                                  mode="background"
                                  className="h-full w-full object-cover object-center"
                                  containerClassName="absolute inset-0"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
