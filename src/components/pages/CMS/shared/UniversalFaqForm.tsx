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

export interface FAQItemData {
  question?: any
  answer?: any
  multimedia?: any
  imageMultimedia?: any
}

export const createDefaultFaqItem = (): FAQItemData => ({
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
  multimedia: {
    show: "image",
    color: {
      color: THEME_COLORS.bgHeroDark,
      opacity: 100,
      width: "100%",
      height: "100%",
      aspectRatio: "auto",
    },
    image: {
      url: "",
      alt: "",
      opacity: 100,
      overlayColor: THEME_COLORS.overlayBlack,
      overlayOpacity: 45,
      width: "100%",
      height: "auto",
      aspectRatio: "auto",
      fit: "cover",
    },
    video: {
      url: "",
      alt: "",
      opacity: 100,
      overlayColor: THEME_COLORS.overlayBlack,
      overlayOpacity: 45,
      autoplay: true,
      loop: true,
      muted: true,
      width: "100%",
      height: "auto",
      aspectRatio: "auto",
      fit: "cover",
    },
  },
})

export const createDefaultUniversalFaq = () => ({
  title: {
    value: "Frequently Asked Questions",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  imageMultimedia: {
    show: "image",
    color: {
      color: THEME_COLORS.bgHeroDark,
      opacity: 100,
      width: "100%",
      height: "100%",
      aspectRatio: "auto",
    },
    image: {
      url: "",
      alt: "",
      opacity: 100,
      overlayColor: THEME_COLORS.overlayBlack,
      overlayOpacity: 45,
      width: "100%",
      height: "auto",
      aspectRatio: "auto",
      fit: "cover",
    },
    video: {
      url: "",
      alt: "",
      opacity: 100,
      overlayColor: THEME_COLORS.overlayBlack,
      overlayOpacity: 45,
      autoplay: true,
      loop: true,
      muted: true,
      width: "100%",
      height: "auto",
      aspectRatio: "auto",
      fit: "cover",
    },
  },
  backgroundMultimedia: {
    show: "color",
    color: {
      color: "transparent",
      opacity: 100,
      width: "100%",
      height: "100%",
      aspectRatio: "auto",
    },
    image: {
      url: "",
      alt: "",
      opacity: 100,
      overlayColor: THEME_COLORS.overlayBlack,
      overlayOpacity: 45,
      width: "100%",
      height: "auto",
      aspectRatio: "auto",
      fit: "cover",
    },
    video: {
      url: "",
      alt: "",
      opacity: 100,
      overlayColor: THEME_COLORS.overlayBlack,
      overlayOpacity: 45,
      autoplay: true,
      loop: true,
      muted: true,
      width: "100%",
      height: "auto",
      aspectRatio: "auto",
      fit: "cover",
    },
  },
  items: [],
})

export interface UniversalFaqFormProps {
  draft?: any
  updateField?: (path: string, value: any) => void
  openSections?: Record<string, boolean>
  toggleSection?: (key: string) => void
  sectionNumber?: string | number
  sectionKey?: string
  title?: string
  subtitle?: string
  mediaPrefix?: string
  faqData?: any
  onChange?: (newFaqData: any) => void
}

function getSafeStringValue(field: any): string {
  if (!field) return ""
  if (typeof field === "string") return field
  if (typeof field === "object" && typeof field.value === "string") return field.value
  return ""
}

export function UniversalFaqForm({
  draft,
  updateField,
  openSections = {},
  toggleSection,
  sectionNumber,
  sectionKey = "faq",
  title = "Frequently Asked Questions (FAQ)",
  subtitle = "Add and curate frequently asked questions.",
  mediaPrefix = "faq",
  faqData: directFaqData,
  onChange,
}: UniversalFaqFormProps) {
  const faqData =
    directFaqData ||
    draft?.[sectionKey] ||
    draft?.faq ||
    draft?.data?.[sectionKey] ||
    draft?.data?.faq ||
    draft?.faqSection ||
    draft?.faq_section ||
    draft?.data?.faq_section ||
    createDefaultUniversalFaq()

  const items: FAQItemData[] = Array.isArray(faqData.items)
    ? faqData.items
    : Array.isArray(faqData.questions)
    ? faqData.questions
    : []

  const isOpen = Boolean(openSections[sectionKey])
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const updateFaqField = (fieldKey: string, value: any) => {
    const updated = {
      ...faqData,
      [fieldKey]: value,
    }
    if (updateField) {
      updateField(`${sectionKey}.${fieldKey}`, value)
    }
    if (onChange) {
      onChange(updated)
    }
  }

  const updateItems = (newItems: FAQItemData[]) => {
    updateFaqField("items", newItems)
  }

  const handleAddQuestion = () => {
    const newQ = createDefaultFaqItem()
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

  const onToggle = () => {
    if (toggleSection) {
      toggleSection(sectionKey)
    }
  }

  return (
    <FormSection
      title={title}
      sectionNumber={sectionNumber ? String(sectionNumber) : undefined}
      active={isOpen}
      onClick={onToggle}
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
            fieldName={`${sectionKey}.title`}
            placeholder="e.g. Frequently Asked Questions"
            value={faqData.title}
            onChange={(val) => updateFaqField("title", val)}
          />
        </div>

        {/* Featured Side Media (Square Image / Video) */}
        <UniversalMultimediaForm
          title="Featured Side Media (Default Main Visual)"
          fieldName={`${sectionKey}.imageMultimedia`}
          imageFieldName={`${mediaPrefix}FeaturedImage`}
          videoFieldName={`${mediaPrefix}FeaturedVideo`}
          hideFieldNameBadge={true}
          value={faqData.imageMultimedia}
          onChange={(multimedia) => updateFaqField("imageMultimedia", multimedia)}
        />

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Media (Color / Image / Video)"
          fieldName={`${sectionKey}.backgroundMultimedia`}
          imageFieldName={`${mediaPrefix}BgImage`}
          videoFieldName={`${mediaPrefix}BgVideo`}
          hideFieldNameBadge={true}
          value={faqData.backgroundMultimedia}
          onChange={(multimedia) => updateFaqField("backgroundMultimedia", multimedia)}
        />

        {/* Questions & Answers Repeater List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                FAQ Questions & Answers ({items.length})
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
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
                const qTitle = getSafeStringValue(q.question)

                return (
                  <div
                    key={`faq-${index}`}
                    className={`rounded-md border transition-all duration-200 ${
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

                      {/* Action Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveQuestion(index, "up")}
                          disabled={index === 0}
                          title="Move Up"
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveQuestion(index, "down")}
                          disabled={index === items.length - 1}
                          title="Move Down"
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          title="Delete Question"
                          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer ml-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedIndex(isItemOpen ? null : index)
                          }
                          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isItemOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Accordion Body */}
                    {isItemOpen && (
                      <div className="border-t border-border/70 p-4 space-y-5 bg-background/50">
                        {/* Question Rich Styled Field */}
                        <DynamicStyledField
                          type="text"
                          label="Question"
                          fieldName={`${sectionKey}.items.${index}.question`}
                          placeholder="e.g. When is the best time of year to visit?"
                          value={q.question}
                          onChange={(val) =>
                            handleUpdateItem(index, "question", val)
                          }
                        />

                        {/* Answer Rich Styled Field */}
                        <DynamicStyledField
                          type="richtext"
                          label="Answer Details"
                          fieldName={`${sectionKey}.items.${index}.answer`}
                          placeholder="Provide the comprehensive answer, insider advice, or context..."
                          value={q.answer}
                          onChange={(val) =>
                            handleUpdateItem(index, "answer", val)
                          }
                        />

                        {/* Optional Question-Specific Multimedia */}
                        <UniversalMultimediaForm
                          title="Optional Question Media (Replaces default side visual when expanded)"
                          fieldName={`${sectionKey}.items.${index}.multimedia`}
                          imageFieldName={`${mediaPrefix}ItemImage_${index}`}
                          videoFieldName={`${mediaPrefix}ItemVideo_${index}`}
                          hideFieldNameBadge={true}
                          value={q.multimedia || q.imageMultimedia}
                          onChange={(mediaVal) =>
                            handleUpdateItem(index, "multimedia", mediaVal)
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

export default UniversalFaqForm
