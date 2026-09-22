import type { JourneyData, AccommodationStayItem } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
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
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicStyledField
            type="text"
            label="Badge Text"
            fieldName="accommodations.badge"
            placeholder="e.g. Where You Stay"
            value={accData.badge}
            onChange={(val) => updateField("accommodations.badge", val)}
          />

          <DynamicStyledField
            type="text"
            label="Section Title"
            fieldName="accommodations.title"
            placeholder="e.g. Handpicked Luxury Stays"
            value={accData.title}
            onChange={(val) => updateField("accommodations.title", val)}
          />
        </div>

        <DynamicStyledField
          type="richtext"
          label="Accommodations Description"
          fieldName="accommodations.description"
          placeholder="Write section narrative overview..."
          value={accData.description}
          onChange={(val) => updateField("accommodations.description", val)}
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
              className="rounded-xl border border-border/70 bg-card p-4 space-y-4 relative shadow-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Stay #{idx + 1}: {typeof stay.name === "object" ? (stay.name as any)?.value : stay.name}
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
                <DynamicStyledField
                  type="text"
                  label="Hotel / Property Name"
                  fieldName={`accommodations.staysList.${idx}.name`}
                  value={stay.name}
                  onChange={(val) => updateField(`accommodations.staysList.${idx}.name`, val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Stay Category / Type"
                  fieldName={`accommodations.staysList.${idx}.stayType`}
                  value={stay.stayType}
                  onChange={(val) => updateField(`accommodations.staysList.${idx}.stayType`, val)}
                  placeholder="e.g. Luxury Eco-Lodge, Boutique Villa"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <DynamicStyledField
                  type="text"
                  label="City / Location"
                  fieldName={`accommodations.staysList.${idx}.city`}
                  value={stay.city}
                  onChange={(val) => updateField(`accommodations.staysList.${idx}.city`, val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Duration Tag"
                  fieldName={`accommodations.staysList.${idx}.duration`}
                  value={stay.duration}
                  onChange={(val) => updateField(`accommodations.staysList.${idx}.duration`, val)}
                  placeholder="e.g. 3 Nights"
                />

                <DynamicStyledField
                  type="number"
                  label="Nights Count"
                  fieldName={`accommodations.staysList.${idx}.nights`}
                  value={stay.nights || 1}
                  onChange={(val) => updateField(`accommodations.staysList.${idx}.nights`, Number(val))}
                />
              </div>

              <DynamicStyledField
                type="richtext"
                label="Property Description"
                fieldName={`accommodations.staysList.${idx}.description`}
                value={stay.description}
                onChange={(val) => updateField(`accommodations.staysList.${idx}.description`, val)}
              />

              <DynamicStyledField
                type="text"
                label="Key Amenities (comma-separated)"
                fieldName={`accommodations.staysList.${idx}.amenities`}
                value={Array.isArray(stay.amenities) ? stay.amenities.join(", ") : stay.amenities}
                onChange={(val) =>
                  updateField(
                    `accommodations.staysList.${idx}.amenities`,
                    typeof val === "string" ? val.split(",").map((s) => s.trim()).filter(Boolean) : val
                  )
                }
                placeholder="Private Pool, Butler Service, Spa & Wellness"
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Hotel Cover Media / Image
                </label>
                <UniversalMultimediaForm
                  value={stay.imageMultimedia || { show: "image", image: { url: typeof stay.image === "string" ? stay.image : "" } }}
                  onChange={(val) => updateField(`accommodations.staysList.${idx}.imageMultimedia`, val)}
                />
              </div>
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
      </div>
    </FormSection>
  )
}

