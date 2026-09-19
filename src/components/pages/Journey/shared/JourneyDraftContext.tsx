import React, { createContext, useContext, useState, useCallback } from "react"
import type { JourneyData } from "../journeyTypes"
import { emptyJourney } from "./emptyJourney"

interface JourneyDraftContextType {
  draft: JourneyData | null
  setDraft: React.Dispatch<React.SetStateAction<JourneyData | null>>
  resetDraft: (value?: JourneyData) => void
  activePreviewTab: string
  setActivePreviewTab: (tab: string) => void
}

const JourneyDraftContext = createContext<JourneyDraftContextType | undefined>(
  undefined
)

export function JourneyDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<JourneyData | null>(structuredClone(emptyJourney))
  const [activePreviewTab, setActivePreviewTab] = useState<string>("overview")

  const resetDraft = useCallback((value?: JourneyData) => {
    setDraft(value ? structuredClone(value) : structuredClone(emptyJourney))
  }, [])

  return (
    <JourneyDraftContext.Provider
      value={{
        draft,
        setDraft,
        resetDraft,
        activePreviewTab,
        setActivePreviewTab,
      }}
    >
      {children}
    </JourneyDraftContext.Provider>
  )
}

export function useJourneyDraft() {
  const context = useContext(JourneyDraftContext)
  if (!context) {
    throw new Error("useJourneyDraft must be used within a JourneyDraftProvider")
  }
  return context
}
