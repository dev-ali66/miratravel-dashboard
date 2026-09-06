/* =====================================================
   JOURNEYS — ACCOMMODATION (WHERE YOU STAY) FORM SECTION
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FormSection,
  JourneyInputField,
  JourneyTextareaField,
} from "../../shared/fields"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
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
    updateField("data.accommodation.stays", updated)
    setExpandedStay(updated.length - 1)
  }

  const handleUpdateStay = (index: number, field: keyof AccommodationStayItem, val: any) => {
    const updated = [...stays]
    updated[index] = { ...updated[index], [field]: val }
    updateField("data.accommodation.stays", updated)
  }

  const handleRemoveStay = (index: number) => {
    const updated = stays.filter((_, i) => i !== index)
    updateField("data.accommodation.stays", updated)
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
        <JourneyTextareaField
          label="Accommodation Philosophy"
          value={philosophy}
          onChange={(val) => updateField("data.accommodation.philosophy", val)}
          placeholder="We prioritize authentic boutique hotels, heritage guesthouses, and scenic lodges that reflect local architecture..."
          rows={3}
          description="Introductory explanation of how properties are selected for this journey."
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

              return (
                <div
                  key={idx}
                  className={cn(
                    "rounded-xl border bg-background transition-all",
                    isExpanded ? "border-primary/50 shadow-sm" : "border-border/70"
                  )}
                >
                  {/* Header */}
                  <div
                    onClick={() => setExpandedStay(isExpanded ? null : idx)}
                    className="flex items-center justify-between p-3 cursor-pointer select-none hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Building2 className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-semibold text-foreground truncate block">
                          {stay.hotelName || `Property #${idx + 1}`}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          {stay.location && (
                            <span className="flex items-center gap-0.5">
                              <MapPin className="h-2.5 w-2.5" /> {stay.location}
                            </span>
                          )}
                          {stay.nights && (
                            <span className="flex items-center gap-0.5">
                              <Moon className="h-2.5 w-2.5" /> {stay.nights} Nights
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveStay(idx)
                        }}
                        className="p-1 text-muted-foreground hover:text-destructive"
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

                  {/* Body */}
                  {isExpanded && (
                    <div className="p-3.5 pt-1 border-t border-border/50 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <JourneyInputField
                          label="Property Name"
                          value={stay.hotelName}
                          onChange={(val) => handleUpdateStay(idx, "hotelName", val)}
                          placeholder="e.g. Villa Gjepali"
                        />
                        <JourneyInputField
                          label="Location"
                          value={stay.location}
                          onChange={(val) => handleUpdateStay(idx, "location", val)}
                          placeholder="e.g. Shijak, Durrës"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <JourneyInputField
                          label="Nights"
                          type="number"
                          value={stay.nights}
                          onChange={(val) => handleUpdateStay(idx, "nights", val)}
                          min={1}
                        />
                        <div className="col-span-2">
                          <JourneyInputField
                            label="Room Type / Category"
                            value={stay.roomType ?? ""}
                            onChange={(val) => handleUpdateStay(idx, "roomType", val)}
                            placeholder="e.g. Heritage Suite"
                          />
                        </div>
                      </div>

                      <JourneyTextareaField
                        label="Property Description"
                        value={stay.description ?? ""}
                        onChange={(val) => handleUpdateStay(idx, "description", val)}
                        rows={3}
                        placeholder="Atmosphere, setting, architectural heritage..."
                      />

                      {/* Amenities */}
                      <div className="space-y-2 pt-1 border-t border-border/40">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-foreground">
                            Amenities & Features
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddAmenity(idx)}
                            className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                          >
                            <Plus className="h-3 w-3" /> Add Amenity
                          </button>
                        </div>

                        {(stay.amenities || []).map((am, amIdx) => (
                          <div key={amIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={am}
                              onChange={(e) =>
                                handleUpdateAmenity(idx, amIdx, e.target.value)
                              }
                              placeholder="e.g. Organic vineyard dining"
                              className="flex-1 rounded-md border border-border/70 bg-background px-2.5 py-1 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveAmenity(idx, amIdx)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Images */}
                      <div className="space-y-2 pt-1 border-t border-border/40">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-foreground">
                            Property Photos ({(stay.images || []).length})
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddImage(idx)}
                            className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                          >
                            <Plus className="h-3 w-3" /> Add Photo
                          </button>
                        </div>

                        {(stay.images || []).map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">Photo {imgIdx + 1}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx, imgIdx)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <ImageUploadField
                              label=""
                              value={imgUrl}
                              onChange={(url) => handleUpdateImage(idx, imgIdx, url || "")}
                              fieldName={`stay_${idx + 1}_img_${imgIdx + 1}`}

                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </FormSection>
  )
}
