/* =====================================================
   PRACTICALINFORMATION — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ImageField, FormSection } from "../../shared/fields"
import { Plus, Trash2 } from "lucide-react"
import type { LocationData, PracticalItem } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type PracticalInformationFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function PracticalInformationForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: PracticalInformationFormProps) {

    const updatePractical = (
        index: number,
        field: keyof PracticalItem,
        value: string | boolean
    ) =>
        updateArrayItem(
            draft.data.practical_information.accordion_items,
            index,
            field,
            value,
            (next) => updateField("data.practical_information.accordion_items", next)
        )

    return (
                <FormSection
                    title="Practical Information"
                    active={
                        !!openSections["practical-information"]
                    }
                    onClick={() =>
                        toggleSection(
                            "practical-information"
                        )
                    }
                >
                    <div className="space-y-5">
                        <Field
                            label="Title"
                            value={
                                draft.data
                                    .practical_information
                                    .title
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.practical_information.title",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Sub Heading"
                            value={
                                draft.data
                                    .practical_information
                                    .sub_heading
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.practical_information.sub_heading",
                                    value
                                )
                            }
                        />

                        <ImageField
                            label="Side Image"
                            value={
                                draft.data
                                    .practical_information
                                    .side_image
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.practical_information.side_image",
                                    value
                                )
                            }
                        />

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">
                                    Accordion Items
                                </h4>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const items =
                                            [
                                                ...draft
                                                    .data
                                                    .practical_information
                                                    .accordion_items,
                                                {
                                                    id: String(
                                                        Date.now()
                                                    ),
                                                    title: "",
                                                    content:
                                                        "",
                                                    is_expanded:
                                                        false,
                                                },
                                            ]

                                        updateField(
                                            "data.practical_information.accordion_items",
                                            items
                                        )
                                    }}
                                    className="flex items-center gap-1 text-xs text-primary"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add
                                </button>
                            </div>

                            {draft.data.practical_information.accordion_items.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={
                                            item.id
                                        }
                                        className="rounded-xl border border-border/60 p-4"
                                    >
                                        <div className="mb-3 flex justify-between">
                                            <span className="text-xs font-semibold">
                                                Item{" "}
                                                {index +
                                                    1}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateField(
                                                        "data.practical_information.accordion_items",
                                                        draft
                                                            .data
                                                            .practical_information
                                                            .accordion_items.filter(
                                                                (
                                                                    _,
                                                                    i
                                                                ) =>
                                                                    i !==
                                                                    index
                                                            )
                                                    )
                                                }
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <Field
                                                label="Title"
                                                value={
                                                    item.title
                                                }
                                                onChange={(
                                                    value
                                                ) =>
                                                    updatePractical(
                                                        index,
                                                        "title",
                                                        value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="Content"
                                                value={
                                                    item.content
                                                }
                                                multiline
                                                onChange={(
                                                    value
                                                ) =>
                                                    updatePractical(
                                                        index,
                                                        "content",
                                                        value
                                                    )
                                                }
                                            />

                                            <label className="flex items-center gap-2 text-xs">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        item.is_expanded
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updatePractical(
                                                            index,
                                                            "is_expanded",
                                                            e
                                                                .target
                                                                .checked
                                                        )
                                                    }
                                                />

                                                Expanded by default
                                            </label>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </FormSection>
    )
}
