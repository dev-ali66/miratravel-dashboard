import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useJourneyDraft } from "@/components/pages/Journeys/shared/JourneyDraftContext"
import { useGetJourneyById } from "./useGetJourneyById"
import { useSaveJourney } from "./useSaveJourney"

export function useJourneyPage(id?: string, slug?: string) {
  const navigate = useNavigate()
  const { draft, setDraft, updateField } = useJourneyDraft()
  const hasInitialized = useRef(false)

  const isEditMode = Boolean(id)

  const {
    data: fetchedJourney,
    isLoading,
    isError,
  } = useGetJourneyById(id, slug)

  const { mutateAsync: saveJourneyMutation, isPending: isSaving } = useSaveJourney()

  // Hydrate fetched journey into draft once
  useEffect(() => {
    if (isEditMode && fetchedJourney && !hasInitialized.current) {
      hasInitialized.current = true
      setDraft(fetchedJourney)
    }
  }, [isEditMode, fetchedJourney, setDraft])

  const save = async () => {
    try {
      const res = await saveJourneyMutation(draft)
      if (res?.data?.id && !isEditMode) {
        navigate(`/journeys/${res.data.id}/${res.data.slug || "journey"}`)
      }
      return res
    } catch (err) {
      // toast is handled in useSaveJourney
      return null
    }
  }

  return {
    draft,
    updateField,
    save,
    isSaving,
    isEditMode,
    isLoading,
    isError,
  }
}
