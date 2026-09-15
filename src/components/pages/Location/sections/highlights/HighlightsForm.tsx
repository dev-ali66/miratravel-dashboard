import { useState, useRef, useEffect } from "react"
import {
  Search,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  MapPin,
  Layers,
  Image as ImageIcon,
  Check,
  Copy,
  X,
  Loader2,
} from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import { useSearchLocations, type LocationSearchItem } from "@/hooks/location/useGetLocation"
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
      label: "",
      title: "",
      description: "",
      items: [],
      backgroundMultimedia: null,
    }

  // Pure array of location IDs stored under highlights.items
  const rawItemIds: string[] = Array.isArray(highlights.items)
    ? highlights.items
        .map((it: any) => (typeof it === "string" ? it : it?.id || it?.locationId))
        .filter(Boolean)
    : []

  const isOpen = Boolean(openSections["highlights"])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Fast search query from backend GET /api/v1/locations/search (returns id, name, slug, type, hero, parent)
  const { data: searchResponse, isLoading: isSearching } = useSearchLocations(searchQuery, undefined, 50)
  const searchResults: LocationSearchItem[] = searchResponse?.data || []

  // Close search popover on click outside
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

  const updateItems = (newIds: string[]) => {
    updateHighlightsField("items", newIds)
  }

  const handleAddLocationId = (locationId: string) => {
    if (!locationId) return
    if (rawItemIds.includes(locationId)) return

    updateItems([...rawItemIds, locationId])
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  const handleImportChildren = () => {
    if (!draft?.children || draft.children.length === 0) return

    const childIds = draft.children
      .map((child: any) => child.id)
      .filter(Boolean)

    const merged = Array.from(new Set([...rawItemIds, ...childIds]))
    updateItems(merged)
  }

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === rawItemIds.length - 1) return

    const updated = [...rawItemIds]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)
    updateItems(updated)
  }

  const handleDeleteItem = (index: number) => {
    const updated = rawItemIds.filter((_, idx) => idx !== index)
    updateItems(updated)
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <FormSection
      title="04. Seasonal Highlights & Regions"
      active={isOpen}
      onClick={() => toggleSection("highlights")}
    >
      <div className="flex flex-col gap-5">
        {/* Eyebrow / Label */}
        <DynamicStyledField
          type="text"
          label="Eyebrow / Category Tag"
          fieldName="highlights.label"
          placeholder="e.g. SEASONAL HIGHLIGHTS"
          value={highlights.label}
          onChange={(val) => updateHighlightsField("label", val)}
        />

        {/* Section Main Title */}
        <DynamicStyledField
          type="text"
          label="Section Title"
          fieldName="highlights.title"
          placeholder="e.g. Regions of Albania"
          value={highlights.title}
          onChange={(val) => updateHighlightsField("title", val)}
        />

        {/* Section Subtitle / Description */}
        <DynamicStyledField
          type="textarea"
          label="Subtitle / Description"
          fieldName="highlights.description"
          placeholder="e.g. A selection of destinations currently resonating with our most discerning travelers."
          value={highlights.description}
          onChange={(val) => updateHighlightsField("description", val)}
        />

        {/* Universal Multimedia / Section Background Media */}
        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="highlights.backgroundMultimedia"
          imageFieldName="locationHighlightsBackgroundImage"
          videoFieldName="locationHighlightsBackgroundVideo"
          value={
            highlights.backgroundMultimedia ||
            emptyLocation.highlights.backgroundMultimedia
          }
          onChange={(multimedia) =>
            updateHighlightsField("backgroundMultimedia", multimedia)
          }
        />

        {/* Highlight Locations Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5 pt-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Highlight Locations ({rawItemIds.length})
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Search and add locations by ID. Card media & titles are fetched dynamically.
            </p>
          </div>

          {draft?.id && Array.isArray(draft.children) && draft.children.length > 0 && (
            <button
              type="button"
              onClick={handleImportChildren}
              className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 cursor-pointer transition-colors"
              title={`Import all ${draft.children.length} child locations under this location`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Import Children ({draft.children.length})
            </button>
          )}
        </div>

        {/* Live Search Input & Popover */}
        <div ref={searchContainerRef} className="relative">
          <label className="text-xs font-semibold text-foreground mb-1.5 block">
            Search & Add Location:
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
              placeholder="Search location by name, slug or type (e.g. Riviera, Albania, Europe)..."
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
                    const isAlreadyAdded = rawItemIds.includes(loc.id)
                    const heroMedia = loc.hero?.backgroundMultimedia
                    const thumbUrl =
                      heroMedia?.image?.url ||
                      loc.hero?.image?.url ||
                      loc.card?.background_image ||
                      (heroMedia?.show === "image" ? heroMedia?.image?.url : "") ||
                      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=300&q=80"

                    return (
                      <div
                        key={loc.id}
                        className={`flex items-center justify-between gap-3 p-2.5 transition-colors hover:bg-muted/60 ${
                          isAlreadyAdded ? "bg-muted/30" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded border border-border bg-muted">
                            <img
                              src={thumbUrl}
                              alt={loc.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-xs font-semibold text-foreground">
                                {loc.name}
                              </span>
                              <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold uppercase text-primary">
                                {loc.type}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                              {loc.parent?.name && (
                                <span>{loc.parent.name}</span>
                              )}
                              {loc.parent?.name && <span>•</span>}
                              <span className="font-mono">/{loc.slug}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddLocationId(loc.id)}
                          disabled={isAlreadyAdded}
                          className={`shrink-0 flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-all ${
                            isAlreadyAdded
                              ? "bg-muted text-muted-foreground opacity-60 cursor-not-allowed"
                              : "bg-primary text-primary-foreground hover:opacity-90 shadow-2xs"
                          }`}
                        >
                          {isAlreadyAdded ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="h-3.5 w-3.5" />
                              Add
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

        {/* Selected Locations List */}
        {rawItemIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center text-muted-foreground">
            <Layers className="h-8 w-8 opacity-40 mb-2" />
            <p className="text-xs font-medium">No highlight locations selected yet.</p>
            <p className="text-[11px] mt-0.5">
              Type in the search box above or click &quot;Import Children&quot;.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {rawItemIds.map((locId, index) => {
              const matchedLocation = searchResults.find((l) => l.id === locId)
              const heroMedia = matchedLocation?.hero?.backgroundMultimedia
              const thumbUrl =
                heroMedia?.image?.url ||
                matchedLocation?.hero?.image?.url ||
                matchedLocation?.card?.background_image ||
                (heroMedia?.show === "image" ? heroMedia?.image?.url : "") ||
                "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=400&q=80"

              return (
                <div
                  key={`${locId}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-card p-3 transition-all hover:border-primary/50 shadow-2xs"
                >
                  {/* Left: Thumbnail + Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {index + 1}
                    </span>

                    {/* Thumbnail */}
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={matchedLocation?.name || "Thumbnail"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-4 w-4 opacity-40" />
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-semibold text-foreground">
                          {matchedLocation?.name || "Location ID: " + locId}
                        </span>
                        {matchedLocation?.type && (
                          <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary">
                            {matchedLocation.type}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                        {matchedLocation?.slug && (
                          <span className="font-mono text-[10px]">
                            /{matchedLocation.slug}
                          </span>
                        )}
                        <span className="text-border">•</span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(locId)}
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Click to copy ID"
                        >
                          <MapPin className="h-2.5 w-2.5 text-accent" />
                          {locId.slice(-8)}
                          {copiedId === locId ? (
                            <Check className="h-2.5 w-2.5 text-green-600" />
                          ) : (
                            <Copy className="h-2.5 w-2.5 opacity-60" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveItem(index, "up")}
                      disabled={index === 0}
                      className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveItem(index, "down")}
                      disabled={index === rawItemIds.length - 1}
                      className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(index)}
                      className="rounded p-1 text-destructive hover:bg-destructive/10 cursor-pointer ml-1"
                      title="Remove Location from Highlights"
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
