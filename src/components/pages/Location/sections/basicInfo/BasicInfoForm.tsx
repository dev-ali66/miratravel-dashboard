/* =====================================================
   BASICINFO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, SelectField, FormSection } from "../../shared/fields"
import { ParentLocationSelect } from "../../shared/ParentLocationSelect"
import { LOCATION_TYPES } from "../../locationTypes"
import type { LocationData } from "../../locationTypes"

export type BasicInfoFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function BasicInfoForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: BasicInfoFormProps) {

    return (
                <FormSection
                    title="Basic Information"
                    active={
                        !!openSections["basic"]
                    }
                    onClick={() =>
                        toggleSection(
                            "basic"
                        )
                    }
                >
                    <div className="space-y-4">
                        <Field
                            label="Location Name"
                            value={
                                draft.name
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "name",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Slug"
                            value={
                                draft.slug
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "slug",
                                    value
                                )
                            }
                        />

                        <SelectField
                            label="Type"
                            value={
                                draft.type
                            }
                            options={[
                                ...LOCATION_TYPES,
                            ]}
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "type",
                                    value
                                )
                            }
                        />

                        <ParentLocationSelect
                            value={draft.parentId ?? null}
                            currentName={draft.parent?.name}
                            excludeId={draft.id}
                            onChange={(id) =>
                                updateField(
                                    "parentId",
                                    id
                                )
                            }
                        />

                        <Field
                            label="Page Name"
                            value={
                                draft.data
                                    .name
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.name",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Title"
                            value={
                                draft.data
                                    .title
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.title",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Subtitle"
                            value={
                                draft.data
                                    .subtitle
                            }
                            multiline
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.subtitle",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Short Description"
                            value={
                                draft.data
                                    .shortDescription
                            }
                            multiline
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.shortDescription",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Description"
                            value={
                                draft.data
                                    .description
                            }
                            multiline
                            rows={6}
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.description",
                                    value
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
