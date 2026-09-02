/* =====================================================
   GEOGRAPHY — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ArrayField, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type GeographyFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function GeographyForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: GeographyFormProps) {

    return (
                <FormSection
                    title="Geography"
                    active={
                        !!openSections["geography"]
                    }
                    onClick={() =>
                        toggleSection(
                            "geography"
                        )
                    }
                >
                    <div className="space-y-4">
                        <Field
                            label="Highest Point Name"
                            value={
                                draft.data
                                    .geography
                                    .highestPoint
                                    .name
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.geography.highestPoint.name",
                                    value
                                )
                            }
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field
                                label="Highest Point Elevation"
                                value={
                                    draft.data
                                        .geography
                                        .highestPoint
                                        .elevation
                                }
                                onChange={(
                                    value
                                ) =>
                                    updateField(
                                        "data.geography.highestPoint.elevation",
                                        Number(
                                            value
                                        )
                                    )
                                }
                            />

                            <Field
                                label="Unit"
                                value={
                                    draft.data
                                        .geography
                                        .highestPoint
                                        .unit
                                }
                                onChange={(
                                    value
                                ) =>
                                    updateField(
                                        "data.geography.highestPoint.unit",
                                        value
                                    )
                                }
                            />
                        </div>

                        <ArrayField
                            label="Major Landscapes"
                            values={
                                draft.data
                                    .geography
                                    .majorLandscapes
                            }
                            onChange={(
                                values
                            ) =>
                                updateField(
                                    "data.geography.majorLandscapes",
                                    values
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
