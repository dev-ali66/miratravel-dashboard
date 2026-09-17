import type { ReactNode } from "react"
import type { HomeSection, HomeStoryItem } from "../../homeTypes"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"
const PREVIEW_VIDEO_SOURCE =
  "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beach-1576/1080p.mp4"

export type MiraStoriesPreviewProps = {
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

export function MiraStoriesPreview({
  section,
  accentColor,
  darkText,
  renderButtons,
}: MiraStoriesPreviewProps) {
  const content = (section.content ?? {}) as Record<string, any>
  const backgroundMultimedia = (content.backgroundMultimedia ?? {}) as Record<
    string,
    any
  >
  const leftSideMultimedia = (content.leftSideMultimedia ?? {}) as Record<
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

  const leftSideType =
    leftSideMultimedia.type ?? (leftSideMultimedia.url ? "image" : "color")

  const backgroundImageData =
    backgroundMultimedia.imageData ?? backgroundMultimedia
  const backgroundVideoData =
    backgroundMultimedia.videoData ?? backgroundMultimedia
  const leftImageData = leftSideMultimedia.imageData ?? leftSideMultimedia
  const leftVideoData = leftSideMultimedia.videoData ?? leftSideMultimedia

  const backgroundImage =
    backgroundType === "image"
      ? backgroundImageData.url
        ? backgroundImageData
        : sectionBackgroundImage
      : sectionBackgroundImage

  const backgroundVideo =
    backgroundType === "video"
      ? backgroundVideoData.url
        ? backgroundVideoData
        : sectionBackgroundVideo
      : sectionBackgroundVideo

  const shouldShowVideo = backgroundType === "video"
  const shouldShowImage = backgroundType === "image"
  const shouldShowLeftVideo = leftSideType === "video"
  const shouldShowLeftImage = leftSideType === "image"

  const items = section.items ?? []
  const image = leftImageData.url ?? PREVIEW_IMAGE_SOURCE
  const imageAlt = leftImageData.alt ?? "Mira Stories editorial"

  return (
    <section
      id="stories"
      className="relative w-full overflow-hidden container mx-auto pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px] px-4 lg:px-0"
      style={{
        backgroundColor:
          backgroundType === "color"
            ? (backgroundMultimedia.color ?? section.bgColor ?? "transparent")
            : (section.bgColor ?? "transparent"),
        color: darkText,
      }}
    >
      <UniversalMultimediaPreview
        multimedia={
          backgroundType === "video"
            ? { ...backgroundVideo, type: "video" }
            : backgroundType === "image"
              ? { ...backgroundImage, type: "image" }
              : { color: backgroundMultimedia.color, type: "color" }
        }
        fallbackAlt="Mira Stories background"
        fallbackColor={section.bgColor ?? "transparent"}
        mode="background"
        className="h-full w-full"
        containerClassName="absolute inset-0"
        overlayClassName={
          shouldShowVideo || shouldShowImage ? "bg-white/70" : undefined
        }
      />

      <div className="mx-auto flex w-full max-w-[1336px] xl:px-8 lg:px-6 px-0 flex-col items-center justify-center lg:items-center gap-[38px] md:gap-[50px] lg:gap-[48px] lgx:gap-[56px] xl:gap-[64px] lg:flex-row relative z-10">
        <div className="w-full aspect-[776/661] lg:w-[440px] lg:h-[375px] lgx:w-[500px] lgx:h-[426px] xlg:w-[580px] xlg:h-[494px] xl:w-[776px] xl:h-[661px] overflow-hidden shrink-0">
          <UniversalMultimediaPreview
            multimedia={
              shouldShowLeftVideo
                ? { ...leftVideoData, type: "video" }
                : shouldShowLeftImage
                  ? { ...leftImageData, type: "image" }
                  : { color: leftSideMultimedia.color, type: "color" }
            }
            fallbackImageSrc={image}
            fallbackVideoSrc={PREVIEW_VIDEO_SOURCE}
            fallbackAlt={imageAlt}
            fallbackColor="#E5E7EB"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex w-full flex-col items-start lg:flex-1 xl:w-[550px] xl:flex-none">
          <div className="flex w-full flex-col items-start xl:gap-10 lgx:gap-9 md:gap-8 gap-6">
            {content.eyebrow && (
              <p
                className="text-sm md:text-[15px] font-normal xl:leading-4 leading-3 tracking-[1.5px] md:tracking-[2px] xl:tracking-[2.4px] uppercase"
                style={fieldCssStyle(
                  content.homeMiraStoriesEyebrowStyle,
                  accentColor
                )}
              >
                {content.eyebrow}
              </p>
            )}

            {content.title && (
              <h2
                className="font-heading max-w-[496px] font-semibold text-card-title tracking-[2px] md:tracking-[3px] xl:tracking-[4px] text-[36px] md:text-[52px] lgx:text-[56px] xl:text-[64px] leading-[44px] md:leading-[64px] lgx:leading-[70px] xl:leading-[80px] self-stretch"
                style={fieldCssStyle(
                  content.homeMiraStoriesTitleStyle,
                  darkText
                )}
              >
                {content.title}
              </h2>
            )}

            {content.description && (
              <p
                className="w-full text-sm sm:text-[15px] font-normal leading-[24px] sm:leading-[26px] md:leading-[28px] xl:leading-[30px] text-subtitle max-w-[550px]"
                style={fieldCssStyle(
                  content.homeMiraStoriesDescriptionStyle,
                  darkText
                )}
              >
                {content.description}
              </p>
            )}
          </div>

          <div className="flex w-full flex-col gap-4 md:gap-6 lgx:gap-7 xl:gap-8 xl:mt-10 lgx:mt-9 md:mt-8 mt-6">
            {items.length
              ? items.map((item: HomeStoryItem, index) => {
                  const itemStyle = item as Record<string, any>

                  return (
                    <a
                      key={index}
                      href={item.url || "#"}
                      className="group flex items-start gap-4 md:gap-6 lgx:gap-7 xl:gap-8 transition-opacity hover:opacity-80"
                    >
                      <span
                        className="mt-0.5 text-sm font-normal leading-5 tracking-wide text-muted transition-colors group-hover:text-accent"
                        style={fieldCssStyle(
                          itemStyle.homeMiraStoriesItemIndexStyle,
                          accentColor
                        )}
                      >
                        {item.index || String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="flex flex-col gap-1 gap-[5px] xl:gap-1.5">
                        <h3
                          className="font-heading text-base md:text-[18px] xl:text-[20px] font-medium leading-5 md:leading-6 xl:leading-7 text-card-title transition-colors group-hover:text-primary"
                          style={fieldCssStyle(
                            itemStyle.homeMiraStoriesItemTitleStyle,
                            darkText
                          )}
                        >
                          {item.title || "Story title"}
                        </h3>

                        {item.subtitle && (
                          <p
                            className="text-xs md:text-[13px] xl:text-sm font-normal xl:leading-5 leading-[18px] text-muted"
                            style={fieldCssStyle(
                              itemStyle.homeMiraStoriesItemSubtitleStyle,
                              darkText
                            )}
                          >
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </a>
                  )
                })
              : [1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="group flex items-start gap-4 md:gap-6 lgx:gap-7 xl:gap-8"
                  >
                    <span
                      className="mt-0.5 text-sm font-normal leading-5 tracking-wide text-muted"
                      style={{ color: accentColor }}
                    >
                      {String(item).padStart(2, "0")}
                    </span>

                    <div className="flex flex-col gap-1 gap-[5px] xl:gap-1.5">
                      <h3 className="font-heading text-base md:text-[18px] xl:text-[20px] font-medium leading-5 md:leading-6 xl:leading-7 text-card-title">
                        Story title
                      </h3>

                      <p className="text-xs md:text-[13px] xl:text-sm font-normal xl:leading-5 leading-[18px] text-muted">
                        Story subtitle
                      </p>
                    </div>
                  </div>
                ))}
          </div>

          <div className="w-full md:w-auto xl:mt-10 lgx:mt-9 md:mt-8 mt-6">
            <div className="w-full md:w-[280px]">
              {renderButtons(section.buttons, true, false, true)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
