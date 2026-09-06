/* =====================================================
   JOURNEYS — ADD-ONS & UPGRADES FORM SECTION
   Directly reflects Prisma model JourneyAddOn
===================================================== */

import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { removeFiles } from "@/services/fileUpload"
import {
  FormSection,
  DynamicStyledField,
  UniversalMultimediaForm,
  JourneySelectField,
} from "../../shared/fields"

const CURRENCY_OPTIONS = [
  { label: "EUR (€)", value: "EUR" },
  { label: "USD ($)", value: "USD" },
  { label: "GBP (£)", value: "GBP" },
]
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import {
  getJourneyAddons,
  sanitizeItineraryDay,
  sanitizeFieldStyle,
  sanitizeMultimedia,
  sanitizeLocation,
  getCurrencySymbol,
  getDayEyebrow,
  getDayTitle,
  getDayLocation,
  getDayDescription,
  getDayMedia,
  type Journey,
  type AddonItem,
} from "../../journeyTypes"
import { LocationSearchCombobox } from "../itinerary/LocationSearchCombobox"

export type AddonsFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

function extractMediaUrlsFromAddon(addon: AddonItem): string[] {
  const urls: string[] = []

  const addUrl = (u: any) => {
    if (typeof u === "string" && u.trim() && !u.startsWith("/images/")) {
      urls.push(u.trim())
    }
  }

  // 1. itineraryMedia
  const media = addon.itineraryMedia as any
  if (media) {
    addUrl(media.url)
    addUrl(media.image?.url)
    addUrl(media.video?.url)
    addUrl(media.video?.poster)
    addUrl(media.posterUrl)
  }

  // 2. legacy multimedia
  const mm = (addon as any).multimedia
  if (mm) {
    addUrl(mm.url)
    addUrl(mm.image?.url)
    addUrl(mm.video?.url)
    addUrl(mm.video?.poster)
  }

  return urls
}

export function AddonsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: AddonsFormProps) {
  const addons = getJourneyAddons(draft)
  const [expandedAddon, setExpandedAddon] = useState<number | null>(0)

  const syncAddons = (nextAddons: AddonItem[]) => {
    updateField("addOns", nextAddons)
    updateField("addons", nextAddons)
    updateField("data.addons", nextAddons)
  }

  const handleAddAddon = () => {
    const nextAddonNum = addons.length + 1
    const titleText = `Optional Add-on ${nextAddonNum}`
    const slug = `addon-${nextAddonNum}-${titleText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`

    const newAddon: AddonItem = {
      dayNumber: nextAddonNum,
      dayLabel: `Add-on ${nextAddonNum}`,
      slug,
      price: 0,
      currency: "EUR",
      priceSuffix: "per person",
      eyebrow: {
        text: "",
        style: {
          textColor: null,
          backgroundColor: null,
        },
      },
      title: {
        text: titleText,
        style: {
          textColor: null,
          backgroundColor: null,
        },
      },
      location: {
        id: null,
        name: "",
        geoData: {
          latitude: null,
          longitude: null,
        },
      },
      description: {
        text: "",
        style: {
          textColor: null,
          backgroundColor: null,
        },
      },
      itineraryMedia: {
        type: "image",
        color: "#F8F6F0",
        url: null,
        alt: null,
        image: {
          url: null,
          alt: null,
          opacity: 100,
          overlayColor: "#000000",
          overlayOpacity: 0,
        },
        video: {
          url: null,
          alt: null,
          poster: null,
          autoplay: true,
          loop: true,
          muted: true,
          opacity: 100,
          overlayColor: "#000000",
          overlayOpacity: 0,
        },
      },
    }
    const updated = [...addons, newAddon]
    syncAddons(updated)
    setExpandedAddon(updated.length - 1)
  }

  const handleUpdateAddonFields = (index: number, patch: Record<string, any>) => {
    const updated = addons.map((curr, idx) => {
      if (idx !== index) return curr
      const sanitized = sanitizeItineraryDay({ ...curr, ...patch }, idx) as AddonItem
      // Retain Addon specific fields not handled by sanitizeItineraryDay
      sanitized.price = patch.price !== undefined ? patch.price : curr.price
      sanitized.currency = patch.currency !== undefined ? patch.currency : curr.currency
      sanitized.priceSuffix = patch.priceSuffix !== undefined ? patch.priceSuffix : curr.priceSuffix
      return sanitized
    })
    syncAddons(updated)
  }

  const handleRemoveAddon = async (index: number) => {
    const targetAddon = addons[index]
    if (targetAddon) {
      // 1. Delete all multimedia uploaded files from server
      const mediaUrls = extractMediaUrlsFromAddon(targetAddon)
      if (mediaUrls.length > 0) {
        try {
          await removeFiles(mediaUrls)
        } catch (err) {
          console.error("Failed to delete media files from server:", err)
        }
      }
    }

    // 2. Remove addon card and renumber remaining addons
    const updated = addons
      .filter((_: AddonItem, i: number) => i !== index)
      .map((a: AddonItem, i: number) => ({
        ...a,
        dayNumber: i + 1,
        dayLabel: `Add-on ${i + 1}`,
      }))

    syncAddons(updated)

    if (expandedAddon === index) {
      setExpandedAddon(null)
    } else if (expandedAddon !== null && expandedAddon > index) {
      setExpandedAddon(expandedAddon - 1)
    }
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
            Configure optional excursions, upgrades, and experiences for this journey.
          </p>
          <button
            type="button"
            onClick={handleAddAddon}
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Plus className="h-3.5 w-3.5" /> Add Option
          </button>
        </div>

        {/* Add-ons Accordion */}
        <div className="space-y-3">
          {addons.map((addon: AddonItem, idx: number) => {
            const isExpanded = expandedAddon === idx
            const addonEyebrow = getDayEyebrow(addon)
            const addonTitle = getDayTitle(addon, idx + 1)
            const addonLoc = getDayLocation(addon)
            const addonDesc = getDayDescription(addon)
            const addonMedia = getDayMedia(addon)

            return (
              <div
                key={idx}
                className={cn(
                  "rounded-xl border border-border/70 bg-background transition-all",
                  isExpanded ? "shadow-sm ring-1 ring-primary/20" : ""
                )}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-muted/30"
                  onClick={() => setExpandedAddon(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {addon.dayNumber || idx + 1}
                    </span>

                    {/* Add-on Media Thumbnail */}
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30">
                      <UniversalMultimediaPreview
                        multimedia={addonMedia}
                        fallbackImageSrc={addonMedia.url || addon.thumbnail}
                        fallbackAlt={addonTitle.text}
                        mode="background"
                        className="h-full w-full object-cover object-center"
                        containerClassName="absolute inset-0"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {addonTitle.text}
                      </span>
                      {addonLoc.name && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                          <MapPin className="h-2.5 w-2.5 text-primary shrink-0" />
                          {addonLoc.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {addon.price ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary shrink-0">
                        +{getCurrencySymbol(addon.currency)}{addon.price}
                      </span>
                    ) : null}
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

                {/* Add-on Details */}
                {isExpanded && (
                  <div className="border-t border-border/50 p-4 space-y-4">
                    {/* Eyebrow with DynamicStyledField */}
                    <DynamicStyledField
                      type="text"
                      label="Eyebrow"
                      value={addonEyebrow.text}
                      onChange={(val: string) => {
                        handleUpdateAddonFields(idx, {
                          eyebrow: { text: val, style: sanitizeFieldStyle(addonEyebrow.style) },
                        })
                      }}
                      placeholder="e.g. Optional Excursion"
                      enableStyle
                      style={addonEyebrow.style}
                      onStyleChange={(style) => {
                        handleUpdateAddonFields(idx, {
                          eyebrow: { text: addonEyebrow.text, style: sanitizeFieldStyle(style) },
                        })
                      }}
                    />

                    {/* Add-on Title with DynamicStyledField */}
                    <DynamicStyledField
                      type="text"
                      label="Add-on Title"
                      value={addonTitle.text}
                      onChange={(val: string) => {
                        handleUpdateAddonFields(idx, {
                          title: { text: val, style: sanitizeFieldStyle(addonTitle.style) },
                        })
                      }}
                      placeholder="e.g. Private Cooking Class"
                      enableStyle
                      style={addonTitle.style}
                      onStyleChange={(style) => {
                        handleUpdateAddonFields(idx, {
                          title: { text: addonTitle.text, style: sanitizeFieldStyle(style) },
                        })
                      }}
                    />

                    {/* Price & Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <DynamicStyledField
                        type="number"
                        label="Price"
                        value={addon.price ?? 0}
                        onChange={(val: string) =>
                          handleUpdateAddonFields(idx, { price: val === "" ? 0 : Number(val) })
                        }
                        min={0}
                      />
                      <JourneySelectField
                        label="Currency"
                        value={addon.currency || "EUR"}
                        options={CURRENCY_OPTIONS}
                        onChange={(val) => handleUpdateAddonFields(idx, { currency: val })}
                      />
                      <DynamicStyledField
                        type="number"
                        label="Price Suffix (Persons)"
                        value={(addon as any).personCount ?? (typeof addon.priceSuffix === "number" ? addon.priceSuffix : Number(addon.priceSuffix) || 1)}
                        onChange={(val: number | string) => {
                          const num = Number(val) || 1
                          handleUpdateAddonFields(idx, { 
                            personCount: num,
                            priceSuffix: num.toString()
                          } as any)
                        }}
                        placeholder="1"
                        hint="1 = per person, 2 = two persons, 3 = three persons..."
                        min={1}
                        step={1}
                      />
                    </div>

                    {/* Location Search Box (Allows same location across addons) */}
                    <LocationSearchCombobox
                      valueLocationId={addonLoc.id}
                      valueLocationName={addonLoc.name}
                      onSelect={(loc) => {
                        handleUpdateAddonFields(idx, {
                          location: sanitizeLocation(loc),
                        })
                      }}
                    />

                    {/* Add-on Description with DynamicStyledField */}
                    <DynamicStyledField
                      type="textarea"
                      label="Add-on Description"
                      value={addonDesc.text}
                      onChange={(val: string) => {
                        handleUpdateAddonFields(idx, {
                          description: { text: val, style: sanitizeFieldStyle(addonDesc.style) },
                        })
                      }}
                      placeholder="Detailed narrative of this optional add-on..."
                      enableStyle
                      style={addonDesc.style}
                      onStyleChange={(style) => {
                        handleUpdateAddonFields(idx, {
                          description: { text: addonDesc.text, style: sanitizeFieldStyle(style) },
                        })
                      }}
                    />

                    {/* Add-on Universal Multimedia (Image / Video / Background Color) */}
                    <div className="rounded-lg border border-border/60 p-3 space-y-2.5 bg-card/40">
                      <UniversalMultimediaForm
                        sectionTitle={`Add-on ${addon.dayNumber || idx + 1} Media`}
                        section={{
                          ...addon,
                          itineraryMedia: addonMedia,
                        } as any}
                        content={{
                          ...addon,
                          itineraryMedia: addonMedia,
                        }}
                        contentMediaKey="itineraryMedia"
                        backgroundType={addonMedia.type || "image"}
                        onBackgroundTypeChange={(type) => {
                          handleUpdateAddonFields(idx, {
                            itineraryMedia: sanitizeMultimedia({
                              ...addonMedia,
                              type,
                            }),
                          })
                        }}
                        onColorChange={(color) => {
                          handleUpdateAddonFields(idx, {
                            itineraryMedia: sanitizeMultimedia({
                              ...addonMedia,
                              type: "color" as const,
                              color,
                            }),
                          })
                        }}
                        image={addonMedia.image}
                        onImageChange={(nextImg) => {
                          handleUpdateAddonFields(idx, {
                            itineraryMedia: sanitizeMultimedia({
                              ...addonMedia,
                              type: "image" as const,
                              image: {
                                ...(addonMedia.image || {}),
                                ...nextImg,
                              },
                            }),
                          })
                        }}
                        video={addonMedia.video}
                        onVideoChange={(nextVid) => {
                          handleUpdateAddonFields(idx, {
                            itineraryMedia: sanitizeMultimedia({
                              ...addonMedia,
                              type: "video" as const,
                              video: {
                                ...(addonMedia.video || {}),
                                ...nextVid,
                              },
                            }),
                          })
                        }}
                        updateSection={(patch: any) => {
                          const raw = patch?.itineraryMedia || patch?.multimedia || patch
                          handleUpdateAddonFields(idx, {
                            itineraryMedia: sanitizeMultimedia(raw),
                          })
                        }}
                        updateSectionContent={(patch: any) => {
                          const raw = patch?.itineraryMedia || patch?.multimedia || patch
                          handleUpdateAddonFields(idx, {
                            itineraryMedia: sanitizeMultimedia(raw),
                          })
                        }}
                        showColorPicker={true}
                        colorLabel="Add-on Background / Card Color"
                        defaultColor="#F8F6F0"
                        allowImage={true}
                        allowVideo={true}
                        imageTitle="Add-on Photo / Image"
                        imageLabel="Add-on Image"
                        imageFieldName="addonImage"
                        videoTitle="Add-on Video"
                        videoLabel="Add-on Video (mp4, webm)"
                        videoHint="Upload or link an mp4/webm video clip for this add-on."
                        videoFieldName="addonVideo"
                        showImageAltField={true}
                        showVideoAltField={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Section Background Multimedia (Retained from original addons) */}
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

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-border/60">
          <button
            type="button"
            onClick={handleAddAddon}
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Plus className="h-3.5 w-3.5" /> Add Option
          </button>
        </div>
      </div>
    </FormSection>
  )
}
