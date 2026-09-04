import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import type { HomeSection } from "../../homeTypes"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE = "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"
const PREVIEW_VIDEO_SOURCE = "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beach-1576/1080p.mp4"

export type DestinationsPreviewProps = {
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

export function DestinationsPreview({
  section,
  accentColor,
  darkText,
  renderButtons,
}: DestinationsPreviewProps) {
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

  const DummyImage = ({ className = "" }: { className?: string }) => (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      <ImageShowPreview src={PREVIEW_IMAGE_SOURCE} alt="Preview journey" className="h-full w-full" />
    </div>
  )

  return (
    <section
      className="relative w-full overflow-hidden px-7 py-16 md:px-14 md:py-24"
      style={{
        backgroundColor: section.bgColor ?? "#FBF9F5",
        color: darkText,
      }}
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
        fallbackAlt="Destinations background"
        fallbackColor={section.bgColor ?? "#FBF9F5"}
        mode="background"
        className="h-full w-full"
        containerClassName="absolute inset-0"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 mx-auto flex w-full flex-col items-center gap-14">
        <div className="flex flex-col items-center gap-4 text-center">
          {content.eyebrow && (
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={fieldCssStyle(content.homeDestinationEyebrowStyle, accentColor)}
            >
              {content.eyebrow}
            </p>
          )}

          {content.title && (
            <h2
              className="max-w-[900px] font-serif text-[32px] leading-tight tracking-[-1px] md:text-[52px]"
              style={fieldCssStyle(content.homeDestinationTitleStyle, darkText)}
            >
              {content.title}
            </h2>
          )}

          {content.subtitle && (
            <p
              className="max-w-[700px] text-[12px] leading-[1.7] opacity-70 md:text-sm"
              style={fieldCssStyle(content.homeDestinationSubtitleStyle, darkText)}
            >
              {content.subtitle}
            </p>
          )}
        </div>

        <div className="grid w-full grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Croatia",
            "Bosnia & Herzegovina",
            "Albania",
          ].map((name) => (
            <div
              key={name}
              className="group flex w-full flex-col gap-8 rounded-[2px] border border-border-muted/40 bg-neutral-100 p-4 md:gap-9 md:p-[18px] xl:gap-10 xl:p-6"
            >
              <div className="relative h-[300px] w-full overflow-hidden rounded-[2px] md:h-[320px] lgx:h-[360px] xl:h-[394px]">
                <DummyImage className="h-full w-full" />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-[21px] text-primary md:text-[22px] xl:text-[24px]">
                    {name}
                  </h3>

                  <ArrowUpRight className="h-5 w-5 shrink-0 text-accent" />
                </div>

                <p className="text-sm leading-[21px] text-subtitle md:text-[15px]">
                  {name === "Croatia"
                    ? "Adriatic coast, historic cities, island hopping..."
                    : name === "Albania"
                      ? "Riviera beaches, ancient ruins, mountain trails..."
                      : "A destination where East meets West in the heart of the Balkans."}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full justify-center">{renderButtons(section.buttons, false, false, true)}</div>
      </div>
    </section>
  )
}
