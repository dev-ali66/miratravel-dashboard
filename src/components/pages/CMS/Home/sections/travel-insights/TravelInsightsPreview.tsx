import type { ReactNode } from "react"
import type { HomeSection } from "../../homeTypes"
import { UniversalMultimediaPreview } from "../../shared/preview/UniversalMultimediaPreview"
import { DynamicStyledPreview } from "@/components/shared/DynamicStyledPreview"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import { useGetStories } from "@/hooks/story/useGetStories"

const DEFAULT_INSIGHTS = [
  {
    tag: "FEATURED",
    title: "The Balkans, Seen from Within",
    description:
      "A collection of stories that move past the postcard — through villages, conversations, and centuries.",
    url: "/stories/the-balkans-seen-from-within",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "STAYS",
    title: "The Salt Merchants of Ston",
    description:
      "Tracking the white gold of the Adriatic along the ancient fortified walls of Pelješac peninsula.",
    url: "/stories/salt-merchants-of-ston",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tag: "CULTURE",
    title: "Decoding the Stećci",
    description:
      "Mythology of the medieval tombstones across the ancient high passes of Bosnia and Herzegovina.",
    url: "/stories/decoding-the-stecci",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
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
  const backgroundMultimedia =
    (section as any).backgroundMultimedia || content.backgroundMultimedia || (section as any).multimedia

  // Fetch live published stories to mirror frontend homepage 1:1 ratio
  const { data: storiesResponse } = useGetStories()
  const liveStories = storiesResponse?.data ?? []

  // Format live stories into insights structure
  const formattedStories = liveStories.map((story: any, idx: number) => {
    const rawTag =
      story.category ||
      (Array.isArray(story.categories) && story.categories[0]) ||
      (idx === 0 ? "FEATURED" : "INSIGHT")
    const tag = typeof rawTag === "object" ? rawTag?.name || "INSIGHT" : String(rawTag).toUpperCase()

    const title = story.title || "Untitled Story"
    const description =
      story.description ||
      story.detail?.description?.value ||
      story.excerpt ||
      story.subtitle ||
      "Explore this curated story across the Balkans."

    const image =
      story.image ||
      story.detail?.heroMultimedia?.image?.url ||
      story.detail?.backgroundMultimedia?.image?.url ||
      ""

    return {
      tag,
      title,
      description,
      url: `/stories/${story.slug || story.id}`,
      image,
    }
  })

  const insightsList = formattedStories.length > 0 ? formattedStories : DEFAULT_INSIGHTS

  const featuredInsight = insightsList[0]
  const secondaryInsights = insightsList.slice(1, 3)

  const eyebrow = (section as any).eyebrow ?? content.eyebrow
  const titleObj = (section as any).title ?? content.title
  const subtitle =
    (section as any).subtitle ??
    content.subtitle ??
    (section as any).description ??
    content.description

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
          <div className="relative w-full h-[440px] md:h-[480px] lg:h-[512px] rounded-lg overflow-hidden shrink-0 group shadow-sm bg-neutral-800">
            <ImageShowPreview
              src={featuredInsight?.image}
              alt={featuredInsight?.title || "Featured Insight"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Dark Bottom Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

            {/* Bottom Content */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white z-10 pointer-events-none">
              <span className="text-[11px] font-semibold tracking-[2px] uppercase text-[#E5A84B] mb-1.5 flex items-center gap-1.5">
                <span className="w-3 h-px bg-[#E5A84B]" />
                {featuredInsight?.tag || "FEATURED"}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold leading-tight text-white mb-2 line-clamp-2">
                {featuredInsight?.title}
              </h3>
              <p className="text-xs md:text-sm text-white/80 line-clamp-2 leading-relaxed max-w-[90%]">
                {featuredInsight?.description}
              </p>
            </div>
          </div>

          {/* Right Column: 2 Stacked Story Cards */}
          <div className="flex flex-col gap-5 h-full justify-between w-full">
            {secondaryInsights.map((insight, idx) => (
              <div
                key={idx}
                className="relative w-full h-[210px] md:h-[235px] lg:h-[246px] rounded-lg overflow-hidden shrink-0 group shadow-sm bg-neutral-800"
              >
                <ImageShowPreview
                  src={insight?.image}
                  alt={insight?.title || "Insight Card"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                {/* Bottom Content */}
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end text-white z-10 pointer-events-none">
                  <h4 className="font-serif text-xl md:text-2xl font-semibold leading-tight text-white mb-1.5 line-clamp-1">
                    {insight?.title}
                  </h4>
                  <p className="text-xs md:text-sm text-white/80 line-clamp-2 leading-relaxed max-w-[92%]">
                    {insight?.description}
                  </p>
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
