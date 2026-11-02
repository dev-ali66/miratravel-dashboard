import MiraLoader from "@/components/shared/MiraLoader"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { EditorFormHeader } from "@/components/shared/EditorFormHeader"

import { useExperiencePage } from "@/hooks/experience/useExperiencePage"
import { useExperienceDraft } from "./shared/ExperienceDraftContext"
import { emptyExperience } from "./shared/emptyExperience"
import { normalizeExperiencePayload } from "./shared/normalizeExperiencePayload"
import {
  getExperienceSections,
  experienceSectionRegistry,
} from "./config/experienceSections"
import { toast } from "sonner"

export function ExperienceForm() {
  const { id, slug } = useParams()

  const { draft, resetDraft } = useExperienceDraft()

  const { updateField, save, isEditMode, isLoading, isError, isSaving } =
    useExperiencePage(id, slug)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

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

  // When entering Add mode, initialize draft with empty skeleton
  useEffect(() => {
    if (!isEditMode) {
      resetDraft(structuredClone(emptyExperience))
    }
  }, [isEditMode, resetDraft])

  if (isEditMode && isLoading) {
    return (
      <MiraLoader text="Loading experience editor data..." className="min-h-[400px] py-16" />
    )
  }

  if (isEditMode && isError) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-center">
          <p className="text-sm font-semibold text-destructive">
            Failed to load experience details.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please check your network connection or verify that the experience ID exists.
          </p>
        </div>
      </div>
    )
  }

  if (!draft) {
    return <MiraLoader text="Loading experience data..." className="min-h-[400px] py-16" />
  }

  const toggleSection = (section: string) => {
    setOpenSections((current) => {
      const isCurrentlyOpen = !!current[section]
      return isCurrentlyOpen ? {} : { [section]: true }
    })
  }

  const sectionsToRender = getExperienceSections()

  return (
    <div className="flex min-h-full flex-col">
      {/* =================================================
                HEADER (Universal Sticky Header)
            ================================================= */}
      <EditorFormHeader
        eyebrow="Experience"
        title={isEditMode ? draft.name || "Edit Experience" : "Add Experience"}
        isEditMode={isEditMode}
        isSaving={isSaving}
        onSave={save}
        onConsoleData={() => {
          const cleanPayload = normalizeExperiencePayload(draft)
          if (!isEditMode) {
            delete (cleanPayload as any).id
            if (!cleanPayload.slug) delete (cleanPayload as any).slug
          }
          console.log("🧭 [CLEAN API PAYLOAD SENT TO BACKEND]:", cleanPayload)
          toast.info("Clean experience payload logged to browser console (F12)")
        }}
        consoleDataTitle="Inspect clean experience payload sent to backend API in browser console (F12)"
      />

      {/* =================================================
                SECTIONS — Continuous divide-y accordion layout
            ================================================= */}
      <div className="flex-1 divide-y divide-border/60">
        {sectionsToRender.map((key, index) => {
          const sectionEntry = experienceSectionRegistry[key]
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

export default ExperienceForm

