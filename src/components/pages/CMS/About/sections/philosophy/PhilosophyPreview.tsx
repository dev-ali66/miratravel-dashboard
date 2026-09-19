import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

export type PhilosophyPreviewProps = {
  section: any
}

export function PhilosophyPreview({ section }: PhilosophyPreviewProps) {
  if (!section) return null

  const multimedias: any[] = Array.isArray(section.multimedias)
    ? section.multimedias
    : [section.multimedia1, section.multimedia2, section.multimedia3].filter(Boolean)

  const m0 = multimedias[0]
  const m1 = multimedias[1]
  const m2 = multimedias[2]
  const extraMedia = multimedias.slice(3)

  return (
    <section className="relative py-16 sm:py-20 px-6 sm:px-12 lg:px-20 overflow-hidden bg-[#FAF6F0]">
      {/* Background Media */}
      {section.backgroundMultimedia && (
        <UniversalMultimediaPreview multimedia={section.backgroundMultimedia} mode="background" />
      )}

      {/* Background Decorative Starburst Icons */}
      <div className="absolute top-1/3 right-1/4 opacity-15 pointer-events-none select-none text-[#E5A84B]">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
        </svg>
      </div>
      <div className="absolute top-1/2 left-4 opacity-15 pointer-events-none select-none text-[#E5A84B]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto space-y-10 sm:space-y-12">
        {/* TOP HEADER: Eyebrow & Title */}
        <div className="max-w-xl space-y-2.5">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#E5A84B]">
            <DynamicStyledTextPreview as="span" data={section.eyebrow} />
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] lg:leading-[52px] font-serif font-light text-[#182D09]">
            <DynamicStyledTextPreview as="span" data={section.title} />
          </h2>
        </div>

        {/* BOTTOM GRID: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Column 1: Main Portrait Image (lg:col-span-4) */}
          <div className="lg:col-span-4 relative min-h-[340px] sm:min-h-[400px] rounded-xl overflow-hidden shadow-sm border border-black/5">
            {m0 && <UniversalMultimediaPreview multimedia={m0} />}
          </div>

          {/* Column 2: Stacked 2 Landscape Images (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div className="relative h-[160px] sm:h-[190px] rounded-xl overflow-hidden shadow-sm border border-black/5">
              {m1 && <UniversalMultimediaPreview multimedia={m1} />}
            </div>
            <div className="relative h-[160px] sm:h-[190px] rounded-xl overflow-hidden shadow-sm border border-black/5">
              {m2 && <UniversalMultimediaPreview multimedia={m2} />}
            </div>
          </div>

          {/* Column 3: Description Paragraphs & Highlight Quote (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 pt-1">
            <div className="text-sm sm:text-[15px] leading-relaxed text-[#5A6258] space-y-4">
              <DynamicStyledTextPreview as="div" data={section.description} />
            </div>

            {section.quote && (
              <div className="italic text-sm sm:text-base text-[#E5A84B] font-serif pt-1">
                <DynamicStyledTextPreview as="span" data={section.quote} />
              </div>
            )}
          </div>
        </div>

        {/* EXTRA MEDIA ITEMS GRID (If > 3 items added) */}
        {extraMedia.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-black/5">
            {extraMedia.map((mItem: any, idx: number) => (
              <div key={idx} className="relative h-[200px] rounded-xl overflow-hidden shadow-sm border border-black/5">
                <UniversalMultimediaPreview multimedia={mItem} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PhilosophyPreview
