import MiraLoader from "@/components/shared/MiraLoader"
import { useEffect, useState } from "react"
import { Loader2, Save, Terminal } from "lucide-react"
import { useParams } from "react-router-dom"

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
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center">
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

  const sectionsToRender = getExperienceSections()

  return (
    <div className="flex min-h-full flex-col">
      {/* =================================================
                HEADER (Sticky matching LocationForm)
            ================================================= */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Experience
            </p>

            <h2 className="mt-1 truncate text-base font-semibold">
              {isEditMode ? draft.name || "Edit Experience" : "Add Experience"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const cleanPayload = normalizeExperiencePayload(draft)
                if (!isEditMode) {
                  delete (cleanPayload as any).id
                  if (!cleanPayload.slug) delete (cleanPayload as any).slug
                }
                console.log("🧭 [CLEAN API PAYLOAD SENT TO BACKEND]:", cleanPayload)
                toast.info("Clean experience payload logged to browser console (F12)")
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
              title="Inspect clean experience payload sent to backend API in browser console (F12)"
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

