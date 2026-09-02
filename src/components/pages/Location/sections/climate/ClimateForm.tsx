/* =====================================================
   CLIMATE — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ArrayField, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type ClimateFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function ClimateForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: ClimateFormProps) {

    return (
                <FormSection
                    title="Climate"
                    active={
                        !!openSections["climate"]
                    }
                    onClick={() =>
                        toggleSection(
                            "climate"
                        )
                    }
                >
                    <div className="space-y-4">
                        <ArrayField
                            label="Climate Types"
                            values={
                                draft.data
                                    .climate
                                    .types
                            }
                            onChange={(
                                values
                            ) =>
                                updateField(
                                    "data.climate.types",
                                    values
                                )
                            }
                        />

                        <Field
                            label="Description"
                            value={
                                draft.data
                                    .climate
                                    .description
                            }
                            multiline
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.climate.description",
                                    value
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
