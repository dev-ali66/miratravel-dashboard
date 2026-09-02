/* =====================================================
   CULTURE — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ArrayField, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type CultureFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function CultureForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: CultureFormProps) {

    return (
                <FormSection
                    title="Culture"
                    active={
                        !!openSections["culture"]
                    }
                    onClick={() =>
                        toggleSection(
                            "culture"
                        )
                    }
                >
                    <div className="space-y-4">
                        <Field
                            label="Description"
                            value={
                                draft.data
                                    .culture
                                    .description
                            }
                            multiline
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.culture.description",
                                    value
                                )
                            }
                        />

                        <ArrayField
                            label="Cuisine"
                            values={
                                draft.data
                                    .culture
                                    .cuisine
                            }
                            onChange={(
                                values
                            ) =>
                                updateField(
                                    "data.culture.cuisine",
                                    values
                                )
                            }
                        />

                        <ArrayField
                            label="Languages"
                            values={
                                draft.data
                                    .culture
                                    .majorLanguages
                            }
                            onChange={(
                                values
                            ) =>
                                updateField(
                                    "data.culture.majorLanguages",
                                    values
                                )
                            }
                        />

                        <ArrayField
                            label="Religions"
                            values={
                                draft.data
                                    .culture
                                    .majorReligions
                            }
                            onChange={(
                                values
                            ) =>
                                updateField(
                                    "data.culture.majorReligions",
                                    values
                                )
                            }
                        />

                        <ArrayField
                            label="Festivals"
                            values={
                                draft.data
                                    .culture
                                    .famousFestivals
                            }
                            onChange={(
                                values
                            ) =>
                                updateField(
                                    "data.culture.famousFestivals",
                                    values
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
