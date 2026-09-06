/* =====================================================
   JOURNEYS — ADD-ONS & UPGRADES FORM SECTION
===================================================== */

import { Plus, Trash2 } from "lucide-react"
import {
  FormSection,
  JourneyInputField,
  JourneyTextareaField,
  JourneySelectField,
} from "../../shared/fields"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import {
  getJourneyAddons,
  type Journey,
  type AddonItem,
} from "../../journeyTypes"

export type AddonsFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

const CURRENCY_OPTIONS = [
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
]

export function AddonsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: AddonsFormProps) {
  const addons = getJourneyAddons(draft)

  const syncAddons = (next: AddonItem[]) => {
    updateField("addons", next)
    updateField("data.addons", next)
  }

  const handleAddAddon = () => {
    const newItem: AddonItem = {
      title: "Optional Masterclass or Private Tour",
      description: "",
      price: 150,
      currency: "USD",
      duration: "Half Day",
      image: "",
    }
    syncAddons([...addons, newItem])
  }

  const handleUpdateAddon = (index: number, field: keyof AddonItem, val: any) => {
    const next = [...addons]
    next[index] = { ...next[index], [field]: val }
    syncAddons(next)
  }

  const handleRemoveAddon = (index: number) => {
    const next = addons.filter((_: AddonItem, i: number) => i !== index)
    syncAddons(next)
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
            Optional excursions, private masterclasses, and tailored extensions.
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
          {addons.map((addon: AddonItem, idx: number) => (
            <div
              key={idx}
              className="rounded-xl border border-border/70 bg-background p-3.5 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-xs font-semibold text-foreground">
                  {addon.title || `Add-on #${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAddon(idx)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <JourneyInputField
                    label="Add-on Title"
                    value={addon.title}
                    onChange={(val) => handleUpdateAddon(idx, "title", val)}
                    placeholder="e.g. Private Sommelier Tasting at Berat Winery"
                  />
                </div>
                <div className="col-span-1">
                  <JourneyInputField
                    label="Duration"
                    value={addon.duration ?? ""}
                    onChange={(val) => handleUpdateAddon(idx, "duration", val)}
                    placeholder="e.g. 3 Hours"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <JourneyInputField
                  label="Price"
                  type="number"
                  value={addon.price}
                  onChange={(val) => handleUpdateAddon(idx, "price", val)}
                  min={0}
                />
                <JourneySelectField
                  label="Currency"
                  value={addon.currency || "USD"}
                  options={CURRENCY_OPTIONS}
                  onChange={(val) => handleUpdateAddon(idx, "currency", val)}
                />
              </div>

              <JourneyTextareaField
                label="Description"
                value={addon.description ?? ""}
                onChange={(val) => handleUpdateAddon(idx, "description", val)}
                rows={2}
                placeholder="What is included in this optional experience?"
              />

              <div className="space-y-1 pt-1 border-t border-border/40">
                <label className="text-xs font-semibold text-foreground">
                  Card Cover Photo
                </label>
                <ImageUploadField
                  label=""
                  value={addon.image ?? ""}
                  onChange={(url) => handleUpdateAddon(idx, "image", url || "")}
                  fieldName={`addon_${idx + 1}_img`}

                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FormSection>
  )
}
