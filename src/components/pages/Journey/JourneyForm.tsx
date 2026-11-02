import MiraLoader from "@/components/shared/MiraLoader"
import { useEffect, useState, useRef } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { EditorFormHeader } from "@/components/shared/EditorFormHeader"

import { useJourneyPage } from "@/hooks/journey/useJourneyPage"
import { useJourneyDraft } from "./shared/JourneyDraftContext"
import { emptyJourney } from "./shared/emptyJourney"
import { normalizeJourneyPayload } from "./shared/normalizeJourneyPayload"
import {
  JOURNEY_SECTION_KEYS,
  JOURNEY_SECTION_CONFIGS,
} from "./config/journeySections"

/* =====================================================
   PROPS
===================================================== */

type JourneyFormProps = {}

/* =====================================================
   COMPONENT
   Thin shell only: all section-specific fields live in
   sections/<key>/<Name>Form.tsx, ordered and looked up via
   config/journeySections.ts. 1:1 match with LocationForm.
===================================================== */

export function JourneyForm({ }: JourneyFormProps) {
  const { id, slug } = useParams()
  const [searchParams] = useSearchParams()

  const { draft, resetDraft } = useJourneyDraft()

  const { updateField, save, isEditMode, isLoading, isError, isSaving } =
    useJourneyPage(id, slug)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const autoAddTriggered = useRef(false)

  /* ================================================
       ADD MODE: start from completely empty skeleton.
       EDIT MODE: merge the fetched record over the default
       skeleton so a partial/incomplete API record never
       crashes the form.
    ================================================= */

  // When entering Add mode, initialize draft with empty clean state
  useEffect(() => {
    if (!isEditMode) {
      resetDraft(structuredClone(emptyJourney))
    }
  }, [isEditMode, resetDraft])

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

  // Optional: Auto-add if query param ?autoAdd=true is passed
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
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            Failed to load journey details.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Please try again.
          </p>
        </div>
      </div>
    )
  }

  if (!draft) {
    return <MiraLoader text="Loading journey data..." className="min-h-[400px] py-16" />
  }

  const toggleSection = (section: string) => {
    setOpenSections((current) => {
      const isCurrentlyOpen = !!current[section]
      return isCurrentlyOpen ? {} : { [section]: true }
    })
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* =================================================
                HEADER (Universal Sticky Header)
            ================================================= */}
      <EditorFormHeader
        eyebrow="Journey"
        title={isEditMode ? draft.title || "Edit Journey" : "Add Journey"}
        isEditMode={isEditMode}
        isSaving={isSaving}
        onSave={save}
        onConsoleData={() => {
          const cleanPayload = normalizeJourneyPayload(draft)
          if (!isEditMode) {
            delete (cleanPayload as any).id
            if (!cleanPayload.slug) delete (cleanPayload as any).slug
          }
          console.log("📍 [CLEAN JOURNEY API PAYLOAD SENT TO BACKEND]:", cleanPayload)
        }}
        consoleDataTitle="Inspect clean journey payload sent to backend API in browser console (F12)"
      />

      {/* =================================================
                SECTIONS — order + components come dynamically
                from JOURNEY_SECTION_KEYS.
            ================================================= */}

      <div className="flex-1 divide-y divide-border/60">
        {JOURNEY_SECTION_KEYS.map((key, index) => {
          const sectionConfig = JOURNEY_SECTION_CONFIGS[key]
          const SectionForm = sectionConfig?.formComponent

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

export default JourneyForm
