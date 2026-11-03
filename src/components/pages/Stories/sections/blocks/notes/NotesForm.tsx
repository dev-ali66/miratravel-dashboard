import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { emptyNotesItem } from "./emptyNotes"

export interface NotesFormProps {
  block: any
  onChange: (patch: any) => void
  index?: number
}

export function NotesForm({ block, onChange, index = 0 }: NotesFormProps) {
  const items = Array.isArray(block.items) ? block.items : []

  const updateItem = (itemIdx: number, field: string, value: any) => {
    const next = [...items]
    const updated = { ...next[itemIdx], [field]: value }
    if (field === "description") {
      updated.content = typeof value === "string" ? value : value?.value || ""
    }
    next[itemIdx] = updated
    onChange({ items: next })
  }

  const addItem = () => {
    const next = [
      ...items,
      {
        ...emptyNotesItem,
        description: { ...emptyNotesItem.description, value: "" },
        content: "",
      },
    ]
    onChange({ items: next })
  }

  const removeItem = (itemIdx: number) => {
    const next = items.filter((_: any, i: number) => i !== itemIdx)
    onChange({ items: next })
  }

  const moveItem = (itemIdx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? itemIdx - 1 : itemIdx + 1
    if (targetIdx < 0 || targetIdx >= items.length) return
    const next = [...items]
    const temp = next[itemIdx]
    next[itemIdx] = next[targetIdx]
    next[targetIdx] = temp
    onChange({ items: next })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Section Title & Subtitle */}
      <div className="flex flex-col gap-4">
        <DynamicStyledField
          type="text"
          label="Practical Notes Title"
          fieldName={`blocks.${index}.title`}
          placeholder="e.g. Practical Notes & Insider Tips"
          value={block.title}
          onChange={(val: any) => onChange({ title: val })}
        />
        <DynamicStyledField
          type="text"
          label="Notes Subtitle (Optional)"
          fieldName={`blocks.${index}.subtitle`}
          placeholder="e.g. Essential advice for travelers..."
          value={block.subtitle}
          onChange={(val: any) => onChange({ subtitle: val })}
        />
      </div>

      {/* Dynamic Note Cards Repeater */}
      <div className="flex flex-col gap-3 pt-3 border-t border-border/40">
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
            Travel Advice Cards ({items.length})
          </span>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 rounded-sm bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-xs font-medium transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Note Card
          </button>
        </div>

        {items.map((item: any, itemIdx: number) => {
          const itemDesc = (
            typeof item.description === "string"
              ? item.description
              : item.description?.value || item.content || ""
          ).replace(/<[^>]*>/g, "").trim().slice(0, 35)

          return (
            <div
              key={itemIdx}
              className="flex flex-col gap-3 rounded-lg border border-border/70 bg-card p-3 shadow-2xs"
            >
              {/* Note Card Header Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-semibold text-foreground">
                  Card #{itemIdx + 1}{itemDesc ? `: ${itemDesc}` : ""}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(itemIdx, "up")}
                    disabled={itemIdx === 0}
                    className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(itemIdx, "down")}
                    disabled={itemIdx === items.length - 1}
                    className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(itemIdx)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded cursor-pointer text-xs ml-1"
                    title="Delete Card"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Detailed Description */}
              <DynamicStyledField
                type="richtext"
                label="Detailed Description"
                fieldName={`blocks.${index}.items.${itemIdx}.description`}
                placeholder="Explain the practical advice in detail..."
                value={item.description || { value: item.content || "" }}
                onChange={(val: any) => updateItem(itemIdx, "description", val)}
              />
            </div>
          )
        })}

        <button
          type="button"
          onClick={addItem}
          className="flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 py-2.5 text-xs font-medium text-amber-600 cursor-pointer transition shadow-2xs mt-1"
        >
          <Plus className="h-4 w-4" /> Add Practical Note Card
        </button>
      </div>
    </div>
  )
}

export default NotesForm
