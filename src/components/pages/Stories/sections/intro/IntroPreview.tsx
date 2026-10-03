import type { StoryData } from "../../config/storyTypes"
import { emptyIntro } from "./emptyIntro"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"

export function IntroPreview({ story }: { story: StoryData }) {
  const intro = story?.intro || emptyIntro
  const title = intro.title || emptyIntro.title
  const subtitle = intro.subtitle || emptyIntro.subtitle
  const description = intro.description || emptyIntro.description
  const media = intro.backgroundMultimedia || emptyIntro.backgroundMultimedia

  const hasText = Boolean(title?.value || subtitle?.value || description?.value)

  if (!hasText && !media) return null

  return (
    <section className="relative w-full xl:py-[84px] lgx:py-[74px] md:py-[60px] py-10 overflow-hidden">
      {/* Universal Multimedia Background (Supports Color, Image, and Video modes with default settings) */}
      <UniversalMultimediaPreview
        multimedia={media}
        mode="background"
        fallbackColor="#FAF7F2"
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 max-w-[1360px]">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-6 md:gap-7 xl:gap-8">
          {subtitle?.value && (
            <div className="w-full text-center text-xs md:text-[13px] xl:text-sm font-semibold uppercase tracking-[2px] text-[#B3884D]">
              <DynamicStyledTextPreview data={subtitle} />
            </div>
          )}

          {title?.value && (
            <DynamicStyledTextPreview
              as="h2"
              data={title}
              className="w-full text-center font-serif text-2xl md:text-3xl lgx:text-4xl xl:text-[42px] font-semibold text-stone-900 tracking-tight leading-tight"
            />
          )}

          {description?.value && (
            <div className="w-full text-left text-base md:text-[17px] xlg:text-[18px] xl:text-[20px] font-normal text-[#4A4A4A] leading-7 md:leading-[30px] xlg:leading-[32px] xl:leading-9 tracking-[1px] md:tracking-[1.5px] lgx:tracking-[1.7px] xl:tracking-[2px]">
              <DynamicStyledTextPreview data={description} isRichText={true} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default IntroPreview
