/* =====================================================
   JOURNEY — OPTIONAL EXPERIENCES & ADD-ONS FORM
   Search and link curated Experiences from the Experience
   catalog directly into Journey.addOns as an array of IDs.
===================================================== */

import { useState, useRef, useEffect } from "react"
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search,
  Check,
  X,
  Loader2,
  MapPin,
  Compass,
} from "lucide-react"

import type { JourneyData } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { useSearchExperiences, type ExperienceSearchItem } from "@/hooks/experience/useGetExperiences"
import { useGetExperienceById } from "@/hooks/experience/useGetExperienceById"
import {
  EXPERIENCE_TYPE_CONFIG,
  type ExperienceType,
} from "@/components/pages/Experience/experienceTypes"
import { cn } from "@/lib/utils"
import { getOptimizedImageUrl } from "@/lib/optimizedImage"

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

function ExperienceItemRow({
  experienceId,
  index,
  total,
  onMove,
  onRemove,
}: {
  experienceId: string
  index: number
  total: number
  onMove: (idx: number, dir: "up" | "down") => void
  onRemove: (idx: number) => void
}) {
  const { data: rawExpData, isLoading } = useGetExperienceById(experienceId)
  const expData = unwrapExperienceData(rawExpData)

  const name = expData?.name || (isLoading ? "Loading..." : `Experience (${experienceId.slice(-8)})`)
  const typeConfig = expData?.primaryType
    ? EXPERIENCE_TYPE_CONFIG[expData.primaryType as ExperienceType]
    : null
  const locationTag =
    expData?.places?.[0]?.name ||
    expData?.place?.name ||
    expData?.regions?.[0]?.name ||
    expData?.region?.name ||
    expData?.countries?.[0]?.name ||
    expData?.country?.name

  const imageUrl =
    expData?.hero?.backgroundMultimedia?.image?.url ||
    expData?.theExperience?.imageMultimedia?.image?.url ||
    expData?.image ||
    ""

  const formattedPrice =
    expData?.price !== undefined && expData?.price !== null
      ? `${expData.currency || "€"}${Number(expData.price).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
      : null

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-card p-3 shadow-2xs transition-all hover:border-border">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Number Badge */}
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
          {index + 1}
        </div>

        {/* Thumbnail (if available) */}
        {imageUrl ? (
          <div className="relative h-11 w-14 rounded-sm overflow-hidden bg-muted shrink-0 border border-border/60">
            <img src={getOptimizedImageUrl(imageUrl, { width: 120, quality: 100 })} alt={name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-11 w-14 items-center justify-center rounded-sm bg-muted/60 text-muted-foreground shrink-0 border border-border/40">
            <Compass className="h-5 w-5 opacity-40" />
          </div>
        )}

        {/* Experience Details */}
        <div className="flex flex-col min-w-0 gap-0.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-foreground truncate max-w-[240px] sm:max-w-[340px]">
              {isLoading ? (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading...
                </span>
              ) : (
                name
              )}
            </span>

            {typeConfig && (
              <span
                className={cn(
                  "inline-flex items-center rounded-sm px-1.5 py-0.2 text-[9px] font-medium border shrink-0",
                  typeConfig.badgeColor
                )}
              >
                {typeConfig.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
            {locationTag && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                {locationTag}
              </span>
            )}

            {formattedPrice && (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formattedPrice}
                {expData?.priceType ? ` (${expData.priceType})` : ""}
              </span>
            )}

            <span className="font-mono text-muted-foreground/70 truncate">
              ID: {experienceId}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, "up")}
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          title="Move Up"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, "down")}
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          title="Move Down"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          title="Remove Add-On Experience"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

interface AddOnsFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function AddOnsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: AddOnsFormProps) {
  const sectionKey = "add-ons"
  const isOpen = Boolean(openSections[sectionKey])

  // Extract array of Experience IDs from draft.addOns
  const rawData: any = draft.addOns ?? []
  const rawItems: any[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.items)
      ? rawData.items
      : Array.isArray(rawData?.experiences)
        ? rawData.experiences
        : []

  const items: string[] = rawItems
    .map((it: any) => (typeof it === "string" ? it : it?.id || it?.experienceId))
    .filter((id): id is string => Boolean(id) && typeof id === "string")

  // Live Experience Search State
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Fetch search matches from backend GET /api/v1/experiences/search
  const { data: searchResponse, isLoading: isSearching } = useSearchExperiences(
    searchQuery,
    30
  )
  const searchResults: ExperienceSearchItem[] = searchResponse?.data || []

  // Close search popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const updateAddOnItems = (newItems: string[]) => {
    updateField("addOns", newItems)
  }

  // Add experience ID directly from Experience Search
  const handleSelectExperience = (exp: ExperienceSearchItem) => {
    if (!exp || !exp.id) return
    if (!items.includes(exp.id)) {
      updateAddOnItems([...items, exp.id])
    }
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    updateAddOnItems(updated)
  }

  const handleClearAll = () => {
    updateAddOnItems([])
  }

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= items.length) return
    const updated = [...items]
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    updateAddOnItems(updated)
  }

  return (
    <FormSection
      title="Add-ons & Optional Upgrades"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex flex-col gap-5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Link curated Experiences from your Experience catalog as optional add-ons and upgrades for this journey.
          Travelers will be able to discover and add these curated experiences during journey planning and checkout.
        </p>

        {/* Search & Add Picker */}
        <div ref={searchContainerRef} className="relative w-full">
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Search & Add Curated Experiences
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsSearchOpen(true)
              }}
              placeholder="Search experiences by title or type to link..."
              className="w-full rounded-sm border border-input bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setIsSearchOpen(false)
                }}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Results */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-sm border border-border bg-popover py-1 shadow-lg">
              {isSearching ? (
                <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Searching experiences...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  {searchQuery ? "No matching experiences found." : "Type above to search experiences."}
                </div>
              ) : (
                searchResults.map((exp) => {
                  const isSelected = items.includes(exp.id)
                  const typeConfig = exp.primaryType
                    ? EXPERIENCE_TYPE_CONFIG[exp.primaryType as ExperienceType]
                    : null
                  const locLabel = exp.place?.name || exp.region?.name || exp.country?.name

                  return (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => handleSelectExperience(exp)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs transition-colors cursor-pointer",
                        isSelected
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        <div className="truncate">
                          <p className="truncate font-medium">{exp.name}</p>
                          {locLabel && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              in {locLabel}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {exp.price !== undefined && exp.price !== null && (
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            €{Number(exp.price).toFixed(2)}
                          </span>
                        )}
                        {typeConfig && (
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border",
                              typeConfig.badgeColor
                            )}
                          >
                            {typeConfig.label}
                          </span>
                        )}
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Linked Experience Items List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Linked Add-on Experiences ({items.length})
            </label>
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              >
                Clear all ({items.length})
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <Compass className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">
                No optional experiences linked yet
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-sm mx-auto">
                Use the search box above to find and link curated experiences from the catalog to this journey.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((expId, idx) => (
                <ExperienceItemRow
                  key={`${expId}-${idx}`}
                  experienceId={expId}
                  index={idx}
                  total={items.length}
                  onMove={handleMoveItem}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </FormSection>
  )
}

export default AddOnsForm
