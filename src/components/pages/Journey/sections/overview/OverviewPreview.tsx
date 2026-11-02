import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getStr } from "../../shared/previewHelpers"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { getOptimizedImageUrl } from "@/lib/optimizedImage"

// Brand default fallbacks matching frontend overviewListData, convinceData, overviewGalleryData
const defaultOverviewData = {
  whyTitle: "Why we designed this journey?",
  whyParagraphs: [
    "Lorem ipsum dolor sit amet consectetur. Viverra blandit neque at risus euismod tincidunt sit nec velit. Hendrerit potenti eleifend hendrerit lobortis enim duis duis rhoncus vulputate. Integer volutpat purus feugiat eros sed volutpat mauris faucibus.",
    "Lorem ipsum dolor sit amet consectetur. Egestas cras malesuada suscipit felis pretium. Rutrum eget eleifend est dui pulvinar elementum magnis. Vulputate commodo ultricies id tincidunt imperdiet mattis. Et nam consequat urna senectus molestie.",
  ],
  overviewTitle: "Journey Overview",
  overviewParagraphs: [
    "Immerse yourself in the timeless beauty and rich history of Italy on this carefully curated 7-day journey. From the ancient ruins of Rome to the Renaissance splendor of Florence, experience the very best of Italian culture, cuisine, and art.",
    "This journey is designed for travelers who appreciate depth over breadth. Rather than rushing through a checklist of sites, we’ve built in time to truly absorb each destination. You’ll enjoy skip-the-line access to major attractions, private guided tours with expert historians, and authentic culinary experiences that reveal the soul of Italian culture.",
  ],
  highlightsTitle: "Highlights",
  highlights: [
    "Private Colosseum and Roman Forum tour",
    "Vatican Museums with art historian guide",
    "Pompeii archaeological exploration",
    "Tuscany wine tasting and cooking class",
    "Florence Renaissance art masterpieces",
    "Authentic trattoria dining experiences",
  ],
  convinceTitle: "Is this Journey for you?",
  convinceItems: [
    "You Love Culture and local traditions.",
    "You enjoy scenic road journeys and mountain drives.",
    "You appreciate authentic boutique hospitality.",
    "You desire private skip-the-line access to landmarks.",
    "You seek personalized guidance from local historians.",
  ],
  gallery: {
    title: "Visual Reference",
    subtitle: "Examples of the Accommodation Style",
    featured: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    secondary: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
    ],
  },
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="757.62 552.4 484.76 895.2" className={className} aria-hidden="true" fill="#9C7B5A">
      <polygon points="1029.99,1000 1000.04,1447.6 970.01,1000 1000.04,552.4" />
      <polygon points="1000,1029.99 757.62,1000.03 1000,970.01 1242.38,1000.03" />
      <polygon points="1028.15,999.97 1115.35,884.65 999.98,971.81 884.62,884.65 971.82,999.97 884.62,1115.38 999.98,1028.15 1115.35,1115.38" />
    </svg>
  )
}

const TITLE_CSS =
  "text-title-light text-2xl tracking-normal leading-8 " +
  "md:text-4xl md:tracking-[0.5px] md:leading-10 " +
  "lg:text-[36px] lg:tracking-[1px] lg:leading-[42px] " +
  "lgx:text-[38px] lgx:tracking-[1.2px] lgx:leading-[44px] " +
  "xlg:text-[38px] xlg:tracking-[1.5px] xlg:leading-[46px] " +
  "mid:text-[40px] mid:tracking-[2px] mid:leading-[48px] " +
  "xl:text-[40px] xl:tracking-[2px] xl:leading-[48px] " +
  "font-heading font-medium"

const TITLE_TO_CONTENT_GAP = "gap-5 md:gap-6 lg:gap-7 lgx:gap-[29px] xl:gap-8"

export function OverviewPreview({ overview, draft }: { overview?: any; draft?: any }) {
  const safeData = overview || draft?.overview || draft?.data?.overview || {}

  // 1. Why We Designed This Journey
  const why = safeData.why || safeData.whyWeDesigned || {}
  const whyTitle = getStr(why.title, defaultOverviewData.whyTitle)
  const rawWhyDesc = why.description ?? why.paragraphs ?? why.content ?? safeData.whyWeDesigned?.description
  const whyParagraphs = rawWhyDesc
    ? (Array.isArray(rawWhyDesc) ? rawWhyDesc : [rawWhyDesc])
    : defaultOverviewData.whyParagraphs

  // 2. Journey Overview
  const ov = safeData.overview || safeData.journeyOverview || (safeData.title || safeData.description ? safeData : {})
  const overviewTitle = getStr(ov.title ?? safeData.title, defaultOverviewData.overviewTitle)
  const rawOvDesc = ov.description ?? safeData.description ?? safeData.overviewText ?? ov.paragraphs ?? ov.content
  const overviewParagraphs = rawOvDesc
    ? (Array.isArray(rawOvDesc) ? rawOvDesc : [rawOvDesc])
    : defaultOverviewData.overviewParagraphs

  // 3. Highlights
  const hl = safeData.heighlights || safeData.highlights || {}
  const highlightsTitle = getStr(hl.title, defaultOverviewData.highlightsTitle)
  const rawHighlights = Array.isArray(hl.items) && hl.items.length > 0
    ? hl.items
    : Array.isArray(safeData.highlights) && safeData.highlights.length > 0
    ? safeData.highlights
    : defaultOverviewData.highlights

  const highlights = rawHighlights.map((item: any) =>
    typeof item === "string" ? item : getStr(item?.title || item?.name || item)
  )

  // 4. Visual Reference / Gallery
  const vs = safeData.visualStory || safeData.visualReference || {}
  const vsTitle = getStr(vs.title, defaultOverviewData.gallery.title)
  const vsItems = Array.isArray(vs.items) && vs.items.length > 0 ? vs.items : []

  const featuredImg =
    vs.featuredImage?.url ||
    (typeof vs.featuredImage === "string" ? vs.featuredImage : null) ||
    (vsItems[0]?.image?.url || (typeof vsItems[0] === "string" ? vsItems[0] : null)) ||
    defaultOverviewData.gallery.featured

  const secondaryImgs =
    vsItems.length > 1
      ? vsItems.slice(1, 5).map((m: any) => m?.image?.url || (typeof m === "string" ? m : m?.url))
      : defaultOverviewData.gallery.secondary

  const [activeGalleryPage, setActiveGalleryPage] = useState(0)

  // 5. Is This Journey For You? (Convince)
  const fy = safeData.forYou || safeData.convince || {}
  const convinceTitle = getStr(fy.title, defaultOverviewData.convinceTitle)
  const rawConvince = Array.isArray(fy.items) && fy.items.length > 0
    ? fy.items
    : defaultOverviewData.convinceItems

  const convinceItems = rawConvince.map((item: any) =>
    typeof item === "string" ? item : getStr(item?.title || item?.name || item)
  )

  return (
    <div className="w-full flex flex-col gap-12 md:gap-16 lg:gap-20">
      {/* 1. Overview & Highlights Section */}
      <section className="w-full flex flex-col gap-10 md:gap-12 lg:gap-14">
        {/* Why We Designed This Journey */}
        <div className={`flex flex-col ${TITLE_TO_CONTENT_GAP}`}>
          <h2 className={TITLE_CSS}>{whyTitle}</h2>
          <div className="flex flex-col gap-3 md:gap-4 text-nav-text text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[27px] tracking-[1.5px]">
            {whyParagraphs.map((paragraph: any, idx: number) => (
              <DynamicStyledTextPreview
                key={idx}
                data={paragraph}
                isRichText={true}
                className="text-nav-text text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[27px] tracking-[1.5px] [&_p]:mb-3 md:[&_p]:mb-4 [&_p:last-child]:mb-0"
              />
            ))}
          </div>
        </div>

        {/* Journey Overview Narrative */}
        <div className={`flex flex-col ${TITLE_TO_CONTENT_GAP}`}>
          <h2 className={TITLE_CSS}>{overviewTitle}</h2>
          <div className="flex flex-col gap-3 md:gap-4 text-nav-text text-[15px] md:text-base xl:text-[18px] leading-[22px] md:leading-[24px] xl:leading-7 tracking-[0.9px] md:tracking-[1.2px] xl:tracking-[2px] font-normal">
            {overviewParagraphs.map((paragraph: any, idx: number) => (
              <DynamicStyledTextPreview
                key={idx}
                data={paragraph}
                isRichText={true}
                className="text-nav-text text-[15px] md:text-base xl:text-[18px] leading-[22px] md:leading-[24px] xl:leading-7 tracking-[0.9px] md:tracking-[1.2px] xl:tracking-[2px] font-normal [&_p]:mb-3 md:[&_p]:mb-4 [&_p:last-child]:mb-0 [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:font-heading [&_h3]:font-medium [&_h3]:text-title-light [&_h3]:mb-3 [&_h3]:mt-1"
              />
            ))}
          </div>
        </div>

        {/* Highlights Grid */}
        <div className={`flex flex-col ${TITLE_TO_CONTENT_GAP} w-full`}>
          <h3 className={TITLE_CSS}>{highlightsTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {highlights.map((highlight: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm md:text-base leading-relaxed">
                <span className="text-accent font-bold shrink-0">✓</span>
                <span className="text-nav-text">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Visual Reference Section (Large Featured Left + 2x2 Secondary Right) */}
      <section className="w-full flex flex-col gap-6 md:gap-8 pt-6 border-t border-black/10">
        <h2 className={TITLE_CSS}>{vsTitle}</h2>

        <div className="w-full flex flex-col lg:flex-row items-stretch gap-5 lg:gap-6">
          {/* Featured Large Image (Left 50%) */}
          <div className="w-full lg:w-1/2 min-h-[300px] md:min-h-[400px] lg:h-[480px] overflow-hidden bg-muted relative">
            <img
              src={getOptimizedImageUrl(featuredImg, { width: 1000, quality: 100 })}
              alt="Journey visual reference"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* 2x2 Secondary Images Grid (Right 50%) */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {secondaryImgs.slice(0, 4).map((imgUrl: string, idx: number) => (
              <div key={idx} className="h-[180px] md:h-[225px] overflow-hidden bg-muted relative">
                <img
                  src={getOptimizedImageUrl(imgUrl, { width: 600, quality: 100 })}
                  alt={`Atmosphere detail ${idx + 1}`}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Is This Journey For You? (Convince Section with Gold Framed Badges) */}
      <section className="w-full flex flex-col gap-6 md:gap-8 pt-6 border-t border-black/10">
        <h2 className={`${TITLE_CSS} flex items-center gap-2.5`}>
          <span>{convinceTitle}</span>
          <StarIcon className="w-5 h-7 md:w-6 md:h-8 shrink-0 text-accent" />
        </h2>

        <div className="w-full flex flex-wrap items-center gap-3 md:gap-4">
          {convinceItems.map((item: string, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-2 border border-accent rounded-[2px] px-3.5 py-2 bg-[#F9F6ED]/60 text-nav-text text-xs md:text-sm tracking-[0.5px] whitespace-nowrap shadow-2xs"
            >
              <span className="text-accent font-bold text-sm">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default OverviewPreview
