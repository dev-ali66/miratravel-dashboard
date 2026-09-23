import { getStr, getStyleObj } from "../../shared/previewHelpers"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"

export function GalleryPreview({ gallery, draft }: { gallery?: any; draft?: any }) {
  const safeGal = gallery || draft?.gallery || {}

  const items =
    safeGal.items && safeGal.items.length > 0
      ? safeGal.items
      : [
          { title: "Coastline", multimedia: { show: "image", image: { url: "" } } },
          { title: "Berat", multimedia: { show: "image", image: { url: "" } } },
          { title: "Ottoman Fortress", multimedia: { show: "image", image: { url: "" } } },
          { title: "Theth Alps", multimedia: { show: "image", image: { url: "" } } },
          { title: "Blue Eye Spring", multimedia: { show: "image", image: { url: "" } } },
        ]

  const galTitle = getStr(safeGal.title, "Visual Impressions")

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 border-b border-[#D8CBB8] pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#af6348]">
          VISUAL STORY
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={getStyleObj(safeGal.title, "#080c1d")}>
          {galTitle}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full">
        <div className="w-full lg:w-1/2 min-h-[320px] md:min-h-[420px] xl:h-[498px] rounded-lg overflow-hidden relative shadow-sm">
          <UniversalMultimediaPreview
            multimedia={items[0]?.multimedia || items[0]?.multimediaData || { show: items[0]?.type === "video" ? "video" : "image", image: { url: typeof items[0]?.url === "string" ? items[0].url : "" } }}
            className="w-full h-full object-cover object-center"
            containerClassName="w-full h-full"
          />
        </div>
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.slice(1, 5).map((img: any, idx: number) => {
            return (
              <div key={idx} className="h-[200px] md:h-[231px] rounded-lg overflow-hidden relative shadow-sm">
                <UniversalMultimediaPreview
                  multimedia={img?.multimedia || img?.multimediaData || { show: img?.type === "video" ? "video" : "image", image: { url: typeof img?.url === "string" ? img.url : "" } }}
                  className="w-full h-full object-cover object-center"
                  containerClassName="w-full h-full"
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GalleryPreview


