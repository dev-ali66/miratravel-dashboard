/* =====================================================
   PRACTICALINFORMATION — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

export type PracticalInformationPreviewProps = {
    draft: LocationData | null
}

export function PracticalInformationPreview({
    draft,
}: PracticalInformationPreviewProps) {
    const { data, name } = getLocationBasics(draft)


    const practical =
        data.practical_information ?? {}

    const practicalItems = Array.isArray(practical.accordion_items) ? practical.accordion_items : []

    const reduceMotion = Boolean(useReducedMotion && useReducedMotion())
    const [openPractical, setOpenPractical] = useState<number | null>(practicalItems.length > 0 ? 0 : null)

    return (
        <>

            <section className="w-full bg-[#EFE8DE] xl:py-[90px] xlg:py-[85px] lg:py-[80px] md:py-[70px] py-[60px] overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="w-full xl:px-[88.5px] xl:pb-[112px] flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-4 xl:mb-6">
                            <div className="w-8 h-px bg-terracotta" />
                            <span className="text-terracotta text-xs sm:text-sm font-normal uppercase leading-4 tracking-[3px] md:tracking-[4.2px]">
                                {practical.sub_heading || 'PRACTICAL INFORMATION'}
                            </span>
                        </div>

                        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-10 md:gap-12 lg:gap-[60px] xl:gap-[80px]">
                            <div className="w-full lg:w-[360px] xlg:w-[370px] xl:w-[380px] shrink-0 flex flex-col items-start">
                                <h2 className="text-dark-heading font-roboto-serif text-[26px] sm:text-[28px] md:text-[30px] lg:text-[32px] xlg:text-[34px] xl:text-[36px] leading-[36px] lg:leading-[42px] xl:leading-[49.5px] font-medium">
                                    {practical.title || 'Before you travel'}
                                </h2>

                                <div className="mt-6 md:mt-10 lg:mt-12 xlg:mt-[52px] xl:mt-[56px] relative w-[260px] md:w-[334px] xlg:w-[314px] lg:w-[300px] xl:w-[334px] aspect-square overflow-hidden group">
                                    {practical.side_image ? (
                                        <img src={practical.side_image} alt={practical.title || 'Practical information'} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }} />
                                    ) : (
                                        <img src={FALLBACK_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
                                    )}
                                </div>

                                <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-500">Everything you need to know before travelling to {name}.</p>
                            </div>

                            <motion.div className="w-full lg:flex-1 lg:max-w-[780px] flex flex-col" initial={reduceMotion ? undefined : 'hidden'} whileInView={reduceMotion ? undefined : 'show'} viewport={{ once: true, amount: 0.15 }}>
                                {practicalItems.map((item: any, index: number) => {
                                    const isOpen = openPractical === index
                                    const triggerId = `practical-trigger-${item.id ?? index}`
                                    const panelId = `practical-panel-${item.id ?? index}`

                                    return (
                                        <motion.div key={item.id ?? item.title ?? index} className="w-full border-b border-stone-900/15 transition-colors duration-200" initial={reduceMotion ? undefined : { opacity: 0, y: 8 }} animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}>
                                            <button id={triggerId} aria-controls={panelId} aria-expanded={isOpen} onClick={() => setOpenPractical(isOpen ? null : index)} className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 sm:py-6 text-left outline-none">
                                                <span className="text-[15px] md:text-base lg:text-[18px] xl:text-lg font-medium leading-6 text-neutral-950 transition-colors duration-200 group-hover:text-terracotta">{item.title}</span>

                                                <div className="relative size-6 shrink-0 flex items-center justify-center text-stone-500 group-hover:text-terracotta transition-colors duration-200">
                                                    <svg className={`size-4 transition-transform duration-300 ease-out ${isOpen ? 'rotate-180 text-terracotta' : 'rotate-0'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                        <polyline points="6 9 12 15 18 9" />
                                                    </svg>
                                                </div>
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div key="content" id={panelId} role="region" aria-labelledby={triggerId} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                                        <p className="w-full md:text-sm text-xs font-normal leading-[18px] md:leading-[22.5px] text-text-secondary pb-6">{item.content}</p>
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
