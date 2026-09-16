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
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import type { RegionExperienceItemData } from "../../locationTypes"
import { useSearchLocations, type LocationSearchItem } from "@/hooks/location/useGetLocation"
import { emptyLocation } from "../../shared/emptyLocation"

export function RegionExperiencesForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: LocationFormSectionProps) {
  const regionExperiences =
    draft?.regionExperiences ||
    (draft as any)?.data?.regionExperiences ||
    (draft as any)?.experience || {
      label: "EXPLORE ALBANIA",
      title: "Four Regions. Four Different Experiences.",
      items: [],
      backgroundMultimedia: null,
    }

  const items: RegionExperienceItemData[] = Array.isArray(regionExperiences.items)
    ? regionExperiences.items
    : []

  const isOpen = Boolean(openSections["region-experiences"])
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(0)

  // Live Location Search State (Like in Highlights)
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
      (loc as any).hero?.subtitle?.value ||
      (loc as any).hero?.subtitle ||
      (Array.isArray((loc as any).why?.tags) ? (loc as any).why.tags.join(" • ") : "") ||
      (loc as any).hero?.breadcrumb?.value ||
      "Scenic highlights, authentic culture and traditions"

    // Extract description
    const descText =
      (loc as any).hero?.description?.value ||
      (loc as any).hero?.description ||
      (loc as any).essence?.paragraphs?.value ||
      `Explore the unique character, heritage, and landscapes of ${loc.name}.`

    const newItem: RegionExperienceItemData = {
      id: loc.id || loc.slug,
      title: {
        value: loc.name,
        textColor: "#182d09",
        textOpacity: 1,
      },
      subtitle: {
        value: subtitleText,
        textColor: "#9c705d",
        textOpacity: 1,
      },
      description: {
        value: descText,
        textColor: "#565e69",
        textOpacity: 1,
      },
      imageMultimedia: {
        show: "image",
        image: {
          url: "",
          alt: loc.name,
          opacity: 100,
          overlayColor: "#000000",
          overlayOpacity: 0,
          width: "100%",
          height: "100%",
          aspectRatio: "auto",
          fit: "cover",
        },
      },
      tag: {
        value: loc.type || "REGION",
        textColor: "#9c705d",
        textOpacity: 1,
      },
      buttons: [
        {
          label: `Explore ${loc.name}`,
          url: `/destinations/${loc.slug || loc.id}`,
          style: "primary",
          variant: "PRIMARY",
          textColor: "#ffffff",
          backgroundColor: "#af6348",
        },
      ],
    }

    const updated = [...items, newItem]
    updateItems(updated)
    setExpandedItemIndex(updated.length - 1)
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  // Import all child locations automatically
  const handleImportChildren = () => {
    if (!draft?.children || draft.children.length === 0) return

    const childItems: RegionExperienceItemData[] = draft.children.map((child) => {
      return {
        id: child.id,
        title: {
          value: child.name,
          textColor: "#182d09",
          textOpacity: 1,
        },
        subtitle: {
          value: "Scenic highlights and local heritage",
          textColor: "#9c705d",
          textOpacity: 1,
        },
        description: {
          value: `Experience the unique character, traditions, and landscapes of ${child.name}.`,
          textColor: "#565e69",
          textOpacity: 1,
        },
        imageMultimedia: {
          show: "image",
          image: {
            url: "",
            alt: child.name,
            opacity: 100,
            overlayColor: "#000000",
            overlayOpacity: 0,
            width: "100%",
            height: "100%",
            aspectRatio: "auto",
            fit: "cover",
          },
        },
        tag: {
          value: child.type || "REGION",
          textColor: "#9c705d",
          textOpacity: 1,
        },
        buttons: [
          {
            label: `Explore ${child.name}`,
            url: `/destinations/${child.name.toLowerCase().replace(/\s+/g, "-")}`,
            style: "primary",
            variant: "PRIMARY",
            textColor: "#ffffff",
            backgroundColor: "#af6348",
          },
        ],
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

  return (
    <FormSection
      title="05. Region Experiences"
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


        {/* 4. Universal Multimedia / Section Background Media */}
        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="regionExperiences.backgroundMultimedia"
          imageFieldName="regionExperiencesBgImage"
          videoFieldName="regionExperiencesBgVideo"
          value={
            regionExperiences.backgroundMultimedia ||
            emptyLocation.regionExperiences?.backgroundMultimedia ||
            null
          }
          onChange={(multimedia) =>
            updateRegionExperiencesField("backgroundMultimedia", multimedia)
          }
        />

        {/* 5. Region Locations Header & Actions */}
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

        {/* 6. Live Search Input & Popover (Highlights Sequence) */}
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
                    const isAlreadyAdded = items.some(
                      (it) => it.id === loc.id || it.id === loc.slug
                    )
                    const heroMedia = (loc as any).hero?.backgroundMultimedia
                    const thumbUrl =
                      heroMedia?.image?.url ||
                      (loc as any).hero?.image?.url ||
                      (loc as any).card?.background_image ||
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

        {/* 7. Region Cards List */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-xs font-medium text-muted-foreground">
              No region cards added yet.
            </p>
            <p className="text-[11px] text-muted-foreground/80 mt-1 max-w-xs">
              Search locations in the search box above or click &quot;Import Children&quot; to add regions.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => {
              const isExpanded = expandedItemIndex === idx
              const itemTitle =
                typeof item.title === "object"
                  ? item.title?.value || `Region ${idx + 1}`
                  : item.title || `Region ${idx + 1}`
              const itemSubtitle =
                typeof item.subtitle === "object"
                  ? item.subtitle?.value || ""
                  : item.subtitle || ""
              const itemTag =
                typeof item.tag === "object"
                  ? (item.tag as any)?.value || ""
                  : typeof item.tag === "string"
                  ? item.tag
                  : ""

              const previewImg =
                item.imageMultimedia?.image?.url || ""

              return (
                <div
                  key={item.id || idx}
                  className="rounded-xl border border-border/70 bg-card overflow-hidden transition-all shadow-2xs"
                >
                  {/* Item Header Bar */}
                  <div
                    onClick={() =>
                      setExpandedItemIndex(isExpanded ? null : idx)
                    }
                    className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
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
                            alt={itemTitle}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[9px] text-muted-foreground">
                            No media
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {itemTitle}
                          </p>
                          {itemTag && itemTag.trim() && (
                            <span className="shrink-0 rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[9px] font-semibold text-primary uppercase">
                              {itemTag}
                            </span>
                          )}
                        </div>
                        {itemSubtitle && (
                          <p className="text-[11px] text-muted-foreground italic truncate">
                            {itemSubtitle}
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
                        disabled={idx === items.length - 1}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Move down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(idx)}
                        className="rounded p-1 text-destructive/80 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        title="Delete region"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Fields */}
                  {isExpanded && (
                    <div className="p-4 border-t border-border/50 space-y-4 bg-card">
                      {/* Tag / Category Badge */}
                      <DynamicStyledField
                        type="text"
                        label="Tag / Category Badge"
                        fieldName={`regionExperiences.items.${idx}.tag`}
                        placeholder="e.g. REGION"
                        value={item.tag}
                        onChange={(val) =>
                          handleUpdateItem(idx, {
                            ...item,
                            tag: val,
                          })
                        }
                      />

                      {/* Region Title */}
                      <DynamicStyledField
                        type="text"
                        label="Region Title"
                        fieldName={`regionExperiences.items.${idx}.title`}
                        placeholder="e.g. North Albania"
                        value={item.title}
                        onChange={(val) =>
                          handleUpdateItem(idx, {
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
                        placeholder="e.g. Mountain adventures and authentic traditions"
                        value={item.subtitle}
                        onChange={(val) =>
                          handleUpdateItem(idx, {
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
                        placeholder="e.g. Soaring peaks, ancient highland clans, and trails that wind through Europe's dramatic scenery."
                        value={item.description}
                        onChange={(val) =>
                          handleUpdateItem(idx, {
                            ...item,
                            description: val,
                          })
                        }
                      />

                      {/* Region Showcase Media */}
                      <UniversalMultimediaForm
                        title="Region Featured Media"
                        fieldName={`regionExperiences.items.${idx}.imageMultimedia`}
                        imageFieldName={`regionImg_${idx}`}
                        videoFieldName={`regionVid_${idx}`}
                        value={item.imageMultimedia}
                        onChange={(multimedia) =>
                          handleUpdateItem(idx, {
                            ...item,
                            imageMultimedia: multimedia,
                          })
                        }
                      />

                      {/* Dynamic CTA Button / Action Link (Hero Button Style) */}
                      <div className="rounded-lg border border-border/70 bg-card p-3.5">
                        <ButtonsField
                          label="Region Action Buttons (Hero Style)"
                          fieldName={`regionExperiences.items.${idx}.buttons`}
                          buttons={
                            Array.isArray(item.buttons) && item.buttons.length > 0
                              ? item.buttons
                              : item.button
                              ? [item.button]
                              : [
                                  {
                                    label: `Explore ${itemTitle}`,
                                    url: `/destinations/${item.id}`,
                                    style: "primary",
                                    variant: "PRIMARY",
                                    textColor: "#ffffff",
                                    backgroundColor: "#af6348",
                                  },
                                ]
                          }
                          onChange={(buttons) => {
                            const updated = { ...item }
                            delete (updated as any).button
                            delete (updated as any).buttonText
                            delete (updated as any).buttonUrl
                            updated.buttons = buttons
                            handleUpdateItem(idx, updated)
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </FormSection>
  )
}
