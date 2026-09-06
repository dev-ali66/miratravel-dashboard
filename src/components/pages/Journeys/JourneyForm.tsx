import { useEffect, useState, useRef } from "react"
import { Loader2, Save, RotateCcw, Compass } from "lucide-react"
import { useParams, useSearchParams } from "react-router-dom"

import { useJourneyPage } from "@/hooks/journey/useJourneyPage"
import { useJourneyDraft } from "./shared/JourneyDraftContext"
import { classicAlbaniaSampleJourney } from "./shared/classicAlbaniaSampleJourney"
import {
  journeySectionOrder,
  journeySectionRegistry,
} from "./config/journeySections"

export function JourneyForm() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>()
  const [searchParams] = useSearchParams()

  const { draft, resetDraft } = useJourneyDraft()

  const { updateField, save, isEditMode, isLoading, isError, isSaving } =
    useJourneyPage(id, slug)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "basic-info": true,
  })

  const autoAddTriggered = useRef(false)

  /* ================================================
     ADD MODE: Initialize draft with classic Albania
     sample so all fields have rich, authentic data.
     EDIT MODE: Fetched draft is loaded via useJourneyPage.
  ================================================= */
  useEffect(() => {
    if (!isEditMode && !draft) {
      resetDraft(structuredClone(classicAlbaniaSampleJourney))
    }
  }, [isEditMode, draft, resetDraft])

  // Auto-save if query param ?autoAdd=true is passed
  useEffect(() => {
    if (
      !isEditMode &&
      searchParams.get("autoAdd") === "true" &&
      draft &&
      !isSaving &&
      !autoAddTriggered.current
    ) {
      autoAddTriggered.current = true
      save()
    }
  }, [isEditMode, searchParams, draft, isSaving, save])

  if (isEditMode && isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isEditMode && isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            Failed to load journey.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please verify the ID or try again later.
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
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }))
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* =================================================
          TOP STICKY ACTION HEADER
      ================================================= */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase flex items-center gap-1.5">
              <Compass className="h-3 w-3 text-[#af6348]" />
              Journey Editor
            </p>
            <h2 className="mt-1 truncate text-base font-semibold text-foreground">
              {isEditMode ? draft.title || "Edit Journey" : "New Journey"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                type="button"
                onClick={() =>
                  resetDraft(structuredClone(classicAlbaniaSampleJourney))
                }
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
                title="Fill with authentic Albania itinerary data"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Load Albania Data
              </button>
            )}

            <button
              type="button"
              onClick={save}
              disabled={isSaving}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEditMode ? "Update" : "Save Journey"}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          ACCORDION SECTIONS
      ================================================= */}
      <div className="flex-1 space-y-3 p-4">
        {journeySectionOrder.map((key) => {
          const SectionEntry = journeySectionRegistry[key]
          if (!SectionEntry) return null
          const SectionForm = SectionEntry.form

          return (
            <SectionForm
              key={key}
              draft={draft}
              updateField={updateField}
              openSections={openSections}
              toggleSection={toggleSection}
            />
          )
        })}

        {/* BOTTOM SAVE BUTTON */}
        <div className="flex justify-end pt-3 pb-8">
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 shadow-sm"
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
  )
}
