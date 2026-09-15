import { useCallback, useEffect } from "react"

import { useAddLocation } from "./useAddLocation"
import { useLocationDraft } from "@/components/pages/Location/shared/LocationDraftContext"
import { useGetLocationById } from "./useGetLocationById"
import type { LocationData } from "@/components/pages/Location/locationTypes"
import { mergeWithDefaults } from "@/components/pages/Location/shared/mergeWithDefaults"
import { emptyLocation } from "@/components/pages/Location/shared/emptyLocation"

import { toast } from "sonner"
import { normalizeLocationPayload } from "@/components/pages/Location/shared/normalizeLocationPayload"

export function useLocationPage(locationId?: string, _slug?: string) {
  const isEditMode = Boolean(locationId)

  const { draft, setDraft, resetDraft } = useLocationDraft()

  const {
    data: locationResponse,
    isLoading,
    isError,
    error,
  } = useGetLocationById(locationId)

  const { mutate: saveLocation, isPending: isSaving } = useAddLocation()

  /**
   * ==========================================
   * LOAD EDIT DATA
   * ==========================================
   */

  useEffect(() => {
    if (!isEditMode) return
    if (isLoading) return

    const rawData = locationResponse?.data

    const location = Array.isArray(rawData) ? rawData[0] : rawData

    if (location) {
      const resolvedLocation: LocationData = {
        ...location,
        hero: location.hero ?? location.data?.hero ?? emptyLocation.hero,
        essence: location.essence ?? location.data?.essence ?? emptyLocation.essence,
        highlights:
          location.highlights ??
          location.data?.highlights ??
          emptyLocation.highlights,
        card: location.card ?? location.data?.card ?? emptyLocation.card,
        why: location.why ?? location.data?.why ?? emptyLocation.data?.why,
        sharedInfo: location.sharedInfo ?? location.data?.sharedInfo ?? emptyLocation.data?.sharedInfo,
      }

      setDraft(
        mergeWithDefaults(
          emptyLocation,
          resolvedLocation
        ) as LocationData
      )
    }
  }, [isEditMode, isLoading, locationResponse, setDraft])

  /**
   * ==========================================
   * UPDATE FIELD
   * ==========================================
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
   * ==========================================
   * SAVE
   * ==========================================
   */

  const save = useCallback(() => {
    if (!draft) return

    if (!draft.name || !draft.name.trim()) {
      toast.error("Location Name is required to save.")
      return
    }

    if (!draft.type || !draft.type.trim()) {
      toast.error("Location Type is required to save.")
      return
    }

    const normalizedDraft = normalizeLocationPayload(draft)

    /**
     * EDIT
     *
     * id থাকলে backend update করবে
     */
    if (isEditMode) {
      saveLocation({
        ...normalizedDraft,
        id: locationId,
      })

      return
    }

    /**
     * CREATE
     *
     * id পাঠানো হবে না
     */
    const { id: _id, ...createPayload } = normalizedDraft

    saveLocation(createPayload)
  }, [draft, isEditMode, locationId, saveLocation])

  /**
   * ==========================================
   * RESET
   * ==========================================
   */

  const reset = useCallback(
    (value?: LocationData) => {
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
