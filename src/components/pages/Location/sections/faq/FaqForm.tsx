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
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import type { FAQItem } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

export type FAQItemData = FAQItem

export function FaqForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const faqData =
    draft?.faq ||
    (draft as any)?.data?.faq ||
    (draft as any)?.faqSection ||
    (draft as any)?.faq_section ||
    (draft as any)?.data?.faq_section || {
      title: {
        value: "Frequently Asked Questions",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      imageMultimedia: null,
      backgroundMultimedia: null,
      items: [],
    }

  const items: FAQItemData[] = Array.isArray(faqData.items)
    ? faqData.items
    : Array.isArray(faqData.questions)
      ? faqData.questions
      : []

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
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      answer: {
        value: "",
        textColor: "#565e69",
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
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-4">
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

        {/* Featured Side Media (Square Image / Video) */}
        <UniversalMultimediaForm
          title="Featured Side Media (Default Main Visual)"
          fieldName="faq.imageMultimedia"
          imageFieldName="locationFaqFeaturedImage"
          videoFieldName="locationFaqFeaturedVideo"
          hideFieldNameBadge={true}
          value={faqData.imageMultimedia || emptyLocation.faqSection?.imageMultimedia || (emptyLocation as any).faq?.imageMultimedia}
          onChange={(multimedia) => updateFaqField("imageMultimedia", multimedia)}
        />

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Media (Color / Image / Video)"
          fieldName="faq.backgroundMultimedia"
          imageFieldName="locationFaqBgImage"
          videoFieldName="locationFaqBgVideo"
          hideFieldNameBadge={true}
          value={faqData.backgroundMultimedia || emptyLocation.faqSection?.backgroundMultimedia || (emptyLocation as any).faq?.backgroundMultimedia}
          onChange={(multimedia) =>
            updateFaqField("backgroundMultimedia", multimedia)
          }
        />

        {/* Questions & Answers Repeater List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                FAQ Questions & Answers ({items.length})
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add and curate frequently asked questions for this destination.
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
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                No FAQ items added yet
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1 mb-4">
                Click below to add your first question and answer pair.
              </p>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Question
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((q, index) => {
                const isItemOpen = expandedIndex === index
                const qTitle =
                  typeof q.question === "object"
                    ? (q.question as any)?.value || ""
                    : q.question || ""

                return (
                  <div
                    key={`faq-${index}`}
                    className={`rounded-xl border transition-all duration-200 ${
                      isItemOpen
                        ? "border-primary/50 bg-card shadow-sm"
                        : "border-border/70 bg-card/60 hover:border-border"
                    }`}
                  >
                    {/* Item Header / Accordion Bar */}
                    <div className="flex items-center justify-between p-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedIndex(isItemOpen ? null : index)
                        }
                        className="flex flex-1 items-center gap-3 text-left overflow-hidden group cursor-pointer"
                      >
                        {/* Number Badge */}
                        <span className="flex h-6 w-7 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-mono font-semibold text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Question Snippet */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                            {qTitle || "Untitled Question"}
                          </p>
                        </div>
                      </button>

                      {/* Reorder and Delete Controls */}
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
                          onClick={() =>
                            setExpandedIndex(isItemOpen ? null : index)
                          }
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

                    {/* Item Form Body */}
                    {isItemOpen && (
                      <div className="border-t border-border/60 p-4 space-y-4 bg-muted/5 rounded-b-xl">
                        {/* Question Input */}
                        <DynamicStyledField
                          type="text"
                          label="Question"
                          fieldName={`faq.items.${index}.question`}
                          placeholder="e.g. What is the best time of year to visit?"
                          value={q.question}
                          onChange={(val) =>
                            handleUpdateItem(index, "question", val)
                          }
                        />

                        {/* Answer Input */}
                        <DynamicStyledField
                          type="textarea"
                          label="Answer"
                          rows={4}
                          fieldName={`faq.items.${index}.answer`}
                          placeholder="e.g. Spring and Autumn offer pleasant temperatures and fewer crowds..."
                          value={q.answer}
                          onChange={(val) =>
                            handleUpdateItem(index, "answer", val)
                          }
                        />

                        {/* Item Custom Side Media */}
                        <UniversalMultimediaForm
                          title="Question Custom Side Media (Shown when opened)"
                          fieldName={`faq.items.${index}.multimedia`}
                          imageFieldName={`locationFaqItemImg_${index}`}
                          videoFieldName={`locationFaqItemVid_${index}`}
                          hideFieldNameBadge={true}
                          collapsible={true}
                          value={q.multimedia || q.imageMultimedia}
                          onChange={(multimedia) =>
                            handleUpdateItem(index, "multimedia", multimedia)
                          }
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
