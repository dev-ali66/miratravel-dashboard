/* =====================================================
   JOURNEYS — HIGHLIGHTS & INCLUSIONS FORM SECTION
===================================================== */

import { Plus, Trash2 } from "lucide-react"
import { FormSection } from "../../shared/fields"
import type { Journey } from "../../journeyTypes"

export type HighlightsInclusionsFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

function StringListManager({
  title,
  items,
  placeholder,
  onChange,
}: {
  title: string
  items: string[]
  placeholder: string
  onChange: (items: string[]) => void
}) {
  const handleAdd = () => {
    onChange([...items, ""])
  }

  const handleUpdate = (index: number, val: string) => {
    const next = [...items]
    next[index] = val
    onChange(next)
  }

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">
          {title} ({items.length})
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          <Plus className="h-3 w-3" /> Add Item
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdate(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HighlightsInclusionsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: HighlightsInclusionsFormProps) {
  const importantInfo = draft.data?.whatsIncluded?.importantInfo || []

  return (
    <FormSection
      title="Highlights & Inclusions"
      active={!!openSections["highlights"]}
      onClick={() => toggleSection("highlights")}
      badge={(draft.highlights?.length || 0) + (draft.included?.length || 0)}
    >
      <div className="space-y-5">
        <StringListManager
          title="Trip Highlights"
          items={draft.highlights || []}
          placeholder="e.g., Summit hike across Valbona Pass to Theth"
          onChange={(items) => updateField("highlights", items)}
        />

        <div className="h-px bg-border/60" />

        <StringListManager
          title="What's Included"
          items={draft.included || []}
          placeholder="e.g., 8 nights boutique heritage hotel & alpine lodge accommodation"
          onChange={(items) => updateField("included", items)}
        />

        <div className="h-px bg-border/60" />

        <StringListManager
          title="What's Not Included"
          items={draft.notIncluded || []}
          placeholder="e.g., International airfare to/from Tirana (TIA)"
          onChange={(items) => updateField("notIncluded", items)}
        />

        <div className="h-px bg-border/60" />

        <StringListManager
          title="Important Information & Policies"
          items={importantInfo}
          placeholder="e.g., Mountain weather can be unpredictable; flexible footwear required"
          onChange={(items) =>
            updateField("data.whatsIncluded.importantInfo", items)
          }
        />
      </div>
    </FormSection>
  )
}
