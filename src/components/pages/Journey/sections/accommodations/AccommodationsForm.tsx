import { THEME_COLORS } from "@/config/theme"
import type { JourneyData } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { ParentLocationSelect } from "@/components/pages/Location/shared/ParentLocationSelect"
import { useDevMode } from "@/context/DevModeContext"
import { useGetLocationById } from "@/hooks/location/useGetLocationById"
import { getStr } from "../../shared/previewHelpers"
import { Plus, Trash2, Hotel, Sparkles, CheckCircle2, ChevronDown, Camera, Info, Code2 } from "lucide-react"
import { useState, useEffect, useMemo, useRef } from "react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

interface AccommodationsFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function AccommodationsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: AccommodationsFormProps) {
  const isOpen = Boolean(openSections["accommodations"])
  const accData = draft.accommodations || {}

  // 4 Child Objects
  const philData = accData.philosophy || {}
  const destData = accData.destinationStays || accData.destinations || {}
  const stdData = accData.standards || {}
  const visData = accData.visualReference || {}

  const principlesList = (Array.isArray(philData.items) && philData.items.length > 0)
    ? philData.items
    : (Array.isArray(philData.principles) && philData.principles.length > 0)
    ? philData.principles
    : []
  const staysList = destData.items || []
  const standardsList = stdData.items || []
  const visualGalleryList = visData.items || []

  // Sub-parts collapse state (default all collapsed, single active open)
  const [openParts, setOpenParts] = useState<Record<string, boolean>>({})

  // Item collapse states (single active open per section, default item 0 open)
  const [openPrinciple, setOpenPrinciple] = useState<number | null>(0)
  const [openStay, setOpenStay] = useState<number | null>(0)
  const [openGallery, setOpenGallery] = useState<number | null>(0)

  const togglePart = (key: string) => {
    setOpenParts((prev) => {
      const isCurrentlyOpen = Boolean(prev[key])
      return isCurrentlyOpen ? {} : { [key]: true }
    })
  }

  // --- Part 1 Handlers ---
  const updatePhilField = (field: string, val: any) => {
    updateField(`accommodations.philosophy.${field}`, val)
  }

  const addPrinciple = () => {
    const newPrinciple = {
      title: { value: "NEW PRINCIPLE", textColor: THEME_COLORS.dark, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "Principle card description overview...", textColor: THEME_COLORS.muted, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      iconType: "character",
      multimedia: {
        show: "image",
        image: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "contain" },
        video: { url: "", alt: "", autoplay: true, loop: true, muted: true, opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
        color: { color: THEME_COLORS.white, opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" }
      },
    }
    const nextList = [...principlesList, newPrinciple]
    updateField("accommodations.philosophy.items", nextList)
    setOpenPrinciple(nextList.length - 1)
  }

  const removePrinciple = (idx: number) => {
    const nextList = principlesList.filter((_: any, i: number) => i !== idx)
    updateField("accommodations.philosophy.items", nextList)
    if (openPrinciple === idx) {
      setOpenPrinciple(null)
    } else if (openPrinciple !== null && openPrinciple > idx) {
      setOpenPrinciple(openPrinciple - 1)
    }
  }

  const updatePrincipleField = (idx: number, field: string, val: any) => {
    updateField(`accommodations.philosophy.items.${idx}.${field}`, val)
  }

  // --- Part 2 Handlers ---
  const updateDestField = (field: string, val: any) => {
    updateField(`accommodations.destinationStays.${field}`, val)
  }

  const addStay = () => {
    const newStay = {
      locationId: "",
      locationName: { value: "", textColor: THEME_COLORS.dark, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      stayType: { value: "Boutique Hotel", textColor: THEME_COLORS.accent, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      duration: { value: "2 nights", textColor: THEME_COLORS.accent, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "Exquisite accommodations curated for comfort and panoramic views.", textColor: THEME_COLORS.muted, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      confirmationBadge: { value: "Personally confirmed by Mira", textColor: THEME_COLORS.accent, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      showMiraSeal: true,
      multimedia: {
        show: "image",
        image: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
        video: { url: "", alt: "", autoplay: true, loop: true, muted: true, opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
        color: { color: THEME_COLORS.white, opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" }
      },
    }
    const nextStays = [...staysList, newStay]
    updateField("accommodations.destinationStays.items", nextStays)
    setOpenStay(nextStays.length - 1)
  }

  const removeStay = (index: number) => {
    const nextStays = staysList.filter((_: any, i: number) => i !== index)
    updateField("accommodations.destinationStays.items", nextStays)
    if (openStay === index) {
      setOpenStay(null)
    } else if (openStay !== null && openStay > index) {
      setOpenStay(openStay - 1)
    }
  }

  const updateStayField = (index: number, subPath: string, val: any) => {
    updateField(`accommodations.destinationStays.items.${index}.${subPath}`, val)
  }

  // --- Part 3 Handlers ---
  const updateStdField = (field: string, val: any) => {
    updateField(`accommodations.standards.${field}`, val)
  }

  const addStandard = () => {
    const newStandard = {
      value: "Signature MIRA Service & Comfort",
      textColor: THEME_COLORS.navText,
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    }
    const nextStandards = [...standardsList, newStandard]
    updateField("accommodations.standards.items", nextStandards)
  }

  const removeStandard = (index: number) => {
    const nextStandards = standardsList.filter((_: any, i: number) => i !== index)
    updateField("accommodations.standards.items", nextStandards)
  }

  const updateStandardItem = (index: number, val: any) => {
    const nextStandards = [...standardsList]
    nextStandards[index] = val
    updateField("accommodations.standards.items", nextStandards)
  }

  // --- Part 4 Handlers ---
  const updateVisField = (field: string, val: any) => {
    updateField(`accommodations.visualReference.${field}`, val)
  }

  const addGalleryImage = () => {
    const newMedia = {
      show: "image",
      image: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
      video: { url: "", alt: "", autoplay: true, loop: true, muted: true, opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
      color: { color: THEME_COLORS.white, opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" }
    }
    const nextList = [...visualGalleryList, newMedia]
    updateField("accommodations.visualReference.items", nextList)
    setOpenGallery(nextList.length - 1)
  }

  const removeGalleryImage = (idx: number) => {
    const nextList = visualGalleryList.filter((_: any, i: number) => i !== idx)
    updateField("accommodations.visualReference.items", nextList)
    if (openGallery === idx) {
      setOpenGallery(null)
    } else if (openGallery !== null && openGallery > idx) {
      setOpenGallery(openGallery - 1)
    }
  }

  const updateGalleryImage = (idx: number, val: any) => {
    const nextList = [...visualGalleryList]
    nextList[idx] = val
    updateField("accommodations.visualReference.items", nextList)
  }

  return (
    <FormSection
      title="Accommodations Builder (4 Parts)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("accommodations")}
    >
      <div className="flex flex-col gap-5">

        {/* PART 1: ACCOMMODATION PHILOSOPHY */}
        <div className="rounded-md border border-border/70 bg-card overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => togglePart("part1")}
            className="flex w-full items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 border-b border-border/50 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Part 1: Accommodation Philosophy (`philosophy`)
              </span>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", openParts.part1 && "rotate-180")} />
          </button>

          {openParts.part1 && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicStyledField
                  type="text"
                  label="Eyebrow / Badge Text"
                  fieldName="accommodations.philosophy.eyebrow"
                  placeholder="e.g. Our Philosophy"
                  value={philData.eyebrow}
                  onChange={(val) => updatePhilField("eyebrow", val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Section Title"
                  fieldName="accommodations.philosophy.title"
                  placeholder="e.g. Our Accommodation Philosophy"
                  value={philData.title}
                  onChange={(val) => updatePhilField("title", val)}
                />
              </div>

              <DynamicStyledField
                type="richtext"
                label="Accommodations Description / Philosophy"
                fieldName="accommodations.philosophy.description"
                placeholder="Write section narrative overview..."
                value={philData.description}
                onChange={(val) => updatePhilField("description", val)}
              />

              {/* Philosophy Principles Items */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Philosophy Principle Cards ({principlesList.length})
                  </label>

                  <button
                    type="button"
                    onClick={addPrinciple}
                    className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Card
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {principlesList.map((item: any, pIdx: number) => {
                    const isCardOpen = openPrinciple === pIdx
                    const cardTitleText = getStr(item.title)

                    return (
                      <div
                        key={pIdx}
                        className="rounded-lg border border-border/60 bg-muted/20 overflow-hidden shadow-2xs"
                      >
                        <div
                          onClick={() => setOpenPrinciple(isCardOpen ? null : pIdx)}
                          className="flex items-center justify-between px-3 py-2.5 bg-muted/40 hover:bg-muted/60 border-b border-border/40 cursor-pointer transition-colors select-none"
                        >
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">
                            Card #{pIdx + 1}: {cardTitleText || "Untitled Card"}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                removePrinciple(pIdx)
                              }}
                              className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
                              title="Remove Card"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isCardOpen && "rotate-180")} />
                          </div>
                        </div>

                        {isCardOpen && (
                          <div className="p-3 space-y-3">
                            <DynamicStyledField
                              type="text"
                              label="Card Title"
                              fieldName={`accommodations.philosophy.items.${pIdx}.title`}
                              value={item.title}
                              onChange={(val) => updatePrincipleField(pIdx, "title", val)}
                              placeholder="e.g. Character"
                            />

                            <DynamicStyledField
                              type="textarea"
                              label="Card Description"
                              fieldName={`accommodations.philosophy.items.${pIdx}.description`}
                              value={item.description}
                              onChange={(val) => updatePrincipleField(pIdx, "description", val)}
                              placeholder="Card narrative description..."
                            />

                            <div>
                              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                Card Icon / Custom Multimedia
                              </label>
                              <UniversalMultimediaForm
                                value={item.multimedia || { show: "image", image: { url: "" } }}
                                onChange={(val) => updatePrincipleField(pIdx, "multimedia", val)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PART 2: DESTINATION BY DESTINATION STAYS */}
        <div className="rounded-md border border-border/70 bg-card overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => togglePart("part2")}
            className="flex w-full items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 border-b border-border/50 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
              <Hotel className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Part 2: Destination Stays (`destinationStays`) ({staysList.length})
              </span>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", openParts.part2 && "rotate-180")} />
          </button>

          {openParts.part2 && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicStyledField
                  type="text"
                  label="Eyebrow / Badge Text"
                  fieldName="accommodations.destinationStays.eyebrow"
                  placeholder="e.g. Destination by Destination"
                  value={destData.eyebrow}
                  onChange={(val) => updateDestField("eyebrow", val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Section Title"
                  fieldName="accommodations.destinationStays.title"
                  placeholder="e.g. Your Accommodation Journey"
                  value={destData.title}
                  onChange={(val) => {
                    updateDestField("title", val)
                    updateDestField("handpickedTitle", val)
                  }}
                />
              </div>

              <DynamicStyledField
                type="richtext"
                label="Section Description"
                fieldName="accommodations.destinationStays.description"
                placeholder="Write section narrative overview..."
                value={destData.description}
                onChange={(val) => updateDestField("description", val)}
              />

              <div className="flex items-center justify-between pb-2 border-b border-border/40 pt-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Manage destination stays and handpicked properties.
                </span>

                <button
                  type="button"
                  onClick={addStay}
                  className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Stay
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {staysList.map((stay: any, idx: number) => (
                  <StayFormItem
                    key={idx}
                    stay={stay}
                    idx={idx}
                    isOpen={openStay === idx}
                    onToggle={() => setOpenStay(openStay === idx ? null : idx)}
                    onRemove={() => removeStay(idx)}
                    updateStayField={updateStayField}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PART 3: STANDARDS / WHAT YOU CAN EXPECT */}
        <div className="rounded-md border border-border/70 bg-card overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => togglePart("part3")}
            className="flex w-full items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 border-b border-border/50 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Part 3: Standards (`standards`) ({standardsList.length})
              </span>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", openParts.part3 && "rotate-180")} />
          </button>

          {openParts.part3 && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicStyledField
                  type="text"
                  label="Eyebrow / Badge Text"
                  fieldName="accommodations.standards.eyebrow"
                  placeholder="e.g. Standards"
                  value={stdData.eyebrow}
                  onChange={(val) => updateStdField("eyebrow", val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Section Title"
                  fieldName="accommodations.standards.title"
                  placeholder="e.g. What You Can Expect"
                  value={stdData.title}
                  onChange={(val) => updateStdField("title", val)}
                />
              </div>

              <DynamicStyledField
                type="richtext"
                label="Section Description"
                fieldName="accommodations.standards.description"
                placeholder="Write standards section narrative overview..."
                value={stdData.description}
                onChange={(val) => updateStdField("description", val)}
              />

              {/* Standards / Expectations List */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Included Standards ({standardsList.length})
                  </label>

                  <button
                    type="button"
                    onClick={addStandard}
                    className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Standard
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {standardsList.map((st: any, sIdx: number) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <div className="flex-1">
                        <DynamicStyledField
                          type="text"
                          fieldName={`accommodations.standards.items.${sIdx}`}
                          value={st}
                          onChange={(val) => updateStandardItem(sIdx, val)}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeStandard(sIdx)}
                        className="text-muted-foreground hover:text-destructive p-1.5 cursor-pointer shrink-0"
                        title="Remove Standard"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PART 4: VISUAL REFERENCE & STYLE EXAMPLES */}
        <div className="rounded-md border border-border/70 bg-card overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => togglePart("part4")}
            className="flex w-full items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 border-b border-border/50 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</span>
              <Camera className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Part 4: Visual Reference (`visualReference`)
              </span>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", openParts.part4 && "rotate-180")} />
          </button>

          {openParts.part4 && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicStyledField
                  type="text"
                  label="Eyebrow / Badge Text"
                  fieldName="accommodations.visualReference.eyebrow"
                  placeholder="e.g. Visual Reference"
                  value={visData.eyebrow}
                  onChange={(val) => updateVisField("eyebrow", val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Section Title"
                  fieldName="accommodations.visualReference.title"
                  placeholder="e.g. Examples of the Accommodation Style"
                  value={visData.title}
                  onChange={(val) => updateVisField("title", val)}
                />
              </div>

              <DynamicStyledField
                type="richtext"
                label="Section Description"
                fieldName="accommodations.visualReference.description"
                placeholder="Write gallery narrative overview..."
                value={visData.description}
                onChange={(val) => updateVisField("description", val)}
              />

              {/* Stacked Gallery Images List */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-primary" />
                    Gallery Images (`items`) ({visualGalleryList.length})
                  </label>

                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Image
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {visualGalleryList.map((img: any, gIdx: number) => {
                    const isGalleryOpen = openGallery === gIdx

                    return (
                      <div
                        key={gIdx}
                        className="rounded-lg border border-border/60 bg-muted/20 overflow-hidden shadow-2xs"
                      >
                        <div
                          onClick={() => setOpenGallery(isGalleryOpen ? null : gIdx)}
                          className="flex items-center justify-between px-3 py-2.5 bg-muted/40 hover:bg-muted/60 border-b border-border/40 cursor-pointer transition-colors select-none"
                        >
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">
                            Gallery Image #{gIdx + 1}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeGalleryImage(gIdx)
                              }}
                              className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
                              title="Remove Image"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isGalleryOpen && "rotate-180")} />
                          </div>
                        </div>

                        {isGalleryOpen && (
                          <div className="p-3 space-y-3">
                            <UniversalMultimediaForm
                              value={img || { show: "image", image: { url: "" } }}
                              onChange={(val) => updateGalleryImage(gIdx, val)}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </FormSection>
  )
}

// =========================================================================
// STAY FORM ITEM COMPONENT (WITH LOCATION HERO INHERITANCE & DEV MODE OVERRIDE)
// =========================================================================
interface StayFormItemProps {
  stay: any
  idx: number
  isOpen: boolean
  onToggle: () => void
  onRemove: () => void
  updateStayField: (idx: number, fieldKey: string, value: any) => void
}

function StayFormItem({
  stay,
  idx,
  isOpen,
  onToggle,
  onRemove,
  updateStayField,
}: StayFormItemProps) {
  const { isDevMode } = useDevMode()

  // Resolve location data to inspect hero background multimedia
  const rawLocId = stay.locationId
  const resolvedLocId = (() => {
    if (!rawLocId) return undefined
    const item = Array.isArray(rawLocId) ? rawLocId[0] : rawLocId
    if (typeof item === "string") return item.trim()
    if (item && typeof item === "object") return item.id || item.value || item._id
    return undefined
  })()

  const { data: locationResponse } = useGetLocationById(resolvedLocId)
  const rawLocData = locationResponse?.data
  const locData = Array.isArray(rawLocData)
    ? rawLocData[0]
    : Array.isArray(rawLocData?.data)
    ? rawLocData.data[0]
    : rawLocData && typeof rawLocData === "object" && "name" in rawLocData
    ? rawLocData
    : null

  const locHero = locData?.hero || locData?.data?.hero || {}
  const locCard = locData?.card || locData?.data?.card || {}
  const locHeroMedia = locHero?.backgroundMultimedia || locCard?.backgroundMultimedia || locData?.hero?.backgroundMultimedia

  // Check custom override
  const customOverrideImage =
    typeof stay.multimedia?.image === "string"
      ? stay.multimedia.image
      : stay.multimedia?.image?.url ||
        (typeof stay.image === "string" ? stay.image : stay.image?.url)

  const customOverrideVideo =
    typeof stay.multimedia?.video === "string"
      ? stay.multimedia.video
      : stay.multimedia?.video?.url

  const customOverrideColor =
    typeof stay.multimedia?.color === "string"
      ? stay.multimedia.color
      : stay.multimedia?.color?.color

  const isCustomImageActive = Boolean(customOverrideImage && customOverrideImage.trim())
  const isCustomVideoActive = Boolean(customOverrideVideo && customOverrideVideo.trim())
  const isCustomColorActive = Boolean(stay.multimedia?.show === "color" && customOverrideColor)
  const hasCustomOverride = isCustomImageActive || isCustomVideoActive || isCustomColorActive

  // Check inherited location media
  const locImageUrl =
    (locHeroMedia?.image?.url && locHeroMedia.image.url.trim()) ||
    (typeof locData?.image === "string" ? locData.image.trim() : "") ||
    (typeof locHero?.background_image === "string" ? locHero.background_image.trim() : "") ||
    ""

  const locVideoUrl =
    (locHeroMedia?.video?.url && locHeroMedia.video.url.trim()) ||
    ""

  const hasInheritedMedia = Boolean(locImageUrl || locVideoUrl)

  // Track previously auto-populated location ID so changing location updates media
  const lastAutoPopulatedLocRef = useRef<string | null>(null)

  // Construct canonical inherited multimedia object with full image, video, and color from location
  // But ALWAYS default show: "image"
  const inheritedHeroMultimedia = useMemo(() => {
    if (!hasInheritedMedia) return null
    return {
      show: "image" as const,
      image: {
        url: locImageUrl,
        alt: locHeroMedia?.image?.alt || locHero?.title || locData?.name || "",
        opacity: locHeroMedia?.image?.opacity ?? 100,
        overlayColor: locHeroMedia?.image?.overlayColor ?? THEME_COLORS.overlayBlack,
        overlayOpacity: locHeroMedia?.image?.overlayOpacity ?? 0,
        width: locHeroMedia?.image?.width || "100%",
        height: locHeroMedia?.image?.height || "auto",
        aspectRatio: locHeroMedia?.image?.aspectRatio || "auto",
        fit: locHeroMedia?.image?.fit || "cover",
      },
      video: {
        url: locVideoUrl,
        alt: locHeroMedia?.video?.alt || locHero?.title || locData?.name || "",
        autoplay: locHeroMedia?.video?.autoplay ?? true,
        loop: locHeroMedia?.video?.loop ?? true,
        muted: locHeroMedia?.video?.muted ?? true,
        opacity: locHeroMedia?.video?.opacity ?? 100,
        overlayColor: locHeroMedia?.video?.overlayColor ?? THEME_COLORS.overlayBlack,
        overlayOpacity: locHeroMedia?.video?.overlayOpacity ?? 0,
        width: locHeroMedia?.video?.width || "100%",
        height: locHeroMedia?.video?.height || "auto",
        aspectRatio: locHeroMedia?.video?.aspectRatio || "auto",
        fit: locHeroMedia?.video?.fit || "cover",
      },
      color: {
        color: locHeroMedia?.color?.color || THEME_COLORS.white,
        opacity: locHeroMedia?.color?.opacity ?? 100,
        width: "100%",
        height: "100%",
        aspectRatio: "auto",
      },
    }
  }, [hasInheritedMedia, locImageUrl, locVideoUrl, locHeroMedia, locData, locHero])

  // AUTO-POPULATE: When location media is resolved and stay has no custom override,
  // automatically set stay.multimedia with the location media (defaulting to show: "image")!
  useEffect(() => {
    if (!resolvedLocId) {
      lastAutoPopulatedLocRef.current = null
      return
    }

    if (inheritedHeroMultimedia && !hasCustomOverride) {
      if (lastAutoPopulatedLocRef.current !== resolvedLocId) {
        lastAutoPopulatedLocRef.current = resolvedLocId
        updateStayField(idx, "multimedia", inheritedHeroMultimedia)
      }
    }
  }, [resolvedLocId, inheritedHeroMultimedia, hasCustomOverride, idx, updateStayField])

  // Media displayed in UniversalMultimediaForm (fallback to inherited media if stay.multimedia is empty)
  const formDisplayMedia = useMemo(() => {
    if (hasCustomOverride) {
      return stay.multimedia || {
        show: isCustomColorActive ? "color" : isCustomVideoActive ? "video" : "image",
        image: {
          url: customOverrideImage || "",
          alt: stay.multimedia?.image?.alt || "",
          opacity: 100,
          overlayColor: THEME_COLORS.overlayBlack,
          overlayOpacity: 0,
          width: "100%",
          height: "auto",
          aspectRatio: "auto",
          fit: "cover",
        },
        video: {
          url: customOverrideVideo || "",
          alt: stay.multimedia?.video?.alt || "",
          autoplay: true,
          loop: true,
          muted: true,
          opacity: 100,
          overlayColor: THEME_COLORS.overlayBlack,
          overlayOpacity: 0,
          width: "100%",
          height: "auto",
          aspectRatio: "auto",
          fit: "cover",
        },
        color: {
          color: customOverrideColor || THEME_COLORS.white,
          opacity: 100,
          width: "100%",
          height: "100%",
          aspectRatio: "auto",
        },
      }
    }

    if (inheritedHeroMultimedia) {
      return inheritedHeroMultimedia
    }

    return (
      stay.multimedia || {
        show: "image",
        image: {
          url: typeof stay.image === "string" ? stay.image : stay.image?.url || "",
          alt: "",
          opacity: 100,
          overlayColor: THEME_COLORS.overlayBlack,
          overlayOpacity: 0,
          width: "100%",
          height: "auto",
          aspectRatio: "auto",
          fit: "cover",
        },
        video: {
          url: "",
          alt: "",
          autoplay: true,
          loop: true,
          muted: true,
          opacity: 100,
          overlayColor: THEME_COLORS.overlayBlack,
          overlayOpacity: 0,
          width: "100%",
          height: "auto",
          aspectRatio: "auto",
          fit: "cover",
        },
        color: {
          color: THEME_COLORS.white,
          opacity: 100,
          width: "100%",
          height: "100%",
          aspectRatio: "auto",
        },
      }
    )
  }, [hasCustomOverride, isCustomVideoActive, customOverrideImage, customOverrideVideo, stay.multimedia, stay.image, inheritedHeroMultimedia])

  const stayTitleText =
    getStr(stay.locationName) ||
    getStr(stay.customLocationName) ||
    getStr(locData?.name) ||
    getStr(locHero?.title) ||
    (typeof stay.locationId === "string" ? stay.locationId : "") ||
    `Stay #${idx + 1}`

  return (
    <div className="rounded-md border border-border/70 bg-muted/20 overflow-hidden shadow-2xs">
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 border-b border-border/40 cursor-pointer transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary uppercase tracking-wider">
            Stay #{idx + 1}
          </span>
          <span className="text-xs font-bold text-foreground">
            {stayTitleText}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
            title="Remove Stay"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Location DB Search Picker */}
          <ParentLocationSelect
            value={stay.locationId || ""}
            currentName={getStr(stay.locationName) || stay.locationId}
            label="Location / Region (DB Search Picker)"
            noneLabel="Select Location ID..."
            onChange={(locId, locName) => {
              updateStayField(idx, "locationId", locId || "")
              if (locName) {
                // When selecting a DB location, auto-populate locationName styled object
                const prev = typeof stay.locationName === "object" && stay.locationName !== null ? stay.locationName : {}
                updateStayField(idx, "locationName", {
                  textColor: THEME_COLORS.dark,
                  textOpacity: 1,
                  backgroundColor: null,
                  backgroundOpacity: 1,
                  ...prev,
                  value: locName,
                })
              }
              // Reset the auto-populated ref so the new location's hero media populates automatically
              lastAutoPopulatedLocRef.current = null
            }}
          />

          {/* Unified Location Name Field - Pre-filled from DB location, fully editable / overridable */}
          <DynamicStyledField
            type="text"
            label="Location / City Name (Editable & Stylable)"
            fieldName={`accommodations.destinationStays.items.${idx}.locationName`}
            value={stay.locationName}
            onChange={(val) => updateStayField(idx, "locationName", val)}
            placeholder="e.g. Assos, Kefalonia"
          />

          {/* Stay Card Media Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Stay Card Image / Multimedia
              </label>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5">
                {hasCustomOverride ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Sparkles className="h-3 w-3" /> Custom Override Active
                  </span>
                ) : hasInheritedMedia ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" /> Inheriting Location Media (Default: Image)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border/60">
                    <Info className="h-3 w-3" /> Empty (Preview shows placeholder)
                  </span>
                )}
              </div>
            </div>

            {/* Explanatory Banner */}
            {!hasCustomOverride && hasInheritedMedia && (
              <div className="flex items-start gap-2 rounded-md bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/30 p-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="font-medium">
                    Automatically displaying Location media (Image default).
                  </p>
                  <p className="text-[11px] opacity-85">
                    Location media is populated below. You can freely change or replace it anytime with a custom stay image, video, or color.
                  </p>
                </div>
              </div>
            )}

            {!hasCustomOverride && !hasInheritedMedia && (
              <div className="flex items-start gap-2 rounded-md bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/30 p-2.5 text-xs text-amber-800 dark:text-amber-300">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="font-medium">
                    No Location media found.
                  </p>
                  <p className="text-[11px] opacity-85">
                    Select a location with hero media above, or upload a custom property image below to display in the stay card.
                  </p>
                </div>
              </div>
            )}

            {/* UniversalMultimediaForm - Dev Mode unlocks full Image / Video / Color switcher & advanced controls */}
            <UniversalMultimediaForm
              title={`Stay #${idx + 1} Card Media`}
              fieldName={`accommodations.destinationStays.items.${idx}.multimedia`}
              imageFieldName={`stayMediaImage_${idx}`}
              videoFieldName={`stayMediaVideo_${idx}`}
              allowImage={true}
              allowVideo={true}
              allowColor={true}
              defaultShow="image"
              defaultOpen={true}
              value={formDisplayMedia}
              onChange={(val: any) => {
                updateStayField(idx, "multimedia", val)
              }}
            />

            {/* Clear override button if custom override is set */}
            {hasCustomOverride && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    lastAutoPopulatedLocRef.current = null
                    if (inheritedHeroMultimedia) {
                      updateStayField(idx, "multimedia", inheritedHeroMultimedia)
                    } else {
                      updateStayField(idx, "multimedia", {
                        show: "image",
                        image: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
                        video: { url: "", alt: "", autoplay: true, loop: true, muted: true, opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
                        color: { color: THEME_COLORS.white, opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" }
                      })
                    }
                  }}
                  className="text-[11px] text-muted-foreground hover:text-destructive underline cursor-pointer"
                >
                  Clear custom override (revert to location hero media)
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DynamicStyledField
              type="text"
              label="Stay Duration"
              fieldName={`accommodations.destinationStays.items.${idx}.duration`}
              value={stay.duration}
              onChange={(val) => updateStayField(idx, "duration", val)}
              placeholder="e.g. 2 nights"
            />

            <DynamicStyledField
              type="text"
              label="Stay Type / Subtitle"
              fieldName={`accommodations.destinationStays.items.${idx}.stayType`}
              value={stay.stayType}
              onChange={(val) => updateStayField(idx, "stayType", val)}
              placeholder="e.g. Urban Boutique Stay"
            />
          </div>

          <DynamicStyledField
            type="richtext"
            label="Stay Narrative Description"
            fieldName={`accommodations.destinationStays.items.${idx}.description`}
            value={stay.description}
            onChange={(val) => updateStayField(idx, "description", val)}
          />

          <DynamicStyledField
            type="text"
            label="Confirmation Badge Text"
            fieldName={`accommodations.destinationStays.items.${idx}.confirmationBadge`}
            value={stay.confirmationBadge}
            onChange={(val) => updateStayField(idx, "confirmationBadge", val)}
            placeholder="e.g. Personally confirmed by Mira"
          />

          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
            <div className="space-y-0.5">
              <label
                htmlFor={`showMiraSeal-${idx}`}
                className="text-xs font-semibold text-foreground cursor-pointer"
              >
                Show MIRA Verified Seal Badge (`showMiraSeal`)
              </label>
              <p className="text-[11px] text-muted-foreground">
                Toggle to display or hide the official MIRA seal badge on this destination stay card.
              </p>
            </div>
            <Switch
              id={`showMiraSeal-${idx}`}
              checked={Boolean(stay.showMiraSeal ?? true)}
              onCheckedChange={(checked) =>
                updateStayField(idx, "showMiraSeal", checked)
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

