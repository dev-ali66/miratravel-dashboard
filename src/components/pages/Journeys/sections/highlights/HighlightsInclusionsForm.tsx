/* =====================================================
   JOURNEYS — HIGHLIGHTS & INCLUSIONS FORM SECTION
   Directly manages Prisma fields:
   - highlights: String[]
   - included: String[]
   - notIncluded: String[]
   And syncs to draft.data.whatsIncluded:
   - backgroundMultimedia
   - includedTitle
   - notIncludedTitle
   - importantInfoTitle
   - importantInfoItems: String[]
===================================================== */

import { Plus, Trash2, Sparkles, CheckCircle2, XCircle, Info } from "lucide-react"
import {
  FormSection,
  DynamicStyledField,
} from "../../shared/fields"
import { useJourneyDraft } from "../../shared/JourneyDraftContext"
import { whatsIncludedData } from "../../preview/journeyStaticData"
import type { Journey } from "../../journeyTypes"

export type HighlightsInclusionsFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function HighlightsInclusionsForm({
  draft,
  updateField: _updateField,
  openSections,
  toggleSection,
}: HighlightsInclusionsFormProps) {
  const { setDraft } = useJourneyDraft()

  const whatsIncludedSection = (draft?.data?.whatsIncluded as any) || {}
  const overviewSection = (draft?.data?.overview as any) || {}

  const highlightsTitle =
    overviewSection.highlightsTitle || "Curated Highlights"
  const highlightsTitleStyle = overviewSection.highlightsTitleStyle
  const highlightsList: string[] = Array.isArray(draft.highlights)
    ? draft.highlights
    : Array.isArray(overviewSection.highlights)
    ? overviewSection.highlights
    : []

  const includedTitle =
    whatsIncludedSection.includedTitle || whatsIncludedData.includedTitle
  const includedList: string[] = Array.isArray(draft.included)
    ? draft.included
    : Array.isArray(whatsIncludedSection.includedItems)
    ? whatsIncludedSection.includedItems
    : []

  const notIncludedTitle =
    whatsIncludedSection.notIncludedTitle || whatsIncludedData.notIncludedTitle
  const notIncludedList: string[] = Array.isArray(draft.notIncluded)
    ? draft.notIncluded
    : Array.isArray(whatsIncludedSection.notIncludedItems)
    ? whatsIncludedSection.notIncludedItems
    : []

  const importantInfoTitle =
    whatsIncludedSection.importantInfoTitle || whatsIncludedData.importantInfoTitle
  const importantInfoList: string[] = Array.isArray(
    whatsIncludedSection.importantInfoItems
  )
    ? whatsIncludedSection.importantInfoItems
    : Array.isArray(whatsIncludedSection.importantInfo)
    ? whatsIncludedSection.importantInfo
    : Array.isArray(whatsIncludedData.importantInfoItems)
    ? [...whatsIncludedData.importantInfoItems]
    : []

  const syncState = (patch: {
    highlights?: string[]
    included?: string[]
    notIncluded?: string[]
    whatsIncludedPatch?: Record<string, any>
    overviewPatch?: Record<string, any>
  }) => {
    setDraft((prev) => {
      const prevData = prev.data || {}
      const currentWhatsIncluded = (prevData.whatsIncluded as any) || {}
      const currentOverview = (prevData.overview as any) || {}

      const nextHighlights = patch.highlights !== undefined ? patch.highlights : (prev.highlights || [])
      const nextIncluded = patch.included !== undefined ? patch.included : (prev.included || [])
      const nextNotIncluded = patch.notIncluded !== undefined ? patch.notIncluded : (prev.notIncluded || [])

      const updatedWhatsIncluded = {
        ...currentWhatsIncluded,
        includedTitle: patch.whatsIncludedPatch?.includedTitle ?? currentWhatsIncluded.includedTitle ?? includedTitle,
        includedItems: nextIncluded,
        notIncludedTitle: patch.whatsIncludedPatch?.notIncludedTitle ?? currentWhatsIncluded.notIncludedTitle ?? notIncludedTitle,
        notIncludedItems: nextNotIncluded,
        importantInfoTitle: patch.whatsIncludedPatch?.importantInfoTitle ?? currentWhatsIncluded.importantInfoTitle ?? importantInfoTitle,
        importantInfoItems: patch.whatsIncludedPatch?.importantInfoItems ?? currentWhatsIncluded.importantInfoItems ?? importantInfoList,
        ...(patch.whatsIncludedPatch || {}),
      }

      const updatedOverview = {
        ...currentOverview,
        highlightsTitle: patch.overviewPatch?.highlightsTitle ?? currentOverview.highlightsTitle ?? highlightsTitle,
        highlightsTitleStyle: patch.overviewPatch?.highlightsTitleStyle ?? currentOverview.highlightsTitleStyle ?? highlightsTitleStyle,
        highlights: nextHighlights,
        ...(patch.overviewPatch || {}),
      }

      return {
        ...prev,
        highlights: nextHighlights,
        included: nextIncluded,
        notIncluded: nextNotIncluded,
        data: {
          ...prevData,
          whatsIncluded: updatedWhatsIncluded,
          overview: updatedOverview,
          overviewList: updatedOverview,
        },
      }
    })
  }

  // Highlights handlers
  const handleHighlightChange = (idx: number, val: string) => {
    const next = [...highlightsList]
    next[idx] = val
    syncState({ highlights: next })
  }
  const handleAddHighlight = () => {
    syncState({ highlights: [...highlightsList, ""] })
  }
  const handleRemoveHighlight = (idx: number) => {
    syncState({ highlights: highlightsList.filter((_, i) => i !== idx) })
  }

  // Included handlers
  const handleIncludedChange = (idx: number, val: string) => {
    const next = [...includedList]
    next[idx] = val
    syncState({ included: next })
  }
  const handleAddIncluded = () => {
    syncState({ included: [...includedList, ""] })
  }
  const handleRemoveIncluded = (idx: number) => {
    syncState({ included: includedList.filter((_, i) => i !== idx) })
  }

  // Not Included handlers
  const handleNotIncludedChange = (idx: number, val: string) => {
    const next = [...notIncludedList]
    next[idx] = val
    syncState({ notIncluded: next })
  }
  const handleAddNotIncluded = () => {
    syncState({ notIncluded: [...notIncludedList, ""] })
  }
  const handleRemoveNotIncluded = (idx: number) => {
    syncState({ notIncluded: notIncludedList.filter((_, i) => i !== idx) })
  }

  // Important Info handlers
  const handleImportantInfoChange = (idx: number, val: string) => {
    const next = [...importantInfoList]
    next[idx] = val
    syncState({
      whatsIncludedPatch: { importantInfoItems: next },
    })
  }
  const handleAddImportantInfo = () => {
    syncState({
      whatsIncludedPatch: {
        importantInfoItems: [...importantInfoList, ""],
      },
    })
  }
  const handleRemoveImportantInfo = (idx: number) => {
    syncState({
      whatsIncludedPatch: {
        importantInfoItems: importantInfoList.filter((_, i) => i !== idx),
      },
    })
  }

  return (
    <FormSection
      title="Highlights & Inclusions"
      active={!!openSections["highlights"]}
      onClick={() => toggleSection("highlights")}
      badge={`${highlightsList.length} Highlights • ${includedList.length} Inclusions`}
    >
      <div className="space-y-6">
        {/* 1. Trip Highlights */}
        <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Trip Highlights ({highlightsList.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Featured experiences shown in the Overview tab grid.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddHighlight}
              className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Plus className="h-3.5 w-3.5" /> Add Highlight
            </button>
          </div>

          <DynamicStyledField
            type="text"
            label="Highlights Section Title"
            value={highlightsTitle}
            onChange={(val: string) =>
              syncState({
                overviewPatch: { highlightsTitle: val },
              })
            }
            placeholder="Curated Highlights"
            enableStyle
            style={highlightsTitleStyle}
            onStyleChange={(style) =>
              syncState({
                overviewPatch: { highlightsTitleStyle: style },
              })
            }
          />

          <div className="space-y-2 pt-1">
            {highlightsList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <DynamicStyledField
                    type="text"
                    label=""
                    value={item}
                    onChange={(val: string) => handleHighlightChange(idx, val)}
                    placeholder="e.g., Summit hike across Valbona Pass to Theth"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(idx)}
                  className="rounded p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Remove Highlight"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. What's Included */}
        <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  What's Included ({includedList.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Guaranteed services, private transport, entries & meals.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddIncluded}
              className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Plus className="h-3.5 w-3.5" /> Add Item
            </button>
          </div>

          <DynamicStyledField
            type="text"
            label="Section Header Title"
            value={includedTitle}
            onChange={(val: string) =>
              syncState({ whatsIncludedPatch: { includedTitle: val } })
            }
            placeholder="What's Included"
          />

          <div className="space-y-2 pt-1">
            {includedList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <DynamicStyledField
                    type="text"
                    label=""
                    value={item}
                    onChange={(val: string) => handleIncludedChange(idx, val)}
                    placeholder="e.g., All private 4WD transfers and luggage portage"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveIncluded(idx)}
                  className="rounded p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Remove Item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. What's Not Included */}
        <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <XCircle className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  What's Not Included ({notIncludedList.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Items guests must arrange independently.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddNotIncluded}
              className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Plus className="h-3.5 w-3.5" /> Add Item
            </button>
          </div>

          <DynamicStyledField
            type="text"
            label="Section Header Title"
            value={notIncludedTitle}
            onChange={(val: string) =>
              syncState({ whatsIncludedPatch: { notIncludedTitle: val } })
            }
            placeholder="What's Not Included"
          />

          <div className="space-y-2 pt-1">
            {notIncludedList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <DynamicStyledField
                    type="text"
                    label=""
                    value={item}
                    onChange={(val: string) => handleNotIncludedChange(idx, val)}
                    placeholder="e.g., International flights to/from Tirana"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveNotIncluded(idx)}
                  className="rounded p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Remove Item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Important Travel Notes */}
        <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <Info className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Important Travel Notes ({importantInfoList.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Packing advice, weather notices, and fitness expectations.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddImportantInfo}
              className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Plus className="h-3.5 w-3.5" /> Add Note
            </button>
          </div>

          <DynamicStyledField
            type="text"
            label="Callout Card Title"
            value={importantInfoTitle}
            onChange={(val: string) =>
              syncState({ whatsIncludedPatch: { importantInfoTitle: val } })
            }
            placeholder="Important Travel Notes"
          />

          <div className="space-y-2 pt-1">
            {importantInfoList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <DynamicStyledField
                    type="text"
                    label=""
                    value={item}
                    onChange={(val: string) => handleImportantInfoChange(idx, val)}
                    placeholder="e.g., Soft duffel bags are recommended for seamless mountain transfers."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImportantInfo(idx)}
                  className="rounded p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Remove Note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  )
}
