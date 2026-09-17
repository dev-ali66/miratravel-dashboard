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
  const paragraphs = content.paragraphs ?? [
    "MIRA exists as a quiet force behind the region's most curated journeys. We are rooted in the authentic Balkan heritage, believing that true exploration requires a deep, editorial understanding of the land's silent narratives. Every expedition is a private monograph, meticulously designed to bridge the gap between contemporary luxury and the raw, untethered spirit of the frontier.",
    "MIRA exists as a quiet force behind the region's most curated journeys. We are rooted in the authentic Balkan heritage, believing that true exploration requires a deep, editorial understanding of the land's silent narratives. Every expedition is a private monograph, meticulously designed to bridge the gap between contemporary luxury and the raw, untethered spirit of the frontier."
  ]
  const whyMiraImage = image?.url || PREVIEW_IMAGE_SOURCE

  return (
    <section
      id="why-mira"
      className="relative w-full overflow-hidden pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"
      style={{
        backgroundColor:
          backgroundType === "color"
            ? (backgroundMultimedia.color ?? section.bgColor ?? primaryColor ?? "#1F3A1B")
            : (section.bgColor ?? primaryColor ?? "#1F3A1B"),
        color: lightText || "#ffffff",
      }}
    >
      {/* Background Media (Video/Image/Color) */}
      <UniversalMultimediaPreview
        multimedia={
          backgroundType === "video"
            ? { ...backgroundVideoData, type: "video" }
            : backgroundType === "image"
              ? { ...backgroundImageData, type: "image" }
              : { color: backgroundMultimedia.color ?? section.bgColor ?? primaryColor ?? "#1F3A1B", type: "color" }
        }
        fallbackAlt="Why MIRA background"
        fallbackColor={section.bgColor ?? primaryColor ?? "#1F3A1B"}
        mode="background"
        className="h-full w-full"
        containerClassName="absolute inset-0"
        overlayClassName={
          shouldShowVideo || shouldShowImage ? "bg-black/35" : undefined
        }
      />

      {/* Main Container — 100% Match with Frontend WhyMira */}
      <div className="container px-4 lg:px-0 mx-auto flex w-full flex-col items-start lgx:flex-row lgx:items-center xl:gap-[96px] mid:gap-20 md:gap-[60px] gap-12 relative z-10">
        {/* Left Column: Text & Editorial Paragraphs */}
        <div className="flex flex-col xl:gap-[47px] xlg:gap-11 md:gap-8 gap-6 lg:flex-1">
          {/* Eyebrow */}
          <span
            className="xl:text-xl md:text-[20px] text-[18px] font-medium xl:leading-[20px] lgx:leading-[19px] md:leading-[18px] leading-4 tracking-[1.4px] uppercase text-[#ff7747]"
            style={fieldCssStyle(
              content.homeWhyMiraEyebrowStyle,
              accentColor || "#ff7747"
            )}
          >
            {content.eyebrow || "Why MIRA"}
          </span>

          {/* Title */}
          <h2
            className="font-heading font-normal text-neutral-100 tracking-[2px] text-[32px] leading-[44px] md:text-[40px] md:leading-[58px] xl:text-[48px] xl:leading-[64px]"
            style={fieldCssStyle(content.homeWhyMiraTitleStyle, lightText || "#ffffff")}
          >
            {content.title || "Travel, shaped by insight. Refined through experience."}
          </h2>

          {/* Paragraphs List */}
          <div className="flex flex-col gap-6 md:gap-8 xlg:gap-10 xl:gap-11">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph: string, index: number) => (
                <p
                  key={index}
                  className="self-stretch text-justify text-sm md:text-[15px] lg:text-base font-normal leading-[30px] md:leading-[34px] xl:leading-[37px] tracking-[1.2px] md:tracking-[1.6px] lg:tracking-[2px] text-neutral-100"
                  style={fieldCssStyle(
                    content[`homeWhyMiraParagraph${index + 1}Style`],
                    "rgba(255,255,255,0.95)"
                  )}
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="self-stretch text-justify text-sm md:text-[15px] lg:text-base font-normal leading-[30px] text-neutral-100/80">
                Your Why MIRA paragraphs will appear here.
              </p>
            )}

            {/* Signature */}
            <span
              className="self-stretch font-heading text-sm md:text-[15px] xl:text-base font-normal leading-5 md:leading-[22px] tracking-[1.4px] text-[#ff7747]"
              style={fieldCssStyle(
                content.homeWhyMiraSignatureStyle,
                accentColor || "#ff7747"
              )}
            >
              {content.signature || "— MIRA"}
            </span>
          </div>
        </div>

        {/* Right Column: Square Aspect Image */}
        <div className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] w-full aspect-square mx-auto lg:mx-0 lgx:w-[500px] lgx:h-[500px] xlg:w-[560px] xlg:h-[560px] xl:w-[713px] xl:h-[713px] overflow-hidden rounded-xs shrink-0 cursor-pointer">
          <UniversalMultimediaPreview
            multimedia={
              rightSectionType === "video"
                ? { ...rightVideoData, type: "video" }
                : rightSectionType === "image"
                  ? { ...rightImageData, type: "image", url: whyMiraImage }
                  : { color: rightSideMultimedia.color, type: "color" }
            }
            fallbackImageSrc={whyMiraImage}
            fallbackVideoSrc={PREVIEW_VIDEO_SOURCE}
            fallbackAlt={image?.alt ?? "MIRA curated Balkan journey"}
            fallbackColor="#D1D5DB"
            className="h-full w-full object-cover"
            containerClassName="h-full w-full"
          />
        </div>
      </div>
    </section>
  )
}
