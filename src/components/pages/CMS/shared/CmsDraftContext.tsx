import { createContext, useContext, useState, useMemo } from "react"

interface CmsDraftContextValue {
  draft: unknown
  setDraft: (value: unknown) => void
}

const CmsDraftContext = createContext<CmsDraftContextValue | null>(null)

/**
 * Holds the currently-edited CMS page's in-progress data so the live preview
 * panel (rendered as a sibling of the editor form inside CMSEditorLayout) can
 * reflect edits as they happen, without waiting for a save.
 */
export function CmsDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<unknown>(null)

  const value = useMemo(() => ({ draft, setDraft }), [draft])

  return <CmsDraftContext.Provider value={value}>{children}</CmsDraftContext.Provider>
}

/** Typed accessor used by each page's Form component to publish its draft. */
export function useSetCmsDraft<T>() {
  const ctx = useContext(CmsDraftContext)
  if (!ctx) throw new Error("useSetCmsDraft must be used within a CmsDraftProvider")
  return ctx.setDraft as (value: T) => void
}

/** Typed accessor used by each page's Preview component to read the draft. */
export function useCmsDraft<T>(): T | null {
  const ctx = useContext(CmsDraftContext)
  if (!ctx) throw new Error("useCmsDraft must be used within a CmsDraftProvider")
  return ctx.draft as T | null
}
