/* =====================================================
   JOURNEYS — ADD-ONS & UPGRADES FORM SECTION
   Directly reflects Prisma model JourneyAddOn
===================================================== */

import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FormSection,
  DynamicStyledField,
  UniversalMultimediaForm,
} from "../../shared/fields"
import {
  getJourneyAddons,
  type Journey,
} from "../../journeyTypes"

export type AddonsFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function AddonsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: AddonsFormProps) {
  const addons = getJourneyAddons(draft)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const syncAddons = (next: any[]) => {
    updateField("addOns", next)
    updateField("addons", next)
    updateField("data.addons", next)
  }

  const handleAddAddon = () => {
    const nextDayNum = addons.length + 1
    const title = "Private Cooking Class & Wine Tasting"
    const slug = `addon-${nextDayNum}-${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`

    const newItem = {
      dayNumber: nextDayNum,
      title,
      slug,
      price: 150,
      description: "",
      journeyItineraryImage: [],
      data: {},
      metadata: {},
    }
    const updated = [...addons, newItem]
    syncAddons(updated)
    setExpandedIndex(updated.length - 1)
  }

  const handleUpdateAddon = (index: number, field: string, val: any) => {
    const next = [...addons]
    const item = { ...next[index], [field]: val }

    if (field === "title") {
      item.slug = `addon-${item.dayNumber || index + 1}-${String(val)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}`
    }

    next[index] = item
    syncAddons(next)
  }

  const handleUpdateAddonData = (index: number, dataKey: string, val: any) => {
    const next = [...addons]
    const item = next[index]
    item.data = { ...((item.data as any) || {}), [dataKey]: val }
    next[index] = item
    syncAddons(next)
  }

  const handleRemoveAddon = (index: number) => {
    const next = addons
      .filter((_: any, i: number) => i !== index)
      .map((item: any, i: number) => ({ ...item, dayNumber: i + 1 }))
    syncAddons(next)
    if (expandedIndex === index) {
      setExpandedIndex(null)
    }
  }

  const handleAddImage = (addonIdx: number) => {
    const item = addons[addonIdx]
    const current = item.journeyItineraryImage || (item.image ? [item.image] : [])
    handleUpdateAddon(addonIdx, "journeyItineraryImage", [...current, ""])
  }

  const handleUpdateImage = (addonIdx: number, imgIdx: number, url: string) => {
    const item = addons[addonIdx]
    const current = [...(item.journeyItineraryImage || (item.image ? [item.image] : []))]
    current[imgIdx] = url
    handleUpdateAddon(addonIdx, "journeyItineraryImage", current)
  }

  const handleRemoveImage = (addonIdx: number, imgIdx: number) => {
    const item = addons[addonIdx]
    const current = (item.journeyItineraryImage || (item.image ? [item.image] : [])).filter(
      (_: string, i: number) => i !== imgIdx
    )
    handleUpdateAddon(addonIdx, "journeyItineraryImage", current)
  }

  return (
    <FormSection
      title="Add-ons & Optional Upgrades"
      active={!!openSections["addons"]}
      onClick={() => toggleSection("addons")}
      badge={`${addons.length} Add-ons`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Optional excursions, upgrades, and experiences for this journey.
          </p>
          <button
            type="button"
            onClick={handleAddAddon}
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Plus className="h-3.5 w-3.5" /> Add Option
          </button>
        </div>

        <div className="space-y-3">
          {addons.map((addon: any, idx: number) => {
            const isExpanded = expandedIndex === idx
            const images = addon.journeyItineraryImage || (addon.image ? [addon.image] : [])

            return (
              <div
                key={idx}
                className={cn(
                  "rounded-xl border border-border/70 bg-background transition-all",
                  isExpanded ? "shadow-sm ring-1 ring-primary/20" : ""
                )}
              >
                <div
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-muted/30"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {addon.dayNumber || idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {addon.title || `Add-on #${idx + 1}`}
                    </span>
                    {addon.price > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        +€{addon.price}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveAddon(idx)
                      }}
                      className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border/50 p-4 space-y-4">
                    <DynamicStyledField
                      type="text"
                      label="Add-on Title"
                      value={addon.title ?? ""}
                      onChange={(val: string) => handleUpdateAddon(idx, "title", val)}
                      placeholder="e.g. Private Vineyard Tour & Sunset Tasting"
                      enableStyle
                      style={(addon.data as any)?.titleStyle}
                      onStyleChange={(style) => handleUpdateAddonData(idx, "titleStyle", style)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <DynamicStyledField
                        type="number"
                        label="Day Number"
                        value={addon.dayNumber ?? idx + 1}
                        onChange={(val: string) =>
                          handleUpdateAddon(idx, "dayNumber", val === "" ? 1 : Number(val))
                        }
                        min={1}
                      />

                      <DynamicStyledField
                        type="number"
                        label="Price (EUR)"
                        value={addon.price ?? 0}
                        onChange={(val: string) =>
                          handleUpdateAddon(idx, "price", val === "" ? 0 : Number(val))
                        }
                        min={0}
                      />
                    </div>

                    <DynamicStyledField
                      type="text"
                      label="Slug"
                      value={addon.slug ?? ""}
                      onChange={(val: string) => handleUpdateAddon(idx, "slug", val)}
                      placeholder="e.g. private-vineyard-tour"
                    />

                    <DynamicStyledField
                      type="textarea"
                      label="Description"
                      value={addon.description ?? ""}
                      onChange={(val: string) => handleUpdateAddon(idx, "description", val)}
                      placeholder="Details of what this optional experience involves..."
                      enableStyle
                      style={(addon.data as any)?.descriptionStyle}
                      onStyleChange={(style) =>
                        handleUpdateAddonData(idx, "descriptionStyle", style)
                      }
                    />

                    {/* Images */}
                    <div className="rounded-lg border border-border/60 p-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <ImageIcon className="h-3.5 w-3.5 text-primary" />
                          Add-on Images ({images.length})
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddImage(idx)}
                          className="flex items-center gap-1 rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80"
                        >
                          <Plus className="h-3 w-3" /> Add Image
                        </button>
                      </div>

                      <div className="space-y-3">
                        {images.map((imgUrl: string, imgIdx: number) => {
                          const imgItem = {
                            id: imgIdx,
                            imageMultimedia: {
                              type: "image" as const,
                              url: imgUrl,
                              alt: `${addon.title || "Add-on"} photo ${imgIdx + 1}`,
                            },
                          }

                          return (
                            <div
                              key={imgIdx}
                              className="rounded-lg border border-border/50 p-3 bg-muted/10 space-y-2"
                            >
                              <div className="flex items-center justify-between pb-1 border-b border-border/30">
                                <span className="text-[11px] font-semibold text-muted-foreground">
                                  Image #{imgIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx, imgIdx)}
                                  className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <UniversalMultimediaForm
                                section={imgItem as any}
                                content={imgItem}
                                updateSection={(patch) => {
                                  const nextUrl =
                                    (patch as any)?.imageMultimedia?.url ??
                                    (patch as any)?.url ??
                                    imgUrl
                                  handleUpdateImage(idx, imgIdx, nextUrl)
                                }}
                                updateSectionContent={(patch) => {
                                  const nextUrl =
                                    (patch as any)?.imageMultimedia?.url ??
                                    (patch as any)?.url ??
                                    imgUrl
                                  handleUpdateImage(idx, imgIdx, nextUrl)
                                }}
                                contentMediaKey="imageMultimedia"
                                backgroundType="image"
                                sectionTitle={`Add-on ${idx + 1} - Image #${imgIdx + 1}`}
                                showColorPicker={false}
                                imageTitle="Photo"
                                imageLabel="Photo"
                                imageFieldName={`addon_${idx}_img_${imgIdx}`}
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
            )
          })}
        </div>

        {/* Section Background Multimedia */}
        <div className="pt-2 border-t border-border/60">
          <UniversalMultimediaForm
            section={((draft.data?.addonsSection as any) || {}) as any}
            content={((draft.data?.addonsSection as any) || {}) as Record<string, any>}
            updateSection={(patch) =>
              updateField("data.addonsSection", {
                ...((draft.data?.addonsSection as any) || {}),
                ...patch,
              })
            }
            updateSectionContent={(patch) =>
              updateField("data.addonsSection", {
                ...((draft.data?.addonsSection as any) || {}),
                ...patch,
              })
            }
            contentMediaKey="backgroundMultimedia"
            backgroundType={(draft.data?.addonsSection as any)?.backgroundMultimedia?.type ?? "color"}
            backgroundTypeStyleKey="journeyAddonsBackgroundTypeStyle"
            sectionTitle="Add-ons Section Background"
            showColorPicker
            colorLabel="Add-ons background color"
            defaultColor="#FFFFFF"
            imageTitle="Background Image"
            imageLabel="Background image"
            imageFieldName="journeyAddonsBackgroundImage"
            videoTitle="Background Video"
            videoLabel="Background video"
            videoFieldName="journeyAddonsBackgroundVideo"
            showImageAltField
            showVideoSwitches
          />
        </div>
      </div>
    </FormSection>
  )
}
