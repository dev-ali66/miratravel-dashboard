import { useState } from "react"
import { ArrowDown, ArrowUp, Plus, Trash2, Sparkles, ChevronDown, ChevronRight } from "lucide-react"

import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { emptyStaySentenceItem } from "./emptyStay"

interface StayFormProps {
  section: any
  index: number
  updateSection: (index: number, updated: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number | string
}

export function StayForm({
  section = {},
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: StayFormProps) {
  const sectionKey = "stay"
  const isOpen = Boolean(openSections[sectionKey])

  const items = Array.isArray(section.items)
    ? section.items
    : Array.isArray(section.sentences)
    ? section.sentences
    : []

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({})

  const toggleItemOpen = (sIdx: number) => {
    setOpenItems((prev) => ({ ...prev, [sIdx]: !prev[sIdx] }))
  }

  const updateField = (fieldKey: string, val: any) => {
    updateSection(index, {
      ...section,
      [fieldKey]: val,
    })
  }

  const updateItem = (sIdx: number, val: any) => {
    const next = [...items]
    const current = next[sIdx] || emptyStaySentenceItem
    next[sIdx] = typeof val === "object" ? val : { ...current, value: val }
    updateField("items", next)
  }

  const addItem = () => {
    const newIdx = items.length
    setOpenItems((prev) => ({ ...prev, [newIdx]: true }))
    updateField("items", [...items, { ...emptyStaySentenceItem }])
  }

  const removeItem = (sIdx: number) => {
    const next = items.filter((_: any, i: number) => i !== sIdx)
    updateField("items", next)
  }

  const moveItem = (sIdx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? sIdx - 1 : sIdx + 1
    if (targetIdx < 0 || targetIdx >= items.length) return
    const next = [...items]
    const temp = next[sIdx]
    next[sIdx] = next[targetIdx]
    next[targetIdx] = temp

    setOpenItems((prev) => ({
      ...prev,
      [sIdx]: prev[targetIdx],
      [targetIdx]: prev[sIdx],
    }))

    updateField("items", next)
  }

  return (
    <FormSection
      title="The Journeys That Stay (Poetic Editorial)"
      description="Manage the middle quote box section with poetic sentence items and accent closing text."
      active={isOpen}
      onClick={() => toggleSection(sectionKey)}
      sectionNumber={String(sectionNumber)}
    >
      <div className="space-y-6">
        {/* Title */}
        <DynamicStyledField
          label="Main Editorial Title"
          fieldKey="title"
          value={section.title}
          onChange={(val) => updateField("title", val)}
        />

        {/* Poetic Sentence Items Repeater */}
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Poetic Sentence Items ({items.length})
              </label>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((sent: any, sIdx: number) => {
              const isItemOpen = Boolean(openItems[sIdx])
              const sentVal = typeof sent === "string" ? sent : sent?.value || ""

              return (
                <div
                  key={sIdx}
                  className="rounded-md border border-border/80 bg-background overflow-hidden transition hover:border-border"
                >
                  <div
                    className="flex items-center justify-between p-2.5 bg-muted/40 cursor-pointer select-none hover:bg-muted/60 transition-colors"
                    onClick={() => toggleItemOpen(sIdx)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden mr-2 min-w-0">
                      {isItemOpen ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
                        {sIdx + 1}
                      </span>
                      <span className="text-xs font-medium text-foreground truncate">
                        {sentVal || `Item #${sIdx + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => moveItem(sIdx, "up")}
                        disabled={sIdx === 0}
                        className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(sIdx, "down")}
                        disabled={sIdx === items.length - 1}
                        className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(sIdx)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-destructive/40 text-destructive transition hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {isItemOpen && (
                    <div className="p-3 border-t border-border/40 bg-muted/10">
                      <DynamicStyledField
                        label={`Item #${sIdx + 1} Text & Style`}
                        value={typeof sent === "object" ? sent : { value: sent, textColor: "#F3F4F6", textOpacity: 1 }}
                        onChange={(val) => updateItem(sIdx, val)}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border/80 bg-background/50 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Poetic Item
          </button>
        </div>

        {/* Closing Accent Text */}
        <DynamicStyledField
          label="Closing Accent Text"
          fieldKey="closingText"
          value={section.closingText}
          onChange={(val) => updateField("closingText", val)}
        />

        {/* Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background"
          value={section.backgroundMultimedia}
          onChange={(val) => updateField("backgroundMultimedia", val)}
          allowTypes={["color", "image", "video"]}
        />
      </div>
    </FormSection>
  )
}

export default StayForm
