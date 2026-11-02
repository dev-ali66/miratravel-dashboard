import React from "react"
import { Loader2, Save, Terminal } from "lucide-react"

export interface EditorFormHeaderProps {
  /** Eyebrow text displayed above the title in uppercase (e.g. "LOCATION", "JOURNEY", "CMS PAGE") */
  eyebrow: string
  /** Main title of the entity being edited or created */
  title: string
  /** Callback fired when clicking the "Console Data" button */
  onConsoleData?: () => void
  /** Tooltip or title attribute for the Console Data button */
  consoleDataTitle?: string
  /** Save / Submit callback */
  onSave: () => void
  /** Loading/Saving state indicator */
  isSaving?: boolean
  /** Whether the entity is in edit mode (if true, shows "Update", otherwise "Create") - or custom saveLabel */
  isEditMode?: boolean
  /** Explicit save button label override (e.g. "Save", "Save Changes", "Update", "Create") */
  saveLabel?: string
  /** Whether the save button should be disabled */
  disabled?: boolean
  /** Optional extra action buttons or badges */
  extraActions?: React.ReactNode
}

/**
 * Universal sticky header for sidebar forms across Location, Journey, Experience, Stories, and CMS Editors.
 * Ensures 100% identical styling, spacing, typography, and button dimensions across the entire dashboard.
 */
export function EditorFormHeader({
  eyebrow,
  title,
  onConsoleData,
  consoleDataTitle = "Inspect clean payload sent to backend API in browser console (F12)",
  onSave,
  isSaving = false,
  isEditMode,
  saveLabel,
  disabled = false,
  extraActions,
}: EditorFormHeaderProps) {
  const resolvedSaveLabel =
    saveLabel ?? (isEditMode !== undefined ? (isEditMode ? "Update" : "Create") : "Save")

  return (
    <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-3 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {eyebrow}
          </p>

          <h2 className="mt-1 truncate text-base font-semibold text-foreground">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {extraActions}

          {onConsoleData && (
            <button
              type="button"
              onClick={onConsoleData}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
              title={consoleDataTitle}
            >
              <Terminal className="h-3.5 w-3.5 text-primary" />
              Console Data
            </button>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || disabled}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {resolvedSaveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditorFormHeader
