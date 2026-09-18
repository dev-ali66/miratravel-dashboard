import type { ReactNode } from "react"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import type { HomeSection } from "../../homeTypes"
import { fieldCssStyle } from "./fieldStyle"
import { UniversalMultimediaPreview } from "./UniversalMultimediaPreview"

const PREVIEW_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"

const DEFAULT_INSIGHTS = [
  {
    tag: "HERITAGE",
    title: "Explore UNESCO Towns: A Journey Through Time",
    description:
      "Discover the architectural marvels and hidden histories of the Balkans' most preserved medieval settlements.",
    url: "/stories/explore-unesco-towns",
    image:
      "https://images.unsplash.com/photo-1548625361-18da857bbf08?auto=format&fit=crop&w=800&q=80",
  },
  {
    tag: "STAYS",
    title: "The Art of Balkan Hospitality",
    description:
      "Curated accommodations that define luxury through authenticity.",
    url: "/stories/the-art-of-balkan-hospitality",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  },
  {
    tag: "CULTURE",
    title: "Decoding the Stećci",
    description:
      "Mythology of the medieval tombstones and silent narratives.",
    url: "/stories/decoding-the-stecci",
    image:
      "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80",
  },
]

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
  const backgroundMultimedia = (content.backgroundMultimedia ?? {}) as Record<
    string,
    any
  >
  const leftSideMultimedia = (content.leftSideMultimedia ?? {}) as Record<
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
  const leftImageData = leftSideMultimedia.imageData ?? leftSideMultimedia

  const spotlightImage =
    leftImageData.url ?? backgroundImage?.url ?? PREVIEW_IMAGE_SOURCE
  const spotlightAlt = leftImageData.alt ?? "Balkan Travel Insights"

  const displayInsights: any[] =
    section.items && section.items.length > 0
      ? section.items
      : DEFAULT_INSIGHTS

  const featuredInsight: any = displayInsights[0]
  const secondaryInsights: any[] = displayInsights.slice(1, 3)

  return (
    <section
      id="travel-insights"
      className="relative w-full pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] px-4 lg:px-0"
      style={{ color: darkText }}
    >
      <div
        className="w-full flex bg-base-100 flex-col justify-center items-center xl:py-12 lg:py-10 md:py-8 py-7 relative overflow-hidden"
        style={{ backgroundColor: section.bgColor ?? "var(--color-base-100, #ffffff)" }}
      >
        <UniversalMultimediaPreview
          multimedia={
            backgroundType === "video"
              ? { ...backgroundVideo, ...backgroundVideoData, type: "video" }
              : backgroundType === "image"
                ? { ...backgroundImage, ...backgroundImageData, type: "image" }
                : { color: backgroundMultimedia.color, type: "color" }
          }
          fallbackAlt="Travel Insights background"
          fallbackColor={section.bgColor ?? "#ffffff"}
          mode="background"
          className="h-full w-full"
          containerClassName="absolute inset-0"
          overlayClassName="bg-white/70"
        />

        <div className="w-full container relative z-10">
          <div className="flex flex-col lgx:flex-row justify-center items-center gap-6 md:gap-10 lgx:gap-12 xlg:gap-14 xl:gap-16">
            {/* Spotlight Left Image */}
            <div className="w-full lgx:w-1/2 flex items-center justify-center relative">
              <ImageShowPreview
                src={spotlightImage}
                alt={spotlightAlt}
                className="w-full h-[400px] md:h-[500px] lgx:h-[520px] xl:h-[540px] rounded-lg shadow-sm object-cover"
              />
            </div>

            {/* Editorial Right Column */}
            <div className="w-full lgx:w-1/2 flex flex-col justify-start items-start xl:gap-4 gap-3 md:gap-3.5">
              {content.eyebrow && (
                <span
                  className="xl:text-sm md:text-[13px] text-xs leading-4 md:leading-[18px] xl:leading-5 tracking-[1.4px] font-normal uppercase text-accent"
                  style={fieldCssStyle(
                    content.homeTravelInsightsEyebrowStyle,
                    accentColor || "#C5A880"
                  )}
                >
                  {content.eyebrow}
                </span>
              )}

              {content.title && (
                <h2
                  className="font-serif text-[32px] leading-tight font-semibold tracking-[-0.5px] md:text-[42px] xl:text-[48px]"
                  style={fieldCssStyle(
                    content.homeTravelInsightsTitleStyle,
                    darkText
                  )}
                >
                  {content.title}
                </h2>
              )}

              {(content.subtitle || content.description) && (
                <p
                  className="h-auto font-normal text-sm md:text-[15px] xl:text-[16px] leading-[22px] md:leading-[24px] xl:leading-[26px] text-subtitle"
                  style={fieldCssStyle(
                    content.homeTravelInsightsSubtitleStyle ||
                    content.homeTravelInsightsDescriptionStyle,
                    darkText
                  )}
                >
                  {content.subtitle || content.description}
                </p>
              )}

              {/* Insights Content Cards List */}
              <div className="w-full xl:py-8 lg:py-7 md:py-6 py-5 flex flex-col justify-start items-start xl:gap-6 lg:gap-[22px] md:gap-5 gap-4">
                {/* Featured Story (Top) */}
                {featuredInsight && (
                  <div className="w-full">
                    <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-6">
                      <div className="w-full md:w-48 h-36 relative shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={
                            typeof featuredInsight.image === "string"
                              ? featuredInsight.image
                              : featuredInsight.image?.url || PREVIEW_IMAGE_SOURCE
                          }
                          alt={featuredInsight.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 flex-1">
                        <span
                          className="text-[11px] font-semibold tracking-[2px] uppercase"
                          style={{ color: accentColor || "#C5A880" }}
                        >
                          {featuredInsight.tag || "HERITAGE"}
                        </span>
                        <h3 className="font-serif text-lg font-normal leading-snug">
                          {featuredInsight.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {featuredInsight.description}
                        </p>
                        <a
                          href={featuredInsight.url || "#"}
                          className="inline-flex items-center text-xs font-semibold underline underline-offset-4 mt-1 hover:text-accent transition-colors"
                        >
                          Read the Insight
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {secondaryInsights.length > 0 && (
                  <div className="h-[1px] bg-border/60 w-full" />
                )}

                {/* Secondary Stories Grid */}
                {secondaryInsights.length > 0 && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {secondaryInsights.map((insight, idx) => (
                      <div key={idx} className="flex flex-col gap-2 group">
                        <div className="w-full h-36 relative overflow-hidden rounded-md bg-muted">
                          <img
                            src={
                              typeof insight.image === "string"
                                ? insight.image
                                : insight.image?.url || PREVIEW_IMAGE_SOURCE
                            }
                            alt={insight.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span
                          className="text-[10px] font-semibold tracking-[2px] uppercase mt-1"
                          style={{ color: accentColor || "#C5A880" }}
                        >
                          {insight.tag || "STORY"}
                        </span>
                        <h4 className="font-serif text-base font-normal leading-tight group-hover:text-accent transition-colors">
                          {insight.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* View All Stories Button */}
              <div className="pt-2 md:w-[230px] w-full">
                {renderButtons(section.buttons, true, false, true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

