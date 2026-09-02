/* =====================================================
   VIDEOGALLERY — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ImageField, VideoField, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type VideoGalleryFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function VideoGalleryForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: VideoGalleryFormProps) {

    return (
                <FormSection
                    title="Video Gallery"
                    active={
                        !!openSections["video-gallery"]
                    }
                    onClick={() =>
                        toggleSection(
                            "video-gallery"
                        )
                    }
                >
                    <div className="space-y-4">
                        <Field
                            label="Alt"
                            value={
                                draft.data
                                    .videoGalary
                                    .alt
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.videoGalary.alt",
                                    value
                                )
                            }
                        />

                        <VideoField
                            label="Video URL"
                            value={
                                draft.data
                                    .videoGalary
                                    .url
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.videoGalary.url",
                                    value
                                )
                            }
                        />

                        <ImageField
                            label="Thumbnail"
                            value={
                                draft.data
                                    .videoGalary
                                    .thumbnail
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.videoGalary.thumbnail",
                                    value
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
