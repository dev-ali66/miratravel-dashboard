import { useState, useRef, useEffect } from "react"
import {
  Search,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Link as LinkIcon,
  MapPin,
  Check,
  X,
  Loader2,
} from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import type { SignatureExperienceItem } from "../../locationTypes"
import { useSearchLocations, type LocationSearchItem } from "@/hooks/location/useGetLocation"

export function SignatureExperiencesForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: LocationFormSectionProps) {
  const signatureExperiences =
    draft?.signatureExperiences ||
    (draft as any)?.data?.signatureExperiences ||
    (draft as any)?.signature_experiences ||
    (draft as any)?.data?.signature_experiences || {
      label: {
        value: "Signature Experiences",
        textColor: "#af6348",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      title: {
        value: "Five ways to fall in love with " + (draft?.name || "the destination"),
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      backgroundMultimedia: null,
      experiences: [],
    }

  const experiences: SignatureExperienceItem[] = Array.isArray(
    signatureExperiences.experiences
  )
    ? signatureExperiences.experiences
    : []

  const isOpen = Boolean(openSections["signature-experiences"])
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  // Live Location Search State (Like Region Experiences)
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

  const updateSectionField = (fieldKey: string, value: any) => {
    updateField(`signatureExperiences.${fieldKey}`, value)
  }

  const updateExperiences = (newExperiences: SignatureExperienceItem[]) => {
    updateSectionField("experiences", newExperiences)
  }

  // Add location directly from live DB Search
  const handleAddLocationFromSearch = (loc: LocationSearchItem) => {
    if (!loc) return

    // Extract description from location hero / essence
    const descText =
      (loc as any).hero?.description?.value ||
      (loc as any).hero?.description ||
      (loc as any).essence?.paragraphs?.value ||
      `Experience the unique character, heritage, and wilderness of ${loc.name}.`

    const parentSlug = loc.parent?.slug || draft?.slug || "explore"
    const nextNum = (experiences.length + 1).toString().padStart(2, "0")

    const newExp: SignatureExperienceItem = {
      id: loc.slug || loc.id,
      number: nextNum,
      title: {
        value: loc.name,
        textColor: "#182d09",
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
      href: `/destinations/${parentSlug}/${loc.slug}`,
      linkText: `Explore ${loc.name}`,
    }

    const updated = [...experiences, newExp]
    updateExperiences(updated)
    setExpandedIndex(updated.length - 1)
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  // Import all child locations automatically
  const handleImportChildren = () => {
    if (!draft?.children || draft.children.length === 0) return

    const childItems: SignatureExperienceItem[] = draft.children.map((child, idx) => {
      const num = (idx + 1).toString().padStart(2, "0")
      return {
        id: child.id || child.name.toLowerCase().replace(/\s+/g, "-"),
        number: num,
        title: {
          value: child.name,
          textColor: "#182d09",
          textOpacity: 1,
          backgroundColor: null,
          backgroundOpacity: 1,
        },
        description: {
          value: `Experience the unique character, heritage, and landscapes of ${child.name}.`,
          textColor: "#565e69",
          textOpacity: 1,
          backgroundColor: null,
          backgroundOpacity: 1,
        },
        href: `/destinations/${draft.slug || "explore"}/${child.slug || child.name.toLowerCase().replace(/\s+/g, "-")}`,
        linkText: `Explore ${child.name}`,
      }
    })

    updateExperiences(childItems)
    setExpandedIndex(0)
  }

  const handleAddExperience = () => {
    const nextIndex = experiences.length + 1
    const nextNum = nextIndex.toString().padStart(2, "0")

    const newExp: SignatureExperienceItem = {
      id: `exp-${nextNum}-${Date.now()}`,
      number: nextNum,
      title: {
        value: "",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      href: "#",
      linkText: "Explore this experience",
    }

    const updated = [...experiences, newExp]
    updateExperiences(updated)
    setExpandedIndex(updated.length - 1)
  }

  const handleRemoveExperience = (indexToRemove: number) => {
    const updated = experiences.filter((_, idx) => idx !== indexToRemove)
    // Re-index remaining item numbers
    const reindexed = updated.map((exp, idx) => ({
      ...exp,
      number: (idx + 1).toString().padStart(2, "0"),
    }))
    updateExperiences(reindexed)
    if (expandedIndex === indexToRemove) {
      setExpandedIndex(null)
    } else if (expandedIndex !== null && expandedIndex > indexToRemove) {
      setExpandedIndex(expandedIndex - 1)
    }
  }

  const handleMoveExperience = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= experiences.length) return

    const updated = [...experiences]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    // Re-index numbering
    const reindexed = updated.map((exp, idx) => ({
      ...exp,
      number: (idx + 1).toString().padStart(2, "0"),
    }))

    updateExperiences(reindexed)
    setExpandedIndex(targetIndex)
  }

  const handleUpdateItem = (
    index: number,
    fieldKey: keyof SignatureExperienceItem,
    value: any
  ) => {
    const updated = experiences.map((exp, idx) => {
      if (idx !== index) return exp
      return {
        ...exp,
        [fieldKey]: value,
      }
    })
    updateExperiences(updated)
  }

  return (
    <FormSection
      title="08. Signature Experiences"
      active={isOpen}
      onClick={() => toggleSection("signature-experiences")}
    >
      <div className="flex flex-col gap-6">
        {/* Section Header Settings */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Section Header & Description
          </h4>

          {/* Eyebrow Label */}
          <DynamicStyledField
            type="text"
            label="Eyebrow Label"
            fieldName="signatureExperiences.label"
            placeholder="e.g. Signature Experiences"
            value={signatureExperiences.label}
            onChange={(val) => updateSectionField("label", val)}
          />

          {/* Main Title Heading */}
          <DynamicStyledField
            type="text"
            label="Main Section Title"
            fieldName="signatureExperiences.title"
            placeholder="e.g. Five ways to fall in love with Albania"
            value={signatureExperiences.title}
            onChange={(val) => updateSectionField("title", val)}
          />

          {/* Subtitle / Narrative Description */}
          <DynamicStyledField
            type="textarea"
            label="Narrative Description"
            fieldName="signatureExperiences.description"
            placeholder="e.g. Discover curated authentic journeys and signature regional experiences..."
            value={signatureExperiences.description}
            onChange={(val) => updateSectionField("description", val)}
          />
        </div>

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Media (Image / Video / Color)"
          fieldName="signatureExperiences.backgroundMultimedia"
          imageFieldName="locationSignatureExpBgImage"
          videoFieldName="locationSignatureExpBgVideo"
          hideFieldNameBadge={true}
          value={signatureExperiences.backgroundMultimedia}
          onChange={(multimedia) =>
            updateSectionField("backgroundMultimedia", multimedia)
          }
        />

        {/* Experiences Repeater List with Live Location Search & Child Import */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Signature Experiences List ({experiences.length})
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Search & import locations or add custom signature experiences.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Import Children Button */}
              {draft?.children && draft.children.length > 0 && (
                <button
                  type="button"
                  onClick={handleImportChildren}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                  title="Import child destinations from database"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Import Children ({draft.children.length})
                </button>
              )}

              {/* Add Custom Button */}
              <button
                type="button"
                onClick={handleAddExperience}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Custom
              </button>
            </div>
          </div>

          {/* Location Search Bar / Dropdown (Like in Region Experiences) */}
          <div ref={searchContainerRef} className="relative w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchOpen(true)
                }}
                placeholder="Search database to add location as signature experience..."
                className="w-full rounded-lg border border-border bg-background/80 pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Results Popover Dropdown */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-popover/95 p-1 shadow-lg backdrop-blur-md">
                {isSearching ? (
                  <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                    Searching destinations...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    No locations matching "{searchQuery}"
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {searchResults.map((loc) => {
                      const isAlreadyAdded = experiences.some(
                        (e) => (e.id || "").toLowerCase() === (loc.slug || loc.id || "").toLowerCase()
                      )

                      return (
                        <button
                          key={loc.id}
                          type="button"
                          disabled={isAlreadyAdded}
                          onClick={() => handleAddLocationFromSearch(loc)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                            isAlreadyAdded
                              ? "opacity-50 cursor-not-allowed bg-muted/40"
                              : "hover:bg-accent/60 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {loc.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {loc.parent?.name ? `${loc.parent.name} • ` : ""}
                                {loc.type}
                              </p>
                            </div>
                          </div>

                          {isAlreadyAdded ? (
                            <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              <Check className="h-3 w-3" /> Added
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              <Plus className="h-3 w-3" /> Add
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

          {experiences.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                No signature experiences added yet
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1 mb-4">
                Use the search box above to import locations, or click Add Custom.
              </p>
              <div className="flex items-center justify-center gap-2">
                {draft?.children && draft.children.length > 0 && (
                  <button
                    type="button"
                    onClick={handleImportChildren}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Import Child Destinations ({draft.children.length})
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Custom Experience
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {experiences.map((exp, index) => {
                const isItemOpen = expandedIndex === index
                const expTitle =
                  typeof exp.title === "object"
                    ? (exp.title as any)?.value || ""
                    : exp.title || ""

                return (
                  <div
                    key={exp.id || `exp-${index}`}
                    className={`rounded-xl border transition-all duration-200 ${
                      isItemOpen
                        ? "border-primary/50 bg-card shadow-sm"
                        : "border-border/70 bg-card/60 hover:border-border"
                    }`}
                  >
                    {/* Item Header / Accordion Bar */}
                    <div className="flex items-center justify-between p-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedIndex(isItemOpen ? null : index)
                        }
                        className="flex flex-1 items-center gap-3 text-left overflow-hidden group cursor-pointer"
                      >
                        {/* Number Badge */}
                        <span className="flex h-6 w-7 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-mono font-semibold text-primary">
                          {exp.number || String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Title Snippet */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                            {expTitle || "Untitled Experience"}
                          </p>
                        </div>
                      </button>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveExperience(index, "up")}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === experiences.length - 1}
                          onClick={() => handleMoveExperience(index, "down")}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(index)}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-1 cursor-pointer"
                          title="Delete experience"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedIndex(isItemOpen ? null : index)
                          }
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ml-1 cursor-pointer"
                        >
                          {isItemOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Item Form Body */}
                    {isItemOpen && (
                      <div className="border-t border-border/60 p-4 space-y-4 bg-muted/5 rounded-b-xl">
                        {/* Number Input */}
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">
                            Sequence Number
                          </label>
                          <input
                            type="text"
                            value={exp.number || ""}
                            onChange={(e) =>
                              handleUpdateItem(index, "number", e.target.value)
                            }
                            placeholder="01"
                            className="w-full max-w-[120px] rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                          />
                        </div>

                        {/* Experience Title */}
                        <DynamicStyledField
                          type="text"
                          label="Experience Title / Heading"
                          fieldName={`signatureExperiences.experiences.${index}.title`}
                          placeholder="e.g. Hike the Albanian Alps"
                          value={exp.title}
                          onChange={(val) =>
                            handleUpdateItem(index, "title", val)
                          }
                        />

                        {/* Experience Description */}
                        <DynamicStyledField
                          type="textarea"
                          label="Experience Description"
                          fieldName={`signatureExperiences.experiences.${index}.description`}
                          placeholder="e.g. Trek through dramatic limestone peaks, pristine mountain passes..."
                          value={exp.description}
                          onChange={(val) =>
                            handleUpdateItem(index, "description", val)
                          }
                        />

                        {/* Link & Action Text Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                              <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              Action Link URL
                            </label>
                            <input
                              type="text"
                              value={exp.href || ""}
                              onChange={(e) =>
                                handleUpdateItem(index, "href", e.target.value)
                              }
                              placeholder="/destinations/albania/albanian-alps"
                              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">
                              Action Button / Link Text
                            </label>
                            <input
                              type="text"
                              value={exp.linkText || ""}
                              onChange={(e) =>
                                handleUpdateItem(
                                  index,
                                  "linkText",
                                  e.target.value
                                )
                              }
                              placeholder="Explore this experience"
                              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </FormSection>
  )
}
