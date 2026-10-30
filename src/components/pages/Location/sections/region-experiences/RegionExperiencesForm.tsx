import { THEME_COLORS } from "@/config/theme"
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
} from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import type { RegionExperienceItemData } from "../../locationTypes"
import { useSearchLocations, type LocationSearchItem } from "@/hooks/location/useGetLocation"
import { useGetLocationById } from "@/hooks/location/useGetLocationById"
import { emptyLocation } from "../../shared/emptyLocation"
import { getSafeStringValue } from "../../shared/normalizeHelpers"

// Subcomponent: Individual Region Experience Card Row in Form
function RegionExperienceRow({
  item,
  idx,
  isExpanded,
  onToggle,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
  isFirst,
  isLast,
  availableChildren,
}: {
  item: RegionExperienceItemData
  idx: number
  isExpanded: boolean
  onToggle: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onUpdate: (updated: RegionExperienceItemData) => void
  isFirst: boolean
  isLast: boolean
  availableChildren: any[]
}) {
  // Dynamic location lookup with safe array unwrapping
  const { data: queryRes } = useGetLocationById(item.id)
  const inner = (queryRes as any)?.data ?? queryRes
  const locData = Array.isArray(inner) ? inner[0] : inner
  const localMatch = (availableChildren || []).find(
    (c: any) => c.id === item.id || c.slug === item.id
  )
  const resolvedLoc = locData || localMatch || {}

  const locName = resolvedLoc.name || ""
  const itemTitle = getSafeStringValue(item.title, locName || `Region ${idx + 1}`)
  const itemSubtitle = getSafeStringValue(item.subtitle, "")
  const itemTag = resolvedLoc.type || "REGION"

  const heroMedia =
    resolvedLoc.hero?.backgroundMultimedia || resolvedLoc.backgroundMultimedia
  const imgUrl =
    heroMedia?.image?.url ||
    resolvedLoc.hero?.image?.url ||
    resolvedLoc.card?.background_image ||
    (item as any)?.imageMultimedia?.image?.url ||
    (item as any)?.image ||
    ""

  return (
    <div className="rounded-lg border border-border/70 bg-card overflow-hidden transition-all shadow-2xs">
      {/* Row Header */}
      <div
        className="flex items-center justify-between p-3.5 bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
            {idx + 1}
          </span>

          {/* Dynamic Media Thumbnail */}
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded border border-border bg-muted">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={itemTitle}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[9px] text-muted-foreground">
                <ImageIcon className="h-4 w-4 opacity-40" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-foreground truncate">
                {itemTitle}
              </p>
              {itemTag && (
                <span className="shrink-0 rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[9px] font-semibold text-primary uppercase">
                  {itemTag}
                </span>
              )}
            </div>
            {itemSubtitle ? (
              <p className="text-[11px] text-muted-foreground italic truncate">
                {itemSubtitle}
              </p>
            ) : (
              <p className="text-[10px] text-muted-foreground/70 truncate">
                ID: {item.id}
              </p>
            )}
          </div>
        </div>

        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded p-1 text-destructive/80 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            title="Delete region"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Fields: Strictly Focused on Editorial Experience Texts */}
      {isExpanded && (
        <div className="p-4 border-t border-border/50 space-y-4 bg-card">
          {/* Region Title */}
          <DynamicStyledField
            type="text"
            label="Region Title"
            fieldName={`regionExperiences.items.${idx}.title`}
            placeholder="e.g. North & East Kosovo"
            value={item.title}
            onChange={(val) =>
              onUpdate({
                ...item,
                title: val,
              })
            }
          />

          {/* Region Subtitle / Tagline */}
          <DynamicStyledField
            type="text"
            label="Subtitle / Tagline (Italicized in preview)"
            fieldName={`regionExperiences.items.${idx}.subtitle`}
            placeholder="e.g. Scenic highlights and local heritage"
            value={item.subtitle}
            onChange={(val) =>
              onUpdate({
                ...item,
                subtitle: val,
              })
            }
          />

          {/* Region Description */}
          <DynamicStyledField
            type="textarea"
            label="Region Description"
            fieldName={`regionExperiences.items.${idx}.description`}
            placeholder="e.g. Experience the unique character, traditions, and landscapes."
            value={item.description}
            onChange={(val) =>
              onUpdate({
                ...item,
                description: val,
              })
            }
          />
        </div>
      )}
    </div>
  )
}

export function RegionExperiencesForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const regionExperiences =
    draft?.regionExperiences ||
    (draft as any)?.data?.regionExperiences ||
    (draft as any)?.experience || {
      label: `EXPLORE ${getSafeStringValue(draft?.name, "DESTINATION").toUpperCase()}`,
      title: "Four Regions. Four Different Experiences.",
      items: [],
      backgroundMultimedia: null,
    }

  const items: RegionExperienceItemData[] = Array.isArray(regionExperiences.items)
    ? regionExperiences.items
    : []

  const isOpen = Boolean(openSections["region-experiences"])
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(0)

  // Live Location Search State
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Fetch search matches from backend GET /api/v1/locations/search (filtered to REGION)
  const { data: searchResponse, isLoading: isSearching } = useSearchLocations(
    searchQuery,
    "REGION",
    50
  )
  const rawSearchResults: LocationSearchItem[] = searchResponse?.data || []
  const searchResults = rawSearchResults.filter(
    (loc) => !loc.type || loc.type.toUpperCase() === "REGION"
  )

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

  const updateRegionExperiencesField = (fieldKey: string, value: any) => {
    updateField(`regionExperiences.${fieldKey}`, value)
  }

  const updateItems = (newItems: RegionExperienceItemData[]) => {
    updateRegionExperiencesField("items", newItems)
  }

  // Add location directly from live DB Search
  const handleAddLocationFromSearch = (loc: LocationSearchItem) => {
    if (!loc) return

    // Extract subtitle or why tags
    const subtitleText =
      getSafeStringValue((loc as any).hero?.subtitle) ||
      (Array.isArray((loc as any).why?.tags) ? (loc as any).why.tags.join(" • ") : "") ||
      getSafeStringValue((loc as any).hero?.breadcrumb) ||
      "Scenic highlights, authentic culture and traditions"

    // Extract description
    const descText =
      getSafeStringValue((loc as any).hero?.description) ||
      getSafeStringValue((loc as any).essence?.paragraphs) ||
      `Experience the unique character, heritage, and landscapes of ${loc.name}.`

    const newItem: RegionExperienceItemData = {
      id: loc.id || loc.slug,
      title: {
        value: loc.name,
        textColor: THEME_COLORS.primary,
        textOpacity: 1,
      },
      subtitle: {
        value: subtitleText,
        textColor: THEME_COLORS.accentWarm,
        textOpacity: 1,
      },
      description: {
        value: descText,
        textColor: THEME_COLORS.muted,
        textOpacity: 1,
      },
    }

    const updated = [...items, newItem]
    updateItems(updated)
    setExpandedItemIndex(updated.length - 1)
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  // Import all child region locations automatically
  const handleImportChildren = () => {
    if (!draft?.children || draft.children.length === 0) return

    const regionChildren = draft.children.filter(
      (child: any) => !child.type || child.type.toUpperCase() === "REGION"
    )
    if (regionChildren.length === 0) return

    const childItems: RegionExperienceItemData[] = regionChildren.map((child: any) => {
      const childSubtitle =
        getSafeStringValue((child as any).hero?.subtitle) ||
        (Array.isArray((child as any).why?.tags) ? (child as any).why.tags.join(" • ") : "") ||
        "Scenic highlights and local heritage"

      const childDesc =
        getSafeStringValue((child as any).hero?.description) ||
        getSafeStringValue((child as any).essence?.paragraphs) ||
        `Experience the unique character, traditions, and landscapes of ${child.name}.`

      return {
        id: child.id,
        title: {
          value: child.name,
          textColor: THEME_COLORS.primary,
          textOpacity: 1,
        },
        subtitle: {
          value: childSubtitle,
          textColor: THEME_COLORS.accentWarm,
          textOpacity: 1,
        },
        description: {
          value: childDesc,
          textColor: THEME_COLORS.muted,
          textOpacity: 1,
        },
      }
    })

    updateItems(childItems)
    setExpandedItemIndex(0)
  }

  const handleUpdateItem = (index: number, updatedItem: RegionExperienceItemData) => {
    const updated = [...items]
    updated[index] = updatedItem
    updateItems(updated)
  }

  const handleDeleteItem = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index)
    updateItems(updated)
    if (expandedItemIndex === index) {
      setExpandedItemIndex(null)
    } else if (expandedItemIndex !== null && expandedItemIndex > index) {
      setExpandedItemIndex(expandedItemIndex - 1)
    }
  }

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === items.length - 1) return

    const updated = [...items]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)
    updateItems(updated)
    setExpandedItemIndex(targetIndex)
  }

  const availableChildren = (draft as any)?.children || []

  return (
    <FormSection
      title="Region Experiences"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("region-experiences")}
    >
      <div className="flex flex-col gap-5">
        {/* 1. Eyebrow / Label */}
        <DynamicStyledField
          type="text"
          label="Eyebrow / Category Tag"
          fieldName="regionExperiences.label"
          placeholder="e.g. EXPLORE ALBANIA"
          value={regionExperiences.label}
          onChange={(val) => updateRegionExperiencesField("label", val)}
        />

        {/* 2. Section Main Title */}
        <DynamicStyledField
          type="text"
          label="Section Main Title"
          fieldName="regionExperiences.title"
          placeholder="e.g. Four Regions. Four Different Experiences."
          value={regionExperiences.title}
          onChange={(val) => updateRegionExperiencesField("title", val)}
        />

        {/* 3. Universal Multimedia / Section Background Media */}
        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="regionExperiences.backgroundMultimedia"
          imageFieldName="regionExperiencesBgImage"
          videoFieldName="regionExperiencesBgVideo"
          value={
            regionExperiences.backgroundMultimedia ||
            emptyLocation.regionExperiences?.backgroundMultimedia || {
              show: "color",
              color: {
                color: THEME_COLORS.white,
                opacity: 100,
                width: "100%",
                height: "100%",
                aspectRatio: "auto",
              },
            }
          }
          onChange={(multimedia) =>
            updateRegionExperiencesField("backgroundMultimedia", multimedia)
          }
        />

        {/* 4. Region Locations Header & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5 pt-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Region Experience Cards ({items.length})
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Search and add locations from database or import from child locations.
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

        {/* 5. Live Search Input & Popover */}
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
                className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results Popover */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 z-50 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
              {isSearching ? (
                <div className="flex items-center justify-center gap-2 p-4 text-xs text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Searching locations...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No region locations found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="space-y-0.5">
                  {searchResults.map((loc) => {
                    const isAlreadyAdded = items.some(
                      (item) => item.id === loc.id || item.id === loc.slug
                    )

                    const heroMedia =
                      (loc as any).hero?.backgroundMultimedia ||
                      (loc as any).backgroundMultimedia
                    const imgUrl =
                      heroMedia?.image?.url ||
                      (loc as any).hero?.image?.url ||
                      (loc as any).card?.background_image ||
                      ""

                    return (
                      <div
                        key={loc.id}
                        onClick={() => {
                          if (isAlreadyAdded) return
                          handleAddLocationFromSearch(loc)
                        }}
                        className={`flex items-center justify-between rounded-md p-2 text-xs transition-colors ${
                          isAlreadyAdded
                            ? "opacity-50 cursor-not-allowed bg-muted/40"
                            : "hover:bg-accent/10 hover:text-accent cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded border border-border bg-muted">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={loc.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[9px] text-muted-foreground">
                                <ImageIcon className="h-3 w-3 opacity-40" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {loc.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <span>{loc.type || "REGION"}</span>
                              {loc.parent?.name && (
                                <>
                                  <span>•</span>
                                  <span>in {loc.parent.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {isAlreadyAdded ? (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                            <Check className="h-3 w-3" /> Added
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-primary">
                            <Plus className="h-3 w-3" /> Add
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 6. List of Added Region Experience Cards */}
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
            No region experiences added yet. Search above or click &ldquo;Import Children&rdquo; to populate.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <RegionExperienceRow
                key={item.id || `reg-exp-${idx}`}
                item={item}
                idx={idx}
                isExpanded={expandedItemIndex === idx}
                onToggle={() =>
                  setExpandedItemIndex(expandedItemIndex === idx ? null : idx)
                }
                onMoveUp={() => handleMoveItem(idx, "up")}
                onMoveDown={() => handleMoveItem(idx, "down")}
                onDelete={() => handleDeleteItem(idx)}
                onUpdate={(updated) => handleUpdateItem(idx, updated)}
                isFirst={idx === 0}
                isLast={idx === items.length - 1}
                availableChildren={availableChildren}
              />
            ))}
          </div>
        )}
      </div>
    </FormSection>
  )
}

export default RegionExperiencesForm
