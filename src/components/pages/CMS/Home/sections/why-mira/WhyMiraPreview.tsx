import type { HomeSection } from "../../homeTypes"
import { UniversalMultimediaPreview } from "../../shared/preview/UniversalMultimediaPreview"
import { DynamicStyledPreview } from "@/components/shared/DynamicStyledPreview"


export type WhyMiraPreviewProps = {
  section: HomeSection
  accentColor: string
  darkText: string
}

export function WhyMiraPreview({
  section,
  accentColor,
  darkText,
}: WhyMiraPreviewProps) {
  const sec = (section || {}) as Record<string, any>
  const content = (sec.content ?? sec) as Record<string, any>
  const backgroundMultimedia = sec.backgroundMultimedia || content.backgroundMultimedia || (content as any).multimedia || (sec as any).multimedia
  const rightSideMultimedia = sec.rightSideMultimedia || content.rightSideMultimedia || (content as any).rightSideMedia
  const paragraphs = Array.isArray(sec.paragraphs) ? sec.paragraphs : Array.isArray(content.paragraphs) ? content.paragraphs : []

  const isDarkBg = section.bgColor === "#182D09" || section.bgColor === "#1F3A1B" || !section.bgColor
  const textColor = isDarkBg ? "#FFFFFF" : darkText
  const paraTextColor = isDarkBg ? "#F3F4F6" : darkText
  const goldColor = isDarkBg ? "#E5A84B" : accentColor

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"
      style={{
        backgroundColor: section.bgColor ?? "#182D09",
        color: textColor,
      }}
    >
      <UniversalMultimediaPreview
        multimedia={backgroundMultimedia}
        fallbackAlt="Why Mira background"
        fallbackColor={section.bgColor ?? "#182D09"}
        mode="background"
        overlayClassName={isDarkBg ? undefined : "bg-white/70"}
      />

      <div className="relative z-10 container mx-auto px-4 lg:px-0 flex w-full flex-col-reverse items-center justify-center lg:items-center gap-10 md:gap-14 lg:gap-[60px] xl:gap-[80px] lg:flex-row">
        <div className="flex w-full flex-col items-start lg:w-1/2">
          <DynamicStyledPreview
            as="p"
            field={sec.eyebrow || content.eyebrow}
            styleObj={sec.homeWhyMiraEyebrowStyle || content.homeWhyMiraEyebrowStyle}
            fallbackColor={goldColor}
            className="text-[10px] font-semibold tracking-[0.18em] uppercase text-amber-400"
          />

          <DynamicStyledPreview
            as="h2"
            field={sec.title || content.title}
            styleObj={sec.homeWhyMiraTitleStyle || content.homeWhyMiraTitleStyle}
            fallbackColor={textColor}
            className="font-serif text-[28px] leading-[36px] md:text-[38px] md:leading-[46px] lg:text-[42px] lg:leading-[50px] font-semibold"
          />

          <div className="mt-6 flex flex-col gap-4 text-subtitle text-sm md:text-base leading-relaxed">
            <DynamicStyledPreview
              as="div"
              type="richtext"
              field={sec.description || content.description || (paragraphs.length ? paragraphs.join("\n\n") : null)}
              styleObj={sec.homeWhyMiraDescriptionStyle || content.homeWhyMiraDescriptionStyle}
              fallbackColor={paraTextColor}
              className="font-normal opacity-90 whitespace-pre-line"
            />
          </div>

          {(sec.signature || content.signature) && (
            <DynamicStyledPreview
              as="span"
              field={sec.signature || content.signature}
              styleObj={sec.homeWhyMiraSignatureStyle || content.homeWhyMiraSignatureStyle}
              fallbackColor={goldColor}
              className="mt-8 font-serif text-lg italic text-amber-400"
            />
          )}
        </div>

        <div className="w-full lg:w-1/2 aspect-[4/3] rounded-lg overflow-hidden shrink-0">
          <UniversalMultimediaPreview
            multimedia={rightSideMultimedia}
            fallbackAlt="Why Mira story"
            fallbackColor="#FBF9F5"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
