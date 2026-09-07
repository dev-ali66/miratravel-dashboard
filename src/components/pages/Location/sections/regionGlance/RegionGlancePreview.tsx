/* =====================================================
   REGION GLANCE — PREVIEW SECTION
   The media cards are intentional static demo content so
   admins can understand the visual layout. They are not
   sourced from or editable through location CMS data.
===================================================== */


import { motion } from "framer-motion"
import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"

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
    description:
      "Discover the landscapes, culture and places that shape this remarkable destination.",
    ...data.regionGlance,
  }
  const title = glance.title || "A glimpse of the region"
  const label = glance.label || "REGION AT A GLANCE"
  const description =
    glance.description ||
    "Discover the landscapes, culture and places that shape this remarkable destination."
  const style = glance.style ?? {}


  const background = (glance as any)?.backgroundMultimedia

  return (
    <section className="relative w-full overflow-hidden bg-[#faf9f6] py-[58px] md:py-[74px] lg:py-[84px] xl:py-[92px]">
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor={style.backgroundColor || "#faf9f6"}
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="relative z-10 w-full">
        <div className="container mx-auto">
          <div className="mx-auto flex w-full max-w-[90%] flex-col items-center gap-2 text-center md:max-w-[85%] md:gap-2.5 lg:max-w-[863px] xl:gap-3">
            <span
              className="justify-center text-center text-xs font-normal tracking-[2.34px] uppercase md:text-sm lg:text-[15px]"
              style={{
                color: style.labelTextColor || "#C97B4A",
                ...fieldCssStyle((glance as any).labelStyle),
              }}
            >
              {label}
            </span>
            <h2
              className="font-heading mb-2 justify-center text-center text-[30px] leading-[44px] font-semibold md:mb-[9px] md:text-[36px] md:leading-[48px] lg:text-[40px] lg:leading-[52px] xl:mb-[11px] xl:text-[48px] xl:leading-[56px]"
              style={{
                color: style.titleTextColor || "#1A2E2A",
                ...fieldCssStyle((glance as any).titleStyle),
              }}
            >
              {title}
            </h2>
            <p
              className="text-center text-[16px] font-normal md:text-[18px] lg:text-[20px]"
              style={{
                color: style.descriptionTextColor || "#737373",
                ...fieldCssStyle((glance as any).descriptionStyle),
              }}
            >
              {description}
            </p>
          </div>
        </div>

        <div className="mt-12 w-full overflow-x-auto pb-8 md:mt-16 lg:mt-[74px] xl:mt-[80px]">
          <div className="flex w-max items-center gap-6 px-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-12">
            {[...DEMO_CARDS, ...DEMO_CARDS].map((item, index) => (
              <DemoCard key={`${item.title}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DemoCard({
  item,
}: {
  item: (typeof DEMO_CARDS)[number]
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.35 }}
      className="group relative h-[340px] w-[300px] shrink-0 overflow-hidden rounded-xs md:h-[500px] md:w-[440px] lg:h-[520px] lg:w-[487px] xl:h-[551px] xl:w-[527px]"
    >
      <img
        src={FALLBACK_IMAGE}
        alt=""
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-r from-neutral-950/60 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-5 -translate-x-full bg-primary/50 transition-transform delay-300 duration-700 group-hover:translate-x-0" />
      <div className="absolute right-6 bottom-6 left-6 z-10 flex flex-col items-start gap-1.5 sm:right-8 sm:bottom-8 sm:left-8">
        <div className="flex flex-col items-start gap-1">
          <span
            className="text-[10px] font-semibold tracking-[2px] uppercase text-white/80"
          >
            {item.country}
          </span>
          <h3
            className="font-heading text-lg font-normal md:text-[22px] xl:text-[27px] text-white transition-transform duration-300 group-hover:translate-x-1"
          >
            {item.title}
          </h3>
        </div>
      </div>
    </motion.div>
  )
}

export default RegionGlancePreview
