/* =====================================================
   FAQ — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2 } from "lucide-react"
import type { LocationData, FAQItem } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type LocationFaqFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function LocationFaqForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: LocationFaqFormProps) {
  const updateFAQ = (index: number, field: keyof FAQItem, value: string) =>
    updateArrayItem(
      draft.data.faq_section.questions,
      index,
      field,
      value,
      (next) => updateField("data.faq_section.questions", next)
    )

  return (
    <FormSection
      title="FAQ"
      active={!!openSections["faq"]}
      onClick={() => toggleSection("faq")}
    >
      <div className="space-y-5">
        <UniversalMultimediaForm
          section={draft.data.faq_section as any}
          content={draft.data.faq_section as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.faq_section", {
              ...draft.data.faq_section,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.faq_section", {
              ...draft.data.faq_section,
              ...patch,
            })
          }
          contentMediaKey="imageMultimedia"
          backgroundType={draft.data.faq_section.imageMultimedia?.type}
          sectionTitle="FAQ Image"
          imageTitle="FAQ Image"
          imageLabel="FAQ image"
          imageFieldName="locationFaqImage"
          showImageAltField
        />
        <UniversalMultimediaForm
          section={draft.data.faq_section as any}
          content={draft.data.faq_section as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.faq_section", {
              ...draft.data.faq_section,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.faq_section", {
              ...draft.data.faq_section,
              ...patch,
            })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={
            (draft.data.faq_section as any).backgroundMultimedia?.type
          }
          backgroundTypeStyleKey="locationFaqBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#171717"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationFaqBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationFaqBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />

        <DynamicStyledField
          type="text"
          label="FAQ Title"
          value={draft.data.faq_section.title ?? ""}
          onChange={(value: string) =>
            updateField("data.faq_section.title", value)
          }
          enableStyle
          style={(draft.data.faq_section as any).titleStyle}
          onStyleChange={(style) =>
            updateField("data.faq_section.titleStyle", style)
          }
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Questions</h4>

            <button
              type="button"
              onClick={() => {
                const questions = [
                  ...draft.data.faq_section.questions,
                  {
                    id: Date.now(),
                    question: "",
                    answer: "",
                  },
                ]

                updateField("data.faq_section.questions", questions)
              }}
              className="flex items-center gap-1 text-xs text-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              Add FAQ
            </button>
          </div>

          {draft.data.faq_section.questions.map((faq, index) => (
            <div
              key={faq.id}
              className="rounded-xl border border-border/60 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold">FAQ {index + 1}</span>

                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "data.faq_section.questions",
                      draft.data.faq_section.questions.filter(
                        (_, i) => i !== index
                      )
                    )
                  }
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <DynamicStyledField
                  type="text"
                  label="Question"
                  value={faq.question ?? ""}
                  onChange={(value: string) =>
                    updateFAQ(index, "question", value)
                  }
                  enableStyle
                  style={(faq as any).questionStyle}
                  onStyleChange={(style) =>
                    updateFAQ(index, "questionStyle" as any, style as any)
                  }
                />

                <DynamicStyledField
                  type="textarea"
                  label="Answer"
                  value={faq.answer ?? ""}
                  onChange={(value: string) =>
                    updateFAQ(index, "answer", value)
                  }
                  enableStyle
                  style={(faq as any).answerStyle}
                  onStyleChange={(style) =>
                    updateFAQ(index, "answerStyle" as any, style as any)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FormSection>
  )
}
