import MiraLoader from "@/components/shared/MiraLoader"
import { useEffect, useState, useRef } from "react"
import { Loader2, Save, Terminal } from "lucide-react"
import { useParams, useSearchParams } from "react-router-dom"

import { useJourneyPage } from "@/hooks/journey/useJourneyPage"
import { useJourneyDraft } from "./shared/JourneyDraftContext"
import { emptyJourney } from "./shared/emptyJourney"
import { normalizeJourneyPayload } from "./shared/normalizeJourneyPayload"
import {
  getSectionsForJourney,
  journeySectionRegistry,
} from "./config/journeySections"

export function JourneyForm() {
  const { id, slug } = useParams()
  const [searchParams] = useSearchParams()

  const { draft, resetDraft } = useJourneyDraft()

  const { updateField, save, isEditMode, isLoading, isError, isSaving } =
    useJourneyPage(id, slug)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "basic-info": true,
  })

  const autoAddTriggered = useRef(false)

  // When entering Add mode, initialize draft with clean empty state
  useEffect(() => {
    if (!isEditMode) {
      resetDraft(structuredClone(emptyJourney))
    }
  }, [isEditMode, resetDraft])

  // Auto add if query param ?autoAdd=true
  useEffect(() => {
    if (!isEditMode && searchParams.get("autoAdd") === "true" && draft && !isSaving && !autoAddTriggered.current) {
      autoAddTriggered.current = true
      save()
    }
  }, [isEditMode, searchParams, draft, isSaving, save])

  if (isEditMode && isLoading) {
    return (
      <MiraLoader text="Loading journey editor data..." className="min-h-[400px] py-16" />
    )
  }

  if (isEditMode && isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            Failed to load journey details.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please check connection and try again.
          </p>
        </div>
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const toggleSection = (section: string) => {
    setOpenSections((current) => {
      const isCurrentlyOpen = !!current[section]
      return isCurrentlyOpen ? {} : { [section]: true }
    })
  }

  const activeSections = getSectionsForJourney()

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Journey Editor
            </p>

            <h2 className="mt-1 truncate text-base font-semibold">
              {isEditMode ? draft.title || "Edit Journey" : "Create New Journey"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const cleanPayload = normalizeJourneyPayload(draft)
                if (!isEditMode) {
                  delete (cleanPayload as any).id
                }
                console.log("📍 [CLEAN JOURNEY API PAYLOAD]:", cleanPayload)
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
              title="Inspect clean payload in console (F12)"
            >
              <Terminal className="h-3.5 w-3.5 text-primary" />
              Console Data
            </button>

            <button
              type="button"
              onClick={save}
              disabled={isSaving}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {isEditMode ? "Update Journey" : "Create Journey"}
            </button>
          </div>
        </div>
      </div>

      {/* Sections Accordion */}
      <div className="flex-1 divide-y divide-border/60">
        {activeSections.map((key, index) => {
          const sectionEntry = journeySectionRegistry[key]
          const SectionForm = sectionEntry?.form

          if (!SectionForm) return null

          const sectionNumber = String(index + 1).padStart(2, "0")

          return (
            <div key={key} data-section={key} className="transition-all">
              <SectionForm
                draft={draft}
                updateField={updateField}
                openSections={openSections}
                toggleSection={toggleSection}
                sectionNumber={sectionNumber}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
