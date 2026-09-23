import { getStr, getStyleObj } from "../../shared/previewHelpers"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

function MiraStarIcon() {
  return (
    <svg
      viewBox="757.62 552.4 484.76 895.2"
      className="w-[18px] h-[26px] md:w-[22px] md:h-[30px] xl:w-[24px] xl:h-[32px] text-[#af6348] fill-current shrink-0 inline-block"
      aria-hidden="true"
    >
      <polygon points="1029.99,1000 1000.04,1447.6 970.01,1000 1000.04,552.4" />
      <polygon points="1000,1029.99 757.62,1000.03 1000,970.01 1242.38,1000.03" />
      <polygon points="1028.15,999.97 1115.35,884.65 999.98,971.81 884.62,884.65 971.82,999.97 884.62,1115.38 999.98,1028.15 1115.35,1115.38" />
    </svg>
  )
}

const TITLE_CSS =
  "text-2xl tracking-normal leading-8 " +
  "md:text-4xl md:tracking-[0.5px] md:leading-10 " +
  "lg:text-[36px] lg:tracking-[1px] lg:leading-[42px] " +
  "lgx:text-[38px] lgx:tracking-[1.2px] lgx:leading-[44px] " +
  "xlg:text-[38px] xlg:tracking-[1.5px] xlg:leading-[46px] " +
  "mid:text-[40px] mid:tracking-[2px] mid:leading-[48px] " +
  "xl:text-[40px] xl:tracking-[2px] xl:leading-[48px] " +
  "font-serif font-medium"

export function WhyDesignedPreview({ whyDesigned, draft }: { whyDesigned?: any; draft?: any }) {
  const safeData = whyDesigned || draft?.whyDesigned || draft?.data?.whyDesigned || {}

  const badgeText = getStr(safeData.badge, "THE MIRA DIFFERENCE")
  const titleText = getStr(safeData.title, "Why we designed this journey?")
  const rawSignature = getStr(safeData.signature, "MIRA")
  const signatureText = rawSignature ? rawSignature.replace(/^[—–-]\s*/, "") : "MIRA"

  return (
    <section className="relative w-full py-8 md:py-12 overflow-hidden">
      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-6 md:gap-8 max-w-4xl">
          {/* Eyebrow / Badge */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <MiraStarIcon />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-[2.5px]" style={getStyleObj(safeData.badge, "#af6348")}>
                {badgeText}
              </span>
              <span className="w-24 md:w-32 h-[1px] bg-[#af6348]/40 inline-block" />
            </div>
            <h2 className={TITLE_CSS} style={getStyleObj(safeData.title, "#313131")}>
              {titleText}
            </h2>
          </div>

          {/* Description Paragraphs */}
          <div className="flex flex-col gap-4 text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[27px] tracking-[1.5px]">
            <DynamicStyledTextPreview
              data={safeData.description ?? safeData.overviewText}
              fallbackText="Viverra blandit neque ac risus euismod tincidunt ut nec velit. Hendrerit potenti eleifend hendrerit lobortis enim duis duis rhoncus vulputate. Integer volutpat purus feugiat eros sed volutpat mauris faucibus."
              className="text-[#464136] text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[27px] tracking-[1.5px]"
            />

            {/* Signature Line */}
            <div className="flex items-center justify-end font-serif text-xl md:text-2xl font-normal leading-7 tracking-[2px] pt-4 gap-2" style={getStyleObj(safeData.signature, "#af6348")}>
              <span className="w-6 md:w-8 h-[1.5px] bg-[#af6348] inline-block shrink-0" aria-hidden="true" />
              <span>{signatureText}</span>
              <MiraStarIcon />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

