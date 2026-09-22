import { useState, useRef, useEffect, useCallback } from "react"
import { useJourneyDraft } from "./shared/JourneyDraftContext"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
  Check,
  Calendar,
  Bed,
} from "lucide-react"

// Asset images from public directory
const SIGNATURE_LABEL_IMG = "/images/singnature-label.png"
const MIRA_DIFFERENCE_IMG = "/images/mira-difference-image.png"
const CONFIRM_MARK_IMG = "/images/confirm-mark.png"
const DEFAULT_HERO_BG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"

function getStr(val: any): string {
  if (val === null || val === undefined) return ""
  if (typeof val === "string") return val
  if (typeof val === "number" || typeof val === "boolean") return String(val)
  if (typeof val === "object" && val !== null) {
    if ("value" in val && typeof val.value === "string") return val.value
    if ("text" in val && typeof val.text === "string") return val.text
  }
  return ""
}

/* =========================================================================
   CUSTOM SVG ICONS & BRAND ACCENTS (1:1 PARITY WITH FRONTEND)
========================================================================= */

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

function PrincipleIcon({ type }: { type: string }) {
  switch (type) {
    case "character":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 3C14 3 5 9 5 16C5 18.3869 5.94821 20.6761 7.63604 22.364C9.32387 24.0518 11.6131 25 14 25C16.3869 25 18.6761 24.0518 20.364 22.364C22.0518 20.6761 23 18.3869 23 16C23 9 14 3 14 3Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 16C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14C16 13.4696 15.7893 12.9609 15.4142 12.5858C15.0391 12.2107 14.5304 12 14 12C13.4696 12 12.9609 12.2107 12.5858 12.5858C12.2107 12.9609 12 13.4696 12 14C12 14.5304 12.2107 15.0391 12.5858 15.4142C12.9609 15.7893 13.4696 16 14 16Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "location":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 24C19.5228 24 24 19.5228 24 14C24 8.47715 19.5228 4 14 4C8.47715 4 4 8.47715 4 14C4 19.5228 8.47715 24 14 24Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 4V24M4 14H24" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 7.5C9 11 11 13 14 14C17 13 19 11 21 7.5" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 20.5C9 17 11 15 14 14C17 15 19 17 21 20.5" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "comfort":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M4 20V10L14 3L24 10V20" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 14H10V22H18V14Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 14V22" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "connection":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 5C10.7 5 8 7.7 8 11C8 15 14 23 14 23C14 23 20 15 20 11C20 7.7 17.3 5 14 5Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 13C15.1046 13 16 12.1046 16 11C16 9.89543 15.1046 9 14 9C12.8954 9 12 9.89543 12 11C12 12.1046 12.8954 13 14 13Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return <Sparkles className="w-full h-full text-[#af6348]" />
  }
}

// Fluid Title Typography Class matching frontend TITLE_CSS
const TITLE_CSS =
  "text-[#313131] text-2xl tracking-normal leading-8 " +
  "md:text-4xl md:tracking-[0.5px] md:leading-10 " +
  "lg:text-[36px] lg:tracking-[1px] lg:leading-[42px] " +
  "lgx:text-[38px] lgx:tracking-[1.2px] lgx:leading-[44px] " +
  "xlg:text-[38px] xlg:tracking-[1.5px] xlg:leading-[46px] " +
  "mid:text-[40px] mid:tracking-[2px] mid:leading-[48px] " +
  "xl:text-[40px] xl:tracking-[2px] xl:leading-[48px] " +
  "font-serif font-medium"

/* =========================================================================
   RIGHT-HAND BOOKING CARD (1:1 OverviewCard)
========================================================================= */

function BookingOverviewCard({
  price,
  currency,
  onRequestBooking,
}: {
  price: string | number
  currency: string
  onRequestBooking?: () => void
}) {
  const formattedPrice = `${currency === "EUR" ? "€" : currency === "USD" ? "$" : currency || "€"}${typeof price === "number" ? price.toLocaleString() : price || "3,195"}`

  const benefits = [
    "Bespoke itinerary tailoring included",
    "Flexible booking & cancellation terms",
    "24/7 dedicated concierge during travel",
  ]

  return (
    <div className="flex w-full flex-col items-center justify-center xl:gap-6 gap-3 md:gap-4 rounded-[10px] border border-[#D8CBB8] bg-white p-6 xl:p-8 shadow-xs">
      <div className="flex w-full flex-col items-start xl:gap-2.5 md:gap-2 gap-1.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl md:text-2xl lgx:text-3xl xl:text-[32px] font-semibold xl:tracking-[2px] md:tracking-[1.6px] tracking-[1.5px] text-[#080c1d] xl:leading-10 lgx:leading-9 md:leading-8 leading-7">
            {formattedPrice}
          </span>
          <span className="xl:text-sm md:text-[13px] text-[12px] font-normal text-[#464136] xl:leading-5 md:leading-[18px] leading-4">
            / per person
          </span>
        </div>
        <p className="xl:text-sm md:text-[13px] text-[12px] font-normal text-[#464136] xl:leading-5 md:leading-[18px] leading-4">
          Based on double occupancy
        </p>
      </div>

      <div className="flex flex-col items-start xl:gap-6 gap-4 md:gap-5 w-full">
        <div className="flex w-full border-t border-[#D8CBB8] xl:pt-[17px] pt-3 items-start justify-between self-stretch text-sm font-normal text-[#464136] xl:h-[69px] h-[61px] md:h-[63px]">
          <span>Taxes & Fees</span>
          <span>Included</span>
        </div>

        <button
          type="button"
          onClick={onRequestBooking}
          className="w-full rounded-[4px] bg-[#182d09] text-white font-semibold py-3.5 px-6 text-center text-sm md:text-base tracking-wider uppercase transition-colors hover:bg-[#365314] cursor-pointer shadow-xs"
        >
          REQUEST BOOKING
        </button>

        <div className="flex h-[52px] pt-0 pr-[2px] pb-[1px] pl-0 flex-col justify-center items-center gap-[11px] self-stretch text-center">
          <p className="xl:text-sm md:text-[13px] text-[12px] font-normal text-[#464136] xl:leading-5 md:leading-[18px] leading-4">
            Have questions about this journey?
          </p>
          <a
            href="#contact"
            className="xl:text-sm md:text-[13px] text-[12px] font-semibold text-[#af6348] underline underline-offset-2 transition-colors hover:text-[#99543D]"
          >
            Speak to a Specialist
          </a>
        </div>

        {benefits.length > 0 && (
          <ul className="flex w-full flex-col items-start pt-[14px] md:pt-4 xl:pt-[25px] xl:gap-3 md:gap-2.5 gap-2 border-t border-[#D8CBB8] self-stretch">
            {benefits.map((benefit, idx) => (
              <li
                key={idx}
                className="flex items-start gap-[5.5px] xl:text-sm md:text-[13px] text-[12px] font-normal text-[#464136] xl:leading-5 md:leading-[18px] leading-4"
              >
                <span className="text-[#af6348] font-bold">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/* =========================================================================
   MAIN JOURNEY PREVIEW COMPONENT
========================================================================= */

export function JourneyPreview() {
  const { draft, activePreviewTab, setActivePreviewTab } = useJourneyDraft()
  const [activeTab, setActiveTab] = useState(activePreviewTab || "overview")

  const navRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Expanded State for Itinerary
  const [expandedDay, setExpandedDay] = useState<number | string | null>(1)

  // Sync active tab from draft context when changed externally
  useEffect(() => {
    if (activePreviewTab && activePreviewTab !== activeTab) {
      setActiveTab(activePreviewTab)
    }
  }, [activePreviewTab])

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    setActivePreviewTab(tabKey)
  }

  const checkOverflow = useCallback(() => {
    const el = navRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    const hasMore = el.scrollWidth - el.clientWidth - el.scrollLeft > 4
    setCanScrollRight(hasMore)
  }, [])

  useEffect(() => {
    checkOverflow()
    const el = navRef.current
    if (!el) return
    el.addEventListener("scroll", checkOverflow, { passive: true })
    window.addEventListener("resize", checkOverflow)
    return () => {
      el.removeEventListener("scroll", checkOverflow)
      window.removeEventListener("resize", checkOverflow)
    }
  }, [checkOverflow])

  if (!draft) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center p-8 text-[#565e69] font-sans">
        No journey draft loaded.
      </div>
    )
  }

  const hero = draft.hero || {}
  const overview = draft.overview || {}
  const itinerary = draft.itinerary || {}
  const accommodations = draft.accommodations || {}
  const whatsIncluded = draft.whatsIncluded || {}
  const addOns = draft.addOns || {}
  const gallery = draft.gallery || {}

  const heroTitle = getStr(hero.title) || getStr(draft.title) || "Classic Albania & The Ionian Coast"
  const heroLabel = getStr(hero.label) || getStr(draft.label)
  const heroMultimedia = hero.backgroundMultimedia
  const heroBgImage = typeof hero.background_image === "string" ? hero.background_image : DEFAULT_HERO_BG

  const isSignature = Boolean(
    (heroLabel && /signature/i.test(heroLabel)) ||
      (draft.id && /signature/i.test(draft.id)) ||
      (draft.slug && /signature/i.test(draft.slug)) ||
      (heroTitle && /classic albania/i.test(heroTitle))
  )

  const tags = [
    `${draft.minDays || 9} DAYS`,
    draft.pace || "BALANCED",
    draft.comfortLevel?.replace(/_/g, " ") || "BOUTIQUE",
    ...(draft.journeyType || []).slice(0, 1).map((t) => t.replace(/_/g, " ")),
  ].filter(Boolean)

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "accommodation", label: "Accommodation" },
    { id: "included", label: "What's Included" },
    { id: "addons", label: "Add-Ons" },
  ]

  // Chapters Data Hierarchy (JOURNEY -> CHAPTERS -> DAYS -> EXPERIENCES)
  const chapters =
    itinerary.chaptersList && itinerary.chaptersList.length > 0
      ? itinerary.chaptersList
      : [
          {
            id: "chap-1",
            chapterNumber: "Chapter I",
            title: "The Beginning",
            subtitle: "Days 1–3 · Tirana & surroundings",
            description: "Introductory exploration of historic Albanian architecture and culinary culture.",
            days: [
              {
                id: "day-1",
                dayNumber: 1,
                title: "Arrival in Tirana & Welcome Cocktail",
                subtitle: "Private transfer & introductory dinner",
                location: "Tirana",
                description:
                  "Arrive at Tirana airport with private transfer to your boutique hotel. Enjoy an evening welcome cocktail and traditional introductory dinner.",
                stayName: "Plaza Hotel Tirana",
                image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                meals: ["Dinner"],
                activities: ["Private Transfer", "Welcome Cocktail"],
              },
              {
                id: "day-2",
                dayNumber: 2,
                title: "Historic Berat Castle & Wine Tasting",
                subtitle: "UNESCO fortress grounds",
                location: "Berat",
                description:
                  "Explore the UNESCO listed town of Berat, visit the castle grounds, and enjoy exclusive wine tasting at a family vineyard.",
                stayName: "Mangalem Heritage Hotel",
                image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
                meals: ["Breakfast", "Wine Tasting"],
                activities: ["Castle Guided Tour", "Vineyard Walk"],
              },
              {
                id: "day-3",
                dayNumber: 3,
                title: "Gjirokastër Stone City Exploration",
                subtitle: "Ottoman architecture & fortress",
                location: "Gjirokastër",
                description:
                  "Discover Gjirokastër's Ottoman architecture, ancient fortress museum, and artisan craft bazaar.",
                stayName: "Gjirokastër Castle Hotel",
                image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
                meals: ["Breakfast", "Lunch"],
                activities: ["Craft Bazaar Visit", "Fortress Walk"],
              },
            ],
          },
          {
            id: "chap-2",
            chapterNumber: "Chapter II",
            title: "Into the Mountains",
            subtitle: "Days 4–7 · Northern Alps & Valbona",
            description: "Breathtaking mountain passes, pristine alpine valleys, and secluded waterfalls.",
            days: [
              {
                id: "day-4",
                dayNumber: 4,
                title: "Theth National Park & Blue Eye Exploration",
                subtitle: "Alpine springs & isolation tower",
                location: "Theth",
                description:
                  "Journey into the heart of the Albanian Alps. Hike to the natural turquoise Blue Eye spring and visit the traditional lock-in tower.",
                stayName: "Theth Alpine Sanctuary",
                image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
                meals: ["Breakfast", "Dinner"],
                activities: ["Alpine Trekking", "Blue Eye Spring"],
              },
            ],
          },
        ]

  // Gallery Items Fallback
  const galleryItems =
    gallery.items && gallery.items.length > 0
      ? gallery.items
      : [
          { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", title: "Albanian Coastline" },
          { url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80", title: "Historic Berat" },
          { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", title: "Ottoman Fortress" },
          { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80", title: "Theth Alps" },
          { url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80", title: "Blue Eye Spring" },
        ]

  // Principles Data
  const principles = [
    {
      icon: "character",
      title: "CHARACTER & HERITAGE",
      description: "Historic architecture, authentic regional design, and a genuine sense of place.",
    },
    {
      icon: "location",
      title: "PRIME LOCATION",
      description: "Situated in central, scenic, or peaceful settings close to iconic landmarks.",
    },
    {
      icon: "comfort",
      title: "REFINED COMFORT",
      description: "High-end bedding, marble ensuites, and impeccable personal hospitality.",
    },
    {
      icon: "connection",
      title: "LOCAL CONNECTION",
      description: "Family-run boutique properties fostering warm, personal Balkan hospitality.",
    },
  ]

  // Stays Data Fallback
  const stays =
    accommodations.staysList && accommodations.staysList.length > 0
      ? accommodations.staysList
      : [
          {
            id: "stay-1",
            name: "Plaza Hotel Tirana",
            stayType: "Boutique Luxury Hotel",
            city: "Tirana",
            duration: "2 Nights",
            nights: 2,
            description: "Modern elegance in the heart of Tirana with panoramic city views and luxury spa.",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            amenities: ["Spa & Wellness", "Gourmet Dining", "City Views"],
          },
          {
            id: "stay-2",
            name: "Mangalem Heritage House",
            stayType: "Historical Guesthouse",
            city: "Berat",
            duration: "1 Night",
            nights: 1,
            description: "Restored Ottoman residence offering authentic Balkan hospitality and courtyard dining.",
            image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
            amenities: ["Historic Architecture", "Organic Breakfast", "Courtyard Bar"],
          },
        ]

  // Standards Expectations
  const standards = [
    "Daily gourmet breakfast included",
    "Complimentary high-speed WiFi",
    "24/7 dedicated reception & concierge",
    "Private ensuite marble bathroom",
    "Handpicked premium organic linens",
    "Signature MIRA welcome gift",
  ]

  // Included Items Fallback
  const inclusions =
    whatsIncluded.inclusions && whatsIncluded.inclusions.length > 0
      ? whatsIncluded.inclusions.map((i: any) =>
          getStr(typeof i === "object" && i !== null ? i.title || i.value || i : i)
        )
      : [
          "All boutique hotel accommodations (8 nights)",
          "Daily gourmet breakfast and selected local dinners",
          "Private luxury vehicle with dedicated English-speaking chauffeur",
          "All entrance fees to castles, museums, and national parks",
          "Exclusive wine tasting session at family vineyards in Berat",
          "24/7 MIRA Concierge assistance throughout your journey",
        ]

  // Excluded Items Fallback
  const exclusions =
    whatsIncluded.exclusions && whatsIncluded.exclusions.length > 0
      ? whatsIncluded.exclusions.map((e: any) =>
          getStr(typeof e === "object" && e !== null ? e.title || e.value || e : e)
        )
      : [
          "International flight tickets to/from Tirana",
          "Personal travel & medical insurance",
          "Unspecified meals, alcoholic beverages, and personal expenses",
          "Optional add-on excursions & private spa treatments",
        ]

  // Important Info Notes
  const importantNotes =
    whatsIncluded.notes && whatsIncluded.notes.length > 0
      ? whatsIncluded.notes.map((n: any) =>
          getStr(typeof n === "object" && n !== null ? n.value || n : n)
        )
      : [
          "Private transfers are tailored to match your specific arrival flight time.",
          "Comfortable walking shoes are recommended for cobblestone historical centers.",
          "Custom extensions or itinerary adjustments are available upon request.",
        ]

  // Add-ons Fallback
  const addOnItems =
    addOns.itemsList && addOns.itemsList.length > 0
      ? addOns.itemsList
      : [
          {
            id: "addon-1",
            title: "Private Helicopter Scenic Tour",
            category: "EXCURSION",
            duration: "45 Mins",
            price: 450,
            currency: "EUR",
            description: "Experience dramatic aerial views over the Albanian Alps and Ionian Riviera coastline.",
            features: ["Private Certified Pilot", "Champagne Toast", "Helipad Transfer"],
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "addon-2",
            title: "Exclusive Sommelier Masterclass",
            category: "GASTRONOMY",
            duration: "2.5 Hours",
            price: 180,
            currency: "EUR",
            description: "Taste rare vintage wines guided by Albania's premier sommelier.",
            features: ["5 Vintage Reserves", "Artisanal Cheese Pairing", "Sommelier Notes"],
            image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
          },
        ]

  return (
    <div className="w-full bg-[#FFF7EF] text-[#080c1d] min-h-screen font-sans selection:bg-[#af6348]/20">
      
      {/* =========================================================================
          1. HERO BANNER SECTION (1:1 PARITY WITH FRONTEND)
      ========================================================================= */}
      <section className="relative flex min-h-[600px] md:h-[680px] lg:h-[700px] xl:h-[725px] w-full items-end overflow-hidden">
        {/* Background Multimedia */}
        <UniversalMultimediaPreview
          multimedia={heroMultimedia ?? undefined}
          fallbackImageSrc={heroBgImage}
          fallbackVideoSrc={hero.video}
          fallbackAlt={heroTitle}
          mode="background"
          className="h-full w-full object-cover object-center"
          containerClassName="absolute inset-0 z-0 h-full w-full"
        />

        {/* Background Overlay */}
        <div
          className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(193,203,206,0.30)_0%,rgba(28,28,28,0.30)_100%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-20 w-full xl:pb-[80px] lg:pb-[70px] md:pb-[60px] sm:pb-[48px] pb-[36px] xl:pl-[136px] lg:pl-[96px] md:pl-[56px] sm:pl-[36px] pl-[20px] xl:pr-[136px] lg:pr-[96px] md:pr-[56px] sm:pr-[36px] pr-[20px]">
          <div className="flex w-full max-w-[680px] flex-col items-start gap-4 sm:gap-5">
            {isSignature ? (
              <div>
                <img
                  src={SIGNATURE_LABEL_IMG}
                  alt="Signature Journey"
                  className="w-[245px] h-[28px] shrink-0 aspect-[35/4] object-contain"
                />
              </div>
            ) : heroLabel ? (
              <div className="inline-flex items-center justify-center bg-neutral-100/90 px-3 py-1 text-[#af6348] text-xs font-semibold uppercase tracking-wider rounded-sm">
                {heroLabel}
              </div>
            ) : null}

            <h1 className="font-serif xl:text-[72px] mid:text-[68px] lgx:text-[64px] lg:text-[60px] md:text-[52px] text-[32px] font-[600] capitalize xl:leading-[92px] mid:leading-[88px] lgx:leading-[84px] lg:leading-[80px] md:leading-[66px] leading-[42px] text-white drop-shadow-sm">
              {heroTitle}
            </h1>

            {tags && tags.length > 0 && (
              <div className="inline-flex flex-wrap justify-start items-center gap-2 md:gap-2.5">
                {tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="border border-white/40 bg-black/40 text-white backdrop-blur-md px-3.5 py-1 text-xs font-medium uppercase tracking-wider rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STICKY TABS NAVIGATION BAR (1:1 PARITY WITH FRONTEND)
      ========================================================================= */}
      <div className="w-full sticky top-0 bg-[#FFF7EF] z-30 border-b border-[#D8CBB8] shadow-xs">
        <div className="w-full max-w-[120rem] mx-auto px-4 lg:px-12">
          <div className="w-full flex items-center">
            {canScrollLeft && (
              <button
                type="button"
                aria-label="Scroll tabs left"
                onClick={() => navRef.current?.scrollBy({ left: -160, behavior: "smooth" })}
                className="shrink-0 flex items-center justify-center size-8 rounded-full bg-[#D8CBB8]/30 hover:bg-[#D8CBB8]/60 text-[#464136] hover:text-[#af6348] transition-colors mr-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <nav
              ref={navRef}
              className="inline-flex items-center xl:gap-[70px] gap-4 xlg:gap-8 overflow-x-auto no-scrollbar py-1"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative py-3.5 px-3 first:pl-0 text-sm md:text-base xlg:text-[17px] xl:text-xl font-normal whitespace-nowrap cursor-pointer transition-colors duration-200 shrink-0 ${
                      isActive ? "text-[#af6348] font-semibold" : "text-[#464136] hover:text-[#0a0a0a]"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute left-0 right-0 -bottom-[1px] h-[2.5px] bg-[#af6348] rounded-full" />
                    )}
                  </button>
                )
              })}
            </nav>

            {canScrollRight && (
              <button
                type="button"
                aria-label="Scroll tabs right"
                onClick={() => navRef.current?.scrollBy({ left: 160, behavior: "smooth" })}
                className="shrink-0 flex items-center justify-center size-8 rounded-full bg-[#D8CBB8]/30 hover:bg-[#D8CBB8]/60 text-[#464136] hover:text-[#af6348] transition-colors ml-2 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN TWO-COLUMN CONTENT GRID (1:1 TabContentLayout)
      ========================================================================= */}
      <div className="w-full max-w-[120rem] mx-auto px-4 lg:px-12 xl:pt-[51px] pt-6 md:pt-11 lgx:pt-12 pb-16 md:pb-24 xl:pb-32">
        <div className="w-full flex flex-col xlg:grid xlg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_390px] justify-between gap-6 xl:gap-10 items-start">
          
          {/* =========================================================
              LEFT COLUMN: ACTIVE TAB CONTENT
          ========================================================= */}
          <div className="w-full min-w-0">
            
            {/* -------------------------------------------------------------
                TAB 1: OVERVIEW
            ------------------------------------------------------------- */}
            {activeTab === "overview" && (
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
                      {getStr(overview.overviewText) ||
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
                    {getStr(overview.title) || "Journey Overview"}
                  </h2>
                  
                  <div className="flex flex-col gap-4 text-[#464136] text-[15px] md:text-base xl:text-[18px] leading-7 tracking-[1.5px] font-normal">
                    <p>
                      Immerse yourself in the timeless beauty and rich history of the region on this carefully curated journey. From ancient fortress ruins to breathtaking mountain vistas, experience the very best of authentic local culture, cuisine, and hospitality.
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="flex flex-col gap-4 pt-4 w-full">
                    <h3 className={TITLE_CSS}>
                      Journey Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                      {(overview.highlightsList && overview.highlightsList.length > 0
                        ? overview.highlightsList.map((h: any) =>
                            getStr(typeof h === "object" && h !== null ? h.title || h.value || h : h)
                          )
                        : [
                            "Exclusive wine tasting at family-owned Berat vineyards",
                            "Private guided walk through UNESCO stone fortress of Gjirokastër",
                            "Trekking to the turquoise natural Blue Eye spring in Theth",
                            "Private boat navigation along the crystal waters of Kotor Bay",
                            "Handpicked boutique stays with personal local hosts",
                            "24/7 dedicated MIRA Concierge assistance throughout",
                          ]
                      ).map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm md:text-[15px] xl:text-base leading-6">
                          <span className="text-[#af6348] font-bold">✓</span>
                          <span className="text-[#464136]">{getStr(highlight)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Full-Width Gallery (2x2 Grid + Featured Image) */}
                <div className="flex flex-col gap-5 pt-8 border-t border-[#D8CBB8]">
                  <h2 className={TITLE_CSS}>
                    Visual Impressions
                  </h2>
                  <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full">
                    <div className="w-full lg:w-1/2 min-h-[320px] md:min-h-[420px] xl:h-[498px] rounded-lg overflow-hidden relative shadow-sm">
                      <img
                        src={galleryItems[0]?.url || heroBgImage}
                        alt="Featured Journey View"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {galleryItems.slice(1, 5).map((img, idx) => (
                        <div key={idx} className="h-[200px] md:h-[231px] rounded-lg overflow-hidden relative shadow-sm">
                          <img
                            src={img.url || heroBgImage}
                            alt={`Gallery item ${idx + 1}`}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Is This Journey For You? (Convince Section) */}
                <div className="flex flex-col gap-5 pt-8 border-t border-[#D8CBB8]">
                  <h2 className={TITLE_CSS}>
                    Is this journey for you?
                  </h2>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xlg:flex xlg:flex-wrap xlg:items-center gap-y-3 gap-x-6">
                    {[
                      "Seekers of authentic local heritage",
                      "Lovers of boutique luxury stays",
                      "Food & wine enthusiasts",
                      "Relaxed pace with deep immersion",
                    ].map((item, idx, arr) => (
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
            )}

            {/* -------------------------------------------------------------
                TAB 2: ITINERARY
            ------------------------------------------------------------- */}
            {activeTab === "itinerary" && (
              <div className="w-full flex flex-col gap-8">
                {/* Route Summary Map Banner */}
                <div className="w-full rounded-[10px] border border-[#D8CBB8] bg-white p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-[#af6348]" />
                    <div>
                      <h4 className="font-serif font-semibold text-lg text-[#080c1d]">Route Overview</h4>
                      <p className="text-xs md:text-sm text-[#464136]">
                        {itinerary.badge || "Tirana · Berat · Gjirokastër · Theth · Shkodër"}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] text-xs font-semibold text-[#af6348] uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    {draft.minDays || 9} Days Detailed Schedule
                  </span>
                </div>

                {/* Day-by-Day Chapters Accordion */}
                <div className="w-full flex flex-col gap-6">
                  {chapters.map((chap, cIdx) => (
                    <div key={chap.id || cIdx} className="w-full flex flex-col gap-4">
                      <div className="flex flex-col border-b border-[#D8CBB8] pb-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#af6348]">
                          {chap.chapterNumber}
                        </span>
                        <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#080c1d]">
                          {chap.title}
                        </h3>
                        {chap.subtitle && (
                          <p className="text-xs md:text-sm text-[#565e69]">{chap.subtitle}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-4">
                        {chap.days.map((day) => {
                          const isExpanded = expandedDay === day.dayNumber
                          return (
                            <div
                              key={day.id || day.dayNumber}
                              className="w-full rounded-[10px] border border-[#D8CBB8] bg-white overflow-hidden shadow-xs transition-all duration-200"
                            >
                              <button
                                type="button"
                                onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                                className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left hover:bg-[#FFF7EF]/50 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-3.5">
                                  <span className="shrink-0 size-8 md:size-9 rounded-full bg-[#182d09] text-white font-serif font-bold text-sm flex items-center justify-center shadow-xs">
                                    {day.dayNumber}
                                  </span>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-serif text-base md:text-lg font-semibold text-[#080c1d]">
                                        {day.title}
                                      </h4>
                                      {day.location && (
                                        <span className="px-2 py-0.5 rounded-xs bg-[#FAF6F0] text-[11px] font-semibold text-[#af6348] uppercase tracking-wider">
                                          {day.location}
                                        </span>
                                      )}
                                    </div>
                                    {day.subtitle && (
                                      <p className="text-xs text-[#565e69]">{day.subtitle}</p>
                                    )}
                                  </div>
                                </div>

                                <span className="text-[#464136] shrink-0">
                                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="p-5 md:p-6 pt-0 border-t border-[#D8CBB8]/50 flex flex-col md:flex-row gap-6 items-start mt-2">
                                  {day.image && (
                                    <div className="w-full md:w-1/3 h-[180px] rounded-md overflow-hidden shrink-0 shadow-xs">
                                      <img
                                        src={day.image}
                                        alt={day.title}
                                        className="w-full h-full object-cover object-center"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 space-y-3">
                                    <p className="text-sm text-[#464136] leading-relaxed">
                                      {day.description}
                                    </p>

                                    {day.stayName && (
                                      <div className="flex items-center gap-2 text-xs font-semibold text-[#182d09] pt-1">
                                        <Bed className="w-4 h-4 text-[#af6348]" />
                                        <span>Stay: {day.stayName}</span>
                                      </div>
                                    )}

                                    {day.meals && day.meals.length > 0 && (
                                      <div className="flex items-center gap-2 flex-wrap text-xs text-[#565e69]">
                                        <span className="font-semibold text-[#080c1d]">Meals Included:</span>
                                        {day.meals.map((m, mIdx) => (
                                          <span key={mIdx} className="px-2 py-0.5 rounded-xs bg-neutral-100 border border-neutral-200">
                                            {m}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {day.activities && day.activities.length > 0 && (
                                      <div className="flex items-center gap-2 flex-wrap text-xs text-[#565e69]">
                                        <span className="font-semibold text-[#080c1d]">Activities:</span>
                                        {day.activities.map((act, aIdx) => (
                                          <span key={aIdx} className="px-2 py-0.5 rounded-xs bg-[#FFF7EF] text-[#af6348] border border-[#D8CBB8]">
                                            {act}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                TAB 3: ACCOMMODATION
            ------------------------------------------------------------- */}
            {activeTab === "accommodation" && (
              <div className="w-full flex flex-col gap-10">
                {/* 1. Our Philosophy */}
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#D8CBB8]">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#af6348]">
                        ACCOMMODATION PHILOSOPHY
                      </span>
                      <h2 className={TITLE_CSS}>
                        {accommodations.title || "Handpicked Luxury Stays"}
                      </h2>
                    </div>
                    <p className="text-[#565e69] text-sm md:text-base max-w-xl">
                      {accommodations.description ||
                        "We select hotels and boutique guesthouses based on four uncompromising principles of character, location, comfort, and local connection."}
                    </p>
                  </div>

                  {/* 4 Principles Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {principles.map((item, idx) => (
                      <div
                        key={idx}
                        className="group relative overflow-hidden bg-white p-6 rounded-[10px] border border-[#D8CBB8] flex flex-col items-start gap-4 shadow-xs"
                      >
                        <div className="size-8 flex items-center justify-center">
                          <PrincipleIcon type={item.icon} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="text-[#080c1d] font-semibold text-sm tracking-wider uppercase group-hover:text-[#af6348] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-[#565e69] text-xs leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Destination by Destination Stays */}
                <div className="flex flex-col gap-5 pt-6 border-t border-[#D8CBB8]">
                  <h3 className={TITLE_CSS}>Handpicked Properties</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stays.map((stay, idx) => (
                      <div
                        key={stay.id || idx}
                        className="rounded-[10px] border border-[#D8CBB8] bg-white overflow-hidden shadow-xs flex flex-col"
                      >
                        <div className="h-[200px] w-full relative">
                          <img
                            src={stay.image || DEFAULT_HERO_BG}
                            alt={stay.name}
                            className="w-full h-full object-cover object-center"
                          />
                          {stay.duration && (
                            <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md text-xs font-semibold">
                              {stay.duration}
                            </span>
                          )}
                        </div>
                        <div className="p-6 flex flex-col gap-3 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-serif text-lg font-semibold text-[#080c1d]">
                              {stay.name}
                            </h4>
                            <span className="text-xs text-[#af6348] font-semibold uppercase tracking-wider">
                              {stay.city}
                            </span>
                          </div>
                          <p className="text-xs text-[#565e69] leading-relaxed">
                            {stay.description}
                          </p>
                          {stay.amenities && stay.amenities.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap pt-2 mt-auto">
                              {stay.amenities.map((am: any, aIdx: number) => (
                                <span
                                  key={aIdx}
                                  className="px-2.5 py-1 rounded-xs bg-[#FAF6F0] text-[#464136] text-[11px] font-medium border border-[#D8CBB8]/60"
                                >
                                  {am}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Standards Expectations */}
                <div className="flex flex-col gap-4 pt-6 border-t border-[#D8CBB8]">
                  <h3 className={TITLE_CSS}>What You Can Expect</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 bg-[#F9F6ED] rounded-[10px] border border-[#D8CBB8] overflow-hidden">
                    {standards.map((st, idx) => (
                      <div key={idx} className="p-5 border-b sm:border-b-0 sm:border-r last:border-r-0 border-[#D8CBB8] flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#af6348] shrink-0" />
                        <span className="text-xs md:text-sm font-medium text-[#464136]">{st}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                TAB 4: WHAT'S INCLUDED
            ------------------------------------------------------------- */}
            {activeTab === "included" && (
              <div className="w-full flex flex-col gap-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
                  {/* Included Column */}
                  <div className="flex-1 flex flex-col gap-5 lg:pr-8 lg:border-r lg:border-[#D8CBB8]">
                    <h2 className={TITLE_CSS}>
                      What's Included
                    </h2>
                    <div className="flex flex-col gap-3">
                      {inclusions.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm md:text-base leading-6 text-[#464136]">
                          <span className="text-[#af6348] font-bold">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Not Included Column */}
                  <div className="flex-1 flex flex-col gap-5">
                    <h2 className={TITLE_CSS}>
                      What's Not Included
                    </h2>
                    <div className="flex flex-col gap-3">
                      {exclusions.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm md:text-base leading-6 text-[#464136]">
                          <span className="text-neutral-400 font-bold">✗</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Important Information Box */}
                <div className="w-full rounded-[10px] bg-[#F6F1ED] p-6 md:p-8 flex flex-col gap-4 relative border border-[#D8CBB8]/50 shadow-xs">
                  <h3 className="text-[#080c1d] font-serif text-lg md:text-xl font-semibold">
                    Important Information
                  </h3>
                  <ul className="flex flex-col gap-2.5 z-10">
                    {importantNotes.map((info, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-[#464136]">
                        <span className="select-none font-bold text-[#af6348]">•</span>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                  <img
                    src={CONFIRM_MARK_IMG}
                    alt=""
                    className="pointer-events-none absolute bottom-4 right-4 w-[70px] h-[75px] object-contain opacity-40"
                  />
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                TAB 5: ADD-ONS
            ------------------------------------------------------------- */}
            {activeTab === "addons" && (
              <div className="w-full flex flex-col gap-8">
                <div className="flex flex-col gap-2 border-b border-[#D8CBB8] pb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#af6348]">
                    OPTIONAL EXPERIENCES
                  </span>
                  <h2 className={TITLE_CSS}>
                    {addOns.title || "Enhance Your Journey"}
                  </h2>
                  <p className="text-[#565e69] text-sm md:text-base">
                    {addOns.description || "Select exclusive optional upgrades to personalize your journey."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addOnItems.map((item, idx) => {
                    const priceFormatted = `${item.currency === "EUR" ? "€" : item.currency === "USD" ? "$" : item.currency || "€"}${item.price || 250}`
                    return (
                      <div
                        key={item.id || idx}
                        className="rounded-[10px] border border-[#D8CBB8] bg-white overflow-hidden shadow-xs flex flex-col"
                      >
                        {item.image && (
                          <div className="h-[180px] w-full relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover object-center"
                            />
                            {item.category && (
                              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#182d09] text-white text-xs font-semibold uppercase tracking-wider">
                                {item.category}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="p-6 flex flex-col gap-3 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-lg font-semibold text-[#080c1d]">
                              {item.title}
                            </h4>
                            <span className="text-base font-semibold text-[#af6348] shrink-0">
                              + {priceFormatted}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-[#565e69] leading-relaxed">
                            {item.description}
                          </p>
                          {item.features && item.features.length > 0 && (
                            <ul className="flex flex-col gap-1.5 pt-2 mt-auto">
                              {item.features.map((feat: any, fIdx: number) => (
                                <li key={fIdx} className="flex items-center gap-2 text-xs text-[#464136]">
                                  <span className="text-[#af6348]">✓</span>
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================
              RIGHT COLUMN: STICKY BOOKING CARD (DESKTOP)
          ========================================================= */}
          <aside className="hidden xlg:block shrink-0 sticky top-24 w-full">
            <BookingOverviewCard
              price={draft.price}
              currency={draft.currency}
              onRequestBooking={() => alert("Booking request triggered")}
            />
          </aside>
        </div>

        {/* Mobile / Tablet Booking Card Fallback */}
        <div className="xlg:hidden w-full pt-8 pb-4">
          <BookingOverviewCard
            price={draft.price}
            currency={draft.currency}
            onRequestBooking={() => alert("Booking request triggered")}
          />
        </div>
      </div>
    </div>
  )
}
