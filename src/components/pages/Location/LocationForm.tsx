import MiraLoader from "@/components/shared/MiraLoader"
import { useEffect, useState, useRef } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { EditorFormHeader } from "@/components/shared/EditorFormHeader"

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

  useEffect(() => {
    const handleActiveSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionKey: string }>
      if (customEvent.detail?.sectionKey) {
        const key = customEvent.detail.sectionKey
        setOpenSections({ [key]: true })
      }
    }

    window.addEventListener("editor-active-section-change", handleActiveSectionChange)
    return () => {
      window.removeEventListener("editor-active-section-change", handleActiveSectionChange)
    }
  }, [])

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
      <MiraLoader text="Loading location editor data..." className="min-h-[400px] py-16" />
    )
  }

  if (isEditMode && isError) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
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
    return <MiraLoader text="Loading location data..." className="min-h-[400px] py-16" />
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
                HEADER (Universal Sticky Header)
            ================================================= */}
      <EditorFormHeader
        eyebrow="Location"
        title={isEditMode ? draft.name || "Edit Location" : "Add Location"}
        isEditMode={isEditMode}
        isSaving={isSaving}
        onSave={save}
        onConsoleData={() => {
          const cleanPayload = normalizeLocationPayload(draft)
          if (!isEditMode) {
            delete (cleanPayload as any).id
            if (!cleanPayload.slug) delete (cleanPayload as any).slug
          }
          console.log("📍 [CLEAN API PAYLOAD SENT TO BACKEND]:", cleanPayload)
        }}
        consoleDataTitle="Inspect clean location payload sent to backend API in browser console (F12)"
      />

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
