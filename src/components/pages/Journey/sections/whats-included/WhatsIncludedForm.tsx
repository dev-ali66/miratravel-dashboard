import type { JourneyData, WhatsIncludedItem } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2, CheckCircle2, XCircle } from "lucide-react"

interface WhatsIncludedFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function WhatsIncludedForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: WhatsIncludedFormProps) {
  const isOpen = Boolean(openSections["whats-included"])
  const incData = draft.whatsIncluded || {}
  const inclusions = incData.inclusions || []
  const exclusions = incData.exclusions || []
  const notes = incData.notes || []

  const addInclusion = () => {
    const newItem: WhatsIncludedItem = {
      id: `inc-${Date.now()}`,
      category: "Services",
      title: "New Included Service",
      description: "Description of included amenity...",
    }
    updateField("whatsIncluded.inclusions", [...inclusions, newItem])
  }

  const removeInclusion = (index: number) => {
    updateField(
      "whatsIncluded.inclusions",
      inclusions.filter((_, i) => i !== index)
    )
  }

  const addExclusion = () => {
    const newItem: WhatsIncludedItem = {
      id: `exc-${Date.now()}`,
      category: "General",
      title: "Excluded Service / Expense",
      description: "Details on what travelers pay separately...",
    }
    updateField("whatsIncluded.exclusions", [...exclusions, newItem])
  }

  const removeExclusion = (index: number) => {
    updateField(
      "whatsIncluded.exclusions",
      exclusions.filter((_, i) => i !== index)
    )
  }

  const addNote = () => {
    updateField("whatsIncluded.notes", [...notes, "Important note or requirement..."])
  }

  const removeNote = (index: number) => {
    updateField(
      "whatsIncluded.notes",
      notes.filter((_, i) => i !== index)
    )
  }

  return (
    <FormSection
      title="What's Included & Excluded Checklist"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("whats-included")}
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicStyledField
            type="text"
            label="Badge Text"
            fieldName="whatsIncluded.badge"
            placeholder="e.g. Inclusions"
            value={incData.badge}
            onChange={(val) => updateField("whatsIncluded.badge", val)}
          />

          <DynamicStyledField
            type="text"
            label="Section Title"
            fieldName="whatsIncluded.title"
            placeholder="e.g. What's Included & Excluded"
            value={incData.title}
            onChange={(val) => updateField("whatsIncluded.title", val)}
          />
        </div>

        <DynamicStyledField
          type="richtext"
          label="Inclusions Section Description"
          fieldName="whatsIncluded.description"
          placeholder="Write inclusions section description..."
          value={incData.description}
          onChange={(val) => updateField("whatsIncluded.description", val)}
        />

        {/* Inclusions List */}
        <div className="space-y-3 pt-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Included Services & Amenities ({inclusions.length})
            </label>

            <button
              type="button"
              onClick={addInclusion}
              className="flex items-center gap-1 rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Inclusion
            </button>
          </div>

          {inclusions.map((inc, idx) => (
            <div
              key={inc.id || idx}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3 relative"
            >
              <button
                type="button"
                onClick={() => removeInclusion(idx)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive p-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <DynamicStyledField
                  type="text"
                  label="Category"
                  fieldName={`whatsIncluded.inclusions.${idx}.category`}
                  value={inc.category}
                  onChange={(val) => updateField(`whatsIncluded.inclusions.${idx}.category`, val)}
                  placeholder="Stays, Dining, Transfers..."
                />
                <div className="md:col-span-2">
                  <DynamicStyledField
                    type="text"
                    label="Inclusion Title"
                    fieldName={`whatsIncluded.inclusions.${idx}.title`}
                    value={inc.title}
                    onChange={(val) => updateField(`whatsIncluded.inclusions.${idx}.title`, val)}
                  />
                </div>
              </div>

              <DynamicStyledField
                type="richtext"
                label="Inclusion Description"
                fieldName={`whatsIncluded.inclusions.${idx}.description`}
                value={inc.description}
                onChange={(val) => updateField(`whatsIncluded.inclusions.${idx}.description`, val)}
              />
            </div>
          ))}
        </div>

        {/* Exclusions List */}
        <div className="space-y-3 pt-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-rose-600" />
              Excluded Expenses & Airfare ({exclusions.length})
            </label>

            <button
              type="button"
              onClick={addExclusion}
              className="flex items-center gap-1 rounded bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Exclusion
            </button>
          </div>

          {exclusions.map((exc, idx) => (
            <div
              key={exc.id || idx}
              className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4 space-y-3 relative"
            >
              <button
                type="button"
                onClick={() => removeExclusion(idx)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive p-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <DynamicStyledField
                  type="text"
                  label="Category"
                  fieldName={`whatsIncluded.exclusions.${idx}.category`}
                  value={exc.category}
                  onChange={(val) => updateField(`whatsIncluded.exclusions.${idx}.category`, val)}
                  placeholder="Flights, Insurance..."
                />
                <div className="md:col-span-2">
                  <DynamicStyledField
                    type="text"
                    label="Exclusion Title"
                    fieldName={`whatsIncluded.exclusions.${idx}.title`}
                    value={exc.title}
                    onChange={(val) => updateField(`whatsIncluded.exclusions.${idx}.title`, val)}
                  />
                </div>
              </div>

              <DynamicStyledField
                type="richtext"
                label="Exclusion Description"
                fieldName={`whatsIncluded.exclusions.${idx}.description`}
                value={exc.description}
                onChange={(val) => updateField(`whatsIncluded.exclusions.${idx}.description`, val)}
              />
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="space-y-3 pt-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Important Travel Notes & Conditions
            </label>
            <button
              type="button"
              onClick={addNote}
              className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Note
            </button>
          </div>

          {notes.map((note, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-1">
                <DynamicStyledField
                  type="text"
                  label={`Note #${idx + 1}`}
                  fieldName={`whatsIncluded.notes.${idx}`}
                  value={note}
                  onChange={(val) => updateField(`whatsIncluded.notes.${idx}`, val)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeNote(idx)}
                className="text-muted-foreground hover:text-destructive p-1 cursor-pointer self-end mb-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Mandatory Section Background Multimedia */}
        <div className="pt-4 border-t border-border/40">
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
            What's Included Section Background Multimedia
          </label>
          <UniversalMultimediaForm
            value={incData.backgroundMultimedia || { show: "color", color: { color: "#ffffff" } }}
            onChange={(val) => updateField("whatsIncluded.backgroundMultimedia", val)}
          />
        </div>
      </div>
    </FormSection>
  )
}