const DEFAULT_HERO_BG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"

export function GalleryPreview({ gallery, draft }: { gallery?: any; draft?: any }) {
  const safeGal = gallery || draft?.gallery || {}

  const items =
    safeGal.items && safeGal.items.length > 0
      ? safeGal.items
      : [
          { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", title: "Coastline" },
          { url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80", title: "Berat" },
          { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", title: "Ottoman Fortress" },
          { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80", title: "Theth Alps" },
          { url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80", title: "Blue Eye Spring" },
        ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 border-b border-[#D8CBB8] pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#af6348]">
          VISUAL STORY
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#080c1d]">
          {safeGal.title || "Visual Impressions"}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full">
        <div className="w-full lg:w-1/2 min-h-[320px] md:min-h-[420px] xl:h-[498px] rounded-lg overflow-hidden relative shadow-sm">
          <img
            src={items[0]?.url || DEFAULT_HERO_BG}
            alt="Featured Gallery Item"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.slice(1, 5).map((img: any, idx: number) => (
            <div key={idx} className="h-[200px] md:h-[231px] rounded-lg overflow-hidden relative shadow-sm">
              <img
                src={img.url || DEFAULT_HERO_BG}
                alt={`Gallery thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
