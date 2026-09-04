/* =====================================================
   REGION CHARACTER — PREVIEW SECTION
===================================================== */

import { ArrowUpRight, Compass, Home, Mountain } from "lucide-react"
import { motion } from "framer-motion"
import type { LocationData } from "../../locationTypes"
import { getLocationBasics } from "../../shared/previewBasics"

type RegionCharacterItem = NonNullable<LocationData["data"]["regionCharacter"]>["items"][number]

const DEFAULT_ITEMS: RegionCharacterItem[] = [
    {
        id: "alpine-wilderness",
        icon: "mountain",
        title: "Untouched Alpine Wilderness",
        description: "The Accursed Mountains offer trekking with a frontier quality that the Alps lost generations ago, without the crowds.",
        href: "/destinations/albania/north-albania/wilderness",
        linkText: "Read More",
    },
    {
        id: "highland-culture",
        icon: "home",
        title: "Living Highland Culture",
        description: "Ancient highland traditions remain informally observed in remote villages, genuinely alive and part of daily life.",
        href: "/destinations/albania/north-albania/culture",
        linkText: "Read More",
    },
    {
        id: "slow-journeys",
        icon: "compass",
        title: "The Great Slow Journeys",
        description: "The Komani Lake ferry and Valbona-to-Theth trail remain unhurried experiences that are impossible to replicate.",
        href: "/destinations/albania/north-albania/slow-journeys",
        linkText: "Read More",
    },
]

type RegionCharacterData = NonNullable<LocationData["data"]["regionCharacter"]>

const ICONS = { mountain: Mountain, home: Home, compass: Compass }

export type RegionCharacterPreviewProps = {
    draft: LocationData | null
}

export function RegionCharacterPreview({ draft }: RegionCharacterPreviewProps) {
    const { data } = getLocationBasics(draft)
    const character =
        (data.regionCharacter as RegionCharacterData | undefined) ||
        ({} as RegionCharacterData)
    const style = character.style ?? {}
    const items = Array.isArray(character.items) && character.items.length > 0
        ? character.items
        : DEFAULT_ITEMS

    return (
        <section
            className="w-full overflow-hidden pb-12 md:pb-14 xl:pb-16"
            style={{ backgroundColor: style.backgroundColor || undefined }}
        >
            <div className="container mx-auto px-6 md:px-10">
                <div className="flex w-full flex-col items-start gap-10 sm:gap-12 md:gap-14 xl:gap-16">
                    <div className="flex w-full flex-col items-start">
                        <span
                            className="text-sm font-normal uppercase leading-5 tracking-[3px] md:text-[15px] xl:text-base"
                            style={{ color: style.labelTextColor || "var(--accent)" }}
                        >
                            {character.label || "Character"}
                        </span>
                        <h2
                            className="w-full max-w-255 pt-4 font-heading text-[28px] font-semibold leading-7 md:text-[38px] md:leading-9.5 lg:text-[42px] lg:leading-10.5 xl:text-[48px] xl:leading-12"
                            style={{ color: style.titleTextColor || "var(--primary)" }}
                        >
                            {character.title || "What makes this region singular"}
                        </h2>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
                        className="grid w-full grid-cols-3 divide-y border-t md:divide-x md:divide-y-0 "
                        style={{ borderColor: style.borderColor || "rgba(26,21,16,0.12)" }}
                    >
                                        {items.map((item, index) => {
                            const Icon = ICONS[item.icon as keyof typeof ICONS] || Mountain
                            return (
                                <motion.div
                                    key={item.id || `${item.title}-${index}`}
                                    variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                                    className="group relative flex min-h-80 w-full flex-col items-start justify-between overflow-hidden p-6 md:min-h-87.5 md:p-8 lgx:h-95 lgx:p-10 xl:h-99.75 xl:p-12"
                                >
                                    <div
                                        className="absolute inset-0 z-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"
                                        style={{ backgroundColor: style.hoverBackgroundColor || "#D4D4D4" }}
                                    />
                                    <div className="relative z-10 flex w-full flex-col items-start gap-2 md:gap-3 lg:gap-4">
                                        <div className="relative mb-1 flex size-5 shrink-0 items-center justify-center md:mb-2.5 lg:mb-3">
                                            <Icon className="size-5" style={{ color: style.iconColor || "var(--accent)" }} aria-hidden="true" />
                                            {item.iconImage && (
                                                <img
                                                    src={item.iconImage}
                                                    alt=""
                                                    className="absolute inset-0 size-full object-contain"
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none"
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <h3
                                            className="font-heading text-base font-bold leading-7 transition-colors duration-300 md:text-lg xl:text-xl"
                                            style={{ color: style.titleTextColor || "var(--primary)" }}
                                        >
                                            {item.title || "Lorem ipsum dolor sit amet"}
                                        </h3>
                                        <p
                                            className="text-left text-xs font-normal leading-4.5 md:text-[13px] md:leading-5 xl:text-sm xl:leading-[22.75px]"
                                            style={{ color: style.descriptionTextColor || "#737373" }}
                                        >
                                            {item.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                                        </p>
                                    </div>
                                    <a
                                        href={item.href || "#"}
                                        className="relative z-10 mt-auto inline-flex translate-y-2 items-center gap-2.5 pt-2 text-sm font-medium opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:text-[15px] xl:text-base"
                                        style={{ color: style.linkTextColor || "var(--accent)" }}
                                    >
                                        {item.linkText || "Read More"}
                                        <ArrowUpRight className="size-4" aria-hidden="true" />
                                    </a>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default RegionCharacterPreview
