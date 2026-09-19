import type { JourneyData, AccommodationStayItem } from "../../journeyTypes"
import { FormSection, Field, ImageField } from "../../shared/fields"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2, Hotel } from "lucide-react"

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
  const staysList = accData.staysList || []

  const addStay = () => {
    const newStay: AccommodationStayItem = {
      id: `stay-${Date.now()}`,
      name: "Luxury Boutique Resort",
      stayType: "Boutique Hotel",
      city: "Destination City",
      duration: "3 Nights",
      nights: 3,
      description: "Exquisite accommodations curated for comfort and panoramic views.",
      amenities: ["Private Pool", "Spa", "Gourmet Dining"],
    }
    updateField("accommodations.staysList", [...staysList, newStay])
  }

  const removeStay = (index: number) => {
    updateField(
      "accommodations.staysList",
      staysList.filter((_, i) => i !== index)
    )
  }

  return (
    <FormSection
      title="Accommodations & Handpicked Stays"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("accommodations")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Badge Text"
          value={accData.badge || ""}
          onChange={(val) => updateField("accommodations.badge", val)}
          placeholder="e.g. Where You Stay"
        />

        <Field
          label="Section Title"
          value={accData.title || ""}
          onChange={(val) => updateField("accommodations.title", val)}
          placeholder="e.g. Handpicked Luxury Stays"
        />
      </div>

      <Field
        label="Accommodations Description"
        value={accData.description || ""}
        onChange={(val) => updateField("accommodations.description", val)}
        multiline
        rows={2}
      />

      {/* Stays List */}
      <div className="space-y-4 pt-3 border-t border-border/40">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Hotel className="h-4 w-4 text-primary" />
            Curated Stays ({staysList.length})
          </label>

          <button
            type="button"
            onClick={addStay}
            className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Stay
          </button>
        </div>

        {staysList.map((stay, idx) => (
          <div
            key={stay.id || idx}
            className="rounded-xl border border-border/70 bg-card p-4 space-y-3 relative shadow-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Stay #{idx + 1}: {stay.name}
              </span>

              <button
                type="button"
                onClick={() => removeStay(idx)}
                className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                title="Remove Stay"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field
                label="Hotel / Property Name"
                value={stay.name}
                onChange={(val) => updateField(`accommodations.staysList.${idx}.name`, val)}
              />

              <Field
                label="Stay Category / Type"
                value={stay.stayType || ""}
                onChange={(val) => updateField(`accommodations.staysList.${idx}.stayType`, val)}
                placeholder="e.g. Luxury Eco-Lodge, Boutique Villa"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field
                label="City / Location"
                value={stay.city || ""}
                onChange={(val) => updateField(`accommodations.staysList.${idx}.city`, val)}
              />

              <Field
                label="Duration Tag"
                value={stay.duration || ""}
                onChange={(val) => updateField(`accommodations.staysList.${idx}.duration`, val)}
                placeholder="e.g. 3 Nights"
              />

              <Field
                label="Nights Count"
                type="number"
                value={stay.nights || 1}
                onChange={(val) => updateField(`accommodations.staysList.${idx}.nights`, Number(val))}
              />
            </div>

            <Field
              label="Property Description"
              value={stay.description || ""}
              onChange={(val) => updateField(`accommodations.staysList.${idx}.description`, val)}
              multiline
              rows={2}
            />

            <Field
              label="Key Amenities (comma-separated)"
              value={(stay.amenities || []).join(", ")}
              onChange={(val) =>
                updateField(
                  `accommodations.staysList.${idx}.amenities`,
                  val.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
              placeholder="Private Pool, Butler Service, Spa & Wellness"
            />

            <ImageField
              label="Hotel Image URL"
              value={stay.image || stay.imageMultimedia?.url || ""}
              onChange={(url) => {
                updateField(`accommodations.staysList.${idx}.image`, url)
                updateField(`accommodations.staysList.${idx}.imageMultimedia`, { show: "image", image: { url } })
              }}
            />
          </div>
        ))}
      </div>

      {/* Mandatory Section Background Multimedia */}
      <div className="pt-4 border-t border-border/40">
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
          Accommodations Section Background Multimedia
        </label>
        <UniversalMultimediaForm
          value={accData.backgroundMultimedia || { show: "color", color: { color: "#ffffff" } }}
          onChange={(val) => updateField("accommodations.backgroundMultimedia", val)}
        />
      </div>
    </FormSection>
  )
}
