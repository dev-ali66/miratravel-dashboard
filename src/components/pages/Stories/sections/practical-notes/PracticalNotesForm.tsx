import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { FormSection } from "../../shared/fields"
import type { StoryFormSectionProps } from "../../config/storySections"
import { emptyPracticalNotesItem, emptyPracticalNotes } from "./emptyPracticalNotes"

export function PracticalNotesForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: StoryFormSectionProps) {
  const practicalNotes = draft?.practicalNotes || (draft as any)?.data?.practicalNotes || emptyPracticalNotes
  const items = Array.isArray(practicalNotes.items) ? practicalNotes.items : emptyPracticalNotes.items
  const isOpen = Boolean(openSections["practical-notes"])

  const updatePracticalNotes = (key: string, value: any) => {
    updateField(`practicalNotes.${key}`, value)
  }

  const updateItems = (newItems: any[]) => {
    updatePracticalNotes("items", newItems)
  }

  const addItem = () => {
    const newItem = {
      ...emptyPracticalNotesItem,
      title: { value: "New Guidance Tip", textColor: "", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "Add practical advice or recommendation details...", textColor: "", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      category: "General",
    }
    updateItems([...items, newItem])
  }

  const removeItem = (index: number) => {
    const next = [...items]
    next.splice(index, 1)
    updateItems(next)
  }

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return
    const next = [...items]
    const temp = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = temp
    updateItems(next)
  }

  const updateItemField = (index: number, fieldKey: string, value: any) => {
    const next = [...items]
    next[index] = { ...next[index], [fieldKey]: value }
    updateItems(next)
  }

  return (
    <FormSection
      title="Practical Notes & Insider Tips"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("practical-notes")}
    >
      <div className="flex flex-col gap-6">
        {/* Section Header Fields */}
        <DynamicStyledField
          type="text"
          label="Section Main Title"
          fieldName="practicalNotes.title"
          placeholder="e.g. Practical Notes & Insider Tips"
          value={practicalNotes.title}
          onChange={(val) => updatePracticalNotes("title", val)}
        />

        <DynamicStyledField
          type="text"
          label="Section Subtitle"
          fieldName="practicalNotes.subtitle"
          placeholder="e.g. Essential advice for travelers..."
          value={practicalNotes.subtitle}
          onChange={(val) => updatePracticalNotes("subtitle", val)}
        />

        {/* Repeater List for Note Cards */}
        <div className="flex flex-col gap-4 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Travel Advice Cards ({items.length})
            </h4>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-xs font-medium transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Note Card
            </button>
          </div>

          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="rounded-lg border border-border/70 bg-card p-4 flex flex-col gap-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-xs font-semibold text-primary">
                  {idx + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, "down")}
                    disabled={idx === items.length - 1}
                    className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer ml-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicStyledField
                  type="text"
                  label="Category Tag"
                  fieldName={`practicalNotes.items.${idx}.category`}
                  placeholder="e.g. Logistics, Weather, Packing"
                  value={item.category}
                  onChange={(val) => updateItemField(idx, "category", val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Tip Title"
                  fieldName={`practicalNotes.items.${idx}.title`}
                  placeholder="e.g. Best Time to Visit"
                  value={item.title}
                  onChange={(val) => updateItemField(idx, "title", val)}
                />
              </div>

              <DynamicStyledField
                type="richtext"
                label="Detailed Description"
                fieldName={`practicalNotes.items.${idx}.description`}
                placeholder="Explain the practical advice in detail..."
                value={item.description}
                onChange={(val) => updateItemField(idx, "description", val)}
              />
            </div>
          ))}
        </div>
      </div>
    </FormSection>
  )
}

export default PracticalNotesForm
