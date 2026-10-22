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
  Star,
  Plus,
  Compass,
} from "lucide-react"

import type { LocationFormSectionProps } from "../../config/locationSections"
import { FormSection } from "../../shared/fields"
import { useSearchExperiences, type ExperienceSearchItem } from "@/hooks/experience/useGetExperiences"
import { useGetExperienceById } from "@/hooks/experience/useGetExperienceById"
import {
  EXPERIENCE_TYPE_CONFIG,
  type ExperienceType,
} from "@/components/pages/Experience/experienceTypes"
import { cn } from "@/lib/utils"

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

  const isFeatured = index === 0
  const name = expData?.name || `Experience (${experienceId.slice(-8)})`
  const typeConfig = expData?.primaryType
    ? EXPERIENCE_TYPE_CONFIG[expData.primaryType as ExperienceType]
    : null
  const locationTag = expData?.place?.name || expData?.region?.name || expData?.country?.name

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border p-3 shadow-2xs transition-all",
        isFeatured
          ? "border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shrink-0",
            isFeatured
              ? "bg-amber-500 text-white"
              : "bg-primary/10 text-primary"
          )}
        >
          {index + 1}
        </div>

        <div className="flex flex-col min-w-0 gap-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-foreground truncate">
              {isLoading ? (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading...
                </span>
              ) : (
                name
              )}
            </span>

            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 shrink-0">
                <Star className="h-2.5 w-2.5 fill-current" />
                Featured Banner
              </span>
            )}

            {typeConfig && (
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-1.5 py-0.2 text-[9px] font-medium border shrink-0",
                  typeConfig.badgeColor
                )}
              >
                {typeConfig.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            {locationTag && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                {locationTag}
              </span>
            )}

            {expData?.price !== undefined && expData?.price !== null && (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                €{Number(expData.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}

            <span className="font-mono text-muted-foreground/70 truncate">
              ID: {experienceId}
            </span>
          </div>
        </div>
      </div>

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
          title="Remove Experience"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export function PlaceExperiencesForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const sectionKey = "experiences"
  const isOpen = Boolean(openSections[sectionKey])

  // Support both pure string[] array and legacy object { items: string[] }
  const rawData: any = draft.experience ?? (draft as any).experiences ?? []
  const rawItems: any[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.items)
    ? rawData.items
    : Array.isArray(rawData?.cards)
    ? rawData.cards
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

  // User requirement: "That's mean tumi bujhte parcho, je amar ekhon experience er output hobe just array."
  const updateExpItems = (newItems: string[]) => {
    updateField("experience", newItems)
  }

  // Add experience ID directly from Experience Search
  const handleSelectExperience = (exp: ExperienceSearchItem) => {
    if (!exp || !exp.id) return
    if (!items.includes(exp.id)) {
      updateExpItems([...items, exp.id])
    }
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    updateExpItems(updated)
  }

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= items.length) return
    const updated = [...items]
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    updateExpItems(updated)
  }

  return (
    <FormSection
      title="Curated Experiences"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex flex-col gap-5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Link curated Experiences from the Experience table to this Place.
          Item 1 is featured as the top full-width banner, and subsequent items render in the curated experiences grid.
        </p>

        {/* Search & Add Picker */}
        <div ref={searchContainerRef} className="relative w-full">
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Search & Add Experiences
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
              className="w-full rounded-md border border-input bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-md border border-border bg-popover py-1 shadow-lg">
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
                      disabled={isSelected}
                      onClick={() => handleSelectExperience(exp)}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed border-b border-border/40 last:border-b-0 cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="font-medium text-foreground truncate">{exp.name}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          {typeConfig && (
                            <span
                              className={cn(
                                "inline-flex items-center rounded px-1.5 py-0.2 font-medium border",
                                typeConfig.badgeColor
                              )}
                            >
                              {typeConfig.label}
                            </span>
                          )}

                          {locLabel && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5" />
                              {locLabel}
                            </span>
                          )}

                          {exp.price !== undefined && exp.price !== null && (
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              €{Number(exp.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            <Check className="h-3 w-3 text-emerald-600" />
                            Added
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded transition-colors">
                            <Plus className="h-3 w-3" />
                            Add
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Connected Experience Items List */}
        <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 bg-muted/20">
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Connected Experiences ({items.length})
              </h4>
            </div>

            {items.length > 0 && (
              <span className="text-[10px] text-muted-foreground font-mono">
                Output: string[{items.length}]
              </span>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center rounded-lg border border-dashed border-border/80 bg-background/50">
              <Compass className="h-6 w-6 text-muted-foreground/60 mb-2" />
              <p className="text-xs font-medium text-foreground">No experiences linked yet</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Use the search bar above to link curated experiences to this place.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((experienceId, idx) => (
                <ExperienceItemRow
                  key={experienceId || idx}
                  experienceId={experienceId}
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

