import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react"
import type { LocationData } from "../locationTypes"


type LocationDraftContextValue = {
    draft: LocationData | null

    setDraft: React.Dispatch<
        React.SetStateAction<LocationData | null>
    >

    resetDraft: (
        value?: LocationData
    ) => void
}

const LocationDraftContext =
    createContext<LocationDraftContextValue | null>(
        null
    )

export function LocationDraftProvider({
    children,
    initialDraft = null,
}: {
    children: React.ReactNode
    initialDraft?: LocationData | null
}) {
    const [draft, setDraft] = useState<LocationData | null>(
        initialDraft
    )

    const resetDraft = useCallback(
        (value?: LocationData) => {
            setDraft(value ?? null)
        },
        []
    )

    const contextValue = useMemo(
        () => ({
            draft,
            setDraft,
            resetDraft,
        }),
        [draft, resetDraft]
    )

    return (
        <LocationDraftContext.Provider value={contextValue}>
            {children}
        </LocationDraftContext.Provider>
    )
}

export function useLocationDraft() {
    const context =
        useContext(LocationDraftContext)

    if (!context) {
        throw new Error(
            "useLocationDraft must be used within LocationDraftProvider"
        )
    }

    return context
}