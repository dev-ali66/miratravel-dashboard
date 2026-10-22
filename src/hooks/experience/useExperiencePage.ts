import { useCallback, useEffect } from "react"
import { useAddExperience } from "./useAddExperience"
import { useExperienceDraft } from "@/components/pages/Experience/shared/ExperienceDraftContext"
import { useGetExperienceById } from "./useGetExperienceById"
import type { ExperienceData } from "@/components/pages/Experience/experienceTypes"
import { emptyExperience } from "@/components/pages/Experience/shared/emptyExperience"
import { normalizeExperiencePayload } from "@/components/pages/Experience/shared/normalizeExperiencePayload"
import { toast } from "sonner"

export function useExperiencePage(experienceId?: string, _slug?: string) {
  const isEditMode = Boolean(experienceId)

  const { draft, setDraft, resetDraft } = useExperienceDraft()

  const {
    data: experienceResponse,
    isLoading,
    isError,
    error,
  } = useGetExperienceById(experienceId)

  const { mutate: saveExperience, isPending: isSaving } = useAddExperience()

  /**
   * LOAD EDIT DATA
   */
  useEffect(() => {
    if (!isEditMode) return
    if (isLoading) return

    const rawData = experienceResponse?.data
    const experience = Array.isArray(rawData) ? rawData[0] : rawData

    if (experience) {
      const resolvedExperience: ExperienceData = {
        ...experience,
        name: experience.name || "",
        slug: experience.slug || "",
        featured: Boolean(experience.featured),
        price: experience.price !== null && experience.price !== undefined ? Number(experience.price) : null,
        currency: experience.currency || "EUR",
        priceType: experience.priceType || "",
        parentId: experience.parentId || null,
        parent: experience.parent || null,
        hero: experience.hero ?? emptyExperience.hero,
        essence: experience.essence ?? emptyExperience.essence,
        faq: experience.faq ?? emptyExperience.faq,
        metadata: experience.metadata ?? emptyExperience.metadata,
        geoData: experience.geoData ?? emptyExperience.geoData,
      }

      setDraft(resolvedExperience)
    }
  }, [isEditMode, isLoading, experienceResponse, setDraft])

  /**
   * UPDATE FIELD (dot notation support)
   */
  const updateField = useCallback(
    (path: string, value: unknown) => {
      setDraft((current) => {
        if (!current) {
          return current
        }

        const next = structuredClone(current)
        const keys = path.split(".")
        let target: any = next

        keys.slice(0, -1).forEach((key) => {
          if (target[key] === undefined || target[key] === null) {
            target[key] = {}
          }
          target = target[key]
        })

        target[keys[keys.length - 1]] = value === undefined ? null : value
        return next
      })
    },
    [setDraft]
  )

  /**
   * SAVE
   */
  const save = useCallback(() => {
    if (!draft) return

    if (!draft.name || !draft.name.trim()) {
      toast.error("Experience Name is required to save.")
      return
    }

    const normalizedDraft = normalizeExperiencePayload(draft)

    if (isEditMode) {
      saveExperience({
        ...normalizedDraft,
        id: experienceId,
      })
      return
    }

    const { id: _id, ...createPayload } = normalizedDraft
    saveExperience(createPayload)
  }, [draft, isEditMode, experienceId, saveExperience])

  const reset = useCallback(
    (value?: ExperienceData) => {
      resetDraft(value)
    },
    [resetDraft]
  )

  return {
    draft,
    setDraft,
    updateField,
    reset,
    save,
    isEditMode,
    isLoading,
    isError,
    error,
    isSaving,
  }
}
