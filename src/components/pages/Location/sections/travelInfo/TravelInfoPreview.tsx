/* =====================================================
   TRAVELINFO — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"

const DEFAULT_ITEMS = [
    { id: "getting-there", title: "Getting there", content: "Plan your route carefully and allow time for the journey." },
    { id: "what-to-pack", title: "What to pack", content: "Pack comfortable layers and essentials suited to the season." },
    { id: "local-customs", title: "Local customs", content: "A little local knowledge makes every journey more rewarding." },
]

type BeforeTravelData = NonNullable<LocationData["data"]["travelInfo"]["beforeTravel"]>

export type TravelInfoPreviewProps = {
    draft: LocationData | null
}

export function TravelInfoPreview({
    draft,
}: TravelInfoPreviewProps) {
    const { data } = getLocationBasics(draft)
    const beforeTravel = data.travelInfo?.beforeTravel as BeforeTravelData | undefined
    const content = beforeTravel || {
        label: "BEFORE YOU TRAVEL",
        title: "Everything you need to know before you go",
        image: "",
        imageAlt: "Travel landscape",
        items: DEFAULT_ITEMS,
    }
    const style = content.style ?? {}
    const items = content.items?.length ? content.items : DEFAULT_ITEMS
    const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

    return (
        <section
            className="w-full overflow-hidden py-15 md:py-17.5 lg:py-20 xl:py-22.5"
            style={{ backgroundColor: style.backgroundColor || "#E9E7DF" }}
        >
            <div className="container mx-auto px-6 md:px-10">
                <div className="flex w-full flex-col items-start xl:px-22.125 xl:pb-28">
                    <div className="mb-4 flex items-center gap-3 xl:mb-6">
                        <div className="h-px w-8" style={{ backgroundColor: style.labelTextColor || "#C97B4A" }} />
                        <span className="text-[11px] font-normal uppercase leading-4 tracking-[3px] md:text-xs xl:text-sm" style={{ color: style.labelTextColor || "#C97B4A" }}>
                            {content.label}
                        </span>
                    </div>

                    <div className="flex w-full flex-col items-start justify-between gap-10 md:gap-12 lg:flex-row lg:gap-15 xl:gap-20">
                        <div className="flex w-full shrink-0 flex-col items-start lg:w-90 xl:w-95">
                            <h2 className="font-heading text-[26px] font-semibold leading-9 sm:text-[28px] md:text-[30px] lg:text-[32px] xl:text-[36px] xl:leading-12.5" style={{ color: style.titleTextColor || "#1A1814" }}>
                                {content.title}
                            </h2>
                            <div className="relative mt-6 aspect-square w-65 overflow-hidden rounded-xs md:mt-10 md:w-83.5 lg:mt-12 lg:w-75 xl:mt-14 xl:w-83.5">
                                <img src={content.image || FALLBACK_IMAGE} alt={content.imageAlt || "Travel landscape"} className="size-full object-cover" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }} />
                            </div>
                        </div>

                        <div className="flex w-full flex-col lg:max-w-195">
                            {items.map((item) => {
                                const isOpen = openId === item.id
                                return (
                                    <div key={item.id} className="w-full border-b" style={{ borderColor: style.borderColor || "rgba(41,37,32,0.15)" }}>
                                        <button type="button" onClick={() => setOpenId(isOpen ? null : item.id)} aria-expanded={isOpen} className="group flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6">
                                            <span className="font-heading text-[15px] font-semibold leading-6 transition-colors group-hover:text-accent md:text-base lg:text-lg" style={{ color: style.titleTextColor || "#1A1814" }}>{item.title || "Lorem ipsum dolor sit amet"}</span>
                                            <ChevronDown className="size-5 shrink-0 transition-transform duration-300" style={{ color: isOpen ? style.labelTextColor || "#C97B4A" : style.iconColor || "#737373", transform: isOpen ? "rotate(180deg)" : undefined }} />
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                    <p className="pb-6 text-xs font-normal leading-4.5 md:text-sm md:leading-5.5" style={{ color: style.bodyTextColor || "#737373" }}>{item.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
