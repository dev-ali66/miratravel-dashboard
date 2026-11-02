import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { THEME_COLORS } from "@/config/theme"
import { getStr, getStyleObj } from "../../shared/previewHelpers"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { useGetLocationById } from "@/hooks/location/useGetLocationById"
import { getOptimizedImageUrl } from "@/lib/optimizedImage"
import { ChevronLeft, ChevronRight } from "lucide-react"

// =========================================================================
// 1. BRAND CANONICAL DATA FOR 1:1 ACCURACY & FALLBACK
// =========================================================================
export const brandAccommodationData = {
  philosophy: {
    badge: "Our Philosophy",
    title: "Our Accommodation Philosophy",
    description:
      "Mira does not simply book hotels. Every property we recommend is chosen against four principles that together ensure each stay becomes a meaningful part of the journey, not merely a place to sleep.",
    principles: [
      {
        title: "Character",
        description:
          "Properties with local identity, atmosphere and a genuine sense of place — never interchangeable, always memorable.",
        icon: "character",
      },
      {
        title: "Location",
        description:
          "Carefully positioned so guests experience each destination from its most meaningful vantage point.",
        icon: "location",
      },
      {
        title: "Comfort",
        description:
          "Selected for quality of service, cleanliness and the warmth of the guest experience above all else.",
        icon: "comfort",
      },
      {
        title: "Connection",
        description:
          "Places that draw travelers closer to local culture, architecture and the authentic rhythms of daily life.",
        icon: "connection",
      },
    ],
  },
  destinations: {
    badge: "Destination by Destination",
    title: "Your Accommodation Journey",
    description:
      "Each destination on your route offers a distinct type of stay. Below we outline the character and setting of accommodation at each stop — exact properties are confirmed personally during the booking process.",
    stays: [
      {
        step: "01",
        duration: "2 nights",
        location: "Tirana",
        stayType: "Urban Boutique Stay",
        description:
          "Begin your journey in a stylish boutique property in or near the heart of Albania's vibrant, rapidly transforming capital.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
        confirmationBadge: "Personally confirmed by Mira",
        showMiraSeal: true,
      },
      {
        step: "02",
        duration: "2 nights",
        location: "Berat",
        stayType: "Historic Heritage Stay",
        description:
          "Experience the rare charm of a UNESCO World Heritage town from a carefully selected traditional property overlooking the white city.",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
        confirmationBadge: "Personally confirmed by Mira",
        showMiraSeal: false,
      },
      {
        step: "03",
        duration: "2 nights",
        location: "Gjirokastër",
        stayType: "Stone City Retreat",
        description:
          "Stay within walking distance of the historic bazaar and castle district — a property steeped in the atmosphere of the Ottoman era.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
        confirmationBadge: "Personally confirmed by Mira",
        showMiraSeal: true,
      },
      {
        step: "04",
        duration: "2–3 nights",
        location: "Albanian Riviera",
        stayType: "Seaside Boutique Escape",
        description:
          "Close out your journey surrounded by relaxed Mediterranean light, turquoise waters and unhurried coastal hospitality.",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
        confirmationBadge: "Personally confirmed by Mira",
        showMiraSeal: false,
      },
    ],
  },
  standards: {
    badge: "Standards",
    title: "What You Can Expect",
    description:
      "Every stay on your Mira journey meets a consistent set of standards — so you can travel with confidence rather than questions.",
    expectations: [
      "Boutique and small-scale properties",
      "Family-owned accommodations",
      "Heritage properties where available",
      "Private bathroom in all rooms",
      "Daily breakfast included",
      "Premium central locations",
      "Personally selected by Mira",
      "Regularly reviewed for quality",
      "Local character in every stay",
    ],
  },
  visualReference: {
    badge: "Visual Reference",
    title: "Examples of the Accommodation Style",
    description:
      "The images below represent the style and standard of properties you can expect on this journey. Exact properties may vary depending on travel dates, availability and final itinerary design.",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      alt: "Atmospheric boutique bedroom in Albania",
    },
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
        alt: "Scenic coastal terrace view",
      },
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        alt: "Historic stone architecture and interior details",
      },
      {
        url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
        alt: "Authentic heritage courtyard and balcony",
      },
      {
        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        alt: "Panoramic mountain view boutique lodge",
      },
    ],
  },
}

// =========================================================================
// 2. MINIMALIST ARCHITECTURAL SVG ICONS (1:1 FRONTEND MATCH)
// =========================================================================
function PrincipleIcon({ type }: { type: string }) {
  switch (type) {
    case "character":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 3C14 3 5 9 5 16C5 18.3869 5.94821 20.6761 7.63604 22.364C9.32387 24.0518 11.6131 25 14 25C16.3869 25 18.6761 24.0518 20.364 22.364C22.0518 20.6761 23 18.3869 23 16C23 9 14 3 14 3Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 16C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14C16 13.4696 15.7893 12.9609 15.4142 12.5858C15.0391 12.2107 14.5304 12 14 12C13.4696 12 12.9609 12.2107 12.5858 12.5858C12.2107 12.9609 12 13.4696 12 14C12 14.5304 12.2107 15.0391 12.5858 15.4142C12.9609 15.7893 13.4696 16 14 16Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "location":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 24C19.5228 24 24 19.5228 24 14C24 8.47715 19.5228 4 14 4C8.47715 4 4 8.47715 4 14C4 19.5228 8.47715 24 14 24Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 4V24M4 14H24" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 7.5C9 11 11 13 14 14C17 13 19 11 21 7.5" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 20.5C9 17 11 15 14 14C17 15 19 17 21 20.5" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "comfort":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M4 20V10L14 3L24 10V20" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 14H10V22H18V14Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 14V22" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "connection":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 5C10.7 5 8 7.7 8 11C8 15 14 23 14 23C14 23 20 15 20 11C20 7.7 17.3 5 14 5Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 13C15.1046 13 16 12.1046 16 11C16 9.89543 15.1046 9 14 9C12.8954 9 12 9.89543 12 11C12 12.1046 12.8954 13 14 13Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}

function MiraStarIcon({ className, color = "#9C7B5A" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="757.62 552.4 484.76 895.2" className={className} aria-hidden="true" fill={color}>
      <polygon points="1029.99,1000 1000.04,1447.6 970.01,1000 1000.04,552.4" />
      <polygon points="1000,1029.99 757.62,1000.03 1000,970.01 1242.38,1000.03" />
      <polygon points="1028.15,999.97 1115.35,884.65 999.98,971.81 884.62,884.65 971.82,999.97 884.62,1115.38 999.98,1028.15 1115.35,1115.38" />
    </svg>
  )
}

function getPrincipleBorderClasses(idx: number, total: number) {
  const isLast = idx === total - 1
  const base = isLast ? "border-b-0" : "border-b"
  const isRightColAt2 = idx % 2 === 1
  const lastRowStartAt2 = total - (total % 2 === 0 ? 2 : 1)
  const isLastRowAt2 = idx >= lastRowStartAt2
  const sm = `${isRightColAt2 ? "sm:border-r-0" : "sm:border-r"} ${isLastRowAt2 ? "sm:border-b-0" : "sm:border-b"}`
  const lgx = `${isLast ? "lgx:border-r-0" : "lgx:border-r"} lgx:border-b-0`
  return `${base} ${sm} ${lgx} border-black/10`
}

// =========================================================================
// 3. SINGLE DESTINATION STAY CARD (1:1 LIVE SITE MATCH)
// =========================================================================
function StayCard({ stay, idx }: { stay: any; idx: number }) {
  // Safely unwrap locationId if it's an array, object, or string
  const rawLocId = stay.locationId
  const resolvedId = (() => {
    if (!rawLocId) return undefined
    const item = Array.isArray(rawLocId) ? rawLocId[0] : rawLocId
    if (typeof item === "string") return item.trim()
    if (item && typeof item === "object") return item.id || item.value || item._id
    return undefined
  })()

  const { data: locationResponse } = useGetLocationById(resolvedId)

  const rawLocData = locationResponse?.data
  const locData = Array.isArray(rawLocData)
    ? rawLocData[0]
    : Array.isArray(rawLocData?.data)
    ? rawLocData.data[0]
    : rawLocData && typeof rawLocData === "object" && "name" in rawLocData
    ? rawLocData
    : null

  const locHero = locData?.hero || locData?.data?.hero || {}
  const locCard = locData?.card || locData?.data?.card || {}

  const stepLabel = stay.step
    ? stay.step
    : stay.day
    ? `DAY ${stay.day}`
    : `0${idx + 1}`

  const durationLabel = stay.duration
    ? getStr(stay.duration)
    : stay.nights
    ? `${stay.nights} ${typeof stay.nights === "number" && stay.nights === 1 ? "NIGHT" : "NIGHTS"}`
    : ""

  const locationTitle =
    getStr(locData?.name) ||
    getStr(locHero.title) ||
    getStr(locCard.title) ||
    getStr(stay.city || stay.location || stay.locationName || stay.title, `Destination ${idx + 1}`)

  const staySubtitle =
    getStr(stay.subtitle || stay.stayType) ||
    getStr(locHero.label || locCard.subtitle, "URBAN BOUTIQUE STAY")

  const confirmedText = getStr(stay.confirmationBadge || stay.confirmedBy, "Personally confirmed by Mira")
  const showMiraSeal = Boolean(stay.showMiraSeal ?? (idx % 2 === 0))

  // Media resolution with clean fallback
  const stayImgUrl =
    stay.image?.url ||
    (typeof stay.image === "string" ? stay.image : null) ||
    stay.multimedia?.image?.url ||
    locHero?.backgroundMultimedia?.image?.url ||
    locCard?.backgroundMultimedia?.image?.url ||
    locData?.image ||
    locHero?.background_image ||
    brandAccommodationData.destinations.stays[idx % brandAccommodationData.destinations.stays.length]?.image ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"

  return (
    <div className="w-full overflow-hidden bg-[#F9F6ED] grid grid-cols-1 md:grid-cols-12 group transition-[background-color] duration-500 ease-out">
      {/* Image Container (Left 5 cols) */}
      <div className="relative w-full min-h-[260px] md:min-h-[320px] lg:min-h-[300px] lgx:min-h-[312px] xl:min-h-[334px] md:col-span-5 overflow-hidden">
        <img
          src={getOptimizedImageUrl(stayImgUrl, { width: 720, quality: 100 })}
          alt={locationTitle}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Content Container (Right 7 cols) */}
      <div className="relative p-6 md:p-8 lg:p-9 lgx:p-10 xl:p-12 md:col-span-7 flex flex-col justify-between gap-6">
        <div className="flex flex-col gap-3">
          {/* Top Meta Row (Step/Duration on left, MIRA RECOMMENDS on right) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-4 text-accent text-xs leading-[14.5px] tracking-[1.5px] md:text-[13px] md:leading-[16.5px] lg:text-[13.2px] lg:leading-[17px] lg:tracking-[1.6px] lgx:text-[13.5px] lgx:leading-[17.5px] lgx:tracking-[1.75px] xl:text-sm xl:leading-[18.5px] xl:tracking-[2px] uppercase">
              <span className="text-accent/70">{stepLabel}</span>
              {durationLabel && <span>{durationLabel}</span>}
            </div>

            {/* Mira Recommends Badge */}
            {showMiraSeal && (
              <div className="inline-flex justify-start items-center gap-2.5 shrink-0">
                <div className="xl:size-8 size-6 md:size-7 relative shrink-0 border border-[#9C7B5A] flex items-center justify-center">
                  <MiraStarIcon className="h-3.5 md:h-4 lg:h-[18px] lgx:h-[20px] xl:h-6 w-auto" />
                </div>
                <div className="flex justify-start items-center gap-2">
                  <div className="text-[#222014] text-xs md:text-sm font-normal leading-3 md:leading-4 tracking-[2px] xl:tracking-[3px] select-none">
                    MIRA RECOMMENDS
                  </div>
                  <div className="md:w-20 lgx:w-24 xl:w-[101px] w-16 h-px bg-[#9C7B5A] shrink-0" />
                </div>
              </div>
            )}
          </div>

          {/* Location Title & Subtitle */}
          <div className="flex flex-col gap-1.5 pt-1">
            <h3 className="text-foreground text-2xl md:text-[28px] lg:text-[30px] font-heading font-normal tracking-[0.5px]">
              {locationTitle}
            </h3>
            {staySubtitle && (
              <span className="text-accent text-xs md:text-[13px] uppercase tracking-[1.8px] block font-medium">
                {staySubtitle}
              </span>
            )}
          </div>

          {/* Description Narrative */}
          <DynamicStyledTextPreview
            data={stay.description || locData?.overview?.description || locData?.description}
            fallbackText="Experience carefully chosen boutique accommodation reflecting the authentic spirit of this destination."
            className="text-muted-foreground text-xs md:text-sm lg:text-[14.5px] leading-relaxed mt-1 font-normal"
          />
        </div>

        {/* Confirmation Badge Footer */}
        <div className="pt-4 border-t border-black/10 flex items-center gap-2 text-accent text-xs md:text-[13px] uppercase tracking-[1.8px] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 size-4">
            <path d="M8 9C9.65685 9 11 7.65685 11 6C11 4.34315 9.65685 3 8 3C6.34315 3 5 4.34315 5 6C5 7.65685 6.34315 9 8 9Z" stroke="#A8825A" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M8 1C5.2 1 3 3.2 3 6C3 10 8 15 8 15C8 15 13 10 13 6C13 3.2 10.8 1 8 1Z" stroke="#A8825A" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span>{confirmedText}</span>
        </div>
      </div>
    </div>
  )
}

// =========================================================================
// 4. MAIN ACCOMMODATIONS PREVIEW COMPONENT
// =========================================================================
export function AccommodationsPreview({ accommodations, draft }: { accommodations?: any; draft?: any }) {
  const safeData = accommodations || draft?.accommodations || {}
  const { philosophy: brandPhil, destinations: brandDest, standards: brandStd, visualReference: brandVis } = brandAccommodationData

  // 1. Philosophy Data
  const philData = safeData.philosophy || {}
  const philBadge = getStr(philData.badge ?? safeData.philosophyBadge, brandPhil.badge)
  const philTitle = getStr(philData.title ?? safeData.philosophyTitle, brandPhil.title)
  const philDesc = getStr(philData.description ?? safeData.philosophyDescription, brandPhil.description)
  const philPrinciples = Array.isArray(philData.principles) && philData.principles.length > 0
    ? philData.principles
    : brandPhil.principles

  // 2. Destinations & Stays Data (Falls back to brand default stays when draft has none)
  const destData = safeData.destinations || {}
  const staysBadge = getStr(destData.badge ?? safeData.destinationStaysBadge, brandDest.badge)
  const staysTitle = getStr(destData.title ?? safeData.destinationStaysTitle, brandDest.title)
  const staysDesc = getStr(destData.description ?? safeData.destinationStaysDescription, brandDest.description)
  const customStays = Array.isArray(safeData.stays) && safeData.stays.length > 0
    ? safeData.stays
    : Array.isArray(destData.stays) && destData.stays.length > 0
    ? destData.stays
    : Array.isArray(safeData.destinationStays) && safeData.destinationStays.length > 0
    ? safeData.destinationStays
    : brandDest.stays

  // 3. Standards Data
  const stdData = safeData.standards || {}
  const stdBadge = getStr(stdData.badge ?? safeData.standardsBadge, brandStd.badge)
  const stdTitle = getStr(stdData.title ?? safeData.standardsTitle, brandStd.title)
  const stdDesc = getStr(stdData.description ?? safeData.standardsDescription, brandStd.description)
  const stdList = Array.isArray(stdData.expectations) && stdData.expectations.length > 0
    ? stdData.expectations
    : Array.isArray(stdData.items) && stdData.items.length > 0
    ? stdData.items
    : brandStd.expectations

  // 4. Visual Reference Data & Carousel
  const visData = safeData.visualReference || safeData.visualStory || {}
  const visBadge = getStr(visData.badge ?? safeData.visualRefBadge, brandVis.badge)
  const visTitle = getStr(visData.title ?? safeData.visualRefTitle, brandVis.title)
  const visDesc = getStr(visData.description ?? safeData.visualRefDescription, brandVis.description)

  const galleryImages: string[] = useMemo(() => {
    const list: string[] = []

    const addImgUrl = (item: any) => {
      if (!item) return
      if (typeof item === "string" && item.trim()) {
        list.push(item.trim())
        return
      }
      // Check canonical multimedia object: multimedia.image.url
      if (item?.multimedia?.image?.url) {
        list.push(item.multimedia.image.url)
        return
      }
      // Direct image object: image.url
      if (item?.image?.url) {
        list.push(item.image.url)
        return
      }
      // Root url: url
      if (item?.url) {
        list.push(item.url)
        return
      }
    }

    // 1. Featured image if present
    addImgUrl(visData.featuredImage)

    // 2. Items list (from AccommodationsForm: visualReference.items)
    const rawItems = Array.isArray(visData.items) ? visData.items : []
    for (const item of rawItems) {
      addImgUrl(item)
    }

    // 3. galleryImages array if present
    if (Array.isArray(visData.galleryImages)) {
      for (const img of visData.galleryImages) {
        addImgUrl(img)
      }
    }

    // 4. Fallback to brand default if no images provided
    if (list.length === 0) {
      if (brandVis.featuredImage?.url) list.push(brandVis.featuredImage.url)
      if (Array.isArray(brandVis.galleryImages)) {
        for (const g of brandVis.galleryImages) {
          if (g?.url) list.push(g.url)
        }
      }
    }

    return list
  }, [visData, brandVis])

  const [activeSlide, setActiveSlide] = useState(0)

  const handlePrev = useCallback(() => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : Math.max(0, galleryImages.length - 1)))
  }, [galleryImages.length])

  const handleNext = useCallback(() => {
    setActiveSlide((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
  }, [galleryImages.length])

  return (
    <div className="w-full flex flex-col gap-14 md:gap-18 lg:gap-20 xl:gap-24">
      {/* =========================================================================
          SECTION 1: OUR PHILOSOPHY (4 PRINCIPLES GRID)
      ========================================================================= */}
      <section className="w-full flex flex-col gap-8 md:gap-10">
        <div className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6 pb-6 md:pb-8 border-b border-black/10">
          <div className="flex flex-col gap-2.5 max-w-xl">
            {philBadge && (
              <span className="text-accent text-xs font-semibold tracking-[2px] uppercase">
                {philBadge}
              </span>
            )}
            <h2 className="text-foreground font-heading text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
              {philTitle}
            </h2>
          </div>
          {philDesc && (
            <p className="text-muted-foreground text-xs md:text-sm lg:text-[14.5px] leading-relaxed max-w-lg">
              {philDesc}
            </p>
          )}
        </div>

        {/* 4 Principles Grid with clean architectural borders */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lgx:grid-cols-4 border border-black/10">
          {philPrinciples.map((item: any, idx: number) => {
            const borderClasses = getPrincipleBorderClasses(idx, philPrinciples.length)
            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 lg:p-8 flex flex-col justify-between gap-8 group hover:bg-[#F9F6ED]/60 transition-colors duration-300 ${borderClasses}`}
              >
                <div className="flex items-center justify-between">
                  <div className="size-9 md:size-10 shrink-0">
                    <PrincipleIcon type={item.icon || (idx === 0 ? "character" : idx === 1 ? "location" : idx === 2 ? "comfort" : "connection")} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground/60 select-none">
                    0{idx + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-foreground text-lg md:text-xl font-heading font-medium tracking-[0.5px]">
                    {getStr(item.title)}
                  </h4>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    {getStr(item.description)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: DESTINATIONS & STAYS (SAGE CONTAINER & CREAM CARDS)
      ========================================================================= */}
      <section className="w-full -mx-4 md:-mx-8 xl:-mx-12 px-4 md:px-8 xl:px-12 py-10 md:py-14 lg:py-16 bg-[#7A8475]/10">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-8 md:gap-10">
          {/* Section Header */}
          <div className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6 pb-6 md:pb-8 border-b border-black/10">
            <div className="flex flex-col gap-2.5 max-w-xl">
              {staysBadge && (
                <span className="text-accent text-xs font-semibold tracking-[2px] uppercase">
                  {staysBadge}
                </span>
              )}
              <h2 className="text-foreground font-heading text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
                {staysTitle}
              </h2>
            </div>
            {staysDesc && (
              <p className="text-muted-foreground text-xs md:text-sm lg:text-[14.5px] leading-relaxed max-w-lg">
                {staysDesc}
              </p>
            )}
          </div>

          {/* Stays List */}
          <div className="flex flex-col gap-6 md:gap-8 w-full">
            {customStays.map((stay: any, idx: number) => (
              <StayCard key={idx} stay={stay} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: STANDARDS / WHAT YOU CAN EXPECT (2-COLUMN 1:1 MATCH)
      ========================================================================= */}
      <section className="w-full xl:pt-[60px] mid:pt-14 md:pt-12 pt-8">
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-14 items-start xl:py-[60px] md:py-12 py-8 border-t border-b border-[#E8E2D8]">
          {/* Left Header */}
          <div className="w-full max-w-full lg:max-w-[320px] xl:max-w-[480px] shrink-0 flex flex-col gap-3 md:gap-4 xl:gap-5">
            {stdBadge && (
              <span className="text-accent text-xs font-semibold tracking-[2px] uppercase">
                {stdBadge}
              </span>
            )}
            <h2 className="text-[#222014] font-heading text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
              {stdTitle}
            </h2>
            {stdDesc && (
              <p className="text-[#57534E] text-xs md:text-sm lg:text-[14.7px] xl:text-base font-normal leading-5 md:leading-[22px] xl:leading-7 tracking-normal xl:tracking-[1px]">
                {stdDesc}
              </p>
            )}
          </div>

          {/* Right Grid of Standard Items - 1 col on mobile, 3 cols from sm up */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 bg-[#F9F6ED] overflow-hidden border border-[#E8E2D8]">
            {stdList.map((item: any, idx: number) => {
              const cols = 3
              const isLastCol = (idx + 1) % cols === 0
              const isLastRow = idx >= stdList.length - cols
              const isVeryLast = idx === stdList.length - 1
              const text = typeof item === "string" ? item : getStr(item.title ?? item.name ?? item)

              return (
                <div
                  key={idx}
                  className={`px-5 sm:px-6 md:px-7 py-5 sm:py-6 lg:py-7 flex items-center border-[#E8E2D8] ${
                    !isVeryLast ? "border-b" : ""
                  } ${isLastRow ? "sm:border-b-0" : "sm:border-b"} ${
                    isLastCol ? "sm:border-r-0" : "sm:border-r"
                  }`}
                >
                  <span className="text-[#4A483E] text-xs md:text-sm lg:text-[13.5px] xl:text-[15px] font-medium leading-[20px] md:leading-[22px] xl:leading-[24px]">
                    {text}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: VISUAL REFERENCE (50/50 SPLIT GALLERY 1:1 MATCH)
      ========================================================================= */}
      <section className="w-full flex flex-col gap-6 md:gap-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6 pb-6 md:pb-8 border-b border-[#E8E2D8]">
          <div className="flex flex-col gap-2.5 max-w-xl">
            {visBadge && (
              <span className="text-accent text-xs font-semibold tracking-[2px] uppercase">
                {visBadge}
              </span>
            )}
            <h2 className="text-[#222014] font-heading text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
              {visTitle}
            </h2>
          </div>
          {visDesc && (
            <p className="text-[#57534E] text-xs md:text-sm lg:text-[14.7px] xl:text-base font-normal leading-5 md:leading-[22px] xl:leading-7 tracking-normal xl:tracking-[1px] max-w-lg">
              {visDesc}
            </p>
          )}
        </div>

        {/* Gallery Showcase: 50% Left Featured + 50% Right 2 Stacked Images */}
        <div className="w-full flex flex-col gap-4 md:gap-5">
          <div className="flex flex-col lg:flex-row items-stretch gap-3 w-full">
            {/* Featured Large Image (50% left) */}
            <div className="w-full lg:w-1/2 min-h-[220px] sm:min-h-[320px] md:min-h-[380px] lg:h-[440px] xl:h-[480px] overflow-hidden bg-muted relative">
              <img
                src={getOptimizedImageUrl(galleryImages[activeSlide] || galleryImages[0], { width: 1000, quality: 100 })}
                alt="Accommodation Featured Atmosphere"
                className="w-full h-full object-cover object-center transition-all duration-700"
              />
            </div>

            {/* 2 Stacked Gallery Images (50% right) */}
            <div className="w-full lg:w-1/2 flex flex-col md:flex-row lg:flex-col gap-3 justify-between">
              {galleryImages.slice(1, 3).map((img, i) => (
                <div key={i} className="w-full h-[140px] sm:h-[190px] md:h-[200px] lg:h-[214px] xl:h-[234px] overflow-hidden bg-muted relative">
                  <img
                    src={getOptimizedImageUrl(img, { width: 800, quality: 100 })}
                    alt={`Atmosphere Preview ${i + 1}`}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dot Pagination */}
          {galleryImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {galleryImages.map((_, i) => {
                const isActive = i === activeSlide
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlide(i)}
                    aria-label={`Go to image set ${i + 1}`}
                    className="transition-all duration-300 shrink-0 p-1.5 -m-1.5 cursor-pointer"
                  >
                    <span
                      className="block transition-all duration-300"
                      style={
                        isActive
                          ? { width: 10, height: 10, borderRadius: 5, background: "#8D6534" }
                          : { width: 8, height: 8, borderRadius: 4, background: "rgba(25, 27, 30, 0.25)" }
                      }
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default AccommodationsPreview
