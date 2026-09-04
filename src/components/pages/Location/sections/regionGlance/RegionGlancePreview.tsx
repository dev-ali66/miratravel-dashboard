/* =====================================================
   REGION GLANCE — PREVIEW SECTION
   The media cards are intentional static demo content so
   admins can understand the visual layout. They are not
   sourced from or editable through location CMS data.
===================================================== */

import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"

const DEMO_CARDS = [
    { title: "The Accursed Mountains", country: "Northern Albania" },
    { title: "Lake Shkoder", country: "Western Albania" },
    { title: "The Albanian Riviera", country: "Southern Albania" },
]

export type RegionGlancePreviewProps = {
    draft: LocationData | null
}

export function RegionGlancePreview({ draft }: RegionGlancePreviewProps) {
    const { data } = getLocationBasics(draft)
    const glance = {
        label: "REGION AT A GLANCE",
        title: "A glimpse of the region",
        description: "Discover the landscapes, culture and places that shape this remarkable destination.",
        ...data.regionGlance,
    }
    const title = glance.title || "A glimpse of the region"
    const label = glance.label || "REGION AT A GLANCE"
    const description =
        glance.description ||
        "Discover the landscapes, culture and places that shape this remarkable destination."
    const style = glance.style ?? {}
    const [featured, ...secondaryCards] = DEMO_CARDS

    return (
        <section
            className="w-full overflow-hidden py-12 md:py-16 xl:py-20"
            style={{ backgroundColor: style.backgroundColor || "#F7F6F2" }}
        >
            <div className="container mx-auto px-6 md:px-10">
                <div className="flex w-full flex-col items-center gap-10 md:gap-13 lg:gap-15 xl:gap-16.5">
                    <div className="grid w-full grid-cols-1 items-end gap-6 lg:grid-cols-2 lg:gap-12">
                        <div>
                            <span
                                className="text-sm font-normal uppercase tracking-[3px]"
                                style={{ color: style.labelTextColor || "#C97B4A" }}
                            >
                                {label}
                            </span>
                            <h2
                                className="mt-4 font-heading text-[30px] font-semibold leading-tight md:text-[42px] xl:text-[52px]"
                                style={{ color: style.titleTextColor || "#1A2E2A" }}
                            >
                                {title}
                            </h2>
                        </div>
                        <p
                            className="max-w-155 text-justify text-sm leading-6 tracking-wide md:text-base md:leading-7 lg:justify-self-end"
                            style={{ color: style.descriptionTextColor || "#737373" }}
                        >
                            {description}
                        </p>
                    </div>

                    <div className="grid w-full grid-cols-1 items-stretch gap-6 md:gap-7 lg:grid-cols-12 xl:gap-10">
                                        <DemoCard item={featured} featured />
                        <div className="flex flex-col gap-6 sm:gap-7 lg:col-span-5 lg:gap-8 xl:gap-11">
                            {secondaryCards.map((item) => (
                                                <DemoCard key={item.title} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function DemoCard({
    item,
    featured = false,
}: {
    item: (typeof DEMO_CARDS)[number]
    featured?: boolean
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.35 }}
            className={
                featured
                    ? "group relative h-95 w-full overflow-hidden rounded-xs lg:col-span-7 md:h-135 lg:h-155 xl:h-178.5"
                    : "group relative h-55 w-full overflow-hidden rounded-xs sm:h-65 md:h-72.5 lg:h-73.5 xl:h-84.25"
            }
        >
            <img
                src={FALLBACK_IMAGE}
                alt=""
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-r from-neutral-950/60 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-5 -translate-x-full bg-primary/50 transition-transform duration-700 delay-300 group-hover:translate-x-0" />
            <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col items-start gap-1.5 sm:bottom-8 sm:left-8 sm:right-8">
                <span
                    className="text-xs font-normal uppercase tracking-[2px]"
                    style={{ color: "#F5F5F5" }}
                >
                    {item.country}
                </span>
                <div className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1">
                    <h3
                        className={featured ? "font-roboto-serif text-xl font-normal sm:text-2xl md:text-[26px] xl:text-[28px]" : "font-heading text-lg font-normal md:text-[22px] xl:text-[27px]"}
                        style={{ color: "#F5F5F5" }}
                    >
                        {item.title}
                    </h3>
                    <ArrowUpRight className="size-5 shrink-0 text-[#F5F5F5] sm:size-6" aria-hidden="true" />
                </div>
            </div>
        </motion.div>
    )
}

export default RegionGlancePreview
