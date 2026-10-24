import { THEME_COLORS } from "@/config/theme"
import type { LocationPreviewSectionProps } from "../../config/locationSections"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"

export function SharedInfoPreview({ draft }: LocationPreviewSectionProps) {
  if (!draft) return null

  const sharedData = draft.sharedInfo || (draft as any)?.data?.sharedInfo || {}

  return (
    <section
      data-section="shared-info"
      className="relative w-full py-10 md:py-[70px] lgx:py-[80px] xl:py-[90px] overflow-hidden"
    >
      {/* Background Media (Color / Image / Video) */}
      <UniversalMultimediaPreview
        multimedia={sharedData.backgroundMultimedia}
        fallbackColor={THEME_COLORS.bgBeige}
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex w-full justify-center text-center">
          <DynamicStyledTextPreview
            as="p"
            data={sharedData.text}
            fallbackColor={THEME_COLORS.accent}
            className="w-full max-w-[1326px] text-center font-heading text-[22px] leading-[36px] md:text-[30px] md:leading-[46px] xl:text-[36px] xl:leading-[52px] font-semibold tracking-[2px]"
          />
        </div>
      </div>
    </section>
  )
}

export default SharedInfoPreview
