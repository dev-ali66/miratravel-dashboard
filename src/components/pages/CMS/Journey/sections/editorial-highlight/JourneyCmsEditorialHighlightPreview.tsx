import type { JourneyCmsPreviewSectionProps } from "../../journeyCmsTypes"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"

export function JourneyCmsEditorialHighlightPreview({ draft }: JourneyCmsPreviewSectionProps) {
  if (!draft) return null

  const highlightData =
    draft.editorial_highlight || draft?.data?.editorial_highlight || draft.sharedInfo || {}

  return (
    <section
      data-section="editorial_highlight"
      className="relative w-full xl:py-[77px] lgx:py-[67px] md:py-[57px] py-10 overflow-hidden"
    >
      {/* Background Media (Color / Image / Video) */}
      <UniversalMultimediaPreview
        multimedia={highlightData.backgroundMultimedia}
        fallbackColor="#FAF6F0"
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex w-full justify-center text-center">
          <DynamicStyledTextPreview
            as="p"
            data={highlightData.text}
            fallbackColor="#AF6348"
            className="w-full max-w-full md:max-w-full lg:max-w-[920px] lgx:max-w-[1020px] xlg:max-w-[1140px] mid:max-w-[1240px] xl:max-w-[1326px] text-center font-heading text-[22px] leading-8 md:text-[28px] md:leading-10 lgx:leading-11 lgx:text-[30px] mid:text-[32px] mid:leading-12 xl:text-[36px] xl:leading-13 font-semibold tracking-[0.5px] md:tracking-[1px] lgx:tracking-[1.5px] mid:tracking-[1.8px] xl:tracking-[2px]"
          />
        </div>
      </div>
    </section>
  )
}

export default JourneyCmsEditorialHighlightPreview
