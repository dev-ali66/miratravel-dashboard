import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RepeaterListProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  /** Renders the fields for a single item. Call `update` with the new item value on any edit. */
  renderItem: (item: T, update: (value: T) => void, index: number) => React.ReactNode
  newItem: () => T
  addLabel?: string
  emptyLabel?: string
  itemLabel?: (item: T, index: number) => string
  className?: string
}

export function RepeaterList<T>({
  items,
  onChange,
  renderItem,
  newItem,
  addLabel = "Add item",
  emptyLabel = "No items yet.",
  itemLabel,
  className,
}: RepeaterListProps<T>) {
  const safeItems = items ?? []

  const update = (index: number, value: T) => {
    const next = [...safeItems]
    next[index] = value
    onChange(next)
  }

  const remove = (index: number) => {
    onChange(safeItems.filter((_, i) => i !== index))
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= safeItems.length) return
    const next = [...safeItems]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {safeItems.length === 0 && (
        <p className="rounded-md border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
          {emptyLabel}
        </p>
      )}

      {safeItems.map((item, index) => (
        <div key={index} className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <GripVertical className="h-3.5 w-3.5" />
              {itemLabel ? itemLabel(item, index) : `Item ${index + 1}`}
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                title="Move up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={index === safeItems.length - 1}
                onClick={() => move(index, 1)}
                title="Move down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => remove(index)}
                title="Remove"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {renderItem(item, (value) => update(index, value), index)}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => onChange([...safeItems, newItem()])}
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </Button>
    </div>
  )
}
