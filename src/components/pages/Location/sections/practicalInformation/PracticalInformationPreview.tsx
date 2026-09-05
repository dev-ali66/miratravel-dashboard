/* =====================================================
   PRACTICALINFORMATION — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"
import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

export type PracticalInformationPreviewProps = {
  draft: LocationData | null
}

export function PracticalInformationPreview({
  draft,
}: PracticalInformationPreviewProps) {
  const { data, name } = getLocationBasics(draft)

  const practical = data.practical_information ?? {}

  const practicalItems = Array.isArray(practical.accordion_items)
    ? practical.accordion_items
    : []

  const reduceMotion = Boolean(useReducedMotion && useReducedMotion())
  const [openPractical, setOpenPractical] = useState<number | null>(
    practicalItems.length > 0 ? 0 : null
  )

  const background = (practical as any)?.backgroundMultimedia

  return (
    <>
      <section className="xlg:py-[85px] relative w-full overflow-hidden py-[60px] md:py-[70px] lg:py-[80px] xl:py-[90px]">
        <UniversalMultimediaPreview
          multimedia={background}
          fallbackColor="#EFE8DE"
          mode="background"
          className="h-full w-full object-cover"
          containerClassName="absolute inset-0 z-0 pointer-events-none"
        />
        <div className="relative z-10 container mx-auto px-6">
          <div className="flex w-full flex-col items-start xl:px-[88.5px] xl:pb-[112px]">
            <div className="mb-4 flex items-center gap-3 xl:mb-6">
              <div className="bg-terracotta h-px w-8" />
              <span
                className="text-terracotta text-xs leading-4 font-normal tracking-[3px] uppercase sm:text-sm md:tracking-[4.2px]"
                style={fieldCssStyle((practical as any).subHeadingStyle)}
              >
                {practical.sub_heading || "PRACTICAL INFORMATION"}
              </span>
            </div>

            <div className="flex w-full flex-col items-start justify-between gap-10 md:gap-12 lg:flex-row lg:gap-[60px] xl:gap-[80px]">
              <div className="xlg:w-[370px] flex w-full shrink-0 flex-col items-start lg:w-[360px] xl:w-[380px]">
                <h2
                  className="text-dark-heading font-roboto-serif xlg:text-[34px] text-[26px] leading-[36px] font-medium sm:text-[28px] md:text-[30px] lg:text-[32px] lg:leading-[42px] xl:text-[36px] xl:leading-[49.5px]"
                  style={fieldCssStyle((practical as any).titleStyle)}
                >
                  {practical.title || "Before you travel"}
                </h2>

                <div className="xlg:mt-[52px] xlg:w-[314px] group relative mt-6 aspect-square w-[260px] overflow-hidden md:mt-10 md:w-[334px] lg:mt-12 lg:w-[300px] xl:mt-[56px] xl:w-[334px]">
                  {practical.sideImageMultimedia ? (
                    <UniversalMultimediaPreview
                      multimedia={practical.sideImageMultimedia}
                      fallbackImageSrc={practical.side_image || FALLBACK_IMAGE}
                      fallbackAlt={practical.title || "Practical information"}
                      mode="background"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      containerClassName="absolute inset-0"
                    />
                  ) : practical.side_image ? (
                    <img
                      src={practical.side_image}
                      alt={practical.title || "Practical information"}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE
                      }}
                    />
                  ) : (
                    <img
                      src={FALLBACK_IMAGE}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>

                <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-500">
                  Everything you need to know before travelling to {name}.
                </p>
              </div>

              <motion.div
                className="flex w-full flex-col lg:max-w-[780px] lg:flex-1"
                initial={reduceMotion ? undefined : "hidden"}
                whileInView={reduceMotion ? undefined : "show"}
                viewport={{ once: true, amount: 0.15 }}
              >
                {practicalItems.map((item: any, index: number) => {
                  const isOpen = openPractical === index
                  const triggerId = `practical-trigger-${item.id ?? index}`
                  const panelId = `practical-panel-${item.id ?? index}`

                  return (
                    <motion.div
                      key={item.id ?? item.title ?? index}
                      className="w-full border-b border-stone-900/15 transition-colors duration-200"
                      initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                      animate={
                        isOpen ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }
                      }
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <button
                        type="button"
                        id={triggerId}
                        aria-controls={panelId}
                        aria-expanded={isOpen}
                        onClick={() => setOpenPractical(isOpen ? null : index)}
                        className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left outline-none sm:py-6"
                      >
                        <span
                          className="group-hover:text-terracotta text-[15px] leading-6 font-medium text-neutral-950 transition-colors duration-200 md:text-base lg:text-[18px] xl:text-lg"
                          style={fieldCssStyle(item.titleStyle)}
                        >
                          {item.title}
                        </span>

                        <div className="group-hover:text-terracotta relative flex size-6 shrink-0 items-center justify-center text-stone-500 transition-colors duration-200">
                          <svg
                            className={`size-4 transition-transform duration-300 ease-out ${isOpen ? "text-terracotta rotate-180" : "rotate-0"}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            id={panelId}
                            role="region"
                            aria-labelledby={triggerId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p
                              className="text-text-secondary w-full pb-6 text-xs leading-[18px] font-normal md:text-sm md:leading-[22.5px]"
                              style={fieldCssStyle(item.contentStyle)}
                            >
                              {item.content}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
