import { useState, useRef, useEffect } from "react"
import {
  Search,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
  MapPin,
} from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import {
  useSearchLocations,
  useGetLocationPages,
  type LocationSearchItem,
} from "@/hooks/location/useGetLocation"
import { emptyLocation } from "../../shared/emptyLocation"

export function HighlightsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: LocationFormSectionProps) {
  const highlights =
    draft?.highlights ||
    (draft as any)?.data?.highlights || {
      label: "SEASONAL HIGHLIGHTS",
      title: "Regions of Europe",
      description:
        "A selection of destinations currently resonating with our most discerning travelers.",
      items: [],
      backgroundMultimedia: null,
    }

  // Fetch available locations to display rich card info for selected IDs
  const { data: locationPagesResponse } = useGetLocationPages({ limit: 100 })
  const availableLocations = locationPagesResponse?.data || []

  // Extract raw string IDs from highlights.items (supports legacy items as objects or strings)
  const rawItems: any[] = Array.isArray(highlights.items) ? highlights.items : []
  const itemIds: string[] = rawItems
    .map((it: any) => (typeof it === "string" ? it : it?.id || it?.locationId))
    .filter(Boolean)

  const isOpen = Boolean(openSections["highlights"])

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

  const updateHighlightsField = (fieldKey: string, value: any) => {
    updateField(`highlights.${fieldKey}`, value)
  }

  const updateItemIds = (newItemIds: string[]) => {
    updateHighlightsField("items", newItemIds)
  }

  // Add location ID directly from live DB Search
  const handleAddLocationFromSearch = (loc: LocationSearchItem) => {
    if (!loc) return
    const idToAdd = loc.id || loc.slug
    if (!idToAdd) return

    if (!itemIds.includes(idToAdd)) {
      const updated = [...itemIds, idToAdd]
      updateItemIds(updated)
    }

    setSearchQuery("")
    setIsSearchOpen(false)
  }

  // Import all child locations automatically (as IDs)
  const handleImportChildren = () => {
    if (!draft?.children || draft.children.length === 0) return

    const childIds = draft.children
      .map((child: any) => child.id)
      .filter(Boolean) as string[]

    // Merge unique IDs
    const combined = Array.from(new Set([...itemIds, ...childIds]))
    updateItemIds(combined)
  }

  const handleDeleteItem = (index: number) => {
    const updated = itemIds.filter((_, idx) => idx !== index)
    updateItemIds(updated)
  }

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === itemIds.length - 1) return

    const updated = [...itemIds]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)
    updateItemIds(updated)
  }

  return (
    <FormSection
      title="04. Seasonal Highlights & Regions"
      active={isOpen}
      onClick={() => toggleSection("highlights")}
    >
      <div className="flex flex-col gap-5">
        {/* 1. Eyebrow / Label */}
        <DynamicStyledField
          type="text"
          label="Eyebrow / Category Tag"
          fieldName="highlights.label"
          placeholder="e.g. SEASONAL HIGHLIGHTS"
          value={highlights.label}
          onChange={(val) => updateHighlightsField("label", val)}
        />

        {/* 2. Section Main Title */}
        <DynamicStyledField
          type="text"
          label="Section Title"
          fieldName="highlights.title"
          placeholder="e.g. Regions of Europe"
          value={highlights.title}
          onChange={(val) => updateHighlightsField("title", val)}
        />

        {/* 3. Section Subtitle / Description */}
        <DynamicStyledField
          type="textarea"
          label="Subtitle / Description"
          fieldName="highlights.description"
          placeholder="e.g. A selection of destinations currently resonating with our most discerning travelers."
          value={highlights.description}
          onChange={(val) => updateHighlightsField("description", val)}
        />

        {/* 4. Universal Multimedia / Section Background Media */}
        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="highlights.backgroundMultimedia"
          imageFieldName="locationHighlightsBackgroundImage"
          videoFieldName="locationHighlightsBackgroundVideo"
          value={
            highlights.backgroundMultimedia ||
            emptyLocation.highlights?.backgroundMultimedia ||
            null
          }
          onChange={(multimedia) =>
            updateHighlightsField("backgroundMultimedia", multimedia)
          }
        />

        {/* 5. Highlight Locations Header & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5 pt-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Highlight Locations ({itemIds.length})
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Select locations by ID to feature in this seasonal highlights marquee.
            </p>
          </div>

          {draft?.id && Array.isArray(draft.children) && draft.children.length > 0 && (
            <button
              type="button"
              onClick={handleImportChildren}
              className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 cursor-pointer transition-colors"
              title={`Import all ${draft.children.length} child location IDs under this location`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Import Children ({draft.children.length})
            </button>
          )}
        </div>

        {/* 6. Live Search Input & Popover */}
        <div ref={searchContainerRef} className="relative">
          <label className="text-xs font-semibold text-foreground mb-1.5 block">
            Search & Add Location by ID:
          </label>
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsSearchOpen(true)
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search location by name, slug or type (e.g. Riviera, North Albania, Tirana)..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setIsSearchOpen(false)
                }}
                className="absolute right-2.5 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results Popover */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl">
              {isSearching ? (
                <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Searching locations...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No locations found matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {searchResults.map((loc) => {
                    const isAlreadyAdded = itemIds.includes(loc.id) || itemIds.includes(loc.slug)
                    const heroMedia = (loc as any).hero?.backgroundMultimedia
                    const thumbUrl =
                      heroMedia?.image?.url ||
                      (loc as any).hero?.image?.url ||
                      (loc as any).card?.background_image ||
                      (heroMedia?.show === "image" ? heroMedia?.image?.url : "") ||
                      ""

                    return (
                      <div
                        key={loc.id}
                        className={`flex items-center justify-between gap-3 p-2.5 transition-colors hover:bg-muted/60 ${
                          isAlreadyAdded ? "bg-muted/30" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded border border-border bg-muted">
                            {thumbUrl ? (
                              <img
                                src={thumbUrl}
                                alt={loc.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[9px] text-muted-foreground">
                                <MapPin className="h-4 w-4 opacity-40" />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-xs font-semibold text-foreground">
                                {loc.name}
                              </span>
                              <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary">
                                {loc.type}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                              {loc.parent?.name && (
                                <span>In {loc.parent.name}</span>
                              )}
                              <span className="font-mono text-[9px] opacity-70">
                                /{loc.slug}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddLocationFromSearch(loc)}
                          disabled={isAlreadyAdded}
                          className={`flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            isAlreadyAdded
                              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                              : "bg-primary text-primary-foreground hover:opacity-90 shadow-2xs"
                          }`}
                        >
                          {isAlreadyAdded ? (
                            <>
                              <Check className="h-3 w-3" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3" />
                              Add ID
                            </>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 7. Highlight Location IDs List */}
        {itemIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-xs font-medium text-muted-foreground">
              No highlight location IDs added yet.
            </p>
            <p className="text-[11px] text-muted-foreground/80 mt-1 max-w-xs">
              Search locations in the search box above or click &quot;Import Children&quot; to select highlight locations.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {itemIds.map((id, idx) => {
              const loc =
                availableLocations.find((l: any) => l.id === id || l.slug === id) ||
                (draft?.children as any[])?.find((c: any) => c.id === id || c.slug === id)

              const locationTitle = loc?.name || id
              const locationType = loc?.type || "Location"
              const locationParent = loc?.parent?.name || draft?.name || ""
              const locationSlug = loc?.slug || id

              const heroMedia = loc?.hero?.backgroundMultimedia
              const previewImg =
                heroMedia?.image?.url ||
                loc?.hero?.image?.url ||
                loc?.card?.background_image ||
                ""

              return (
                <div
                  key={`${id}-${idx}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/70 bg-card hover:border-border transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-bold">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>

                    {/* Mini Thumbnail */}
                    <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded border border-border bg-muted">
                      {previewImg ? (
                        <img
                          src={previewImg}
                          alt={locationTitle}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[9px] text-muted-foreground">
                          <MapPin className="h-4 w-4 opacity-40" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {locationTitle}
                        </p>
                        <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary uppercase">
                          {locationType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        {locationParent && <span>In {locationParent}</span>}
                        <span className="font-mono text-[9px] opacity-70">
                          ID: {id}
                        </span>
                        {locationSlug && locationSlug !== id && (
                          <span className="font-mono text-[9px] opacity-70">
                            /{locationSlug}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveItem(idx, "up")}
                      disabled={idx === 0}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveItem(idx, "down")}
                      disabled={idx === itemIds.length - 1}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(idx)}
                      className="rounded p-1 text-destructive/80 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                      title="Remove highlight"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </FormSection>
  )
}

export default HighlightsForm
