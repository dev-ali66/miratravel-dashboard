import { useEffect, useState, useRef } from "react"
import { Loader2, Save, RotateCcw } from "lucide-react"
import { useParams, useSearchParams } from "react-router-dom"

import { useLocationPage } from "@/hooks/location/useLocationPage"
import { useLocationDraft } from "./shared/LocationDraftContext"
import { emptyLocation } from "./shared/emptyLocation"
import { thethSampleLocation } from "./shared/thethSampleLocation"
import { mergeWithDefaults } from "./shared/mergeWithDefaults"
import {
  locationSectionOrder,
  locationSectionRegistry,
} from "./config/locationSections"

/* =====================================================
   PROPS
===================================================== */

type LocationFormProps = {}

/* =====================================================
   COMPONENT

   Thin shell only: all section-specific fields live in
   sections/<key>/<Name>Form.tsx, ordered and looked up via
   config/locationSections.ts. This same component is used
   for both Add (no :id param) and Edit (:id present).
===================================================== */

export function LocationForm({ }: LocationFormProps) {
  const { id, slug } = useParams()
  const [searchParams] = useSearchParams()

  const { draft, setDraft, resetDraft } = useLocationDraft()

  const { updateField, save, isEditMode, isLoading, isError, isSaving } =
    useLocationPage(id, slug)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "basic-info": true,
  })

  const autoAddTriggered = useRef(false)

  /* ================================================
       ADD MODE: start from the fetched Theth template
       so all sections have real live data immediately.
       EDIT MODE: merge the fetched record over the default
       skeleton so a partial/incomplete API record never
       crashes the form.
    ================================================= */

  // When entering Add mode, initialize draft with the Theth API sample data
  useEffect(() => {
    if (!isEditMode) {
      resetDraft(structuredClone(thethSampleLocation))
    }
  }, [isEditMode, resetDraft])

  // Optional: Auto-add if query param ?autoAdd=true is passed
  useEffect(() => {
    if (!isEditMode && searchParams.get("autoAdd") === "true" && draft && !isSaving && !autoAddTriggered.current) {
      autoAddTriggered.current = true
      save()
    }
  }, [isEditMode, searchParams, draft, isSaving, save])

  // When in Edit mode, normalize the fetched draft over defaults.
  useEffect(() => {
    if (!isEditMode) return
    if (!draft) return

    const normalizedDraft = mergeWithDefaults(emptyLocation, draft)

    setDraft((current) => {
      try {
        if (JSON.stringify(current) === JSON.stringify(normalizedDraft)) {
          return current
        }
      } catch (e) {
        // fall back to replacing if serialization fails
      }

      return normalizedDraft
    })
  }, [draft, isEditMode, setDraft])

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
            Failed to load location.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Please try again.
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
                HEADER
            ================================================= */}

      <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Location
            </p>

            <h2 className="mt-1 truncate text-base font-semibold">
              {isEditMode ? draft.name || "Edit Location" : "Add Location"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                type="button"
                onClick={() => resetDraft(structuredClone(thethSampleLocation))}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
                title="Reset form with Theth API data"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Load Theth Data
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

              {isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
                SECTIONS — order + components come from
                config/locationSections.ts, the single source
                of truth shared with LocationPreview.tsx.
            ================================================= */}

      <div className="flex-1 space-y-3 p-4">
        {locationSectionOrder.map((key) => {
          const SectionForm = locationSectionRegistry[key].form

          return (
            <div key={key} data-section={key} className="transition-all">
              <SectionForm
                draft={draft}
                updateField={updateField}
                openSections={openSections}
                toggleSection={toggleSection}
              />
            </div>
          )
        })}

        {/* =================================================
                    SAVE BUTTON
                ================================================= */}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {isEditMode ? "Update Location" : "Create Location"}
          </button>
        </div>
      </div>
    </div>
  )
}
