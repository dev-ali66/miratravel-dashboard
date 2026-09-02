import { useCmsDraft } from "../shared/CmsDraftContext"

import type {
  HomeButton,
  HomePageData,
  HomeSection,
  HomeStoryItem,
} from "./homeTypes"

export const HomePreview = () => {
  const page = useCmsDraft<HomePageData>()

  const data = page?.data

  const theme = data?.theme ?? {}
  const sections = data?.sections ?? []

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
    buttons: HomeButton[] = []
  ) => {
    if (!buttons.length) {
      return null
    }

    return (
      <div className="mt-7 flex flex-wrap gap-3">
        {buttons.map(
          (button, index) => {
            const isPrimary =
              button.style === "primary"

            return (
              <a
                key={`${button.label}-${index}`}
                href={button.url || "#"}
                className="
                  inline-flex
                  min-h-[38px]
                  items-center
                  justify-center
                  px-7
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  transition-opacity
                  hover:opacity-80
                "
                style={{
                  backgroundColor:
                    isPrimary
                      ? primaryColor
                      : "transparent",

                  color: isPrimary
                    ? lightText
                    : primaryColor,

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
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/60 to-background" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Image
          </span>
        </div>
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

    const video =
      section.bgVideos?.[0]

    const image =
      getBackgroundImage(section)

    const imageAlt =
      getBackgroundImageAlt(section)

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

        {section.showVideo && video?.url && (
          <video
            src={video.url}
            poster={image || undefined}
            autoPlay={
              video.autoplay ?? true
            }
            muted={
              video.muted ?? true
            }
            loop={
              video.loop ?? true
            }
            playsInline
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />
        )}

        {/* ====================================================
            BACKGROUND IMAGE FALLBACK
        ==================================================== */}

        {!(section.showVideo && video?.url) && image && (
          <img
            src={image}
            alt={imageAlt}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
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
                  color: lightText,
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
              >
                {content.titleHighlight && (
                  <span
                    style={{
                      color:
                        accentColor,
                    }}
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
                      style={{
                        color:
                          lightText,
                      }}
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
                style={{
                  color:
                    "rgba(255,255,255,0.82)",
                }}
              >
                {content.description}
              </p>
            )}

            {renderButtons(
              section.buttons
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

    const trust =
      content.trustBadge ?? {}

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
        <div className="mx-auto max-w-[1180px]">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

            {/* LEFT CONTENT */}

            <div>

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
                    mt-4
                    max-w-[600px]
                    font-serif
                    text-[38px]
                    leading-[1]
                    tracking-[-1px]
                    md:text-[52px]
                  "
                >
                  {content.title}
                </h2>
              )}

              {content.subtitle && (
                <p className="mt-5 max-w-[500px] text-[12px] leading-[1.7]">
                  {content.subtitle}
                </p>
              )}

              {content.description && (
                <p className="mt-3 max-w-[550px] text-[11px] leading-[1.75] opacity-70">
                  {content.description}
                </p>
              )}

              {trust.source && (
                <div className="mt-6 inline-flex items-center gap-3 rounded-full border px-4 py-2">
                  <span className="text-[10px] font-semibold">
                    {trust.source}
                  </span>

                  {trust.rating !==
                    undefined && (
                    <span
                      className="text-[10px]"
                      style={{
                        color:
                          accentColor,
                      }}
                    >
                      ★ {trust.rating}
                    </span>
                  )}

                  {trust.text && (
                    <span className="text-[10px] opacity-60">
                      {trust.text}
                    </span>
                  )}
                </div>
              )}

              {renderButtons(
                section.buttons
              )}
            </div>

            {/* DUMMY JOURNEY CARDS */}

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="group"
                  >
                    <DummyImage className="aspect-[0.72]" />

                    <div className="pt-3">
                      <p
                        className="text-[9px] uppercase tracking-[0.15em]"
                        style={{
                          color:
                            accentColor,
                        }}
                      >
                        Journey
                      </p>

                      <h3 className="mt-1 font-serif text-[18px] leading-tight">
                        Journey title
                      </h3>

                      <p className="mt-1 text-[9px] opacity-55">
                        Destination · Duration
                      </p>
                    </div>
                  </div>
                )
              )}

            </div>
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
        <div className="mx-auto max-w-[1180px]">

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
            <h2 className="mt-4 max-w-[700px] font-serif text-[38px] leading-[1] tracking-[-1px] md:text-[52px]">
              {content.title}
            </h2>
          )}

          {content.subtitle && (
            <p className="mt-5 max-w-[600px] text-[12px] leading-[1.7] opacity-70">
              {content.subtitle}
            </p>
          )}

          {/* DUMMY DESTINATION CARDS */}

          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="group"
                >
                  <DummyImage className="aspect-[0.78]" />

                  <div className="flex items-end justify-between border-b py-3">
                    <div>
                      <p
                        className="text-[9px] uppercase tracking-[0.15em]"
                        style={{
                          color:
                            accentColor,
                        }}
                      >
                        Destination
                      </p>

                      <h3 className="mt-1 font-serif text-[21px]">
                        Destination
                      </h3>
                    </div>

                    <span className="text-[10px] opacity-50">
                      →
                    </span>
                  </div>
                </div>
              )
            )}

          </div>

          {renderButtons(
            section.buttons
          )}
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
        <div className="mx-auto max-w-[1180px]">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr]">

            {/* CONTENT */}

            <div>

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
                <h2 className="mt-4 font-serif text-[38px] leading-[1] tracking-[-1px] md:text-[52px]">
                  {content.title}
                </h2>
              )}

              {content.description && (
                <p className="mt-5 max-w-[470px] text-[11px] leading-[1.8] opacity-70">
                  {content.description}
                </p>
              )}

              {renderButtons(
                section.buttons
              )}
            </div>

            {/* STORIES */}

            <div>

              {image ? (
                <img
                  src={image}
                  alt={imageAlt}
                  className="
                    mb-7
                    h-[300px]
                    w-full
                    object-cover
                  "
                />
              ) : (
                <DummyImage className="mb-7 h-[300px] w-full" />
              )}

              <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">

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
                          className="
                            border-t
                            py-5
                            transition-opacity
                            hover:opacity-60
                          "
                        >
                          <span
                            className="text-[9px]"
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

                          <h3 className="mt-2 font-serif text-[21px] leading-tight">
                            {item.title ||
                              "Story title"}
                          </h3>

                          {item.subtitle && (
                            <p className="mt-2 text-[10px] opacity-55">
                              {
                                item.subtitle
                              }
                            </p>
                          )}
                        </a>
                      )
                    )
                  : [1, 2, 3, 4].map(
                      (item) => (
                        <div
                          key={item}
                          className="border-t py-5"
                        >
                          <span
                            className="text-[9px]"
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

                          <h3 className="mt-2 font-serif text-[21px]">
                            Story title
                          </h3>

                          <p className="mt-2 text-[10px] opacity-55">
                            Story subtitle
                          </p>
                        </div>
                      )
                    )}

              </div>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT */}

          <div className="flex items-center px-7 py-16 md:px-14 md:py-24">

            <div className="max-w-[560px]">

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
                <h2 className="mt-4 font-serif text-[38px] leading-[1] tracking-[-1px] md:text-[52px]">
                  {content.title}
                </h2>
              )}

              <div className="mt-7 space-y-5">

                {paragraphs.length
                  ? paragraphs.map(
                      (
                        paragraph: string,
                        index: number
                      ) => (
                        <p
                          key={index}
                          className="text-[11px] leading-[1.8]"
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
                      <p className="text-[11px] leading-[1.8] opacity-75">
                        Your story content will appear here.
                      </p>

                      <p className="text-[11px] leading-[1.8] opacity-75">
                        This preview keeps the visual layout while the actual API content is loaded dynamically.
                      </p>
                    </>
                  )}

              </div>

              {content.signature && (
                <p
                  className="mt-8 text-[10px] font-semibold uppercase tracking-[0.12em]"
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

          <div className="min-h-[420px]">

            {image?.url ? (
              <img
                src={image.url}
                alt={
                  image.alt ?? ""
                }
                className="
                  h-full
                  min-h-[420px]
                  w-full
                  object-cover
                "
              />
            ) : (
              <DummyImage className="h-full min-h-[420px] w-full" />
            )}

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
        <div className="mx-auto max-w-[1180px]">

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">

            <div>

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
                <h2 className="mt-4 font-serif text-[38px] leading-[1] tracking-[-1px] md:text-[52px]">
                  {content.title}
                </h2>
              )}

              {content.description && (
                <p className="mt-5 max-w-[500px] text-[11px] leading-[1.8] opacity-70">
                  {content.description}
                </p>
              )}

              {renderButtons(
                section.buttons
              )}
            </div>

            {/* DUMMY ARTICLE CARDS */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (
                  <article
                    key={item}
                    className="group"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={imageAlt}
                        className="aspect-[0.9] w-full object-cover"
                      />
                    ) : (
                      <DummyImage className="aspect-[0.9] w-full" />
                    )}

                    <div className="border-b py-4">

                      <p
                        className="text-[9px] uppercase tracking-[0.15em]"
                        style={{
                          color:
                            accentColor,
                        }}
                      >
                        Travel Insight
                      </p>

                      <h3 className="mt-2 font-serif text-[19px] leading-tight">
                        Article title
                      </h3>

                      <p className="mt-2 text-[9px] leading-[1.5] opacity-55">
                        Article description
                      </p>

                    </div>
                  </article>
                )
              )}

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

    const image =
      getBackgroundImage(section)

    const imageAlt =
      getBackgroundImageAlt(section)

    return (
      <section
        className="
          relative
          w-full
          overflow-hidden
        "
        style={{
          backgroundColor:
            section.bgColor ??
            primaryColor,
        }}
      >

        {/* IMAGE */}

        {image && (
          <img
            src={image}
            alt={imageAlt}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />
        )}

        {/* OVERLAY */}

        <div
          className="absolute inset-0"
          style={{
            backgroundColor:
              "rgba(31,58,27,0.78)",
          }}
        />

        {/* CONTENT */}

        <div className="relative z-10 mx-auto max-w-[1180px] px-7 py-20 md:px-14 md:py-28">

          <div className="max-w-[720px]">

            {content.titleLine1 && (
              <h2
                className="
                  font-serif
                  text-[40px]
                  leading-[1]
                  tracking-[-1px]
                  md:text-[58px]
                "
                style={{
                  color:
                    lightText,
                }}
              >
                {content.titleLine1}

                {content.titleHighlight && (
                  <>
                    {" "}
                    <span
                      style={{
                        color:
                          accentColor,
                      }}
                    >
                      {
                        content.titleHighlight
                      }
                    </span>
                  </>
                )}
              </h2>
            )}

            {content.description && (
              <p
                className="
                  mt-6
                  max-w-[560px]
                  text-[11px]
                  leading-[1.8]
                "
                style={{
                  color:
                    "rgba(255,255,255,0.78)",
                }}
              >
                {
                  content.description
                }
              </p>
            )}

            {renderButtons(
              section.buttons
            )}

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
    </div>
  )
}