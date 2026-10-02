import { useState } from "react"
import { Plus, Trash2, Tag, FileText } from "lucide-react"

import type { LocationFormSectionProps } from "../../config/locationSections"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"

export function WhyVisitForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const sectionKey = "why-visit"
  const isOpen = Boolean(openSections[sectionKey])

  const whyData = draft.why || {}

  const paragraphs: string[] = Array.isArray(whyData.description_paragraphs)
    ? whyData.description_paragraphs
    : typeof whyData.description === "string"
      ? [whyData.description]
      : []

  const tags: string[] = Array.isArray(whyData.tags) ? whyData.tags : []

  const [newTagInput, setNewTagInput] = useState("")

  const handleUpdateParagraph = (index: number, val: string) => {
    const updated = [...paragraphs]
    updated[index] = val
    updateField("why.description_paragraphs", updated)
  }

  const handleAddParagraph = () => {
    const updated = [...paragraphs, ""]
    updateField("why.description_paragraphs", updated)
  }

  const handleRemoveParagraph = (index: number) => {
    const updated = paragraphs.filter((_, i) => i !== index)
    updateField("why.description_paragraphs", updated)
  }

  const handleAddTag = () => {
    if (!newTagInput.trim()) return
    const trimmed = newTagInput.trim()
    if (!tags.includes(trimmed)) {
      updateField("why.tags", [...tags, trimmed])
    }
    setNewTagInput("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    updateField(
      "why.tags",
      tags.filter((t) => t !== tagToRemove)
    )
  }

  return (
    <FormSection
      title="Why Visit Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex flex-col gap-5">
        {/* Tagline / Subtitle */}
        <DynamicStyledField
          type="text"
          label="Section Eyebrow / Tagline"
          fieldName="subtitle"
          value={whyData.subtitle}
          onChange={(val: any) => updateField("why.subtitle", val)}
          placeholder="e.g. WHY VISIT Dhërmi"
        />

        {/* Main Title */}
        <DynamicStyledField
          type="text"
          label="Main Section Title"
          fieldName="title"
          value={whyData.title}
          onChange={(val: any) => updateField("why.title", val)}
          placeholder="e.g. A destination where mountains meet the Ionian Sea"
        />

        {/* Description Paragraphs List */}
        <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Story Paragraphs ({paragraphs.length})
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddParagraph}
              className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              Add Paragraph
            </button>
          </div>

          {paragraphs.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-2">
              No paragraphs added. Click &quot;Add Paragraph&quot; above.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {paragraphs.map((p, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <textarea
                    value={p}
                    onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                    placeholder={`Paragraph ${idx + 1}...`}
                    rows={3}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveParagraph(idx)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition rounded cursor-pointer"
                    title="Delete paragraph"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tag Pills Manager */}
        <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 bg-muted/20">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Highlight Tags / Pills ({tags.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-2 py-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder="Add a new tag (e.g. Beaches, Hiking)..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        </div>

        {/* Featured Right Image / Media */}
        <UniversalMultimediaForm
          title="Featured Right Media (Image / Video)"
          value={whyData.imageMultimedia}
          onChange={(val: any) => updateField("why.imageMultimedia", val)}
          defaultShow="image"
          defaultColor="#EDE7D8"
        />

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Styling & Multimedia"
          value={whyData.backgroundMultimedia}
          onChange={(val: any) => updateField("why.backgroundMultimedia", val)}
          defaultColor="#FFFFFF"
        />
      </div>
    </FormSection>
  )
}

