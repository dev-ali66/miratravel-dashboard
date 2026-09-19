import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { emptyStay } from "./emptyStay"
import { normalizeStay } from "./normalizeStay"

interface StayPreviewProps {
  section?: any
}

// Inline ambient star SVG
function StarSparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 40"
      fill="currentColor"
      className={`pointer-events-none select-none absolute text-[#E5A84B] ${className}`}
    >
      <path
        d="M12 0 C12 12 14 18 24 20 C14 22 12 28 12 40 C12 28 10 22 0 20 C10 18 12 12 12 0 Z"
        opacity="0.6"
      />
    </svg>
  )
}

export function StayPreview({ section }: StayPreviewProps) {
  const normalized = normalizeStay(section)

  const title = normalized.title || emptyStay.title
  const itemsList =
    Array.isArray(normalized.items) && normalized.items.length > 0
      ? normalized.items
      : emptyStay.items
  const closingText = normalized.closingText || emptyStay.closingText
  const bgMedia = normalized.backgroundMultimedia

  return (
    <section className="relative w-full overflow-hidden bg-background py-16 md:py-24 xl:py-32">
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 md:px-8 lg:px-12">
        <div className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden rounded-[2px] bg-[#182D09] px-6 py-14 text-center sm:px-10 sm:py-16 md:px-16 md:py-20 xl:px-20 xl:py-24">
          {/* Universal Background Media (Color/Image/Video) */}
          {bgMedia && (
            <UniversalMultimediaPreview multimedia={bgMedia} mode="background" />
          )}

          {/* Ambient Star Sparkles */}
          <StarSparkle className="top-8 left-[18%] h-7 w-auto opacity-45 md:top-10" />
          <StarSparkle className="top-[18%] left-[58%] h-8 w-auto opacity-55" />
          <StarSparkle className="top-[40%] right-[8%] h-6 w-auto opacity-30" />
          <StarSparkle className="bottom-14 right-[14%] h-8 w-auto opacity-35" />
          <StarSparkle className="bottom-10 left-[12%] h-7 w-auto opacity-40" />

          {/* Centered Editorial Content */}
          <div className="relative z-10 flex w-full max-w-[768px] flex-col items-center">
            {/* Main Title */}
            <div className="mb-8 md:mb-10">
              <DynamicStyledTextPreview
                data={title}
                as="h2"
                fallbackColor="#F3F4F6"
                className="font-serif font-light text-[26px] leading-[34px] tracking-[-0.3px] text-neutral-100 sm:text-[32px] sm:leading-[42px] md:text-[36px] md:leading-[46px] xl:text-[42px] xl:leading-[50px]"
              />
            </div>

            {/* Poetic Sentence Items */}
            <div className="mb-6 flex flex-col items-center gap-2.5 md:mb-8 md:gap-3 xl:mb-9">
              {itemsList.map((item: any, sIdx: number) => {
                const itemVal = typeof item === "string" ? item : item?.value || ""
                if (!itemVal) return null
                return (
                  <DynamicStyledTextPreview
                    key={sIdx}
                    data={item}
                    as="p"
                    fallbackColor="#F3F4F6"
                    className="max-w-[600px] text-[13px] font-normal leading-6 text-neutral-100/80 sm:text-[14px] sm:leading-7 xl:text-[15px]"
                  />
                )
              })}
            </div>

            {/* Concluding Accent Text */}
            <div>
              <DynamicStyledTextPreview
                data={closingText}
                as="p"
                fallbackColor="#B86B3A"
                className="font-serif text-[13px] font-medium italic leading-6 tracking-[0.2px] text-[#B86B3A] sm:text-[14px] sm:leading-7 md:text-base"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StayPreview
