import { useState } from "react"
import { ChevronDown, ChevronRight, ChevronUp, Plus, Trash2 } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import { emptyStats, DEFAULT_STATS_TEXT_COLOR } from "./emptyStats"

export type StatItem = {
  label: any
  value: any
  description: any
}

export function StatsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const isOpen = Boolean(openSections["stats"])

  // Support stats under statistics.items or stats.items (prioritize statistics)
  const statsData =
    draft?.statistics ||
    draft?.stats ||
    (draft as any)?.data?.statistics ||
    (draft as any)?.data?.stats ||
    {}

  const rawItems =
    statsData.items ||
    statsData.facts ||
    (draft as any)?.data?.statistics?.items ||
    (draft as any)?.data?.statistics?.facts ||
    (draft as any)?.data?.stats?.items ||
    (draft as any)?.data?.stats?.facts
  const items: StatItem[] =
    Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : (emptyStats.items as StatItem[])

  // State to manage individual collapsible cards (first item expanded by default)
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true })

  const toggleItemCollapse = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const expandAll = () => {
    const allOpen = items.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {})
    setOpenItems(allOpen)
  }

  const collapseAll = () => {
    setOpenItems({})
  }

  const updateStatsField = (fieldPath: string, value: any) => {
    updateField(`statistics.${fieldPath}`, value)
  }

  const updateStatItem = (index: number, key: keyof StatItem, val: any) => {
    const updated = items.map((item, idx) => (idx === index ? { ...item, [key]: val } : item))
    updateStatsField("items", updated)
  }

  const moveStatItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const updated = [...items]
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)

    // Adjust collapse state during reorder
    setOpenItems((prev) => {
      const next: Record<number, boolean> = {}
      Object.keys(prev).forEach((k) => {
        const i = parseInt(k, 10)
        if (i === index) next[targetIndex] = prev[i]
        else if (i === targetIndex) next[index] = prev[i]
        else next[i] = prev[i]
      })
      return next
    })

    updateStatsField("items", updated)
  }

  const addStatItem = () => {
    const newItem: StatItem = {
      label: {
        value: "New Stat Label",
        textColor: DEFAULT_STATS_TEXT_COLOR,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      value: {
        value: "100+",
        textColor: DEFAULT_STATS_TEXT_COLOR,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "Description or sublabel",
        textColor: DEFAULT_STATS_TEXT_COLOR,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    }
    const updated = [...items, newItem]
    updateStatsField("items", updated)
    setOpenItems((prev) => ({ ...prev, [updated.length - 1]: true }))
  }

  const removeStatItem = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index)
    updateStatsField("items", updated)

    setOpenItems((prev) => {
      const next: Record<number, boolean> = {}
      Object.keys(prev).forEach((k) => {
        const i = parseInt(k, 10)
        if (i < index) next[i] = prev[i]
        else if (i > index) next[i - 1] = prev[i]
      })
      return next
    })
  }

  return (
    <FormSection
      title="Location Statistics"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("stats")}
    >
      <div className="flex flex-col gap-5">
        {/* Section Label / Title */}
        <DynamicStyledField
          type="text"
          label="Section Title / Label"
          fieldName="statistics.title"
          placeholder="e.g. Key Regional Statistics"
          value={statsData.title || "Key Regional Statistics"}
          onChange={(val) => updateStatsField("title", val)}
        />

        {/* Fact Items List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Statistics & Key Facts ({items.length})
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <button
                  type="button"
                  onClick={expandAll}
                  className="hover:text-primary font-medium cursor-pointer"
                >
                  Expand All
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="hover:text-primary font-medium cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={addStatItem}
              className="flex items-center gap-1 rounded-sm bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Stat Fact
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            {items.map((item, index) => {
              const isItemOpen = Boolean(openItems[index])
              const itemLabelText =
                typeof item.label === "object" ? item.label?.value : item.label
              const itemValueText =
                typeof item.value === "object" ? item.value?.value : item.value

              return (
                <div
                  key={index}
                  className="relative flex flex-col rounded-lg border border-border/70 bg-card p-3.5 shadow-sm transition-all"
                >
                  {/* Header with Collapsible Toggle, Position Badge & Controls */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <button
                      type="button"
                      onClick={() => toggleItemCollapse(index)}
                      className="flex items-center gap-2 text-left cursor-pointer group min-w-0"
                    >
                      {isItemOpen ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-transform" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-transform" />
                      )}
                      <span className="truncate text-xs font-semibold text-primary uppercase tracking-wider">
                        Stat #{index + 1}
                        {itemLabelText ? `: ${itemLabelText}` : ""}
                        {itemValueText ? ` (${itemValueText})` : ""}
                      </span>
                    </button>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveStatItem(index, "up")}
                        disabled={index === 0}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Up in Array"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStatItem(index, "down")}
                        disabled={index === items.length - 1}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Down in Array"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="mx-1 h-3.5 w-px bg-border/60" />
                      <button
                        type="button"
                        onClick={() => removeStatItem(index)}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Form Body */}
                  {isItemOpen && (
                    <div className="flex flex-col gap-3 pt-3">
                      {/* Label */}
                      <DynamicStyledField
                        type="text"
                        label="Label (e.g. Coastline)"
                        fieldName={`statistics.items.${index}.label`}
                        placeholder="e.g. Coastline"
                        value={item.label}
                        onChange={(val) => updateStatItem(index, "label", val)}
                      />

                      {/* Value */}
                      <DynamicStyledField
                        type="text"
                        label="Value (e.g. 170 km)"
                        fieldName={`statistics.items.${index}.value`}
                        placeholder="e.g. 170 km"
                        value={item.value}
                        onChange={(val) => updateStatItem(index, "value", val)}
                      />

                      {/* Description */}
                      <DynamicStyledField
                        type="text"
                        label="Description / Sublabel"
                        fieldName={`statistics.items.${index}.description`}
                        placeholder="e.g. Ionian & Adriatic coastline"
                        value={item.description}
                        onChange={(val) => updateStatItem(index, "description", val)}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Media / Color"
          fieldName="statistics.backgroundMultimedia"
          value={
            statsData.backgroundMultimedia ||
            emptyStats.backgroundMultimedia
          }
          onChange={(multimedia) => updateStatsField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default StatsForm
