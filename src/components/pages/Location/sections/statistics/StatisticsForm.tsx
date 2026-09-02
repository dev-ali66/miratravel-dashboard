/* =====================================================
   STATISTICS — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type StatisticsFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function StatisticsForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: StatisticsFormProps) {

    return (
                <FormSection
                    title="Statistics"
                    active={
                        !!openSections["statistics"]
                    }
                    onClick={() =>
                        toggleSection(
                            "statistics"
                        )
                    }
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field
                            label="Area"
                            value={draft.data?.statistics?.area?.value ?? ""}
                            onChange={(value) =>
                                updateField(
                                    "data.statistics.area.value",
                                    value === "" ? 0 : Number(value)
                                )
                            }
                        />
                        <Field
                            label="Area Unit"
                            value={draft.data?.statistics?.area?.unit ?? "km²"}
                            onChange={(value) =>
                                updateField(
                                    "data.statistics.area.unit",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Elevation"
                            value={
                                draft.data?.statistics?.elevation?.value ??
                                0
                            }
                            onChange={(value) =>
                                updateField(
                                    "data.statistics.elevation.value",
                                    Number(value)
                                )
                            }
                        />

                        <Field
                            label="Elevation Unit"
                            value={
                                draft.data?.statistics?.elevation?.unit ??
                                "m"
                            }
                            onChange={(value) =>
                                updateField(
                                    "data.statistics.elevation.unit",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Population"
                            value={
                                draft.data?.statistics?.population?.value ??
                                ""
                            }
                            onChange={(value) =>
                                updateField(
                                    "data.statistics.population.value",
                                    value === "" ? 0 : Number(value)
                                )
                            }
                        />

                        <Field
                            label="Population Year"
                            value={
                                draft.data?.statistics?.population?.year ??
                                2026
                            }
                            onChange={(value) =>
                                updateField(
                                    "data.statistics.population.year",
                                    Number(value)
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
