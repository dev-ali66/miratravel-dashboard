import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RepeaterListProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  /** Renders the fields for a single item. Call `update` with the new item value on any edit. */
  renderItem: (
    item: T,
    update: (value: T) => void,
    index: number
  ) => React.ReactNode
  newItem?: () => T
  newItemTemplate?: () => T
  title?: string
  addLabel?: string
  emptyLabel?: string
  itemLabel?: (item: T, index: number) => string
  collapsible?: boolean
  defaultExpanded?: boolean
  className?: string
}

export function RepeaterList<T>({
  items,
  onChange,
  renderItem,
  newItem,
  newItemTemplate,
  addLabel = "Add item",
  emptyLabel = "No items yet.",
  itemLabel,
  collapsible = true,
  defaultExpanded = false,
  className,
}: RepeaterListProps<T>) {
  const safeItems = items ?? []
  const createItem = newItem || newItemTemplate || (() => ({} as T))
  const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({})

  const isExpanded = (index: number) => {
    if (!collapsible) return true
    if (expandedIndexes[index] !== undefined) {
      return expandedIndexes[index]
    }
    return defaultExpanded
  }

  const toggleExpand = (index: number) => {
    if (!collapsible) return
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !isExpanded(index),
    }))
  }

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

    setExpandedIndexes((prev) => {
      const newExpanded = { ...prev }
      const currentExpanded = isExpanded(index)
      const targetExpanded = isExpanded(target)
      newExpanded[index] = targetExpanded
      newExpanded[target] = currentExpanded
      return newExpanded
    })

    onChange(next)
  }

  const handleAdd = () => {
    const nextItems = [...safeItems, createItem()]
    const newIdx = nextItems.length - 1
    if (collapsible) {
      setExpandedIndexes((prev) => ({ ...prev, [newIdx]: true }))
    }
    onChange(nextItems)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {safeItems.length === 0 && (
        <p className="rounded-md border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
          {emptyLabel}
        </p>
      )}

      {safeItems.map((item, index) => {
        const expanded = isExpanded(index)

        return (
          <div
            key={index}
            className="rounded-lg border border-border/60 bg-muted/20 transition-all overflow-hidden"
          >
            <div
              onClick={() => toggleExpand(index)}
              className={cn(
                "flex items-center justify-between gap-2 p-3 select-none",
                collapsible && "cursor-pointer hover:bg-muted/40",
                expanded && collapsible && "border-b border-border/50 bg-card/50"
              )}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {collapsible && (
                  expanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )
                )}
                <span className="truncate max-w-[240px]">
                  {itemLabel ? itemLabel(item, index) : `Item ${index + 1}`}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
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

            {expanded && (
              <div className="p-3">
                {renderItem(item, (value) => update(index, value), index)}
              </div>
            )}
          </div>
        )
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={handleAdd}
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </Button>
    </div>
  )
}

