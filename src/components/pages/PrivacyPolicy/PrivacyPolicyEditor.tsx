import { RichTextEditor } from "@/components/shared/RichTextEditor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react"
import type { PolicyPart } from "./types"

interface PrivacyPolicyEditorProps {
  currentPart: PolicyPart | undefined
  activeTab: string
  partIndex: number
  totalParts: number
  onContentChange: (newContent: string) => void
  onTitleChange: (field: "tabTitle" | "fullTitle", value: string) => void
  onDeletePart: (id: string) => void
  onMovePart: (index: number, direction: "up" | "down") => void
  onAddPart: () => void
}

export function PrivacyPolicyEditor({
  currentPart,
  activeTab,
  partIndex,
  totalParts,
  onContentChange,
  onTitleChange,
  onDeletePart,
  onMovePart,
  onAddPart,
}: PrivacyPolicyEditorProps) {
  if (!currentPart) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/50 py-16 text-center shadow-sm">
        <h3 className="text-lg font-bold text-foreground">No Section Selected</h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          There are currently no sections in this Privacy Policy document or no section is selected.
        </p>
        <button
          type="button"
          onClick={onAddPart}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add First Section
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-hidden rounded-2xl border border-border/60 bg-background/50 p-6 shadow-sm backdrop-blur-xl">
      {/* Title & Action Controls */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              Section {partIndex + 1} of {totalParts}
            </span>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <button
              type="button"
              disabled={partIndex === 0}
              onClick={() => onMovePart(partIndex, "up")}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border/60 bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              title="Move Up"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>Up</span>
            </button>
            <button
              type="button"
              disabled={partIndex === totalParts - 1}
              onClick={() => onMovePart(partIndex, "down")}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border/60 bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              title="Move Down"
            >
              <ArrowDown className="h-3.5 w-3.5" />
              <span>Down</span>
            </button>
            <button
              type="button"
              onClick={() => onDeletePart(currentPart.id)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground"
              title="Delete Section"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="space-y-1.5 sm:col-span-4">
            <Label className="text-xs font-semibold text-foreground">Tab Label (Short Name)</Label>
            <Input
              value={currentPart.tabTitle}
              onChange={(e) => onTitleChange("tabTitle", e.target.value)}
              placeholder="e.g. Data Collection"
              className="bg-background text-xs font-medium"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-8">
            <Label className="text-xs font-semibold text-foreground">Full Heading Title</Label>
            <Input
              value={currentPart.fullTitle}
              onChange={(e) => onTitleChange("fullTitle", e.target.value)}
              placeholder="e.g. Information We Collect"
              className="bg-background text-xs font-medium"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">Section Rich Text Content</Label>
        <RichTextEditor
          key={activeTab}
          value={currentPart.content}
          onChange={onContentChange}
          className="min-h-100"
          canvasClassName="max-h-[65vh]"
        />
      </div>
    </div>
  )
}

