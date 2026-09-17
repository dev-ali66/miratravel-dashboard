import { useState, useRef, useEffect } from "react"
import { Search, Plus, Trash2, ChevronUp, ChevronDown, Sparkles, Check, X, Loader2, Image as ImageIcon, MapPin, Star } from "lucide-react"
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

export function GlanceForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const glanceData =
    draft?.glance ||
    draft?.regionGlance ||
    (draft as any)?.data?.glance ||
    (draft as any)?.data?.regionGlance ||
    emptyLocation.glance ||
    {
      label: "REGIONAL ORIENTATION",
      title: "The Region at a Glance",
      description: "",
      items: [],
      backgroundMultimedia: null,
    }

  // Fetch available locations to display rich card info for selected IDs
  const { data: locationPagesResponse } = useGetLocationPages({ limit: 100 })
  const availableLocations = locationPagesResponse?.data || []

  // Extract raw string IDs from glance.items (supports both legacy items objects and string IDs)
  const rawItems: any[] = Array.isArray(glanceData.items) ? glanceData.items : []
  const itemIds: string[] = rawItems
    .map((it: any) => (typeof it === "string" ? it : it?.id || it?.locationId))
    .filter(Boolean)

  const isOpen = Boolean(openSections["glance"])

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

  const updateGlanceField = (fieldKey: string, value: any) => {
    updateField(`glance.${fieldKey}`, value)
  }

  const updateItemIds = (newItemIds: string[]) => {
    updateGlanceField("items", newItemIds)
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
      .map((child: any) => child.id || child.slug)
      .filter(Boolean) as string[]

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
      title="Glance"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("glance")}
    >
      <div className="flex flex-col gap-5">
        {/* 1. Eyebrow / Label */}
        <DynamicStyledField
          type="text"
          label="Eyebrow / Category Tag"
          fieldName="glance.label"
          placeholder="e.g. REGIONAL ORIENTATION"
          value={glanceData.label}
          onChange={(val) => updateGlanceField("label", val)}
        />

        {/* 2. Section Main Title */}
        <DynamicStyledField
          type="text"
          label="Section Title"
          fieldName="glance.title"
          placeholder="e.g. The Region at a Glance"
          value={glanceData.title}
          onChange={(val) => updateGlanceField("title", val)}
        />

        {/* 3. Section Subtitle / Narrative Description */}
        <DynamicStyledField
          type="textarea"
          label="Subtitle / Narrative Description"
          fieldName="glance.description"
          placeholder="Write a brief regional orientation overview..."
          value={glanceData.description}
          onChange={(val) => updateGlanceField("description", val)}
        />

        {/* 4. Universal Multimedia / Section Background Media */}
        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="glance.backgroundMultimedia"
          imageFieldName="glanceBackgroundImg"
          videoFieldName="glanceBackgroundVid"
          value={
            glanceData.backgroundMultimedia ||
            emptyLocation.glance?.backgroundMultimedia || {
              show: "color",
              color: {
                color: "#FFFFFF",
                opacity: 100,
                width: "100%",
                height: "100%",
                aspectRatio: "auto",
              },
              image: {
                url: "",
                alt: "Glance section background",
                opacity: 100,
                overlayColor: "#000000",
                overlayOpacity: 0,
                width: "100%",
                height: "auto",
                aspectRatio: "auto",
                fit: "cover",
              },
              video: {
                url: "",
                alt: "Glance section background video",
                autoplay: true,
                loop: true,
                muted: true,
                opacity: 100,
                overlayColor: "#000000",
                overlayOpacity: 0,
                width: "100%",
                height: "auto",
                aspectRatio: "auto",
                fit: "cover",
              },
            }
          }
          onChange={(multimedia) =>
            updateGlanceField("backgroundMultimedia", multimedia)
          }
        />

        {/* 5. Glance Location Cards Header & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5 pt-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Glance Destination Cards ({itemIds.length}) — Position #1 is Featured
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Select locations by ID to feature in this region glance marquee.
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
            Search & Add Location Card by ID:
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
                    const heroMedia = loc.hero?.backgroundMultimedia
                    const thumbUrl =
                      heroMedia?.image?.url ||
                      loc.hero?.image?.url ||
                      loc.card?.background_image ||
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
                              Add Card
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

        {/* 7. Glance Location IDs List */}
        {itemIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-xs font-medium text-muted-foreground">
              No glance location cards added yet.
            </p>
            <p className="text-[11px] text-muted-foreground/80 mt-1 max-w-xs">
              Search locations in the search box above or click &quot;Import Children&quot; to select glance destination cards.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {itemIds.map((id, idx) => {
              const isFeatured = idx === 0
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
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all shadow-2xs ${
                    isFeatured
                      ? "border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10"
                      : "border-border/70 bg-card hover:border-border"
                  }`}
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
                        {isFeatured ? (
                          <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-semibold text-amber-700 dark:text-amber-300">
                            <Star className="h-2.5 w-2.5 fill-current text-amber-500" />
                            #1 Featured Card
                          </span>
                        ) : (
                          <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary uppercase">
                            {locationType}
                          </span>
                        )}
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
                      title="Remove card"
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

export default GlanceForm
