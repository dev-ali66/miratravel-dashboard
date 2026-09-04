import type { ReactNode } from "react"
import type { HomeSection, HomeStoryItem } from "../../homeTypes"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE = "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"
const PREVIEW_VIDEO_SOURCE = "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beach-1576/1080p.mp4"

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
  const backgroundMultimedia = (content.backgroundMultimedia ?? {}) as Record<string, any>
  const leftSideMultimedia = (content.leftSideMultimedia ?? {}) as Record<string, any>
  const sectionBackgroundImage = section.bgImages?.[0]
  const sectionBackgroundVideo = section.bgVideos?.[0]
  const backgroundType =
    backgroundMultimedia.type ??
    section.backgroundType ??
    (section.showVideo ? "video" : backgroundMultimedia.url || sectionBackgroundImage?.url ? "image" : "color")

  const leftSideType =
    leftSideMultimedia.type ??
    (leftSideMultimedia.url ? "image" : "color")

  const backgroundImageData = backgroundMultimedia.imageData ?? backgroundMultimedia
  const backgroundVideoData = backgroundMultimedia.videoData ?? backgroundMultimedia
  const leftImageData = leftSideMultimedia.imageData ?? leftSideMultimedia
  const leftVideoData = leftSideMultimedia.videoData ?? leftSideMultimedia

  const backgroundImage =
    backgroundType === "image"
      ? (backgroundImageData.url ? backgroundImageData : sectionBackgroundImage)
      : sectionBackgroundImage

  const backgroundVideo =
    backgroundType === "video"
      ? (backgroundVideoData.url ? backgroundVideoData : sectionBackgroundVideo)
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
      className="relative w-full overflow-hidden px-7 py-16 md:px-14 md:py-24"
      style={{
        backgroundColor:
          backgroundType === "color"
            ? (backgroundMultimedia.color ?? section.bgColor ?? "#FBF9F5")
            : (section.bgColor ?? "#FBF9F5"),
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
        fallbackImageSrc={PREVIEW_IMAGE_SOURCE}
        fallbackVideoSrc={PREVIEW_VIDEO_SOURCE}
        fallbackAlt="Mira Stories background"
        fallbackColor={section.bgColor ?? "#FBF9F5"}
        mode="background"
        className="h-full w-full"
        containerClassName="absolute inset-0"
        overlayClassName={shouldShowVideo || shouldShowImage ? "bg-white/70" : undefined}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1336px] flex-col items-center justify-center gap-[38px] lg:flex-row lg:gap-12 xl:gap-16">
        <div className="relative aspect-[776/661] w-full overflow-hidden lg:h-[375px] lg:w-[440px] lg:flex-none lg:aspect-auto lgx:h-[426px] lgx:w-[500px] xl:h-[661px] xl:w-[776px]">
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
            className="h-full w-full"
          />
        </div>

        <div className="flex w-full flex-col items-start lg:flex-1 xl:w-[550px] xl:flex-none">
          <div className="flex w-full flex-col items-start gap-6 md:gap-8 xl:gap-10">
            {content.eyebrow && (
              <p
                className="text-sm font-normal uppercase tracking-[1.5px]"
                style={fieldCssStyle(content.homeMiraStoriesEyebrowStyle, accentColor)}
              >
                {content.eyebrow}
              </p>
            )}

            {content.title && (
              <h2
                className="max-w-[496px] font-serif text-[36px] font-semibold leading-[44px] tracking-[2px] text-card-title md:text-[52px] md:leading-[64px] xl:text-[64px] xl:leading-[80px]"
                style={fieldCssStyle(content.homeMiraStoriesTitleStyle, darkText)}
              >
                {content.title}
              </h2>
            )}

            {content.description && (
              <p
                className="w-full max-w-[550px] text-sm leading-6 text-subtitle md:text-[15px] md:leading-7 xl:text-base xl:leading-[30px]"
                style={fieldCssStyle(content.homeMiraStoriesDescriptionStyle, darkText)}
              >
                {content.description}
              </p>
            )}
          </div>

          <div className="mt-6 flex w-full flex-col gap-4 md:mt-8 md:gap-6 xl:mt-10 xl:gap-8">
            {items.length
              ? items.map((item: HomeStoryItem, index) => {
                  const itemStyle = item as Record<string, any>

                  return (
                  <a
                    key={index}
                    href={item.url || "#"}
                    className="group flex items-start gap-4 transition-opacity hover:opacity-60 md:gap-6 xl:gap-8"
                  >
                    <span
                      className="mt-0.5 text-sm text-muted transition-colors group-hover:text-accent"
                      style={fieldCssStyle(itemStyle.homeMiraStoriesItemIndexStyle, accentColor)}
                    >
                      {item.index || String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex flex-col gap-1">
                      <h3
                        className="font-serif text-base font-medium leading-5 text-card-title transition-colors group-hover:text-primary md:text-[18px] xl:text-[20px]"
                        style={fieldCssStyle(itemStyle.homeMiraStoriesItemTitleStyle, darkText)}
                      >
                        {item.title || "Story title"}
                      </h3>

                      {item.subtitle && (
                        <p
                          className="text-xs leading-[18px] text-muted md:text-[13px] xl:text-sm"
                          style={fieldCssStyle(itemStyle.homeMiraStoriesItemSubtitleStyle, darkText)}
                        >
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </a>
                  )
                })
              : [1, 2, 3, 4].map((item) => (
                  <div key={item} className="group flex items-start gap-4 md:gap-6 xl:gap-8">
                    <span className="mt-0.5 text-sm text-muted" style={{ color: accentColor }}>
                      {String(item).padStart(2, "0")}
                    </span>

                    <div className="flex flex-col gap-1">
                      <h3 className="font-serif text-base font-medium leading-5 text-card-title md:text-[18px] xl:text-[20px]">
                        Story title
                      </h3>

                      <p className="text-xs leading-[18px] text-muted md:text-[13px] xl:text-sm">Story subtitle</p>
                    </div>
                  </div>
                ))}
          </div>

          {renderButtons(section.buttons, false, false, true)}
        </div>
      </div>
    </section>
  )
}
