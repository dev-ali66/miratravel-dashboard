/* =====================================================
   JOURNEYS — ACCOMMODATION (WHERE YOU STAY) FORM SECTION
   Reflects Prisma field: data.accommodation
===================================================== */

import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Building2,
  ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FormSection,
  DynamicStyledField,
  UniversalMultimediaForm,
} from "../../shared/fields"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { type Journey } from "../../journeyTypes"

export type AccommodationFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function AccommodationForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: AccommodationFormProps) {
  // Main accommodation data block
  const accData = draft.data?.accommodation || {}

  const syncState = (patch: Partial<typeof accData>) => {
    updateField("data.accommodation", {
      ...accData,
      ...patch,
    })
  }

  // Which of the 4 main collapsible parts is open?
  const [expandedMainSection, setExpandedMainSection] = useState<string | null>("philosophy")

  // For dynamic lists inside the sections
  const [expandedPhilosophyItem, setExpandedPhilosophyItem] = useState<number | null>(0)
  const [expandedAccommodationItem, setExpandedAccommodationItem] = useState<number | null>(0)

  // --- PHILOSOPHY SECTION ---
  const philSec = accData.philosophySection || {}
  const philItems = philSec.items || []

  const handleUpdatePhilHeader = (field: string, val: any) => {
    syncState({
      philosophySection: {
        ...philSec,
        [field]: val,
      },
    })
  }

  const handleAddPhilItem = () => {
    const next = [...philItems, {}]
    syncState({ philosophySection: { ...philSec, items: next } })
    setExpandedPhilosophyItem(next.length - 1)
  }

  const handleUpdatePhilItem = (idx: number, patch: any) => {
    const next = [...philItems]
    next[idx] = { ...next[idx], ...patch }
    syncState({ philosophySection: { ...philSec, items: next } })
  }

  const handleRemovePhilItem = (idx: number) => {
    const next = philItems.filter((_, i) => i !== idx)
    syncState({ philosophySection: { ...philSec, items: next } })
    if (expandedPhilosophyItem === idx) setExpandedPhilosophyItem(null)
  }

  // --- ACCOMMODATION SECTION ---
  const accSec = accData.accommodationSection || {}
  const accItems = accSec.items || []

  const handleUpdateAccHeader = (field: string, val: any) => {
    syncState({
      accommodationSection: {
        ...accSec,
        [field]: val,
      },
    })
  }

  const handleAddAccItem = () => {
    const next = [...accItems, {}]
    syncState({ accommodationSection: { ...accSec, items: next } })
    setExpandedAccommodationItem(next.length - 1)
  }

  const handleUpdateAccItem = (idx: number, patch: any) => {
    const next = [...accItems]
    next[idx] = { ...next[idx], ...patch }
    syncState({ accommodationSection: { ...accSec, items: next } })
  }

  const handleRemoveAccItem = (idx: number) => {
    const next = accItems.filter((_, i) => i !== idx)
    syncState({ accommodationSection: { ...accSec, items: next } })
    if (expandedAccommodationItem === idx) setExpandedAccommodationItem(null)
  }

  // --- STANDARDS SECTION ---
  const stdSec = accData.standardsSection || {}
  const stdItems = stdSec.items || []

  const handleUpdateStdHeader = (field: string, val: any) => {
    syncState({
      standardsSection: {
        ...stdSec,
        [field]: val,
      },
    })
  }

  const handleAddStdItem = () => {
    const next = [...stdItems, {}]
    syncState({ standardsSection: { ...stdSec, items: next } })
  }

  const handleUpdateStdItem = (idx: number, patch: any) => {
    const next = [...stdItems]
    next[idx] = { ...next[idx], ...patch }
    syncState({ standardsSection: { ...stdSec, items: next } })
  }

  const handleRemoveStdItem = (idx: number) => {
    const next = stdItems.filter((_, i) => i !== idx)
    syncState({ standardsSection: { ...stdSec, items: next } })
  }

  // --- VISUALS SECTION ---
  const visSec = accData.visualsSection || {}
  const visMedia = visSec.mediaItems || []

  const handleUpdateVisHeader = (field: string, val: any) => {
    syncState({
      visualsSection: {
        ...visSec,
        [field]: val,
      },
    })
  }

  const handleAddVisMedia = () => {
    const next = [...visMedia, { type: "image", url: "" }]
    syncState({ visualsSection: { ...visSec, mediaItems: next } })
  }

  const handleUpdateVisMedia = (idx: number, patch: any) => {
    const next = [...visMedia]
    next[idx] = { ...next[idx], ...patch }
    syncState({ visualsSection: { ...visSec, mediaItems: next } })
  }

  const handleRemoveVisMedia = (idx: number) => {
    const next = visMedia.filter((_, i) => i !== idx)
    syncState({ visualsSection: { ...visSec, mediaItems: next } })
  }

  const ToggleIcon = ({ expanded }: { expanded: boolean }) =>
    expanded ? (
      <ChevronUp className="h-4 w-4 text-muted-foreground" />
    ) : (
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    )

  return (
    <FormSection
      title="Accommodation"
      active={!!openSections["accommodation"]}
      onClick={() => toggleSection("accommodation")}
    >
      <div className="space-y-6">
        {/* ================= BACKGROUND ================= */}
        <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-sm">
          <p className="text-sm font-semibold">Accommodation Background</p>
          <UniversalMultimediaForm
            section={accData as any}
            content={accData as any}
            updateSection={(patch) => syncState(patch)}
            updateSectionContent={(patch) => syncState(patch)}
            contentMediaKey="backgroundMultimedia"
            backgroundType={accData?.backgroundMultimedia?.type ?? "color"}
            backgroundTypeStyleKey="accommodationBgType"
            sectionTitle="Accommodation Background"
            showColorPicker
            colorLabel="Background color"
            defaultColor="#FFFFFF"
            imageTitle="Background Image"
            imageLabel="Background image"
            imageFieldName="acc_bg_img"
            videoTitle="Background Video"
            videoLabel="Background video"
            videoFieldName="acc_bg_vid"
            showImageAltField
            showVideoSwitches
          />
        </div>

        <div className="space-y-4">
          {/* ================= 1. OUR PHILOSOPHY ================= */}
          <div className="rounded-xl border border-border/70 bg-background overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() =>
                setExpandedMainSection(
                  expandedMainSection === "philosophy" ? null : "philosophy"
                )
              }
            >
              <h3 className="text-sm font-semibold">1. Our Philosophy</h3>
              <ToggleIcon expanded={expandedMainSection === "philosophy"} />
            </div>
            {expandedMainSection === "philosophy" && (
              <div className="p-4 border-t border-border/50 space-y-5 bg-muted/10">
                <div className="space-y-3">
                  <DynamicStyledField
                    type="text"
                    label="Eyebrow"
                    value={philSec.eyebrow?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdatePhilHeader("eyebrow", { ...philSec.eyebrow, text: val })
                    }
                    enableStyle
                    style={philSec.eyebrow?.style}
                    onStyleChange={(style) =>
                      handleUpdatePhilHeader("eyebrow", { ...philSec.eyebrow, style })
                    }
                  />
                  <DynamicStyledField
                    type="text"
                    label="Title"
                    value={philSec.title?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdatePhilHeader("title", { ...philSec.title, text: val })
                    }
                    enableStyle
                    style={philSec.title?.style}
                    onStyleChange={(style) =>
                      handleUpdatePhilHeader("title", { ...philSec.title, style })
                    }
                  />
                  <DynamicStyledField
                    type="textarea"
                    label="Description"
                    value={philSec.description?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdatePhilHeader("description", { ...philSec.description, text: val })
                    }
                    enableStyle
                    style={philSec.description?.style}
                    onStyleChange={(style) =>
                      handleUpdatePhilHeader("description", { ...philSec.description, style })
                    }
                  />
                </div>

                {/* Phil Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">
                      Philosophy Items ({philItems.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPhilItem}
                      className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Philosophy
                    </button>
                  </div>

                  <div className="space-y-3">
                    {philItems.map((item: any, idx: number) => {
                      const isExpanded = expandedPhilosophyItem === idx
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "rounded-lg border border-border/70 bg-background transition-all",
                            isExpanded ? "shadow-sm ring-1 ring-primary/20" : ""
                          )}
                        >
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30"
                            onClick={() =>
                              setExpandedPhilosophyItem(isExpanded ? null : idx)
                            }
                          >
                            <span className="text-xs font-semibold">
                              {item.title?.text || `Item #${idx + 1}`}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemovePhilItem(idx)
                                }}
                                className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                              <ToggleIcon expanded={isExpanded} />
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="p-4 border-t border-border/50 space-y-4">
                              <DynamicStyledField
                                type="text"
                                label="Item Title"
                                value={item.title?.text ?? ""}
                                onChange={(val: string) =>
                                  handleUpdatePhilItem(idx, {
                                    title: { ...item.title, text: val },
                                  })
                                }
                                enableStyle
                                style={item.title?.style}
                                onStyleChange={(style) =>
                                  handleUpdatePhilItem(idx, {
                                    title: { ...item.title, style },
                                  })
                                }
                              />
                              <DynamicStyledField
                                type="textarea"
                                label="Item Description"
                                value={item.description?.text ?? ""}
                                onChange={(val: string) =>
                                  handleUpdatePhilItem(idx, {
                                    description: { ...item.description, text: val },
                                  })
                                }
                                enableStyle
                                style={item.description?.style}
                                onStyleChange={(style) =>
                                  handleUpdatePhilItem(idx, {
                                    description: { ...item.description, style },
                                  })
                                }
                              />
                              <div className="rounded-md border border-border/50 p-3 bg-card">
                                <UniversalMultimediaForm
                                  section={item as any}
                                  content={item as any}
                                  updateSection={(patch) => handleUpdatePhilItem(idx, patch)}
                                  updateSectionContent={(patch) => handleUpdatePhilItem(idx, patch)}
                                  contentMediaKey="iconMultimedia"
                                  backgroundType={item.iconMultimedia?.type ?? "image"}
                                  sectionTitle="Icon"
                                  showColorPicker={false}
                                  imageTitle="Item Icon"
                                  imageLabel="Upload Icon"
                                  imageFieldName={`phil_icon_${idx}`}
                                  showImageAltField
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

          {/* ================= 2. ACCOMMODATION ================= */}
          <div className="rounded-xl border border-border/70 bg-background overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() =>
                setExpandedMainSection(
                  expandedMainSection === "accommodation" ? null : "accommodation"
                )
              }
            >
              <h3 className="text-sm font-semibold">2. Accommodation</h3>
              <ToggleIcon expanded={expandedMainSection === "accommodation"} />
            </div>
            {expandedMainSection === "accommodation" && (
              <div className="p-4 border-t border-border/50 space-y-5 bg-muted/10">
                <div className="space-y-3">
                  <DynamicStyledField
                    type="text"
                    label="Eyebrow"
                    value={accSec.eyebrow?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdateAccHeader("eyebrow", { ...accSec.eyebrow, text: val })
                    }
                    enableStyle
                    style={accSec.eyebrow?.style}
                    onStyleChange={(style) =>
                      handleUpdateAccHeader("eyebrow", { ...accSec.eyebrow, style })
                    }
                  />
                  <DynamicStyledField
                    type="text"
                    label="Title"
                    value={accSec.title?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdateAccHeader("title", { ...accSec.title, text: val })
                    }
                    enableStyle
                    style={accSec.title?.style}
                    onStyleChange={(style) =>
                      handleUpdateAccHeader("title", { ...accSec.title, style })
                    }
                  />
                  <DynamicStyledField
                    type="textarea"
                    label="Description"
                    value={accSec.description?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdateAccHeader("description", { ...accSec.description, text: val })
                    }
                    enableStyle
                    style={accSec.description?.style}
                    onStyleChange={(style) =>
                      handleUpdateAccHeader("description", { ...accSec.description, style })
                    }
                  />
                </div>

                {/* Acc Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">
                      Accommodation Cards ({accItems.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddAccItem}
                      className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Accommodation
                    </button>
                  </div>

                  <div className="space-y-3">
                    {accItems.map((item: any, idx: number) => {
                      const isExpanded = expandedAccommodationItem === idx
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "rounded-lg border border-border/70 bg-background transition-all",
                            isExpanded ? "shadow-sm ring-1 ring-primary/20" : ""
                          )}
                        >
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30"
                            onClick={() =>
                              setExpandedAccommodationItem(isExpanded ? null : idx)
                            }
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-primary" />
                              <span className="text-xs font-semibold">
                                {item.hotelName?.text || `Card #${idx + 1}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveAccItem(idx)
                                }}
                                className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                              <ToggleIcon expanded={isExpanded} />
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="p-4 border-t border-border/50 space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <DynamicStyledField
                                  type="text"
                                  label="Hotel / Lodge Name"
                                  value={item.hotelName?.text ?? ""}
                                  onChange={(val: string) =>
                                    handleUpdateAccItem(idx, {
                                      hotelName: { ...item.hotelName, text: val },
                                    })
                                  }
                                  enableStyle
                                  style={item.hotelName?.style}
                                  onStyleChange={(style) =>
                                    handleUpdateAccItem(idx, {
                                      hotelName: { ...item.hotelName, style },
                                    })
                                  }
                                />
                                <DynamicStyledField
                                  type="text"
                                  label="Location"
                                  value={item.location?.text ?? ""}
                                  onChange={(val: string) =>
                                    handleUpdateAccItem(idx, {
                                      location: { ...item.location, text: val },
                                    })
                                  }
                                  enableStyle
                                  style={item.location?.style}
                                  onStyleChange={(style) =>
                                    handleUpdateAccItem(idx, {
                                      location: { ...item.location, style },
                                    })
                                  }
                                />
                                <DynamicStyledField
                                  type="text"
                                  label="Nights"
                                  value={item.nights?.text ?? ""}
                                  onChange={(val: string) =>
                                    handleUpdateAccItem(idx, {
                                      nights: { ...item.nights, text: val },
                                    })
                                  }
                                  enableStyle
                                  style={item.nights?.style}
                                  onStyleChange={(style) =>
                                    handleUpdateAccItem(idx, {
                                      nights: { ...item.nights, style },
                                    })
                                  }
                                />
                                <DynamicStyledField
                                  type="text"
                                  label="Room Type"
                                  value={item.roomType?.text ?? ""}
                                  onChange={(val: string) =>
                                    handleUpdateAccItem(idx, {
                                      roomType: { ...item.roomType, text: val },
                                    })
                                  }
                                  enableStyle
                                  style={item.roomType?.style}
                                  onStyleChange={(style) =>
                                    handleUpdateAccItem(idx, {
                                      roomType: { ...item.roomType, style },
                                    })
                                  }
                                />
                                <DynamicStyledField
                                  type="text"
                                  label="Board Basis (e.g. Breakfast included)"
                                  value={item.boardBasis?.text ?? ""}
                                  onChange={(val: string) =>
                                    handleUpdateAccItem(idx, {
                                      boardBasis: { ...item.boardBasis, text: val },
                                    })
                                  }
                                  enableStyle
                                  style={item.boardBasis?.style}
                                  onStyleChange={(style) =>
                                    handleUpdateAccItem(idx, {
                                      boardBasis: { ...item.boardBasis, style },
                                    })
                                  }
                                />
                              </div>
                              <DynamicStyledField
                                type="textarea"
                                label="Description"
                                value={item.description?.text ?? ""}
                                onChange={(val: string) =>
                                  handleUpdateAccItem(idx, {
                                    description: { ...item.description, text: val },
                                  })
                                }
                                enableStyle
                                style={item.description?.style}
                                onStyleChange={(style) =>
                                  handleUpdateAccItem(idx, {
                                    description: { ...item.description, style },
                                  })
                                }
                              />
                              <div className="rounded-md border border-border/50 p-3 bg-card">
                                <UniversalMultimediaForm
                                  section={item as any}
                                  content={item as any}
                                  updateSection={(patch) => handleUpdateAccItem(idx, patch)}
                                  updateSectionContent={(patch) => handleUpdateAccItem(idx, patch)}
                                  contentMediaKey="multimedia"
                                  backgroundType={item.multimedia?.type ?? "image"}
                                  sectionTitle="Card Media"
                                  showColorPicker={false}
                                  allowVideo={true}
                                  allowImage={true}
                                  imageTitle="Image"
                                  imageLabel="Upload Image"
                                  imageFieldName={`acc_img_${idx}`}
                                  videoTitle="Video"
                                  videoLabel="Upload Video"
                                  videoFieldName={`acc_vid_${idx}`}
                                  showImageAltField
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

          {/* ================= 3. STANDARDS ================= */}
          <div className="rounded-xl border border-border/70 bg-background overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() =>
                setExpandedMainSection(
                  expandedMainSection === "standards" ? null : "standards"
                )
              }
            >
              <h3 className="text-sm font-semibold">3. Standards</h3>
              <ToggleIcon expanded={expandedMainSection === "standards"} />
            </div>
            {expandedMainSection === "standards" && (
              <div className="p-4 border-t border-border/50 space-y-5 bg-muted/10">
                <div className="space-y-3">
                  <DynamicStyledField
                    type="text"
                    label="Eyebrow"
                    value={stdSec.eyebrow?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdateStdHeader("eyebrow", { ...stdSec.eyebrow, text: val })
                    }
                    enableStyle
                    style={stdSec.eyebrow?.style}
                    onStyleChange={(style) =>
                      handleUpdateStdHeader("eyebrow", { ...stdSec.eyebrow, style })
                    }
                  />
                  <DynamicStyledField
                    type="text"
                    label="Title"
                    value={stdSec.title?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdateStdHeader("title", { ...stdSec.title, text: val })
                    }
                    enableStyle
                    style={stdSec.title?.style}
                    onStyleChange={(style) =>
                      handleUpdateStdHeader("title", { ...stdSec.title, style })
                    }
                  />
                  <DynamicStyledField
                    type="textarea"
                    label="Description"
                    value={stdSec.description?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdateStdHeader("description", { ...stdSec.description, text: val })
                    }
                    enableStyle
                    style={stdSec.description?.style}
                    onStyleChange={(style) =>
                      handleUpdateStdHeader("description", { ...stdSec.description, style })
                    }
                  />
                </div>

                {/* Std Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">
                      Standards Items ({stdItems.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddStdItem}
                      className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Standard
                    </button>
                  </div>

                  <div className="space-y-3">
                    {stdItems.map((item: any, idx: number) => {
                      return (
                        <div
                          key={idx}
                          className="rounded-lg border border-border/70 bg-background p-4 space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-muted-foreground">
                              Item #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveStdItem(idx)}
                              className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <DynamicStyledField
                            type="text"
                            label="Item Title"
                            value={item.title?.text ?? ""}
                            onChange={(val: string) =>
                              handleUpdateStdItem(idx, {
                                title: { ...item.title, text: val },
                              })
                            }
                            enableStyle
                            style={item.title?.style}
                            onStyleChange={(style) =>
                              handleUpdateStdItem(idx, {
                                title: { ...item.title, style },
                              })
                            }
                          />
                          <DynamicStyledField
                            type="textarea"
                            label="Item Description"
                            value={item.description?.text ?? ""}
                            onChange={(val: string) =>
                              handleUpdateStdItem(idx, {
                                description: { ...item.description, text: val },
                              })
                            }
                            enableStyle
                            style={item.description?.style}
                            onStyleChange={(style) =>
                              handleUpdateStdItem(idx, {
                                description: { ...item.description, style },
                              })
                            }
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= 4. VISUALS ================= */}
          <div className="rounded-xl border border-border/70 bg-background overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() =>
                setExpandedMainSection(
                  expandedMainSection === "visuals" ? null : "visuals"
                )
              }
            >
              <h3 className="text-sm font-semibold">4. Visuals</h3>
              <ToggleIcon expanded={expandedMainSection === "visuals"} />
            </div>
            {expandedMainSection === "visuals" && (
              <div className="p-4 border-t border-border/50 space-y-5 bg-muted/10">
                <div className="space-y-3">
                  <DynamicStyledField
                    type="text"
                    label="Eyebrow"
                    value={visSec.eyebrow?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdateVisHeader("eyebrow", { ...visSec.eyebrow, text: val })
                    }
                    enableStyle
                    style={visSec.eyebrow?.style}
                    onStyleChange={(style) =>
                      handleUpdateVisHeader("eyebrow", { ...visSec.eyebrow, style })
                    }
                  />
                  <DynamicStyledField
                    type="text"
                    label="Title"
                    value={visSec.title?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdateVisHeader("title", { ...visSec.title, text: val })
                    }
                    enableStyle
                    style={visSec.title?.style}
                    onStyleChange={(style) =>
                      handleUpdateVisHeader("title", { ...visSec.title, style })
                    }
                  />
                  <DynamicStyledField
                    type="textarea"
                    label="Description"
                    value={visSec.description?.text ?? ""}
                    onChange={(val: string) =>
                      handleUpdateVisHeader("description", { ...visSec.description, text: val })
                    }
                    enableStyle
                    style={visSec.description?.style}
                    onStyleChange={(style) =>
                      handleUpdateVisHeader("description", { ...visSec.description, style })
                    }
                  />
                </div>

                {/* Vis Media Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">
                      Visual Media ({visMedia.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddVisMedia}
                      className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Multimedia
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visMedia.map((media: any, idx: number) => {
                      return (
                        <div
                          key={idx}
                          className="rounded-lg border border-border/70 bg-background p-4 space-y-3 relative"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" /> Media #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVisMedia(idx)}
                              className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          
                          <UniversalMultimediaForm
                            section={{ mediaItem: media } as any}
                            content={{ mediaItem: media } as any}
                            updateSection={(patch: any) => {
                              const updatedMedia = patch.mediaItem || patch
                              handleUpdateVisMedia(idx, updatedMedia)
                            }}
                            updateSectionContent={(patch: any) => {
                              const updatedMedia = patch.mediaItem || patch
                              handleUpdateVisMedia(idx, updatedMedia)
                            }}
                            contentMediaKey="mediaItem"
                            backgroundType={media.type ?? "image"}
                            sectionTitle={`Media #${idx + 1}`}
                            showColorPicker={false}
                            allowVideo={true}
                            allowImage={true}
                            imageTitle="Image"
                            imageLabel="Upload Image"
                            imageFieldName={`vis_img_${idx}`}
                            videoTitle="Video"
                            videoLabel="Upload Video"
                            videoFieldName={`vis_vid_${idx}`}
                            showImageAltField
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormSection>
  )
}
