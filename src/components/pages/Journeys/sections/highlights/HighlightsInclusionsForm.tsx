/* =====================================================
   JOURNEYS — HIGHLIGHTS & INCLUSIONS FORM SECTION
   Directly manages Prisma fields:
   - highlights: String[]
   - included: String[]
   - notIncluded: String[]
===================================================== */

import { Plus, Trash2, Sparkles, CheckCircle2, XCircle } from "lucide-react"
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
  icon: Icon,
  items,
  placeholder,
  onChange,
  badgeColor = "bg-primary/10 text-primary",
}: {
  title: string
  icon: any
  items: string[]
  placeholder: string
  onChange: (items: string[]) => void
  badgeColor?: string
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
    <div className="space-y-2.5 rounded-xl border border-border/60 bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${badgeColor}`}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          <label className="text-xs font-semibold text-foreground">
            {title} ({items.length})
          </label>
        </div>
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
  return (
    <FormSection
      title="Highlights & Inclusions"
      active={!!openSections["highlights"]}
      onClick={() => toggleSection("highlights")}
      badge={(draft.highlights?.length || 0) + (draft.included?.length || 0)}
    >
      <div className="space-y-4">
        {/* Trip Highlights */}
        <StringListManager
          title="Trip Highlights"
          icon={Sparkles}
          items={draft.highlights || []}
          placeholder="e.g., Summit hike across Valbona Pass to Theth"
          onChange={(items) => updateField("highlights", items)}
          badgeColor="bg-primary/10 text-primary"
        />

        {/* What's Included */}
        <StringListManager
          title="What's Included"
          icon={CheckCircle2}
          items={draft.included || []}
          placeholder="e.g., All private 4WD transfers and luggage portage"
          onChange={(items) => updateField("included", items)}
          badgeColor="bg-green-500/10 text-green-600"
        />

        {/* What's Not Included */}
        <StringListManager
          title="What's Not Included"
          icon={XCircle}
          items={draft.notIncluded || []}
          placeholder="e.g., International flights to/from Tirana"
          onChange={(items) => updateField("notIncluded", items)}
          badgeColor="bg-amber-500/10 text-amber-600"
        />
      </div>
    </FormSection>
  )
}
