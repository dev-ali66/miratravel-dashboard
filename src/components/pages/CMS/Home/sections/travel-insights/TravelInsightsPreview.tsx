import type { ReactNode } from "react"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import type { HomeSection } from "../../homeTypes"
import { UniversalMultimediaPreview } from "../../shared/preview/UniversalMultimediaPreview"
import { DynamicStyledPreview } from "@/components/shared/DynamicStyledPreview"

const DEFAULT_INSIGHTS = [
  {
    tag: "FEATURED",
    title: "The Balkans, Seen from Within",
    description:
      "A collection of stories that move past the postcard — through villages, conversations, and centuries.",
    url: "/stories/the-balkans-seen-from-within",
    image: "",
  },
  {
    tag: "STAYS",
    title: "The Balkans, Seen from Within",
    description:
      "A collection of stories that move past the postcard — through villages, conversations, and centuries.",
    url: "/stories/the-balkans-seen-from-within-2",
    image: "",
  },
  {
    tag: "CULTURE",
    title: "The Balkans, Seen from Within",
    description:
      "A collection of stories that move past the postcard — through villages, conversations, and centuries.",
    url: "/stories/the-balkans-seen-from-within-3",
    image: "",
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
  const backgroundMultimedia = (section as any).backgroundMultimedia || content.backgroundMultimedia || (section as any).multimedia
  const leftSideMultimedia = (section as any).leftSideMultimedia || content.leftSideMultimedia || (content as any).leftSideMedia

  const rawList = content.insightsList || section.items || DEFAULT_INSIGHTS
  const insightsList = Array.isArray(rawList) && rawList.length > 0 ? rawList : DEFAULT_INSIGHTS

  const featuredInsight = insightsList[0]
  const secondaryInsights = insightsList.slice(1, 3)

  const eyebrow = (section as any).eyebrow ?? content.eyebrow
  const titleObj = (section as any).title ?? content.title
  const subtitle = (section as any).subtitle ?? content.subtitle ?? (section as any).description ?? content.description

  const titleValue = typeof titleObj === "string" ? titleObj : titleObj?.value || "Travel Insights"

  // Split title into "Travel" and "Insights" if possible for accent styling
  let mainTitlePart = titleValue
  let accentTitlePart = ""
  if (titleValue.toLowerCase().includes("travel insights")) {
    mainTitlePart = "Travel"
    accentTitlePart = "Insights"
  } else {
    const parts = titleValue.split(" ")
    if (parts.length > 1) {
      mainTitlePart = parts.slice(0, parts.length - 1).join(" ")
      accentTitlePart = parts[parts.length - 1]
    }
  }

  return (
    <section
      id="travel-insights"
      className="relative w-full overflow-hidden pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"
      style={{
        backgroundColor: (section as any).bgColor ?? "#FBF9F5",
        color: darkText,
      }}
    >
      <UniversalMultimediaPreview
        multimedia={backgroundMultimedia}
        fallbackAlt="Travel Insights background"
        fallbackColor={(section as any).bgColor ?? "#FBF9F5"}
        mode="background"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 container mx-auto px-4 lg:px-0 flex flex-col gap-10 md:gap-12">
        {/* Header Row: Eyebrow + Split Title (Left) & Subtitle (Right) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 md:gap-6 w-full">
          <div className="flex flex-col items-start gap-1 md:gap-2">
            <DynamicStyledPreview
              as="span"
              field={eyebrow}
              styleObj={(section as any).homeTravelInsightsEyebrowStyle ?? content.homeTravelInsightsEyebrowStyle}
              fallbackColor={accentColor || "#E5A84B"}
              className="text-xs md:text-sm font-semibold tracking-[2px] uppercase text-[#E5A84B] flex items-center gap-1.5"
            />

            <h2 className="font-heading font-normal text-card-title text-[32px] md:text-[42px] lg:text-[48px] leading-tight">
              {accentTitlePart ? (
                <>
                  <span style={{ color: darkText }}>{mainTitlePart} </span>
                  <span style={{ color: accentColor || "#E5A84B" }}>{accentTitlePart}</span>
                </>
              ) : (
                <DynamicStyledPreview
                  as="span"
                  field={titleObj}
                  styleObj={(section as any).homeTravelInsightsTitleStyle ?? content.homeTravelInsightsTitleStyle}
                  fallbackColor={darkText}
                />
              )}
            </h2>
          </div>

          <div className="max-w-[460px] text-left lg:text-right">
            <DynamicStyledPreview
              as="p"
              field={subtitle}
              styleObj={
                (section as any).homeTravelInsightsSubtitleStyle ??
                content.homeTravelInsightsSubtitleStyle ??
                (section as any).homeTravelInsightsDescriptionStyle ??
                content.homeTravelInsightsDescriptionStyle
              }
              fallbackColor={darkText}
              className="font-normal text-sm md:text-[15px] leading-relaxed text-subtitle whitespace-pre-line"
            />
          </div>
        </div>

        {/* Content Cards Grid: Left Featured (Tall) + Right Secondary (2 Stacked Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full">
          {/* Left Column: Tall Featured Story Card */}
          <div className="relative w-full h-[440px] md:h-[480px] lg:h-[512px] rounded-lg overflow-hidden shrink-0 group shadow-sm">
            {leftSideMultimedia && (leftSideMultimedia.image?.url || leftSideMultimedia.video?.url) ? (
              <UniversalMultimediaPreview
                multimedia={leftSideMultimedia}
                fallbackAlt="Featured Travel Insight"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <ImageShowPreview
                src={
                  typeof featuredInsight?.image === "string"
                    ? featuredInsight.image
                    : featuredInsight?.image?.url || ""
                }
                alt={typeof featuredInsight?.title === "string" ? featuredInsight.title : featuredInsight?.title?.value || "Featured Insight"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}

            {/* Dark Bottom Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

            {/* Bottom Content */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white z-10">
              <DynamicStyledPreview
                as="span"
                field={featuredInsight?.tag}
                fallback="— FEATURED"
                fallbackColor={accentColor || "#E5A84B"}
                className="text-[11px] font-semibold tracking-[2px] uppercase text-[#E5A84B] mb-1.5"
              />
              <DynamicStyledPreview
                as="h3"
                field={featuredInsight?.title}
                fallback="The Balkans, Seen from Within"
                fallbackColor="#FFFFFF"
                className="font-serif text-2xl md:text-3xl font-semibold leading-tight text-white mb-2"
              />
              <DynamicStyledPreview
                as="p"
                field={featuredInsight?.description}
                fallback="A collection of stories that move past the postcard — through villages, conversations, and centuries."
                fallbackColor="#E5E7EB"
                className="text-xs md:text-sm text-white/80 line-clamp-2 leading-relaxed max-w-[90%]"
              />
            </div>
          </div>

          {/* Right Column: 2 Stacked Story Cards */}
          <div className="flex flex-col gap-5 h-full justify-between w-full">
            {secondaryInsights.slice(0, 2).map((insight, idx) => (
              <div
                key={idx}
                className="relative w-full h-[210px] md:h-[235px] lg:h-[246px] rounded-lg overflow-hidden shrink-0 group shadow-sm"
              >
                <ImageShowPreview
                  src={
                    typeof insight?.image === "string"
                      ? insight.image
                      : insight?.image?.url || ""
                  }
                  alt={typeof insight?.title === "string" ? insight.title : insight?.title?.value || "Insight Card"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                {/* Bottom Content */}
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end text-white z-10">
                  <DynamicStyledPreview
                    as="h4"
                    field={insight?.title}
                    fallback="The Balkans, Seen from Within"
                    fallbackColor="#FFFFFF"
                    className="font-serif text-xl md:text-2xl font-semibold leading-tight text-white mb-1.5"
                  />
                  <DynamicStyledPreview
                    as="p"
                    field={insight?.description}
                    fallback="A collection of stories that move past the postcard — through villages, conversations, and centuries."
                    fallbackColor="#E5E7EB"
                    className="text-xs md:text-sm text-white/80 line-clamp-2 leading-relaxed max-w-[92%]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Button */}
        {section.buttons?.length ? (
          <div className="pt-2 md:w-[230px] w-full">
            {renderButtons(section.buttons, true, false, true)}
          </div>
        ) : null}
      </div>
    </section>
  )
}
