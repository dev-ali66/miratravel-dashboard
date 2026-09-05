import type { ReactNode } from "react"
import type { HomeSection } from "../../homeTypes"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"
const PREVIEW_VIDEO_SOURCE =
  "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beach-1576/1080p.mp4"

export type WhyMiraPreviewProps = {
  section: HomeSection
  accentColor: string
  primaryColor: string
  lightText: string
  renderButtons?: (
    buttons?: any[],
    fullWidth?: boolean,
    alignRight?: boolean,
    mainButtonWidth?: boolean
  ) => ReactNode
}

export function WhyMiraPreview({
  section,
  accentColor,
  primaryColor,
  lightText,
}: WhyMiraPreviewProps) {
  const content = (section.content ?? {}) as Record<string, any>
  const backgroundMultimedia = (content.backgroundMultimedia ?? {}) as Record<
    string,
    any
  >
  const rightSideMultimedia = (content.rightSideMultimedia ?? {}) as Record<
    string,
    any
  >
  const sectionBackgroundImage = section.bgImages?.[0]
  const backgroundType =
    backgroundMultimedia.type ??
    section.backgroundType ??
    (section.showVideo
      ? "video"
      : backgroundMultimedia.url || sectionBackgroundImage?.url
        ? "image"
        : "color")

  const shouldShowVideo = backgroundType === "video"
  const shouldShowImage = backgroundType === "image"

  const rightSectionType =
    rightSideMultimedia.type ?? (rightSideMultimedia.url ? "image" : "color")

  const backgroundImageData =
    backgroundMultimedia.imageData ?? backgroundMultimedia
  const backgroundVideoData =
    backgroundMultimedia.videoData ?? backgroundMultimedia
  const rightImageData = rightSideMultimedia.imageData ?? rightSideMultimedia
  const rightVideoData = rightSideMultimedia.videoData ?? rightSideMultimedia

  const image = rightImageData.url ? rightImageData : section.sideImages?.[0]
  const paragraphs = content.paragraphs ?? []
  const whyMiraImage = image?.url || PREVIEW_IMAGE_SOURCE

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor:
          backgroundType === "color"
            ? (backgroundMultimedia.color ?? section.bgColor ?? primaryColor)
            : (section.bgColor ?? primaryColor),
        color: lightText,
      }}
    >
      <UniversalMultimediaPreview
        multimedia={
          backgroundType === "video"
            ? { ...backgroundVideoData, type: "video" }
            : backgroundType === "image"
              ? { ...backgroundImageData, type: "image" }
              : { color: backgroundMultimedia.color, type: "color" }
        }
        fallbackImageSrc={PREVIEW_IMAGE_SOURCE}
        fallbackVideoSrc={PREVIEW_VIDEO_SOURCE}
        fallbackAlt="Why MIRA background"
        fallbackColor={section.bgColor ?? primaryColor}
        mode="background"
        className="h-full w-full"
        containerClassName="absolute inset-0"
        overlayClassName={
          shouldShowVideo || shouldShowImage ? "bg-black/35" : undefined
        }
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-col items-start gap-12 px-7 py-16 md:px-14 md:py-24 lg:flex-row lg:items-center lg:gap-[70px] xl:gap-24">
        <div className="flex w-full flex-col items-start lg:flex-1">
          <div className="flex w-full max-w-[760px] flex-col gap-9 md:gap-10 xl:gap-[47px]">
            {content.eyebrow && (
              <p
                className="text-[18px] font-medium tracking-[1.4px] uppercase"
                style={fieldCssStyle(
                  content.homeWhyMiraEyebrowStyle,
                  accentColor
                )}
              >
                {content.eyebrow}
              </p>
            )}

            {content.title && (
              <h2
                className="font-serif text-[32px] leading-[44px] font-normal tracking-[2px] text-white sm:text-[38px] sm:leading-[52px] md:text-[44px] md:leading-[58px] xl:text-[48px] xl:leading-[64px]"
                style={fieldCssStyle(content.homeWhyMiraTitleStyle, lightText)}
              >
                {content.title}
              </h2>
            )}

            <div className="lgx:gap-10 flex flex-col gap-8 md:gap-9 xl:gap-11">
              {paragraphs.length ? (
                paragraphs.map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="text-justify text-sm leading-[30px] font-normal tracking-[1.2px] md:text-[15px] md:leading-[34px] md:tracking-[1.6px] xl:leading-[37px] xl:tracking-[2px]"
                    style={fieldCssStyle(
                      content[`homeWhyMiraParagraph${index + 1}Style`],
                      "rgba(255,255,255,0.76)"
                    )}
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-justify text-sm leading-[30px] opacity-75 md:text-[15px] md:leading-[34px]">
                    Your story content will appear here.
                  </p>
                  <p className="text-justify text-sm leading-[30px] opacity-75 md:text-[15px] md:leading-[34px]">
                    This preview keeps the visual layout while the actual API
                    content is loaded dynamically.
                  </p>
                </>
              )}
            </div>

            {content.signature && (
              <p
                className="font-serif text-sm tracking-[1.4px] md:text-[15px]"
                style={fieldCssStyle(
                  content.homeWhyMiraSignatureStyle,
                  accentColor
                )}
              >
                {content.signature}
              </p>
            )}
          </div>
        </div>

        <div className="relative aspect-square w-full overflow-hidden lg:w-[500px] lg:flex-none xl:h-[713px] xl:w-[713px]">
          <UniversalMultimediaPreview
            multimedia={
              rightSectionType === "video"
                ? { ...rightVideoData, type: "video" }
                : rightSectionType === "image"
                  ? { ...rightImageData, type: "image" }
                  : { color: rightSideMultimedia.color, type: "color" }
            }
            fallbackImageSrc={whyMiraImage}
            fallbackVideoSrc={PREVIEW_VIDEO_SOURCE}
            fallbackAlt={image?.alt ?? "MIRA curated Balkan journey"}
            fallbackColor="#D1D5DB"
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  )
}
