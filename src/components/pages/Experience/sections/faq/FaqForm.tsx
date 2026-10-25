import { THEME_COLORS } from "@/config/theme"
import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"
import { getSafeStringValue } from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyFaq } from "../../shared/emptyExperience"

export interface FAQItemData {
  question?: any
  answer?: any
  multimedia?: any
  imageMultimedia?: any
}

export function FaqForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ExperienceFormSectionProps) {
  const faqData = draft?.faq || {
    title: {
      value: "Frequently Asked Questions",
      textColor: THEME_COLORS.primary,
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    imageMultimedia: null,
    backgroundMultimedia: null,
    items: [],
  }

  const items: FAQItemData[] = Array.isArray(faqData.items) ? faqData.items : []
  const isOpen = Boolean(openSections["faq"])
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const updateFaqField = (fieldKey: string, value: any) => {
    updateField(`faq.${fieldKey}`, value)
  }

  const updateItems = (newItems: FAQItemData[]) => {
    updateFaqField("items", newItems)
  }

  const handleAddQuestion = () => {
    const newQ: FAQItemData = {
      question: {
        value: "",
        textColor: THEME_COLORS.primary,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      answer: {
        value: "",
        textColor: THEME_COLORS.muted,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      multimedia: null,
    }

    const updated = [...items, newQ]
    updateItems(updated)
    setExpandedIndex(updated.length - 1)
  }

  const handleRemoveQuestion = (indexToRemove: number) => {
    const updated = items.filter((_, idx) => idx !== indexToRemove)
    updateItems(updated)
    if (expandedIndex === indexToRemove) {
      setExpandedIndex(null)
    } else if (expandedIndex !== null && expandedIndex > indexToRemove) {
      setExpandedIndex(expandedIndex - 1)
    }
  }

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const updated = [...items]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    updateItems(updated)
    setExpandedIndex(targetIndex)
  }

  const handleUpdateItem = (
    index: number,
    fieldKey: keyof FAQItemData,
    value: any
  ) => {
    const updated = items.map((q, idx) => {
      if (idx !== index) return q
      return {
        ...q,
        [fieldKey]: value,
      }
    })
    updateItems(updated)
  }

  return (
    <FormSection
      title="Frequently Asked Questions (FAQ)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("faq")}
    >
      <div className="flex flex-col gap-6">
        {/* Section Header Settings */}
        <div className="rounded-md border border-border/70 bg-card/60 p-4 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Section Header & Title
          </h4>

          {/* Main Section Title */}
          <DynamicStyledField
            type="text"
            label="Section Title"
            fieldName="faq.title"
            placeholder="e.g. Frequently Asked Questions"
            value={faqData.title}
            onChange={(val) => updateFaqField("title", val)}
          />
        </div>

        {/* Featured Side Media */}
        <UniversalMultimediaForm
          title="Featured Side Media"
          fieldName="faq.imageMultimedia"
          imageFieldName="experienceFaqFeaturedImage"
          videoFieldName="experienceFaqFeaturedVideo"
          hideFieldNameBadge={true}
          value={faqData.imageMultimedia || emptyFaq.imageMultimedia}
          onChange={(multimedia) => updateFaqField("imageMultimedia", multimedia)}
        />

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="faq.backgroundMultimedia"
          imageFieldName="experienceFaqBgImage"
          videoFieldName="experienceFaqBgVideo"
          hideFieldNameBadge={true}
          value={faqData.backgroundMultimedia || emptyFaq.backgroundMultimedia}
          onChange={(multimedia) => updateFaqField("backgroundMultimedia", multimedia)}
        />

        {/* Questions & Answers Repeater */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                Questions & Answers ({items.length})
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add and curate practical questions regarding this experience.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Question
            </button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                No FAQ items added yet
              </p>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer mt-3"
              >
                <Plus className="h-3.5 w-3.5" />
                Add First Question
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((q, index) => {
                const isItemOpen = expandedIndex === index
                const qTitle = getSafeStringValue(q.question)

                return (
                  <div
                    key={`faq-${index}`}
                    className={`rounded-md border transition-all duration-200 ${isItemOpen
                        ? "border-primary/50 bg-card shadow-sm"
                        : "border-border/70 bg-card/60 hover:border-border"
                      }`}
                  >
                    {/* Item Header */}
                    <div className="flex items-center justify-between p-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(isItemOpen ? null : index)}
                        className="flex flex-1 items-center gap-3 text-left overflow-hidden group cursor-pointer"
                      >
                        <span className="flex h-6 w-7 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-mono font-semibold text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                            {qTitle || "Untitled Question"}
                          </p>
                        </div>
                      </button>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveQuestion(index, "up")}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === items.length - 1}
                          onClick={() => handleMoveQuestion(index, "down")}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-1 cursor-pointer"
                          title="Delete question"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedIndex(isItemOpen ? null : index)}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ml-1 cursor-pointer"
                        >
                          {isItemOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Form Body */}
                    {isItemOpen && (
                      <div className="border-t border-border/60 p-4 space-y-4 bg-muted/5 rounded-b-xl">
                        <DynamicStyledField
                          type="text"
                          label="Question"
                          fieldName={`faq.items.${index}.question`}
                          placeholder="e.g. Is prior helicopter experience required?"
                          value={q.question}
                          onChange={(val) => handleUpdateItem(index, "question", val)}
                        />

                        <DynamicStyledField
                          type="textarea"
                          label="Answer"
                          rows={4}
                          fieldName={`faq.items.${index}.answer`}
                          placeholder="e.g. No prior experience is necessary. All safety briefings and gear are provided..."
                          value={q.answer}
                          onChange={(val) => handleUpdateItem(index, "answer", val)}
                        />

                        <UniversalMultimediaForm
                          title="Question Custom Side Media"
                          fieldName={`faq.items.${index}.multimedia`}
                          imageFieldName={`expFaqItemImg_${index}`}
                          videoFieldName={`expFaqItemVid_${index}`}
                          hideFieldNameBadge={true}
                          collapsible={true}
                          value={q.multimedia || q.imageMultimedia}
                          onChange={(multimedia) => handleUpdateItem(index, "multimedia", multimedia)}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </FormSection>
  )
}

export default FaqForm
