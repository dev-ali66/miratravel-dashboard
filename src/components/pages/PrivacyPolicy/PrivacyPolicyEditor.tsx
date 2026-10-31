import { RichTextEditor } from "@/components/shared/RichTextEditor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react"
import type { PolicyItem } from "./types"

interface PrivacyPolicyEditorProps {
  currentItem: PolicyItem | undefined
  activeTab: string
  itemIndex: number
  totalItems: number
  onContentChange: (newContent: string) => void
  onTitleChange: (field: "tabTitle" | "fullTitle", value: string) => void
  onDeleteItem: (id: string) => void
  onMoveItem: (index: number, direction: "up" | "down") => void
  onAddItem: () => void
}

export function PrivacyPolicyEditor({
  currentItem,
  activeTab,
  itemIndex,
  totalItems,
  onContentChange,
  onTitleChange,
  onDeleteItem,
  onMoveItem,
  onAddItem,
}: PrivacyPolicyEditorProps) {
  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/50 py-16 text-center shadow-sm">
        <h3 className="text-lg font-bold text-foreground">No Section Selected</h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          There are currently no sections in this Privacy Policy document or no section is selected.
        </p>
        <button
          type="button"
          onClick={onAddItem}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add First Section
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-hidden rounded-xl border border-border/60 bg-background/50 p-6 shadow-sm backdrop-blur-xl">
      {/* Title & Action Controls */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              Section {itemIndex + 1} of {totalItems}
            </span>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <button
              type="button"
              onClick={() => onMoveItem(itemIndex, "up")}
              disabled={itemIndex === 0}
              className="flex items-center gap-1 rounded-md border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted disabled:opacity-40 cursor-pointer"
              title="Move Up"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>Up</span>
            </button>

            <button
              type="button"
              onClick={() => onMoveItem(itemIndex, "down")}
              disabled={itemIndex === totalItems - 1}
              className="flex items-center gap-1 rounded-md border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted disabled:opacity-40 cursor-pointer"
              title="Move Down"
            >
              <ArrowDown className="h-3.5 w-3.5" />
              <span>Down</span>
            </button>

            <button
              type="button"
              onClick={() => onDeleteItem(currentItem.id)}
              className="flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-semibold text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
              title="Delete Section"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Tab / Nav Title
            </Label>
            <Input
              value={currentItem.tabTitle}
              onChange={(e) => onTitleChange("tabTitle", e.target.value)}
              placeholder="e.g. Introduction"
              className="font-medium text-xs bg-background/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Full Section Heading
            </Label>
            <Input
              value={currentItem.fullTitle}
              onChange={(e) => onTitleChange("fullTitle", e.target.value)}
              placeholder="e.g. Introduction & Scope"
              className="font-bold text-xs bg-background/50"
            />
          </div>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="space-y-2">
        <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Section Body Content (HTML)
        </Label>
        <RichTextEditor
          key={activeTab}
          value={currentItem.content}
          onChange={onContentChange}
          className="min-h-100"
          canvasClassName="max-h-[65vh]"
        />
      </div>
    </div>
  )
}
