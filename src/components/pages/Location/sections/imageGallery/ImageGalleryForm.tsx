/* =====================================================
   IMAGEGALLERY — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ImageField, FormSection } from "../../shared/fields"
import { Plus, Trash2 } from "lucide-react"
import type { LocationData, GalleryItem } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type ImageGalleryFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function ImageGalleryForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: ImageGalleryFormProps) {
    const updateGallery = (
        index: number,
        field: keyof GalleryItem,
        value: string
    ) =>
        updateArrayItem(
            draft.data.imageGalary,
            index,
            field,
            value,
            (next) => updateField("data.imageGalary", next)
        )

    return (
        <FormSection
            title="Image Gallery"
            active={!!openSections["image-gallery"]}
            onClick={() => toggleSection("image-gallery")}
        >
            <div className="space-y-4">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            const gallery = [
                                ...draft.data.imageGalary,
                                {
                                    alt: "",
                                    url: "",
                                },
                            ]

                            updateField("data.imageGalary", gallery)
                        }}
                        className="flex items-center gap-1 text-xs text-primary"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Image
                    </button>
                </div>

                {draft.data.imageGalary.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-border/60 p-4"
                    >
                        <div className="flex gap-2">
                            <div className="flex-1 space-y-4">
                                <ImageField
                                    label="Image URL"
                                    value={item.url}
                                    onChange={(value) =>
                                        updateGallery(index, "url", value)
                                    }
                                />

                                <Field
                                    label="Alt"
                                    value={item.alt}
                                    onChange={(value) =>
                                        updateGallery(index, "alt", value)
                                    }
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    updateField(
                                        "data.imageGalary",
                                        draft.data.imageGalary.filter(
                                            (_, i) => i !== index
                                        )
                                    )
                                }
                                className="mt-6 h-9 rounded-lg border border-border/60 px-2 text-destructive"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </FormSection>
    )
}
