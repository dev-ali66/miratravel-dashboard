import { useCmsDraft } from "../shared/CmsDraftContext"
import { ArrowUpRight } from "lucide-react"

import type {
  HomeButton,
  HomePageData,
  HomeSection,
  HomeStoryItem,
} from "./homeTypes"
import { cn } from "@/lib/utils"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import { VideoShowPreview } from "@/components/shared/VideoShowPreview"

const PREVIEW_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"
const PREVIEW_VIDEO_SOURCE =
  "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beach-1576/1080p.mp4"

const colorWithOpacity = (
  color: string | undefined,
  opacity: number | undefined
) => {
  if (!color || opacity === undefined || opacity >= 100) return color

  const hexMatch = color.match(/^#([0-9a-f]{6})$/i)
  if (hexMatch) {
    const red = parseInt(hexMatch[1].slice(0, 2), 16)
    const green = parseInt(hexMatch[1].slice(2, 4), 16)
    const blue = parseInt(hexMatch[1].slice(4, 6), 16)
    return `rgba(${red}, ${green}, ${blue}, ${opacity / 100})`
  }

  const rgbMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity / 100})`
  }

  return color
}

const fieldCssStyle = (
  style: {
    textColor?: string
    textOpacity?: number
    backgroundColor?: string
    backgroundOpacity?: number
  } | undefined,
  fallbackColor?: string
) => ({
  color: colorWithOpacity(style?.textColor ?? fallbackColor, style?.textOpacity),
  backgroundColor: colorWithOpacity(style?.backgroundColor, style?.backgroundOpacity),
})

const DEFAULT_HOME_DATA: NonNullable<HomePageData["data"]> = {
  page: "home",
  theme: {
    accentColor: "#C97B4A",
    primaryColor: "#1F3A1B",
    textColorDark: "#1A1A1A",
    textColorLight: "#FFFFFF",
  },
  sections: [
    {
      key: "hero",
      type: "hero",
      order: 1,
      backgroundType: "video",
      showVideo: true,
      bgImages: [{ url: PREVIEW_IMAGE_SOURCE, alt: "Aerial view of a coastal journey" }],
      bgVideos: [{ url: PREVIEW_VIDEO_SOURCE, alt: "Aerial view of a coastal journey", autoplay: true, loop: true, muted: true }],
      content: {
        titleLine1: "Travel deeper.",
        titleHighlight: "Feel more.",
        titleLine2: "Live fully.",
        description: "Thoughtfully designed journeys through the places that stay with you.",
      },
      buttons: [{ label: "Explore journeys", url: "#", style: "primary" }],
    },
    {
      key: "explore_journeys",
      type: "explore_journeys",
      order: 2,
      content: {
        eyebrow: "Curated journeys",
        title: "Go beyond the expected",
        subtitle: "Discover the Balkans through a local lens.",
        description: "Handpicked routes, meaningful encounters, and the freedom to travel at your own pace.",
      },
      buttons: [{ label: "View all journeys", url: "#", style: "primary" }],
    },
    {
      key: "destinations",
      type: "destinations",
      order: 3,
      content: {
        eyebrow: "Our destinations",
        title: "The Balkans, beautifully uncovered",
        subtitle: "From Adriatic shores to mountain villages, find your next story.",
      },
      buttons: [{ label: "Explore destinations", url: "#", style: "primary" }],
    },
    {
      key: "mira_stories",
      type: "mira_stories",
      order: 4,
      bgImages: [{ url: PREVIEW_IMAGE_SOURCE, alt: "Mira travel story" }],
      content: {
        eyebrow: "Mira stories",
        title: "Travel has a way of changing us",
        description: "Meet the people, places, and moments behind the journeys we create.",
      },
      items: [
        { index: "01", title: "The rhythm of island life", subtitle: "A story from the Adriatic" },
        { index: "02", title: "Along the mountain road", subtitle: "Finding the quiet places" },
        { index: "03", title: "A table set for strangers", subtitle: "The taste of home" },
      ],
    },
    {
      key: "why_mira",
      type: "why_mira",
      order: 5,
      sideImages: [{ url: PREVIEW_IMAGE_SOURCE, alt: "Mira curated Balkan journey" }],
      content: {
        eyebrow: "Why Mira",
        title: "We believe the best journeys feel personal",
        paragraphs: [
          "We create journeys for curious travellers who want to see more than the highlights. Every itinerary is shaped around your interests, your rhythm, and the details that make a place feel real.",
          "With local knowledge and thoughtful planning, we make exploring the Balkans feel effortless and deeply rewarding.",
        ],
        signature: "The Mira team",
      },
    },
    {
      key: "travel_insights",
      type: "travel_insights",
      order: 6,
      bgImages: [{ url: PREVIEW_IMAGE_SOURCE, alt: "Balkan travel insights" }],
      content: {
        eyebrow: "Travel insights",
        title: "Ideas for going further",
        subtitle: "Stories and inspiration for your next Balkan adventure.",
        description: "A closer look at the places, traditions, and experiences worth making time for.",
      },
      buttons: [{ label: "Read all stories", url: "#", style: "primary" }],
    },
    {
      key: "custom_journey_cta",
      type: "custom_journey_cta",
      order: 7,
      bgImages: [{ url: PREVIEW_IMAGE_SOURCE, alt: "A custom journey through the Balkans" }],
      content: {
        titleLine1: "Your journey should be",
        titleHighlight: "uniquely yours.",
        description: "Tell us what inspires you and we will shape a journey around it.",
      },
      buttons: [{ label: "Start planning", url: "#", style: "primary" }],
    },
  ],
}

export const HomePreview = () => {
  const page = useCmsDraft<HomePageData>()

  const data = page?.data ?? DEFAULT_HOME_DATA

  const theme = data.theme ?? DEFAULT_HOME_DATA.theme ?? {}
  const sections = data.sections?.length
    ? data.sections
    : DEFAULT_HOME_DATA.sections ?? []

  /*
   * ============================================================
   * THEME
   * ============================================================
   */

  const accentColor =
    theme.accentColor ?? "#C97B4A"

  const primaryColor =
    theme.primaryColor ?? "#1F3A1B"

  const darkText =
    theme.textColorDark ?? "#1A1A1A"

  const lightText =
    theme.textColorLight ?? "#FFFFFF"

  /*
   * ============================================================
   * SORT SECTIONS
   * ============================================================
   */

  const sortedSections = sections
    .slice()
    .sort(
      (a, b) =>
        (a.order ?? 0) -
        (b.order ?? 0)
    )

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  const getContent = (
    section: HomeSection
  ) => {
    return (
      (section.content ?? {}) as Record<
        string,
        any
      >
    )
  }

  const getBackgroundImage = (
    section: HomeSection
  ) => {
    return section.bgImages?.[0]?.url ?? ""
  }

  const getBackgroundImageAlt = (
    section: HomeSection
  ) => {
    return (
      section.bgImages?.[0]?.alt ?? ""
    )
  }

  /*
   * ============================================================
   * BUTTONS
   * ============================================================
   */

  const renderButtons = (
    buttons: HomeButton[] = [],
    fullWidth = false,
    alignRight = false,
    mainButtonWidth = false
  ) => {
    if (!buttons.length) {
      return null
    }

    return (
      <div
        className={cn(
          "flex flex-row flex-wrap items-start gap-3",
          fullWidth ? "w-full" : "mt-7",
          alignRight && "justify-end"
        )}
      >
        {buttons.map(
          (button, index) => {
            const isPrimary =
              button.style === "primary"

            return (
              <a
                key={`${button.label}-${index}`}
                href={button.url || "#"}
                className={cn(
                  "inline-flex min-h-[38px] items-center justify-center px-7 text-[10px] font-semibold uppercase tracking-[0.08em] transition-opacity hover:opacity-80",
                  buttons.length === 1 && fullWidth && "w-full",
                  mainButtonWidth && index === 0 && "w-full md:w-[230px]"
                )}
                style={{
                  backgroundColor:
                    button.backgroundColor ??
                    (isPrimary
                      ? primaryColor
                      : "transparent"),

                  color:
                    button.textColor ??
                    (isPrimary
                      ? lightText
                      : primaryColor),

                  border: isPrimary
                    ? "none"
                    : `1px solid ${primaryColor}`,
                }}
              >
                {button.label ||
                  "Button"}
              </a>
            )
          }
        )}
      </div>
    )
  }

  /*
   * ============================================================
   * DUMMY CARD
   *
   * These are intentionally layout-only.
   *
   * Actual API data can be connected later.
   * ============================================================
   */

  const DummyImage = ({
    className = "",
  }: {
    className?: string
  }) => {
    return (
      <div
        className={`
          relative
          overflow-hidden
          bg-muted
          ${className}
        `}
      >
        <ImageShowPreview
          src={PREVIEW_IMAGE_SOURCE}
          alt="Preview journey"
          className="h-full w-full"
        />
      </div>
    )
  }

  /*
   * ============================================================
   * HERO
   * ============================================================
   */

  const renderHero = (
    section: HomeSection
  ) => {
    const content = getContent(section)
    const textColors = content.textColors ?? {}

    const video =
      section.bgVideos?.[0]

    const image =
      getBackgroundImage(section)

    const imageAlt =
      getBackgroundImageAlt(section)

    const backgroundType =
      section.backgroundType ??
      (section.showVideo
        ? "video"
        : image
          ? "image"
          : "color")

    const shouldShowVideo = backgroundType === "video"
    const shouldShowImage = backgroundType === "image"

    return (
      <section
        className="
          relative
          min-h-[560px]
          w-full
          overflow-hidden
          md:min-h-[680px]
        "
        style={{
            backgroundColor:
              section.bgColor ??
              "#0F2A2E",
        }}
      >
        {/* ====================================================
            BACKGROUND VIDEO
        ==================================================== */}

        {shouldShowVideo && (
          <VideoShowPreview
            src={video?.url || PREVIEW_VIDEO_SOURCE}
            poster={image || PREVIEW_IMAGE_SOURCE}
            alt={video?.alt || "Hero background video"}
            mode="background"
            className="h-full w-full"
            autoplay={video?.autoplay ?? true}
            muted={video?.muted ?? true}
            loop={video?.loop ?? true}
            opacity={video?.opacity ?? 100}
            overlayColor={video?.overlayColor}
            overlayOpacity={video?.overlayOpacity}
          />
        )}

        {/* ====================================================
            BACKGROUND IMAGE FALLBACK
        ==================================================== */}

        {shouldShowImage && (
          <ImageShowPreview
            src={image || PREVIEW_IMAGE_SOURCE}
            alt={imageAlt || "Hero background"}
            mode="background"
            className="h-full w-full"
            opacity={section.bgImages?.[0]?.opacity ?? 100}
            overlayColor={section.bgImages?.[0]?.overlayColor}
            overlayOpacity={section.bgImages?.[0]?.overlayOpacity}
          />
        )}

        {/* ====================================================
            OVERLAY
        ==================================================== */}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div
          className="
            relative
            z-10
            flex
            min-h-[560px]
            items-end
            px-7
            pb-12
            md:min-h-[680px]
            md:px-14
            md:pb-16
          "
          style={{
            color: lightText,
          }}
        >
          <div className="max-w-[680px]">

            {content.titleLine1 && (
              <h1
                className="
                  font-serif
                  text-[40px]
                  font-medium
                  leading-[0.94]
                  tracking-[-1.5px]
                  md:text-[60px]
                  lg:text-[72px]
                "
                style={{
                  ...fieldCssStyle(content.titleLine1Style, textColors.titleLine1 ?? lightText),
                }}
              >
                {content.titleLine1}
              </h1>
            )}

            {(content.titleHighlight ||
              content.titleLine2) && (
              <h1
                className="
                  font-serif
                  text-[40px]
                  font-medium
                  leading-[0.94]
                  tracking-[-1.5px]
                  md:text-[60px]
                  lg:text-[72px]
                "
                style={fieldCssStyle(content.titleLine2Style, lightText)}
              >
                {content.titleHighlight && (
                  <span
                    style={fieldCssStyle(content.titleHighlightStyle, textColors.titleHighlight ?? accentColor)}
                  >
                    {
                      content.titleHighlight
                    }
                  </span>
                )}

                {content.titleLine2 && (
                  <>
                    {" "}
                    <span
                      style={fieldCssStyle(content.titleLine2Style, textColors.titleLine2 ?? lightText)}
                    >
                      {
                        content.titleLine2
                      }
                    </span>
                  </>
                )}
              </h1>
            )}

            {content.description && (
              <p
                className="
                  mt-6
                  max-w-[520px]
                  text-[11px]
                  leading-[1.75]
                  md:text-[12px]
                "
                style={fieldCssStyle(content.descriptionStyle, textColors.description ?? "rgba(255,255,255,0.82)")}
              >
                {content.description}
              </p>
            )}

            {renderButtons(
              section.buttons,
              false,
              false,
              true
            )}
          </div>
        </div>
      </section>
    )
  }

  /*
   * ============================================================
   * EXPLORE JOURNEYS
   * ============================================================
   */

  const renderExploreJourneys = (
    section: HomeSection
  ) => {
    const content = getContent(section)
    const image = section.bgImages?.[0]
    const video = section.bgVideos?.[0]
    const backgroundType =
      section.backgroundType ??
      (section.showVideo
        ? "video"
        : image?.url
          ? "image"
          : "color")

    const shouldShowVideo = backgroundType === "video"
    const shouldShowImage = backgroundType === "image"

    return (
      <section
        className="
          relative
          w-full
          overflow-hidden
          px-7
          py-16
          md:px-14
          md:py-24
        "
        style={{
          backgroundColor:
            section.bgColor ??
            "#FBF9F5",

          color: darkText,
        }}
      >
        {shouldShowVideo && (
          <VideoShowPreview
            src={video?.url || PREVIEW_VIDEO_SOURCE}
            poster={image?.url || PREVIEW_IMAGE_SOURCE}
            alt={video?.alt || "Explore Journeys background video"}
            mode="background"
            className="h-full w-full"
            autoplay
            muted
            loop={video?.loop ?? true}
            opacity={video?.opacity ?? 100}
            overlayColor={video?.overlayColor}
            overlayOpacity={video?.overlayOpacity}
          />
        )}

        {shouldShowImage && (
          <ImageShowPreview
            src={image?.url || PREVIEW_IMAGE_SOURCE}
            alt={image?.alt || "Explore Journeys background"}
            mode="background"
            className="h-full w-full"
            opacity={image?.opacity ?? 100}
            overlayColor={image?.overlayColor}
            overlayOpacity={image?.overlayOpacity}
          />
        )}

        {(shouldShowVideo || shouldShowImage) && (
          <div className="absolute inset-0 bg-white/70" />
        )}

        <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-col gap-14">

          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">

            {/* LEFT CONTENT */}

            <div className="flex flex-col items-start gap-4">

              {content.eyebrow && (
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                  "
                  style={{
                    color:
                      accentColor,
                  }}
                >
                  {content.eyebrow}
                </p>
              )}

              {content.title && (
                <h2
                  className="
                    max-w-[700px]
                    font-serif
                    text-[24px]
                    leading-[24px]
                    md:text-[28px]
                    md:leading-[28px]
                    lg:text-[30px]
                    lg:leading-[30px]
                    xl:text-[40px]
                    xl:leading-[40px]
                  "
                >
                  {content.title}
                </h2>
              )}

              {content.subtitle && (
                <p className="text-[12px] leading-[1.7]">
                  {content.subtitle}
                </p>
              )}

            </div>

            {content.description && (
              <p className="max-w-[558px] text-sm font-normal leading-8 opacity-70">
                {content.description}
              </p>
            )}
          </div>

          {/* JOURNEY CARDS */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="group relative flex w-full flex-col overflow-hidden rounded-[8px] border border-border-muted/40 bg-neutral-100"
                >
                  <div className="relative h-[280px] w-full shrink-0 overflow-hidden rounded-sm md:h-[380px] lgx:h-[413px]">
                    <DummyImage className="h-full w-full" />

                    <div
                      className="absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]"
                      style={{
                        backgroundColor: "#FEF3C7",
                        color: "#9A3412",
                      }}
                    >
                      Journey
                    </div>

                    <div className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-transparent bg-neutral-100 text-sm shadow-sm">
                      ♡
                    </div>

                    <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                      7 days
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
                    <h3 className="font-serif text-[21px] leading-tight text-secondary">
                      Ancient Albania
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-subtitle">
                      A slow journey through mountain villages, old stone towns, and the Adriatic coast.
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "History",
                          "Culture",
                          "Coast",
                        ].map((tag) => (
                          <span
                            key={tag}
                            className="rounded-[38px] border border-border-light px-2 py-1 text-[8px] uppercase tracking-[0.08em] text-subtitle"
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
              )
            )}
          </div>

          <div className="flex w-full items-start">
            {renderButtons(
              section.buttons,
              false,
              false,
              true
            )}
          </div>
        </div>
      </section>
    )
  }

  /*
   * ============================================================
   * DESTINATIONS
   * ============================================================
   */

  const renderDestinations = (
    section: HomeSection
  ) => {
    const content = getContent(section)

    return (
      <section
        className="
          w-full
          px-7
          py-16
          md:px-14
          md:py-24
        "
        style={{
          backgroundColor:
            section.bgColor ??
            "#FBF9F5",

          color: darkText,
        }}
      >
        <div className="mx-auto flex w-full flex-col items-center gap-14">

          <div className="flex flex-col items-center gap-4 text-center">
            {content.eyebrow && (
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: accentColor }}
              >
                {content.eyebrow}
              </p>
            )}

            {content.title && (
              <h2 className="max-w-[900px] font-serif text-[32px] leading-tight tracking-[-1px] md:text-[52px]">
                {content.title}
              </h2>
            )}

            {content.subtitle && (
              <p className="max-w-[700px] text-[12px] leading-[1.7] opacity-70 md:text-sm">
                {content.subtitle}
              </p>
            )}
          </div>

          {/* DUMMY DESTINATION CARDS */}

          <div className="grid w-full grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">

            {[
              "Croatia",
              "Bosnia & Herzegovina",
              "Albania",
            ].map(
              (name) => (
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
                          : "A destination where East meets West in the heart of the Balkans."
                      }
                    </p>
                  </div>
                </div>
              )
            )}

          </div>

          <div className="flex w-full justify-center">
            {renderButtons(
              section.buttons,
              false,
              false,
              true
            )}
          </div>
        </div>
      </section>
    )
  }

  /*
   * ============================================================
   * MIRA STORIES
   * ============================================================
   */

  const renderMiraStories = (
    section: HomeSection
  ) => {
    const content = getContent(section)

    const items =
      section.items ?? []

    const image =
      getBackgroundImage(section)

    const imageAlt =
      getBackgroundImageAlt(section)

    const storyImage = image || PREVIEW_IMAGE_SOURCE

    return (
      <section
        className="
          w-full
          px-7
          py-16
          md:px-14
          md:py-24
        "
        style={{
          backgroundColor:
            section.bgColor ??
            "#FBF9F5",

          color: darkText,
        }}
      >
        <div className="mx-auto flex w-full max-w-[1336px] flex-col items-center justify-center gap-[38px] lg:flex-row lg:gap-12 xl:gap-16">

          <div className="relative aspect-[776/661] w-full overflow-hidden lg:h-[375px] lg:w-[440px] lg:flex-none lg:aspect-auto lgx:h-[426px] lgx:w-[500px] xl:h-[661px] xl:w-[776px]">
            <ImageShowPreview
              src={storyImage}
              alt={imageAlt || "Mira Stories editorial"}
              className="h-full w-full"
              opacity={section.bgImages?.[0]?.opacity ?? 100}
              overlayColor={section.bgImages?.[0]?.overlayColor}
              overlayOpacity={section.bgImages?.[0]?.overlayOpacity}
            />
          </div>

          {/* CONTENT */}

          <div className="flex w-full flex-col items-start lg:flex-1 xl:w-[550px] xl:flex-none">

            <div className="flex w-full flex-col items-start gap-6 md:gap-8 xl:gap-10">
              {content.eyebrow && (
                <p
                  className="text-sm font-normal uppercase tracking-[1.5px]"
                  style={{ color: accentColor }}
                >
                  {content.eyebrow}
                </p>
              )}

              {content.title && (
                <h2 className="max-w-[496px] font-serif text-[36px] font-semibold leading-[44px] tracking-[2px] text-card-title md:text-[52px] md:leading-[64px] xl:text-[64px] xl:leading-[80px]">
                  {content.title}
                </h2>
              )}

              {content.description && (
                <p className="w-full max-w-[550px] text-sm leading-6 text-subtitle md:text-[15px] md:leading-7 xl:text-base xl:leading-[30px]">
                  {content.description}
                </p>
              )}
            </div>

            {/* STORIES */}

            <div className="mt-6 flex w-full flex-col gap-4 md:mt-8 md:gap-6 xl:mt-10 xl:gap-8">

                {items.length
                  ? items.map(
                      (
                        item: HomeStoryItem,
                        index
                      ) => (
                        <a
                          key={index}
                          href={
                            item.url ||
                            "#"
                          }
                          className="group flex items-start gap-4 transition-opacity hover:opacity-60 md:gap-6 xl:gap-8"
                        >
                          <span
                            className="mt-0.5 text-sm text-muted transition-colors group-hover:text-accent"
                            style={{
                              color:
                                accentColor,
                            }}
                          >
                            {item.index ||
                              String(
                                index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                          </span>

                          <div className="flex flex-col gap-1">
                          <h3 className="font-serif text-base font-medium leading-5 text-card-title transition-colors group-hover:text-primary md:text-[18px] xl:text-[20px]">
                            {item.title ||
                              "Story title"}
                          </h3>

                          {item.subtitle && (
                            <p className="text-xs leading-[18px] text-muted md:text-[13px] xl:text-sm">
                              {
                                item.subtitle
                              }
                            </p>
                          )}
                          </div>
                        </a>
                      )
                    )
                  : [1, 2, 3, 4].map(
                      (item) => (
                        <div
                          key={item}
                          className="group flex items-start gap-4 md:gap-6 xl:gap-8"
                        >
                          <span
                            className="mt-0.5 text-sm text-muted"
                            style={{
                              color:
                                accentColor,
                            }}
                          >
                            {String(
                              item
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <div className="flex flex-col gap-1">
                            <h3 className="font-serif text-base font-medium leading-5 text-card-title md:text-[18px] xl:text-[20px]">
                              Story title
                            </h3>

                            <p className="text-xs leading-[18px] text-muted md:text-[13px] xl:text-sm">
                              Story subtitle
                            </p>
                          </div>
                        </div>
                      )
                    )}

            </div>

            {renderButtons(
              section.buttons,
              false,
              false,
              true
            )}
          </div>
        </div>
      </section>
    )
  }

  /*
   * ============================================================
   * WHY MIRA
   * ============================================================
   */

  const renderWhyMira = (
    section: HomeSection
  ) => {
    const content = getContent(section)

    const image =
      section.sideImages?.[0]

    const paragraphs =
      content.paragraphs ?? []

    const whyMiraImage =
      image?.url || PREVIEW_IMAGE_SOURCE

    return (
      <section
        className="
          w-full
          overflow-hidden
        "
        style={{
          backgroundColor:
            section.bgColor ??
            primaryColor,

          color: lightText,
        }}
      >
        <div className="mx-auto flex w-full max-w-[1680px] flex-col items-start gap-12 px-7 py-16 md:px-14 md:py-24 lg:flex-row lg:items-center lg:gap-[70px] xl:gap-24">

          {/* LEFT */}

          <div className="flex w-full flex-col items-start lg:flex-1">

            <div className="flex w-full max-w-[760px] flex-col gap-9 md:gap-10 xl:gap-[47px]">

              {content.eyebrow && (
                <p
                  className="
                    text-[18px]
                    font-medium
                    uppercase
                    tracking-[1.4px]
                  "
                  style={{
                    color:
                      accentColor,
                  }}
                >
                  {content.eyebrow}
                </p>
              )}

              {content.title && (
                <h2 className="font-serif text-[32px] font-normal leading-[44px] tracking-[2px] text-white sm:text-[38px] sm:leading-[52px] md:text-[44px] md:leading-[58px] xl:text-[48px] xl:leading-[64px]">
                  {content.title}
                </h2>
              )}

              <div className="flex flex-col gap-8 md:gap-9 lgx:gap-10 xl:gap-11">

                {paragraphs.length
                  ? paragraphs.map(
                      (
                        paragraph: string,
                        index: number
                      ) => (
                        <p
                          key={index}
                          className="text-justify text-sm font-normal leading-[30px] tracking-[1.2px] md:text-[15px] md:leading-[34px] md:tracking-[1.6px] xl:leading-[37px] xl:tracking-[2px]"
                          style={{
                            color:
                              "rgba(255,255,255,0.76)",
                          }}
                        >
                          {
                            paragraph
                          }
                        </p>
                      )
                    )
                  : (
                    <>
                      <p className="text-justify text-sm leading-[30px] opacity-75 md:text-[15px] md:leading-[34px]">
                        Your story content will appear here.
                      </p>

                      <p className="text-justify text-sm leading-[30px] opacity-75 md:text-[15px] md:leading-[34px]">
                        This preview keeps the visual layout while the actual API content is loaded dynamically.
                      </p>
                    </>
                  )}

              </div>

              {content.signature && (
                <p
                  className="font-serif text-sm tracking-[1.4px] md:text-[15px]"
                  style={{
                    color:
                      accentColor,
                  }}
                >
                  {content.signature}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT IMAGE */}

          <div className="relative aspect-square w-full overflow-hidden lg:w-[500px] lg:flex-none xl:h-[713px] xl:w-[713px]">
            <ImageShowPreview
              src={whyMiraImage}
              alt={image?.alt ?? "MIRA curated Balkan journey"}
              className="h-full w-full"
              opacity={image?.opacity ?? 100}
              overlayColor={image?.overlayColor}
              overlayOpacity={image?.overlayOpacity}
            />

          </div>
        </div>
      </section>
    )
  }

  /*
   * ============================================================
   * TRAVEL INSIGHTS
   * ============================================================
   */

  const renderTravelInsights = (
    section: HomeSection
  ) => {
    const content = getContent(section)

    const image =
      getBackgroundImage(section)

    const imageAlt =
      getBackgroundImageAlt(section)

    const insightImage = image || PREVIEW_IMAGE_SOURCE

    return (
      <section
        className="
          w-full
          px-7
          py-16
          md:px-14
          md:py-24
        "
        style={{
          backgroundColor:
            section.bgColor ??
            "#FBF9F5",

          color: darkText,
        }}
      >
        <div className="mx-auto w-full max-w-[1680px]">

          <div className="flex flex-col items-center justify-center gap-6 md:gap-10 lg:flex-row lg:gap-12 xl:gap-16">

            {/* SPOTLIGHT IMAGE */}

            <div className="relative flex w-full items-center justify-center lg:w-1/2">
              <ImageShowPreview
                src={insightImage}
                alt={imageAlt || "Balkan Travel Insights"}
                className="h-[400px] w-full object-cover md:h-[500px] lg:h-[520px] xl:h-[540px]"
                opacity={section.bgImages?.[0]?.opacity ?? 100}
                overlayColor={section.bgImages?.[0]?.overlayColor}
                overlayOpacity={section.bgImages?.[0]?.overlayOpacity}
              />
            </div>

            {/* EDITORIAL CONTENT */}

            <div className="flex w-full flex-col items-start justify-start gap-3 md:gap-3.5 lg:w-1/2 xl:gap-4">

              {content.eyebrow && (
                <p
                  className="
                    text-xs
                    font-normal
                    uppercase
                    tracking-[1.4px]
                  "
                  style={{
                    color:
                      accentColor,
                  }}
                >
                  {content.eyebrow}
                </p>
              )}

              {content.title && (
                <h2 className="font-serif text-[38px] leading-tight tracking-[-1px] md:text-[52px]">
                  {content.title}
                </h2>
              )}

              {content.subtitle && (
                <p className="max-w-[600px] text-sm font-normal leading-[22px] text-subtitle md:text-[15px] md:leading-6 xl:text-base xl:leading-[26px]">
                  {content.subtitle}
                </p>
              )}

              {content.description && (
                <p className="max-w-[500px] text-[11px] leading-[1.8] opacity-70">
                  {content.description}
                </p>
              )}

              <div className="flex w-full flex-col items-start gap-4 py-5 md:gap-5 md:py-6 lg:gap-[22px] xl:gap-6">
                <article className="w-full border-b border-border-neutral pb-5">
                  <ImageShowPreview
                    src={insightImage}
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
                  <article
                    key={title}
                    className="group"
                  >
                    <ImageShowPreview
                      src={insightImage}
                      alt={title}
                      className="aspect-[0.9] w-full"
                      opacity={section.bgImages?.[0]?.opacity ?? 100}
                      overlayColor={section.bgImages?.[0]?.overlayColor}
                      overlayOpacity={section.bgImages?.[0]?.overlayOpacity}
                    />

                    <div className="border-b py-4">

                      <p
                        className="text-[9px] uppercase tracking-[0.15em]"
                        style={{
                          color:
                            accentColor,
                        }}
                      >
                          {tag}
                      </p>

                      <h3 className="mt-2 font-serif text-[19px] leading-tight">
                        {title}
                      </h3>

                      <p className="mt-2 text-[9px] leading-[1.5] opacity-55">
                        {description}
                      </p>

                    </div>
                  </article>
                  ))}
                </div>

                <div className="pt-2">
                  {renderButtons(
                    section.buttons,
                    false,
                    false,
                    true
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    )
  }

  /*
   * ============================================================
   * CUSTOM JOURNEY CTA
   * ============================================================
   */

  const renderCustomJourneyCta = (
    section: HomeSection
  ) => {
    const content = getContent(section)
    const image = getBackgroundImage(section)
    const imageAlt = getBackgroundImageAlt(section)
    const journeyImage = image || PREVIEW_IMAGE_SOURCE

    return (
      <section
        className="w-full overflow-hidden"
        style={{
          backgroundColor: section.bgColor ?? "#FBF9F5",
          color: darkText,
        }}
      >
        <div className="mx-auto flex w-full flex-col-reverse items-center justify-between gap-10 py-16 sm:gap-12 md:py-24 lg:flex-row lg:items-center">
          <div className="flex w-full flex-1 justify-start px-7 md:px-14 lg:justify-end xl:pl-36 xl:pr-14">
            <div className="flex w-full max-w-[700px] flex-col items-start gap-8 md:gap-12 lg:gap-14 xl:gap-[68px]">
              <div className="flex flex-col items-start gap-5 sm:gap-6">
                {content.titleLine1 && (
                  <h2
                    className="font-serif text-[26px] font-semibold leading-[34px] tracking-[1px] md:text-[38px] md:leading-[48px] lg:text-[42px] lg:leading-[52px] xl:text-[50px] xl:leading-[60px]"
                    style={{ color: darkText }}
                  >
                    {content.titleLine1}
                    {content.titleHighlight && (
                      <span style={{ color: accentColor }}>
                        {" "}
                        {content.titleHighlight}
                      </span>
                    )}
                  </h2>
                )}

                {content.description && (
                  <p
                    className="max-w-[514px] text-sm leading-[18px] tracking-[1px] md:text-[15px] md:leading-5 xl:text-base xl:leading-[22px]"
                    style={{ color: darkText, opacity: 0.7 }}
                  >
                    {content.description}
                  </p>
                )}
              </div>

              {section.buttons?.length ? (
                renderButtons(section.buttons, false, false, true)
              ) : null}
            </div>
          </div>

          <div className="flex w-full shrink-0 justify-end lg:w-1/2">
            <ImageShowPreview
              src={journeyImage}
              alt={imageAlt || "Let us design your journey"}
              className="h-[260px] w-full md:h-[420px] lg:h-[460px] lgx:h-[490px] xl:h-[560px] 2xl:h-[580px]"
              opacity={section.bgImages?.[0]?.opacity ?? 100}
              overlayColor={section.bgImages?.[0]?.overlayColor}
              overlayOpacity={section.bgImages?.[0]?.overlayOpacity}
            />
          </div>
        </div>
      </section>
    )
  }

  /*
   * ============================================================
   * SECTION RENDERER
   * ============================================================
   */

  const renderSection = (
    section: HomeSection
  ) => {
    switch (section.key) {
      case "hero":
        return renderHero(
          section
        )

      case "explore_journeys":
        return renderExploreJourneys(
          section
        )

      case "destinations":
        return renderDestinations(
          section
        )

      case "mira_stories":
        return renderMiraStories(
          section
        )

      case "why_mira":
        return renderWhyMira(
          section
        )

      case "travel_insights":
        return renderTravelInsights(
          section
        )

      case "custom_journey_cta":
        return renderCustomJourneyCta(
          section
        )

      default:
        return null
    }
  }

  /*
   * ============================================================
   * PREVIEW
   * ============================================================
   */

  return (
    <div
      className="
        w-full
        overflow-hidden
        bg-background
      "
    >
      {sortedSections.map(
        (section) => (
          <div
            key={section.key}
            className="w-full"
          >
            {renderSection(
              section
            )}
          </div>
        )
      )}

      {/* FOOTER */}
      <footer className="w-full self-stretch bg-primary flex flex-col relative overflow-hidden">
        {/* Top Main Section: Brand + Navigation */}
        <div className="w-full pt-14 md:pt-20 xl:pt-[100px] xl:pb-[50px] md:pb-10 pb-7">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 xl:gap-20 w-full px-7 md:px-14">
            {/* Brand Column */}
            <div className="w-full lg:w-[350px] shrink-0 flex flex-col items-start text-left">
              <p className="text-accent font-semibold text-sm tracking-[1.4px] uppercase md:text-base">MIRA</p>
              <p className="text-neutral-300 text-sm md:text-[15px] xl:text-base font-normal leading-5 xl:leading-[22px] mt-5 md:mt-6 xl:mt-[30px]">
                Your Trusted partner for world-class travel experiences across 50+ destinations.
              </p>
              <div className="flex items-center justify-start gap-3.5 xl:mt-13 md:mt-8 mt-4">
                {['facebook', 'instagram', 'twitter', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="xl:size-9 md:size-8 size-7 bg-neutral-300/10 hover:bg-neutral-300/15 flex items-center justify-center transition-all duration-300"
                    aria-label={`Follow on ${social}`}
                  >
                    <span className="text-neutral-100 text-xs">◉</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10 items-start">
              {[
                {
                  title: 'Explore',
                  links: ['Destinations', 'Journeys', 'Travel Insights', 'Mira Stories'],
                },
                {
                  title: 'About',
                  links: ['About Mira', 'Why Mira', 'How we work', 'Contact'],
                },
                {
                  title: 'Plan',
                  links: ['Start a travel request', 'Financial protection', 'FAQ'],
                },
                {
                  title: 'Company',
                  links: ['Privacy', 'Cookies', 'Terms and conditions', 'Complaints procedure'],
                },
              ].map((col) => (
                <div key={col.title} className="flex flex-col gap-4 md:gap-5 xl:gap-8 min-w-0">
                  <h3 className="text-neutral-300 font-semibold text-base md:text-lg lg:text-sm xl:text-[22px] leading-4 md:leading-[18px] xl:leading-[22px] tracking-[1px]">
                    {col.title}
                  </h3>
                  <ul className="flex flex-col gap-2 md:gap-3 xl:gap-4">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-neutral-200 xl:text-neutral-100 text-xs md:text-sm lg:text-[15px] font-normal hover:text-neutral-100 transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="w-full py-5 border-t border-b border-neutral-200/16 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-4 px-7 md:px-14">
          <div className="flex flex-wrap items-center justify-center gap-3 text-center md:text-left font-normal text-sm md:text-[15px] xl:text-base leading-5">
            <span className="text-neutral-200/90">Stay up to date:</span>
            <a href="#" className="text-accent font-medium hover:opacity-90 transition-opacity">
              Subscribe to the Newsletter →
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <span className="text-neutral-300 text-xs md:text-sm font-normal">Partner Badges</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="w-full py-6 md:py-8 px-7 md:px-14 text-center text-neutral-300 text-xs md:text-sm">
          <p>&copy; 2024 MIRA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}