import { Plus, Trash2, ArrowUp, ArrowDown, AlignLeft, AlignRight } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { createDefaultMultimedia } from "../shared/defaultMediaHelper"
import { deleteMediaFiles } from "../shared/mediaDeleteHelper"

export interface SpotlightCardFormProps {
  block: any
  onChange: (patch: any) => void
  index?: number
}

export function SpotlightCardForm({
  block,
  onChange,
  index = 0,
}: SpotlightCardFormProps) {
  const mediaPosition = block.mediaPosition || "left"
  const rawItems = Array.isArray(block.items)
    ? block.items
    : block.multimedia
    ? [block.multimedia]
    : []

  const updateItem = (itemIdx: number, val: any) => {
    const next = [...rawItems]
    next[itemIdx] = val
    const patch: any = { items: next }
    if (itemIdx === 0) {
      patch.multimedia = val
    }
    onChange(patch)
  }

  const addItem = () => {
    const newItem = createDefaultMultimedia("image")
    const next = [...rawItems, newItem]
    onChange({ items: next, multimedia: next[0] })
  }

  const removeItem = async (itemIdx: number) => {
    const itemToRemove = rawItems[itemIdx]
    if (itemToRemove) {
      await deleteMediaFiles(itemToRemove)
    }
    const next = rawItems.filter((_: any, i: number) => i !== itemIdx)
    const patch: any = { items: next }
    if (next.length > 0) {
      patch.multimedia = next[0]
    } else {
      patch.multimedia = createDefaultMultimedia("image")
    }
    onChange(patch)
  }

  const moveItem = (itemIdx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? itemIdx - 1 : itemIdx + 1
    if (targetIdx < 0 || targetIdx >= rawItems.length) return
    const next = [...rawItems]
    const temp = next[itemIdx]
    next[itemIdx] = next[targetIdx]
    next[targetIdx] = temp
    onChange({ items: next, multimedia: next[0] })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Media Position Controls */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/40">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Media Position:
        </label>
        <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => onChange({ mediaPosition: "left" })}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
              mediaPosition === "left"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            Media Left
          </button>
          <button
            type="button"
            onClick={() => onChange({ mediaPosition: "right" })}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
              mediaPosition === "right"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
            Media Right
          </button>
        </div>
      </div>

      {/* Dynamic Spotlight Media List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            Spotlight Media ({rawItems.length})
          </span>
        </div>

        {rawItems.map((mediaItem: any, itemIdx: number) => (
          <UniversalMultimediaForm
            key={itemIdx}
            title={`Spotlight Media #${itemIdx + 1}`}
            fieldName={`blocks.${index}.items.${itemIdx}`}
            imageFieldName={`storySpotlightMediaImage_${index}_${itemIdx}`}
            videoFieldName={`storySpotlightMediaVideo_${index}_${itemIdx}`}
            allowImage={true}
            allowVideo={true}
            allowColor={true}
            defaultOpen={false}
            value={mediaItem || createDefaultMultimedia("image")}
            onChange={(val: any) => updateItem(itemIdx, val)}
            headerActions={
              <div className="flex items-center gap-1 mr-1" onClick={(e) => e.stopPropagation()}>
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
                  disabled={itemIdx === rawItems.length - 1}
                  className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(itemIdx)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded cursor-pointer text-xs flex items-center gap-1 ml-0.5"
                  title="Delete Item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            }
          />
        ))}

        <button
          type="button"
          onClick={addItem}
          className="flex items-center justify-center gap-1.5 rounded-md border border-dashed border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/10 py-2.5 text-xs font-medium text-purple-600 cursor-pointer transition shadow-2xs"
        >
          <Plus className="h-4 w-4" /> Add Spotlight Media
        </button>
      </div>

      {/* Title & Content */}
      <div className="pt-2 border-t border-border/40 flex flex-col gap-4">
        <DynamicStyledField
          type="text"
          label="Spotlight Title"
          fieldName={`blocks.${index}.title`}
          placeholder="e.g. Essential Highlight"
          value={block.title}
          onChange={(val: any) => onChange({ title: val })}
        />
        <DynamicStyledField
          type="richtext"
          label="Spotlight Body Content"
          fieldName={`blocks.${index}.content`}
          placeholder="Describe this highlight..."
          value={block.content}
          onChange={(val: any) => onChange({ content: val })}
        />
      </div>
    </div>
  )
}

export default SpotlightCardForm
