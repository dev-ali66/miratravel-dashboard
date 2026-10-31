import { RichTextEditor } from "@/components/shared/RichTextEditor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, Trash2, Plus, FileText } from "lucide-react"
import type { TermsItem } from "./types"

interface TermsOfServiceEditorProps {
  currentItem?: TermsItem
  activeTab: string
  itemIndex: number
  totalItems: number
  onContentChange: (newContent: string) => void
  onUpdateItemTitle: (tabTitle: string, fullTitle: string) => void
  onMoveItem: (direction: "up" | "down") => void
  onRemoveItem: () => void
  onAddSection: () => void
}

export function TermsOfServiceEditor({
  currentItem,
  activeTab,
  itemIndex,
  totalItems,
  onContentChange,
  onUpdateItemTitle,
  onMoveItem,
  onRemoveItem,
  onAddSection,
}: TermsOfServiceEditorProps) {
  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border/70 rounded-lg bg-card/40 text-center">
        <FileText className="h-10 w-10 text-muted-foreground/50 mb-2.5" />
        <h3 className="text-sm font-semibold text-foreground">No Document Sections Configured</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Add dynamic sections to configure terms & conditions, privacy rules, or legal policies for your site.
        </p>
        <Button
          type="button"
          onClick={onAddSection}
          className="mt-4 flex items-center gap-1.5 h-8 text-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add First Section</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-lg border border-border/70 bg-card p-4">
      {/* Top Header & Actions matching Journey and Location inner item cards */}
      <div className="flex flex-col justify-between gap-3 border-b border-border/40 pb-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Section #{itemIndex + 1}: {currentItem.fullTitle || "Untitled Section"}
          </h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Configure titles, display order, and rich text body content for this section.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={itemIndex === 0}
            onClick={() => onMoveItem("up")}
            className="h-7 gap-1 px-2.5 text-xs cursor-pointer rounded-md border-border/80"
            title="Move Section Up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Up</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={itemIndex === totalItems - 1}
            onClick={() => onMoveItem("down")}
            className="h-7 gap-1 px-2.5 text-xs cursor-pointer rounded-md border-border/80"
            title="Move Section Down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
            <span>Down</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemoveItem}
            className="h-7 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-md"
            title="Delete this section"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Editable Titles Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Tab Label
          </Label>
          <Input
            value={currentItem.tabTitle}
            onChange={(e) => onUpdateItemTitle(e.target.value, currentItem.fullTitle)}
            placeholder="e.g. Item 1"
            className="bg-background font-medium text-xs"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Full Section Heading
          </Label>
          <Input
            value={currentItem.fullTitle}
            onChange={(e) => onUpdateItemTitle(currentItem.tabTitle, e.target.value)}
            placeholder="e.g. 1. Introduction & Scope of Agreement"
            className="bg-background font-semibold text-xs"
          />
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="pt-1 space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase block">
          Section Body Content
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
