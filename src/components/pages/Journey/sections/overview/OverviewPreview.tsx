const MIRA_DIFFERENCE_IMG = "/images/mira-difference-image.png"
const DEFAULT_HERO_BG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"

function MiraSignatureIcon() {
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
  "text-[#313131] text-2xl tracking-normal leading-8 " +
  "md:text-4xl md:tracking-[0.5px] md:leading-10 " +
  "lg:text-[36px] lg:tracking-[1px] lg:leading-[42px] " +
  "lgx:text-[38px] lgx:tracking-[1.2px] lgx:leading-[44px] " +
  "xlg:text-[38px] xlg:tracking-[1.5px] xlg:leading-[46px] " +
  "mid:text-[40px] mid:tracking-[2px] mid:leading-[48px] " +
  "xl:text-[40px] xl:tracking-[2px] xl:leading-[48px] " +
  "font-serif font-medium"

export function OverviewPreview({ overview, draft }: { overview?: any; draft?: any }) {
  const safeOverview = overview || draft?.overview || {}
  const gallery = draft?.gallery || {}

  const galleryItems =
    gallery.items && gallery.items.length > 0
      ? gallery.items
      : [
          { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
          { url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80" },
          { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80" },
          { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80" },
          { url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80" },
        ]

  const highlights =
    safeOverview.highlightsList && safeOverview.highlightsList.length > 0
      ? safeOverview.highlightsList.map((h: any) => h.title || h)
      : [
          "Exclusive wine tasting at family-owned Berat vineyards",
          "Private guided walk through UNESCO stone fortress of Gjirokastër",
          "Trekking to the turquoise natural Blue Eye spring in Theth",
          "Private boat navigation along the crystal waters of Kotor Bay",
          "Handpicked boutique stays with personal local hosts",
          "24/7 dedicated MIRA Concierge assistance throughout",
        ]

  const features =
    safeOverview.featuresList && safeOverview.featuresList.length > 0
      ? safeOverview.featuresList
      : [
          "Seekers of authentic local heritage",
          "Lovers of boutique luxury stays",
          "Food & wine enthusiasts",
          "Relaxed pace with deep immersion",
        ]

  return (
    <div className="w-full flex flex-col gap-12">
      {/* 1. Why We Designed This Journey */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-start">
          <img
            src={MIRA_DIFFERENCE_IMG}
            alt="The Mira Difference"
            className="w-full max-w-[497px] h-auto mb-2"
          />
          <h2 className={TITLE_CSS}>
            Why we designed this journey?
          </h2>
        </div>

        <div className="flex flex-col gap-4 text-[#464136] text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[26.8px] tracking-[2px]">
          <p className="whitespace-pre-line">
            {safeOverview.overviewText ||
              "Viverra blandit neque ac risus euismod tincidunt ut nec velit. Hendrerit potenti eleifend hendrerit lobortis enim duis duis rhoncus vulputate. Integer volutpat purus feugiat eros sed volutpat mauris faucibus."}
          </p>
          <p className="whitespace-pre-line">
            Fringilla cras malesuada suscipit felis pretium. Rutrum eget eleifend nisi dui pulvinar elementum magnis. Vulputate commodo ultrices id tincidunt imperdiet mauris.
          </p>

          <div className="flex items-center justify-end font-serif text-[#af6348] text-xl md:text-2xl font-normal leading-7 tracking-[2px] pt-2 gap-2">
            <span className="w-7 h-[2px] bg-[#af6348] inline-block shrink-0" aria-hidden="true" />
            <span>MIRA</span>
            <MiraSignatureIcon />
          </div>
        </div>
      </div>

      {/* 2. Journey Overview & Highlights */}
      <div className="flex flex-col gap-5 pt-8 border-t border-[#D8CBB8]">
        <h2 className={TITLE_CSS}>
          {safeOverview.title || "Journey Overview"}
        </h2>
        
        <div className="flex flex-col gap-4 text-[#464136] text-[15px] md:text-base xl:text-[18px] leading-7 tracking-[1.5px] font-normal">
          <p>
            Immerse yourself in the timeless beauty and rich history of the region on this carefully curated journey. From ancient fortress ruins to breathtaking mountain vistas, experience the very best of authentic local culture, cuisine, and hospitality.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4 w-full">
          <h3 className={TITLE_CSS}>
            Journey Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            {highlights.map((highlight: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm md:text-[15px] xl:text-base leading-6">
                <span className="text-[#af6348] font-bold">✓</span>
                <span className="text-[#464136]">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Full-Width Gallery Grid */}
      <div className="flex flex-col gap-5 pt-8 border-t border-[#D8CBB8]">
        <h2 className={TITLE_CSS}>
          Visual Impressions
        </h2>
        <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full">
          <div className="w-full lg:w-1/2 min-h-[320px] md:min-h-[420px] xl:h-[498px] rounded-lg overflow-hidden relative shadow-sm">
            <img
              src={galleryItems[0]?.url || DEFAULT_HERO_BG}
              alt="Featured Journey View"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {galleryItems.slice(1, 5).map((img: any, idx: number) => (
              <div key={idx} className="h-[200px] md:h-[231px] rounded-lg overflow-hidden relative shadow-sm">
                <img
                  src={img.url || DEFAULT_HERO_BG}
                  alt={`Gallery item ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Is This Journey For You? */}
      <div className="flex flex-col gap-5 pt-8 border-t border-[#D8CBB8]">
        <h2 className={TITLE_CSS}>
          Is this journey for you?
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xlg:flex xlg:flex-wrap xlg:items-center gap-y-3 gap-x-6">
          {features.map((item: string, idx: number, arr: any[]) => (
            <div
              key={idx}
              className={`flex items-center gap-2.5 ${
                idx !== arr.length - 1 ? "xlg:border-r xlg:border-[#af6348] xlg:pr-4 xlg:mr-4" : ""
              }`}
            >
              <span className="text-[#af6348] text-lg font-bold">✓</span>
              <span className="text-[#464136] text-sm md:text-[15px] font-normal tracking-[0.5px]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
