import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { FormSection } from "../../shared/fields"
import type { JourneyData } from "../../journeyTypes"
import { Plus, Trash2 } from "lucide-react"

interface HighlightsFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function HighlightsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: HighlightsFormProps) {
  const isOpen = Boolean(openSections["highlights"])
  const hlData = draft.highlights || draft.data?.highlights || {}

  const updateHighlightsField = (fieldKey: string, value: any) => {
    updateField(`highlights.${fieldKey}`, value)
  }

  const items = Array.isArray(hlData.items)
    ? hlData.items
    : Array.isArray(hlData.highlightsList)
    ? hlData.highlightsList
    : []

  const addItem = () => {
    const newItem = {
      title: { value: "", textColor: "#464136", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
    }
    const nextItems = [...items, newItem]
    updateHighlightsField("items", nextItems)
  }

  const removeItem = (index: number) => {
    const nextItems = items.filter((_: any, idx: number) => idx !== index)
    updateHighlightsField("items", nextItems)
  }

  const updateItemTitle = (index: number, val: any) => {
    const nextItems = items.map((item: any, idx: number) => {
      if (idx !== index) return item
      return { ...item, title: val }
    })
    updateHighlightsField("items", nextItems)
  }

  return (
    <FormSection
      title="Journey Highlights Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("highlights")}
    >
      <div className="flex flex-col gap-5">
        {/* Section Main Title */}
        <DynamicStyledField
          type="textarea"
          rows={2}
          label="Main Title"
          fieldName="highlights.title"
          placeholder="e.g. Highlights"
          value={hlData.title}
          onChange={(val) => updateHighlightsField("title", val)}
        />

        {/* Highlights List Repeater */}
        <div className="space-y-3 rounded-lg border border-border/70 bg-card p-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Highlight Items (Checkmark Bullet Points)
            </label>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Highlight
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-start gap-2 rounded-lg border border-border/50 bg-background p-3">
                <div className="flex-1">
                  <DynamicStyledField
                    type="text"
                    label={`Highlight #${idx + 1}`}
                    fieldName={`highlights.items.${idx}.title`}
                    placeholder="e.g. Private Colosseum and Roman Forum tour"
                    value={item.title}
                    onChange={(val) => updateItemTitle(idx, val)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="mt-6 text-muted-foreground hover:text-destructive cursor-pointer p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  )
}
