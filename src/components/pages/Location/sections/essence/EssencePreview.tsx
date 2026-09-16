import { DynamicStyledPreview } from "@/components/shared/DynamicStyledPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"

const defaultFallbackImage = "/images/albania-essence.png"

export function EssencePreview({ draft }: LocationPreviewSectionProps) {
  const essence = draft?.essence || (draft as any)?.data?.essence || {}

  return (
    <section
      className="relative w-full overflow-hidden pt-[45px] @xs:pt-[55px] @sm:pt-[65px] @md:pt-[90px] @lg:pt-[100px] @xlg:pt-[110px] @xl:pt-[120px] pb-[40px] @xs:pb-[45px] @sm:pb-[48px] @md:pb-[50px] @lg:pb-[55px] @xl:pb-[59px]"
    >
      {/* Background Media (Image / Video / Color) */}
      <UniversalMultimediaPreview
        multimedia={essence.backgroundMultimedia}
        fallbackColor="#F9F9F9"
        mode="background"
      />

      <div
        id="essence-section"
        className="relative z-10 w-full scroll-mt-20 md:scroll-mt-24 container mx-auto px-4 @xs:px-5 @sm:px-6 @md:px-8 @lg:px-6 @xl:px-0"
      >
        <div className="w-full">
          <div className="max-w-[1280px] flex flex-col-reverse @lg:flex-row @lg:items-center items-start gap-8 @xs:gap-10 @sm:gap-12 @md:gap-12 @lg:gap-10 @xlg:gap-12 @xl:gap-16 w-full">
            {/* Left Story Column */}
            <div className="flex w-full flex-col items-start">
              {/* Eyebrow Label */}
              <div className="self-stretch flex flex-col justify-start items-start">
                <DynamicStyledPreview
                  as="span"
                  field={essence.label}
                  fallback="THE ESSENCE OF ALBANIA"
                  fallbackColor="#af6348"
                  className="justify-start text-accent font-normal uppercase text-xs @xs:text-sm @md:text-[15px] @xl:text-base leading-3 @xs:leading-3.5 @md:leading-3.5 @xl:leading-4 tracking-[2px] @xs:tracking-[2.5px] @md:tracking-[3.5px] @xl:tracking-[4.2px]"
                />
              </div>

              {/* Main Heading */}
              <div className="self-stretch mt-3 @xs:mt-3.5 @sm:mt-4 @md:mt-4 @lg:mt-5 @xl:mt-6 flex flex-col justify-start items-start">
                <DynamicStyledPreview
                  as="h2"
                  field={essence.title}
                  fallback="A country that kept its secrets for fifty years"
                  fallbackColor="#182d09"
                  className="w-full justify-start text-primary font-semibold font-heading text-[24px] @xs:text-[28px] @sm:text-[32px] @md:text-[36px] @lg:text-[40px] @xlg:text-[44px] @xl:text-[48px] leading-[32px] @xs:leading-[36px] @sm:leading-[42px] @md:leading-[48px] @lg:leading-[52px] @xlg:leading-[58px] @xl:leading-[64px]"
                />
              </div>

              {/* Story Paragraphs Container with Full RichText HTML rendering */}
              <div className="w-full mt-4 @xs:mt-5 @sm:mt-6 @md:mt-6 @lg:mt-7 @xlg:mt-8 @xl:mt-8 flex flex-col justify-start items-start">
                <DynamicStyledPreview
                  as="div"
                  type="richtext"
                  field={essence.paragraphs}
                  fallbackColor="#565e69"
                  className="w-full text-subtitle font-normal text-[13px] @xs:text-[14px] @md:text-[15px] @xl:text-base leading-[22px] @xs:leading-6 @md:leading-[26px] @xl:leading-7 tracking-normal @xs:tracking-[0.5px] @md:tracking-[1px] text-justify"
                />
              </div>

              {/* Editorial Quote */}
              <div className="self-stretch pt-5 @xs:pt-6 @sm:pt-7 @md:pt-8 @lg:pt-9 @xl:pt-10 flex flex-col justify-start items-start">
                <div className="self-stretch pt-3.5 @xs:pt-4 @sm:pt-5 @md:pt-6 @lg:pt-7 @xl:pt-8 border-t border-border-muted flex flex-col justify-start items-start">
                  <DynamicStyledPreview
                    as="blockquote"
                    field={essence.quote}
                    prefix="“"
                    suffix="”"
                    fallbackColor="#1A1209"
                    className="w-full justify-start text-qoute font-normal italic text-[13px] @xs:text-[14px] @sm:text-[15px] @md:text-[16px] @lg:text-[18px] @xl:text-[20px] leading-5 @xs:leading-[22px] @sm:leading-[23px] @md:leading-[24px] @lg:leading-[28px] @xl:leading-[32px]"
                  />
                </div>
              </div>
            </div>

            {/* Right Image Column with Absolute Stat Badge */}
            <div className="relative flex w-full justify-center @lg:justify-end items-center self-stretch">
              <div
                className="relative w-full max-w-[280px] @xs:max-w-[340px] @sm:max-w-[420px] @md:max-w-[480px] @lg:max-w-[440px] @xlg:max-w-[480px] @xl:max-w-[536px] @2xl:max-w-[620px]
                h-[350px] @xs:h-[425px] @sm:h-[520px] @md:h-[600px] @lg:h-[520px] @xlg:h-[580px] @xl:h-[640px] @2xl:h-[700px]"
              >
                {/* Image Box - Constrained inside Mother Bounding Frame */}
                <div className="relative size-full overflow-hidden rounded-[2px] flex items-center justify-center bg-[#EDE7D8]">
                  <UniversalMultimediaPreview
                    multimedia={essence.imageMultimedia || essence.multimedia}
                    fallbackImageSrc={defaultFallbackImage}
                    fallbackBg="#EDE7D8"
                    mode="inline"
                    className="size-full object-cover object-center"
                    containerClassName="size-full"
                  />
                </div>

                {/* Absolute Stat Badge Overlaid on the Media */}
                {(() => {
                  const stat = essence.stat || {}
                  const statValue = stat.statValue ?? stat.value ?? essence.statValue
                  const statLabel = stat.statLabel ?? stat.label ?? essence.statLabel
                  const rawBadgeBg =
                    stat.statBadgeBg ??
                    stat.badgeBg ??
                    (typeof statValue === "object" && statValue?.backgroundColor) ||
                    essence.statBadgeBg ||
                    "#B86B3A"
                  const rawBadgeOpacity =
                    (typeof statValue === "object" && statValue?.backgroundOpacity !== undefined
                      ? statValue.backgroundOpacity
                      : 1)

                  return (
                    <div
                      className="absolute w-[145px] @xs:w-[165px] @sm:w-[180px] @md:w-[195px] @xl:w-[195.922px] -bottom-3 @xs:-bottom-4 @sm:-bottom-5 @md:-bottom-6 -left-2 @xs:-left-3 @sm:-left-4 @md:-left-5 @xl:-left-6 px-3.5 @xs:px-4 @sm:px-5 @md:px-6 @lg:px-[26px] @xl:px-7 py-2.5 @xs:py-3 @sm:py-3.5 @md:py-[18px] @lg:py-[19px] @xl:py-5 flex flex-col justify-start items-start z-10 shadow-md transition-colors"
                      style={{
                        backgroundColor: rawBadgeBg || "#B86B3A",
                        opacity: rawBadgeOpacity,
                      }}
                    >
                      <div className="self-stretch flex flex-col justify-start items-start">
                        <DynamicStyledPreview
                          as="span"
                          field={statValue}
                          fallback="50+"
                          fallbackColor="#ffffff"
                          className="justify-start font-medium font-heading text-[18px] @xs:text-[20px] @sm:text-[24px] @md:text-[26px] @lg:text-[28px] @xl:text-[30px] leading-6 @xs:leading-7 @md:leading-8 @lg:leading-[34px] @xl:leading-9"
                        />
                      </div>
                      <div className="w-full pt-0.5 flex flex-col justify-start items-start">
                        <DynamicStyledPreview
                          as="span"
                          field={statLabel}
                          fallback="Countries & Sovereign Territories"
                          fallbackColor="rgba(255, 255, 255, 0.75)"
                          className="justify-start font-normal text-[10px] @xs:text-[11px] @sm:text-[12px] @md:text-[13px] @lg:text-[13.5px] @xl:text-sm leading-3.5 @xs:leading-4 @md:leading-[18px] @xl:leading-5"
                        />
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EssencePreview
