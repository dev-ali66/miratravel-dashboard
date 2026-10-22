import MiraLoader from "@/components/shared/MiraLoader"
import { useEffect, useState } from "react"
import { Loader2, Save, Terminal } from "lucide-react"
import { useParams } from "react-router-dom"

import { useExperiencePage } from "@/hooks/experience/useExperiencePage"
import { useExperienceDraft } from "./shared/ExperienceDraftContext"
import { emptyExperience } from "./shared/emptyExperience"
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

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "basic-info": true,
  })

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

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const handleConsoleData = () => {
    console.group("🧭 [Experience Form] Current Draft State")
    console.log("Raw Draft:", draft)
    console.groupEnd()
    toast.info("Experience payload printed to browser console (F12).")
  }

  if (isEditMode && isLoading) {
    return (
      <MiraLoader text="Loading experience editor data..." className="min-h-[400px] py-16" />
    )
  }

  if (isEditMode && isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-semibold text-destructive">
          Failed to load experience details.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Please check your network connection or verify that the experience ID exists.
        </p>
      </div>
    )
  }

  const sectionsToRender = getExperienceSections()

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action Header Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">
            {isEditMode ? "Edit Experience" : "Create New Experience"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure editorial narrative, pricing, and visual media.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Console Data Log Button */}
          <button
            type="button"
            onClick={handleConsoleData}
            title="Inspect current draft in browser console"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Console Data</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>{isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Create Experience"}</span>
          </button>
        </div>
      </div>

      {/* Render Dynamic Section Accordions */}
      <div className="flex flex-col gap-4">
        {sectionsToRender.map((sectionKey, index) => {
          const entry = experienceSectionRegistry[sectionKey]
          if (!entry || !entry.form) return null

          const SectionForm = entry.form
          const sectionNum = String(index + 1).padStart(2, "0")

          return (
            <SectionForm
              key={sectionKey}
              draft={draft || emptyExperience}
              updateField={updateField}
              openSections={openSections}
              toggleSection={toggleSection}
              sectionNumber={sectionNum}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ExperienceForm
