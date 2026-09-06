/* =====================================================
   JOURNEYS — IS THIS FOR YOU FORM SECTION
===================================================== */

import { Plus, Trash2 } from "lucide-react"
import { FormSection, JourneyInputField } from "../../shared/fields"
import type { Journey } from "../../journeyTypes"

export type IsThisForYouFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function IsThisForYouForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: IsThisForYouFormProps) {
  const isThisForYouData = draft.data?.isThisForYou || {
    title: "Is This Journey For You?",
    items: [],
  }

  const items = isThisForYouData.items || []

  const handleAddItem = () => {
    const next = [...items, ""]
    updateField("data.isThisForYou.items", next)
  }

  const handleItemChange = (index: number, val: string) => {
    const next = [...items]
    next[index] = val
    updateField("data.isThisForYou.items", next)
  }

  const handleRemoveItem = (index: number) => {
    const next = items.filter((_, i) => i !== index)
    updateField("data.isThisForYou.items", next)
  }

  return (
    <FormSection
      title="Is This Journey For You?"
      active={!!openSections["is-this-for-you"]}
      onClick={() => toggleSection("is-this-for-you")}
      badge={items.length}
    >
      <div className="space-y-3.5">
        <JourneyInputField
          label="Section Title"
          value={isThisForYouData.title ?? "Is This Journey For You?"}
          onChange={(val) => updateField("data.isThisForYou.title", val)}
          placeholder="Is This Journey For You?"
        />

        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Criteria & Highlights
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1 rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Plus className="h-3 w-3" /> Add Point
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder="e.g. You enjoy moderate day hiking (4-6 hours with elevation gain)"
                  className="flex-1 rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  )
}
