import { THEME_COLORS } from "@/config/theme"
import type { StoriesCmsPreviewSectionProps } from "../../storiesCmsTypes"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"

export function StoriesCmsMiraStoriesPreview({ draft }: StoriesCmsPreviewSectionProps) {
  if (!draft) return null

  const miraStoriesData =
    draft.mira_stories || draft?.data?.mira_stories || {}

  const eyebrow = miraStoriesData.eyebrow
  const title = miraStoriesData.title
  const description = miraStoriesData.description
  const items = Array.isArray(miraStoriesData.items) ? miraStoriesData.items : []
  const buttons = Array.isArray(miraStoriesData.buttons) ? miraStoriesData.buttons : []
  const backgroundMultimedia = miraStoriesData.backgroundMultimedia
  const leftSideMultimedia = miraStoriesData.leftSideMultimedia

  return (
    <section
      data-section="mira_stories"
      className="relative w-full overflow-hidden py-14 md:py-20 lg:py-24"
    >
      <UniversalMultimediaPreview
        multimedia={backgroundMultimedia}
        fallbackAlt="Mira Stories background"
        fallbackColor={THEME_COLORS.bgWarm}
        mode="background"
        overlayClassName="bg-white/70 dark:bg-background/80"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 max-w-7xl">
        {/* Left Side Multimedia Card */}
        <div className="w-full lg:w-1/2 aspect-[4/3] max-h-[500px] overflow-hidden rounded-xl shadow-md shrink-0">
          <UniversalMultimediaPreview
            multimedia={leftSideMultimedia}
            fallbackAlt="Mira Stories editorial"
            fallbackColor={THEME_COLORS.mediaPlaceholder}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Content Column */}
        <div className="flex w-full lg:w-1/2 flex-col items-start">
          <div className="flex w-full flex-col items-start gap-4">
            {eyebrow && (
              <DynamicStyledTextPreview
                as="p"
                data={eyebrow}
                fallbackColor={THEME_COLORS.goldMuted}
                className="text-xs md:text-sm font-semibold uppercase tracking-widest text-gold-muted"
              />
            )}

            {title && (
              <DynamicStyledTextPreview
                as="h2"
                data={title}
                fallbackColor={THEME_COLORS.primary}
                className="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight text-brand-primary"
              />
            )}

            {description && (
              <DynamicStyledTextPreview
                as="p"
                data={description}
                fallbackColor={THEME_COLORS.sub}
                className="text-sm md:text-base leading-relaxed text-sub max-w-xl"
              />
            )}
          </div>

          {/* Story Items List */}
          <div className="flex w-full flex-col gap-5 mt-8 border-t border-border/50 pt-6">
            {items.length > 0
              ? items.map((item: any, index: number) => (
                  <a
                    key={index}
                    href={item.button?.url || item.url || "#"}
                    className="group flex items-start gap-4 transition-opacity hover:opacity-80"
                  >
                    <span className="mt-0.5 text-sm font-semibold tracking-wider text-gold-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex flex-col gap-1">
                      <DynamicStyledTextPreview
                        as="h3"
                        data={item.title}
                        fallbackColor={THEME_COLORS.primary}
                        className="font-heading text-lg md:text-xl font-medium text-brand-primary group-hover:text-accent transition-colors"
                      />

                      <DynamicStyledTextPreview
                        as="p"
                        data={item.subtitle}
                        fallbackColor={THEME_COLORS.sub}
                        className="text-xs md:text-sm font-normal text-sub"
                      />
                    </div>
                  </a>
                ))
              : [1, 2].map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <span className="mt-0.5 text-sm font-semibold tracking-wider text-gold-muted">
                      {String(item).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-heading text-lg font-medium text-brand-primary">
                        Sample Story Title
                      </h3>
                      <p className="text-xs text-sub">
                        Sample story subtitle description...
                      </p>
                    </div>
                  </div>
                ))}
          </div>

          {/* CTA Buttons */}
          {buttons.length > 0 && (
            <div className="mt-8">
              <DynamicCmsButtonPreview buttons={buttons} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default StoriesCmsMiraStoriesPreview
