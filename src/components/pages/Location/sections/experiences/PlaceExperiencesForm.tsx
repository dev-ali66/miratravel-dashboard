import { useState, useRef, useEffect } from "react"
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  Layers,
  Search,
  Sparkles,
  Check,
  X,
  Loader2,
  MapPin,
} from "lucide-react"

import type { LocationFormSectionProps } from "../../config/locationSections"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import { useSearchLocations, type LocationSearchItem } from "@/hooks/location/useGetLocation"

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

  // Get items array (or fallback to cards / featured_experience for backward compatibility)
  const items: any[] = Array.isArray(expData.items) && expData.items.length > 0
    ? expData.items
    : Array.isArray(expData.cards) && expData.cards.length > 0
    ? (expData.featured_experience ? [expData.featured_experience, ...expData.cards] : expData.cards)
    : expData.featured_experience
    ? [expData.featured_experience]
    : []

  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null)

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
    updateField(`experiences.${path}`, val)
  }

  const updateExpItems = (newItems: any[]) => {
    updateExpField("items", newItems)
  }

  // Create item data structure matching exact JSON standard
  const createExperienceItem = (loc: any) => {
    const subtitleText =
      loc.hero?.subtitle?.value ||
      loc.hero?.subtitle ||
      (Array.isArray(loc.why?.tags) ? loc.why.tags.join(" • ") : "") ||
      "Curated experience and coastal exploration"

    const descText =
      loc.hero?.description?.value ||
      loc.hero?.description ||
      loc.essence?.paragraphs?.value ||
      `Discover the wild beauty, heritage, and curated experiences in ${loc.name}.`

    const heroMedia = loc.hero?.backgroundMultimedia || loc.backgroundMultimedia
    const imgUrl =
      heroMedia?.image?.url ||
      loc.hero?.image?.url ||
      loc.card?.background_image ||
      ""

    const mediaToUse = heroMedia
      ? structuredClone(heroMedia)
      : {
          show: imgUrl ? "image" : "color",
          color: { color: "#FFFFFF", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
          image: { url: imgUrl, alt: loc.name, opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "100%", aspectRatio: "auto", fit: "cover" },
          video: { url: "", alt: loc.name, opacity: 100, overlayColor: "#000000", overlayOpacity: 0, autoplay: true, loop: true, muted: true, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
        }

    const itemTag = (loc.type || "REGION").toUpperCase()

    return {
      id: loc.id || `exp-${Date.now()}`,
      title: {
        value: loc.name,
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      subtitle: {
        value: subtitleText,
        textColor: "#9c705d",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: descText,
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      tag: {
        value: itemTag,
        textColor: "#9c705d",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      buttons: [
        {
          label: `Explore ${loc.name}`,
          url: loc.slug ? `/destinations/${loc.slug}` : "#",
          style: "primary",
          variant: "PRIMARY",
          textColor: "#ffffff",
          backgroundColor: "#af6348",
        },
      ],
      imageMultimedia: mediaToUse,
    }
  }

  // Add experience card directly from live DB Location Search
  const handleSelectLocation = (loc: LocationSearchItem) => {
    if (!loc) return
    const newItem = createExperienceItem(loc)
    const updated = [...items, newItem]
    updateExpItems(updated)
    setExpandedItemIndex(updated.length - 1)
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  // Import all child locations automatically as experience items
  const handleImportChildren = () => {
    if (!draft?.children || draft.children.length === 0) return
    const childItems = draft.children.map((child: any) => createExperienceItem(child))
    updateExpItems(childItems)
    setExpandedItemIndex(0)
  }

  const handleUpdateItem = (index: number, key: string, val: any) => {
    const updated = items.map((item, i) => {
      if (i !== index) return item
      return { ...item, [key]: val }
    })
    updateExpItems(updated)
  }

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    updateExpItems(updated)
    if (expandedItemIndex === index) setExpandedItemIndex(null)
  }

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= items.length) return
    const updated = [...items]
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    updateExpItems(updated)
    setExpandedItemIndex(targetIdx)
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

        {/* Unified Curated Experience Items & Search Controls */}
        <div className="flex flex-col gap-4 rounded-xl border border-border/60 p-4 bg-muted/20">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Curated Experience Items ({items.length})
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                First item (index 0) will automatically render as the Featured Experience Banner.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {draft?.id && Array.isArray(draft.children) && draft.children.length > 0 && (
                <button
                  type="button"
                  onClick={handleImportChildren}
                  className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/20 cursor-pointer transition-colors"
                  title={`Import all ${draft.children.length} child locations as experience items`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Import Children ({draft.children.length})
                </button>
              )}
            </div>
          </div>

          {/* Live Search Input & Dropdown Popover */}
          <div ref={searchContainerRef} className="relative">
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Search & Add Location to Curated Experiences:
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
                placeholder="Search location by name, slug or type (e.g. Cavtat, Dhërmi, Riviera)..."
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

            {/* Dropdown Popover */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg text-popover-foreground">
                {isSearching ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Searching database...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-3 px-3 text-center text-xs text-muted-foreground">
                    {searchQuery.trim()
                      ? "No locations match your search term."
                      : "Type a location name to search from database."}
                  </div>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {searchResults.map((loc) => {
                      const isAlreadyAdded = items.some(
                        (item) => item.id === loc.id || item.locationId === loc.id
                      )
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          disabled={isAlreadyAdded}
                          onClick={() => handleSelectLocation(loc)}
                          className={`flex items-center justify-between gap-2 w-full rounded-md px-3 py-2 text-left text-xs transition-colors ${
                            isAlreadyAdded
                              ? "opacity-50 cursor-not-allowed bg-muted/30"
                              : "hover:bg-accent/10 hover:text-accent cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="font-medium text-foreground truncate">
                              {loc.name}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                              {loc.type || "PLACE"}
                            </span>
                          </div>

                          {isAlreadyAdded ? (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 font-medium">
                              <Check className="h-3 w-3 text-emerald-500" /> Added
                            </span>
                          ) : (
                            <span className="text-[10px] text-accent font-semibold shrink-0">
                              + Add Item
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Experience Items List */}
          {items.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-border rounded-lg bg-background/50">
              <p className="text-xs text-muted-foreground">
                No experience items added yet. Search locations above or click &quot;Import Children&quot;.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item, idx) => {
                const isExpanded = expandedItemIndex === idx
                const itemTitle =
                  typeof item.title === "object"
                    ? item.title?.value
                    : item.title || `Experience Item #${idx + 1}`
                const isFeaturedItem = idx === 0

                return (
                  <div
                    key={item.id || idx}
                    className={`flex flex-col rounded-lg border transition-all ${
                      isFeaturedItem
                        ? "border-amber-500/40 bg-amber-50/20"
                        : "border-border bg-background"
                    }`}
                  >
                    {/* Header bar */}
                    <div
                      onClick={() => setExpandedItemIndex(isExpanded ? null : idx)}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isFeaturedItem ? (
                          <span className="flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-500/30 shrink-0">
                            <Star className="h-3 w-3 text-amber-600 fill-amber-500" /> FEATURED BANNER
                          </span>
                        ) : (
                          <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground shrink-0">
                            #{idx + 1} CARD
                          </span>
                        )}
                        <span className="text-xs font-medium text-foreground truncate">
                          {itemTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveItem(idx, "up")}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === items.length - 1}
                          onClick={() => handleMoveItem(idx, "down")}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedItemIndex(isExpanded ? null : idx)}
                          className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="flex flex-col gap-3 p-3 border-t border-border/60 bg-muted/10">
                        <DynamicStyledField
                          type="text"
                          label="Title"
                          fieldName="title"
                          value={item.title}
                          onChange={(val: any) => handleUpdateItem(idx, "title", val)}
                          placeholder="e.g. Bay of Kotor"
                        />

                        <DynamicStyledField
                          type="text"
                          label="Tag / Category Badge"
                          fieldName="tag"
                          value={item.tag}
                          onChange={(val: any) => handleUpdateItem(idx, "tag", val)}
                          placeholder="e.g. REGION"
                        />

                        <DynamicStyledField
                          type="text"
                          label="Subtitle"
                          fieldName="subtitle"
                          value={item.subtitle}
                          onChange={(val: any) => handleUpdateItem(idx, "subtitle", val)}
                          placeholder="e.g. Venetian Palazzos, Island Sanctuaries & Mega-Yacht Marinas"
                        />

                        <DynamicStyledField
                          type="textarea"
                          label="Description"
                          fieldName="description"
                          value={item.description}
                          onChange={(val: any) => handleUpdateItem(idx, "description", val)}
                          placeholder="e.g. Immerse yourself in UNESCO-listed medieval stone towns..."
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Season Information Bar */}
        <div className="flex flex-col gap-4 rounded-xl border border-border/60 p-4 bg-muted/20">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Season Guidance Note
            </label>
            <textarea
              value={expData.seasonInfo || ""}
              onChange={(e) => updateExpField("seasonInfo", e.target.value)}
              placeholder="e.g. All information is available on site. The season runs from May to October..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
            />
          </div>
        </div>

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Multimedia"
          value={expData.backgroundMultimedia}
          onChange={(val: any) => updateExpField("backgroundMultimedia", val)}
          defaultColor="#F1EEE5"
        />
      </div>
    </FormSection>
  )
}
