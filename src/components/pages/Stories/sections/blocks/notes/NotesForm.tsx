import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"

export interface NotesFormProps {
  block: any
  onChange: (patch: any) => void
  index?: number
}

export function NotesForm({ block, onChange, index = 0 }: NotesFormProps) {
  const items = Array.isArray(block.items) ? block.items : []

  const updateItem = (itemIdx: number, field: string, value: any) => {
    const next = [...items]
    next[itemIdx] = { ...next[itemIdx], [field]: value }
    onChange({ items: next })
  }

  const addItem = () => {
    const next = [
      ...items,
      {
        title: "New Note Topic",
        content: "<p>Add practical tips, recommendations, or guidelines here...</p>",
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
          placeholder="e.g. Practical Notes"
          value={block.title}
          onChange={(val: any) => onChange({ title: val })}
        />
        <DynamicStyledField
          type="text"
          label="Notes Subtitle (Optional)"
          fieldName={`blocks.${index}.subtitle`}
          placeholder="e.g. Essential travel guidance before you go..."
          value={block.subtitle}
          onChange={(val: any) => onChange({ subtitle: val })}
        />
      </div>

      {/* Dynamic Note Cards Repeater */}
      <div className="flex flex-col gap-3 pt-3 border-t border-border/40">
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
            Note Cards ({items.length})
          </span>
        </div>

        {items.map((item: any, itemIdx: number) => (
          <div
            key={itemIdx}
            className="flex flex-col gap-3 rounded-lg border border-border/70 bg-card p-3 shadow-2xs"
          >
            {/* Note Card Header Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-xs font-semibold text-foreground">
                Card #{itemIdx + 1}: {item.title || "Untitled Card"}
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

            {/* Note Card Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Card Heading / Topic:</label>
              <input
                type="text"
                value={item.title || ""}
                onChange={(e) => updateItem(itemIdx, "title", e.target.value)}
                placeholder="e.g. Timing & Seasons"
                className="h-8 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Note Card Content */}
            <DynamicStyledField
              type="richtext"
              label="Card Content (Paragraphs & Bullet Lists)"
              fieldName={`blocks.${index}.items.${itemIdx}.content`}
              placeholder="Add detailed tips with bold labels or bullet points..."
              value={{ value: item.content || "" }}
              onChange={(val: any) => updateItem(itemIdx, "content", val?.value || val)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="flex items-center justify-center gap-1.5 rounded-md border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 py-2.5 text-xs font-medium text-amber-600 cursor-pointer transition shadow-2xs mt-1"
        >
          <Plus className="h-4 w-4" /> Add Practical Note Card
        </button>
      </div>
    </div>
  )
}

export default NotesForm
