import { useState, useRef, useEffect } from "react"
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Loader2,
  MapPin,
  Compass,
  BookOpen,
  Plus,
  Check,
  X,
} from "lucide-react"

import type { StoryFormSectionProps } from "../../config/storySections"
import { FormSection } from "../../shared/fields"
import { useStoryLocations, type StoryLocationItem } from "@/hooks/story/useStoryLocations"
import { useStoryJourneys, type StoryJourneyItem } from "@/hooks/story/useStoryJourneys"
import { useGetStories, useGetStoryById } from "@/hooks/story/useGetStories"
import { useGetLocationById } from "@/hooks/location/useGetLocationById"
import { useGetJourneyById } from "@/hooks/journey/useGetJourneyById"

/* =====================================================
   HELPER ITEM ROWS FOR DISPLAYING SELECTED IDs
===================================================== */

function LocationRow({
  locationId,
  index,
  total,
  onMove,
  onRemove,
}: {
  locationId: string
  index: number
  total: number
  onMove: (idx: number, dir: "up" | "down") => void
  onRemove: (idx: number) => void
}) {
  const { data: rawLocData } = useGetLocationById(locationId)
  const loc = rawLocData?.data || rawLocData
  const name = loc?.name || `Location (${locationId.slice(-8)})`
  const type = loc?.type || "LOCATION"

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card p-2.5 shadow-2xs transition-colors hover:border-border">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
          {index + 1}
        </span>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground truncate">{name}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
              {type}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono truncate">
            ID: {locationId}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, "up")}
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
          title="Move Up"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, "down")}
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
          title="Move Down"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          title="Remove Location"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function JourneyRow({
  journeyId,
  index,
  total,
  onMove,
  onRemove,
}: {
  journeyId: string
  index: number
  total: number
  onMove: (idx: number, dir: "up" | "down") => void
  onRemove: (idx: number) => void
}) {
  const { data: rawData } = useGetJourneyById(journeyId)
  const journey = rawData?.data || rawData
  const title = journey?.title || `Journey (${journeyId.slice(-8)})`

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card p-2.5 shadow-2xs transition-colors hover:border-border">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          {index + 1}
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-foreground truncate">{title}</span>
          <span className="text-[10px] text-muted-foreground font-mono truncate">
            ID: {journeyId}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, "up")}
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
          title="Move Up"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, "down")}
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
          title="Move Down"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          title="Remove Journey"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function StoryRow({
  storyId,
  index,
  total,
  onMove,
  onRemove,
}: {
  storyId: string
  index: number
  total: number
  onMove: (idx: number, dir: "up" | "down") => void
  onRemove: (idx: number) => void
}) {
  const { data: rawData } = useGetStoryById(storyId)
  const story = (rawData as any)?.data || rawData
  const title = story?.title || `Story (${storyId.slice(-8)})`
  const type = story?.type || "STORY"

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card p-2.5 shadow-2xs transition-colors hover:border-border">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
          {index + 1}
        </span>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground truncate">{title}</span>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 shrink-0">
              {type.replace(/_/g, " ")}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono truncate">
            ID: {storyId}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, "up")}
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
          title="Move Up"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, "down")}
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
          title="Move Down"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          title="Remove Story"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

/* =====================================================
   MAIN RELATIONSHIPS SECTION FORM
===================================================== */

export function RelationshipsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: StoryFormSectionProps) {
  const isOpen = Boolean(openSections["relationships"] || openSections["linked-resources"])

  // Safe arrays
  const locationIds: string[] = Array.isArray(draft.locations) && draft.locations.length > 0
    ? draft.locations.map((l: any) => (typeof l === "string" ? l : l?.id)).filter(Boolean)
    : Array.isArray(draft.locationIds)
    ? draft.locationIds
    : []

  const journeyIds: string[] = Array.isArray(draft.journeys) && draft.journeys.length > 0
    ? draft.journeys.map((j: any) => (typeof j === "string" ? j : j?.id)).filter(Boolean)
    : Array.isArray(draft.journeyIds)
    ? draft.journeyIds
    : []

  const manualRelatedStoryIds: string[] = Array.isArray(draft.manualRelatedStories) && draft.manualRelatedStories.length > 0
    ? draft.manualRelatedStories.map((s: any) => (typeof s === "string" ? s : s?.id)).filter(Boolean)
    : Array.isArray(draft.manualRelatedStoryIds)
    ? draft.manualRelatedStoryIds
    : []

  // --- LOCATION SEARCH STATE ---
  const [locSearchQuery, setLocSearchQuery] = useState("")
  const [isLocSearchOpen, setIsLocSearchOpen] = useState(false)
  const locRef = useRef<HTMLDivElement>(null)

  const { data: locResponse, isLoading: isLocLoading } = useStoryLocations({
    search: locSearchQuery,
    limit: 30,
  })
  const locResults: StoryLocationItem[] = locResponse?.data || []

  // --- JOURNEY SEARCH STATE ---
  const [journeySearchQuery, setJourneySearchQuery] = useState("")
  const [isJourneySearchOpen, setIsJourneySearchOpen] = useState(false)
  const journeyRef = useRef<HTMLDivElement>(null)

  const { data: journeyResponse, isLoading: isJourneyLoading } = useStoryJourneys(
    1,
    30,
    journeySearchQuery
  )
  const journeyResults: StoryJourneyItem[] = journeyResponse?.data || []

  // --- STORY SEARCH STATE ---
  const [storySearchQuery, setStorySearchQuery] = useState("")
  const [isStorySearchOpen, setIsStorySearchOpen] = useState(false)
  const storyRef = useRef<HTMLDivElement>(null)

  const { data: storyResponse, isLoading: isStoryLoading } = useGetStories()
  const rawStoryList: any[] = (storyResponse as any)?.data || storyResponse || []
  const storyResults = rawStoryList.filter(
    (s: any) =>
      s?.id !== draft.id &&
      (!storySearchQuery ||
        (s?.title || "").toLowerCase().includes(storySearchQuery.toLowerCase()) ||
        (s?.slug || "").toLowerCase().includes(storySearchQuery.toLowerCase()))
  )

  // Outside click listener to close popovers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (locRef.current && !locRef.current.contains(e.target as Node)) {
        setIsLocSearchOpen(false)
      }
      if (journeyRef.current && !journeyRef.current.contains(e.target as Node)) {
        setIsJourneySearchOpen(false)
      }
      if (storyRef.current && !storyRef.current.contains(e.target as Node)) {
        setIsStorySearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // --- LOCATION HANDLERS ---
  const handleAddLocation = (id: string) => {
    if (!id || locationIds.includes(id)) return
    const next = [...locationIds, id]
    updateField("locations", next)
    updateField("locationIds", next)
    setLocSearchQuery("")
    setIsLocSearchOpen(false)
  }
  const handleRemoveLocation = (index: number) => {
    const next = locationIds.filter((_, i) => i !== index)
    updateField("locations", next)
    updateField("locationIds", next)
  }
  const handleMoveLocation = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1
    if (target < 0 || target >= locationIds.length) return
    const updated = [...locationIds]
    const temp = updated[index]
    updated[index] = updated[target]
    updated[target] = temp
    updateField("locations", updated)
    updateField("locationIds", updated)
  }

  // --- JOURNEY HANDLERS ---
  const handleAddJourney = (id: string) => {
    if (!id || journeyIds.includes(id)) return
    const next = [...journeyIds, id]
    updateField("journeys", next)
    updateField("journeyIds", next)
    setJourneySearchQuery("")
    setIsJourneySearchOpen(false)
  }
  const handleRemoveJourney = (index: number) => {
    const next = journeyIds.filter((_, i) => i !== index)
    updateField("journeys", next)
    updateField("journeyIds", next)
  }
  const handleMoveJourney = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1
    if (target < 0 || target >= journeyIds.length) return
    const updated = [...journeyIds]
    const temp = updated[index]
    updated[index] = updated[target]
    updated[target] = temp
    updateField("journeys", updated)
    updateField("journeyIds", updated)
  }

  // --- STORY HANDLERS ---
  const handleAddStory = (id: string) => {
    if (!id || manualRelatedStoryIds.includes(id)) return
    const next = [...manualRelatedStoryIds, id]
    updateField("manualRelatedStories", next)
    updateField("manualRelatedStoryIds", next)
    setStorySearchQuery("")
    setIsStorySearchOpen(false)
  }
  const handleRemoveStory = (index: number) => {
    const next = manualRelatedStoryIds.filter((_, i) => i !== index)
    updateField("manualRelatedStories", next)
    updateField("manualRelatedStoryIds", next)
  }
  const handleMoveStory = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1
    if (target < 0 || target >= manualRelatedStoryIds.length) return
    const updated = [...manualRelatedStoryIds]
    const temp = updated[index]
    updated[index] = updated[target]
    updated[target] = temp
    updateField("manualRelatedStories", updated)
    updateField("manualRelatedStoryIds", updated)
  }

  return (
    <FormSection
      title="Linked Locations, Journeys & Related Stories"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("relationships")}
    >
      <div className="flex flex-col gap-6">

        {/* 1. LOCATION IDs SEARCH & LINK */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Linked Locations ({locationIds.length})
            </label>
          </div>

          {/* Search Dropdown */}
          <div ref={locRef} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={locSearchQuery}
                onFocus={() => setIsLocSearchOpen(true)}
                onChange={(e) => {
                  setLocSearchQuery(e.target.value)
                  setIsLocSearchOpen(true)
                }}
                placeholder="Search and link locations by name or type..."
                className="w-full rounded-lg border border-border/80 bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
              {locSearchQuery && (
                <button
                  type="button"
                  onClick={() => setLocSearchQuery("")}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Results Popover */}
            {isLocSearchOpen && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-lg">
                {isLocLoading ? (
                  <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                    Searching locations...
                  </div>
                ) : locResults.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    No locations found.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {locResults.map((loc) => {
                      const isSelected = locationIds.includes(loc.id)
                      return (
                        <div
                          key={loc.id}
                          onClick={() => handleAddLocation(loc.id)}
                          className={`flex items-center justify-between rounded-md p-2 text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 font-medium text-primary"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-semibold">{loc.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ID: {loc.id}
                            </span>
                          </div>
                          {isSelected ? (
                            <Check className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Location Rows */}
          {locationIds.length > 0 ? (
            <div className="space-y-2 pt-1">
              {locationIds.map((id, idx) => (
                <LocationRow
                  key={`${id}-${idx}`}
                  locationId={id}
                  index={idx}
                  total={locationIds.length}
                  onMove={handleMoveLocation}
                  onRemove={handleRemoveLocation}
                />
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground italic pt-1">
              No locations linked to this story yet.
            </p>
          )}
        </div>

        {/* 2. JOURNEY IDs SEARCH & LINK */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Linked Journeys ({journeyIds.length})
            </label>
          </div>

          {/* Search Dropdown */}
          <div ref={journeyRef} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={journeySearchQuery}
                onFocus={() => setIsJourneySearchOpen(true)}
                onChange={(e) => {
                  setJourneySearchQuery(e.target.value)
                  setIsJourneySearchOpen(true)
                }}
                placeholder="Search and link journeys by title..."
                className="w-full rounded-lg border border-border/80 bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
              {journeySearchQuery && (
                <button
                  type="button"
                  onClick={() => setJourneySearchQuery("")}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Results Popover */}
            {isJourneySearchOpen && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-lg">
                {isJourneyLoading ? (
                  <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-600" />
                    Searching journeys...
                  </div>
                ) : journeyResults.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    No journeys found.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {journeyResults.map((j) => {
                      const isSelected = journeyIds.includes(j.id)
                      return (
                        <div
                          key={j.id}
                          onClick={() => handleAddJourney(j.id)}
                          className={`flex items-center justify-between rounded-md p-2 text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-semibold">{j.title || "Untitled Journey"}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ID: {j.id}
                            </span>
                          </div>
                          {isSelected ? (
                            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Journey Rows */}
          {journeyIds.length > 0 ? (
            <div className="space-y-2 pt-1">
              {journeyIds.map((id, idx) => (
                <JourneyRow
                  key={`${id}-${idx}`}
                  journeyId={id}
                  index={idx}
                  total={journeyIds.length}
                  onMove={handleMoveJourney}
                  onRemove={handleRemoveJourney}
                />
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground italic pt-1">
              No journeys linked to this story yet.
            </p>
          )}
        </div>

        {/* 3. RELATED STORY IDs SEARCH & LINK */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Related Stories ({manualRelatedStoryIds.length})
            </label>
          </div>

          {/* Search Dropdown */}
          <div ref={storyRef} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={storySearchQuery}
                onFocus={() => setIsStorySearchOpen(true)}
                onChange={(e) => {
                  setStorySearchQuery(e.target.value)
                  setIsStorySearchOpen(true)
                }}
                placeholder="Search and link related stories by title..."
                className="w-full rounded-lg border border-border/80 bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
              {storySearchQuery && (
                <button
                  type="button"
                  onClick={() => setStorySearchQuery("")}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Results Popover */}
            {isStorySearchOpen && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-lg">
                {isStoryLoading ? (
                  <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-600" />
                    Searching stories...
                  </div>
                ) : storyResults.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    No matching stories found.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {storyResults.map((s: any) => {
                      const isSelected = manualRelatedStoryIds.includes(s.id)
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleAddStory(s.id)}
                          className={`flex items-center justify-between rounded-md p-2 text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-indigo-500/10 font-medium text-indigo-600 dark:text-indigo-400"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-semibold">{s.title || "Untitled Story"}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ID: {s.id}
                            </span>
                          </div>
                          {isSelected ? (
                            <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                          ) : (
                            <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Story Rows */}
          {manualRelatedStoryIds.length > 0 ? (
            <div className="space-y-2 pt-1">
              {manualRelatedStoryIds.map((id, idx) => (
                <StoryRow
                  key={`${id}-${idx}`}
                  storyId={id}
                  index={idx}
                  total={manualRelatedStoryIds.length}
                  onMove={handleMoveStory}
                  onRemove={handleRemoveStory}
                />
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground italic pt-1">
              No related stories linked yet.
            </p>
          )}
        </div>

      </div>
    </FormSection>
  )
}

export default RelationshipsForm
