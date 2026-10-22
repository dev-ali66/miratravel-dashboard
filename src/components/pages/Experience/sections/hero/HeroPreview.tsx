import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { cn } from "@/lib/utils"
import type { ExperiencePreviewSectionProps } from "../../config/experienceSections"

export function HeroPreview({ draft }: ExperiencePreviewSectionProps) {
  const hero = draft?.hero || {}
  const isCenter = Boolean(hero.isCenter)
  const buttons = Array.isArray(hero.buttons) ? hero.buttons : []

  return (
    <section
      data-section="hero"
      className={cn(
        "relative flex min-h-[500px] h-[560px] @xs:h-[600px] @sm:h-[640px] @md:h-[720px] @lg:h-[740px] @xlg:h-[750px] @xl:h-[768px] w-full items-center overflow-hidden bg-[#171717] text-white",
        isCenter && "justify-center"
      )}
    >
      {/* Background Media (Image / Video / Color) */}
      <UniversalMultimediaPreview
        multimedia={hero.backgroundMultimedia || hero.multimedia}
        mode="background"
        overlayClassName="bg-gradient-to-t from-black/80 via-black/35 to-transparent"
      />

      {/* Hero Content Container */}
      <div
        className={cn(
          "relative z-10 mx-auto flex h-full w-full flex-col justify-end pb-[36px] @xs:pb-[42px] @sm:pb-[48px] @md:pb-[60px] @lg:pb-[70px] @xl:pb-[80px] pl-[20px] pr-[20px] @xs:pl-[28px] @xs:pr-[28px] @sm:pl-[36px] @sm:pr-[36px] @md:pl-[56px] @md:pr-[56px] @lg:pl-[96px] @lg:pr-[96px] @xl:pl-[136px] @xl:pr-[136px]"
        )}
      >
        <div className="flex w-full max-w-[880px] flex-col items-start text-left">
          {/* Breadcrumb / Category Tag */}
          <DynamicStyledTextPreview
            as="span"
            data={hero.breadcrumb}
            className="text-xs @xs:text-[13px] @md:text-[15px] @xl:text-base font-semibold uppercase leading-5 @md:leading-[22px] @xl:leading-6 tracking-[2px] text-accent mb-2 @md:mb-2.5 @xl:mb-3"
          />

          {/* Hero Main Title */}
          <DynamicStyledTextPreview
            as="h1"
            data={hero.title}
            className="font-heading font-semibold text-[32px] @xs:text-[38px] @sm:text-[44px] @md:text-[52px] @lg:text-[56px] @xlg:text-[60px] @xl:text-[64px] leading-[40px] @xs:leading-[46px] @sm:leading-[52px] @md:leading-[60px] @lg:leading-[64px] @xlg:leading-[68px] @xl:leading-[72px] tracking-[0.905px] text-neutral-200 mb-3 @md:mb-3.5 @xl:mb-4"
          />

          {/* Hero Subtitle */}
          <DynamicStyledTextPreview
            as="h2"
            data={hero.subtitle}
            className="text-[14px] @xs:text-[15px] @sm:text-base @md:text-[17px] @xlg:text-[18px] @xl:text-[20px] leading-6 @md:leading-[28px] @xlg:leading-[34px] @xl:leading-[36px] font-medium text-neutral-200 mb-2 @md:mb-2.5 @xl:mb-3"
          />

          {/* Editorial Description with RichText Support */}
          <DynamicStyledTextPreview
            as="div"
            isRichText
            data={hero.description}
            className="max-w-[738px] text-[13px] @xs:text-[14px] @sm:text-base @md:text-[17px] @xlg:text-[18px] @xl:text-[20px] font-normal leading-5 @xs:leading-6 @md:leading-[28px] @xlg:leading-[34px] @xl:leading-[36px] text-neutral-100/90 mb-6"
          />

          {/* Reusable CTA Buttons List */}
          <DynamicCmsButtonPreview
            data={buttons}
            className="mt-2 justify-start"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroPreview
