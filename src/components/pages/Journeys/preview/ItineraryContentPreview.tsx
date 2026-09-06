/* =====================================================
   JOURNEYS — ITINERARY TAB PREVIEW
   100% Pixel-Perfect Match with:
   frontend/components/journey-overview/itinerary-content.tsx
   Uses UniversalMultimediaPreview Single Source of Truth
   Features:
   - Consecutive day location grouping (Day 1-2, Day 3, etc.)
   - Interactive map sidebar route stops with hover preview popovers
   - Day-by-day accordion grouped by shared location sections
   - DynamicStyledField text & color styling support
===================================================== */

import { useState, useMemo, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Compass, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { JourneyRealMap } from "./JourneyRealMap"
import { journeyRouteData, dayByDayItineraryData } from "./journeyStaticData"
import {
  getJourneyItineraryDays,
  getDayEyebrow,
  getDayTitle,
  getDayLocation,
  getDayDescription,
  getDayMedia,
  type Journey,
  type ItineraryDayItem,
} from "../journeyTypes"

const SECTION_PX = "px-4 lg:px-0"
const SECTION_GAP_BOTTOM = "pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"

export interface FormattedDayItem {
  id: string | number
  dayNumber: number
  dayLabel: string
  eyebrow?: string
  eyebrowStyle?: Record<string, any> | null
  title: string
  titleStyle?: Record<string, any> | null
  location: string
  locationId?: string | null
  geoData?: {
    latitude: number | null
    longitude: number | null
  } | null
  detailedHeading: string
  description: string
  descriptionStyle?: Record<string, any> | null
  multimedia?: Record<string, any> | null
  thumbnail: string
  images: string[]
}

export interface LocationDayGroup {
  groupKey: string
  locationName: string
  locationId?: string | null
  geoData?: {
    latitude: number | null
    longitude: number | null
  } | null
  startDay: number
  endDay: number
  dayCount: number
  dayRangeLabel: string
  days: FormattedDayItem[]
  primaryImage: string
  multimedia?: Record<string, any> | null
}

function hasActualMedia(m?: Record<string, any> | null): boolean {
  if (!m) return false
  if (m.type === "video" && (m.video?.url || m.url)) return true
  if (m.type === "image" && (m.image?.url || m.url)) return true
  return false
}

function getFieldStyleProps(style?: Record<string, any> | null): React.CSSProperties {
  if (!style) return {}
  const res: React.CSSProperties = {}
  if (style.textColor) res.color = style.textColor
  if (style.textOpacity !== undefined && style.textOpacity !== null && !style.textColor?.startsWith("rgba")) {
    res.opacity = Number(style.textOpacity) / 100
  }
  if (style.backgroundColor) res.backgroundColor = style.backgroundColor
  return res
}

/**
 * Group consecutive days sharing the same location
 * e.g., Day 1 & Day 2 in "Theth" -> "Day 1-2" (2 Days)
 * Day 3 in "Valbona" -> "Day 3" (1 Day)
 */
function groupDaysByLocation(dayList: FormattedDayItem[]): LocationDayGroup[] {
  if (!dayList || dayList.length === 0) return []

  const groups: LocationDayGroup[] = []
  let current: LocationDayGroup | null = null

  for (let i = 0; i < dayList.length; i++) {
    const day = dayList[i]
    const rawLocName = (day.location || "").trim()
    const locName =
      rawLocName ||
      (day.locationId ? "Selected Destination" : `Stop ${groups.length + 1}`)

    const locKey = day.locationId
      ? `id:${day.locationId}`
      : rawLocName
      ? `name:${rawLocName.toLowerCase()}`
      : `day:${day.dayNumber}` // Keep unassigned days distinct

    const prevLocKey: string | null = current
      ? current.locationId
        ? `id:${current.locationId}`
        : current.locationName
        ? `name:${current.locationName.toLowerCase()}`
        : null
      : null

    const hasDayMedia = hasActualMedia(day.multimedia)
    const dayThumb = day.thumbnail || day.images[0] || "/images/albania-journey1.jpg"

    if (current && locKey === prevLocKey) {
      // Same consecutive location!
      current.endDay = day.dayNumber
      current.dayCount += 1
      current.days.push(day)
      if (!hasActualMedia(current.multimedia) && hasDayMedia) {
        current.multimedia = day.multimedia
        current.primaryImage = dayThumb
      }
      if (!current.geoData && day.geoData) {
        current.geoData = day.geoData
      }
    } else {
      // New location stop
      current = {
        groupKey: `loc-group-${groups.length}-${locKey}`,
        locationName: locName,
        locationId: day.locationId,
        geoData: day.geoData || null,
        startDay: day.dayNumber,
        endDay: day.dayNumber,
        dayCount: 1,
        dayRangeLabel: "",
        days: [day],
        primaryImage: dayThumb,
        multimedia: day.multimedia || null,
      }
      groups.push(current)
    }
  }

  // Format dayRangeLabel (e.g., "Day 1-2", "Day 3", "Day 5-6")
  for (const g of groups) {
    if (g.startDay === g.endDay) {
      g.dayRangeLabel = `Day ${g.startDay}`
    } else {
      g.dayRangeLabel = `Day ${g.startDay}-${g.endDay}`
    }
  }

  return groups
}

export function ItineraryContentPreview({ draft }: { draft?: Journey }) {
  const routeData = (draft?.data as any)?.route || (draft?.data as any)?.itinerarySection || {}
  const itinerarySection = (draft?.data?.itinerarySection as any) || {}
  const itineraryBg = itinerarySection?.backgroundMultimedia || routeData?.backgroundMultimedia

  // Route map data with static fallbacks
  const routeTitle = routeData?.title || routeData?.routeTitle || itinerarySection?.routeTitle || journeyRouteData.title
  const routeDescription = routeData?.description || routeData?.routeDescription || itinerarySection?.routeDescription || journeyRouteData.description
  const mapImageSrc =
    typeof routeData?.mapImage === "string"
      ? routeData.mapImage
      : routeData?.mapImage?.src || routeData?.mapImage?.url || itinerarySection?.mapImage?.src || journeyRouteData.mapImage.src
  const mapImageAlt =
    (typeof routeData?.mapImage === "object" && routeData?.mapImage?.alt) ||
    itinerarySection?.mapImage?.alt ||
    journeyRouteData.mapImage.alt

  // Normalize draft days with eyebrow, styles, and multimedia
  const draftDays = draft ? getJourneyItineraryDays(draft) : []
  const formattedDays: FormattedDayItem[] = useMemo(() => {
    if (draftDays.length > 0) {
      return draftDays.map((d: ItineraryDayItem, idx: number) => {
        const itemNum = d.dayNumber ?? idx + 1
        const dayLabel = d.dayLabel || `Day ${itemNum}`
        const eyebrowData = getDayEyebrow(d)
        const titleData = getDayTitle(d, itemNum)
        const locData = getDayLocation(d)
        const descData = getDayDescription(d)
        const media = getDayMedia(d)
        const isVideo = media.type === "video"
        const mediaUrl =
          media.type === "video"
            ? (media.video?.url || media.url || "")
            : (media.image?.url || media.url || "")
        const thumb =
          media.type === "image" && mediaUrl
            ? mediaUrl
            : isVideo && (media.video?.poster || media.posterUrl)
            ? media.video?.poster || media.posterUrl
            : isVideo && mediaUrl
            ? mediaUrl
            : d.thumbnail ||
              d.journeyItineraryImage?.[0] ||
              d.images?.[0] ||
              "/images/albania-journey1.jpg"

        const rawImgs =
          d.images && d.images.length > 0
            ? d.images
            : d.journeyItineraryImage && d.journeyItineraryImage.length > 0
            ? d.journeyItineraryImage
            : mediaUrl
            ? [mediaUrl]
            : [thumb]

        return {
          id: d.id || `day-${itemNum}`,
          dayNumber: itemNum,
          dayLabel,
          eyebrow: eyebrowData.text,
          eyebrowStyle: eyebrowData.style,
          title: titleData.text,
          titleStyle: titleData.style,
          location: locData.name,
          locationId: locData.id,
          geoData: locData.geoData,
          detailedHeading: d.detailedHeading || titleData.text || `Day ${itemNum} Experience`,
          description: descData.text,
          descriptionStyle: descData.style,
          multimedia: media,
          thumbnail: thumb,
          images: rawImgs,
        }
      })
    }

    // Static fallback
    return dayByDayItineraryData.days.map((d: any, idx: number) => ({
      id: `static-${idx + 1}`,
      dayNumber: d.dayNumber ?? idx + 1,
      dayLabel: d.dayLabel || `Day ${idx + 1}`,
      eyebrow: "",
      eyebrowStyle: null,
      title: d.title,
      titleStyle: null,
      location: d.location || "",
      locationId: null,
      geoData: null,
      detailedHeading: d.detailedHeading || d.title,
      description: d.description,
      descriptionStyle: null,
      multimedia: null,
      thumbnail: d.thumbnail,
      images: d.images,
    }))
  }, [draftDays])

  // Group days by consecutive location
  const locationGroups: LocationDayGroup[] = useMemo(() => {
    return groupDaysByLocation(formattedDays)
  }, [formattedDays])

  // Map sidebar stops: dynamically derived from locationGroups, with count (e.g. Day 1-2, Day 3)
  const stops = useMemo(() => {
    if (locationGroups.length > 0) {
      return locationGroups.map((g, idx) => ({
        id: g.groupKey,
        idx,
        name: g.locationName,
        days: g.dayRangeLabel,
        dayCount: g.dayCount,
        daysList: g.days,
        image: g.primaryImage,
        multimedia: g.multimedia,
        geoData: g.geoData,
        locationId: g.locationId,
      }))
    }
    return (
      (routeData?.stops && routeData.stops.length > 0
        ? routeData.stops
        : itinerarySection?.stops && itinerarySection.stops.length > 0
        ? itinerarySection.stops
        : journeyRouteData.stops) || []
    ).map((s: any, idx: number) => ({
      id: `static-${idx}`,
      idx,
      name: s.name,
      days: s.days,
      dayCount: 1,
      daysList: [],
      image: "/images/albania-journey1.jpg",
      multimedia: null,
      geoData: null,
      locationId: null,
    }))
  }, [locationGroups, routeData?.stops, itinerarySection?.stops])

  // Map Pins calculation (GPS bounds or scenic curve path)
  const stopPins = useMemo(() => {
    if (!stops || stops.length === 0) return []

    const curvePoints = [
      { x: 30, y: 38 },
      { x: 44, y: 28 },
      { x: 58, y: 36 },
      { x: 72, y: 48 },
      { x: 62, y: 68 },
      { x: 46, y: 74 },
      { x: 32, y: 82 },
      { x: 22, y: 64 },
    ]

    const validGeoStops = stops.filter(
      (s: any) =>
        typeof s.geoData?.latitude === "number" &&
        typeof s.geoData?.longitude === "number"
    )

    if (validGeoStops.length >= 2) {
      const lats = validGeoStops.map((s: any) => s.geoData!.latitude!)
      const lngs = validGeoStops.map((s: any) => s.geoData!.longitude!)
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)
      const minLng = Math.min(...lngs)
      const maxLng = Math.max(...lngs)

      const latSpan = maxLat - minLat || 0.05
      const lngSpan = maxLng - minLng || 0.05

      return stops.map((stop: any, i: number) => {
        if (
          typeof stop.geoData?.latitude === "number" &&
          typeof stop.geoData?.longitude === "number"
        ) {
          const normX = (stop.geoData.longitude - minLng) / lngSpan
          const normY = (maxLat - stop.geoData.latitude) / latSpan
          const x = Math.min(Math.max(18 + normX * 64, 15), 85)
          const y = Math.min(Math.max(20 + normY * 60, 18), 82)
          return { ...stop, x, y, isGeo: true }
        }
        const pt = curvePoints[i % curvePoints.length]
        return { ...stop, x: pt.x, y: pt.y, isGeo: false }
      })
    }

    return stops.map((stop: any, i: number) => {
      const pt = curvePoints[i % curvePoints.length]
      return { ...stop, x: pt.x, y: pt.y, isGeo: false }
    })
  }, [stops])

  // Route path SVG line
  const routePathD = useMemo(() => {
    if (!stopPins || stopPins.length < 2) return ""
    return stopPins.reduce((acc: string, pt: any, idx: number) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`
      return `${acc} L ${pt.x} ${pt.y}`
    }, "")
  }, [stopPins])

  // Day by day headers
  const dayByDayTitle = itinerarySection?.dayByDayTitle || dayByDayItineraryData.title
  const dayByDaySubtitle = itinerarySection?.dayByDaySubtitle || dayByDayItineraryData.subtitle

  const [expandedId, setExpandedId] = useState<string | number | null>(
    formattedDays[0]?.id || 1
  )
  const [hoveredStopIdx, setHoveredStopIdx] = useState<number | null>(null)
  const [hoverSource, setHoverSource] = useState<"sidebar" | "map">("sidebar")
  const [selectedStopIdx, setSelectedStopIdx] = useState<number | null>(null)
  const [mapZoom, setMapZoom] = useState<number>(1)
  const [mapMode, setMapMode] = useState<"real" | "visual">("real")

  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  const handleHoverStop = useCallback((idx: number | null, source: "sidebar" | "map" = "sidebar") => {
    setHoverSource(source)
    setHoveredStopIdx(idx)
  }, [])

  const toggleExpand = (id: string | number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleStopClick = useCallback((idx: number, stop: any) => {
    setSelectedStopIdx(idx)
    if (stop.daysList && stop.daysList.length > 0) {
      const targetDay = stop.daysList[0]
      setExpandedId(targetDay.id)
      const targetEl =
        document.getElementById(`itinerary-day-${targetDay.id}`) ||
        document.getElementById(`location-group-${stop.id}`)
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [])

  const handleZoomIn = () => setMapZoom((prev) => Math.min(prev + 0.25, 2.25))
  const handleZoomOut = () => setMapZoom((prev) => Math.max(prev - 0.25, 1))
  const handleResetZoom = () => setMapZoom(1)

  return (
    <div className={`relative w-full flex flex-col xl:pt-[51px] pt-6 md:pt-11 lgx:pt-12 ${SECTION_GAP_BOTTOM}`}>
      {/* Background Universal Multimedia */}
      {itineraryBg && (
        <UniversalMultimediaPreview
          multimedia={itineraryBg}
          mode="background"
          className="h-full w-full object-cover"
          containerClassName="absolute inset-0 z-0 pointer-events-none"
        />
      )}

      {/* =====================================================
          1. JOURNEY ROUTE MAP SECTION WITH INTERACTIVE STOPS
      ===================================================== */}
      <section className="relative z-10 w-full">
        <div className={`w-full container mx-auto ${SECTION_PX}`}>
          <div className="max-w-[1216px] flex flex-col gap-10 md:gap-[50px] lgx:gap-[60px] xl:gap-[66px]">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-3 md:gap-3.5 xl:gap-4">
                <h2 className="text-primary xl:text-[24px] lgx:text-[22px] md:text-[20px] text-[18px] font-heading font-semibold xl:leading-8 lgx:leading-7 md:leading-6 leading-5">
                  {routeTitle}
                </h2>
                <p className="text-subtitle lgx:max-w-[75%] mid:max-w-full w-full text-sm md:text-[15px] xl:text-base font-normal leading-6">
                  {routeDescription}
                </p>
              </div>

              {/* Real Map / Illustrated Map Switcher */}
              <div className="flex items-center gap-1 self-start md:self-auto rounded-full bg-neutral-200/80 p-1 text-xs border border-black/5 shadow-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setMapMode("real")}
                  className={cn(
                    "rounded-full px-3 py-1 font-medium transition cursor-pointer flex items-center gap-1.5",
                    mapMode === "real"
                      ? "bg-white text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <MapPin className="size-3 text-[#af6348]" />
                  Real GPS Map
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode("visual")}
                  className={cn(
                    "rounded-full px-3 py-1 font-medium transition cursor-pointer",
                    mapMode === "visual"
                      ? "bg-white text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Visual Map
                </button>
              </div>
            </div>

            {/* Map Card Container */}
            <div
              ref={mapContainerRef}
              className="relative w-full h-[360px] md:h-[500px] lg:h-[540px] lgx:h-[550px] xlg:h-[560px] xl:h-[565px] rounded-[14px] overflow-hidden border border-[#E7E5E4] bg-neutral-100"
            >
              {/* Mode 1: Interactive Real Vector Map */}
              {mapMode === "real" ? (
                <JourneyRealMap
                  stops={stops}
                  selectedStopIdx={selectedStopIdx}
                  hoveredStopIdx={hoveredStopIdx}
                  hoverSource={hoverSource}
                  onSelectStop={handleStopClick}
                  onHoverStop={handleHoverStop}
                  className="absolute inset-0 size-full"
                />
              ) : (
                /* Mode 2: Scalable Map Visual Layer */
                <div
                  className="relative h-full w-full transition-transform duration-300 ease-out origin-center"
                  style={{ transform: `scale(${mapZoom})` }}
                >
                  {/* Map Background Visual */}
                  <UniversalMultimediaPreview
                    multimedia={{
                      type: "image",
                      url: mapImageSrc,
                      alt: mapImageAlt,
                    }}
                    fallbackImageSrc={mapImageSrc}
                    fallbackAlt={mapImageAlt}
                    mode="background"
                    className="h-full w-full object-cover object-center"
                    containerClassName="absolute inset-0"
                  />

                  {/* SVG Route Trail Connecting Stop Pins */}
                  {routePathD && (
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 size-full pointer-events-none z-10"
                    >
                      <path
                        d={routePathD}
                        fill="none"
                        stroke="#af6348"
                        strokeWidth="0.7"
                        strokeDasharray="2 1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-75 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                      />
                    </svg>
                  )}

                  {/* Interactive Map Route Pins */}
                  {stopPins.map((pin: any, pIdx: number) => {
                    const isHovered = hoveredStopIdx === pIdx
                    const isSelected = selectedStopIdx === pIdx

                    return (
                      <div
                        key={pin.id || pIdx}
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        onMouseEnter={() => handleHoverStop(pIdx)}
                        onMouseLeave={() => handleHoverStop(null)}
                        onClick={() => handleStopClick(pIdx, pin)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group select-none transition-transform hover:scale-115 active:scale-95"
                      >
                        {/* Pulse Radar on Active or Hovered Pin */}
                        {(isHovered || isSelected) && (
                          <span className="absolute -inset-2 rounded-full bg-[#af6348]/35 animate-ping pointer-events-none" />
                        )}

                        {/* Pin Badge */}
                        <div
                          className={cn(
                            "flex items-center gap-1.5 rounded-full px-2 py-0.5 shadow-md border transition-all text-xs font-semibold backdrop-blur-sm",
                            isSelected
                              ? "bg-[#af6348] text-white border-white scale-110 shadow-lg ring-2 ring-[#af6348]/40"
                              : isHovered
                              ? "bg-[#af6348] text-white border-white scale-105 shadow-md"
                              : "bg-white/95 text-neutral-900 border-black/10 hover:border-[#af6348]"
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-4 items-center justify-center rounded-full text-[10px] font-bold",
                              isSelected || isHovered
                                ? "bg-white/20 text-white"
                                : "bg-black/10 text-neutral-800"
                            )}
                          >
                            {pIdx + 1}
                          </span>
                          <span className="text-[11px] font-medium hidden sm:inline-block max-w-[85px] truncate">
                            {pin.name}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Floating Route Stops Sidebar (Left) */}
              <div className="absolute left-3 md:left-8 top-3 md:top-8 z-20 bg-[#F8F5F3]/95 backdrop-blur-md p-3 md:p-4 xl:p-5 rounded-[12px] md:rounded-[16px] lgx:rounded-[18px] xl:rounded-[20px] max-h-[calc(100%-24px)] overflow-y-auto no-scrollbar shadow-lg border border-black/5">
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-black/10">
                  <div className="flex items-center gap-1.5">
                    <Compass className="size-3.5 text-[#af6348]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Route Stops ({stops.length})
                    </span>
                  </div>
                  {selectedStopIdx !== null && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedStopIdx(null)
                      }}
                      className="text-[10px] font-medium text-muted-foreground hover:text-foreground underline transition cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="flex flex-col xl:w-[195px] lgx:w-[185px] md:w-[178px] w-[165px] xl:gap-2.5 md:gap-2 gap-1.5">
                  {stops.map((stop: any, idx: number) => {
                    const isHovered = hoveredStopIdx === idx
                    const isSelected = selectedStopIdx === idx

                    return (
                      <div
                        key={stop.id || idx}
                        onMouseEnter={() => handleHoverStop(idx, "sidebar")}
                        onMouseLeave={() => handleHoverStop(null, "sidebar")}
                        onClick={() => handleStopClick(idx, stop)}
                        className={cn(
                          "flex items-start gap-2 md:gap-2.5 xl:gap-3 p-1.5 rounded-xl transition-all cursor-pointer border",
                          isSelected
                            ? "bg-[#af6348]/10 border-[#af6348]/40 shadow-xs ring-1 ring-[#af6348]/30"
                            : isHovered
                            ? "bg-black/5 border-black/10 shadow-xs"
                            : "border-transparent hover:bg-black/5 hover:border-black/5"
                        )}
                      >
                        {/* Stop Number Marker */}
                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-1 transition-colors",
                            isSelected
                              ? "bg-[#af6348] text-white"
                              : "bg-black/10 text-neutral-700"
                          )}
                        >
                          {idx + 1}
                        </span>

                        {/* Stop Media Thumbnail using UniversalMultimediaPreview */}
                        <div className="relative size-10 md:size-11 xl:size-12 rounded-lg overflow-hidden shrink-0 bg-neutral-200 border border-black/10">
                          <UniversalMultimediaPreview
                            multimedia={
                              stop.multimedia || {
                                type: "image",
                                url: stop.image,
                                alt: stop.name,
                              }
                            }
                            fallbackImageSrc={stop.image}
                            fallbackAlt={stop.name}
                            mode="background"
                            className="h-full w-full object-cover object-center"
                            containerClassName="absolute inset-0"
                          />
                        </div>

                        {/* Stop Info */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={cn(
                              "text-sm md:text-[14px] font-medium leading-[18px] md:leading-5 truncate transition-colors",
                              isSelected
                                ? "text-[#af6348] font-bold"
                                : isHovered
                                ? "text-[#af6348] font-semibold"
                                : "text-title"
                            )}
                          >
                            {stop.name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-muted text-[11px] md:text-[12px] font-normal leading-4">
                              {stop.days}
                            </span>
                            {stop.dayCount > 1 && (
                              <span className="rounded bg-[#af6348]/15 px-1 py-0.2 text-[9px] font-semibold text-[#af6348]">
                                {stop.dayCount}d
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Floating Rich Tooltip / Hover Popover next to Sidebar */}
              <AnimatePresence>
                {hoveredStopIdx !== null && stops[hoveredStopIdx] && (
                  <motion.div
                    key={`sidebar-popover-${hoveredStopIdx}`}
                    initial={{ opacity: 0, x: -8, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-[200px] md:left-[245px] xl:left-[270px] top-3 md:top-8 z-30 w-72 md:w-80 rounded-2xl border border-black/10 bg-[#FAF8F5]/95 backdrop-blur-md p-4 shadow-2xl text-neutral-900 pointer-events-none"
                  >
                    {/* Popover Header */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-black/10">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="size-4 text-[#af6348] shrink-0" />
                        <span className="font-heading font-bold text-sm md:text-base text-neutral-900 truncate">
                          {stops[hoveredStopIdx].name}
                        </span>
                      </div>
                      <span className="rounded-full bg-[#af6348]/15 px-2.5 py-0.5 text-xs font-semibold text-[#af6348] shrink-0">
                        {stops[hoveredStopIdx].days}
                      </span>
                    </div>

                    {/* Popover Image Thumbnails — mapped over all days */}
                    {stops[hoveredStopIdx].daysList?.length > 0 && (
                      <div className="mt-2.5 flex gap-1.5 overflow-hidden rounded-xl">
                        {stops[hoveredStopIdx].daysList.map((d: FormattedDayItem, dIdx: number) => (
                          <div
                            key={dIdx}
                            className="relative flex-1 min-w-0 h-24 sm:h-28 overflow-hidden rounded-lg bg-neutral-200 border border-black/5"
                          >
                            <UniversalMultimediaPreview
                              multimedia={
                                d.multimedia || {
                                  type: "image",
                                  url: d.thumbnail,
                                  alt: d.title,
                                }
                              }
                              fallbackImageSrc={d.thumbnail}
                              fallbackAlt={d.title}
                              mode="background"
                              className="h-full w-full object-cover"
                              containerClassName="absolute inset-0"
                            />
                            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                              {d.dayLabel || `Day ${d.dayNumber}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Days highlights included in this stop */}
                    {stops[hoveredStopIdx].daysList?.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Itinerary Days ({stops[hoveredStopIdx].daysList.length}):
                        </div>
                        <div className="space-y-1.5 max-h-32 overflow-hidden">
                          {stops[hoveredStopIdx].daysList.map((d: FormattedDayItem, dIdx: number) => (
                            <div key={dIdx} className="flex items-center gap-2 text-xs text-neutral-800 leading-snug">
                              {/* Per-day multimedia thumbnail */}
                              <div className="relative size-8 rounded-md overflow-hidden shrink-0 bg-neutral-200 border border-black/10">
                                <UniversalMultimediaPreview
                                  multimedia={
                                    d.multimedia || {
                                      type: "image",
                                      url: d.thumbnail,
                                      alt: d.title,
                                    }
                                  }
                                  fallbackImageSrc={d.thumbnail}
                                  fallbackAlt={d.title}
                                  mode="background"
                                  className="h-full w-full object-cover object-center"
                                  containerClassName="absolute inset-0"
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-[#af6348] shrink-0 text-[11px]">
                                  {d.dayLabel || `Day ${d.dayNumber}`}
                                </span>
                                <span className="truncate text-[11px] text-neutral-700">{d.title}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* First day snippet */}
                    {stops[hoveredStopIdx].daysList?.[0]?.description && (
                      <p className="mt-2 text-[11px] text-neutral-600 line-clamp-2 leading-relaxed border-t border-black/5 pt-1.5">
                        {stops[hoveredStopIdx].daysList[0].description}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Map Zoom Controls (Bottom Right - for Visual Mode) */}
              {mapMode === "visual" && (
                <div className="absolute right-3 md:right-[31px] bottom-3 md:bottom-[27px] z-20 flex flex-col items-center xl:gap-2.5 md:gap-2 gap-1.5 bg-[#F8F5F3]/95 backdrop-blur-md shadow-lg border border-black/10 rounded-full p-1.5">
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    aria-label="Zoom in"
                    title="Zoom In"
                    className="size-8 flex items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 active:scale-95 transition-colors cursor-pointer"
                  >
                    <Plus className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    aria-label="Zoom out"
                    title="Zoom Out"
                    className="size-8 flex items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 active:scale-95 transition-colors cursor-pointer"
                  >
                    <Minus className="size-4" />
                  </button>
                  {mapZoom !== 1 && (
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      aria-label="Reset zoom"
                      title="Reset Zoom"
                      className="text-[9px] font-bold text-[#af6348] hover:text-[#af6348]/80 px-1 py-0.5 rounded transition cursor-pointer"
                    >
                      1x
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. DAY BY DAY ITINERARY ACCORDION GROUPED BY LOCATION
      ===================================================== */}
      <section className="relative z-10 w-full xl:pt-[50px] md:pt-[46px] pt-10">
        <div className={`w-full container mx-auto ${SECTION_PX}`}>
          <div className="max-w-[1216px] flex flex-col gap-6 sm:gap-8 lgx:gap-10">
            {/* Section Header */}
            <div className="flex flex-col gap-2 max-w-[860px]">
              <h2 className="text-primary font-heading text-[18px] md:text-[20px] lgx:text-[22px] xl:text-[24px] font-semibold xl:leading-8 lgx:leading-7 md:leading-6 leading-5">
                {dayByDayTitle}
              </h2>
              <p className="text-subtitle xl:text-sm md:text-[13px] text-xs font-normal xl:leading-5 md:leading-4 leading-3.5">
                {dayByDaySubtitle}
              </p>
            </div>

            {/* Accordion Grouped by Shared Location Sections */}
            <div className="flex flex-col gap-6 w-full">
              {locationGroups.map((locGroup: LocationDayGroup) => {
                return (
                  <div
                    key={locGroup.groupKey}
                    id={`location-group-${locGroup.groupKey}`}
                    className="w-full rounded-[18px] border border-black/10 bg-neutral-50/70 p-3 md:p-5 shadow-xs space-y-3.5 transition-all hover:border-black/15 scroll-mt-24"
                  >
                    {/* Location Section Group Header Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-black/10 px-1">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative size-8 md:size-9 rounded-lg overflow-hidden shrink-0 bg-neutral-200 border border-black/10">
                          <UniversalMultimediaPreview
                            multimedia={
                              locGroup.multimedia || {
                                type: "image",
                                url: locGroup.primaryImage,
                                alt: locGroup.locationName,
                              }
                            }
                            fallbackImageSrc={locGroup.primaryImage}
                            fallbackAlt={locGroup.locationName}
                            mode="background"
                            className="h-full w-full object-cover object-center"
                            containerClassName="absolute inset-0"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h3 className="font-heading text-sm md:text-base font-bold text-neutral-900 truncate">
                            {locGroup.locationName}
                          </h3>
                          <span className="text-[11px] md:text-xs text-muted-foreground">
                            {locGroup.dayCount} {locGroup.dayCount === 1 ? "Day Stay" : "Days Stay"} • {locGroup.days.length} Itinerary {locGroup.days.length === 1 ? "Day" : "Days"}
                          </span>
                        </div>
                      </div>

                      {/* Location Range Badge */}
                      <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                        {locGroup.dayRangeLabel}
                      </span>
                    </div>

                    {/* Day-by-Day Accordion Items under this Location Section */}
                    <div className="flex flex-col gap-3">
                      {locGroup.days.map((item: FormattedDayItem) => {
                        const itemId = item.id
                        const isExpanded = expandedId === itemId
                        const itemNum = item.dayNumber
                        const dayLabel = item.dayLabel || `Day ${itemNum}`

                        // Dynamic styled field styles
                        const titleCss = getFieldStyleProps(item.titleStyle)
                        const eyebrowCss = getFieldStyleProps(item.eyebrowStyle)
                        const descCss = getFieldStyleProps(item.descriptionStyle)

                        return (
                          <div
                            key={itemId}
                            id={`itinerary-day-${itemId}`}
                            className={cn(
                              "w-full xl:rounded-[14px] md:rounded-[12px] rounded-[8px] border transition-all duration-300 overflow-hidden bg-white scroll-mt-28",
                              isExpanded
                                ? "border-black/15 xl:py-6 md:py-5 py-4 shadow-sm"
                                : "border-black/10 hover:border-black/20 xl:h-[130px] md:h-[120px] h-[110px]",
                              selectedStopIdx !== null &&
                                stops[selectedStopIdx]?.daysList?.some((d: any) => d.id === itemId)
                                ? "ring-2 ring-[#af6348]/40 border-[#af6348]/60 shadow-md"
                                : ""
                            )}
                          >
                            {/* Clickable Header Row */}
                            <button
                              type="button"
                              onClick={() => toggleExpand(itemId)}
                              className={`w-full xl:p-4 md:p-3.5 p-3 flex items-center justify-between text-left cursor-pointer transition-colors ${
                                !isExpanded ? "h-full" : ""
                              }`}
                            >
                              <div className="flex items-center xl:gap-4 md:gap-3.5 gap-3 min-w-0 flex-1">
                                {/* Number Badge */}
                                <div className="xl:size-8 md:size-7 size-6 shrink-0 bg-dark text-neutral-100 rounded-full flex items-center justify-center xl:text-sm text-[12px] md:text-[13px] font-medium leading-5">
                                  {itemNum}
                                </div>

                                {/* Thumbnail using UniversalMultimediaPreview */}
                                <div className="relative xl:w-24 xl:h-24 md:w-20 md:h-20 w-16 h-16 xl:rounded-[10px] md:rounded-[8px] rounded-[6px] shrink-0 overflow-hidden bg-neutral-200">
                                  <UniversalMultimediaPreview
                                    multimedia={
                                      item.multimedia || {
                                        type: "image",
                                        url: item.thumbnail,
                                        alt: item.title,
                                      }
                                    }
                                    fallbackImageSrc={item.thumbnail}
                                    fallbackAlt={item.title}
                                    mode="background"
                                    className="h-full w-full object-cover object-center"
                                    containerClassName="absolute inset-0"
                                  />
                                </div>

                                {/* Day Label, Eyebrow, Title, and Location */}
                                <div className="flex flex-col items-start justify-center gap-0.5 md:gap-1 min-w-0">
                                  {/* Eyebrow or Day Label */}
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted text-xs md:text-[13px] xl:text-sm font-normal md:leading-3.5 leading-3 xl:leading-4">
                                      {dayLabel}
                                    </span>
                                    {item.eyebrow && (
                                      <span
                                        style={eyebrowCss}
                                        className="text-[11px] font-semibold text-primary uppercase tracking-wider"
                                      >
                                        • {item.eyebrow}
                                      </span>
                                    )}
                                  </div>

                                  {/* Day Title with DynamicStyledField styling applied */}
                                  <h3
                                    style={titleCss}
                                    className="text-dark text-sm md:text-[15px] xl:text-base font-semibold leading-5 md:leading-6 truncate font-heading"
                                  >
                                    {item.title}
                                  </h3>

                                  {item.location && (
                                    <span className="text-subtitle text-xs md:text-[13px] xl:text-sm font-normal md:leading-3.5 leading-3 xl:leading-4 truncate flex items-center gap-1">
                                      <MapPin className="size-3 text-muted shrink-0" />
                                      {item.location}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Expand/Collapse Chevron */}
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="xl:w-6 xl:h-6 md:w-5 md:h-5 w-4 h-4 aspect-square shrink-0 text-dark"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-full h-full">
                                  <path
                                    d="M12.0002 16.0002C11.8686 16.0009 11.7381 15.9757 11.6163 15.926C11.4944 15.8762 11.3836 15.8029 11.2902 15.7102L5.29019 9.71019C5.10188 9.52188 4.99609 9.26649 4.99609 9.00019C4.99609 8.73388 5.10188 8.47849 5.29019 8.29019C5.47849 8.10188 5.73388 7.99609 6.00019 7.99609C6.26649 7.99609 6.52188 8.10188 6.71019 8.29019L12.0002 13.5902L17.2902 8.30019C17.4815 8.13636 17.7276 8.05075 17.9792 8.06047C18.2309 8.0702 18.4697 8.17453 18.6477 8.35262C18.8258 8.53072 18.9302 8.76946 18.9399 9.02113C18.9496 9.27281 18.864 9.51888 18.7002 9.71019L12.7002 15.7102C12.5139 15.8949 12.2625 15.9991 12.0002 16.0002Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </motion.div>
                            </button>

                            {/* Expanded Content Panel */}
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  key="content"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-6 flex flex-col xl:gap-6 gap-3.5 md:gap-4 xlg:gap-5 xl:px-4 md:px-3.5 px-2.5">
                                    <div className="flex flex-col lg:flex-row items-center">
                                      {/* Left Narrative Text */}
                                      <div className="flex-1 flex flex-col justify-center xl:p-[35px] lgx:p-8 md:p-7 p-5">
                                        <div className="flex flex-col">
                                          {/* Eyebrow or Day Label */}
                                          <div className="flex items-center gap-2 mb-[9px]">
                                            {item.dayLabel && (
                                              <span className="text-accent-hover text-[11.8px] leading-[19.5px] font-bold uppercase tracking-[0.85px]">
                                                {item.dayLabel}
                                              </span>
                                            )}
                                            {item.eyebrow && (
                                              <span
                                                style={eyebrowCss}
                                                className="text-[11.8px] leading-[19.5px] font-bold uppercase tracking-[0.85px] text-primary"
                                              >
                                                • {item.eyebrow}
                                              </span>
                                            )}
                                          </div>

                                          {/* Detailed Heading / Day Title */}
                                          <h4
                                            style={titleCss}
                                            className="text-black font-heading xl:text-base md:text-[15px] text-sm font-semibold uppercase xl:tracking-[2px] tracking-[1.5px] leading-6 md:leading-[27px] mb-[12.75px]"
                                          >
                                            {item.detailedHeading}
                                          </h4>

                                          {/* Description with dynamic styling */}
                                          <p
                                            style={descCss}
                                            className="text-subtitle xl:text-sm md:text-[13px] text-xs font-normal md:tracking-[2px] tracking-[1.5px] xl:leading-[27px] md:leading-[25px] leading-[23px]"
                                          >
                                            {item.description}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Right Visual Media with UniversalMultimediaPreview */}
                                      <div className="w-[calc(100%-40px)] md:w-[calc(100%-48px)] lg:w-[380px] xl:w-[410px] h-[220px] md:h-[260px] xl:h-[280px] relative lg:rounded-r-[16px] rounded-[10px] lg:rounded-l-none overflow-hidden shrink-0 select-none mx-5 md:mx-6 lg:mx-0 bg-neutral-900/10 border border-black/10">
                                        <UniversalMultimediaPreview
                                          multimedia={
                                            item.multimedia || {
                                              type: "image",
                                              url: item.thumbnail,
                                              alt: item.detailedHeading || item.title,
                                            }
                                          }
                                          fallbackImageSrc={item.thumbnail}
                                          fallbackAlt={item.detailedHeading || item.title}
                                          mode="background"
                                          className="h-full w-full object-cover object-center"
                                          containerClassName="absolute inset-0"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
