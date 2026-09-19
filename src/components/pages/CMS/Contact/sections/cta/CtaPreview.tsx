import type { ReactNode } from "react"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledPreview } from "@/components/shared/DynamicStyledPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { emptyCta } from "./emptyCta"

export type CtaPreviewProps = {
  section?: any
  accentColor?: string
  darkText?: string
  renderButtons?: (
    buttons?: any[],
    fullWidth?: boolean,
    alignRight?: boolean,
    mainButtonWidth?: boolean
  ) => ReactNode
}

export function CtaPreview({
  section,
  darkText = "#182D09",
  renderButtons,
}: CtaPreviewProps) {
  const sec = (section || emptyCta) as Record<string, any>
  const content = (sec.content ?? sec) as Record<string, any>
  const backgroundMultimedia = sec.backgroundMultimedia || content.backgroundMultimedia || (content as any).multimedia
  const rightSideMultimedia = sec.rightSideMultimedia || content.rightSideMultimedia || (content as any).rightSideMedia
  const title = sec.title ?? content.title
  const description = sec.description ?? content.description
  const buttons = sec.buttons ?? content.buttons ?? []

  return (
    <section
      data-section="cta"
      id="design-journey"
      className="relative w-full pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] xl:pb-[80px] xlg:pb-[75px] lgx:pb-[72px] lg:pb-[70px] md:pb-[65px] pb-[55px] overflow-hidden"
      style={{
        backgroundColor: sec.bgColor ?? "transparent",
        color: darkText,
      }}
    >
      <UniversalMultimediaPreview
        multimedia={backgroundMultimedia}
        fallbackAlt="Custom Journey CTA background"
        fallbackColor={sec.bgColor ?? "transparent"}
        mode="background"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 xlg:gap-10 xl:gap-12 w-full">
        <div className="flex w-full min-w-0 justify-start lg:justify-end xl:pl-[144px] xlg:pl-[110px] md:pl-[56px] pl-[20px] pr-4 md:pr-8 lg:pr-10 xl:pr-14 order-2 lg:order-1">
          <div className="flex w-full flex-col items-start gap-8 sm:gap-10 md:gap-12 lg:gap-[56px] xl:gap-[68px] max-w-[638px] xl:max-w-[700px]">
            <div className="flex flex-col items-start gap-5 sm:gap-6">
              <DynamicStyledPreview
                as="h2"
                type="richtext"
                field={title}
                styleObj={sec.homeCustomJourneyCtaTitleStyle || content.homeCustomJourneyCtaTitleStyle}
                fallbackColor={darkText}
                className="font-heading text-[26px] leading-[34px] md:text-[38px] md:leading-[48px] lg:text-[42px] lg:leading-[52px] lgx:text-[45px] lgx:leading-[55px] xlg:text-[48px] xlg:leading-[58px] xl:text-[50px] xl:leading-[60px] font-semibold tracking-[1px]"
              />

              <DynamicStyledPreview
                as="div"
                type="richtext"
                field={description}
                styleObj={sec.homeCustomJourneyCtaDescriptionStyle || content.homeCustomJourneyCtaDescriptionStyle}
                fallbackColor={darkText}
                className="max-w-[514px] text-sm md:text-[15px] xl:text-base font-normal leading-[18px] md:leading-[20px] xl:leading-[22px] tracking-[1px] text-subtitle"
              />
            </div>

            {buttons.length ? (
              <div className="md:w-[230px] w-full">
                {renderButtons ? (
                  renderButtons(buttons, true, false, true)
                ) : (
                  <DynamicCmsButtonPreview buttons={buttons} />
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="w-full flex justify-end min-w-0 order-1 lg:order-2 rounded-lg overflow-hidden">
          <UniversalMultimediaPreview
            multimedia={rightSideMultimedia}
            fallbackAlt="Let us design your journey"
            containerClassName="w-full h-[260px] md:h-[420px] lg:h-[460px] lgx:h-[490px] xlg:h-[520px] xl:h-[560px] 2xl:h-[580px]"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default CtaPreview

