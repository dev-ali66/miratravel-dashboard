import { useCmsDraft } from "../shared/CmsDraftContext"

import type {
  HomeButton,
  HomePageData,
  HomeSection,
} from "./homeTypes"
import { cn } from "@/lib/utils"

import { homeSectionOrder, homeSectionRegistry } from "./config/homeSections"

const PREVIEW_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"
const PREVIEW_VIDEO_SOURCE =
  "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beach-1576/1080p.mp4"

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

const getHomeSectionEntry = (key: string) => {
  return homeSectionRegistry[key as keyof typeof homeSectionRegistry]
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

  const sortedSections = homeSectionOrder
    .map((key) => sections.find((section) => section.key === key))
    .filter(Boolean) as HomeSection[]

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
   * SECTION RENDERER
   * ============================================================
   */

  const renderSection = (section: HomeSection) => {
    const entry = getHomeSectionEntry(section.key)

    if (!entry) {
      return null
    }

    const SectionPreview = entry.preview

    return (
      <SectionPreview
        section={section}
        accentColor={accentColor}
        darkText={darkText}
        primaryColor={primaryColor}
        lightText={lightText}
        renderButtons={renderButtons}
      />
    )
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