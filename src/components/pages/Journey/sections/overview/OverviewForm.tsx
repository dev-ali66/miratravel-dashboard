import { useState } from "react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { JourneyData } from "../../journeyTypes"
import {
  HelpCircle,
  FileText,
  CheckCircle2,
  Camera,
  Compass,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface OverviewFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function OverviewForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: OverviewFormProps) {
  const isOpen = Boolean(openSections["overview"])
  const overviewData = draft.overview || draft.data?.overview || {}

  const [openSubSection, setOpenSubSection] = useState<number | null>(0)
  const [openGallery, setOpenGallery] = useState<number | null>(0)

  const toggleSub = (index: number) => {
    setOpenSubSection(openSubSection === index ? null : index)
  }

  // --- Helpers for Part 1: Why ---
  const whyData = overviewData.why || {}
  const updateWhy = (field: string, val: any) => {
    updateField(`overview.why.${field}`, val)
  }

  // --- Helpers for Part 2: Overview ---
  const mainOvData = overviewData.overview || {}
  const updateMainOverview = (field: string, val: any) => {
    updateField(`overview.overview.${field}`, val)
  }

  // --- Helpers for Part 3: Highlights ---
  const hlData = overviewData.heighlights || overviewData.highlights || {}
  const hlList = Array.isArray(hlData.items) ? hlData.items : []

  const updateHlField = (field: string, val: any) => {
    updateField(`overview.heighlights.${field}`, val)
  }

  const addHlItem = () => {
    const newItem = {
      title: {
        value: "",
        textColor: "#464136",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    }
    updateField("overview.heighlights.items", [...hlList, newItem])
  }

  const removeHlItem = (index: number) => {
    const nextList = hlList.filter((_: any, i: number) => i !== index)
    updateField("overview.heighlights.items", nextList)
  }

  const updateHlItemTitle = (index: number, val: any) => {
    const nextList = [...hlList]
    nextList[index] = { ...nextList[index], title: val }
    updateField("overview.heighlights.items", nextList)
  }

  // --- Helpers for Part 4: Visual Story ---
  const vsData = overviewData.visualStory || overviewData.visualReference || {}
  const vsGalleryList = Array.isArray(vsData.items) ? vsData.items : []

  const updateVsField = (field: string, val: any) => {
    updateField(`overview.visualStory.${field}`, val)
  }

  const addVsImage = () => {
    const newMedia = {
      show: "image",
      color: { color: "#FFFFFF", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
      image: { url: "", alt: "Gallery Image", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
      video: { url: null, alt: "Gallery Video", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, autoplay: true, loop: true, muted: true, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
    }
    const nextList = [...vsGalleryList, newMedia]
    updateField("overview.visualStory.items", nextList)
    setOpenGallery(nextList.length - 1)
  }

  const removeVsImage = (index: number) => {
    const nextList = vsGalleryList.filter((_: any, i: number) => i !== index)
    updateField("overview.visualStory.items", nextList)
    if (openGallery === index) setOpenGallery(null)
  }

  const updateVsImage = (index: number, val: any) => {
    const nextList = [...vsGalleryList]
    nextList[index] = val
    updateField("overview.visualStory.items", nextList)
  }

  // --- Helpers for Part 5: For You ---
  const fyData = overviewData.forYou || overviewData.convince || {}
  const fyList = Array.isArray(fyData.items) ? fyData.items : []

  const updateFyField = (field: string, val: any) => {
    updateField(`overview.forYou.${field}`, val)
  }

  const addFyItem = () => {
    const newItem = {
      title: {
        value: "",
        textColor: "#464136",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    }
    updateField("overview.forYou.items", [...fyList, newItem])
  }

  const removeFyItem = (index: number) => {
    const nextList = fyList.filter((_: any, i: number) => i !== index)
    updateField("overview.forYou.items", nextList)
  }

  const updateFyItemTitle = (index: number, val: any) => {
    const nextList = [...fyList]
    nextList[index] = { ...nextList[index], title: val }
    updateField("overview.forYou.items", nextList)
  }

  return (
    <FormSection
      title="Journey Overview Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("overview")}
    >
      <div className="flex flex-col gap-4">
        {/* ========================================================================= */}
        {/* SUB-SECTION 1: WHY WE DESIGNED THIS JOURNEY                              */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
          <div
            onClick={() => toggleSub(0)}
            className="flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 cursor-pointer border-b border-border/40 transition-colors select-none"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Part 1: Why We Designed This Journey (`why`)
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                openSubSection === 0 && "rotate-180"
              )}
            />
          </div>

          {openSubSection === 0 && (
            <div className="p-4 flex flex-col gap-4 bg-background/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicStyledField
                  type="text"
                  label="Eyebrow / Badge Text"
                  fieldName="overview.why.badge"
                  placeholder="e.g. THE MIRA DIFFERENCE"
                  value={whyData.badge}
                  onChange={(val) => updateWhy("badge", val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Signature Text"
                  fieldName="overview.why.signature"
                  placeholder="e.g. MIRA"
                  value={whyData.signature}
                  onChange={(val) => updateWhy("signature", val)}
                />
              </div>

              <DynamicStyledField
                type="textarea"
                rows={2}
                label="Section Title"
                fieldName="overview.why.title"
                placeholder="e.g. Why we designed this journey?"
                value={whyData.title}
                onChange={(val) => updateWhy("title", val)}
              />

              <DynamicStyledField
                type="richtext"
                label="Description (Editorial RichText)"
                fieldName="overview.why.description"
                placeholder="Write narrative overview of why this journey was created..."
                value={whyData.description}
                onChange={(val) => updateWhy("description", val)}
              />
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SUB-SECTION 2: JOURNEY OVERVIEW                                           */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
          <div
            onClick={() => toggleSub(1)}
            className="flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 cursor-pointer border-b border-border/40 transition-colors select-none"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Part 2: Journey Overview (`overview`)
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                openSubSection === 1 && "rotate-180"
              )}
            />
          </div>

          {openSubSection === 1 && (
            <div className="p-4 flex flex-col gap-4 bg-background/50">
              <DynamicStyledField
                type="textarea"
                rows={2}
                label="Section Title"
                fieldName="overview.overview.title"
                placeholder="e.g. Journey Overview"
                value={mainOvData.title}
                onChange={(val) => updateMainOverview("title", val)}
              />

              <DynamicStyledField
                type="richtext"
                label="Description (Editorial RichText)"
                fieldName="overview.overview.description"
                placeholder="Write full summary overview narrative..."
                value={mainOvData.description}
                onChange={(val) => updateMainOverview("description", val)}
              />
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SUB-SECTION 3: HIGHLIGHTS                                                 */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
          <div
            onClick={() => toggleSub(2)}
            className="flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 cursor-pointer border-b border-border/40 transition-colors select-none"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Part 3: Highlights (`heighlights`) ({hlList.length})
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                openSubSection === 2 && "rotate-180"
              )}
            />
          </div>

          {openSubSection === 2 && (
            <div className="p-4 flex flex-col gap-4 bg-background/50">
              <DynamicStyledField
                type="textarea"
                rows={2}
                label="Highlights Section Title"
                fieldName="overview.heighlights.title"
                placeholder="e.g. Highlights"
                value={hlData.title}
                onChange={(val) => updateHlField("title", val)}
              />

              {/* Highlights Items List */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Highlight Items (`items`) ({hlList.length})
                  </label>

                  <button
                    type="button"
                    onClick={addHlItem}
                    className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Highlight
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {hlList.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2 shadow-2xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          Highlight #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeHlItem(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
                          title="Remove Highlight"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <DynamicStyledField
                        type="text"
                        label="Highlight Title / Bullet Text"
                        fieldName={`overview.heighlights.items.${idx}.title`}
                        placeholder="e.g. Private Colosseum and Roman Forum tour"
                        value={item.title}
                        onChange={(val) => updateHlItemTitle(idx, val)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SUB-SECTION 4: VISUAL REFERENCE                                           */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
          <div
            onClick={() => toggleSub(3)}
            className="flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 cursor-pointer border-b border-border/40 transition-colors select-none"
          >
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Part 4: Visual Reference (`visualStory`) ({vsGalleryList.length})
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                openSubSection === 3 && "rotate-180"
              )}
            />
          </div>

          {openSubSection === 3 && (
            <div className="p-4 flex flex-col gap-4 bg-background/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicStyledField
                  type="text"
                  label="Eyebrow / Badge Text"
                  fieldName="overview.visualStory.eyebrow"
                  placeholder="e.g. Visual Reference"
                  value={vsData.eyebrow}
                  onChange={(val) => updateVsField("eyebrow", val)}
                />

                <DynamicStyledField
                  type="textarea"
                  rows={2}
                  label="Section Title"
                  fieldName="overview.visualStory.title"
                  placeholder="e.g. Examples of the Accommodation Style"
                  value={vsData.title}
                  onChange={(val) => updateVsField("title", val)}
                />
              </div>

              <DynamicStyledField
                type="richtext"
                label="Section Description"
                fieldName="overview.visualStory.description"
                placeholder="Write visual reference narrative overview..."
                value={vsData.description}
                onChange={(val) => updateVsField("description", val)}
              />

              {/* Stacked Gallery Images List */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-primary" />
                    Gallery Images (`items`) ({vsGalleryList.length})
                  </label>

                  <button
                    type="button"
                    onClick={addVsImage}
                    className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Image
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {vsGalleryList.map((img: any, gIdx: number) => {
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
                                removeVsImage(gIdx)
                              }}
                              className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
                              title="Remove Image"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                isGalleryOpen && "rotate-180"
                              )}
                            />
                          </div>
                        </div>

                        {isGalleryOpen && (
                          <div className="p-3 space-y-3">
                            <UniversalMultimediaForm
                              value={img || { show: "image", image: { url: "" } }}
                              onChange={(val) => updateVsImage(gIdx, val)}
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

        {/* ========================================================================= */}
        {/* SUB-SECTION 5: IS THIS JOURNEY FOR YOU?                                  */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
          <div
            onClick={() => toggleSub(4)}
            className="flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 cursor-pointer border-b border-border/40 transition-colors select-none"
          >
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Part 5: Is This Journey For You? (`forYou`) ({fyList.length})
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                openSubSection === 4 && "rotate-180"
              )}
            />
          </div>

          {openSubSection === 4 && (
            <div className="p-4 flex flex-col gap-4 bg-background/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicStyledField
                  type="text"
                  label="Eyebrow / Badge Text"
                  fieldName="overview.forYou.eyebrow"
                  placeholder="e.g. Highlights"
                  value={fyData.eyebrow}
                  onChange={(val) => updateFyField("eyebrow", val)}
                />

                <DynamicStyledField
                  type="textarea"
                  rows={2}
                  label="Section Title"
                  fieldName="overview.forYou.title"
                  placeholder="e.g. Is This Journey For You?"
                  value={fyData.title}
                  onChange={(val) => updateFyField("title", val)}
                />
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-primary" />
                    Consideration Items (`items`) ({fyList.length})
                  </label>

                  <button
                    type="button"
                    onClick={addFyItem}
                    className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Item
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {fyList.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2 shadow-2xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          Item #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFyItem(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
                          title="Remove Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <DynamicStyledField
                        type="text"
                        label="Item Title / Bullet Text"
                        fieldName={`overview.forYou.items.${idx}.title`}
                        placeholder="e.g. Private Colosseum and Roman Forum tour"
                        value={item.title}
                        onChange={(val) => updateFyItemTitle(idx, val)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormSection>
  )
}
