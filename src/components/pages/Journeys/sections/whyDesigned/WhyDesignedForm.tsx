/* =====================================================
   JOURNEYS — WHY WE DESIGNED FORM SECTION
===================================================== */

import { Plus, Trash2 } from "lucide-react"
import {
  FormSection,
  JourneyInputField,
  JourneyTextareaField,
} from "../../shared/fields"
import type { Journey } from "../../journeyTypes"

export type WhyDesignedFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function WhyDesignedForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: WhyDesignedFormProps) {
  const whyData = draft.data?.whyWeDesigned || {
    title: "Why We Designed This Journey",
    paragraphs: [],
    quote: "",
  }

  const paragraphs = whyData.paragraphs || []

  const handleAddParagraph = () => {
    const next = [...paragraphs, ""]
    updateField("data.whyWeDesigned.paragraphs", next)
  }

  const handleParagraphChange = (index: number, val: string) => {
    const next = [...paragraphs]
    next[index] = val
    updateField("data.whyWeDesigned.paragraphs", next)
  }

  const handleRemoveParagraph = (index: number) => {
    const next = paragraphs.filter((_, i) => i !== index)
    updateField("data.whyWeDesigned.paragraphs", next)
  }

  return (
    <FormSection
      title="Why We Designed This Journey"
      active={!!openSections["why-designed"]}
      onClick={() => toggleSection("why-designed")}
    >
      <div className="space-y-3.5">
        <JourneyInputField
          label="Section Title"
          value={whyData.title ?? "Why We Designed This Journey"}
          onChange={(val) => updateField("data.whyWeDesigned.title", val)}
          placeholder="Why We Designed This Journey"
        />

        <JourneyTextareaField
          label="Curator's Note / Pull Quote"
          value={whyData.quote ?? ""}
          onChange={(val) => updateField("data.whyWeDesigned.quote", val)}
          placeholder="An intimate immersion designed for travelers seeking wild natural beauty without sacrificing comfort..."
          rows={2}
          description="Highlighted quote attributed to the journey curator."
        />

        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Story Paragraphs
            </label>
            <button
              type="button"
              onClick={handleAddParagraph}
              className="flex items-center gap-1 rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Plus className="h-3 w-3" /> Add Paragraph
            </button>
          </div>

          <div className="space-y-3">
            {paragraphs.map((p, idx) => (
              <div key={idx} className="relative rounded-lg border border-border/70 p-2.5 bg-background space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                  <span>Paragraph {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveParagraph(idx)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  value={p}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  rows={3}
                  className="w-full rounded border border-border/60 bg-card p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  placeholder="Enter story paragraph..."
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  )
}
