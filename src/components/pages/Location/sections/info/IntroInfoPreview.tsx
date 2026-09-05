/* =====================================================
   INTROINFO — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics } from "../../shared/previewBasics"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"

export type IntroInfoPreviewProps = {
  draft: LocationData | null
}

export function IntroInfoPreview({ draft }: IntroInfoPreviewProps) {
  const { data, name, subtitle, description } = getLocationBasics(draft)

  const title = data.info?.headline || data.title || name
  const body = data.info?.description || description || subtitle || ""
  const background = (data.info as any)?.backgroundMultimedia

  return (
    <section className="relative w-full overflow-hidden py-12 md:py-16 lg:py-20 xl:py-24">
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor="#1a2e2a"
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-6 px-2.5 py-8 md:gap-8 md:px-3 md:py-12 lg:flex-row lg:items-center lg:justify-center lg:gap-12 lg:px-4 xl:gap-[59px]">
          <div className="w-full lg:max-w-[395px]">
            <h2
              className="lgx:text-[28px] lgx:leading-[40px] font-roboto-serif text-xl leading-8 font-medium tracking-[1px] text-stone-200 md:text-2xl lg:text-[28px] lg:leading-[40px] xl:text-[32px] xl:leading-[48px]"
              style={fieldCssStyle((data.info as any)?.headlineStyle)}
            >
              {title}
            </h2>
          </div>

          <div className="w-full lg:max-w-[760px]">
            <p
              className="font-inter text-sm leading-[22px] tracking-[1.5px] text-white/90 md:text-[15px] md:leading-[24px] md:tracking-[2.5px] xl:text-[16px] xl:leading-[26px] xl:tracking-[3px]"
              style={fieldCssStyle((data.info as any)?.descriptionStyle)}
            >
              {body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
