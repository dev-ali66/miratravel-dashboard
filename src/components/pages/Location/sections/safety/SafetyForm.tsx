/* =====================================================
   SAFETY — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type SafetyFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function SafetyForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: SafetyFormProps) {

    return (
                <FormSection
                    title="Safety"
                    active={
                        !!openSections["safety"]
                    }
                    onClick={() =>
                        toggleSection(
                            "safety"
                        )
                    }
                >
                    <div className="space-y-4">
                        <Field
                            label="Emergency Number"
                            value={
                                draft.data
                                    .safety
                                    .emergencyNumber
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.safety.emergencyNumber",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Description"
                            value={
                                draft.data
                                    .safety
                                    .description
                            }
                            multiline
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.safety.description",
                                    value
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
