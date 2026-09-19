import { useCallback, useEffect } from "react"
import { useAddJourney } from "./useAddJourney"
import { useJourneyDraft } from "@/components/pages/Journey/shared/JourneyDraftContext"
import { useGetJourneyById } from "./useGetJourneyById"
import type { JourneyData } from "@/components/pages/Journey/journeyTypes"
import { emptyJourney } from "@/components/pages/Journey/shared/emptyJourney"
import { normalizeJourneyPayload } from "@/components/pages/Journey/shared/normalizeJourneyPayload"
import { toast } from "sonner"

export function useJourneyPage(journeyId?: string, _slug?: string) {
  const isEditMode = Boolean(journeyId)

  const { draft, setDraft, resetDraft } = useJourneyDraft()

  const {
    data: journeyResponse,
    isLoading,
    isError,
    error,
  } = useGetJourneyById(journeyId)

  const { mutate: saveJourney, isPending: isSaving } = useAddJourney()

  // Load Edit Data
  useEffect(() => {
    if (!isEditMode) return
    if (isLoading) return

    const rawData = journeyResponse?.data
    const journey = Array.isArray(rawData) ? rawData[0] : rawData

    if (journey) {
      const merged: JourneyData = {
        ...emptyJourney,
        ...journey,
        hero: { ...emptyJourney.hero, ...(journey.hero || {}) },
        overview: { ...emptyJourney.overview, ...(journey.overview || {}) },
        itinerary: { ...emptyJourney.itinerary, ...(journey.itinerary || {}) },
        accommodations: { ...emptyJourney.accommodations, ...(journey.accommodations || {}) },
        whatsIncluded: { ...emptyJourney.whatsIncluded, ...(journey.whatsIncluded || {}) },
        addOns: { ...emptyJourney.addOns, ...(journey.addOns || {}) },
        gallery: { ...emptyJourney.gallery, ...(journey.gallery || {}) },
        metadata: { ...emptyJourney.metadata, ...(journey.metadata || {}) },
      }
      setDraft(normalizeJourneyPayload(merged))
    }
  }, [isEditMode, isLoading, journeyResponse, setDraft])

  // Update Field
  const updateField = useCallback(
    (path: string, value: unknown) => {
      setDraft((current) => {
        if (!current) return current
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

  // Save Payload
  const save = useCallback(() => {
    if (!draft) return

    if (!draft.title || !draft.title.trim()) {
      toast.error("Journey Title is required to save.")
      return
    }

    const normalizedDraft = normalizeJourneyPayload(draft)

    if (isEditMode) {
      saveJourney({
        ...normalizedDraft,
        id: journeyId,
      })
      return
    }

    const { id: _id, ...createPayload } = normalizedDraft
    saveJourney(createPayload)
  }, [draft, isEditMode, journeyId, saveJourney])

  const reset = useCallback(
    (value?: JourneyData) => {
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
