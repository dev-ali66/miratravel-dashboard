/* =====================================================
   JOURNEY — OPTIONAL EXPERIENCES & ADD-ONS PREVIEW
   Renders curated Experiences linked in Journey.addOns
   with accordion expansion, pricing, multimedia & CTA.
===================================================== */

import { useState } from "react"
import { useGetExperienceById } from "@/hooks/experience/useGetExperienceById"
import {
  EXPERIENCE_TYPE_CONFIG,
  type ExperienceType,
} from "@/components/pages/Experience/experienceTypes"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { Compass, Loader2, MapPin } from "lucide-react"

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

function AddOnExperienceItemRow({
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

  const itemNum = index + 1
  const itemTitle = exp?.name || (isLoading ? "Loading Experience..." : `Experience (${experienceId.slice(-8)})`)

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

  const detailedHeading = exp?.subtitle || exp?.name || "Curated Add-On Experience"

  const narrativeText =
    exp?.summary ||
    exp?.theExperience?.summary?.value ||
    exp?.theExperience?.narrative?.value ||
    "Immerse yourself in this bespoke optional adventure crafted by local insiders."

  const multimedia =
    exp?.hero?.backgroundMultimedia ||
    exp?.theExperience?.imageMultimedia || {
      show: "image",
      image: { url: exp?.image || "/images/albania-journey4.jpg" },
    }

  return (
    <div
      className={`w-full rounded-[8px] md:rounded-[10px] lg:rounded-[11px] lgx:rounded-[12px] xlg:rounded-[13px] mid:rounded-[14px] xl:rounded-[14px] 2xl:rounded-[16px] border overflow-hidden bg-card text-card-foreground shadow-xs transition-colors duration-200 ${
        isExpanded ? "border-border shadow-sm" : "border-border/70 hover:border-border"
      }`}
    >
      {/* Clickable Header Row */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full p-3 xs:p-3.5 md:p-4 lg:p-[18px] lgx:p-[18px] xlg:p-[19px] mid:p-[19px] xl:p-5 flex items-center justify-between text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2.5 xs:gap-3 md:gap-3.5 lg:gap-4 lgx:gap-4 xlg:gap-[17px] mid:gap-[17px] xl:gap-[18px] min-w-0 flex-1">
          {/* Number Badge */}
          <div className="size-6 md:size-[26px] lg:size-7 lgx:size-[28px] xlg:size-[29px] mid:size-[30px] xl:size-8 2xl:size-9 shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs md:text-[12.5px] lg:text-[13px] lgx:text-[13.5px] xlg:text-[13.5px] mid:text-md xl:text-md 2xl:text-base font-medium leading-none">
            {itemNum}
          </div>

          {/* Thumbnail */}
          <div className="relative size-16 xs:size-[72px] md:size-20 lg:size-[84px] lgx:size-[86px] xlg:size-[88px] mid:size-[90px] xl:size-24 2xl:size-28 rounded-[6px] md:rounded-[8px] lg:rounded-[9px] lgx:rounded-[10px] xlg:rounded-[11px] mid:rounded-[11px] xl:rounded-[12px] shrink-0 overflow-hidden bg-muted">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <UniversalMultimediaPreview
                multimedia={multimedia}
                className="w-full h-full object-cover object-center"
                containerClassName="w-full h-full"
              />
            )}
          </div>

          {/* Title and Price */}
          <div className="flex flex-col items-start justify-center gap-1.5 md:gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-foreground text-[16px] md:text-[18px] lg:text-[19px] font-semibold leading-snug font-serif truncate max-w-full">
                {itemTitle}
              </h3>
              {typeConfig && (
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${typeConfig.badgeColor}`}>
                  {typeConfig.label}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {formattedPrice && (
                <span className="text-accent text-[15px] md:text-[17px] font-medium leading-none">
                  {formattedPrice}
                </span>
              )}
              {locationTag && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {locationTag}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand/Collapse Chevron */}
        <div
          className={`size-4 md:size-[18px] lg:size-5 shrink-0 text-muted-foreground ml-2 md:ml-4 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
          >
            <path
              d="M12.0002 16.0002C11.8686 16.0009 11.7381 15.9757 11.6163 15.926C11.4944 15.8762 11.3836 15.8029 11.2902 15.7102L5.29019 9.71019C5.10188 9.52188 4.99609 9.26649 4.99609 9.00019C4.99609 8.73388 5.10188 8.47849 5.29019 8.29019C5.47849 8.10188 5.73388 7.99609 6.00019 7.99609C6.26649 7.99609 6.52188 8.10188 6.71019 8.29019L12.0002 13.5902L17.2902 8.30019C17.4815 8.13636 17.7276 8.05075 17.9792 8.06047C18.2309 8.0702 18.4697 8.17453 18.6477 8.35262C18.8258 8.53072 18.9302 8.76946 18.9399 9.02113C18.9496 9.27281 18.864 9.51888 18.7002 9.71019L12.7002 15.7102C12.5139 15.8949 12.2625 15.9991 12.0002 16.0002Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </button>

      {/* Expanded Content Panel */}
      {isExpanded && (
        <div className="overflow-hidden border-t border-border/60">
          <div className="p-4 md:p-6 lg:p-7 flex flex-col lg:flex-row items-stretch lg:items-center gap-5 md:gap-7">
            {/* Left Narrative Text */}
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-accent text-[11px] md:text-xs mb-2 font-bold uppercase tracking-wider">
                {typeConfig ? typeConfig.label : "OPTIONAL EXPERIENCE"}
              </span>

              <h4 className="text-foreground font-serif text-sm md:text-base font-semibold uppercase tracking-wider mb-2 leading-snug">
                {detailedHeading}
              </h4>

              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-4">
                {narrativeText}
              </p>

              {/* Add this item CTA Button */}
              <div>
                <button
                  type="button"
                  onClick={onToggleAdd}
                  className={`flex h-[42px] w-[260px] max-w-full items-center justify-center rounded px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors duration-200 cursor-pointer ${
                    isAdded ? "bg-emerald-700 hover:bg-emerald-800" : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isAdded ? "Added to Trip ✓" : "Add this experience to trip"}
                </button>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="w-full lg:w-[320px] h-[190px] md:h-[220px] relative rounded-lg overflow-hidden shrink-0 bg-muted">
              <UniversalMultimediaPreview
                multimedia={multimedia}
                className="w-full h-full object-cover object-center"
                containerClassName="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
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

  return (
    <div className="w-full max-w-[120rem] mx-auto flex flex-col">
      <section className="w-full">
        <div className="w-full flex flex-col gap-5 md:gap-7">
          {/* Section Header */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              OPTIONAL EXPERIENCES & UPGRADES
            </span>
            <h2 className="text-foreground font-serif text-xl md:text-3xl font-medium leading-tight">
              Add some fun to your trip
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
              Enhance your journey with curated optional experiences and bespoke excursions.
            </p>
          </div>

          {/* Add-on Experiences Accordion List */}
          {expIds.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/15 p-10 text-center">
              <Compass className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">
                No optional experiences linked yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Search and link curated Experiences in the &quot;Add-ons &amp; Optional Upgrades&quot; form section on the left to preview them here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5 w-full">
              {expIds.map((id, index) => (
                <AddOnExperienceItemRow
                  key={`${id}-${index}`}
                  experienceId={id}
                  index={index}
                  isExpanded={expandedId === id}
                  isAdded={Boolean(addedItems[id])}
                  onToggleExpand={() => toggleExpand(id)}
                  onToggleAdd={() => toggleAddItem(id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default AddOnsPreview
