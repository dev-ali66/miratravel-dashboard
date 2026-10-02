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
        fallbackColor="#FCFBF9"
        mode="background"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 max-w-7xl">
        {/* Left Side Multimedia Card */}
        <div className="w-full lg:w-1/2 aspect-[4/3] max-h-[500px] overflow-hidden rounded-xl shadow-md shrink-0">
          <UniversalMultimediaPreview
            multimedia={leftSideMultimedia}
            fallbackAlt="Mira Stories editorial"
            fallbackColor="#E5E7EB"
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
                fallbackColor="#C5A880"
                className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#C5A880]"
              />
            )}

            {title && (
              <DynamicStyledTextPreview
                as="h2"
                data={title}
                fallbackColor="#182D09"
                className="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight text-[#182D09]"
              />
            )}

            {description && (
              <DynamicStyledTextPreview
                as="p"
                data={description}
                fallbackColor="#4B5563"
                className="text-sm md:text-base leading-relaxed text-[#4B5563] max-w-xl"
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
                    <span className="mt-0.5 text-sm font-semibold tracking-wider text-[#C5A880]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex flex-col gap-1">
                      <DynamicStyledTextPreview
                        as="h3"
                        data={item.title}
                        fallbackColor="#182D09"
                        className="font-heading text-lg md:text-xl font-medium text-[#182D09] group-hover:text-[#AF6348] transition-colors"
                      />

                      <DynamicStyledTextPreview
                        as="p"
                        data={item.subtitle}
                        fallbackColor="#4B5563"
                        className="text-xs md:text-sm font-normal text-[#4B5563]"
                      />
                    </div>
                  </a>
                ))
              : [1, 2].map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <span className="mt-0.5 text-sm font-semibold tracking-wider text-[#C5A880]">
                      {String(item).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-heading text-lg font-medium text-[#182D09]">
                        Sample Story Title
                      </h3>
                      <p className="text-xs text-[#4B5563]">
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
