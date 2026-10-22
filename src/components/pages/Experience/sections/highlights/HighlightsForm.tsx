import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"
import { emptyHighlights } from "../../shared/emptyExperience"
import type { ExperienceHighlightItem } from "../../experienceTypes"
import { Plus, Trash2, GripVertical, Sparkles } from "lucide-react"

export function HighlightsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ExperienceFormSectionProps) {
  const highlights = draft?.highlights || emptyHighlights
  const isOpen = Boolean(openSections["highlights"])
  const items: ExperienceHighlightItem[] = Array.isArray(highlights.items)
    ? highlights.items
    : emptyHighlights.items

  const updateHighlightsField = (fieldKey: string, value: any) => {
    updateField(`highlights.${fieldKey}`, value)
  }

  const handleAddItem = () => {
    const nextNum = items.length + 1
    const newItem: ExperienceHighlightItem = {
      id: `h-${Date.now()}`,
      badge: `Highlight 0${nextNum}`,
      title: {
        value: "",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    }
    updateHighlightsField("items", [...items, newItem])
  }

  const handleRemoveItem = (index: number) => {
    const nextItems = items.filter((_, i) => i !== index)
    updateHighlightsField("items", nextItems)
  }

  const handleUpdateItem = (index: number, key: keyof ExperienceHighlightItem, val: any) => {
    const nextItems = [...items]
    nextItems[index] = {
      ...nextItems[index],
      [key]: val,
    }
    updateHighlightsField("items", nextItems)
  }

  return (
    <FormSection
      title="Key Highlights (3 to 5 Standout Moments)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("highlights")}
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicStyledField
            type="text"
            label="Section Eyebrow / Label"
            fieldName="highlights.label"
            placeholder="e.g. KEY HIGHLIGHTS"
            value={highlights.label}
            onChange={(val) => updateHighlightsField("label", val)}
          />

          <DynamicStyledField
            type="text"
            label="Headline Title"
            fieldName="highlights.title"
            placeholder="e.g. What makes this unforgettable"
            value={highlights.title}
            onChange={(val) => updateHighlightsField("title", val)}
          />
        </div>

        {/* Highlights List Repeater */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Highlights List ({items.length} moments — Recommended 3 to 5)
            </span>

            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Highlight
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-3.5 relative shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                    <input
                      type="text"
                      value={item.badge || `Highlight 0${idx + 1}`}
                      onChange={(e) => handleUpdateItem(idx, "badge", e.target.value)}
                      placeholder="e.g. Highlight 01"
                      className="text-xs font-bold uppercase tracking-wider text-primary bg-transparent outline-none border-b border-dashed border-primary/30 focus:border-primary px-1"
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                      title="Remove highlight"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <DynamicStyledField
                    type="text"
                    label="Highlight Title"
                    fieldName={`highlights.items.${idx}.title`}
                    placeholder="e.g. Private landing on high alpine plateau"
                    value={item.title}
                    onChange={(val) => handleUpdateItem(idx, "title", val)}
                  />

                  <DynamicStyledField
                    type="textarea"
                    label="Description & Sensory Context"
                    fieldName={`highlights.items.${idx}.description`}
                    placeholder="Describe what the guest will experience in this moment..."
                    value={item.description}
                    onChange={(val) => handleUpdateItem(idx, "description", val)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  )
}

export default HighlightsForm
