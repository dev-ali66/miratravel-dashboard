import type { LocationPreviewSectionProps } from "../../config/locationSections"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"

export function PlaceInfoPreview({ draft }: LocationPreviewSectionProps) {
  if (!draft) return null

  const infoData = draft.infoCard || draft.info || {}

  return (
    <div className="relative w-full py-10 md:py-[60px] xlg:py-[64px] overflow-hidden">
      <UniversalMultimediaPreview
        multimedia={infoData.backgroundMultimedia}
        fallbackColor="#182d09"
        mode="background"
      />

      <div className="@container container mx-auto px-4 lg:px-6 relative z-10">
        <div className="w-full max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-[45px] xlg:gap-[55px] xl:gap-[59px]">
          {/* Left Heading */}
          <div className="w-full lg:max-w-[360px] xlg:max-w-[395px] shrink-0">
            <DynamicStyledTextPreview
              as="h2"
              data={infoData.headline}
              className="text-stone-300 text-xl lgx:text-[28px] xlg:text-3xl xl:text-[32px] font-semibold font-heading leading-8 lgx:leading-[40px] md:leading-[44px] xl:leading-[48px] tracking-[1px]"
            />
          </div>

          {/* Right Description */}
          <div className="w-full flex-1">
            <DynamicStyledTextPreview
              as="p"
              data={infoData.description}
              className="text-neutral-200 text-sm md:text-[15px] xl:text-[16px] font-normal leading-[22px] md:leading-[24px] xl:leading-[26px] tracking-[2.5px] xl:tracking-[3px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
