/* =====================================================
   SEO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ArrayField, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type SeoFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function SeoForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: SeoFormProps) {

    return (
                <FormSection
                    title="SEO"
                    active={
                        !!openSections["seo"]
                    }
                    onClick={() =>
                        toggleSection(
                            "seo"
                        )
                    }
                >
                    <div className="space-y-4">
                        <Field
                            label="SEO Title"
                            value={
                                draft.metadata
                                    .seo
                                    .title
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "metadata.seo.title",
                                    value
                                )
                            }
                        />

                        <Field
                            label="SEO Description"
                            value={
                                draft.metadata
                                    .seo
                                    .description
                            }
                            multiline
                            rows={5}
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "metadata.seo.description",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Canonical URL"
                            value={
                                draft.metadata
                                    .seo
                                    .canonicalUrl
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "metadata.seo.canonicalUrl",
                                    value
                                )
                            }
                        />

                        <ArrayField
                            label="Keywords"
                            values={
                                draft.metadata
                                    .seo
                                    .keywords
                            }
                            onChange={(
                                values
                            ) =>
                                updateField(
                                    "metadata.seo.keywords",
                                    values
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
