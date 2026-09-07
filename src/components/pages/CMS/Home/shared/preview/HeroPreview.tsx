import type { HomeSection } from "../../homeTypes"
import type { ReactNode } from "react"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"
const PREVIEW_VIDEO_SOURCE =
  "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beach-1576/1080p.mp4"

export type HeroPreviewProps = {
  section: HomeSection
  accentColor: string
  lightText: string
  renderButtons: (
    buttons?: any[],
    fullWidth?: boolean,
    alignRight?: boolean,
    mainButtonWidth?: boolean
  ) => ReactNode
}

export function HeroPreview({
  section,
  accentColor,
  lightText,
  renderButtons,
}: HeroPreviewProps) {
  const content = (section.content ?? {}) as Record<string, any>
  const textColors = content.textColors ?? {}
  const backgroundMultimedia = (content.backgroundMultimedia ?? {}) as Record<
    string,
    any
  >
  const sectionBackgroundImage = section.bgImages?.[0]
  const sectionBackgroundVideo = section.bgVideos?.[0]
  const backgroundType =
    backgroundMultimedia.type ??
    section.backgroundType ??
    (section.showVideo
      ? "video"
      : backgroundMultimedia.url || sectionBackgroundImage?.url
        ? "image"
        : "color")

  const backgroundImageData =
    backgroundMultimedia.imageData ?? backgroundMultimedia
  const backgroundVideoData =
    backgroundMultimedia.videoData ?? backgroundMultimedia

  return (
    <section
      className="relative xl:h-[1086px] lg:h-[1000px] md:h-[900px] h-[700px] w-full overflow-hidden"
      style={{ backgroundColor: section.bgColor ?? "#0F2A2E" }}
    >
      <UniversalMultimediaPreview
        multimedia={
          backgroundType === "video"
            ? {
                ...sectionBackgroundVideo,
                ...backgroundVideoData,
                type: "video",
              }
            : backgroundType === "image"
              ? {
                  ...sectionBackgroundImage,
                  ...backgroundImageData,
                  type: "image",
                }
              : { color: backgroundMultimedia.color, type: "color" }
        }
        fallbackImageSrc={PREVIEW_IMAGE_SOURCE}
        fallbackVideoSrc={PREVIEW_VIDEO_SOURCE}
        fallbackAlt="Hero background"
        fallbackColor={section.bgColor ?? "#0F2A2E"}
        mode="background"
        className="h-full w-full"
        containerClassName="absolute inset-0"
      />

      <div
        className="absolute inset-0 bg-black/40"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      <div
        className="relative z-10 flex h-full w-full items-center"
        style={{ color: lightText }}
      >
        <div className="flex w-full xl:max-w-[1206px] flex-col items-start xl:pl-[136px] mid:pl-[120px] lgx:pl-[110px] lg:pl-[86px] md:pl-[36px] pl-[20px] pr-5">
          {(content.titleLine1 ||
            content.titleHighlight ||
            content.titleLine2) && (
            <h1 className="font-heading xl:text-[72px] mid:text-[68px] lgx:text-[64px] lg:text-[60px] md:text-[52px] text-[32px] font-[600] capitalize xl:leading-[92px] mid:leading-[88px] lgx:leading-[84px] lg:leading-[80px] md:leading-[66px] leading-[42px] text-neutral-100 xl:mb-12 mid:mb-10 lgx:mb-9 lg:mb-8 md:mb-7 mb-6">
              {content.titleLine1 && (
                <span
                  className="block"
                  style={fieldCssStyle(
                    content.homeHeroTitleStyle ?? content.titleLine1Style,
                    textColors.titleLine1 ?? lightText
                  )}
                >
                  {content.titleLine1}
                </span>
              )}

              {(content.titleHighlight || content.titleLine2) && (
                <span className="block">
                  {content.titleHighlight && (
                    <span
                      className="text-highlight"
                      style={fieldCssStyle(
                        content.homeHeroTitleHighlightStyle ??
                          content.titleHighlightStyle,
                        textColors.titleHighlight ?? accentColor
                      )}
                    >
                      {content.titleHighlight}
                    </span>
                  )}

                  {content.titleLine2 && (
                    <>
                      {content.titleHighlight ? " " : ""}
                      <span
                        style={fieldCssStyle(
                          content.homeHeroTitleLine2Style ??
                            content.titleLine2Style,
                          textColors.titleLine2 ?? lightText
                        )}
                      >
                        {content.titleLine2}
                      </span>
                    </>
                  )}
                </span>
              )}
            </h1>
          )}

          {content.description && (
            <p
              className="max-w-[839px] xl:text-xl mid:text-[22px] lgx:text-[20px] lg:text-[18px] md:text-base text-[15px] font-normal xl:leading-[38px] mid:leading-[34px] lg:leading-[30px] lgx:leading-[28px] md:leading-[26px] leading-[22px] xl:tracking-[1.44px] mid:tracking-[1.34px] lgx:tracking-[1.24px] lg:tracking-[1.14px] md:tracking-[1.04px] tracking-[0.94px] text-neutral-100 xl:mb-[80px] mid:mb-[75px] lgx:mb-[70px] lg:mb-[65px] md:mb-[60px] mb-[55px]"
              style={fieldCssStyle(
                content.homeHeroDescriptionStyle ?? content.descriptionStyle,
                textColors.description ?? "rgba(255,255,255,0.92)"
              )}
            >
              {content.description}
            </p>
          )}

          <div className="w-full md:w-[230px]">
            {renderButtons(section.buttons, true, false, true)}
          </div>
        </div>
      </div>
    </section>
  )
}
