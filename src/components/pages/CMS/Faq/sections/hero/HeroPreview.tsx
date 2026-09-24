import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { emptyFaqHero } from "../../config/emptyFaqPayload"

export interface HeroPreviewProps {
  section?: any
}

export function HeroPreview({ section }: HeroPreviewProps) {
  const hero = section || emptyFaqHero

  return (
    <section className="w-full pt-[130px] md:pt-[150px] lg:pt-[170px] xl:pt-[180px] pb-[30px] overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="w-full flex flex-col lg:flex-row gap-0">
          {/* Left Column: Content, Typography, and Support Callout */}
          <div className="flex w-full lg:w-[44%] xl:w-[40%] shrink-0 flex-col justify-start gap-5 md:gap-6 xl:gap-7 items-start lg:px-10 py-6 md:py-8 lg:py-10 xl:py-12">
            <div className="flex w-full flex-col items-start">
              {/* Eyebrow / Category */}
              {hero.eyebrow && (
                <div className="mb-2.5 md:mb-3 xl:mb-3.5 flex items-center">
                  <DynamicStyledTextPreview
                    as="span"
                    data={hero.eyebrow}
                    className="text-xs md:text-[13px] md:text-sm font-semibold uppercase tracking-[1.32px] text-accent xl:leading-[16.5px] md:leading-[15.5px] leading-[12.5px]"
                  />
                </div>
              )}

              {/* Main Title */}
              {hero.title && (
                <DynamicStyledTextPreview
                  as="h1"
                  data={hero.title}
                  className="font-heading self-stretch font-semibold text-dashboard-title-dark text-[32px] leading-[38px] md:text-[38px] md:leading-[46.9px] lg:text-[42px] lgx:leading-[50.9px] xl:text-[46px] xl:leading-[52.9px] mb-3 md:mb-3.5 xl:mb-4"
                />
              )}

              {/* Subtitle / Description */}
              {hero.description && (
                <DynamicStyledTextPreview
                  as="p"
                  data={hero.description}
                  className="text-dashboard-muted text-sm md:text-[15px] leading-4 md:leading-[19.5px] xl:text-base leading-[22.275px] max-w-[340px] mb-2 md:mb-2.5"
                />
              )}

              {/* Decorative Accent Divider */}
              <div className="flex items-center gap-2.5" aria-hidden="true">
                <div className="h-[1.5px] w-12 rounded-[1px] bg-accent/80" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="21"
                  viewBox="0 0 13 21"
                  fill="none"
                  className="w-[7px] h-[11px] shrink-0 text-accent"
                  aria-hidden="true"
                >
                  <path
                    d="M6.5 0C6.5 6 9.5 10.5 13 10.5C9.5 10.5 6.5 15 6.5 21C6.5 15 3.5 10.5 0 10.5C3.5 10.5 6.5 6 6.5 0Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* Help Callout Card */}
            <div className="w-full lg:w-auto">
              <a
                href="/contact-us"
                className="group flex items-center gap-2 md:gap-2.5 xl:gap-3"
              >
                {/* Support Chat Icon Badge */}
                <div className="xl:size-9 md:size-8 size-[30px] rounded-full border border-dashboard-card-border flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="size-3.5 md:size-4 xl:size-5 shrink-0"
                  >
                    <path
                      d="M2.5 15V10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10V15"
                      stroke="#7A8475"
                      strokeWidth="1.41667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.5 15.8337C17.5 16.2757 17.3244 16.6996 17.0118 17.0122C16.6993 17.3247 16.2754 17.5003 15.8333 17.5003H15C14.558 17.5003 14.134 17.3247 13.8215 17.0122C13.5089 16.6996 13.3333 16.2757 13.3333 15.8337V13.3337C13.3333 12.8916 13.5089 12.4677 13.8215 12.1551C14.134 11.8426 14.558 11.667 15 11.667H17.5V15.8337ZM2.5 15.8337C2.5 16.2757 2.67559 16.6996 2.98816 17.0122C3.30072 17.3247 3.72464 17.5003 4.16667 17.5003H5C5.44203 17.5003 5.86595 17.3247 6.17851 17.0122C6.49107 16.6996 6.66667 16.2757 6.66667 15.8337V13.3337C6.66667 12.8916 6.49107 12.4677 6.17851 12.1551C5.86595 11.8426 5.44203 11.667 5 11.667H2.5V15.8337Z"
                      stroke="#7A8475"
                      strokeWidth="1.41667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Text Description */}
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-0.5">
                    <DynamicStyledTextPreview
                      as="span"
                      data={hero.helpTitle}
                      fallbackText="Can't find your answer?"
                      className="text-sm font-semibold text-dashboard-title-dark group-hover:text-accent transition-colors duration-200"
                    />
                    <svg
                      className="size-3.5 text-accent opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <DynamicStyledTextPreview
                    as="span"
                    data={hero.helpSubtitle}
                    fallbackText="Our Mira Travel Specialist are always happy to help."
                    className="text-xs md:text-[13px] xl:text-sm text-dashboard-muted xl:leading-[18.75px] md:leading-4 leading-3.5"
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Panoramic Visual Image with Compass Rose Watermark */}
          <div className="w-full lg:flex-1 min-h-[280px] md:min-h-[380px] xlg:h-[420px] xl:h-[438px] relative overflow-hidden group rounded-xl">
            <UniversalMultimediaPreview
              multimedia={hero.imageMultimedia}
              fallbackAlt="Travel guidance and frequently asked questions"
              mode="inline"
              className="w-full h-full min-h-[280px] md:min-h-[380px] xlg:h-[420px] xl:h-[438px] object-cover object-center"
            />

            {/* Subtle Gradient Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-black/35 via-black/10 to-transparent pointer-events-none z-10"
              aria-hidden="true"
            />

            {/* Compass Rose Watermark Emblem */}
            <div
              className="pointer-events-none absolute left-5 top-5 md:left-[35%] md:top-9 size-20 md:size-[90px] lgx:size-[100px] mid:size-[110px] xl:size-[126px] opacity-80 backdrop-blur-[1px] z-20"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-full text-neutral-100 opacity-50"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                  opacity="0.6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  opacity="0.4"
                />
                <line x1="50" y1="6" x2="50" y2="94" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                <line x1="6" y1="50" x2="94" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                <polygon points="50,14 53,47 50,50 47,47" fill="currentColor" opacity="0.9" />
                <polygon points="50,86 53,53 50,50 47,53" fill="currentColor" opacity="0.9" />
                <polygon points="14,50 47,47 50,50 47,53" fill="currentColor" opacity="0.9" />
                <polygon points="86,50 53,47 50,50 53,53" fill="currentColor" opacity="0.9" />
                <polygon points="26,26 48,47 50,50 47,48" fill="currentColor" opacity="0.6" />
                <polygon points="74,26 53,48 50,50 52,47" fill="currentColor" opacity="0.6" />
                <polygon points="26,74 47,52 50,50 48,53" fill="currentColor" opacity="0.6" />
                <polygon points="74,74 52,53 50,50 53,52" fill="currentColor" opacity="0.6" />
                <circle cx="50" cy="50" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroPreview
