import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetExperienceById } from "@/hooks/experience/useGetExperienceById"
import {
  EXPERIENCE_TYPE_CONFIG,
  type ExperienceType,
} from "@/components/pages/Experience/experienceTypes"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { VideoThumbnail } from "@/components/shared/VideoThumbnail"
import { getOptimizedImageUrl } from "@/lib/optimizedImage"
import { ChevronDown, MapPin } from "lucide-react"

// Default brand addons data matching frontend
export const defaultBrandAddons = [
  {
    id: "cycling",
    itemNumber: 1,
    title: "Cycling",
    price: "$3,495",
    dayLabel: "Day 1",
    detailedHeading: "Make your trip fun by cycling",
    description:
      "Explore scenic countryside trails and historic villages on premium bikes, guided by local cycling experts with refreshment stops along the way.",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "boat-riding",
    itemNumber: 2,
    title: "Boat riding",
    price: "$3,495",
    dayLabel: "Day 2",
    detailedHeading: "Scenic Coastal Boat Exploration",
    description:
      "Cruise along secluded crystalline bays, hidden sea caves, and pristine swimming coves accessible only by private boat.",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "zipline-tara",
    itemNumber: 3,
    title: "Zipline over the Tara Canyon",
    price: "$3,495",
    dayLabel: "Day 3",
    detailedHeading: "Thrilling Tara Canyon Aerial Ride",
    description:
      "Soar across panoramic gorges and dramatic mountain valleys with state-of-the-art safety gear and breathtaking aerial views.",
    thumbnail: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1000&q=80",
  },
]

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

import { cn } from "@/lib/utils"

function getFieldValue(field: any): string {
  if (!field) return ""
  if (typeof field === "string") return field.trim()
  if (typeof field === "object" && typeof field.value === "string") return field.value.trim()
  return ""
}

// Row component for an experience linked by ID
function DynamicExperienceRow({
  experienceId,
  index,
  isExpanded,
  isAdded,
  onToggleExpand,
  onToggleAdd,
}: {
  experienceId: string
  index: number
  isExpanded: boolean
  isAdded: boolean
  onToggleExpand: () => void
  onToggleAdd: () => void
}) {
  const { data: rawExpData, isLoading } = useGetExperienceById(experienceId)
  const exp = unwrapExperienceData(rawExpData)

  const hero = exp?.hero || {}
  const heroBreadcrumb = getFieldValue(hero?.breadcrumb)
  const heroTitle = getFieldValue(hero?.title)
  const heroSubtitle = getFieldValue(hero?.subtitle)
  const heroDesc = getFieldValue(hero?.description)

  const itemNum = index + 1
  const itemTitle =
    heroTitle ||
    exp?.name ||
    (isLoading ? "Loading Experience..." : `Experience (${experienceId.slice(-8)})`)

  const formattedPrice =
    exp?.price !== undefined && exp?.price !== null
      ? `${exp.currency || "€"}${Number(exp.price).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
      : ""

  const typeConfig = exp?.primaryType
    ? EXPERIENCE_TYPE_CONFIG[exp.primaryType as ExperienceType]
    : null

  const locationTag =
    exp?.places?.[0]?.name ||
    exp?.place?.name ||
    exp?.regions?.[0]?.name ||
    exp?.region?.name ||
    exp?.countries?.[0]?.name ||
    exp?.country?.name

  const categoryTag = heroBreadcrumb || typeConfig?.label || "OPTIONAL EXPERIENCE"

  const detailedHeading =
    heroTitle ||
    heroSubtitle ||
    exp?.subtitle ||
    exp?.name ||
    "Curated Add-On Experience"

  const narrativeText =
    heroDesc ||
    heroSubtitle ||
    exp?.summary ||
    getFieldValue(exp?.theExperience?.summary) ||
    getFieldValue(exp?.theExperience?.narrative) ||
    "Immerse yourself in this bespoke optional adventure crafted by local insiders."

  const heroMultimedia =
    hero?.backgroundMultimedia ||
    exp?.theExperience?.imageMultimedia ||
    exp?.theExperience?.backgroundMultimedia ||
    null

  const heroVideoUrl =
    heroMultimedia?.video?.url ||
    (heroMultimedia?.show === "video" ? heroMultimedia?.url : null) ||
    null

  const heroImageUrl =
    heroMultimedia?.image?.url ||
    (heroMultimedia?.show === "image" ? heroMultimedia?.url : null) ||
    exp?.image ||
    null

  const isHeroVideo = Boolean(
    heroVideoUrl && (heroMultimedia?.show === "video" || !heroImageUrl)
  )

  return (
    <div
      className={`w-full border overflow-hidden bg-[#F9F6ED] transition-colors duration-200 ${
        isExpanded ? "border-black/20" : "border-black/10 hover:border-black/20"
      }`}
    >
      {/* Clickable Header Row */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full px-4 md:px-5 py-4 flex items-center justify-between text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          {/* Number Badge */}
          <div className="size-6 md:size-8 shrink-0 bg-[#222014] text-neutral-100 rounded-full flex items-center justify-center text-xs md:text-sm font-medium leading-none select-none">
            {itemNum}
          </div>

          {/* Thumbnail */}
          <div className="relative size-16 md:size-20 shrink-0 overflow-hidden bg-muted">
            {isHeroVideo && heroVideoUrl ? (
              <VideoThumbnail
                src={heroVideoUrl}
                alt={itemTitle}
                className="w-full h-full object-cover object-center"
              />
            ) : heroImageUrl ? (
              <img
                src={getOptimizedImageUrl(heroImageUrl, { width: 160, quality: 100 })}
                alt={itemTitle}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#EFECE6] text-[#182D09]/40 text-[10px] font-heading font-medium tracking-widest uppercase">
                MIRA
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div className="flex flex-col items-start justify-center gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-foreground text-base md:text-lg font-heading font-medium leading-snug">
                {itemTitle}
              </h3>
              {categoryTag && (
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border",
                    typeConfig?.badgeColor || "bg-accent/10 text-accent border-accent/20"
                  )}
                >
                  {categoryTag}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {formattedPrice && (
                <span className="text-accent text-sm md:text-base font-semibold leading-none">
                  {formattedPrice}
                </span>
              )}
              {locationTag && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {locationTag}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand/Collapse Chevron */}
        <ChevronDown
          className={`size-4 md:size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
            isExpanded ? "rotate-180 text-foreground" : ""
          }`}
        />
      </button>

      {/* Expanded Content Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-black/10"
          >
            <div className="p-5 md:p-8 flex flex-col lg:flex-row items-stretch lg:items-center gap-6 md:gap-8">
              {/* Left Narrative */}
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-accent text-xs mb-2 font-bold uppercase tracking-wider">
                  {categoryTag}
                </span>

                <h4 className="text-foreground font-heading text-lg md:text-xl font-medium tracking-wide mb-3 leading-snug">
                  {detailedHeading}
                </h4>

                <div
                  className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-6 space-y-2 [&_p]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: narrativeText }}
                />

                {/* Add to trip CTA Button */}
                <div>
                  <button
                    type="button"
                    onClick={onToggleAdd}
                    className={`h-11 px-6 text-xs md:text-sm font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      isAdded
                        ? "bg-[#222014] text-white"
                        : "bg-accent text-white hover:bg-accent/90"
                    }`}
                  >
                    {isAdded ? "Added to Journey ✓" : "Add to journey"}
                  </button>
                </div>
              </div>

              {/* Right Media */}
              <div className="w-full lg:w-[360px] h-[220px] md:h-[240px] relative overflow-hidden shrink-0 bg-muted">
                {heroMultimedia ? (
                  <UniversalMultimediaPreview
                    multimedia={heroMultimedia}
                    className="w-full h-full object-cover object-center"
                    containerClassName="w-full h-full"
                  />
                ) : heroImageUrl ? (
                  <img
                    src={getOptimizedImageUrl(heroImageUrl, { width: 720, quality: 100 })}
                    alt={detailedHeading}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#EFECE6] text-[#182D09]/30 text-sm font-heading tracking-widest uppercase">
                    MIRA ARCHIVE
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Row component for fallback brand items
function BrandAddonRow({
  item,
  index,
  isExpanded,
  isAdded,
  onToggleExpand,
  onToggleAdd,
}: {
  item: typeof defaultBrandAddons[0]
  index: number
  isExpanded: boolean
  isAdded: boolean
  onToggleExpand: () => void
  onToggleAdd: () => void
}) {
  return (
    <div
      className={`w-full border overflow-hidden bg-[#F9F6ED] transition-colors duration-200 ${
        isExpanded ? "border-black/20" : "border-black/10 hover:border-black/20"
      }`}
    >
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full px-4 md:px-5 py-4 flex items-center justify-between text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          <div className="size-6 md:size-8 shrink-0 bg-[#222014] text-neutral-100 rounded-full flex items-center justify-center text-xs md:text-sm font-medium leading-none select-none">
            {index + 1}
          </div>

          <div className="relative size-16 md:size-20 shrink-0 overflow-hidden bg-muted">
            <img
              src={getOptimizedImageUrl(item.thumbnail, { width: 160, quality: 100 })}
              alt={item.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="flex flex-col items-start justify-center gap-1 min-w-0">
            <h3 className="text-foreground text-base md:text-lg font-heading font-medium leading-snug">
              {item.title}
            </h3>
            <span className="text-accent text-sm md:text-base font-semibold leading-none">
              {item.price}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`size-4 md:size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
            isExpanded ? "rotate-180 text-foreground" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-black/10"
          >
            <div className="p-5 md:p-8 flex flex-col lg:flex-row items-stretch lg:items-center gap-6 md:gap-8">
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-accent text-xs mb-2 font-bold uppercase tracking-wider">
                  OPTIONAL EXPERIENCE
                </span>

                <h4 className="text-foreground font-heading text-lg md:text-xl font-medium tracking-wide mb-3 leading-snug">
                  {item.detailedHeading}
                </h4>

                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <div>
                  <button
                    type="button"
                    onClick={onToggleAdd}
                    className={`h-11 px-6 text-xs md:text-sm font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      isAdded
                        ? "bg-[#222014] text-white"
                        : "bg-accent text-white hover:bg-accent/90"
                    }`}
                  >
                    {isAdded ? "Added to Journey ✓" : "Add to journey"}
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-[360px] h-[220px] md:h-[240px] relative overflow-hidden shrink-0 bg-muted">
                <img
                  src={getOptimizedImageUrl(item.image, { width: 720, quality: 100 })}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AddOnsPreview({ addOns, draft }: { addOns?: any; draft?: any }) {
  const rawData = addOns ?? draft?.addOns ?? []

  const expIds: string[] = Array.isArray(rawData)
    ? rawData
      .map((it: any) => (typeof it === "string" ? it : it?.id || it?.experienceId))
      .filter((id: any): id is string => typeof id === "string" && Boolean(id.trim()))
    : Array.isArray(rawData?.items)
      ? rawData.items
        .map((it: any) => (typeof it === "string" ? it : it?.id || it?.experienceId))
        .filter((id: any): id is string => typeof id === "string" && Boolean(id.trim()))
      : []

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const toggleAddItem = (id: string) => {
    setAddedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const hasLinkedExperiences = expIds.length > 0

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
      {/* Section Header */}
      <div className="flex flex-col gap-2">
        <span className="text-accent text-xs font-semibold tracking-[2px] uppercase">
          CURATED ADD-ONS
        </span>
        <h2 className="text-foreground font-heading text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
          Add some fun to your trip
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm lg:text-[14.5px] leading-relaxed max-w-xl">
          Enhance your journey with curated optional experiences and adventures.
        </p>
      </div>

      {/* Add-on List: Renders live fetched experiences or default brand items */}
      <div className="flex flex-col gap-3.5 w-full">
        {hasLinkedExperiences ? (
          expIds.map((id, index) => (
            <DynamicExperienceRow
              key={`${id}-${index}`}
              experienceId={id}
              index={index}
              isExpanded={expandedId === id}
              isAdded={Boolean(addedItems[id])}
              onToggleExpand={() => toggleExpand(id)}
              onToggleAdd={() => toggleAddItem(id)}
            />
          ))
        ) : (
          defaultBrandAddons.map((item, index) => (
            <BrandAddonRow
              key={item.id}
              item={item}
              index={index}
              isExpanded={expandedId === item.id}
              isAdded={Boolean(addedItems[item.id])}
              onToggleExpand={() => toggleExpand(item.id)}
              onToggleAdd={() => toggleAddItem(item.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default AddOnsPreview
