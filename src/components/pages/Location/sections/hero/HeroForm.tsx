/* =====================================================
   HERO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import {
    Field,
    ImageField,
    FormSection,
    VideoField,
} from "../../shared/fields"
import type { LocationData } from "../../locationTypes"

export type HeroFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function HeroForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: HeroFormProps) {
    return (
        <FormSection
            title="Hero"
            active={!!openSections["hero"]}
            onClick={() => toggleSection("hero")}
        >
            <div className="space-y-4">
                <Field
                    label="Hero Title"
                    value={draft.data.hero.title}
                    onChange={(value) =>
                        updateField("data.hero.title", value)
                    }
                />

                <Field
                    label="Breadcrumb"
                    value={draft.data.hero.breadcrumb}
                    onChange={(value) =>
                        updateField("data.hero.breadcrumb", value)
                    }
                />

                <Field
                    label="Description"
                    value={draft.data.hero.description}
                    multiline
                    onChange={(value) =>
                        updateField("data.hero.description", value)
                    }
                />

                <ImageField
                    label="Background Image"
                    value={draft.data.hero.background_image}
                    onChange={(value) =>
                        updateField("data.hero.background_image", value)
                    }
                />

                <VideoField
                    label="Video"
                    value={draft.data.hero.video ?? ""}
                    onChange={(value) =>
                        updateField("data.hero.video", value)
                    }
                />

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={draft.data.hero.showVideo ?? false}
                        onChange={(event) =>
                            updateField(
                                "data.hero.showVideo",
                                event.target.checked
                            )
                        }
                    />
                    Show Video
                </label>

                <Field
                    label="Button Name"
                    value={draft.data.hero.button.name}
                    onChange={(value) =>
                        updateField("data.hero.button.name", value)
                    }
                />

                <Field
                    label="Button URL"
                    value={draft.data.hero.button.url}
                    onChange={(value) =>
                        updateField("data.hero.button.url", value)
                    }
                />
            </div>
        </FormSection>
    )
}
