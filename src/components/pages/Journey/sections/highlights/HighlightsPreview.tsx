import { getStr, getStyleObj } from "../../shared/previewHelpers"

const TITLE_CSS =
  "text-2xl tracking-normal leading-8 " +
  "md:text-4xl md:tracking-[0.5px] md:leading-10 " +
  "lg:text-[36px] lg:tracking-[1px] lg:leading-[42px] " +
  "lgx:text-[38px] lgx:tracking-[1.2px] lgx:leading-[44px] " +
  "xlg:text-[38px] xlg:tracking-[1.5px] xlg:leading-[46px] " +
  "mid:text-[40px] mid:tracking-[2px] mid:leading-[48px] " +
  "xl:text-[40px] xl:tracking-[2px] xl:leading-[48px] " +
  "font-serif font-medium"

export function HighlightsPreview({ highlights, draft }: { highlights?: any; draft?: any }) {
  const safeData = highlights || draft?.highlights || draft?.data?.highlights || {}

  const titleText = getStr(safeData.title, "Highlights")
  const items = Array.isArray(safeData.items)
    ? safeData.items
    : Array.isArray(safeData.highlightsList)
    ? safeData.highlightsList
    : []

  return (
    <section className="relative w-full py-8 md:py-12 overflow-hidden">
      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-6 max-w-5xl">
          <h2 className={TITLE_CSS} style={getStyleObj(safeData.title, "#313131")}>
            {titleText}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3 text-sm md:text-[15px] xl:text-base leading-6">
                <span className="text-[#af6348] font-bold shrink-0">✓</span>
                <span className="font-normal" style={getStyleObj(item.title ?? item, "#464136")}>
                  {getStr(item.title ?? item)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HighlightsPreview
