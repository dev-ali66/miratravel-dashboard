import { motion } from "framer-motion"
import { SectionSlideTop } from "../../../../animation/SectionSlideTop"
import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"

const defaultTags = [
  "Beaches",
  "Hiking",
  "Restaurant",
  "Sunset",
  "Historic village",
]

export type WhyVisitPreviewProps = {
  draft: LocationData | null
}

export function WhyVisitPreview({ draft }: WhyVisitPreviewProps) {
  const { data, name } = getLocationBasics(draft)

  const why = data.why ?? {}
  const tags = Array.isArray(why.tags) ? why.tags : defaultTags
  const paragraphs = Array.isArray(why.description_paragraphs)
    ? why.description_paragraphs
    : [
        "The Balkans present a rare harmony where untouched nature, ancient stone citadels, and rich cultural traditions meet. Explore winding cobblestone alleys, turquoise coastlines, and mountain sanctuaries curated with local knowledge and unhurried pacing.",
      ]

  const imageSrc = why.image || FALLBACK_IMAGE

  const background = (why as any)?.backgroundMultimedia

  return (
    <section className="relative w-full overflow-hidden">
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor="#FFFFFF"
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />
      <SectionSlideTop
        id="why-visit"
        className="relative z-10 container mx-auto"
        disableEffects
      >
        <div className="mx-auto flex w-full flex-col items-center justify-between gap-4 sm:gap-5 md:gap-6 lg:flex-row lg:items-center lg:gap-8 xl:gap-10">
          {/* Left Text Block */}
          <motion.div className="flex w-full flex-col items-start lg:w-1/2 xl:w-[761px] xl:gap-[30.695px] 2xl:flex-1">
            <div className="flex w-full flex-col items-start gap-3 sm:gap-4 lg:gap-5">
              <span
                className="font-inter text-gradient-2 text-sm leading-5 font-semibold tracking-[1.4px] uppercase md:text-[15px] lg:text-base"
                style={fieldCssStyle((why as any).subtitleStyle)}
              >
                {why.subtitle || `WHY VISIT ${name.toUpperCase()}`}
              </span>

              <h2
                className="font-roboto text-[28px] leading-[38px] font-medium text-primary sm:text-[34px] lg:text-[36px] xl:text-[40px]"
                style={fieldCssStyle((why as any).titleStyle)}
              >
                {why.title || name}
              </h2>
            </div>

            <div className="text-text-secondary font-inter mt-5 flex w-full flex-col items-start gap-4 text-[15px] leading-[28.8px] sm:gap-5 md:text-base lg:text-[18px]">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="self-stretch text-justify text-neutral-600"
                >
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Right Side (Pills + Image) */}
          <motion.div className="flex w-full flex-col items-start justify-end gap-3.5 lg:w-1/2 lg:items-end xl:w-[822.888px] xl:max-w-[822.888px] xl:p-[24px_15.429px] 2xl:w-[880px] 2xl:max-w-[880px]">
            {/* Tag Pills */}
            <div className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-3.5 lg:justify-end">
              {tags.map((tag: string) => (
                <div
                  key={tag}
                  className="border-text-secondary text-para inline-flex h-[21px] items-center justify-center rounded-full border px-2.5 py-0.5 lg:px-3"
                >
                  <span className="text-[12px] leading-4 font-medium">
                    {tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Large Image */}
            <div className="relative aspect-[792/533] w-full overflow-hidden rounded-[2px] shadow-lg xl:h-[532.84px] xl:w-[822.888px] 2xl:h-[560px] 2xl:w-[880px]">
              {why.imageMultimedia ? (
                <UniversalMultimediaPreview
                  multimedia={why.imageMultimedia}
                  fallbackImageSrc={imageSrc}
                  fallbackAlt={why.title || name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={imageSrc}
                  alt={why.title || name}
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                />
              )}
            </div>
          </motion.div>
        </div>
      </SectionSlideTop>
    </section>
  )
}
