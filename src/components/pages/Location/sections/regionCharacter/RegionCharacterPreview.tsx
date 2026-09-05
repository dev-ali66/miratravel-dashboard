/* =====================================================
   REGION CHARACTER — PREVIEW SECTION
===================================================== */

import { ArrowUpRight, Compass, Home, Mountain } from "lucide-react"
import { motion } from "framer-motion"
import type { LocationData } from "../../locationTypes"
import { getLocationBasics } from "../../shared/previewBasics"
import { UniversalMultimediaPreview } from "../../../CMS/shared/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"

type RegionCharacterItem = NonNullable<
  LocationData["data"]["regionCharacter"]
>["items"][number]

const DEFAULT_ITEMS: RegionCharacterItem[] = [
  {
    id: "alpine-wilderness",
    icon: "mountain",
    title: "Untouched Alpine Wilderness",
    description:
      "The Accursed Mountains offer trekking with a frontier quality that the Alps lost generations ago, without the crowds.",
    href: "/destinations/albania/north-albania/wilderness",
    linkText: "Read More",
  },
  {
    id: "highland-culture",
    icon: "home",
    title: "Living Highland Culture",
    description:
      "Ancient highland traditions remain informally observed in remote villages, genuinely alive and part of daily life.",
    href: "/destinations/albania/north-albania/culture",
    linkText: "Read More",
  },
  {
    id: "slow-journeys",
    icon: "compass",
    title: "The Great Slow Journeys",
    description:
      "The Komani Lake ferry and Valbona-to-Theth trail remain unhurried experiences that are impossible to replicate.",
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
  const items =
    Array.isArray(character.items) && character.items.length > 0
      ? character.items
      : DEFAULT_ITEMS
  const background = (character as any)?.backgroundMultimedia

  return (
    <section className="relative w-full overflow-hidden pb-12 md:pb-14 xl:pb-16">
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor={style.backgroundColor || "#FAF7F2"}
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="relative z-10 container mx-auto px-6 md:px-10">
        <div className="flex w-full flex-col items-start gap-10 sm:gap-12 md:gap-14 xl:gap-16">
          <div className="flex w-full flex-col items-start">
            <span
              className="text-sm leading-5 font-normal tracking-[3px] uppercase md:text-[15px] xl:text-base"
              style={{
                color: style.labelTextColor || "var(--accent)",
                ...fieldCssStyle((character as any).labelStyle),
              }}
            >
              {character.label || "Character"}
            </span>
            <h2
              className="font-heading w-full max-w-255 pt-4 text-[28px] leading-7 font-semibold md:text-[38px] md:leading-9.5 lg:text-[42px] lg:leading-10.5 xl:text-[48px] xl:leading-12"
              style={{
                color: style.titleTextColor || "var(--primary)",
                ...fieldCssStyle((character as any).titleStyle),
              }}
            >
              {character.title || "What makes this region singular"}
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="grid w-full grid-cols-3 divide-y border-t md:divide-x md:divide-y-0"
            style={{ borderColor: style.borderColor || "rgba(26,21,16,0.12)" }}
          >
            {items.map((item, index) => {
              const Icon = ICONS[item.icon as keyof typeof ICONS] || Mountain
              return (
                <motion.div
                  key={item.id || `${item.title}-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="group lgx:h-95 lgx:p-10 relative flex min-h-80 w-full flex-col items-start justify-between overflow-hidden p-6 md:min-h-87.5 md:p-8 xl:h-99.75 xl:p-12"
                >
                  <div
                    className="absolute inset-0 z-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"
                    style={{
                      backgroundColor: style.hoverBackgroundColor || "#D4D4D4",
                    }}
                  />
                  <div className="relative z-10 flex w-full flex-col items-start gap-2 md:gap-3 lg:gap-4">
                    <div className="relative mb-1 flex size-5 shrink-0 items-center justify-center md:mb-2.5 lg:mb-3">
                      <Icon
                        className="size-5"
                        style={{ color: style.iconColor || "var(--accent)" }}
                        aria-hidden="true"
                      />
                      {(item.multimedia ||
                        (item as any).iconMultimedia ||
                        item.iconImage) && (
                        <UniversalMultimediaPreview
                          multimedia={
                            item.multimedia ||
                            (item as any).iconMultimedia || {
                              url: item.iconImage,
                              type: "image",
                            }
                          }
                          fallbackImageSrc={item.iconImage}
                          fallbackAlt={item.title || "Icon image"}
                          mode="inline"
                          className="absolute inset-0 size-full object-contain"
                          containerClassName="absolute inset-0 size-full"
                        />
                      )}
                    </div>
                    <h3
                      className="font-heading text-base leading-7 font-bold transition-colors duration-300 md:text-lg xl:text-xl"
                      style={{
                        color: style.titleTextColor || "var(--primary)",
                        ...fieldCssStyle((item as any).titleStyle),
                      }}
                    >
                      {item.title || "Lorem ipsum dolor sit amet"}
                    </h3>
                    <p
                      className="text-left text-xs leading-4.5 font-normal md:text-[13px] md:leading-5 xl:text-sm xl:leading-[22.75px]"
                      style={{
                        color: style.descriptionTextColor || "#737373",
                        ...fieldCssStyle((item as any).descriptionStyle),
                      }}
                    >
                      {item.description ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
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
