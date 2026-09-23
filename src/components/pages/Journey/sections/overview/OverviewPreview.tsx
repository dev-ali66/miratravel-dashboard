import { getStr } from "../../shared/previewHelpers"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"

const TITLE_CSS =
  "text-[#313131] text-2xl tracking-normal leading-8 " +
  "md:text-4xl md:tracking-[0.5px] md:leading-10 " +
  "lg:text-[36px] lg:tracking-[1px] lg:leading-[42px] " +
  "lgx:text-[38px] lgx:tracking-[1.2px] lgx:leading-[44px] " +
  "xlg:text-[38px] xlg:tracking-[1.5px] xlg:leading-[46px] " +
  "mid:text-[40px] mid:tracking-[2px] mid:leading-[48px] " +
  "xl:text-[40px] xl:tracking-[2px] xl:leading-[48px] " +
  "font-serif font-medium"

export function OverviewPreview({ overview, draft }: { overview?: any; draft?: any }) {
  const safeData = overview || draft?.overview || draft?.data?.overview || {}

  // Part 1: Why
  const why = safeData.why || {}
  const whyBadgeText = getStr(why.badge, "THE MIRA DIFFERENCE")
  const whyTitleText = getStr(why.title, "Why we designed this journey?")
  const whySigText = getStr(why.signature, "MIRA")

  // Part 2: Overview
  const ov = safeData.overview || (safeData.title || safeData.description ? safeData : {})
  const ovTitleText = getStr(ov.title ?? safeData.title, "Journey Overview")

  // Part 3: Highlights
  const hl = safeData.heighlights || safeData.highlights || {}
  const hlTitleText = getStr(hl.title, "Highlights")
  const hlItems = Array.isArray(hl.items) ? hl.items : []

  // Part 4: Visual Story
  const vs = safeData.visualStory || safeData.visualReference || {}
  const vsEyebrowText = getStr(vs.eyebrow, "Visual Reference")
  const vsTitleText = getStr(vs.title, "Examples of the Accommodation Style")
  const vsItems = Array.isArray(vs.items) ? vs.items : []

  // Part 5: For You
  const fy = safeData.forYou || safeData.convince || {}
  const fyEyebrowText = getStr(fy.eyebrow, "Highlights")
  const fyTitleText = getStr(fy.title, "Is This Journey For You?")
  const fyItems = Array.isArray(fy.items) ? fy.items : []

  return (
    <section className="relative w-full py-8 md:py-12 overflow-hidden bg-background">
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 lg:px-0 flex flex-col gap-12">
        {/* ========================================================================= */}
        {/* PART 1: WHY WE DESIGNED THIS JOURNEY                                     */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4 max-w-5xl">
          {whyBadgeText && (
            <span className="text-xs font-bold uppercase tracking-widest text-[#af6348]">
              {whyBadgeText}
            </span>
          )}

          <h2 className={TITLE_CSS}>{whyTitleText}</h2>

          <DynamicStyledTextPreview
            data={why.description}
            fallbackText="Viverra blandit neque ac risus euismod tincidunt ut nec velit. Hendrerit potenti eleifend hendrerit lobortis enim duis duis rhoncus vulputate."
            className="text-[#464136] text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[27px] tracking-[1.5px]"
          />

          {whySigText && (
            <p className="flex items-center justify-end font-serif text-[#af6348] text-xl md:text-2xl font-normal leading-7 tracking-[2px] pt-2 gap-1.5">
              <span className="w-6 md:w-7 h-[1.5px] bg-[#af6348] inline-block shrink-0" />
              <span>{whySigText}</span>
              <svg
                viewBox="757.62 552.4 484.76 895.2"
                className="w-[18px] h-[26px] md:w-[22px] md:h-[30px] text-[#af6348] fill-current shrink-0"
                aria-hidden="true"
              >
                <polygon points="1029.99,1000 1000.04,1447.6 970.01,1000 1000.04,552.4" />
                <polygon points="1000,1029.99 757.62,1000.03 1000,970.01 1242.38,1000.03" />
                <polygon points="1028.15,999.97 1115.35,884.65 999.98,971.81 884.62,884.65 971.82,999.97 884.62,1115.38 999.98,1028.15 1115.35,1115.38" />
              </svg>
            </p>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PART 2: JOURNEY OVERVIEW                                                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4 max-w-5xl pt-8 border-t border-border/40">
          <h2 className={TITLE_CSS}>{ovTitleText}</h2>

          <DynamicStyledTextPreview
            data={ov.description ?? safeData.description ?? safeData.overviewText}
            fallbackText="Immerse yourself in the timeless beauty and rich history of Italy on this carefully curated 7-day journey."
            className="text-[#464136] text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[27px] tracking-[1.5px]"
          />
        </div>

        {/* ========================================================================= */}
        {/* PART 3: HIGHLIGHTS                                                        */}
        {/* ========================================================================= */}
        {hlItems.length > 0 && (
          <div className="flex flex-col gap-5 max-w-5xl pt-8 border-t border-border/40">
            <h3 className={TITLE_CSS}>{hlTitleText}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {hlItems.map((item: any, idx: number) => {
                const titleVal = typeof item === "string" ? item : item?.title
                return (
                  <div key={idx} className="flex items-start gap-2.5 text-sm md:text-base">
                    <span className="text-[#af6348] font-bold">✓</span>
                    <DynamicStyledTextPreview
                      data={titleVal}
                      fallbackText="Highlight item detail"
                      className="text-[#464136] leading-6 tracking-[0.5px]"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PART 4: VISUAL REFERENCE                                                  */}
        {/* ========================================================================= */}
        {vsItems.length > 0 && (
          <div className="flex flex-col gap-5 w-full pt-8 border-t border-border/40">
            <div className="flex flex-col gap-2 max-w-4xl">
              {vsEyebrowText && (
                <span className="text-xs font-bold uppercase tracking-widest text-[#af6348]">
                  {vsEyebrowText}
                </span>
              )}
              <h2 className={TITLE_CSS}>{vsTitleText}</h2>

              {vs.description && (
                <DynamicStyledTextPreview
                  data={vs.description}
                  className="text-[#565e69] text-sm md:text-base leading-6 tracking-[0.5px]"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {vsItems.map((media: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-border/50 shadow-xs h-48 sm:h-56 relative bg-muted/20"
                >
                  <UniversalMultimediaPreview multimedia={media} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PART 5: IS THIS JOURNEY FOR YOU?                                         */}
        {/* ========================================================================= */}
        {fyItems.length > 0 && (
          <div className="flex flex-col gap-5 max-w-5xl pt-8 border-t border-border/40">
            <div className="flex flex-col gap-2">
              {fyEyebrowText && (
                <span className="text-xs font-bold uppercase tracking-widest text-[#313131]">
                  {fyEyebrowText}
                </span>
              )}
              <h2 className={TITLE_CSS}>{fyTitleText}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
              {fyItems.map((item: any, idx: number) => {
                const titleVal = typeof item === "string" ? item : item?.title
                return (
                  <div key={idx} className="flex items-start gap-2.5 text-sm md:text-base">
                    <span className="text-[#af6348] font-bold">✓</span>
                    <DynamicStyledTextPreview
                      data={titleVal}
                      fallbackText="Consideration item detail"
                      className="text-[#464136] leading-6 tracking-[0.5px]"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default OverviewPreview
