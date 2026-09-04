import type { HomeSection } from "../../homeTypes"
import type { ReactNode } from "react"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE = "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"
const PREVIEW_VIDEO_SOURCE = "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beach-1576/1080p.mp4"

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

export function HeroPreview({ section, accentColor, lightText, renderButtons }: HeroPreviewProps) {
  const content = (section.content ?? {}) as Record<string, any>
  const textColors = content.textColors ?? {}
  const backgroundMultimedia = (content.backgroundMultimedia ?? {}) as Record<string, any>
  const sectionBackgroundImage = section.bgImages?.[0]
  const sectionBackgroundVideo = section.bgVideos?.[0]
  const backgroundType =
    backgroundMultimedia.type ??
    section.backgroundType ??
    (section.showVideo ? "video" : backgroundMultimedia.url || sectionBackgroundImage?.url ? "image" : "color")

  const backgroundImageData = backgroundMultimedia.imageData ?? backgroundMultimedia
  const backgroundVideoData = backgroundMultimedia.videoData ?? backgroundMultimedia

  return (
    <section
      className="relative min-h-[560px] w-full overflow-hidden md:min-h-[680px]"
      style={{ backgroundColor: section.bgColor ?? "#0F2A2E" }}
    >
      <UniversalMultimediaPreview
        multimedia={
          backgroundType === "video"
            ? { ...sectionBackgroundVideo, ...backgroundVideoData, type: "video" }
            : backgroundType === "image"
              ? { ...sectionBackgroundImage, ...backgroundImageData, type: "image" }
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
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      <div
        className="relative z-10 flex min-h-[560px] items-end px-7 pb-12 md:min-h-[680px] md:px-14 md:pb-16"
        style={{ color: lightText }}
      >
        <div className="max-w-[680px]">
          {(content.titleLine1 || content.titleHighlight || content.titleLine2) && (
            <h1
              className="font-serif text-[40px] font-medium leading-[0.94] tracking-[-1.5px] md:text-[60px] lg:text-[72px]"
            >
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
                      style={fieldCssStyle(
                        content.homeHeroTitleHighlightStyle ?? content.titleHighlightStyle,
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
                          content.homeHeroTitleLine2Style ?? content.titleLine2Style,
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
              className="mt-6 max-w-[520px] text-[11px] leading-[1.75] md:text-[12px]"
              style={fieldCssStyle(
                content.homeHeroDescriptionStyle ?? content.descriptionStyle,
                textColors.description ?? "rgba(255,255,255,0.82)"
              )}
            >
              {content.description}
            </p>
          )}

          {renderButtons(section.buttons, false, false, true)}
        </div>
      </div>
    </section>
  )
}
