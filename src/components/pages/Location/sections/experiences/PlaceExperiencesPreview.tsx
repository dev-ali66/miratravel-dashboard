import { useState } from "react"
import { MapPin, ChevronDown, Compass, ArrowRight, Loader2, Sparkles } from "lucide-react"

import type { LocationPreviewSectionProps } from "../../config/locationSections"
import { getExperienceFieldName } from "../../shared/getExperienceFieldName"
import { SignatureExperiencesPreview } from "../signature-experiences/SignatureExperiencesPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { useGetExperienceById } from "@/hooks/experience/useGetExperienceById"
import {
  EXPERIENCE_TYPE_CONFIG,
  type ExperienceType,
} from "@/components/pages/Experience/experienceTypes"

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

function unwrapExperienceData(raw: any) {
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

function resolveExperienceMultimedia(expData: any) {
  if (!expData) {
    return {
      show: "color",
      color: { color: "#FAF7F2", opacity: 100 },
    }
  }

  // 1. Hero backgroundMultimedia
  const heroMedia = expData?.hero?.backgroundMultimedia
  if (
    heroMedia &&
    typeof heroMedia === "object" &&
    (heroMedia.show || heroMedia.image?.url || heroMedia.video?.url)
  ) {
    return heroMedia
  }

  // 2. The Experience section media
  const theExpMedia = expData?.theExperience?.imageMultimedia
  if (
    theExpMedia &&
    typeof theExpMedia === "object" &&
    (theExpMedia.show || theExpMedia.image?.url || theExpMedia.video?.url)
  ) {
    return theExpMedia
  }

  // 3. Video URL fallback
  const videoUrl =
    expData?.hero?.video?.url ||
    (typeof expData?.hero?.video === "string" ? expData?.hero?.video : null) ||
    ""
  if (videoUrl) {
    return {
      show: "video",
      color: { color: "#FAF7F2", opacity: 100 },
      video: {
        url: videoUrl,
        alt: expData?.name || "Experience Video",
        fit: "cover",
        autoplay: true,
        loop: true,
        muted: true,
      },
      image: { url: "", alt: "" },
    }
  }

  // 4. Image URL fallback
  const imageUrl =
    expData?.hero?.image?.url ||
    (typeof expData?.hero?.image === "string" ? expData?.hero?.image : null) ||
    expData?.image ||
    ""
  if (imageUrl) {
    return {
      show: "image",
      color: { color: "#FAF7F2", opacity: 100 },
      image: {
        url: imageUrl,
        alt: expData?.name || "Experience Media",
        opacity: 100,
        fit: "cover",
      },
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

function FeaturedExperienceBanner({ experienceId }: { experienceId: string }) {
  const { data: rawExpData, isLoading } = useGetExperienceById(experienceId)
  const expData = unwrapExperienceData(rawExpData)

  if (isLoading) {
    return (
      <div className="w-full pt-6 md:pt-8">
        <div className="h-[340px] md:h-[380px] lg:h-[420px] w-full rounded-[8px] bg-neutral-200 dark:bg-neutral-800 animate-pulse flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        </div>
      </div>
    )
  }

  if (!expData) return null

  const title = expData?.name || getStr(expData?.hero?.title) || "Featured Experience"
  const subtitle =
    expData?.subtitle ||
    expData?.summary ||
    getStr(expData?.hero?.subtitle) ||
    "Curated ways to discover the wild beauty and heritage."

  const typeConfig = expData?.primaryType
    ? EXPERIENCE_TYPE_CONFIG[expData.primaryType as ExperienceType]
    : null
  const category = typeConfig?.label || expData?.primaryType || "FEATURED"
  const multimedia = resolveExperienceMultimedia(expData)
  const destinationName =
    expData?.place?.name || expData?.region?.name || expData?.country?.name

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
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <div className="inline-flex items-center rounded-full bg-[#182d09] px-3 py-1 text-[11px] font-semibold uppercase text-neutral-200 tracking-wider">
                {category}
              </div>
            )}

            {destinationName && (
              <div className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-medium text-white">
                <MapPin className="h-3 w-3" />
                <span>{destinationName}</span>
              </div>
            )}

            {expData?.price !== undefined && expData?.price !== null && (
              <div className="inline-flex items-center rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-semibold">
                €{Number(expData.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              Explore Experience
            </span>
            <ArrowRight className="h-4 w-4 text-neutral-200 transition-transform group-hover/btn:translate-x-1.5" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewExperienceCard({ experienceId }: { experienceId: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { data: rawExpData, isLoading } = useGetExperienceById(experienceId)
  const expData = unwrapExperienceData(rawExpData)

  if (isLoading) {
    return (
      <div className="w-full rounded-[14px] bg-white border border-neutral-200 p-6 animate-pulse">
        <div className="aspect-[4/3] w-full rounded-lg bg-neutral-200 mb-4" />
        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-neutral-200 rounded w-1/2" />
      </div>
    )
  }

  if (!expData) return null

  const title = expData?.name || getStr(expData?.hero?.title) || "Curated Experience"
  const subtitle =
    expData?.subtitle ||
    expData?.summary ||
    getStr(expData?.hero?.subtitle) ||
    "Authentic local encounter"

  const description =
    expData?.summary ||
    getStr(expData?.theExperience?.narrative) ||
    getStr(expData?.hero?.description) ||
    "Discover the unique beauty, rich history, and authentic experiences curated by MIRA."

  const typeConfig = expData?.primaryType
    ? EXPERIENCE_TYPE_CONFIG[expData.primaryType as ExperienceType]
    : null
  const category = typeConfig?.label || expData?.primaryType || "EXPERIENCE"
  const locationName =
    expData?.place?.name || expData?.region?.name || expData?.country?.name || "Experience"
  const multimedia = resolveExperienceMultimedia(expData)

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

        {/* Category Pill Badge */}
        {category && (
          <div className="absolute left-3 top-3 z-20 inline-flex items-center rounded-full bg-[#182d09] px-2.5 py-1 shadow-2xs transition-transform duration-300 group-hover:scale-105">
            <span className="text-[10px] md:text-xs font-semibold uppercase leading-4 tracking-wider text-neutral-100">
              {category}
            </span>
          </div>
        )}

        {expData?.price !== undefined && expData?.price !== null && (
          <div className="absolute right-3 top-3 z-20 inline-flex items-center rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white">
            €{Number(expData.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
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

  if (draft.type?.toUpperCase() === "COUNTRY") {
    return <SignatureExperiencesPreview draft={draft} />
  }
  if (draft.type?.toUpperCase() === "REGION") {
    return
  }

  const expFieldName = getExperienceFieldName(draft?.type)

  // Support both pure string[] array and legacy object { items: string[] }
  const rawData: any =
    (draft as any)?.[expFieldName] ??
    draft.experience ??
    (draft as any).experiences ??
    (draft as any)?.placeExperiences ??
    (draft as any)?.regionExperienceList ??
    (draft as any)?.countryExperiences ??
    []
  const rawItems: any[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.items)
      ? rawData.items
      : Array.isArray(rawData?.cards)
        ? rawData.cards
        : []

  const itemIds: string[] = rawItems
    .map((it: any) => (typeof it === "string" ? it : it?.id || it?.experienceId))
    .filter((id): id is string => Boolean(id) && typeof id === "string")

  const defaultLocation = draft.name ? `${draft.name}, ALBANIA` : "DESTINATION"
  const locationTag = defaultLocation

  const featuredId = itemIds[0] ?? null
  const gridIds = itemIds.length > 1 ? itemIds.slice(1) : []

  const [showAll, setShowAll] = useState(false)
  const visibleGridIds = showAll ? gridIds : gridIds.slice(0, 3)

  return (
    <section className="relative w-full py-8 md:py-12 lg:py-14 overflow-hidden">
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
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-heading text-[#182d09]">
                Curated Experiences
              </h2>

              <p className="w-full lg:w-[392px] text-xs md:text-sm font-normal text-neutral-600 leading-relaxed">
                Curated ways to discover the wild beauty and heritage — handpicked experiences across culture, nature, and active adventures.
              </p>
            </div>

            {/* Divider Line */}
            <div className="w-full pt-4 md:pt-6">
              <div className="h-px w-full bg-neutral-300/60" />
            </div>
          </div>

          {/* Featured Experience Banner (Item 0 ID) */}
          {featuredId && <FeaturedExperienceBanner experienceId={featuredId} />}

          {/* Experience Cards Grid (Items 1+ IDs) */}
          <div className="w-full pt-6 md:pt-8 lg:pt-10">
            {gridIds.length === 0 && !featuredId ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-neutral-300/80 bg-white/50">
                <Sparkles className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-700">No experiences linked yet</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Search and connect experiences from the Experience catalogue in the form editor.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {visibleGridIds.map((id) => (
                  <PreviewExperienceCard key={id} experienceId={id} />
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
                  {showAll ? "Show Less" : `Load More (${gridIds.length - 3})`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlaceExperiencesPreview


