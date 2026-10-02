import { useState, useRef, useEffect } from "react"
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  Search,
  Check,
  X,
  Loader2,
  MapPin,
  Star,
} from "lucide-react"

import type { LocationFormSectionProps } from "../../config/locationSections"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import { useSearchLocations, type LocationSearchItem } from "@/hooks/location/useGetLocation"
import { useGetLocationById } from "@/hooks/location/useGetLocationById"

function LocationItemRow({
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
  const locData = rawLocData?.data || rawLocData
  const isFeatured = index === 0
  const name = locData?.name || `Location (${locationId.slice(-8)})`

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border p-3 shadow-2xs transition-colors ${
        isFeatured
          ? "border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
            isFeatured
              ? "bg-amber-500 text-white"
              : "bg-primary/10 text-primary"
          }`}
        >
          {index + 1}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground truncate">
              {name}
            </span>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 shrink-0">
                <Star className="h-2.5 w-2.5 fill-current" />
                Featured Banner
              </span>
            )}
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
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
          title="Move Up"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, "down")}
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
          title="Move Down"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
          title="Remove Location ID"
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

  const expData = draft.experiences || draft.experience || {}

  // Pure array of string IDs: string[]
  const rawItems: any[] = Array.isArray(expData.items)
    ? expData.items
    : Array.isArray(expData.cards)
    ? expData.cards
    : []

  const items: string[] = rawItems
    .map((it: any) => (typeof it === "string" ? it : it?.locationId || it?.id))
    .filter((id): id is string => Boolean(id) && typeof id === "string")

  // Live Location Search State
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Fetch search matches from backend GET /api/v1/locations/search
  const { data: searchResponse, isLoading: isSearching } = useSearchLocations(
    searchQuery,
    undefined,
    50
  )
  const searchResults: LocationSearchItem[] = searchResponse?.data || []

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

  const updateExpField = (path: string, val: any) => {
    updateField(`experience.${path}`, val)
  }

  const updateExpItems = (newItems: string[]) => {
    updateExpField("items", newItems)
  }

  // Add experience location ID directly from live DB Location Search
  const handleSelectLocation = (loc: LocationSearchItem) => {
    if (!loc || !loc.id) return
    // Prevent duplicate IDs
    if (!items.includes(loc.id)) {
      updateExpItems([...items, loc.id])
    }
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  // Import all child locations automatically as experience location IDs
  const handleImportChildren = () => {
    if (!draft?.children || draft.children.length === 0) return
    const childIds: string[] = draft.children.map((child: any) => child.id).filter(Boolean)
    updateExpItems(childIds)
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
      <div className="flex flex-col gap-6">
        {/* Section Header Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Eyebrow Location Label
            </label>
            <input
              type="text"
              value={expData.location || ""}
              onChange={(e) => updateExpField("location", e.target.value)}
              placeholder="e.g. Dhërmi, Albania"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <DynamicStyledField
            type="text"
            label="Section Main Title"
            fieldName="title"
            value={expData.title}
            onChange={(val: any) => updateExpField("title", val)}
            placeholder="e.g. Experiences"
          />

          <DynamicStyledField
            type="textarea"
            label="Section Description"
            fieldName="description"
            value={expData.description}
            onChange={(val: any) => updateExpField("description", val)}
            placeholder="e.g. Curated ways to discover the wild beauty and heritage..."
          />
        </div>

        {/* Curated Experience Location IDs & Search Controls */}
        <div className="flex flex-col gap-4 rounded-xl border border-border/60 p-4 bg-muted/20">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Curated Experience Locations ({items.length})
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Item 1 (ID) is featured as top banner. Items 2+ render in the 3-column grid.
              </p>
            </div>

            {Array.isArray(draft?.children) && draft.children.length > 0 && (
              <button
                type="button"
                onClick={handleImportChildren}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                Import Children ({draft.children.length})
              </button>
            )}
          </div>

          {/* Location ID Search Picker */}
          <div ref={searchContainerRef} className="relative w-full">
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
                placeholder="Search locations by name to add ID..."
                className="w-full rounded-md border border-input bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setIsSearchOpen(false)
                  }}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-popover py-1 shadow-md">
                {isSearching ? (
                  <div className="flex items-center justify-center p-3 text-xs text-muted-foreground">
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Searching locations...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    No matching locations found.
                  </div>
                ) : (
                  searchResults.map((loc) => {
                    const isSelected = items.includes(loc.id)
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        disabled={isSelected}
                        onClick={() => handleSelectLocation(loc)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <MapPin className="h-3 w-3 text-primary shrink-0" />
                            <span>{loc.name}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            ID: {loc.id} • Type: {loc.type}
                          </span>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                      </button>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {/* Selected Location ID List */}
          {items.length === 0 ? (
            <div className="p-4 text-center rounded-lg border border-dashed border-border bg-background/50">
              <p className="text-xs text-muted-foreground">
                No location IDs added yet. Use the search bar above to pick locations.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((locationId, idx) => (
                <LocationItemRow
                  key={locationId || idx}
                  locationId={locationId}
                  index={idx}
                  total={items.length}
                  onMove={handleMoveItem}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Season Info Footer */}
        <div className="flex flex-col gap-4 border-t border-border/60 pt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Season Information Text
            </label>
            <textarea
              value={expData.seasonInfo || ""}
              onChange={(e) => updateExpField("seasonInfo", e.target.value)}
              placeholder="e.g. All information is available on site. The season runs from May to October..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Season Location Tag
            </label>
            <input
              type="text"
              value={expData.seasonLocation || ""}
              onChange={(e) => updateExpField("seasonLocation", e.target.value)}
              placeholder="e.g. Riviera"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <UniversalMultimediaForm
            title="Section Background Media"
            value={expData.backgroundMultimedia}
            onChange={(val: any) => updateExpField("backgroundMultimedia", val)}
            allowImage
            allowVideo
            allowColor
          />
        </div>
      </div>
    </FormSection>
  )
}
