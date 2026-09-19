import type { JourneyData, AddOnItem } from "../../journeyTypes"
import { FormSection, Field, ImageField } from "../../shared/fields"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Badge Text"
          value={addOnsData.badge || ""}
          onChange={(val) => updateField("addOns.badge", val)}
          placeholder="e.g. Optional Upgrades"
        />

        <Field
          label="Section Title"
          value={addOnsData.title || ""}
          onChange={(val) => updateField("addOns.title", val)}
          placeholder="e.g. Enhance Your Journey"
        />
      </div>

      <Field
        label="Section Description"
        value={addOnsData.description || ""}
        onChange={(val) => updateField("addOns.description", val)}
        multiline
        rows={2}
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
            className="rounded-xl border border-border/70 bg-card p-4 space-y-3 relative shadow-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Upgrade #{idx + 1}: {item.title}
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
              <Field
                label="Upgrade Title"
                value={item.title}
                onChange={(val) => updateField(`addOns.itemsList.${idx}.title`, val)}
              />

              <Field
                label="Category / Tag"
                value={item.category || ""}
                onChange={(val) => updateField(`addOns.itemsList.${idx}.category`, val)}
                placeholder="e.g. Helicopter Tour, Wine Tasting"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field
                label="Duration"
                value={item.duration || ""}
                onChange={(val) => updateField(`addOns.itemsList.${idx}.duration`, val)}
                placeholder="e.g. 45 Mins, Full Day"
              />

              <Field
                label="Price"
                type="number"
                value={item.price || 0}
                onChange={(val) => updateField(`addOns.itemsList.${idx}.price`, Number(val))}
              />

              <Field
                label="Currency"
                value={item.currency || draft.currency || "EUR"}
                onChange={(val) => updateField(`addOns.itemsList.${idx}.currency`, val)}
              />
            </div>

            <Field
              label="Upgrade Description"
              value={item.description || ""}
              onChange={(val) => updateField(`addOns.itemsList.${idx}.description`, val)}
              multiline
              rows={2}
            />

            <Field
              label="Highlights / Features (comma-separated)"
              value={(item.features || []).join(", ")}
              onChange={(val) =>
                updateField(
                  `addOns.itemsList.${idx}.features`,
                  val.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
              placeholder="Private Pilot, Champagne Toast, Hotel Transfer"
            />

            <ImageField
              label="Upgrade Image URL"
              value={item.image || item.imageMultimedia?.url || ""}
              onChange={(url) => {
                updateField(`addOns.itemsList.${idx}.image`, url)
                updateField(`addOns.itemsList.${idx}.imageMultimedia`, { show: "image", image: { url } })
              }}
            />
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
    </FormSection>
  )
}
