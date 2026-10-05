import { Save, Loader2, Plus, Edit3, Eye, Columns } from "lucide-react"

export type ViewMode = "edit" | "preview" | "split"

interface PrivacyPolicyHeaderProps {
  onSave: () => void
  isSaving: boolean
  onAddPart: () => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

export function PrivacyPolicyHeader({
  onSave,
  isSaving,
  onAddPart,
  viewMode,
  setViewMode,
}: PrivacyPolicyHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          MIRA PRIVACY POLICY
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage dynamic document sections, titles, dates and rich text content below.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* View Mode Toggle Pills */}
        <div className="flex items-center rounded-xl border border-border/80 bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "edit"
                ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "preview"
                ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5 text-emerald-600" />
            <span>1:1 Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "split"
                ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="h-3.5 w-3.5 text-primary" />
            <span>Split View</span>
          </button>
        </div>

        <button
          onClick={onAddPart}
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-background px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted active:scale-95"
        >
          <Plus className="h-4 w-4 text-primary" />
          Add Section
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}


