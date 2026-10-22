import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import type { ExperienceData } from "../experienceTypes"

type ExperienceDraftContextValue = {
  draft: ExperienceData | null
  setDraft: React.Dispatch<React.SetStateAction<ExperienceData | null>>
  resetDraft: (value?: ExperienceData) => void
}

const ExperienceDraftContext = createContext<ExperienceDraftContextValue | null>(
  null
)

export function ExperienceDraftProvider({
  children,
  initialDraft = null,
}: {
  children: React.ReactNode
  initialDraft?: ExperienceData | null
}) {
  const [draft, setDraft] = useState<ExperienceData | null>(initialDraft)

  const resetDraft = useCallback((value?: ExperienceData) => {
    setDraft(value ?? null)
  }, [])

  const contextValue = useMemo(
    () => ({
      draft,
      setDraft,
      resetDraft,
    }),
    [draft, resetDraft]
  )

  return (
    <ExperienceDraftContext.Provider value={contextValue}>
      {children}
    </ExperienceDraftContext.Provider>
  )
}

export function useExperienceDraft() {
  const context = useContext(ExperienceDraftContext)

  if (!context) {
    throw new Error(
      "useExperienceDraft must be used within ExperienceDraftProvider"
    )
  }

  return context
}
