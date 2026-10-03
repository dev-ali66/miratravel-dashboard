import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"

export function VideoBlockPreview({ block }: { block: any }) {
  const rawItems = Array.isArray(block?.items) && block.items.length > 0
    ? block.items
    : block?.multimedia
    ? [block.multimedia]
    : []

  const items = rawItems.filter((item: any) => item?.video?.url || item?.image?.url || item?.url || item?.show)
  if (items.length === 0) return null

  const count = items.length

  return (
    <div className="w-full flex flex-col gap-3">
      {/* 1 Item: Full Width */}
      {count === 1 && (
        <div className="relative w-full h-[300px] md:h-[420px] lgx:h-[520px] xl:h-[600px] overflow-hidden rounded-2xl shadow-sm border border-stone-200">
          <UniversalMultimediaPreview
            multimedia={{ ...items[0], show: items[0]?.show || "video" }}
            mode="inline"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 2 Items: 2 Grid */}
      {count === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="relative w-full h-[240px] md:h-[320px] lgx:h-[380px] overflow-hidden rounded-2xl shadow-sm border border-stone-200">
              <UniversalMultimediaPreview
                multimedia={{ ...item, show: item?.show || "video" }}
                mode="inline"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* 3 Items: Mobile (1 full width, 2 grid) | Desktop (3 grid) */}
      {count === 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
          <div className="relative w-full h-[240px] md:h-[300px] sm:col-span-2 md:col-span-1 overflow-hidden rounded-2xl shadow-sm border border-stone-200">
            <UniversalMultimediaPreview
              multimedia={{ ...items[0], show: items[0]?.show || "video" }}
              mode="inline"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full h-[240px] md:h-[300px] overflow-hidden rounded-2xl shadow-sm border border-stone-200">
            <UniversalMultimediaPreview
              multimedia={{ ...items[1], show: items[1]?.show || "video" }}
              mode="inline"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full h-[240px] md:h-[300px] overflow-hidden rounded-2xl shadow-sm border border-stone-200">
            <UniversalMultimediaPreview
              multimedia={{ ...items[2], show: items[2]?.show || "video" }}
              mode="inline"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* 4 Items: 2 Grid (2x2) */}
      {count === 4 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="relative w-full h-[240px] md:h-[320px] overflow-hidden rounded-2xl shadow-sm border border-stone-200">
              <UniversalMultimediaPreview
                multimedia={{ ...item, show: item?.show || "video" }}
                mode="inline"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* 5 Items: 2, 1, 2 Grid */}
      {count === 5 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
          {/* Row 1: 2 items */}
          <div className="relative w-full h-[220px] md:h-[300px] overflow-hidden rounded-2xl shadow-sm border border-stone-200">
            <UniversalMultimediaPreview
              multimedia={{ ...items[0], show: items[0]?.show || "video" }}
              mode="inline"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full h-[220px] md:h-[300px] overflow-hidden rounded-2xl shadow-sm border border-stone-200">
            <UniversalMultimediaPreview
              multimedia={{ ...items[1], show: items[1]?.show || "video" }}
              mode="inline"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Row 2: 1 item full width */}
          <div className="relative w-full h-[260px] md:h-[380px] sm:col-span-2 overflow-hidden rounded-2xl shadow-sm border border-stone-200">
            <UniversalMultimediaPreview
              multimedia={{ ...items[2], show: items[2]?.show || "video" }}
              mode="inline"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Row 3: 2 items */}
          <div className="relative w-full h-[220px] md:h-[300px] overflow-hidden rounded-2xl shadow-sm border border-stone-200">
            <UniversalMultimediaPreview
              multimedia={{ ...items[3], show: items[3]?.show || "video" }}
              mode="inline"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full h-[220px] md:h-[300px] overflow-hidden rounded-2xl shadow-sm border border-stone-200">
            <UniversalMultimediaPreview
              multimedia={{ ...items[4], show: items[4]?.show || "video" }}
              mode="inline"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* 6+ Items: 3 Grid */}
      {count >= 6 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="relative w-full h-[220px] md:h-[280px] overflow-hidden rounded-2xl shadow-sm border border-stone-200">
              <UniversalMultimediaPreview
                multimedia={{ ...item, show: item?.show || "video" }}
                mode="inline"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {block.title?.value && (
        <div className="text-xs md:text-sm text-center italic text-stone-500 tracking-wide">
          <DynamicStyledTextPreview data={block.title} />
        </div>
      )}
    </div>
  )
}
