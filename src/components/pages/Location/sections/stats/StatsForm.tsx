import { Plus, Trash2 } from "lucide-react"
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
}: LocationFormSectionProps) {
  const isOpen = Boolean(openSections["stats"])

  // Support stats under stats, statistics, or essence.facts
  const statsData =
    draft?.stats ||
    draft?.statistics ||
    (draft as any)?.data?.stats ||
    (draft as any)?.data?.statistics ||
    {}

  const rawFacts = statsData.facts || draft?.essence?.facts || (draft as any)?.data?.essence?.facts
  const facts: StatItem[] = Array.isArray(rawFacts) && rawFacts.length > 0 ? rawFacts : defaultFacts

  const updateStatsField = (fieldPath: string, value: any) => {
    updateField(`stats.${fieldPath}`, value)
  }

  const updateFactItem = (index: number, key: keyof StatItem, val: any) => {
    const updated = facts.map((item, idx) => (idx === index ? { ...item, [key]: val } : item))
    updateStatsField("facts", updated)
  }

  const addFactItem = () => {
    const newItem: StatItem = {
      label: "New Stat Label",
      value: "100+",
      description: "Description or sublabel",
    }
    updateStatsField("facts", [...facts, newItem])
  }

  const removeFactItem = (index: number) => {
    const updated = facts.filter((_, idx) => idx !== index)
    updateStatsField("facts", updated)
  }

  return (
    <FormSection
      title="03. Location Statistics"
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
          value={statsData.title}
          onChange={(val) => updateStatsField("title", val)}
        />

        {/* Fact Items List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Statistics & Key Facts ({facts.length})
            </h4>
            <button
              type="button"
              onClick={addFactItem}
              className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Stat Fact
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {facts.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col gap-3 rounded-lg border border-border/70 bg-card p-3.5 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase">
                    Stat #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFactItem(index)}
                    className="text-muted-foreground hover:text-destructive cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Label */}
                <DynamicStyledField
                  type="text"
                  label="Label (e.g. Coastline)"
                  fieldName={`stats.facts.${index}.label`}
                  placeholder="e.g. Coastline"
                  value={item.label}
                  onChange={(val) => updateFactItem(index, "label", val)}
                />

                {/* Value */}
                <DynamicStyledField
                  type="text"
                  label="Value (e.g. 170 km)"
                  fieldName={`stats.facts.${index}.value`}
                  placeholder="e.g. 170 km"
                  value={item.value}
                  onChange={(val) => updateFactItem(index, "value", val)}
                />

                {/* Description */}
                <DynamicStyledField
                  type="text"
                  label="Description / Sublabel"
                  fieldName={`stats.facts.${index}.description`}
                  placeholder="e.g. Ionian & Adriatic coastline"
                  value={item.description}
                  onChange={(val) => updateFactItem(index, "description", val)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Media / Color"
          fieldName="stats.backgroundMultimedia"
          value={statsData.backgroundMultimedia}
          onChange={(multimedia) => updateStatsField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default StatsForm
