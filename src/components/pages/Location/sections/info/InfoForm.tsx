/* =====================================================
   INFO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type InfoFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function InfoForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: InfoFormProps) {

    return (
                <FormSection
                    title="Info"
                    active={
                        !!openSections["info"]
                    }
                    onClick={() =>
                        toggleSection(
                            "info"
                        )
                    }
                >
                    <div className="space-y-4">
                        <Field
                            label="Headline"
                            value={
                                draft.data.info
                                    .headline
                            }
                            multiline
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.info.headline",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Description"
                            value={
                                draft.data.info
                                    .description
                            }
                            multiline
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.info.description",
                                    value
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
