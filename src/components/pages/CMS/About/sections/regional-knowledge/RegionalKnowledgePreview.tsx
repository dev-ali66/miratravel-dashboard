import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

export type RegionalKnowledgePreviewProps = {
  section: any
}

export function RegionalKnowledgePreview({ section }: RegionalKnowledgePreviewProps) {
  if (!section) return null

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20 lg:py-24 bg-[#FAF7F2]">
      {section.backgroundMultimedia && (
        <UniversalMultimediaPreview multimedia={section.backgroundMultimedia} mode="background" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left Column: Eyebrow + Heading + Intro Text + Wide Bottom Image */}
          <div className="lg:col-span-7 flex flex-col items-start w-full">
            <div className="flex flex-col items-start mb-3 max-w-[379px] w-full">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-[2.64px] mb-1">
                <DynamicStyledTextPreview as="span" data={section.eyebrow} fallbackColor="#B86B3A" />
              </span>
              <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
                <DynamicStyledTextPreview as="span" data={section.title} fallbackColor="#182D09" />
              </h2>
            </div>

            <div className="text-sm sm:text-base leading-relaxed text-[#4B5563] mb-8 w-full max-w-[1104px] whitespace-pre-line">
              <DynamicStyledTextPreview as="div" data={section.description} fallbackColor="#4B5563" />
            </div>

            <div className="relative w-full aspect-[16/9] lg:aspect-[1106/480] overflow-hidden rounded-md shadow-sm">
              <UniversalMultimediaPreview multimedia={section.multimedia1} />
            </div>
          </div>

          {/* Right Column: Top Image + Bordered Detailed Editorial Text */}
          <div className="lg:col-span-5 flex flex-col items-start w-full pt-0 lg:pt-14 xl:pt-16">
            <div className="relative w-full aspect-[16/9] lg:aspect-[533/288] overflow-hidden rounded-md shadow-sm mb-6 xl:mb-8">
              <UniversalMultimediaPreview multimedia={section.multimedia2} />
            </div>

            {section.secondaryDescription && (
              <div className="pl-6 border-l-2 border-[#B86B3A] text-sm sm:text-base leading-relaxed text-[#4B5563] whitespace-pre-line w-full">
                <DynamicStyledTextPreview as="div" data={section.secondaryDescription} fallbackColor="#4B5563" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegionalKnowledgePreview


