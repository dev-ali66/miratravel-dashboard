import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { emptyFaqList } from "../../config/emptyFaqPayload"

export interface FaqListFormProps {
  section: any
  index: number
  updateSection: (index: number, patch: Record<string, any>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number
}

export function FaqListForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: FaqListFormProps) {
  const faqList = section || emptyFaqList
  const isOpen = Boolean(openSections["faq_list"])
  const items = Array.isArray(faqList.items)
    ? faqList.items
    : Array.isArray(faqList.topics)
    ? faqList.topics
    : emptyFaqList.items
  const advice = faqList.personalAdvice || emptyFaqList.personalAdvice

  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({ 0: true })

  const updateListField = (fieldKey: string, value: any) => {
    if (fieldKey === "items" || fieldKey === "topics") {
      updateSection(index, { items: value, topics: value })
    } else {
      updateSection(index, { [fieldKey]: value })
    }
  }

  const toggleTopicExpand = (idx: number) => {
    setExpandedTopics((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const handleAddTopic = () => {
    const newTopic = {
      id: `topic-${Date.now()}`,
      title: { value: "New Category Topic", textColor: "", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "Short topic description", textColor: "", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      icon: "planning",
      questions: [
        {
          id: `q-${Date.now()}-1`,
          question: { value: "Sample Question?", textColor: "", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
          answer: { value: "Sample detailed answer.", textColor: "", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
        },
      ],
    }
    updateListField("items", [...items, newTopic])
    setExpandedTopics((prev) => ({ ...prev, [items.length]: true }))
  }

  const handleRemoveTopic = (topicIdx: number) => {
    const updated = items.filter((_: any, i: number) => i !== topicIdx)
    updateListField("items", updated)
  }

  const handleUpdateTopic = (topicIdx: number, field: string, value: any) => {
    const updated = [...items]
    if (field === "icon") {
      updated[topicIdx] = { ...updated[topicIdx], [field]: value }
    } else {
      const current = updated[topicIdx][field]
      const nextVal = typeof current === "object" && current !== null
        ? { ...current, value }
        : { value, textColor: "", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 }
      updated[topicIdx] = { ...updated[topicIdx], [field]: nextVal }
    }
    updateListField("items", updated)
  }

  const handleAddQuestion = (topicIdx: number) => {
    const updated = [...items]
    const currentQuestions = Array.isArray(updated[topicIdx].questions) ? updated[topicIdx].questions : []
    const newQ = {
      id: `q-${Date.now()}`,
      question: { value: "New Question Title?", textColor: "", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      answer: { value: "Write detailed answer here...", textColor: "", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
    }
    updated[topicIdx] = {
      ...updated[topicIdx],
      questions: [...currentQuestions, newQ],
    }
    updateListField("items", updated)
  }

  const handleRemoveQuestion = (topicIdx: number, qIdx: number) => {
    const updated = [...items]
    const currentQuestions = Array.isArray(updated[topicIdx].questions) ? updated[topicIdx].questions : []
    updated[topicIdx] = {
      ...updated[topicIdx],
      questions: currentQuestions.filter((_: any, i: number) => i !== qIdx),
    }
    updateListField("items", updated)
  }

  const handleUpdateQuestion = (topicIdx: number, qIdx: number, field: string, value: any) => {
    const updated = [...items]
    const currentQuestions = [...(updated[topicIdx].questions || [])]
    const current = currentQuestions[qIdx][field]
    const nextVal = typeof current === "object" && current !== null
      ? { ...current, value }
      : { value, textColor: "", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 }
    currentQuestions[qIdx] = { ...currentQuestions[qIdx], [field]: nextVal }
    updated[topicIdx] = { ...updated[topicIdx], questions: currentQuestions }
    updateListField("items", updated)
  }

  const handleUpdateAdvice = (fieldKey: string, value: any) => {
    updateListField("personalAdvice", { ...advice, [fieldKey]: value })
  }

  return (
    <FormSection
      title="FAQ Categories, Questions & Personal Advice Card"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("faq_list")}
    >
      <div className="flex flex-col gap-6">
        {/* Section Header Title */}
        <DynamicStyledField
          type="text"
          label="Browse by Topic Section Title"
          fieldName="faq_list.title"
          placeholder="e.g. Browse by topic"
          value={faqList.title}
          onChange={(val) => updateListField("title", val)}
        />

        {/* Topics Repeater List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <h3 className="text-sm font-semibold text-foreground">
              FAQ Topics & Categorized Questions ({items.length})
            </h3>
            <button
              type="button"
              onClick={handleAddTopic}
              className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add New Topic
            </button>
          </div>

          {items.map((topic: any, tIdx: number) => {
            const isTopicOpen = Boolean(expandedTopics[tIdx])
            const topicQuestions = Array.isArray(topic.questions) ? topic.questions : []

            return (
              <div
                key={topic.id || tIdx}
                className="rounded-lg border border-border/80 bg-card p-4 shadow-sm"
              >
                {/* Topic Header Accordion Bar */}
                <div className="flex items-center justify-between gap-3">
                  <div
                    onClick={() => toggleTopicExpand(tIdx)}
                    className="flex flex-1 items-center gap-2 cursor-pointer select-none"
                  >
                    {isTopicOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs font-semibold text-primary">
                      Topic #{tIdx + 1}:
                    </span>
                    <span className="text-sm font-medium text-foreground truncate">
                      {(typeof topic.title === "object" ? topic.title?.value : topic.title) || "Untitled Topic"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({topicQuestions.length} Q&As)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(tIdx)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded transition cursor-pointer"
                    title="Delete Topic"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Topic Fields */}
                {isTopicOpen && (
                  <div className="mt-4 pt-4 border-t border-border/60 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Topic Title
                        </label>
                        <input
                          type="text"
                          value={typeof topic.title === "object" ? topic.title.value : topic.title}
                          onChange={(e) => handleUpdateTopic(tIdx, "title", e.target.value)}
                          placeholder="e.g. Planning Your Journey"
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Icon Type
                        </label>
                        <select
                          value={topic.icon || "planning"}
                          onChange={(e) => handleUpdateTopic(tIdx, "icon", e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="planning">Planning Icon</option>
                          <option value="accommodation">Accommodation Icon</option>
                          <option value="payments">Payments Icon</option>
                          <option value="before-travel">Before You Travel Icon</option>
                          <option value="during-journey">During Your Journey Icon</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Topic Subtitle / Description
                      </label>
                      <input
                        type="text"
                        value={typeof topic.description === "object" ? topic.description.value : topic.description}
                        onChange={(e) => handleUpdateTopic(tIdx, "description", e.target.value)}
                        placeholder="e.g. Booking process, tailor-made journeys and timing."
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    {/* Question & Answer Items for this Topic */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          Questions & Answers
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddQuestion(tIdx)}
                          className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          Add Question
                        </button>
                      </div>

                      {topicQuestions.map((qItem: any, qIdx: number) => (
                        <div
                          key={qItem.id || qIdx}
                          className="rounded-md border border-border/60 bg-muted/20 p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-muted-foreground">
                              Q{qIdx + 1}:
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(tIdx, qIdx)}
                              className="text-muted-foreground hover:text-destructive text-[11px] cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>

                          <input
                            type="text"
                            value={typeof qItem.question === "object" ? qItem.question.value : qItem.question}
                            onChange={(e) => handleUpdateQuestion(tIdx, qIdx, "question", e.target.value)}
                            placeholder="Question text..."
                            className="w-full rounded border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />

                          <textarea
                            rows={2}
                            value={typeof qItem.answer === "object" ? qItem.answer.value : qItem.answer}
                            onChange={(e) => handleUpdateQuestion(tIdx, qIdx, "answer", e.target.value)}
                            placeholder="Detailed answer content..."
                            className="w-full rounded border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right Column: "Need Personal Advice?" Card Config */}
        <div className="rounded-lg border border-border/80 bg-card p-4 space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border/60 pb-2">
            Side Card: "Need Personal Advice?" Settings
          </h3>

          <DynamicStyledField
            type="text"
            label="Advice Card Title"
            fieldName="faq_list.personalAdvice.title"
            placeholder="e.g. Need personal advice?"
            value={advice.title}
            onChange={(val) => handleUpdateAdvice("title", val)}
          />

          <DynamicStyledField
            type="textarea"
            rows={2}
            label="Advice Card Description"
            fieldName="faq_list.personalAdvice.description"
            placeholder="One conversation is often more valuable than reading twenty answers..."
            value={advice.description}
            onChange={(val) => handleUpdateAdvice("description", val)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Call Us Title
              </label>
              <input
                type="text"
                value={advice.phoneTitle}
                onChange={(e) => handleUpdateAdvice("phoneTitle", e.target.value)}
                className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Phone Number / Value
              </label>
              <input
                type="text"
                value={advice.phoneValue}
                onChange={(e) => handleUpdateAdvice("phoneValue", e.target.value)}
                className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Email Us Title
              </label>
              <input
                type="text"
                value={advice.emailTitle}
                onChange={(e) => handleUpdateAdvice("emailTitle", e.target.value)}
                className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Email Address / Value
              </label>
              <input
                type="text"
                value={advice.emailValue}
                onChange={(e) => handleUpdateAdvice("emailValue", e.target.value)}
                className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Plan Title
              </label>
              <input
                type="text"
                value={advice.planTitle}
                onChange={(e) => handleUpdateAdvice("planTitle", e.target.value)}
                className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Plan Link Href
              </label>
              <input
                type="text"
                value={advice.planHref}
                onChange={(e) => handleUpdateAdvice("planHref", e.target.value)}
                className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Plan Card Description
            </label>
            <input
              type="text"
              value={advice.planDescription}
              onChange={(e) => handleUpdateAdvice("planDescription", e.target.value)}
              className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs text-foreground"
            />
          </div>

          <UniversalMultimediaForm
            title="Travel Specialist Avatar / Media"
            fieldName="faq_list.personalAdvice.planImageMultimedia"
            defaultShow="image"
            imageFieldName="cmsFaqTravelDesignerImage"
            value={advice.planImageMultimedia || emptyFaqList.personalAdvice.planImageMultimedia}
            onChange={(multimedia) => handleUpdateAdvice("planImageMultimedia", multimedia)}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default FaqListForm
