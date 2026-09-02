/* =====================================================
   TRAVELINFO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ArrayField, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type TravelInfoFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function TravelInfoForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: TravelInfoFormProps) {
    return (
        <FormSection
            title="Travel Information"
            active={!!openSections["travel-info"]}
            onClick={() => toggleSection("travel-info")}
        >
            <div className="space-y-4">
                <Field
                    label="Visa Description"
                    value={draft.data.travelInfo.visa.description}
                    multiline
                    onChange={(value) =>
                        updateField("data.travelInfo.visa.description", value)
                    }
                />

                <Field
                    label="Currency"
                    value={draft.data.travelInfo.currency.majorCurrency}
                    onChange={(value) =>
                        updateField("data.travelInfo.currency.majorCurrency", value)
                    }
                />

                <Field
                    label="Currency Description"
                    value={draft.data.travelInfo.currency.description}
                    multiline
                    onChange={(value) =>
                        updateField("data.travelInfo.currency.description", value)
                    }
                />

                <Field
                    label="General Best Time"
                    value={draft.data.travelInfo.bestTimeToVisit.general}
                    onChange={(value) =>
                        updateField("data.travelInfo.bestTimeToVisit.general", value)
                    }
                />

                <Field
                    label="Summer"
                    value={draft.data.travelInfo.bestTimeToVisit.summer}
                    onChange={(value) =>
                        updateField("data.travelInfo.bestTimeToVisit.summer", value)
                    }
                />

                <Field
                    label="Winter"
                    value={draft.data.travelInfo.bestTimeToVisit.winter}
                    onChange={(value) =>
                        updateField("data.travelInfo.bestTimeToVisit.winter", value)
                    }
                />

                <ArrayField
                    label="Transportation"
                    values={draft.data.travelInfo.popularTransportation}
                    onChange={(values) =>
                        updateField("data.travelInfo.popularTransportation", values)
                    }
                />
            </div>
        </FormSection>
    )
}
