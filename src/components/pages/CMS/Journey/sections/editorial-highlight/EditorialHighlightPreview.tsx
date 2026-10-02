import type { JourneyPreviewSectionProps } from "../../journeyTypes"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"

export function EditorialHighlightPreview({ draft }: JourneyPreviewSectionProps) {
  if (!draft) return null

  const highlightData =
    draft.editorial_highlight || draft?.data?.editorial_highlight || draft.sharedInfo || {}

  return (
    <section
      data-section="editorial_highlight"
      className="relative w-full py-10 md:py-[70px] lgx:py-[80px] xl:py-[90px] overflow-hidden"
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
            className="w-full max-w-[1326px] text-center font-heading text-[22px] leading-[36px] md:text-[30px] md:leading-[46px] xl:text-[36px] xl:leading-[52px] font-semibold tracking-[2px]"
          />
        </div>
      </div>
    </section>
  )
}

export default EditorialHighlightPreview
