/* =====================================================
   WHYVISIT — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ImageField, ArrayField, TextArrayField, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type WhyVisitFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function WhyVisitForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: WhyVisitFormProps) {

    return (
                <FormSection
                    title="Why Visit"
                    active={
                        !!openSections["why"]
                    }
                    onClick={() =>
                        toggleSection(
                            "why"
                        )
                    }
                >
                    <div className="space-y-4">
                        <Field
                            label="Subtitle"
                            value={
                                draft.data.why
                                    .subtitle
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.why.subtitle",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Title"
                            value={
                                draft.data.why
                                    .title
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.why.title",
                                    value
                                )
                            }
                        />

                        <ImageField
                            label="Image"
                            value={
                                draft.data.why
                                    .image
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.why.image",
                                    value
                                )
                            }
                        />

                        <ArrayField
                            label="Tags"
                            values={
                                draft.data.why
                                    .tags
                            }
                            onChange={(
                                values
                            ) =>
                                updateField(
                                    "data.why.tags",
                                    values
                                )
                            }
                        />

                        <TextArrayField
                            label="Description Paragraphs"
                            values={
                                draft.data.why
                                    .description_paragraphs
                            }
                            onChange={(
                                values
                            ) =>
                                updateField(
                                    "data.why.description_paragraphs",
                                    values
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
