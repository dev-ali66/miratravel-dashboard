/* =====================================================
   STATISTICS — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { ColorField, Field, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

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
    const statistics = draft.data?.statistics ?? emptyLocation.data.statistics
    const facts = statistics.facts ?? emptyLocation.data.statistics.facts ?? []
    const style = statistics.style ?? {}

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
                        {facts.map((fact, index) => (
                            <div
                                key={`${fact.label}-${index}`}
                                className="space-y-3 rounded-lg border border-border/60 p-3 md:col-span-2"
                            >
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <Field
                                        label="Fact Label"
                                        value={fact.label}
                                        onChange={(value) => {
                                            const next = [...facts]
                                            next[index] = { ...fact, label: value }
                                            updateField("data.statistics.facts", next)
                                        }}
                                    />
                                    <Field
                                        label="Fact Value"
                                        value={fact.value}
                                        onChange={(value) => {
                                            const next = [...facts]
                                            next[index] = { ...fact, value }
                                            updateField("data.statistics.facts", next)
                                        }}
                                    />
                                </div>
                                <Field
                                    label="Fact Description"
                                    value={fact.description}
                                    multiline
                                    onChange={(value) => {
                                        const next = [...facts]
                                        next[index] = { ...fact, description: value }
                                        updateField("data.statistics.facts", next)
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateField(
                                            "data.statistics.facts",
                                            facts.filter((_, factIndex) => factIndex !== index)
                                        )
                                    }
                                    className="text-[10px] font-medium text-destructive"
                                >
                                    Remove fact
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() =>
                                updateField("data.statistics.facts", [
                                    ...facts,
                                    { label: "", value: "", description: "" },
                                ])
                            }
                            className="text-left text-[10px] font-medium text-primary md:col-span-2"
                        >
                            + Add fact
                        </button>

                        <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4 md:col-span-2">
                            <ColorField
                                label="Background Color"
                                value={style.backgroundColor ?? ""}
                                onChange={(value) =>
                                    updateField("data.statistics.style.backgroundColor", value)
                                }
                            />
                            <ColorField
                                label="Border Color"
                                value={style.borderColor ?? ""}
                                onChange={(value) =>
                                    updateField("data.statistics.style.borderColor", value)
                                }
                            />
                            <ColorField
                                label="Label Color"
                                value={style.labelTextColor ?? ""}
                                onChange={(value) =>
                                    updateField("data.statistics.style.labelTextColor", value)
                                }
                            />
                            <ColorField
                                label="Value Color"
                                value={style.valueTextColor ?? ""}
                                onChange={(value) =>
                                    updateField("data.statistics.style.valueTextColor", value)
                                }
                            />
                            <ColorField
                                label="Description Color"
                                value={style.descriptionTextColor ?? ""}
                                onChange={(value) =>
                                    updateField("data.statistics.style.descriptionTextColor", value)
                                }
                            />
                        </div>

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
