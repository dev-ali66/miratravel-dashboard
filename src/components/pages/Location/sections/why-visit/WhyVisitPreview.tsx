import type { LocationPreviewSectionProps } from "../../config/locationSections"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"

export function WhyVisitPreview({ draft }: LocationPreviewSectionProps) {
  if (!draft) return null

  const whyData = draft.why || {}

  const rawParagraphs = whyData.description_paragraphs
  const paragraphs: string[] =
    Array.isArray(rawParagraphs)
      ? rawParagraphs
      : typeof whyData.description === "string" && whyData.description.trim()
        ? [whyData.description]
        : []

  const tags: string[] = Array.isArray(whyData.tags) ? whyData.tags : []

  return (
    <div className="relative w-full py-10 md:py-14 lg:py-16 overflow-hidden">
      <UniversalMultimediaPreview
        multimedia={whyData.backgroundMultimedia}
        fallbackColor="#FFFFFF"
        mode="background"
      />

      <div className="@container container mx-auto px-4 lg:px-6 relative z-10">
        <div className="mx-auto flex w-full flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-10 xl:gap-12">
          {/* Left Text Block */}
          <div className="flex w-full flex-col items-start lg:w-1/2 flex-1 gap-6">
            <div className="flex w-full flex-col items-start gap-3">
              {/* Tagline / Eyebrow */}
              <DynamicStyledTextPreview
                as="span"
                data={whyData.subtitle}
                className="text-xs md:text-sm xl:text-base font-semibold uppercase leading-5 tracking-[1.8px] text-accent"
              />

              {/* Main Heading */}
              <DynamicStyledTextPreview
                as="h2"
                data={whyData.title}
                className="text-2xl md:text-[32px] lgx:text-[36px] xl:text-[40px] font-semibold font-heading leading-[34px] md:leading-[42px] xl:leading-[50px] text-primary"
              />
            </div>

            {/* Paragraphs */}
            {paragraphs.length > 0 && (
              <div className="flex w-full flex-col items-start gap-4 text-neutral-600 text-sm md:text-base font-normal leading-6 md:leading-7">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-justify leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Right Side (Tags + Media Container) */}
          <div className="flex w-full flex-col items-start lg:items-end justify-end gap-4 lg:w-1/2 flex-1">
            {/* Tag Pills */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2.5">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex h-[24px] items-center justify-center rounded-full border border-neutral-300 px-3 py-1 bg-white/80 backdrop-blur-sm text-[#182d09]"
                  >
                    <span className="text-[12px] font-medium leading-4">{tag}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Featured Image / Media Container */}
            <div className="relative w-full overflow-hidden rounded-lg h-[360px] md:h-[440px] lg:h-[480px] xl:h-[520px]">
              <UniversalMultimediaPreview
                multimedia={whyData.imageMultimedia}
                fallbackColor="#EDE7D8"
                mode="background"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
