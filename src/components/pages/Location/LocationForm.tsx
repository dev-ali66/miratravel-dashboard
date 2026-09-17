import { useEffect, useState, useRef } from "react"
import { Loader2, Save, Terminal } from "lucide-react"
import { useParams, useSearchParams } from "react-router-dom"

import { useLocationPage } from "@/hooks/location/useLocationPage"
import { useLocationDraft } from "./shared/LocationDraftContext"
import { emptyLocation } from "./shared/emptyLocation"
import { normalizeLocationPayload } from "./shared/normalizeLocationPayload"
import {
  getSectionsForLocationType,
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
   config/locationSections.ts. Dynamic section order and
   visibility is driven by getSectionsForLocationType(draft?.type).
===================================================== */

export function LocationForm({ }: LocationFormProps) {
  const { id, slug } = useParams()
  const [searchParams] = useSearchParams()

  const { draft, setDraft, resetDraft } = useLocationDraft()

  const { updateField, save, isEditMode, isLoading, isError, isSaving } =
    useLocationPage(id, slug)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const autoAddTriggered = useRef(false)
  const prevTypeRef = useRef(draft?.type)

  // Auto-clean draft in memory whenever location type changes (removes inactive sections)
  useEffect(() => {
    if (draft?.type && prevTypeRef.current && prevTypeRef.current !== draft.type) {
      prevTypeRef.current = draft.type
      setDraft((current) => (current ? (normalizeLocationPayload(current) as any) : current))
    } else {
      prevTypeRef.current = draft?.type
    }
  }, [draft?.type, setDraft])

  /* ================================================
       ADD MODE: start from completely empty skeleton.
       EDIT MODE: merge the fetched record over the default
       skeleton so a partial/incomplete API record never
       crashes the form.
    ================================================= */

  // When entering Add mode, initialize draft with empty clean state
  useEffect(() => {
    if (!isEditMode) {
      resetDraft(structuredClone(emptyLocation))
    }
  }, [isEditMode, resetDraft])

  // Optional: Auto-add if query param ?autoAdd=true is passed
  useEffect(() => {
    if (!isEditMode && searchParams.get("autoAdd") === "true" && draft && !isSaving && !autoAddTriggered.current) {
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
    setOpenSections((current) => {
      const isCurrentlyOpen = !!current[section]
      return isCurrentlyOpen ? {} : { [section]: true }
    })
  }

  const activeSections = getSectionsForLocationType(draft?.type)

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
            <button
              type="button"
              onClick={() => {
                const cleanPayload = normalizeLocationPayload(draft)
                if (!isEditMode) {
                  delete (cleanPayload as any).id
                  if (!cleanPayload.slug) delete (cleanPayload as any).slug
                }
                console.log("📍 [RAW MEMORY DRAFT]:", draft)
                console.log("📍 [CLEAN API PAYLOAD SENT TO BACKEND]:", cleanPayload)
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
              title="Inspect clean location payload sent to backend API in browser console (F12)"
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

              {isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
                SECTIONS — order + components come dynamically
                from getSectionsForLocationType(draft?.type).
            ================================================= */}

      <div className="flex-1 divide-y divide-border/60">
        {activeSections.map((key, index) => {
          const sectionEntry = locationSectionRegistry[key]
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
