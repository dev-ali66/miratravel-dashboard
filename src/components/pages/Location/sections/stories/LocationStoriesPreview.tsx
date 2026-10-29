import { THEME_COLORS } from "@/config/theme"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"

export function LocationStoriesPreview({ draft }: LocationPreviewSectionProps) {
  if (!draft) return null

  const storiesData =
    draft?.stories ||
    (draft as any)?.data?.stories ||
    {}

  const rawItems = storiesData.items
  const items: any[] = Array.isArray(rawItems) ? rawItems : []

  return (
    <section
      id="stories"
      data-section="stories"
      className="relative w-full overflow-hidden pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"
    >
      {/* Background Media */}
      <UniversalMultimediaPreview
        multimedia={storiesData.backgroundMultimedia}
        fallbackAlt="Location stories background"
        fallbackColor={THEME_COLORS.bgWarm}
        mode="background"
        overlayClassName="bg-white/70 dark:bg-background/80"
      />

      <div className="relative z-10 container mx-auto px-4 lg:px-0 flex w-full max-w-[1336px] flex-col items-center justify-center lg:items-center gap-[38px] md:gap-[50px] lg:gap-[48px] lgx:gap-[56px] xl:gap-[64px] lg:flex-row">
        {/* Left Side Featured Media (Matching Home CMS Mira Stories 1:1) */}
        <div className="w-full aspect-[776/661] lg:w-[440px] lg:h-[375px] lgx:w-[500px] lgx:h-[426px] xlg:w-[580px] xlg:h-[494px] xl:w-[776px] xl:h-[661px] overflow-hidden shrink-0 rounded-lg">
          <UniversalMultimediaPreview
            multimedia={storiesData.leftSideMultimedia}
            fallbackAlt="Location stories editorial"
            fallbackColor={THEME_COLORS.mediaPlaceholder}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Side Header & Stories List */}
        <div className="flex w-full flex-col items-start lg:flex-1 xl:w-[550px] xl:flex-none">
          <div className="flex w-full flex-col items-start xl:gap-10 lgx:gap-9 md:gap-8 gap-6">
            <DynamicStyledTextPreview
              as="p"
              data={storiesData.eyebrow}
              fallbackText="The Editorial"
              fallbackColor={THEME_COLORS.goldMuted}
              className="text-sm md:text-[15px] font-normal xl:leading-4 leading-3 tracking-[1.5px] md:tracking-[2px] xl:tracking-[2.4px] uppercase"
            />

            <DynamicStyledTextPreview
              as="h2"
              data={storiesData.title}
              fallbackText="Location Stories"
              fallbackColor={THEME_COLORS.primary}
              className="font-heading max-w-[496px] font-semibold text-card-title tracking-[2px] md:tracking-[3px] xl:tracking-[4px] text-[36px] md:text-[52px] lgx:text-[56px] xl:text-[64px] leading-[44px] md:leading-[64px] lgx:leading-[70px] xl:leading-[80px] self-stretch"
            />

            <DynamicStyledTextPreview
              as="p"
              data={storiesData.description}
              fallbackText="A collection of personal, cultural and inspiring stories. Each piece offers a deeper view of this location and its people beyond the expected."
              fallbackColor={THEME_COLORS.sub}
              className="w-full text-sm sm:text-[15px] font-normal leading-[24px] sm:leading-[26px] md:leading-[28px] xl:leading-[30px] text-subtitle max-w-[550px]"
            />
          </div>

          {/* Stories Item List (Matching Home CMS Mira Stories) */}
          <div className="flex w-full flex-col gap-4 md:gap-6 lgx:gap-7 xl:gap-8 xl:mt-10 lgx:mt-9 md:mt-8 mt-6">
            {items.length > 0 ? (
              items.map((item: any, index: number) => {
                const storyUrl = item.button?.url || item.url || "#"

                return (
                  <a
                    key={index}
                    href={storyUrl}
                    className="group flex items-start gap-4 md:gap-6 lgx:gap-7 xl:gap-8 transition-opacity hover:opacity-80"
                  >
                    <span
                      className="mt-0.5 text-sm font-normal leading-5 tracking-wide text-muted transition-colors group-hover:text-accent font-mono text-gold-muted"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex flex-col gap-1 gap-[5px] xl:gap-1.5">
                      <DynamicStyledTextPreview
                        as="h3"
                        data={item.title}
                        fallbackText="Story title"
                        fallbackColor={THEME_COLORS.primary}
                        className="font-heading text-base md:text-[18px] xl:text-[20px] font-medium leading-5 md:leading-6 xl:leading-7 text-card-title transition-colors group-hover:text-primary"
                      />

                      <DynamicStyledTextPreview
                        as="p"
                        data={item.subtitle}
                        fallbackText="Story summary"
                        fallbackColor={THEME_COLORS.sub}
                        className="text-xs md:text-[13px] xl:text-sm font-normal xl:leading-5 leading-[18px] text-muted"
                      />
                    </div>
                  </a>
                )
              })
            ) : (
              [1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="group flex items-start gap-4 md:gap-6 lgx:gap-7 xl:gap-8 opacity-75"
                >
                  <span
                    className="mt-0.5 text-sm font-normal leading-5 tracking-wide text-muted font-mono"
                    style={{ color: THEME_COLORS.goldMuted }}
                  >
                    {String(item).padStart(2, "0")}
                  </span>

                  <div className="flex flex-col gap-1 gap-[5px] xl:gap-1.5">
                    <h3 className="font-heading text-base md:text-[18px] xl:text-[20px] font-medium leading-5 md:leading-6 xl:leading-7 text-card-title">
                      Story title
                    </h3>

                    <p className="text-xs md:text-[13px] xl:text-sm font-normal xl:leading-5 leading-[18px] text-muted">
                      Story subtitle
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section Action CTA Buttons */}
          <div className="w-full md:w-auto xl:mt-10 lgx:mt-9 md:mt-8 mt-6">
            <div className="w-full md:w-[280px]">
              <DynamicCmsButtonPreview buttons={storiesData.buttons} defaultVariant="primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationStoriesPreview
