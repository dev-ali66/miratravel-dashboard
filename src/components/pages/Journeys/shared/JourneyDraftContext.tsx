import React, { createContext, useContext, useState, useCallback } from "react"
import type { Journey } from "../journeyTypes"
import { emptyJourney } from "./emptyJourney"

type JourneyDraftContextType = {
  draft: Journey
  setDraft: React.Dispatch<React.SetStateAction<Journey>>
  updateField: (path: string, value: unknown) => void
  resetDraft: (initial?: Journey) => void
  isSlugConflict: boolean
  setIsSlugConflict: (conflict: boolean) => void
  slugConflictMessage?: string
  setSlugConflictMessage: (msg?: string) => void
}

const JourneyDraftContext = createContext<JourneyDraftContextType | null>(null)

function setNestedValue(obj: any, path: string, value: any): any {
  const parts = path.split(".")
  const cloned = Array.isArray(obj) ? [...obj] : { ...obj }
  let current = cloned

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (current[part] === undefined || current[part] === null) {
      current[part] = /^\d+$/.test(parts[i + 1]) ? [] : {}
    } else if (Array.isArray(current[part])) {
      current[part] = [...current[part]]
    } else if (typeof current[part] === "object") {
      current[part] = { ...current[part] }
    }
    current = current[part]
  }

  current[parts[parts.length - 1]] = value === undefined ? null : value
  return cloned
}

export function JourneyDraftProvider({
  children,
  initialData,
}: {
  children: React.ReactNode
  initialData?: Journey
}) {
  const [draft, setDraft] = useState<Journey>(initialData ?? emptyJourney)
  const [isSlugConflict, setIsSlugConflict] = useState(false)
  const [slugConflictMessage, setSlugConflictMessage] = useState<string | undefined>(undefined)

  const updateField = useCallback((path: string, value: unknown) => {
    setDraft((prev) => setNestedValue(prev, path, value))
  }, [])

  const resetDraft = useCallback((initial?: Journey) => {
    setDraft(initial ?? emptyJourney)
    setIsSlugConflict(false)
    setSlugConflictMessage(undefined)
  }, [])

  return (
    <JourneyDraftContext.Provider
      value={{
        draft,
        setDraft,
        updateField,
        resetDraft,
        isSlugConflict,
        setIsSlugConflict,
        slugConflictMessage,
        setSlugConflictMessage,
      }}
    >
      {children}
    </JourneyDraftContext.Provider>
  )
}

export function useJourneyDraft() {
  const ctx = useContext(JourneyDraftContext)
  if (!ctx) {
    throw new Error("useJourneyDraft must be used within a JourneyDraftProvider")
  }
  return ctx
}
