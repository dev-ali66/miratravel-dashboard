import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { createDefaultMultimedia } from "../shared/defaultMediaHelper"
import { deleteMediaFiles } from "../shared/mediaDeleteHelper"

export interface ImageBlockFormProps {
  block: any
  onChange: (patch: any) => void
  index?: number
}

export function ImageBlockForm({ block, onChange, index = 0 }: ImageBlockFormProps) {
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
      <DynamicStyledField
        type="text"
        label="Image Caption (Optional)"
        fieldName={`blocks.${index}.title`}
        placeholder="e.g. Morning mist rising over the valley"
        value={block.title}
        onChange={(val) => onChange({ title: val })}
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Featured Images ({rawItems.length})
          </span>
        </div>

        {rawItems.map((mediaItem: any, itemIdx: number) => (
          <UniversalMultimediaForm
            key={itemIdx}
            title={`Image #${itemIdx + 1}`}
            fieldName={`blocks.${index}.items.${itemIdx}`}
            imageFieldName={`storyBlockMediaImage_${index}_${itemIdx}`}
            allowImage={true}
            allowVideo={false}
            allowColor={false}
            defaultShow="image"
            defaultOpen={false}
            value={mediaItem || createDefaultMultimedia("image")}
            onChange={(val) => updateItem(itemIdx, { ...val, show: "image" })}
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
          className="flex items-center justify-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 py-2 text-xs font-medium text-primary cursor-pointer transition shadow-2xs"
        >
          <Plus className="h-4 w-4" /> Add Image
        </button>
      </div>
    </div>
  )
}

export default ImageBlockForm
