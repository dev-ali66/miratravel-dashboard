/* =====================================================
   CARD — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ImageField, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type CardFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function CardForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: CardFormProps) {
    return (
        <FormSection
            title="Card"
            active={!!openSections["card"]}
            onClick={() => toggleSection("card")}
        >
            <div className="space-y-4">
                <Field
                    label="Title"
                    value={draft.data.card.title}
                    onChange={(value) =>
                        updateField("data.card.title", value)
                    }
                />

                <Field
                    label="Subtitle"
                    value={draft.data.card.subtitle}
                    multiline
                    onChange={(value) =>
                        updateField("data.card.subtitle", value)
                    }
                />

                <ImageField
                    label="Background Image"
                    value={draft.data.card.background_image}
                    onChange={(value) =>
                        updateField("data.card.background_image", value)
                    }
                />

                <Field
                    label="Button Label"
                    value={draft.data.card.button.label}
                    onChange={(value) =>
                        updateField("data.card.button.label", value)
                    }
                />

                <Field
                    label="Button URL"
                    value={draft.data.card.button.url}
                    onChange={(value) =>
                        updateField("data.card.button.url", value)
                    }
                />
            </div>
        </FormSection>
    )
}
