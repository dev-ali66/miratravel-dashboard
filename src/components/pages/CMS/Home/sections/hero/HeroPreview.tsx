import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { cn } from "@/lib/utils"
import type { HomePreviewSectionProps } from "../../config/homeSections"

const HERO_SIGNATURE_IMAGE = "/images/home-image.png"

export function HeroPreview({ section }: HomePreviewSectionProps) {
  const hero = section || {}
  const content = (hero.content ?? hero) as Record<string, any>
  const isCenter = Boolean(hero.isCenter || content.isCenter)
  const buttons = Array.isArray(hero.buttons) ? hero.buttons : Array.isArray(content.buttons) ? content.buttons : []

  const backgroundMultimedia =
    hero.backgroundMultimedia ||
    content.backgroundMultimedia ||
    (hero as any).multimedia ||
    (content as any).multimedia

  return (
    <div className="w-full">
      <section
        className={cn(
          "relative flex h-[700px] @md:h-[900px] @lg:h-[1000px] @xl:h-[1086px] w-full items-center overflow-hidden bg-[#182D09] text-white",
          isCenter && "justify-center"
        )}
      >
        {/* Background Media (Image / Video / Color) */}
        <UniversalMultimediaPreview
          multimedia={backgroundMultimedia}
          mode="background"
          overlayClassName="bg-black/35"
        />

        {/* Hero Content Container */}
        <div
          className={cn(
            "relative z-10 flex h-full w-full items-center",
            isCenter && "justify-center"
          )}
        >
          <div
            className={cn(
              "flex w-full @xl:max-w-[1206px] flex-col",
              isCenter
                ? "items-center text-center px-4 @md:px-12 @lg:px-24 py-12"
                : "items-start text-left @xl:pl-[136px] @lgx:pl-[110px] @lg:pl-[86px] @md:pl-[36px] pl-[20px] pr-5"
            )}
          >
            {/* Breadcrumb / Category Tag */}
            {(hero.breadcrumb || content.eyebrow || content.breadcrumb) && (
              <DynamicStyledTextPreview
                as="span"
                data={hero.breadcrumb || content.eyebrow || content.breadcrumb}
                className={cn(
                  "text-xs @md:text-[15px] @xl:text-base font-semibold uppercase leading-5 @md:leading-[22px] @xl:leading-6 tracking-[2.4px] text-amber-400 mb-3 @md:mb-4",
                  isCenter && "text-center"
                )}
              />
            )}

            {/* Hero Main Title */}
            <DynamicStyledTextPreview
              as="h1"
              data={hero.title || content.title}
              className={cn(
                "font-heading font-semibold text-[32px] @md:text-[52px] @lg:text-[60px] @lgx:text-[64px] @xl:text-[72px] leading-[42px] @md:leading-[66px] @lg:leading-[80px] @lgx:leading-[84px] @xl:leading-[92px] tracking-[0.94px] text-neutral-100 mb-6 @md:mb-7 @lg:mb-8 @lgx:mb-9 @xl:mb-12 capitalize max-w-[1000px]",
                isCenter && "text-center mx-auto"
              )}
            />

            {/* Hero Subtitle */}
            {(hero.subtitle || content.subtitle) && (
              <DynamicStyledTextPreview
                as="h2"
                data={hero.subtitle || content.subtitle}
                className={cn(
                  "text-[15px] @md:text-base @lg:text-[18px] @xl:text-[20px] leading-6 @md:leading-[28px] @xl:leading-[34px] font-medium text-amber-200/90 mb-4",
                  isCenter && "text-center"
                )}
              />
            )}

            {/* Editorial Description with RichText Support */}
            <DynamicStyledTextPreview
              as="div"
              isRichText
              data={hero.description || content.description}
              className={cn(
                "max-w-[839px] text-[15px] @md:text-base @lg:text-[18px] @lgx:text-[20px] @xl:text-xl font-normal leading-[22px] @md:leading-[26px] @lg:leading-[30px] @lgx:leading-[28px] @xl:leading-[38px] tracking-[0.94px] @md:tracking-[1.04px] @xl:tracking-[1.44px] text-neutral-100 mb-[55px] @md:mb-[60px] @lg:mb-[65px] @lgx:mb-[70px] @xl:mb-[80px]",
                isCenter && "text-center mx-auto"
              )}
            />

            {/* Reusable CTA Buttons List */}
            {buttons.length > 0 && (
              <div className="w-full @md:w-[230px]">
                <DynamicCmsButtonPreview
                  data={buttons}
                  className={cn(
                    "w-full",
                    isCenter ? "justify-center" : "justify-start"
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MIRA Signature Image Banner */}
      <div className="pt-[37px] @sm:pt-[42px] @md:pt-[56px] @lg:pt-[65px] @xlg:pt-[74px] @xl:pt-[84px] flex justify-end container mx-auto px-4 @lg:px-0">
        <img
          className="w-[260px] @sm:w-[315px] h-auto aspect-[35/4] object-contain"
          src={HERO_SIGNATURE_IMAGE}
          alt="MIRA signature"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
      </div>
    </div>
  )
}

export default HeroPreview
