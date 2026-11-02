import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Loader2, PanelLeftClose, Save, Terminal } from "lucide-react"
import { useUniversalEditor } from "@/components/layout/UniversalEditorLayout"
import { useDevMode } from "@/context/DevModeContext"
import { cn } from "@/lib/utils"

export interface EditorFormHeaderProps {
  /** Eyebrow text displayed above the title in uppercase (e.g. "LOCATION", "JOURNEY", "CMS PAGE") */
  eyebrow: string
  /** Main title of the entity being edited or created */
  title: string
  /** Optional back url override */
  backToUrl?: string
  /** Optional back button label/tooltip */
  backToLabel?: string
  /** Custom onBack handler if not using backToUrl or layout context */
  onBack?: () => void
  /** Optional icon component override */
  icon?: React.ComponentType<{ className?: string }>
  /** Optional icon color class override */
  iconColor?: string
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
 * Houses:
 *  - [<- Back] button
 *  - Vertical divider
 *  - Entity Icon + Eyebrow & Title
 *  - Sidebar Collapse Toggle Button [|<-]
 *  - Actions on right: Console Data (Icon only) & Save/Create/Update (Icon only with spinner)
 */
export function EditorFormHeader({
  eyebrow,
  title,
  backToUrl: propBackToUrl,
  backToLabel: propBackToLabel,
  onBack,
  icon: propIcon,
  iconColor: propIconColor,
  onConsoleData,
  consoleDataTitle = "Inspect clean payload sent to backend API in browser console (F12)",
  onSave,
  isSaving = false,
  isEditMode,
  saveLabel,
  disabled = false,
  extraActions,
}: EditorFormHeaderProps) {
  const navigate = useNavigate()
  const editorLayout = useUniversalEditor()
  const { isDevMode } = useDevMode()

  const resolvedSaveLabel =
    saveLabel ?? (isEditMode !== undefined ? (isEditMode ? "Update" : "Create") : "Save")

  const effectiveBackUrl = propBackToUrl || editorLayout?.backToUrl
  const effectiveBackLabel = propBackToLabel || editorLayout?.backToLabel || "Back"
  const IconComponent = propIcon || editorLayout?.icon
  const effectiveIconColor = propIconColor || editorLayout?.iconColor || "text-primary"

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (effectiveBackUrl) {
      navigate(effectiveBackUrl)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="sticky top-0 z-20 border-b border-border/60 bg-card px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section: Back Button | Eyebrow & Title */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
            title={effectiveBackLabel}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="h-5 w-px shrink-0 bg-border/60" />

          {/* Eyebrow & Title */}
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold tracking-[0.2em] text-muted-foreground uppercase leading-none">
              {eyebrow}
            </p>
            <h2 className="mt-0.5 truncate text-sm font-semibold text-foreground leading-tight">
              {title}
            </h2>
          </div>
        </div>

        {/* Right Section: Action Buttons + Hide Form Sidebar Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {extraActions}

          {/* Console Data: Icon only (Shown ONLY when Dev Mode is ON) */}
          {isDevMode && onConsoleData && (
            <button
              type="button"
              onClick={onConsoleData}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 transition hover:bg-amber-500/20 cursor-pointer shadow-2xs"
              title={consoleDataTitle}
              aria-label={consoleDataTitle}
            >
              <Terminal className="h-4 w-4" />
            </button>
          )}

          {/* Create / Update / Save: Icon only */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || disabled}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            title={resolvedSaveLabel}
            aria-label={resolvedSaveLabel}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </button>

          {/* Sidebar Collapse Toggle Button positioned at far right */}
          {editorLayout && (
            <button
              type="button"
              onClick={editorLayout.toggleSidebarCollapsed}
              className="hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Hide Form Sidebar (Expand Preview)"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditorFormHeader

