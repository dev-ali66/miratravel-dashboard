import type { ReactNode } from "react"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import type { HomeSection } from "../../homeTypes"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"

export type ExploreJourneysPreviewProps = {
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

export function ExploreJourneysPreview({
  section,
  accentColor,
  darkText,
  renderButtons,
}: ExploreJourneysPreviewProps) {
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

  return (
    <section
      id="journeys"
      className="relative w-full overflow-hidden container px-4 lg:px-0 pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"
      style={{
        backgroundColor: section.bgColor ?? "transparent",
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
        fallbackAlt="Explore Journeys background"
        fallbackColor={section.bgColor ?? "transparent"}
        mode="background"
        className="h-full w-full"
        containerClassName="absolute inset-0"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 mx-auto flex w-full flex-col gap-14">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="flex flex-col items-start gap-4">
            {content.eyebrow && (
              <p
                className="text-[10px] font-semibold tracking-[0.18em] uppercase"
                style={fieldCssStyle(
                  content.homeExploreJourneysEyebrowStyle,
                  accentColor
                )}
              >
                {content.eyebrow}
              </p>
            )}

            {content.title && (
              <h2
                className="max-w-[700px] font-serif text-[24px] leading-[24px] md:text-[28px] md:leading-[28px] lg:text-[30px] lg:leading-[30px] lgx:text-[34px] lgx:leading-[34px] mid:text-[36px] mid:leading-[36px] xlg:text-[38px] xlg:leading-[38px] xl:text-[40px] xl:leading-[40px]"
                style={fieldCssStyle(
                  content.homeExploreJourneysTitleStyle,
                  darkText
                )}
              >
                {content.title}
              </h2>
            )}

            {content.subtitle && (
              <p
                className="text-sm font-normal text-muted"
                style={fieldCssStyle(
                  content.homeExploreJourneysSubtitleStyle,
                  darkText
                )}
              >
                {content.subtitle}
              </p>
            )}
          </div>

          {content.description && (
            <p
              className="xlg:max-w-[558px] max-w-[500px] text-sm font-normal leading-8 text-muted"
              style={fieldCssStyle(
                content.homeExploreJourneysDescriptionStyle,
                darkText
              )}
            >
              {content.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lgx:gap-6 xlg:gap-7 xl:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="group border-border-muted/40 relative flex w-full flex-col overflow-hidden rounded-[8px] border bg-neutral-100"
            >
              <div className="lgx:h-[413px] relative h-[280px] w-full shrink-0 overflow-hidden rounded-sm md:h-[380px]">
                <div className="relative h-full w-full overflow-hidden bg-muted">
                  <ImageShowPreview
                    src={PREVIEW_IMAGE_SOURCE}
                    alt="Preview journey"
                    className="h-full w-full"
                  />
                </div>

                <div
                  className="absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.08em] uppercase"
                  style={{
                    backgroundColor: "#FEF3C7",
                    color: "#9A3412",
                  }}
                >
                  Journey
                </div>

                <div className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-transparent bg-neutral-100 text-sm shadow-sm">
                  ♡
                </div>

                <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-white uppercase">
                  7 days
                </div>
              </div>

              <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
                <h3 className="font-serif text-[21px] leading-tight text-secondary">
                  Ancient Albania
                </h3>

                <p className="text-subtitle mt-2 text-xs leading-5">
                  A slow journey through mountain villages, old stone towns, and
                  the Adriatic coast.
                </p>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {["History", "Culture", "Coast"].map((tag) => (
                      <span
                        key={tag}
                        className="border-border-light text-subtitle rounded-[38px] border px-2 py-1 text-[8px] tracking-[0.08em] uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span
                    className="shrink-0 text-[11px] font-semibold"
                    style={{ color: accentColor }}
                  >
                    From $1,890 ↗
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full justify-center">
          <div className="w-full md:w-[230px]">
            {renderButtons(section.buttons, true, false, true)}
          </div>
        </div>
      </div>
    </section>
  )
}
