import { motion } from "framer-motion"
import { SectionSlideTop } from "../../../../animation/SectionSlideTop"
import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"

const defaultTags = ["Beaches", "Hiking", "Restaurant", "Sunset", "Historic village"]

export type WhyVisitPreviewProps = {
    draft: LocationData | null
}

export function WhyVisitPreview({
    draft,
}: WhyVisitPreviewProps) {
    const { data, name } = getLocationBasics(draft)

    const why = data.why ?? {}
    const tags = Array.isArray(why.tags) ? why.tags : defaultTags
    const paragraphs = Array.isArray(why.description_paragraphs)
        ? why.description_paragraphs
        : [
              "The Balkans present a rare harmony where untouched nature, ancient stone citadels, and rich cultural traditions meet. Explore winding cobblestone alleys, turquoise coastlines, and mountain sanctuaries curated with local knowledge and unhurried pacing.",
          ]

    const imageSrc = why.image || FALLBACK_IMAGE

    return (
        <section className="w-full">
            <SectionSlideTop id="why-visit" className={`container mx-auto`} disableEffects>
                <div className="mx-auto flex w-full flex-col items-center justify-between xl:gap-10 lg:gap-8 md:gap-6 sm:gap-5 gap-4 lg:flex-row lg:items-center">
                    {/* Left Text Block */}
                    <motion.div className="flex w-full flex-col items-start lg:w-1/2 xl:w-[761px] 2xl:flex-1 xl:gap-[30.695px]">
                        <div className="flex w-full flex-col items-start gap-3 sm:gap-4 lg:gap-5">
                            <span className="font-inter text-sm md:text-[15px] lg:text-base font-semibold uppercase leading-5 tracking-[1.4px] text-gradient-2">
                                {why.subtitle || `WHY VISIT ${name.toUpperCase()}`}
                            </span>

                            <h2 className="font-roboto text-[28px] sm:text-[34px] lg:text-[36px] xl:text-[40px] font-medium leading-[38px] text-primary">
                                {why.title || name}
                            </h2>
                        </div>

                        <div className="flex w-full flex-col items-start gap-4 sm:gap-5 text-text-secondary mt-5 font-inter text-[15px] md:text-base lg:text-[18px] leading-[28.8px]">
                            {paragraphs.map((p, i) => (
                                <p key={i} className="self-stretch text-justify text-neutral-600">
                                    {p}
                                </p>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side (Pills + Image) */}
                    <motion.div className="flex w-full flex-col items-start lg:items-end justify-end gap-3.5 lg:w-1/2 xl:w-[822.888px] xl:max-w-[822.888px] 2xl:w-[880px] 2xl:max-w-[880px] xl:p-[24px_15.429px]">
                        {/* Tag Pills */}
                        <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2.5 sm:gap-3.5">
                            {tags.map((tag: string) => (
                                <div key={tag} className="inline-flex h-[21px] items-center justify-center rounded-full border border-text-secondary lg:px-3 px-2.5 py-0.5 text-para">
                                    <span className="text-[12px] font-medium leading-4">{tag}</span>
                                </div>
                            ))}
                        </div>

                        {/* Large Image */}
                        <div className="relative w-full overflow-hidden rounded-[2px] shadow-lg xl:h-[532.84px] xl:w-[822.888px] 2xl:w-[880px] 2xl:h-[560px] aspect-[792/533]">
                            <img src={imageSrc} alt={why.title || name} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)} />
                        </div>
                    </motion.div>
                </div>
            </SectionSlideTop>
        </section>
    )
}
