import type { JourneyData } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { ParentLocationSelect } from "@/components/pages/Location/shared/ParentLocationSelect"
import { Plus, Trash2, Hotel, Sparkles, CheckCircle2, ChevronDown, Camera } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

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

  const principlesList = philData.items || []
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
      title: { value: "NEW PRINCIPLE", textColor: "#080c1d", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "Principle card description overview...", textColor: "#565e69", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      iconType: "character",
      multimedia: { show: "image", image: { url: "" } },
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
      stayType: { value: "Boutique Hotel", textColor: "#af6348", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      duration: { value: "2 nights", textColor: "#af6348", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "Exquisite accommodations curated for comfort and panoramic views.", textColor: "#565e69", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      confirmationBadge: { value: "Personally confirmed by Mira", textColor: "#af6348", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      showMiraSeal: true,
      multimedia: { show: "image", image: { url: "" } },
      amenities: [],
    }
    const nextStays = [...staysList, newStay]
    updateField("accommodations.destinationStays.items", nextStays)
    updateField("accommodations.items", nextStays)
    setOpenStay(nextStays.length - 1)
  }

  const removeStay = (index: number) => {
    const nextStays = staysList.filter((_: any, i: number) => i !== index)
    updateField("accommodations.destinationStays.items", nextStays)
    updateField("accommodations.items", nextStays)
    if (openStay === index) {
      setOpenStay(null)
    } else if (openStay !== null && openStay > index) {
      setOpenStay(openStay - 1)
    }
  }

  const updateStayField = (index: number, subPath: string, val: any) => {
    updateField(`accommodations.destinationStays.items.${index}.${subPath}`, val)
    updateField(`accommodations.items.${index}.${subPath}`, val)
  }

  // --- Part 3 Handlers ---
  const updateStdField = (field: string, val: any) => {
    updateField(`accommodations.standards.${field}`, val)
  }

  const addStandard = () => {
    const newStandard = {
      value: "Signature MIRA Service & Comfort",
      textColor: "#464136",
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
    const newMedia = { show: "image", image: { url: "", alt: "" } }
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
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
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
                    const cardTitleText = typeof item.title === "object" ? item.title?.value : item.title

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
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
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
                {staysList.map((stay: any, idx: number) => {
                  const isStayOpen = openStay === idx
                  const stayTitleText = stay.locationName || stay.locationId || `Select Location`

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/70 bg-muted/20 overflow-hidden shadow-2xs"
                    >
                      <div
                        onClick={() => setOpenStay(isStayOpen ? null : idx)}
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
                              removeStay(idx)
                            }}
                            className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
                            title="Remove Stay"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isStayOpen && "rotate-180")} />
                        </div>
                      </div>

                      {isStayOpen && (
                        <div className="p-4 space-y-4">
                          {/* Location DB Search Picker */}
                          <ParentLocationSelect
                            value={stay.locationId || ""}
                            currentName={stay.locationName || stay.locationId}
                            label="Location / Region (DB Search Picker)"
                            noneLabel="Select Location ID..."
                            onChange={(locId, locName) => {
                              updateStayField(idx, "locationId", locId || "")
                              if (locName) {
                                updateStayField(idx, "locationName", locName)
                              }
                            }}
                          />

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
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* PART 3: STANDARDS / WHAT YOU CAN EXPECT */}
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
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
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
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
