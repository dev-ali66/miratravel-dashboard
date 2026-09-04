/* =====================================================
   FAQ — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ImageField, FormSection } from "../../shared/fields"
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

    const updateFAQ = (
        index: number,
        field: keyof FAQItem,
        value: string
    ) =>
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
                    active={
                        !!openSections["faq"]
                    }
                    onClick={() =>
                        toggleSection(
                            "faq"
                        )
                    }
                >
                    <div className="space-y-5">
                        <ImageField
                            label="FAQ Image"
                            value={
                                draft.data
                                    .faq_section
                                    .image
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.faq_section.image",
                                    value
                                )
                            }
                        />

                        <Field
                            label="FAQ Title"
                            value={
                                draft.data
                                    .faq_section
                                    .title
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.faq_section.title",
                                    value
                                )
                            }
                        />

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">
                                    Questions
                                </h4>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const questions =
                                            [
                                                ...draft
                                                    .data
                                                    .faq_section
                                                    .questions,
                                                {
                                                    id: Date.now(),
                                                    question:
                                                        "",
                                                    answer:
                                                        "",
                                                },
                                            ]

                                        updateField(
                                            "data.faq_section.questions",
                                            questions
                                        )
                                    }}
                                    className="flex items-center gap-1 text-xs text-primary"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add FAQ
                                </button>
                            </div>

                            {draft.data.faq_section.questions.map(
                                (
                                    faq,
                                    index
                                ) => (
                                    <div
                                        key={
                                            faq.id
                                        }
                                        className="rounded-xl border border-border/60 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-xs font-semibold">
                                                FAQ{" "}
                                                {index +
                                                    1}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateField(
                                                        "data.faq_section.questions",
                                                        draft
                                                            .data
                                                            .faq_section
                                                            .questions.filter(
                                                                (
                                                                    _,
                                                                    i
                                                                ) =>
                                                                    i !==
                                                                    index
                                                            )
                                                    )
                                                }
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <Field
                                                label="Question"
                                                value={
                                                    faq.question
                                                }
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateFAQ(
                                                        index,
                                                        "question",
                                                        value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="Answer"
                                                value={
                                                    faq.answer
                                                }
                                                multiline
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateFAQ(
                                                        index,
                                                        "answer",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </FormSection>
    )
}
