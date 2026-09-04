/* =====================================================
   CULTURE — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { ColorField, Field, ArrayField, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

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
    const culture = draft.data?.culture ?? emptyLocation.data.culture
    const style = culture.style ?? emptyLocation.data.culture.style ?? {}

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
                                    culture.description
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
                                    culture.cuisine
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
                                    culture.majorLanguages
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
                                    culture.majorReligions
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
                                    culture.famousFestivals
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

                        <div className="space-y-4 border-t border-border/60 pt-4">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Appearance
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <ColorField label="Background Color" value={style.backgroundColor ?? ""} onChange={(value) => updateField("data.culture.style.backgroundColor", value)} />
                                <ColorField label="Icon Color" value={style.iconColor ?? ""} onChange={(value) => updateField("data.culture.style.iconColor", value)} />
                                <ColorField label="Label Color" value={style.labelTextColor ?? ""} onChange={(value) => updateField("data.culture.style.labelTextColor", value)} />
                                <ColorField label="Title Color" value={style.titleTextColor ?? ""} onChange={(value) => updateField("data.culture.style.titleTextColor", value)} />
                                <ColorField label="Description Color" value={style.descriptionTextColor ?? ""} onChange={(value) => updateField("data.culture.style.descriptionTextColor", value)} />
                                <ColorField label="Value Color" value={style.valueTextColor ?? ""} onChange={(value) => updateField("data.culture.style.valueTextColor", value)} />
                            </div>
                        </div>
                    </div>
                </FormSection>
    )
}
