import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

export type ApproachPreviewProps = {
  section: any
}

export function ApproachPreview({ section }: ApproachPreviewProps) {
  if (!section) return null

  return (
    <section className="relative py-16 sm:py-20 px-6 sm:px-12 lg:px-20 overflow-hidden bg-[#FAF6F0]">
      {/* Background Media */}
      {section.backgroundMultimedia && (
        <UniversalMultimediaPreview multimedia={section.backgroundMultimedia} mode="background" />
      )}

      {/* Background Decorative Starbursts */}
      <div className="absolute top-8 left-1/3 opacity-15 pointer-events-none select-none text-[#E5A84B]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
        </svg>
      </div>
      <div className="absolute bottom-12 right-1/3 opacity-15 pointer-events-none select-none text-[#E5A84B]">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* COLUMN 1 (LEFT): Eyebrow, Title & Tall Portrait Media (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2.5">
              <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#E5A84B]">
                <DynamicStyledTextPreview as="span" data={section.eyebrow} />
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] lg:leading-[52px] font-serif font-light text-[#182D09]">
                <DynamicStyledTextPreview as="span" data={section.title} />
              </h2>
            </div>

            <div className="relative h-[360px] sm:h-[420px] w-full rounded-xl overflow-hidden shadow-sm border border-black/5">
              <UniversalMultimediaPreview multimedia={section.leftMultimedia} />
            </div>
          </div>

          {/* COLUMN 2 (MIDDLE): Long Description Paragraphs (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4 pt-1 lg:pt-14 text-xs sm:text-sm leading-relaxed text-[#5A6258]">
            <DynamicStyledTextPreview as="div" data={section.description} />
          </div>

          {/* COLUMN 3 (RIGHT): Top Media, MIRA Badge & Highlight Quote (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6 lg:pt-0">
            <div className="relative">
              <div className="relative h-[280px] sm:h-[340px] w-full rounded-xl overflow-hidden shadow-sm border border-black/5">
                <UniversalMultimediaPreview multimedia={section.rightMultimedia} />
              </div>

              {/* Circular MIRA Stamp Badge */}
              <div className="absolute -bottom-5 -left-5 sm:-bottom-6 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E5E0D8] border-2 border-[#FAF6F0] shadow-md flex items-center justify-center z-20">
                <span className="text-[11px] sm:text-xs font-serif font-semibold tracking-widest text-[#182D09] uppercase">
                  MIRA
                </span>
              </div>
            </div>

            {section.quote && (
              <div className="pt-3 italic text-xs sm:text-sm leading-relaxed text-[#E5A84B] font-serif pl-2">
                <DynamicStyledTextPreview as="span" data={section.quote} />
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

export default ApproachPreview
