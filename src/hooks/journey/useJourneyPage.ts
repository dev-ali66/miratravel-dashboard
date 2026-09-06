import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useJourneyDraft } from "@/components/pages/Journeys/shared/JourneyDraftContext"
import { getJourneyItineraryDays, type Journey } from "@/components/pages/Journeys/journeyTypes"
import { useGetJourneyById } from "./useGetJourneyById"
import { useSaveJourney } from "./useSaveJourney"

export function useJourneyPage(id?: string, slug?: string) {
  const navigate = useNavigate()
  const { draft, setDraft, updateField } = useJourneyDraft()
  const lastLoadedJourneyIdRef = useRef<string | null>(null)

  const isEditMode = Boolean(id && id !== "new")

  const {
    data: fetchedJourney,
    isLoading,
    isError,
  } = useGetJourneyById(id, slug)

  const { mutateAsync: saveJourneyMutation, isPending: isSaving } = useSaveJourney()

  // Hydrate fetched journey into draft
  useEffect(() => {
    if (isEditMode && fetchedJourney) {
      const journeyIdentifier = fetchedJourney.id || id || slug || "loaded"
      if (lastLoadedJourneyIdRef.current !== journeyIdentifier || !draft?.id) {
        lastLoadedJourneyIdRef.current = journeyIdentifier
        const normalizedDays = getJourneyItineraryDays(fetchedJourney)
        const hydratedDraft: Journey = {
          ...fetchedJourney,
          itineraryData: normalizedDays,
          itineraryDays: normalizedDays,
          itinerary: normalizedDays,
          data: {
            ...(fetchedJourney.data || {}),
            itineraryData: normalizedDays,
            itinerary: normalizedDays,
          },
        }
        setDraft(hydratedDraft)
      }
    }
  }, [isEditMode, fetchedJourney, id, slug, draft?.id, setDraft])

  const save = async () => {
    try {
      const res = await saveJourneyMutation(draft)
      if (res?.data) {
        const saved = res.data
        const normalizedDays = getJourneyItineraryDays(saved)
        const finalDays =
          normalizedDays.length > 0 ? normalizedDays : getJourneyItineraryDays(draft)
        const updatedDraft: Journey = {
          ...saved,
          itineraryData: finalDays,
          itineraryDays: finalDays,
          itinerary: finalDays,
          data: {
            ...(saved.data || {}),
            itineraryData: finalDays,
            itinerary: finalDays,
          },
        }
        setDraft(updatedDraft)

        if (!isEditMode && saved.id) {
          navigate(`/journeys/${saved.id}/${saved.slug || "journey"}`)
        }
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
