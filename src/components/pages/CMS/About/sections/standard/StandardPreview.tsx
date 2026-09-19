import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

export type StandardPreviewProps = {
  section: any
}

export function StandardPreview({ section }: StandardPreviewProps) {
  if (!section) return null

  const itemsList = Array.isArray(section.items) ? section.items : []

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20 lg:py-24 bg-[#FAF7F2]">
      {section.backgroundMultimedia && (
        <UniversalMultimediaPreview multimedia={section.backgroundMultimedia} mode="background" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* Left Column: Featured Photo */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[820/778] overflow-hidden rounded-md shadow-sm">
              <UniversalMultimediaPreview multimedia={section.multimedia} />
            </div>
          </div>

          {/* Right Column: Eyebrow + Title + Feature Items List */}
          <div className="lg:col-span-6 flex flex-col items-start w-full">
            <div className="flex flex-col items-start mb-6 md:mb-8">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-[2.64px] mb-2">
                <DynamicStyledTextPreview as="span" data={section.eyebrow} fallbackColor="#B86B3A" />
              </span>
              <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
                <DynamicStyledTextPreview as="span" data={section.title} fallbackColor="#182D09" />
              </h2>
            </div>

            {/* Features List */}
            <div className="flex flex-col w-full">
              {itemsList.map((item: any, idx: number) => {
                const itemIcon = item.icon || item.multimedia
                const hasIconUrl =
                  itemIcon &&
                  ((itemIcon.show === "image" && itemIcon.image?.url) ||
                    (itemIcon.show === "video" && itemIcon.video?.url) ||
                    (itemIcon.show === "color" && itemIcon.color?.color))

                return (
                  <div
                    key={idx}
                    className="pt-5 pb-4 md:pt-6 md:pb-5 border-t border-stone-300 flex flex-col gap-1.5 w-full"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      {hasIconUrl ? (
                        <div className="size-6 sm:size-7 xl:size-8 shrink-0 overflow-hidden rounded-sm flex items-center justify-center">
                          <UniversalMultimediaPreview
                            multimedia={itemIcon}
                            containerClassName="size-full"
                            className="size-full object-contain"
                          />
                        </div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 28 28"
                          fill="none"
                          className="size-5 sm:size-6 xl:size-7 shrink-0"
                        >
                          <path
                            d="M14 25C20.0751 25 25 20.0751 25 14C25 7.92487 20.0751 3 14 3C7.92487 3 3 7.92487 3 14C3 20.0751 7.92487 25 14 25Z"
                            stroke="#8B7355"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 8V14L18 16"
                            stroke="#8B7355"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      <h3 className="font-serif text-base sm:text-lg xl:text-xl font-light leading-snug">
                        <DynamicStyledTextPreview as="span" data={item.title} fallbackColor="#B86B3A" />
                      </h3>
                    </div>
                    <div className="text-xs sm:text-sm xl:text-base leading-relaxed text-[#4B5563]">
                      <DynamicStyledTextPreview as="div" data={item.description} fallbackColor="#4B5563" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StandardPreview
