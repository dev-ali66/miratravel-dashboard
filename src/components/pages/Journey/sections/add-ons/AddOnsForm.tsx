import type { JourneyData, AddOnItem } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2, Sparkles } from "lucide-react"

interface AddOnsFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function AddOnsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: AddOnsFormProps) {
  const isOpen = Boolean(openSections["add-ons"])
  const addOnsData = draft.addOns || {}
  const itemsList = addOnsData.itemsList || []

  const addAddOn = () => {
    const newItem: AddOnItem = {
      id: `addon-${Date.now()}`,
      title: "Bespoke Upgrade Experience",
      category: "Optional Excursion",
      duration: "Half Day",
      price: 250,
      currency: draft.currency || "EUR",
      description: "Exclusive optional experience available during your journey.",
      features: ["Private Host", "All Refreshments Included"],
    }
    updateField("addOns.itemsList", [...itemsList, newItem])
  }

  const removeAddOn = (index: number) => {
    updateField(
      "addOns.itemsList",
      itemsList.filter((_, i) => i !== index)
    )
  }

  return (
    <FormSection
      title="Add-ons & Optional Upgrades Builder"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("add-ons")}
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicStyledField
            type="text"
            label="Badge Text"
            fieldName="addOns.badge"
            placeholder="e.g. Optional Upgrades"
            value={addOnsData.badge}
            onChange={(val) => updateField("addOns.badge", val)}
          />

          <DynamicStyledField
            type="text"
            label="Section Title"
            fieldName="addOns.title"
            placeholder="e.g. Enhance Your Journey"
            value={addOnsData.title}
            onChange={(val) => updateField("addOns.title", val)}
          />
        </div>

        <DynamicStyledField
          type="richtext"
          label="Section Description"
          fieldName="addOns.description"
          placeholder="Write section narrative overview..."
          value={addOnsData.description}
          onChange={(val) => updateField("addOns.description", val)}
        />

        {/* Add-ons List */}
        <div className="space-y-4 pt-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Optional Upgrades ({itemsList.length})
            </label>

            <button
              type="button"
              onClick={addAddOn}
              className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Upgrade
            </button>
          </div>

          {itemsList.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rounded-xl border border-border/70 bg-card p-4 space-y-4 relative shadow-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Upgrade #{idx + 1}: {typeof item.title === "object" ? (item.title as any)?.value : item.title}
                </span>

                <button
                  type="button"
                  onClick={() => removeAddOn(idx)}
                  className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                  title="Remove Upgrade"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DynamicStyledField
                  type="text"
                  label="Upgrade Title"
                  fieldName={`addOns.itemsList.${idx}.title`}
                  value={item.title}
                  onChange={(val) => updateField(`addOns.itemsList.${idx}.title`, val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Category / Tag"
                  fieldName={`addOns.itemsList.${idx}.category`}
                  value={item.category}
                  onChange={(val) => updateField(`addOns.itemsList.${idx}.category`, val)}
                  placeholder="e.g. Helicopter Tour, Wine Tasting"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <DynamicStyledField
                  type="text"
                  label="Duration"
                  fieldName={`addOns.itemsList.${idx}.duration`}
                  value={item.duration}
                  onChange={(val) => updateField(`addOns.itemsList.${idx}.duration`, val)}
                  placeholder="e.g. 45 Mins, Full Day"
                />

                <DynamicStyledField
                  type="number"
                  label="Price"
                  fieldName={`addOns.itemsList.${idx}.price`}
                  value={item.price || 0}
                  onChange={(val) => updateField(`addOns.itemsList.${idx}.price`, Number(val))}
                />

                <DynamicStyledField
                  type="text"
                  label="Currency"
                  fieldName={`addOns.itemsList.${idx}.currency`}
                  value={item.currency || draft.currency || "EUR"}
                  onChange={(val) => updateField(`addOns.itemsList.${idx}.currency`, val)}
                />
              </div>

              <DynamicStyledField
                type="richtext"
                label="Upgrade Description"
                fieldName={`addOns.itemsList.${idx}.description`}
                value={item.description}
                onChange={(val) => updateField(`addOns.itemsList.${idx}.description`, val)}
              />

              <DynamicStyledField
                type="text"
                label="Highlights / Features (comma-separated)"
                fieldName={`addOns.itemsList.${idx}.features`}
                value={Array.isArray(item.features) ? item.features.join(", ") : item.features}
                onChange={(val) =>
                  updateField(
                    `addOns.itemsList.${idx}.features`,
                    typeof val === "string" ? val.split(",").map((s) => s.trim()).filter(Boolean) : val
                  )
                }
                placeholder="Private Pilot, Champagne Toast, Hotel Transfer"
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Upgrade Media / Image
                </label>
                <UniversalMultimediaForm
                  value={item.imageMultimedia || { show: "image", image: { url: typeof item.image === "string" ? item.image : "" } }}
                  onChange={(val) => updateField(`addOns.itemsList.${idx}.imageMultimedia`, val)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mandatory Section Background Multimedia */}
        <div className="pt-4 border-t border-border/40">
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
            Add-ons Section Background Multimedia
          </label>
          <UniversalMultimediaForm
            value={addOnsData.backgroundMultimedia || { show: "color", color: { color: "#ffffff" } }}
            onChange={(val) => updateField("addOns.backgroundMultimedia", val)}
          />
        </div>
      </div>
    </FormSection>
  )
}

