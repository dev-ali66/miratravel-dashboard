import type { ReactNode } from "react"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import type { HomeSection } from "../../homeTypes"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE = "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"
const PREVIEW_VIDEO_SOURCE = "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beach-1576/1080p.mp4"

export type TravelInsightsPreviewProps = {
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

export function TravelInsightsPreview({
  section,
  accentColor,
  darkText,
  renderButtons,
}: TravelInsightsPreviewProps) {
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
  const imageAlt = backgroundImage?.alt ?? "Balkan Travel Insights"

  return (
    <section
      className="relative w-full overflow-hidden px-7 py-16 md:px-14 md:py-24"
      style={{ backgroundColor: section.bgColor ?? "#FBF9F5", color: darkText }}
    >
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
        fallbackAlt="Travel Insights background"
        fallbackColor={section.bgColor ?? "#FBF9F5"}
        mode="background"
        className="h-full w-full"
        containerClassName="absolute inset-0"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1680px]">
        <div className="flex flex-col items-center justify-center gap-6 md:gap-10 lg:flex-row lg:gap-12 xl:gap-16">
          <div className="relative flex w-full items-center justify-center lg:w-1/2">
            <ImageShowPreview
              src={image}
              alt={imageAlt}
              className="h-[400px] w-full object-cover md:h-[500px] lg:h-[520px] xl:h-[540px]"
              opacity={section.bgImages?.[0]?.opacity ?? 100}
              overlayColor={section.bgImages?.[0]?.overlayColor}
              overlayOpacity={section.bgImages?.[0]?.overlayOpacity}
            />
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-3 md:gap-3.5 lg:w-1/2 xl:gap-4">
            {content.eyebrow && (
              <p
                className="text-xs font-normal uppercase tracking-[1.4px]"
                style={fieldCssStyle(content.homeTravelInsightsEyebrowStyle, accentColor)}
              >
                {content.eyebrow}
              </p>
            )}

            {content.title && (
              <h2
                className="font-serif text-[38px] leading-tight tracking-[-1px] md:text-[52px]"
                style={fieldCssStyle(content.homeTravelInsightsTitleStyle, darkText)}
              >
                {content.title}
              </h2>
            )}

            {content.subtitle && (
              <p
                className="max-w-[600px] text-sm font-normal leading-[22px] text-subtitle md:text-[15px] md:leading-6 xl:text-base xl:leading-[26px]"
                style={fieldCssStyle(content.homeTravelInsightsSubtitleStyle, darkText)}
              >
                {content.subtitle}
              </p>
            )}

            {content.description && (
              <p
                className="max-w-[500px] text-[11px] leading-[1.8] opacity-70"
                style={fieldCssStyle(content.homeTravelInsightsDescriptionStyle, darkText)}
              >
                {content.description}
              </p>
            )}

            <div className="flex w-full flex-col items-start gap-4 py-5 md:gap-5 md:py-6 lg:gap-[22px] xl:gap-6">
              <article className="w-full border-b border-border-neutral pb-5">
                <ImageShowPreview
                  src={image}
                  alt="Explore UNESCO Towns"
                  className="h-44 w-full"
                  opacity={section.bgImages?.[0]?.opacity ?? 100}
                  overlayColor={section.bgImages?.[0]?.overlayColor}
                  overlayOpacity={section.bgImages?.[0]?.overlayOpacity}
                />

                <div className="pt-4">
                  <p className="text-[9px] uppercase tracking-[0.15em]" style={{ color: accentColor }}>
                    Heritage
                  </p>
                  <h3 className="mt-2 font-serif text-[22px] leading-tight">
                    Explore UNESCO Towns: A Journey Through Time
                  </h3>
                  <p className="mt-2 text-[10px] leading-5 opacity-65">
                    Discover the architectural marvels and hidden histories of the Balkans&apos; most preserved medieval settlements.
                  </p>
                </div>
              </article>

              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:gap-6">
                {[
                  ["Stays", "The Art of Balkan Hospitality", "Curated accommodations that define luxury through authenticity."],
                  ["Culture", "Decoding the Stećci", "Mythology of the medieval tombstones and silent narratives."],
                ].map(([tag, title, description]) => (
                  <article key={title} className="group">
                    <ImageShowPreview
                      src={image}
                      alt={title as string}
                      className="aspect-[0.9] w-full"
                      opacity={section.bgImages?.[0]?.opacity ?? 100}
                      overlayColor={section.bgImages?.[0]?.overlayColor}
                      overlayOpacity={section.bgImages?.[0]?.overlayOpacity}
                    />

                    <div className="border-b py-4">
                      <p className="text-[9px] uppercase tracking-[0.15em]" style={{ color: accentColor }}>
                        {tag}
                      </p>

                      <h3 className="mt-2 font-serif text-[19px] leading-tight">{title}</h3>

                      <p className="mt-2 text-[9px] leading-[1.5] opacity-55">{description}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="pt-2">{renderButtons(section.buttons, false, false, true)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
