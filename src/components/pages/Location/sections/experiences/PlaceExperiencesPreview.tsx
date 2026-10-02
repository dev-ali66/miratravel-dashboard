import { useState } from "react"
import { MapPin, ChevronDown, Compass, ArrowRight } from "lucide-react"

import type { LocationPreviewSectionProps } from "../../config/locationSections"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { useGetLocationById } from "@/hooks/location/useGetLocationById"

const stripHtml = (html: string): string => {
  if (!html) return ""
  return html.replace(/<[^>]*>?/gm, "").trim()
}

const getStr = (val: any): string => {
  if (!val) return ""
  if (typeof val === "string") return stripHtml(val)
  if (typeof val === "object") return stripHtml(val.value ?? val.label ?? "")
  return String(val)
}

function unwrapLocationData(raw: any) {
  if (!raw) return null
  let data = raw
  if (data?.data !== undefined) {
    data = data.data
  }
  if (data?.data !== undefined && !Array.isArray(data)) {
    data = data.data
  }
  if (Array.isArray(data)) {
    return data[0] || null
  }
  return data
}

function resolveUniversalMultimedia(locData: any) {
  if (!locData) {
    return {
      show: "color",
      color: { color: "#FAF7F2", opacity: 100 },
    }
  }

  // 1. Direct backgroundMultimedia / imageMultimedia object from locData hero, essence, or root
  const locMedia =
    locData?.hero?.backgroundMultimedia ||
    locData?.backgroundMultimedia ||
    locData?.essence?.imageMultimedia ||
    locData?.essence?.backgroundMultimedia

  if (
    locMedia &&
    typeof locMedia === "object" &&
    (locMedia.show || locMedia.image?.url || locMedia.video?.url || locMedia.color?.color)
  ) {
    return locMedia
  }

  // 2. Video fallback
  const videoUrl =
    locData?.hero?.video?.url ||
    (typeof locData?.hero?.video === "string" ? locData?.hero?.video : null) ||
    locData?.video?.url ||
    (typeof locData?.video === "string" ? locData?.video : null) ||
    ""

  if (videoUrl) {
    return {
      show: "video",
      color: { color: "#FAF7F2", opacity: 100 },
      video: { url: videoUrl, alt: locData?.name || "Experience Video", fit: "cover", autoplay: true, loop: true, muted: true },
      image: { url: "", alt: "" },
    }
  }

  // 3. String image URL resolution fallback
  const imageUrl =
    locData?.hero?.image?.url ||
    (typeof locData?.hero?.image === "string" ? locData?.hero?.image : null) ||
    locData?.card?.background_image?.url ||
    (typeof locData?.card?.background_image === "string" ? locData?.card?.background_image : null) ||
    locData?.image ||
    ""

  if (imageUrl) {
    return {
      show: "image",
      color: { color: "#FAF7F2", opacity: 100 },
      image: { url: imageUrl, alt: locData?.name || "Experience Media", opacity: 100, fit: "cover" },
      video: { url: "", alt: "" },
    }
  }

  return {
    show: "color",
    color: { color: "#FAF7F2", opacity: 100 },
    image: { url: "", alt: "" },
    video: { url: "", alt: "" },
  }
}

function FeaturedExperienceBanner({ locationId }: { locationId: string }) {
  const { data: rawLocData } = useGetLocationById(locationId)
  const locData = unwrapLocationData(rawLocData)

  const title = getStr(locData?.hero?.title) || locData?.name || "Featured Experience"
  const subtitle = getStr(locData?.hero?.subtitle) || getStr(locData?.essence?.title) || "Curated ways to discover the wild beauty and heritage."
  const category = getStr(locData?.type) || getStr(locData?.locationType) || getStr(locData?.category) || "FEATURED"
  const multimedia = resolveUniversalMultimedia(locData)

  return (
    <div className="w-full pt-6 md:pt-8">
      <div className="group relative flex min-h-[340px] md:min-h-[380px] lg:h-[420px] xl:h-[460px] w-full flex-col justify-end items-start overflow-hidden rounded-[8px] p-6 md:p-8 lg:p-10 xl:p-12 text-white bg-neutral-900 border border-neutral-800/80 shadow-md">
        <UniversalMultimediaPreview
          multimedia={multimedia}
          fallbackColor="#1c2813"
          mode="background"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-start gap-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            {category && (
              <div className="inline-flex items-center rounded-full bg-[#182d09] px-3 py-1 text-[11px] font-semibold uppercase text-neutral-200 tracking-wider">
                {category}
              </div>
            )}
          </div>

          <DynamicStyledTextPreview
            data={title}
            fallbackColor="#FFFFFF"
            as="h3"
            className="text-xl md:text-2xl lg:text-3xl font-semibold font-heading text-white"
          />

          <DynamicStyledTextPreview
            data={subtitle}
            fallbackColor="#E5E5E5"
            as="p"
            className="text-xs md:text-sm text-neutral-200 line-clamp-2 leading-relaxed"
          />

          <div className="mt-2 inline-flex items-center gap-2 group/btn cursor-pointer transition-opacity hover:opacity-90">
            <span className="text-sm font-semibold text-neutral-100">
              Meer info
            </span>
            <ArrowRight className="h-4 w-4 text-neutral-200 transition-transform group-hover/btn:translate-x-1.5" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewExperienceCard({ locationId }: { locationId: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { data: rawLocData } = useGetLocationById(locationId)
  const locData = unwrapLocationData(rawLocData)

  const title = locData?.name || getStr(locData?.hero?.title) || "Curated Experience"
  const subtitle = getStr(locData?.hero?.subtitle) || getStr(locData?.essence?.title) || "Coastal & Heritage Exploration"
  
  const rawParagraphs = locData?.essence?.paragraphs
  const paragraphsText = Array.isArray(rawParagraphs)
    ? rawParagraphs.map(getStr).filter(Boolean).join(" ")
    : getStr(rawParagraphs)

  const description =
    getStr(locData?.hero?.description) ||
    paragraphsText ||
    getStr(locData?.overview) ||
    getStr(locData?.description) ||
    "Discover the unique beauty, rich history, and authentic experiences of this location."

  const category = getStr(locData?.type) || getStr(locData?.locationType) || getStr(locData?.category) || "DISCOVERY"
  const locationName = locData?.name || "Experience"
  const multimedia = resolveUniversalMultimedia(locData)

  const toggleExpand = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsExpanded((prev) => !prev)
  }

  return (
    <div
      onClick={toggleExpand}
      className="group relative flex w-full cursor-pointer flex-col items-start overflow-hidden rounded-[14px] bg-white border border-neutral-200/70 shadow-2xs transition-all duration-300 hover:shadow-md self-start h-fit"
    >
      {/* Top Image / Video Container */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-t-[14px] bg-[#FAF7F2]">
        <UniversalMultimediaPreview
          multimedia={multimedia}
          fallbackColor="#FAF7F2"
          mode="background"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

        {/* Category Pill Badge (Top Left Corner Tag - Location Type) */}
        {category && (
          <div className="absolute left-3 top-3 z-20 inline-flex items-center rounded-full bg-[#2C5F8A] px-2.5 py-1 shadow-2xs transition-transform duration-300 group-hover:scale-105">
            <span className="text-[10px] md:text-xs font-semibold uppercase leading-4 tracking-wider text-neutral-100">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="flex w-full flex-col items-start gap-2.5 p-4 md:p-5 lg:p-6">
        {/* Title Row */}
        <div className="flex w-full items-start justify-between gap-2">
          <DynamicStyledTextPreview
            data={title}
            fallbackColor="#182d09"
            as="h4"
            className="font-heading text-base md:text-lg font-semibold text-[#182d09] leading-snug group-hover:text-[#af6348] transition-colors"
          />
          <div className="pt-0.5 shrink-0 text-[#C8956C]">
            <Compass className="h-4 w-4 md:h-4.5 md:w-4.5 text-[#C8956C]" />
          </div>
        </div>

        {/* Subtitle */}
        <DynamicStyledTextPreview
          data={subtitle}
          fallbackColor="#565e69"
          as="p"
          className="text-xs md:text-[13px] font-normal text-neutral-500 leading-relaxed line-clamp-2"
        />

        {/* Collapsible / Expandable Description */}
        {isExpanded && (
          <div className="w-full pt-2 border-t border-neutral-100 mt-1 animate-fadeIn">
            <DynamicStyledTextPreview
              data={description}
              fallbackColor="#444a53"
              as="p"
              className="text-xs md:text-sm font-normal text-neutral-700 leading-relaxed"
            />
          </div>
        )}

        {/* Card Footer with Location Label & Expand Button */}
        <div className="flex w-full items-center justify-between border-t border-neutral-200/60 pt-3 mt-1 text-xs text-neutral-500">
          <span className="text-[11px] md:text-xs font-medium text-neutral-400 uppercase tracking-wider">
            {locationName}
          </span>

          <button
            type="button"
            onClick={toggleExpand}
            className="inline-flex cursor-pointer items-center gap-1 text-[#C8956C] hover:text-[#af6348] font-semibold text-xs md:text-sm transition-colors focus:outline-none"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? "Collapse" : "Expand"}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export function PlaceExperiencesPreview({ draft }: LocationPreviewSectionProps) {
  if (!draft) return null

  const expData = draft.experiences || draft.experience || {}
  const defaultLocation = draft.name ? `${draft.name}, ALBANIA` : "DESTINATION"
  const locationTag = getStr(expData.location) || defaultLocation
  const seasonInfoStr = getStr(expData.seasonInfo)
  const seasonLocationStr = getStr(expData.seasonLocation)

  // Pure array of string IDs: string[]
  const rawItems: any[] = Array.isArray(expData.items)
    ? expData.items
    : Array.isArray(expData.cards)
    ? expData.cards
    : []

  const itemIds: string[] = rawItems
    .map((it: any) => (typeof it === "string" ? it : it?.locationId || it?.id))
    .filter((id): id is string => Boolean(id) && typeof id === "string")

  const featuredId = itemIds[0] ?? null
  const gridIds = itemIds.length > 1 ? itemIds.slice(1) : []

  const [showAll, setShowAll] = useState(false)
  const visibleGridIds = showAll ? gridIds : gridIds.slice(0, 3)

  return (
    <section className="relative w-full py-8 md:py-12 lg:py-14 overflow-hidden">
      {/* Background Media */}
      <UniversalMultimediaPreview
        multimedia={expData.backgroundMultimedia}
        fallbackColor="#F1EEE5"
        mode="background"
      />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="mx-auto flex w-full flex-col items-center">
          {/* Header */}
          <div className="flex w-full flex-col items-start gap-3 md:gap-4">
            {/* Eyebrow Location Tag */}
            {Boolean(locationTag) && (
              <span className="text-[#af6348] font-semibold text-xs md:text-sm tracking-[2.64px] uppercase">
                {locationTag}
              </span>
            )}

            {/* Title & Subtitle Row */}
            <div className="flex w-full flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
              <DynamicStyledTextPreview
                data={expData.title}
                fallbackColor="#182d09"
                as="h2"
                className="text-2xl md:text-3xl lg:text-4xl font-semibold font-heading text-[#182d09]"
              />

              <DynamicStyledTextPreview
                data={expData.description}
                fallbackColor="#565e69"
                as="p"
                className="w-full lg:w-[392px] text-xs md:text-sm font-normal text-neutral-600 leading-relaxed"
              />
            </div>

            {/* Divider Line */}
            <div className="w-full pt-4 md:pt-6">
              <div className="h-px w-full bg-neutral-300/60" />
            </div>
          </div>

          {/* Featured Experience Banner (Item 0 ID) */}
          {featuredId && <FeaturedExperienceBanner locationId={featuredId} />}

          {/* Experience Cards Grid (Items 1+ IDs) */}
          <div className="w-full pt-6 md:pt-8 lg:pt-10">
            {gridIds.length === 0 && !featuredId ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-neutral-300/80 bg-white/50">
                <p className="text-xs text-neutral-500 italic">
                  No experience location IDs added yet. Pick location IDs in the form section.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {visibleGridIds.map((id) => (
                  <PreviewExperienceCard key={id} locationId={id} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {gridIds.length > 3 && (
              <div className="mt-8 mb-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="rounded bg-[#af6348] px-6 py-2.5 text-xs md:text-sm font-semibold text-white transition hover:bg-[#9c553d] cursor-pointer shadow-2xs"
                >
                  {showAll ? "Show Less" : "Load More"}
                </button>
              </div>
            )}

            {/* Bottom Season Info Bar */}
            {(Boolean(seasonInfoStr) || Boolean(seasonLocationStr)) && (
              <div className="mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-neutral-300/60 text-xs text-neutral-600">
                {Boolean(seasonInfoStr) && (
                  <p className="max-w-md text-xs md:text-sm leading-relaxed text-neutral-600">
                    {seasonInfoStr}
                  </p>
                )}
                {Boolean(seasonLocationStr) && (
                  <div className="inline-flex items-center gap-1.5 font-semibold text-[#af6348]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{seasonLocationStr}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

