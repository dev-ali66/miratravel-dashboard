import type { JourneyCmsPreviewSectionProps } from "../../journeyCmsTypes"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"

export function JourneyCmsHeroPreview({ draft }: JourneyCmsPreviewSectionProps) {
  if (!draft) return null

  const hero = draft?.hero || draft?.data?.hero || {}
  const isCenter = Boolean(hero.isCenter)

  return (
    <section
      data-section="hero"
      className="relative w-full h-[600px] md:h-[720px] lgx:h-[740px] xl:h-[768px] overflow-hidden flex items-end"
    >
      {/* Background Media (Video / Image / Color) */}
      <UniversalMultimediaPreview
        multimedia={hero.backgroundMultimedia}
        fallbackColor="#182D09"
        mode="background"
      />

      {/* Dark Overlay Gradient matching frontend GlobalHero */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(24, 45, 9, 0.25) 0%, rgba(24, 45, 9, 0.55) 60%, rgba(24, 45, 9, 0.85) 100%)",
        }}
      />

      <div className="relative z-10 w-full xl:pl-[136px] lg:pl-[96px] md:pl-[56px] pl-[20px] xl:pr-[136px] lg:pr-[96px] md:pr-[56px] pr-[20px] xl:pb-[96px] xlg:pb-[84px] lg:pb-[72px] md:pb-[56px] pb-7">
        <div
          className={`flex w-full lg:max-w-[756px] flex-col ${
            isCenter ? "items-center text-center mx-auto" : "items-start text-left"
          }`}
        >
          {/* Breadcrumb Tag */}
          {hero.breadcrumb && (
            <DynamicStyledTextPreview
              as="nav"
              data={hero.breadcrumb}
              fallbackColor="#E5E7EB"
              className="inline-flex items-center flex-wrap text-[18px] md:text-[20px] lg:text-[21px] lgx:text-[22px] xlg:text-[23px] mid:text-[23.5px] xl:text-[24px] leading-6 md:leading-[27px] lg:leading-[28px] tracking-[1.05px] md:tracking-[1.17px] uppercase text-neutral-200 xl:mb-3 mb-2 md:mb-2.5 font-medium"
            />
          )}

          {/* Title */}
          <DynamicStyledTextPreview
            as="h1"
            data={hero.title}
            fallbackColor="#FFFFFF"
            className="font-heading font-semibold capitalize text-[36px] md:text-[52px] xlg:text-[56px] xl:text-[60px] xl:leading-[68px] md:leading-[64px] leading-12 tracking-[0.905px] text-neutral-100 xl:mb-4 mb-3"
          />

          {/* Subtitle (only rendered if exists) */}
          {hero.subtitle && hero.subtitle?.value !== hero.description?.value && (
            <DynamicStyledTextPreview
              as="h2"
              data={hero.subtitle}
              fallbackColor="#E5E7EB"
              className="text-[15px] md:text-[16px] xlg:text-[17px] xl:text-[18px] xl:leading-7 md:leading-[22px] text-neutral-100 font-normal xl:mb-3 mb-2"
            />
          )}

          {/* Description */}
          {hero.description && (
            <DynamicStyledTextPreview
              as="div"
              data={hero.description}
              fallbackColor="#E5E7EB"
              className="xl:text-[20px] mid:text-[20px] lgx:text-[19px] md:text-[17px] text-base font-normal xl:leading-7 lgx:leading-6 md:leading-[22px] tracking-[0.94px] text-neutral-100 xl:mb-8 md:mb-6 mb-5"
            />
          )}

          {/* Buttons */}
          {Array.isArray(hero.buttons) && hero.buttons.length > 0 && (
            <div className="min-w-[230px]">
              <DynamicCmsButtonPreview buttons={hero.buttons} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default JourneyCmsHeroPreview
