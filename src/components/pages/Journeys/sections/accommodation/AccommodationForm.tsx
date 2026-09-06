/* =====================================================
   JOURNEYS — ACCOMMODATION (WHERE YOU STAY) FORM SECTION
   Reflects Prisma field: accommodations Json?
===================================================== */

import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Building2,
  MapPin,
  Moon,
  Image as ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FormSection,
  DynamicStyledField,
  UniversalMultimediaForm,
} from "../../shared/fields"
import {
  getJourneyAccommodationPhilosophy,
  getJourneyAccommodationStays,
  type Journey,
  type AccommodationStayItem,
} from "../../journeyTypes"

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
  const philosophy = getJourneyAccommodationPhilosophy(draft)
  const stays = getJourneyAccommodationStays(draft)
  const [expandedStay, setExpandedStay] = useState<number | null>(0)

  const syncStays = (updatedStays: AccommodationStayItem[]) => {
    updateField("data.accommodation.stays", updatedStays)
    updateField("accommodations", {
      philosophy,
      stays: updatedStays,
    })
  }

  const handleAddStay = () => {
    const newStay: AccommodationStayItem = {
      hotelName: "Boutique Hotel / Alpine Lodge",
      location: "",
      nights: 2,
      roomType: "Deluxe Mountain View Room",
      description: "",
      amenities: ["Free Wi-Fi", "Farm-to-table breakfast", "En-suite bathroom"],
      images: [],
      rating: 5,
    }
    const updated = [...stays, newStay]
    syncStays(updated)
    setExpandedStay(updated.length - 1)
  }

  const handleUpdateStay = (index: number, field: keyof AccommodationStayItem, val: any) => {
    const updated = [...stays]
    updated[index] = { ...updated[index], [field]: val }
    syncStays(updated)
  }

  const handleRemoveStay = (index: number) => {
    const updated = stays.filter((_, i) => i !== index)
    syncStays(updated)
    if (expandedStay === index) {
      setExpandedStay(null)
    }
  }

  // Amenities
  const handleAddAmenity = (stayIdx: number) => {
    const stay = stays[stayIdx]
    const next = [...(stay.amenities || []), ""]
    handleUpdateStay(stayIdx, "amenities", next)
  }

  const handleUpdateAmenity = (stayIdx: number, amenityIdx: number, val: string) => {
    const stay = stays[stayIdx]
    const next = [...(stay.amenities || [])]
    next[amenityIdx] = val
    handleUpdateStay(stayIdx, "amenities", next)
  }

  const handleRemoveAmenity = (stayIdx: number, amenityIdx: number) => {
    const stay = stays[stayIdx]
    const next = (stay.amenities || []).filter((_, i) => i !== amenityIdx)
    handleUpdateStay(stayIdx, "amenities", next)
  }

  // Images
  const handleAddImage = (stayIdx: number) => {
    const stay = stays[stayIdx]
    const next = [...(stay.images || []), ""]
    handleUpdateStay(stayIdx, "images", next)
  }

  const handleUpdateImage = (stayIdx: number, imgIdx: number, url: string) => {
    const stay = stays[stayIdx]
    const next = [...(stay.images || [])]
    next[imgIdx] = url
    handleUpdateStay(stayIdx, "images", next)
  }

  const handleRemoveImage = (stayIdx: number, imgIdx: number) => {
    const stay = stays[stayIdx]
    const next = (stay.images || []).filter((_, i) => i !== imgIdx)
    handleUpdateStay(stayIdx, "images", next)
  }

  return (
    <FormSection
      title="Where You Stay (Accommodations)"
      active={!!openSections["accommodation"]}
      onClick={() => toggleSection("accommodation")}
      badge={`${stays.length} Properties`}
    >
      <div className="space-y-4">
        {/* Philosophy with DynamicStyledField */}
        <DynamicStyledField
          type="textarea"
          label="Accommodation Philosophy"
          value={philosophy}
          onChange={(val: string) => {
            updateField("data.accommodation.philosophy", val)
            updateField("accommodations", {
              philosophy: val,
              stays,
            })
          }}
          placeholder="We prioritize authentic boutique hotels, heritage guesthouses, and scenic lodges that reflect local architecture..."
          enableStyle
          style={(draft.data?.accommodation as any)?.philosophyStyle}
          onStyleChange={(style) =>
            updateField("data.accommodation.philosophyStyle", style)
          }
        />

        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Properties & Lodges ({stays.length})
            </label>
            <button
              type="button"
              onClick={handleAddStay}
              className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Plus className="h-3.5 w-3.5" /> Add Property
            </button>
          </div>

          <div className="space-y-3">
            {stays.map((stay, idx) => {
              const isExpanded = expandedStay === idx
              const images = stay.images || (stay.image ? [stay.image] : [])

              return (
                <div
                  key={idx}
                  className={cn(
                    "rounded-xl border border-border/70 bg-background transition-all",
                    isExpanded ? "shadow-sm ring-1 ring-primary/20" : ""
                  )}
                >
                  {/* Stay Header */}
                  <div
                    className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-muted/30"
                    onClick={() => setExpandedStay(isExpanded ? null : idx)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-foreground">
                          {stay.hotelName || `Property #${idx + 1}`}
                        </span>
                        {stay.location && (
                          <span className="ml-2 text-[11px] text-muted-foreground flex-inline items-center gap-1">
                            <MapPin className="inline h-3 w-3" /> {stay.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Moon className="h-3 w-3" /> {stay.nights}N
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveStay(idx)
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

                  {/* Stay Details */}
                  {isExpanded && (
                    <div className="border-t border-border/50 p-4 space-y-3.5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <DynamicStyledField
                          type="text"
                          label="Hotel / Lodge Name"
                          value={stay.hotelName}
                          onChange={(val: string) =>
                            handleUpdateStay(idx, "hotelName", val)
                          }
                          placeholder="e.g. Hotel Tradita / Bujtina Polia"
                          enableStyle
                          style={(stay as any).hotelNameStyle}
                          onStyleChange={(style) =>
                            handleUpdateStay(idx, "hotelNameStyle" as any, style)
                          }
                        />

                        <DynamicStyledField
                          type="text"
                          label="Location / Region"
                          value={stay.location}
                          onChange={(val: string) => handleUpdateStay(idx, "location", val)}
                          placeholder="e.g. Shkodra, Albania"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <DynamicStyledField
                          type="number"
                          label="Number of Nights"
                          value={stay.nights}
                          onChange={(val: string) =>
                            handleUpdateStay(idx, "nights", val === "" ? 1 : Number(val))
                          }
                          min={1}
                        />

                        <DynamicStyledField
                          type="text"
                          label="Room / Suite Category"
                          value={stay.roomType ?? ""}
                          onChange={(val: string) =>
                            handleUpdateStay(idx, "roomType", val)
                          }
                          placeholder="e.g. Deluxe Alpine Suite with Balcony"
                          enableStyle
                          style={(stay as any).roomTypeStyle}
                          onStyleChange={(style) =>
                            handleUpdateStay(idx, "roomTypeStyle" as any, style)
                          }
                        />
                      </div>

                      <DynamicStyledField
                        type="textarea"
                        label="Property Experience & Atmosphere"
                        value={stay.description ?? ""}
                        onChange={(val: string) =>
                          handleUpdateStay(idx, "description", val)
                        }
                        placeholder="A historic traditional stone compound featuring authentic wood-carved interiors and an open hearth fireplace..."
                        enableStyle
                        style={(stay as any).descriptionStyle}
                        onStyleChange={(style) =>
                          handleUpdateStay(idx, "descriptionStyle" as any, style)
                        }
                      />

                      {/* Key Amenities */}
                      <div className="rounded-lg border border-border/60 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-foreground">
                            Key Amenities
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddAmenity(idx)}
                            className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                          >
                            <Plus className="h-2.5 w-2.5" /> Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(stay.amenities || []).map((amenity, aIdx) => (
                            <div
                              key={aIdx}
                              className="flex items-center gap-1 rounded-md border border-border/70 bg-background px-2 py-1"
                            >
                              <input
                                type="text"
                                value={amenity}
                                onChange={(e) =>
                                  handleUpdateAmenity(idx, aIdx, e.target.value)
                                }
                                placeholder="Amenity"
                                className="w-32 bg-transparent text-xs text-foreground focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveAmenity(idx, aIdx)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Property Images */}
                      <div className="rounded-lg border border-border/60 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                            <ImageIcon className="h-3.5 w-3.5 text-primary" />
                            Property Photos ({images.length})
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddImage(idx)}
                            className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                          >
                            <Plus className="h-2.5 w-2.5" /> Add Photo
                          </button>
                        </div>
                        <div className="space-y-3">
                          {images.map((imgUrl, imgIdx) => {
                            const imgItem = {
                              id: imgIdx,
                              imageMultimedia: {
                                type: "image" as const,
                                url: imgUrl,
                                alt: `${stay.hotelName || "Stay"} photo ${imgIdx + 1}`,
                              },
                            }

                            return (
                              <div
                                key={imgIdx}
                                className="rounded-lg border border-border/50 p-3 bg-muted/10 space-y-2"
                              >
                                <div className="flex items-center justify-between pb-1 border-b border-border/30">
                                  <span className="text-[11px] font-semibold text-muted-foreground">
                                    Photo #{imgIdx + 1}
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
                                  sectionTitle={`Stay ${idx + 1} Photo #${imgIdx + 1}`}
                                  showColorPicker={false}
                                  imageTitle="Photo"
                                  imageLabel="Photo"
                                  imageFieldName={`stay_${idx}_img_${imgIdx}`}
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
        </div>

        {/* Section Background Multimedia */}
        <div className="pt-2 border-t border-border/60">
          <UniversalMultimediaForm
            section={((draft.data?.accommodation as any) || {}) as any}
            content={((draft.data?.accommodation as any) || {}) as Record<string, any>}
            updateSection={(patch) =>
              updateField("data.accommodation", {
                ...((draft.data?.accommodation as any) || {}),
                ...patch,
              })
            }
            updateSectionContent={(patch) =>
              updateField("data.accommodation", {
                ...((draft.data?.accommodation as any) || {}),
                ...patch,
              })
            }
            contentMediaKey="backgroundMultimedia"
            backgroundType={(draft.data?.accommodation as any)?.backgroundMultimedia?.type ?? "color"}
            backgroundTypeStyleKey="journeyAccommodationBackgroundTypeStyle"
            sectionTitle="Accommodation Section Background"
            showColorPicker
            colorLabel="Accommodation background color"
            defaultColor="#FFFFFF"
            imageTitle="Background Image"
            imageLabel="Background image"
            imageFieldName="journeyAccommodationBackgroundImage"
            videoTitle="Background Video"
            videoLabel="Background video"
            videoFieldName="journeyAccommodationBackgroundVideo"
            showImageAltField
            showVideoSwitches
          />
        </div>
      </div>
    </FormSection>
  )
}
