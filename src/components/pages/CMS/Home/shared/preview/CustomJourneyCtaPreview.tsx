import type { ReactNode } from "react"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import type { HomeSection } from "../../homeTypes"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"

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
  const backgroundMultimedia = (content.backgroundMultimedia ?? {}) as Record<
    string,
    any
  >
  const backgroundImage = section.bgImages?.[0]
  const backgroundVideo = section.bgVideos?.[0]
  const backgroundType =
    backgroundMultimedia.type ??
    section.backgroundType ??
    (section.showVideo
      ? "video"
      : backgroundMultimedia.url || backgroundImage?.url
        ? "image"
        : "color")

  const backgroundImageData =
    backgroundMultimedia.imageData ?? backgroundMultimedia
  const backgroundVideoData =
    backgroundMultimedia.videoData ?? backgroundMultimedia

  const image = backgroundImage?.url ?? PREVIEW_IMAGE_SOURCE
  const imageAlt = backgroundImage?.alt ?? "Let us design your journey"

  return (
    <section
      id="design-journey"
      className="relative w-full pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] xl:pb-[80px] xlg:pb-[75px] lgx:pb-[72px] lg:pb-[70px] md:pb-[65px] pb-[55px] overflow-hidden"
      style={{ backgroundColor: section.bgColor ?? "transparent", color: darkText }}
    >
      <UniversalMultimediaPreview
        multimedia={
          backgroundType === "video"
            ? { ...backgroundVideo, ...backgroundVideoData, type: "video" }
            : backgroundType === "image"
              ? { ...backgroundImage, ...backgroundImageData, type: "image" }
              : { color: backgroundMultimedia.color, type: "color" }
        }
        fallbackAlt="Custom Journey CTA background"
        fallbackColor={section.bgColor ?? "transparent"}
        mode="background"
        className="h-full w-full"
        containerClassName="absolute inset-0"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 mx-auto flex w-full flex-col-reverse items-center justify-between gap-8 xlg:gap-10 xl:gap-12 lg:flex-row lg:items-center">
        <div className="flex w-full flex-1 justify-start lg:justify-end xl:pl-[144px] xlg:pl-[110px] md:pl-[56px] pl-[20px] pr-4 md:pr-8 lg:pr-10 xl:pr-14">
          <div className="flex w-full flex-col items-start gap-8 sm:gap-10 md:gap-12 lg:gap-[56px] xl:gap-[68px] max-w-[638px] xl:max-w-[700px]">
            <div className="flex flex-col items-start gap-5 sm:gap-6">
              {content.titleLine1 && (
                <h2
                  className="font-heading text-[26px] leading-[34px] md:text-[38px] md:leading-[48px] lg:text-[42px] lg:leading-[52px] lgx:text-[45px] lgx:leading-[55px] xlg:text-[48px] xlg:leading-[58px] xl:text-[50px] xl:leading-[60px] font-semibold tracking-[1px]"
                  style={fieldCssStyle(
                    content.homeCustomJourneyCtaTitleLine1Style,
                    darkText
                  )}
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
                  className="max-w-[514px] text-sm md:text-[15px] xl:text-base font-normal leading-[18px] md:leading-[20px] xl:leading-[22px] tracking-[1px] text-subtitle"
                  style={fieldCssStyle(
                    content.homeCustomJourneyCtaDescriptionStyle,
                    darkText
                  )}
                >
                  {content.description}
                </p>
              )}
            </div>

            {section.buttons?.length ? (
              <div className="md:w-[230px] w-full">
                {renderButtons(section.buttons, true, false, true)}
              </div>
            ) : null}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-end shrink-0">
          <ImageShowPreview
            src={image}
            alt={imageAlt}
            className="w-full h-[260px] md:h-[420px] lg:h-[460px] lgx:h-[490px] xlg:h-[520px] xl:h-[560px] 2xl:h-[580px] object-cover"
            opacity={section.bgImages?.[0]?.opacity ?? 100}
            overlayColor={section.bgImages?.[0]?.overlayColor}
            overlayOpacity={section.bgImages?.[0]?.overlayOpacity}
          />
        </div>
      </div>
    </section>
  )
}
