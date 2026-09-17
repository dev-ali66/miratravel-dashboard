import { useState } from "react"
import { ChevronDown, ChevronRight, ChevronUp, Plus, Trash2 } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"

export type StatItem = {
  label: any
  value: any
  description: any
}

const defaultFacts: StatItem[] = [
  { label: "Coastline", value: "170 km", description: "Ionian & Adriatic coastline" },
  { label: "Sunshine", value: "300+ Days", description: "Mediterranean sunshine annually" },
  { label: "Water Temp", value: "24–27°C", description: "Peak summer swimming" },
  { label: "Best Access", value: "Vlorë / Sarandë", description: "Coastal highway or ferry" },
  { label: "Beach Season", value: "May – Oct", description: "Peak window: Jun–Sep" },
  { label: "Currency", value: "Albanian Lek / EUR", description: "Cards accepted in towns" },
]

export function StatsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const isOpen = Boolean(openSections["stats"])

  // Support stats under stats.items, statistics.items, or legacy facts
  const statsData =
    draft?.stats ||
    draft?.statistics ||
    (draft as any)?.data?.stats ||
    (draft as any)?.data?.statistics ||
    {}

  const rawFacts = statsData.items || statsData.facts || (draft as any)?.data?.stats?.items || (draft as any)?.data?.stats?.facts || (draft as any)?.data?.statistics?.items || (draft as any)?.data?.statistics?.facts
  const facts: StatItem[] = Array.isArray(rawFacts) && rawFacts.length > 0 ? rawFacts : defaultFacts

  // State to manage individual collapsible cards (first item expanded by default)
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true })

  const toggleItemCollapse = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const expandAll = () => {
    const allOpen = facts.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {})
    setOpenItems(allOpen)
  }

  const collapseAll = () => {
    setOpenItems({})
  }

  const updateStatsField = (fieldPath: string, value: any) => {
    updateField(`stats.${fieldPath}`, value)
  }

  const updateFactItem = (index: number, key: keyof StatItem, val: any) => {
    const updated = facts.map((item, idx) => (idx === index ? { ...item, [key]: val } : item))
    updateStatsField("items", updated)
  }

  const moveFactItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= facts.length) return

    const updated = [...facts]
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

  const addFactItem = () => {
    const newItem: StatItem = {
      label: "New Stat Label",
      value: "100+",
      description: "Description or sublabel",
    }
    const updated = [...facts, newItem]
    updateStatsField("items", updated)
    setOpenItems((prev) => ({ ...prev, [updated.length - 1]: true }))
  }

  const removeFactItem = (index: number) => {
    const updated = facts.filter((_, idx) => idx !== index)
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
          fieldName="stats.title"
          placeholder="e.g. Key Regional Statistics"
          value={statsData.title || "Key Regional Statistics"}
          onChange={(val) => updateStatsField("title", val)}
        />

        {/* Fact Items List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Statistics & Key Facts ({facts.length})
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
              onClick={addFactItem}
              className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Stat Fact
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            {facts.map((item, index) => {
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
                        onClick={() => moveFactItem(index, "up")}
                        disabled={index === 0}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Up in Array"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFactItem(index, "down")}
                        disabled={index === facts.length - 1}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Down in Array"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="mx-1 h-3.5 w-px bg-border/60" />
                      <button
                        type="button"
                        onClick={() => removeFactItem(index)}
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
                        fieldName={`stats.items.${index}.label`}
                        placeholder="e.g. Coastline"
                        value={item.label}
                        onChange={(val) => updateFactItem(index, "label", val)}
                      />

                      {/* Value */}
                      <DynamicStyledField
                        type="text"
                        label="Value (e.g. 170 km)"
                        fieldName={`stats.items.${index}.value`}
                        placeholder="e.g. 170 km"
                        value={item.value}
                        onChange={(val) => updateFactItem(index, "value", val)}
                      />

                      {/* Description */}
                      <DynamicStyledField
                        type="text"
                        label="Description / Sublabel"
                        fieldName={`stats.items.${index}.description`}
                        placeholder="e.g. Ionian & Adriatic coastline"
                        value={item.description}
                        onChange={(val) => updateFactItem(index, "description", val)}
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
          fieldName="stats.backgroundMultimedia"
          value={
            statsData.backgroundMultimedia || {
              show: "color",
              color: {
                color: "#FFFFFF",
                opacity: 100,
                width: "100%",
                height: "100%",
                aspectRatio: "auto",
              },
            }
          }
          onChange={(multimedia) => updateStatsField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default StatsForm
