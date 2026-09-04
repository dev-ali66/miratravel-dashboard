import type { ReactNode } from "react"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import type { HomeSection } from "../../homeTypes"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE = "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"
const PREVIEW_VIDEO_SOURCE = "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beach-1576/1080p.mp4"

export type CustomJourneyCtaPreviewProps = {
  section: HomeSection
  accentColor: string
  darkText: string
  renderButtons: (
    buttons?: any[],
    fullWidth?: boolean,
    alignRight?: boolean,
    mainButtonWidth?: boolean
  ) => ReactNode
}

export function CustomJourneyCtaPreview({
  section,
  accentColor,
  darkText,
  renderButtons,
}: CustomJourneyCtaPreviewProps) {
  const content = (section.content ?? {}) as Record<string, any>
  const backgroundMultimedia = (content.backgroundMultimedia ?? {}) as Record<string, any>
  const backgroundImage = section.bgImages?.[0]
  const backgroundVideo = section.bgVideos?.[0]
  const backgroundType =
    backgroundMultimedia.type ??
    section.backgroundType ??
    (section.showVideo ? "video" : backgroundMultimedia.url || backgroundImage?.url ? "image" : "color")

  const backgroundImageData = backgroundMultimedia.imageData ?? backgroundMultimedia
  const backgroundVideoData = backgroundMultimedia.videoData ?? backgroundMultimedia

  const image = backgroundImage?.url ?? PREVIEW_IMAGE_SOURCE
  const imageAlt = backgroundImage?.alt ?? "Let us design your journey"

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: section.bgColor ?? "#FBF9F5", color: darkText }}>
      <UniversalMultimediaPreview
        multimedia={
          backgroundType === "video"
            ? { ...backgroundVideo, ...backgroundVideoData, type: "video" }
            : backgroundType === "image"
              ? { ...backgroundImage, ...backgroundImageData, type: "image" }
              : { color: backgroundMultimedia.color, type: "color" }
        }
        fallbackImageSrc={PREVIEW_IMAGE_SOURCE}
        fallbackVideoSrc={PREVIEW_VIDEO_SOURCE}
        fallbackAlt="Custom Journey CTA background"
        fallbackColor={section.bgColor ?? "#FBF9F5"}
        mode="background"
        className="h-full w-full"
        containerClassName="absolute inset-0"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 mx-auto flex w-full flex-col-reverse items-center justify-between gap-10 py-16 sm:gap-12 md:py-24 lg:flex-row lg:items-center">
        <div className="flex w-full flex-1 justify-start px-7 md:px-14 lg:justify-end xl:pl-36 xl:pr-14">
          <div className="flex w-full max-w-[700px] flex-col items-start gap-8 md:gap-12 lg:gap-14 xl:gap-[68px]">
            <div className="flex flex-col items-start gap-5 sm:gap-6">
              {content.titleLine1 && (
                <h2
                  className="font-serif text-[26px] font-semibold leading-[34px] tracking-[1px] md:text-[38px] md:leading-[48px] lg:text-[42px] lg:leading-[52px] xl:text-[50px] xl:leading-[60px]"
                  style={fieldCssStyle(content.homeCustomJourneyCtaTitleLine1Style, darkText)}
                >
                  {content.titleLine1}
                  {content.titleHighlight && (
                    <span
                      style={fieldCssStyle(
                        content.homeCustomJourneyCtaTitleHighlightStyle,
                        accentColor
                      )}
                    >
                      {" "}
                      {content.titleHighlight}
                    </span>
                  )}
                </h2>
              )}

              {content.description && (
                <p
                  className="max-w-[514px] text-sm leading-[18px] tracking-[1px] opacity-70 md:text-[15px] md:leading-5 xl:text-base xl:leading-[22px]"
                  style={fieldCssStyle(content.homeCustomJourneyCtaDescriptionStyle, darkText)}
                >
                  {content.description}
                </p>
              )}
            </div>

            {section.buttons?.length ? renderButtons(section.buttons, false, false, true) : null}
          </div>
        </div>

        <div className="flex w-full shrink-0 justify-end lg:w-1/2">
          <ImageShowPreview
            src={image}
            alt={imageAlt}
            className="h-[260px] w-full md:h-[420px] lg:h-[460px] lgx:h-[490px] xl:h-[560px] 2xl:h-[580px]"
            opacity={section.bgImages?.[0]?.opacity ?? 100}
            overlayColor={section.bgImages?.[0]?.overlayColor}
            overlayOpacity={section.bgImages?.[0]?.overlayOpacity}
          />
        </div>
      </div>
    </section>
  )
}
